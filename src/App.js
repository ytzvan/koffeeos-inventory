import logo from './logo.svg';
import './App.css';
import { useState } from 'react';
import Inventory from './components/Inventory';
import AccountSettings from './components/AccountSettings';
import Dashboard from './components/Dashboard';
import Billing from './components/Billing';
import SideMenu from './components/SideMenu';

function App() {
  const [view, setView] = useState('inventory');

  const renderView = () => {
    switch (view) {
      case 'dashboard':
        return <Dashboard />;
      case 'billing':
        return <Billing />;
      case 'settings':
        return <AccountSettings />;
      case 'inventory':
      default:
        return <Inventory />;
    }
  };

  return (
    <div className="App min-h-screen flex">
      <SideMenu current={view} onChange={setView} />
      <div className="flex-1 flex flex-col items-center p-4">
        <header className="w-full max-w-4xl text-center">
          <img src={logo} className="w-24 mx-auto mb-4" alt="logo" />
          {renderView()}
          <a
            className="text-sm underline text-gray-600 hover:text-gray-800"
            href="https://pulpa.coffee"
            target="_blank"
            rel="noopener noreferrer"
          >
            Visit Us
          </a>
        </header>
      </div>
    </div>
  );
}

export default App;
