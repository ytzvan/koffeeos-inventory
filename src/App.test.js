import { render, screen } from '@testing-library/react';
import App from './App';

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
  const headerElement = screen.getByText(/Green Coffee/i);
  expect(headerElement).toBeInTheDocument();
});

test('renders operations section', () => {
  render(<App />);
  const operationsHeader = screen.getByText(/Operations/i);
  expect(operationsHeader).toBeInTheDocument();
});

test('renders current quantity column', () => {
  render(<App />);
  const columnHeader = screen.getByText(/Current Qty/i);
  expect(columnHeader).toBeInTheDocument();
});
