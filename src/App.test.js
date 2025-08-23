import { fireEvent, render, screen } from '@testing-library/react';
import App from './App';
import Dashboard from './components/Dashboard';

test('renders Visit Us link', () => {
  render(<App />);
  const linkElement = screen.getByText(/visit us/i);
  expect(linkElement).toBeInTheDocument();
});

test('renders settings menu', () => {
  render(<App />);
  const menuItem = screen.getByText(/Settings/i);
  expect(menuItem).toBeInTheDocument();
});

test('renders dashboard menu', () => {
  render(<App />);
  const menuItem = screen.getByText(/Dashboard/i);
  expect(menuItem).toBeInTheDocument();
});

test('renders billing menu', () => {
  render(<App />);
  const menuItem = screen.getByText(/Billing/i);
  expect(menuItem).toBeInTheDocument();
});

test('renders inventory section', () => {
  render(<App />);
  fireEvent.click(screen.getByText(/Inventory/i));
  expect(screen.getByRole('heading', { name: /Green Coffee/i })).toBeInTheDocument();
});

test('renders roasted section', () => {
  render(<App />);
  fireEvent.click(screen.getByText(/Inventory/i));
  expect(
    screen.getByRole('heading', { name: /Roasted Coffee/i })
  ).toBeInTheDocument();
});

test('renders quantity column', () => {
  render(<App />);
  fireEvent.click(screen.getByText(/Inventory/i));
  expect(screen.getAllByText(/Quantity/i)[0]).toBeInTheDocument();
});

test('renders dashboard charts headings', () => {
  window.HTMLCanvasElement.prototype.getContext = () => ({});
  window.Chart = jest.fn(() => ({ destroy: jest.fn() }));
  render(<Dashboard />);
  expect(screen.getByText(/Total Sales by Week/i)).toBeInTheDocument();
  expect(screen.getByText(/Sales by Product Type/i)).toBeInTheDocument();
});
