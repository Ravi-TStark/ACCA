import React ,{useState , useEffect} from 'react';
import firebase from "firebase"
import headerLogo from './img/acca2.svg'
import './App.css';
import SignIn from './signIn';
import UserListItem from './userListItem';
import { auth } from './firebase'
import { db } from './firebase'
import Message from './message';

function App() {
  const [users, setUsers] = useState([])
  const [peers, setPeers] = useState([])
  const [messages, setMessages] = useState([])
  const [user, setUser] = useState(null)
  const [userDisplayname, setUserDisplayname] = useState("")
  const [email, setemail] = useState("")
  const [loginState, setLoginState] = useState(false)
  const [loadingAuth, setLoadingAuth] = useState(true)
  var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  
  const signIn = (event)=>{
    var provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider).then((result)=>{
      // This gives you a Google Access Token. You can use it to access the Google API.
      // The signed-in user info.
      setUser(result.user);
      setemail(result.user.email);
      setLoginState(true)
      //result.user.uid
    }).catch(function(error) {
      /*Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
      */ 
    });
  }

  const signOut = (event)=>{
    auth.signOut().then(()=>{
      setLoginState(false)
    }).catch((error)=>{
      //console.log(error.message);
    });
  }

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((authUser) => {
      document.getElementById('signInContainer').style.display = 'none';
      document.getElementById('header').className = 'App-Content';
      if(authUser){
        //userLogged in
        setLoginState(true)
        setUser(authUser)
        setUserDisplayname(auth.currentUser.displayName);
        setemail(auth.currentUser.email);
        document.getElementById('signInContainer').style.display = 'none';
        document.getElementById('header').className = 'App-Content-LoggedIn';
      }
      else{
        //User logged out
        setLoginState(false)
        setUser(null)
        setemail("")
        document.getElementById('signInContainer').style.display = 'block';
        document.getElementById('header').className = 'App-Content';
      }
      setLoadingAuth(false)
    })
    return ()=>{
      unsub();
    }
  }, [])

  useEffect(() => {
    if(loadingAuth){
        document.getElementById('signingInContainer').style.display = 'block'
    }
    else{
      document.getElementById('signingInContainer').style.display = 'none'
    }
  }, [loadingAuth])

  useEffect(()=>{
    db.collection('users').onSnapshot(snapshot => {
      setUsers(snapshot.docs.map(doc => ({
          id:doc.id,
          user: doc.data()
      })))
    })
    if(email !== ""){
      const usersRef = db.collection('users').doc(email)
      const peersRef = db.collection('users').doc(email).collection('peers')

      usersRef.get()
        .then((docSnapshot) => {
          if (docSnapshot.exists) {
            usersRef.onSnapshot((doc) => {
              peersRef.onSnapshot(snapshot => {
                setPeers(snapshot.docs.map(docu => ({
                  id: docu.id,
                  peer: docu.data()
                })))
              })
            });
          } else {
            usersRef.set({
              id: email,
              DisplayName: userDisplayname,
              peers: []
            }) // create the document
          }
      });
    }
    
  }, [users, email]);

  const isPeer = (peerID) => {
    const out = peers.find(peer => peer.id === peerID)
    return (out? true :false)
  }

  const addPeer = function(peerID){
    db.collection('users').doc(email).collection('peers').doc(peerID).set({
        id: peerID,
        displayName: db.collection('users').doc(peerID).DisplayName,
    })
    db.collection('users').doc(email).collection('peers').doc(peerID).collection('messages').set({
      
    })
  }

  const openPeer = (peerID) => {
    if(peers){
      db.collection('users').doc(email).collection('peers').doc(peerID).collection('messages').onSnapshot((snapshot)=>{
        setMessages(snapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data()
        })))
      })
      
    }  
  };

  const datesAreOnSameDay = (first, second) =>
    first.getFullYear() === second.getFullYear() &&
    first.getMonth() === second.getMonth() &&
    first.getDate() === second.getDate();

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
                <div className="listOptions">
                  <button className="listButtonActive">
                    Chats
                  </button>
                  <button className="buttonInactive">
                    Groups
                  </button>
                  <button className="buttonInactive">
                    Global
                  </button>
                </div>
                <div className="listContainer">
                {
                  users.map(({id, user}) => (id !== email && isPeer(id))
                    ? (
                    <UserListItem key={id} onClick={openPeer} id={user.id} displayName = {user.DisplayName}/>
                    ) : (
                    ""
                    )
                  )}
                </div>
                <div className="listSearchBox">
                  <input type="text" placeholder="Search for chats or groups."/>
                </div>
              </div>
          </div> 
          <div className="App_ChatBox">
            <div className="chatHeader">
                <div className="chatBoxProfileImage">
                  {userDisplayname.slice(0,1)}
                </div>
                <div className="chatBoxProfileContent">
                    <strong>{userDisplayname}</strong><br></br>
                    <i id="emailID">{email}</i>
                </div>
            </div>
            <div className="messageContainer">
              {
                messages.map(({id, data})=>{
                  return <Message key={id} recieved={data.recieved} content={data.content} timeStamp={datesAreOnSameDay(data.timeStamp.toDate(), new Date())? data.timeStamp.toDate().getHours().toString() + ":" + data.timeStamp.toDate().getMinutes().toString() + ", Today" : data.timeStamp.toDate().getHours().toString() + ":" + data.timeStamp.toDate().getMinutes().toString() + ", " + data.timeStamp.toDate().getDate().toString() + " " + months[data.timeStamp.toDate().getMonth()]}/>
                })
              }
            </div>
              <div className="chatBoxInput">
                <input type="text" placeholder="Type your message"/>
              </div>
          </div> 
        </div>
        <div id="signInContainer">
              <SignIn signInHandler={signIn}/>
              <footer className="App-Footer">
                  A Common Chat Application. No Fuss, No Muss.
              </footer>
        </div>
        <div id="signingInContainer">
              <div className="signingInBG">
                  <div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
              </div>
        </div>
      </header>
    </div>
  );
}

export default App;
