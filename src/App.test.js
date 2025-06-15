import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Visit Us link', () => {
  render(<App />);
  const linkElement = screen.getByText(/visit us/i);
  expect(linkElement).toBeInTheDocument();
});

test('renders greeting message', () => {
  render(<App />);
  const greetingElement = screen.getByText(/Hola Mundo desde Pulpa Coffee Co./i);
  expect(greetingElement).toBeInTheDocument();
});
