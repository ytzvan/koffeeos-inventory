import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Visit Us link', () => {
  render(<App />);
  const linkElement = screen.getByText(/visit us/i);
  expect(linkElement).toBeInTheDocument();
});

test('renders inventory section', () => {
  render(<App />);
  const headerElement = screen.getByText(/Green Coffee/i);
  expect(headerElement).toBeInTheDocument();
});

test('renders operations section', () => {
  render(<App />);
  const operationsHeader = screen.getByText(/Operations/i);
  expect(operationsHeader).toBeInTheDocument();
});
