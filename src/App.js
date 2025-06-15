import logo from './logo.svg';
import './App.css';
import Inventory from './components/Inventory';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <Inventory />
        <a
          className="App-link"
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
