import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

jest.mock('react-icons/fa', () => {
  const NullIcon = () => null;
  return {
    FaBars: NullIcon,
    FaBox: NullIcon,
    FaCashRegister: NullIcon,
    FaChartBar: NullIcon,
    FaChartLine: NullIcon,
    FaCoffee: NullIcon,
    FaCog: NullIcon,
    FaFileInvoiceDollar: NullIcon,
    FaHandshake: NullIcon,
    FaLeaf: NullIcon,
    FaMoon: NullIcon,
    FaSeedling: NullIcon,
    FaShoppingCart: NullIcon,
    FaSun: NullIcon,
    FaTools: NullIcon,
    FaUser: NullIcon,
    FaUserCircle: NullIcon,
  };
}, { virtual: true });

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

test('prompts to select a company on load', () => {
  render(
    <AppProvider>
      <App />
    </AppProvider>
  );

  expect(screen.getByText(/Select a company/i)).toBeInTheDocument();
  expect(screen.getAllByText(/Pulpa Roasters/i).length).toBeGreaterThan(0);
  fireEvent.click(screen.getByRole('button', { name: /Confirm company/i }));
  expect(screen.queryByText(/Select a company/i)).not.toBeInTheDocument();
});

test('renders settings menu', () => {
  render(
    <AppProvider>
      <App />
    </AppProvider>
  );
  fireEvent.click(screen.getByRole('button', { name: /Confirm company/i }));
  const menuItem = screen.getByText(/Settings/i);
  expect(menuItem).toBeInTheDocument();
});

test('renders dashboard menu', () => {
  render(
    <AppProvider>
      <App />
    </AppProvider>
  );
  fireEvent.click(screen.getByRole('button', { name: /Confirm company/i }));
  const menuItem = screen.getAllByRole('button', { name: /Dashboard/i })[0];
  expect(menuItem).toBeInTheDocument();
});

test('renders billing menu', () => {
  render(
    <AppProvider>
      <App />
    </AppProvider>
  );
  fireEvent.click(screen.getByRole('button', { name: /Confirm company/i }));
  const menuItem = screen.getByText(/Billing/i);
  expect(menuItem).toBeInTheDocument();
});

test('renders green coffee menu', () => {
  render(
    <AppProvider>
      <App />
    </AppProvider>
  );
  fireEvent.click(screen.getByRole('button', { name: /Confirm company/i }));
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

test('renders customers menu', () => {
  render(
    <AppProvider>
      <App />
    </AppProvider>
  );
  const menuItem = screen.getByText(/Customers/i);
  expect(menuItem).toBeInTheDocument();
});

test('renders inventory section', () => {
  render(
    <AppProvider>
      <App />
    </AppProvider>
  );
  fireEvent.click(screen.getByRole('button', { name: /Confirm company/i }));
  fireEvent.click(screen.getByText(/Inventory/i));
  expect(screen.getByRole('heading', { name: /Green Coffee/i })).toBeInTheDocument();
});

test('renders roasted section', () => {
  render(
    <AppProvider>
      <App />
    </AppProvider>
  );
  fireEvent.click(screen.getByRole('button', { name: /Confirm company/i }));
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
  fireEvent.click(screen.getByRole('button', { name: /Confirm company/i }));
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

test('allows configuring dashboard KPIs', () => {
  window.HTMLCanvasElement.prototype.getContext = () => ({});
  window.Chart = jest.fn(() => ({ destroy: jest.fn() }));
  render(
    <AppProvider>
      <App />
    </AppProvider>
  );

  fireEvent.click(screen.getByRole('button', { name: /Confirm company/i }));
  fireEvent.click(screen.getByText(/Dashboard/i));
  fireEvent.click(screen.getByText(/Configure KPIs/i));
  expect(screen.getByText(/Choose dashboard KPIs/i)).toBeInTheDocument();
  fireEvent.click(screen.getByText(/Weekly Sales Trend/i));
  fireEvent.click(screen.getByRole('button', { name: /Save selection/i }));
  expect(screen.queryByText(/Total Sales by Week/i)).not.toBeInTheDocument();
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

test('processes finca lots into green coffee inventory', async () => {
  render(
    <AppProvider>
      <App />
    </AppProvider>
  );
  fireEvent.click(screen.getByRole('button', { name: /Confirm company/i }));

  fireEvent.click(screen.getByRole('button', { name: /Finca/i }));

  fireEvent.change(screen.getByLabelText(/Coffee Name/i), {
    target: { value: 'Finca Lot' },
  });
  fireEvent.change(screen.getByLabelText(/Process/i), {
    target: { value: 'Honey' },
  });
  fireEvent.change(screen.getByLabelText(/^Latas/i), {
    target: { value: '10' },
  });
  fireEvent.change(screen.getByLabelText(/Kg per Lata/i), {
    target: { value: '12' },
  });
  fireEvent.click(screen.getByRole('button', { name: /Add Lot/i }));

  expect(screen.getByText('Finca Lot')).toBeInTheDocument();

  const processButtons = screen.getAllByRole('button', { name: /Process/i });
  fireEvent.click(processButtons[0]);

  fireEvent.change(screen.getByLabelText(/^Sacks/i), {
    target: { value: '2' },
  });
  fireEvent.change(screen.getByLabelText(/Kg per Sack/i), {
    target: { value: '69' },
  });
  fireEvent.click(screen.getByRole('button', { name: /Confirm/i }));

  await waitFor(() => expect(screen.getAllByText(/Processed/i)[0]).toBeInTheDocument());

  fireEvent.click(screen.getAllByText(/Green Coffee/i)[0]);
  await waitFor(() => expect(screen.getByText('Finca Lot')).toBeInTheDocument());
  expect(screen.getByText('138')).toBeInTheDocument();
});
