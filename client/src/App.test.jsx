import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

function renderApp() {
  return render(
    <BrowserRouter>
      <App />
    </BrowserRouter>,
  );
}

describe('App', () => {
  it('renders the Neuracare heading', () => {
    renderApp();

    expect(screen.getByRole('heading', { name: /neuracare/i })).toBeInTheDocument();
  });
});
