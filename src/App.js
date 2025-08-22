import logo from './koffeeos-logo.svg';
import './App.css';
import { useState } from 'react';
import { AiOutlineMenu } from 'react-icons/ai';
import Inventory from './components/Inventory';
import AccountSettings from './components/AccountSettings';
import Dashboard from './components/Dashboard';
import Billing from './components/Billing';
import SideMenu from './components/SideMenu';
import Coffee from './components/Coffee';
import Projections from './components/Projections';
import coffeeData from './models/coffeeData';

function App() {
  const [view, setView] = useState('inventory');
  const [menuOpen, setMenuOpen] = useState(false);
  const [coffees, setCoffees] = useState(coffeeData);
  const [bags, setBags] = useState([]);

  const renderView = () => {
    switch (view) {
      case 'coffee':
        return <Coffee coffees={coffees} setCoffees={setCoffees} />;
      case 'dashboard':
        return <Dashboard />;
      case 'billing':
        return <Billing />;
      case 'settings':
        return <AccountSettings />;
      case 'projections':
        return <Projections bags={bags} />;
      case 'inventory':
      default:
        return (
          <Inventory
            coffees={coffees}
            setCoffees={setCoffees}
            bags={bags}
            setBags={setBags}
          />
        );
    }
  };

  return (
    <div className="App min-h-screen flex relative">
      <SideMenu
        current={view}
        onChange={(v) => {
          setView(v);
          setMenuOpen(false);
        }}
        className={`fixed sm:static z-10 transform transition-transform ${menuOpen ? 'translate-x-0' : '-translate-x-full'} sm:translate-x-0`}
      />
      <div className="flex-1 flex flex-col items-center p-4">
        <button
          className="sm:hidden mb-2 self-start"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <AiOutlineMenu className="w-6 h-6" />
        </button>
        <header className={`w-full ${view === 'coffee' ? '' : 'max-w-4xl'} text-center`}>
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
