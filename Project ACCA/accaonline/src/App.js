import React ,{useState , useEffect} from 'react';
import firebase from "firebase"
import headerLogo from './img/acca2.svg'
import './App.css';
import SignIn from './signIn';
import { auth } from './firebase'
import { db } from './firebase'

function App() {
  const [userToken, setUserToken] = useState(null)
  const [user, setUser] = useState(null)
  const [userDisplayname, setUserDisplayname] = useState("")
  const [email, setemail] = useState("")
  const [loginState, setLoginState] = useState(false)
  const signIn = (event)=>{
    var provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider).then((result)=>{
      // This gives you a Google Access Token. You can use it to access the Google API.
      setUserToken(result.credential.accessToken);
      // The signed-in user info.
      setUser(result.user);
      
      //result.user.uid
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

  const signOut = (event)=>{
    auth.signOut().then(()=>{

    }).catch((error)=>{
      console.log(error.message);
    });
  }

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((authUser) => {
      if(authUser){
        //userLogged in
        setLoginState(true)
        setUser(authUser.currentUser)
        console.log("Logged in as:" + auth.currentUser.displayName);
        setUserDisplayname(auth.currentUser.displayName);
        setemail(auth.currentUser.email);
        document.getElementById('signInPage').style.display = 'none';
        document.getElementById('header').className = 'App-Content-LoggedIn';
      }
      else{
        //User logged out
        setLoginState(false)
        setUser(null)
        document.getElementById('signInPage').style.display = 'block';
        document.getElementById('header').className = 'App-Content';
      }
    })
    return ()=>{
      unsub();
    }
  }, [user])

  return (
    <div id="header" className="App">
      <header className="App-Content">
        <div className="App-Header">
          <img className="headerImage" src={headerLogo} alt="Logo"/>
          <img className="userImage"/>
        </div>
        <div id="loggedInContainer">
          <div className="App_SideBar"> 
              Hello 
            </div> 
          <div className="App_ChatList"> 
              <div className="userProfileList">
                <div className="profileImage">
                  {userDisplayname.slice(0,1)}
                </div>
                <div className="profileContent">
                <b>{userDisplayname}</b><br></br>
                  <i>{email}</i>
                </div>
                <div className="profileOptions">
                  <button onClick={signOut}>Logout</button>
                </div>
              </div>
              <div className= "userList">

              </div>
          </div> 
          <div className="App_ChatBox"> 
              Hello 
          </div> 
        </div>
        <SignIn signInHandler={signIn}/>
      </header>
      <footer className="App-Footer">
        A Common Chat Application. No Fuss, No Muss.
      </footer>
    </div>
  );
}

export default App;
