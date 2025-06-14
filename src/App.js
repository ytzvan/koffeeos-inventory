import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Hola Mundo desde Pulpa Coffee Co.
        </p>
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
