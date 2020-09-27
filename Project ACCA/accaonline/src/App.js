import React ,{useState , useEffect} from 'react';
import firebase from "firebase"
import headerLogo from './img/acca2.svg'
import './App.css';
import SignIn from './signIn';
import { auth } from './firebase'
import LoggedIn from './LoggedIn';

function App() {
  const [userToken, setUserToken] = useState(null)
  const [user, setUser] = useState(null)
  const [loginState, setLoginState] = useState(false)
  const signIn = (event)=>{
    var provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider).then((result)=>{
      // This gives you a Google Access Token. You can use it to access the Google API.
      setUserToken(result.credential.accessToken);
      // The signed-in user info.
      setUser(result.user);
    }).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
      // ...
    });
  }

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((authUser) => {
      if(authUser){
        //userLogged in
        setLoginState(true)
        setUser(authUser.currentUser)
        console.log("Logged in as:" + auth.currentUser.displayName);
        document.getElementById('signInPage').style.display = 'none';
        document.getElementById('signedInPage').style.display='flex';
      }
      else{
        //User logged out
        setLoginState(false)
        setUser(null)
        document.getElementById('signInPage').style.display = 'block';
        document.getElementById('signedInPage').style.display='none';
      }
    })
    return ()=>{
      unsub();
    }
  }, [user])

  return (
    <div className="App">
      <header className="App-Content">
        <div className="App-Header">
          <img className="headerImage" src={headerLogo} alt="Logo"/>
          <img className="userImage"/>
        </div>
        <div className="App_SideBar"> 
            Hello 
          </div> 
		  <div className="main_Container">
        <SignIn signInHandler={signIn}/>
        <LoggedIn />
          </div>
      </header>
      <footer className="App-Footer">
        A Common Chat Application. No Fuss, No Muss.
      </footer>
    </div>
  );
}

export default App;
