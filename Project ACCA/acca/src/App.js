import React from 'react';
import logo from './logo.svg';
import './App.css';
import SignIn from './SignIn';

function App() {
  return (
    <div className="App">
      <header className="App-Content">
        <div className="App-Header">
          ACCA
        </div>
        <SignIn />
      </header>
      <footer className="App-Footer">
        A Common Chat Application. No Fuss, No Muss.
      </footer>
    </div>
  );
}

export default App;
