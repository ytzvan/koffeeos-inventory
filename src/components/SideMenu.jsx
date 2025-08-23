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
} from 'react-icons/fa';
import logo from '../koffeeos-logo.svg';

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
};

function SideMenu({ current, onChange, modules, className = '' }) {
  return (
    <nav className={`w-48 bg-dark-green text-white min-h-screen p-4 ${className}`}>
      <div className="mb-6 flex justify-center">
        <img src={logo} alt="logo" className="w-24" />
      </div>
      <ul className="space-y-2">
        {modules
          .filter((m) => m.enabled)
          .map((m) => {
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
    </nav>
  );
}

export default SideMenu;
