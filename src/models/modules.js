import { FaBox, FaChartBar, FaChartLine, FaCoffee, FaCog, FaFileInvoiceDollar, FaTools } from 'react-icons/fa';

const modules = [
  { key: 'coffee', name: 'Coffees', icon: FaCoffee, enabled: true },
  { key: 'inventory', name: 'Inventory', icon: FaBox, enabled: true },
  { key: 'dashboard', name: 'Dashboard', icon: FaChartLine, enabled: true },
  { key: 'projections', name: 'Projections', icon: FaChartBar, enabled: true },
  { key: 'settings', name: 'Settings', icon: FaCog, enabled: true },
  { key: 'billing', name: 'Billing', icon: FaFileInvoiceDollar, enabled: true },
  { key: 'management', name: 'Management', icon: FaTools, enabled: true },
];

export default modules;
