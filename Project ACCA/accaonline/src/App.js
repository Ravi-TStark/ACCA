import React from 'react';
import headerLogo from './img/acca2.svg'
import './App.css';
import SignIn from './signIn';

function App() {
  
  const signIn = (event)=>{
    
  }

  return (
    <div className="App">
      <header className="App-Content">
        <div className="App-Header">
          <img className="headerImage" src={headerLogo} alt="Logo"/>
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
