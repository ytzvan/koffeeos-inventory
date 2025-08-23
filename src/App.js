import './App.css';
import { useEffect, useState } from 'react';
import { AiOutlineMenu } from 'react-icons/ai';
import { FaUserCircle, FaMoon, FaSun } from 'react-icons/fa';
import Inventory from './components/Inventory';
import AccountSettings from './components/AccountSettings';
import Dashboard from './components/Dashboard';
import Billing from './components/Billing';
import SideMenu from './components/SideMenu';
import Coffee from './components/Coffee';
import Projections from './components/Projections';
import Management from './components/Management';
import coffeeData from './models/coffeeData';
import modulesData from './models/modules';

function App() {
  const [view, setView] = useState('coffee');
  const [menuOpen, setMenuOpen] = useState(false);
  const [coffees, setCoffees] = useState(coffeeData);
  const [bags, setBags] = useState([]);
  const [modules, setModules] = useState(modulesData);
  const [darkMode, setDarkMode] = useState(false);
  const [userMenu, setUserMenu] = useState(false);

  useEffect(() => {
    const current = modules.find((m) => m.key === view);
    if (!current || !current.enabled) {
      const first = modules.find((m) => m.enabled);
      if (first) setView(first.key);
    }
  }, [modules, view]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

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
        return (
          <Inventory
            coffees={coffees}
            setCoffees={setCoffees}
            bags={bags}
            setBags={setBags}
          />
        );
      case 'management':
        return <Management modules={modules} setModules={setModules} />;
      default:
        return <Coffee coffees={coffees} setCoffees={setCoffees} />;
    }
  };

  return (
    <div className="App min-h-screen flex relative bg-white dark:bg-gray-900 dark:text-white">
      <SideMenu
        current={view}
        modules={modules}
        onChange={(v) => {
          setView(v);
          setMenuOpen(false);
        }}
        className={`fixed sm:static z-10 transform transition-transform ${menuOpen ? 'translate-x-0' : '-translate-x-full'} sm:translate-x-0`}
      />
      <div className="flex-1 flex flex-col p-4">
        <button
          className="sm:hidden mb-2 self-start"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <AiOutlineMenu className="w-6 h-6" />
        </button>
        <div className="flex justify-end items-center mb-4">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="mr-4"
            aria-label="toggle-dark-mode"
          >
            {darkMode ? <FaSun /> : <FaMoon />}
          </button>
          <div className="relative">
            <FaUserCircle
              className="w-6 h-6 cursor-pointer"
              onClick={() => setUserMenu(!userMenu)}
            />
            {userMenu && (
              <div className="absolute right-0 mt-2 bg-white dark:bg-gray-800 border rounded shadow">
                <button
                  onClick={() => {
                    setView('settings');
                    setUserMenu(false);
                  }}
                  className="block px-4 py-2 text-left w-full hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Profile
                </button>
              </div>
            )}
          </div>
        </div>
        <div className={`w-full ${view === 'coffee' || view === 'inventory' ? '' : 'max-w-4xl'} mx-auto text-center flex-1 flex flex-col items-center`}>
          {renderView()}
          <a
            className="text-sm underline text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 mt-4"
            href="https://pulpa.coffee"
            target="_blank"
            rel="noopener noreferrer"
          >
            Visit Us
          </a>
        </div>
      </div>
    </div>
  );
}

export default App;
