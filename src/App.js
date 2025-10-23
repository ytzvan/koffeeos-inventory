import './App.css';
import { useEffect, useState } from 'react';
import { FaUserCircle, FaMoon, FaSun, FaBars } from 'react-icons/fa';
import Inventory from './components/Inventory';
import AccountSettings from './components/AccountSettings';
import Dashboard from './components/Dashboard';
import Billing from './components/Billing';
import SideMenu from './components/SideMenu';
import GreenCoffee from './components/GreenCoffee';
import RoastedCoffee from './components/RoastedCoffee';
import Projections from './components/Projections';
import Management from './components/Management';
import Providers from './components/Providers';
import POS from './components/POS';
import Sales from './components/Sales';
import Customers from './components/Customers';
import Finca from './components/Finca';
import { useAppContext } from './context/AppContext';
import CompanySelectorModal from './components/CompanySelectorModal';

function App() {
  const {
    modules,
    darkMode,
    setDarkMode,
    activeCompany,
  } = useAppContext();
  const [view, setView] = useState('greenCoffee');
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenu, setUserMenu] = useState(false);
  const [companyModalOpen, setCompanyModalOpen] = useState(true);

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

  useEffect(() => {
    if (!activeCompany) {
      setCompanyModalOpen(true);
    }
  }, [activeCompany]);

  const handleUpgrade = () => {
    setView('billing');
    setCompanyModalOpen(false);
    setUserMenu(false);
  };

  const renderView = () => {
    switch (view) {
      case 'greenCoffee':
        return <GreenCoffee />;
      case 'roastedCoffee':
        return <RoastedCoffee />;
      case 'dashboard':
        return <Dashboard />;
      case 'billing':
        return <Billing />;
      case 'settings':
        return <AccountSettings />;
      case 'projections':
        return <Projections />;
      case 'inventory':
        return <Inventory />;
      case 'providers':
        return <Providers />;
      case 'management':
        return <Management />;
      case 'pos':
        return <POS />;
      case 'sales':
        return <Sales />;
      case 'customers':
        return <Customers />;
      case 'finca':
        return <Finca />;
      default:
        return <GreenCoffee />;
    }
  };

  return (
    <div className="App min-h-screen flex relative bg-white dark:bg-gray-900 dark:text-white">
      <SideMenu
        current={view}
        onChange={(v) => {
          setView(v);
          setMenuOpen(false);
        }}
        className={`fixed sm:static z-20 transform transition-transform ${
          menuOpen ? 'translate-x-0' : '-translate-x-full'
        } sm:translate-x-0`}
      />
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 sm:hidden z-10"
          onClick={() => setMenuOpen(false)}
        ></div>
      )}
      <div className="flex-1 flex flex-col p-4 z-0">
        <button
          className="sm:hidden mb-2 self-start"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <FaBars className='w-6 h-6' />
        </button>
        <div className="mb-4 flex flex-col-reverse items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-left">
            <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Current company</p>
            <button
              type="button"
              onClick={() => setCompanyModalOpen(true)}
              className="mt-1 inline-flex items-center gap-2 text-base font-semibold text-dark-green transition hover:underline dark:text-white"
            >
              {activeCompany ? activeCompany.name : 'Select a company'}
            </button>
            {activeCompany?.location && (
              <p className="text-sm text-gray-500 dark:text-gray-300">{activeCompany.location}</p>
            )}
          </div>
          <div className="flex items-center gap-4 self-end sm:self-auto">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="rounded-full border border-gray-300 p-2 transition hover:border-dark-green dark:border-gray-700"
              aria-label="toggle-dark-mode"
            >
              {darkMode ? <FaSun /> : <FaMoon />}
            </button>
            <div className="relative">
              <FaUserCircle
                className="h-7 w-7 cursor-pointer"
                onClick={() => setUserMenu(!userMenu)}
              />
              {userMenu && (
                <div className="absolute right-0 mt-2 w-40 overflow-hidden rounded-md border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
                  <button
                    onClick={() => {
                      setView('settings');
                      setUserMenu(false);
                    }}
                    className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Profile
                  </button>
                  <button
                    onClick={() => {
                      setCompanyModalOpen(true);
                      setUserMenu(false);
                    }}
                    className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Switch company
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        <div
          className={`w-full ${
            view === 'greenCoffee' || view === 'roastedCoffee' || view === 'inventory'
              ? ''
              : 'max-w-4xl'
          } mx-auto text-center flex-1 flex flex-col items-center`}
        >
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
      <CompanySelectorModal
        open={companyModalOpen}
        onClose={() => setCompanyModalOpen(false)}
        onRequestUpgrade={handleUpgrade}
      />
    </div>
  );
}

export default App;
