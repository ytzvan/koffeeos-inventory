import React from 'react';

function SideMenu({ current, onChange }) {
  return (
    <nav className="w-48 bg-beige-dark min-h-screen p-4">
      <ul className="space-y-2">
        <li>
          <button
            onClick={() => onChange('inventory')}
            className={`block w-full text-left px-2 py-1 rounded ${current === 'inventory' ? 'bg-white' : ''}`}
          >
            Inventory
          </button>
        </li>
        <li>
          <button
            onClick={() => onChange('dashboard')}
            className={`block w-full text-left px-2 py-1 rounded ${current === 'dashboard' ? 'bg-white' : ''}`}
          >
            Dashboard
          </button>
        </li>
        <li>
          <button
            onClick={() => onChange('settings')}
            className={`block w-full text-left px-2 py-1 rounded ${current === 'settings' ? 'bg-white' : ''}`}
          >
            Settings
          </button>
        </li>
        <li>
          <button
            onClick={() => onChange('billing')}
            className={`block w-full text-left px-2 py-1 rounded ${current === 'billing' ? 'bg-white' : ''}`}
          >
            Billing
          </button>
        </li>
      </ul>
    </nav>
  );
}

export default SideMenu;
