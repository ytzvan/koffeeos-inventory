import { render, screen } from '@testing-library/react';
import App from './App';

test('renders visit link', () => {
  render(<App />);
  const linkElement = screen.getByText(/visit us/i);
  expect(linkElement).toBeInTheDocument();
});
