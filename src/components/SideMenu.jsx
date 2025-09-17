import React from 'react';
import {
  FaBox,
  FaChartLine,
  FaCog,
  FaFileInvoiceDollar,
  FaCoffee,
  FaChartBar,
  FaTools,
  FaLeaf,
  FaHandshake,
  FaCashRegister,
  FaShoppingCart,
  FaUser,
  FaSeedling,
} from 'react-icons/fa';
import logo from '../koffeeos-logo.svg';
import { useAppContext } from '../context/AppContext';

const icons = {
  greenCoffee: FaLeaf,
  roastedCoffee: FaCoffee,
  inventory: FaBox,
  dashboard: FaChartLine,
  projections: FaChartBar,
  providers: FaHandshake,
  settings: FaCog,
  billing: FaFileInvoiceDollar,
  management: FaTools,
  pos: FaCashRegister,
  sales: FaShoppingCart,
  customers: FaUser,
  finca: FaSeedling,
};

function SideMenu({ current, onChange, className = '' }) {
  const { modules } = useAppContext();
  const enabled = modules.filter((m) => m.enabled);
  const order = [];
  const grouped = enabled.reduce((acc, module) => {
    const group = module.group || 'KoffeeOS Core';
    if (!acc[group]) {
      acc[group] = [];
      order.push(group);
    }
    acc[group].push(module);
    return acc;
  }, {});

  return (
    <nav className={`w-48 bg-dark-green text-white min-h-screen p-4 ${className}`}>
      <div className="mb-6 flex justify-center">
        <img src={logo} alt="logo" className="w-24" />
      </div>
      <ul className="space-y-4">
        {order.map((group) => (
          <li key={group}>
            <p className="text-xs uppercase tracking-wide text-white/60 mb-1">
              {group}
            </p>
            <ul className="space-y-2">
              {grouped[group].map((m) => {
                const Icon = icons[m.key] || FaCoffee;
                return (
                  <li key={m.key}>
                    <button
                      onClick={() => onChange(m.key)}
                      className={`block w-full text-left px-2 py-1 rounded ${
                        current === m.key ? 'bg-white text-dark-green' : ''
                      }`}
                    >
                      <span className="inline-flex items-center gap-1">
                        <Icon /> <span>{m.name}</span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default SideMenu;
