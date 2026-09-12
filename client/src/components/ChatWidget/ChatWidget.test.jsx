import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import ChatWidget from './ChatWidget';

function renderWidget() {
  return render(
    <MemoryRouter>
      <ChatWidget />
    </MemoryRouter>,
  );
}

describe('ChatWidget', () => {
  it('is closed by default', () => {
    renderWidget();

    expect(screen.queryByText(/ai assistant/i)).not.toBeInTheDocument();
  });

  it('opens on click and shows the greeting', async () => {
    const user = userEvent.setup();
    renderWidget();

    await user.click(screen.getByRole('button', { name: /open chat/i }));

    expect(screen.getByText(/ai assistant/i)).toBeInTheDocument();
    expect(screen.getByText(/tell me your symptom/i)).toBeInTheDocument();
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

    expect(screen.queryByText(/ai assistant/i)).not.toBeInTheDocument();
  });
});
