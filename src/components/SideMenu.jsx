import React from 'react';
import { FaBox, FaChartLine, FaCog, FaFileInvoiceDollar } from 'react-icons/fa';

function SideMenu({ current, onChange, className = '' }) {
  return (
    <nav className={`w-48 bg-beige-dark min-h-screen p-4 ${className}`}>
      <ul className="space-y-2">
        <li>
          <button
            onClick={() => onChange('inventory')}
            className={`block w-full text-left px-2 py-1 rounded ${current === 'inventory' ? 'bg-white' : ''}`}
          >
            <span className="inline-flex items-center gap-1">
              <FaBox /> <span>Inventory</span>
            </span>
          </button>
        </li>
        <li>
          <button
            onClick={() => onChange('dashboard')}
            className={`block w-full text-left px-2 py-1 rounded ${current === 'dashboard' ? 'bg-white' : ''}`}
          >
            <span className="inline-flex items-center gap-1">
              <FaChartLine /> <span>Dashboard</span>
            </span>
          </button>
        </li>
        <li>
          <button
            onClick={() => onChange('settings')}
            className={`block w-full text-left px-2 py-1 rounded ${current === 'settings' ? 'bg-white' : ''}`}
          >
            <span className="inline-flex items-center gap-1">
              <FaCog /> <span>Settings</span>
            </span>
          </button>
        </li>
        <li>
          <button
            onClick={() => onChange('billing')}
            className={`block w-full text-left px-2 py-1 rounded ${current === 'billing' ? 'bg-white' : ''}`}
          >
            <span className="inline-flex items-center gap-1">
              <FaFileInvoiceDollar /> <span>Billing</span>
            </span>
          </button>
        </li>
      </ul>
    </nav>
  );
}

export default SideMenu;
