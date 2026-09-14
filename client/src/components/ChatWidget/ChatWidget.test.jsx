import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import ChatWidget from './ChatWidget';

function renderWidget() {
  return render(
    <MemoryRouter initialEntries={['/']}>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <p>Home page</p>
              <ChatWidget />
            </>
          }
        />
        <Route path="/find-doctors" element={<p>Find doctors page</p>} />
        <Route path="/symptom-checker" element={<p>Symptom checker page</p>} />
        <Route path="/my-bookings" element={<p>My bookings page</p>} />
        <Route path="/health-library" element={<p>Health library page</p>} />
        <Route path="/contact" element={<p>Contact page</p>} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('ChatWidget', () => {
  it('is closed by default', () => {
    renderWidget();

    expect(screen.queryByText(/neuracare assistant/i)).not.toBeInTheDocument();
  });

  it('opens on click and shows the greeting', async () => {
    const user = userEvent.setup();
    renderWidget();

    await user.click(screen.getByRole('button', { name: /open chat/i }));

    expect(screen.getByText(/neuracare assistant/i)).toBeInTheDocument();
    expect(screen.getByText(/hi! how can i help/i)).toBeInTheDocument();
  });

  it('discloses that it is a rule-based helper, not real AI', async () => {
    const user = userEvent.setup();
    renderWidget();

    await user.click(screen.getByRole('button', { name: /open chat/i }));

    expect(screen.getByText(/rule-based helper, not a real diagnosis/i)).toBeInTheDocument();
  });

  it('shows quick action buttons that navigate and close the panel', async () => {
    const user = userEvent.setup();
    renderWidget();

    await user.click(screen.getByRole('button', { name: /open chat/i }));
    await user.click(screen.getByRole('button', { name: 'Find a Doctor' }));

    expect(screen.getByText('Find doctors page')).toBeInTheDocument();
    expect(screen.queryByText(/neuracare assistant/i)).not.toBeInTheDocument();
  });

  it.each([
    ['Symptom Checker', 'Symptom checker page'],
    ['My Appointments', 'My bookings page'],
    ['Health Library', 'Health library page'],
    ['Contact Support', 'Contact page'],
  ])('quick action "%s" navigates to the right page', async (label, expectedText) => {
    const user = userEvent.setup();
    renderWidget();

    await user.click(screen.getByRole('button', { name: /open chat/i }));
    await user.click(screen.getByRole('button', { name: label }));

    expect(screen.getByText(expectedText)).toBeInTheDocument();
  });

  it('sends a quick reply and shows a matching bot response', async () => {
    const user = userEvent.setup();
    renderWidget();

    await user.click(screen.getByRole('button', { name: /open chat/i }));
    await user.click(screen.getByRole('button', { name: 'I have a headache' }));

    expect(screen.getAllByText('I have a headache')).toHaveLength(2);
    expect(screen.getByText(/migraine/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /book a doctor/i })).toHaveAttribute(
      'href',
      '/find-doctors',
    );
  });

  it('sends a typed message via the input', async () => {
    const user = userEvent.setup();
    renderWidget();

    await user.click(screen.getByRole('button', { name: /open chat/i }));
    await user.type(screen.getByLabelText(/ask a question/i), 'I have a rash{Enter}');

    expect(screen.getByText('I have a rash')).toBeInTheDocument();
    expect(screen.getByText(/skin condition/i)).toBeInTheDocument();
  });

  it('closes when the close button is clicked', async () => {
    const user = userEvent.setup();
    renderWidget();

    await user.click(screen.getByRole('button', { name: /open chat/i }));
    await user.click(screen.getByRole('button', { name: /close chat/i }));

    expect(screen.queryByText(/neuracare assistant/i)).not.toBeInTheDocument();
  });
});
