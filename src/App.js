import logo from './logo.svg';
import './App.css';
import Inventory from './components/Inventory';

function App() {
  return (
    <div className="App min-h-screen flex flex-col items-center p-4">
      <header className="w-full max-w-4xl text-center">
        <img src={logo} className="w-24 mx-auto mb-4" alt="logo" />
        <Inventory />
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
  );
}

export default App;
