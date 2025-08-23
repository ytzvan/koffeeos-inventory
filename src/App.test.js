import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import App from './App';
import Dashboard from './components/Dashboard';
import Projections from './components/Projections';
import { AppProvider } from './context/AppContext';

test('renders Visit Us link', () => {
  render(
    <AppProvider>
      <App />
    </AppProvider>
  );
  const linkElement = screen.getByText(/visit us/i);
  expect(linkElement).toBeInTheDocument();
});

test('renders settings menu', () => {
  render(
    <AppProvider>
      <App />
    </AppProvider>
  );
  const menuItem = screen.getByText(/Settings/i);
  expect(menuItem).toBeInTheDocument();
});

test('renders dashboard menu', () => {
  render(
    <AppProvider>
      <App />
    </AppProvider>
  );
  const menuItem = screen.getByText(/Dashboard/i);
  expect(menuItem).toBeInTheDocument();
});

test('renders billing menu', () => {
  render(
    <AppProvider>
      <App />
    </AppProvider>
  );
  const menuItem = screen.getByText(/Billing/i);
  expect(menuItem).toBeInTheDocument();
});

test('renders green coffee menu', () => {
  render(
    <AppProvider>
      <App />
    </AppProvider>
  );
  const items = screen.getAllByText(/Green Coffee/i);
  expect(items.length).toBeGreaterThan(0);
});

test('renders roasted coffee menu', () => {
  render(
    <AppProvider>
      <App />
    </AppProvider>
  );
  const menuItem = screen.getByText(/Roasted Coffee/i);
  expect(menuItem).toBeInTheDocument();
});

test('renders providers menu', () => {
  render(
    <AppProvider>
      <App />
    </AppProvider>
  );
  const menuItem = screen.getByText(/Providers/i);
  expect(menuItem).toBeInTheDocument();
});

test('renders inventory section', () => {
  render(
    <AppProvider>
      <App />
    </AppProvider>
  );
  fireEvent.click(screen.getByText(/Inventory/i));
  expect(screen.getByRole('heading', { name: /Green Coffee/i })).toBeInTheDocument();
});

test('renders roasted section', () => {
  render(
    <AppProvider>
      <App />
    </AppProvider>
  );
  fireEvent.click(screen.getByText(/Inventory/i));
  expect(
    screen.getByRole('heading', { name: /Roasted Coffee/i })
  ).toBeInTheDocument();
});

  test('renders quantity column', () => {
    render(
      <AppProvider>
        <App />
      </AppProvider>
    );
    fireEvent.click(screen.getByText(/Inventory/i));
    expect(screen.getAllByText(/Quantity/i)[0]).toBeInTheDocument();
  });

test('renders dashboard charts headings', () => {
  window.HTMLCanvasElement.prototype.getContext = () => ({});
  window.Chart = jest.fn(() => ({ destroy: jest.fn() }));
  render(
    <AppProvider>
      <Dashboard />
    </AppProvider>
  );
  expect(screen.getByText(/Total Sales by Week/i)).toBeInTheDocument();
  expect(screen.getByText(/Sales by Product Type/i)).toBeInTheDocument();
});

test('adds espresso projection', () => {
  const refills = [
    {
      coffee: { name: 'Test Coffee', purchasePrice: '20' },
      quantity: 1,
      unit: 'kg',
    },
  ];

  render(
    <AppProvider initialState={{ espressoRefills: refills }}>
      <Projections />
    </AppProvider>
  );
  fireEvent.change(screen.getByRole('combobox'), { target: { value: '0' } });
  fireEvent.change(screen.getByPlaceholderText(/Base Size/i), {
    target: { value: '18' },
  });
  fireEvent.change(screen.getByPlaceholderText(/Sale Price/i), {
    target: { value: '2' },
  });
  fireEvent.click(screen.getByText(/Add Projection/i));
  expect(screen.getByText('Test Coffee')).toBeInTheDocument();
  expect(screen.getByText('55')).toBeInTheDocument();
});

test('adds filter projection', () => {
  const refills = [
    {
      coffee: { name: 'Filter Coffee', purchasePrice: '15' },
      quantity: 1,
      unit: 'kg',
    },
  ];

  render(
    <AppProvider initialState={{ filterRefills: refills }}>
      <Projections />
    </AppProvider>
  );
  fireEvent.change(screen.getByRole('combobox'), { target: { value: '0' } });
  fireEvent.change(screen.getByPlaceholderText(/Base Size/i), {
    target: { value: '20' },
  });
  fireEvent.change(screen.getByPlaceholderText(/Sale Price/i), {
    target: { value: '3' },
  });
  fireEvent.click(screen.getByText(/Add Projection/i));
  expect(screen.getByText('Filter Coffee')).toBeInTheDocument();
  expect(screen.getByText('50')).toBeInTheDocument();
});
