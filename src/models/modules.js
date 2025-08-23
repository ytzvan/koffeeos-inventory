import { FaBox, FaChartBar, FaChartLine, FaCoffee, FaCog, FaFileInvoiceDollar, FaTools, FaLeaf, FaHandshake } from 'react-icons/fa';

const modules = [
  { key: 'dashboard', name: 'Dashboard', icon: FaChartLine, enabled: true },
  { key: 'greenCoffee', name: 'Green Coffee', icon: FaLeaf, enabled: true },
  { key: 'roastedCoffee', name: 'Roasted Coffee', icon: FaCoffee, enabled: true },
  { key: 'inventory', name: 'Inventory', icon: FaBox, enabled: true },
  { key: 'projections', name: 'Projections', icon: FaChartBar, enabled: true },
  { key: 'providers', name: 'Providers', icon: FaHandshake, enabled: true },
  { key: 'settings', name: 'Settings', icon: FaCog, enabled: true },
  { key: 'billing', name: 'Billing', icon: FaFileInvoiceDollar, enabled: true },
  { key: 'management', name: 'Management', icon: FaTools, enabled: true },
];

export default modules;
