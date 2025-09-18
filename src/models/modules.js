import {
  FaBox,
  FaChartBar,
  FaChartLine,
  FaCoffee,
  FaCog,
  FaFileInvoiceDollar,
  FaTools,
  FaLeaf,
  FaHandshake,
  FaCashRegister,
  FaShoppingCart,
  FaUser,
  FaSeedling,
} from 'react-icons/fa';

const CORE = 'KoffeeOS Core';
const FINCA = 'KoffeeOS Finca';

const modules = [
  { key: 'dashboard', name: 'Dashboard', icon: FaChartLine, enabled: true, group: CORE },
  { key: 'greenCoffee', name: 'Green Coffee', icon: FaLeaf, enabled: true, group: CORE },
  { key: 'roastedCoffee', name: 'Roasted Coffee', icon: FaCoffee, enabled: true, group: CORE },
  { key: 'inventory', name: 'Inventory', icon: FaBox, enabled: true, group: CORE },
  { key: 'projections', name: 'Projections', icon: FaChartBar, enabled: true, group: CORE },
  { key: 'pos', name: 'POS', icon: FaCashRegister, enabled: true, group: CORE },
  { key: 'sales', name: 'Sales', icon: FaShoppingCart, enabled: true, group: CORE },
  { key: 'customers', name: 'Customers', icon: FaUser, enabled: true, group: CORE },
  { key: 'providers', name: 'Providers', icon: FaHandshake, enabled: true, group: CORE },
  { key: 'settings', name: 'Settings', icon: FaCog, enabled: true, group: CORE },
  { key: 'billing', name: 'Billing', icon: FaFileInvoiceDollar, enabled: true, group: CORE },
  { key: 'finca', name: 'Finca', icon: FaSeedling, enabled: true, group: FINCA },
  { key: 'management', name: 'Management', icon: FaTools, enabled: true, group: CORE },
];

export default modules;
