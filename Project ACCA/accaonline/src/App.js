import React, { useState, useEffect } from 'react';
import firebase, { firestore } from "firebase"
import headerLogo from './img/acca2.svg'
import './App.css';
import SignIn from './signIn';
import UserListItem from './userListItem';
import { auth } from './firebase'
import { db } from './firebase'
import Message from './message';
import sendIcon from './img/send-Icon.svg'
import homeIcon from './img/homeIcon.png'
import searchIcon from './img/searchIcon.png'

function App() {
  const [users, setUsers] = useState([])
  const [peers, setPeers] = useState([])
  const [messages, setMessages] = useState([])
  const [pID, setPID] = useState('')
  const [pName, setPName] = useState('')
  const [user, setUser] = useState(null)
  const [userDisplayname, setUserDisplayname] = useState("")
  const [email, setemail] = useState("")
  const [loginState, setLoginState] = useState(false)
  const [loadingAuth, setLoadingAuth] = useState(true)
  var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

  const signIn = (event) => {
    var provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider).then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      // The signed-in user info.
      setUser(result.user);
      setemail(result.user.email);
      setLoginState(true)
      //result.user.uid
    }).catch(function (error) {
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

  const signOut = (event) => {
    auth.signOut().then(() => {
      setLoginState(false)
    }).catch((error) => {
      //console.log(error.message);
    });
  }

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((authUser) => {
      document.getElementById('signInContainer').style.display = 'none';
      document.getElementById('header').className = 'App-Content';
      if (authUser) {
        //userLogged in
        setLoginState(true)
        setUser(authUser)
        setUserDisplayname(auth.currentUser.displayName);
        setemail(auth.currentUser.email);
        document.getElementById('signInContainer').style.display = 'none';
        document.getElementById('header').className = 'App-Content-LoggedIn';
      }
      else {
        //User logged out
        setLoginState(false)
        setUser(null)
        setemail("")
        document.getElementById('signInContainer').style.display = 'block';
        document.getElementById('header').className = 'App-Content';

      }
      setLoadingAuth(false)
    })
    return () => {
      unsub();
    }
  }, [])

  useEffect(() => {
    if (loadingAuth) {
      document.getElementById('signingInContainer').style.display = 'block'
    }
    else {
      document.getElementById('signingInContainer').style.display = 'none'
    }
  }, [loadingAuth])

  useEffect(() => {
    db.collection('users').onSnapshot(snapshot => {
      setUsers(snapshot.docs.map(doc => ({
        id: doc.id,
        user: doc.data()
      })))
    })
    if (email !== "") {
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
            document.getElementsByClassName('listContainer_Loading')[0].style.display = 'none';
            document.getElementsByClassName('listContainer')[0].style.display = 'block';
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

  const sendMessage = async (cont) => {
    if (pID !== '') {
      var dtobj = new Date();
      var tStamp = new firestore.Timestamp(dtobj.getTime() / 1000, 0);
      const messageDB = db.collection('users').doc(email).collection('peers').doc(pID).collection('messages');
      const messageDB1 = db.collection('users').doc(pID).collection('peers').doc(email).collection('messages');

      await messageDB.doc(dtobj.getTime().toString() + (Math.random() * 10).toString()).set({
        recieved: false,
        content: cont,
        timeStamp: tStamp
      })

      updateMessagesScroll();

      await messageDB1.doc(dtobj.getTime().toString() + (Math.random() * 10).toString()).set({
        recieved: true,
        content: cont,
        timeStamp: tStamp
      })

      await db.collection('users').doc(email).collection('peers').doc(pID).collection('messages').onSnapshot((snapshot) => {
        setMessages(snapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data()
        })))
      })

    }

  }

  const isPeer = (peerID) => {
    const out = peers.find(peer => peer.id === peerID)
    return (out ? true : false)
  }

  const addPeer = function (peerID) {
    db.collection('users').doc(email).collection('peers').doc(peerID).set({
      id: peerID,
      displayName: db.collection('users').doc(peerID).DisplayName,
    })
    db.collection('users').doc(email).collection('peers').doc(peerID).collection('messages').set({

    })
  }

  const openPeer = (peerID, peerName, sender) => {
    if (peers) {
      setPID(peerID)
      setPName(peerName)
      document.getElementsByClassName('App_ChatBox_Def')[0].style.display = 'none';
      document.getElementsByClassName('App_ChatBox_Loading')[0].style.display = 'block';
      db.collection('users').doc(email).collection('peers').doc(peerID).collection('messages').onSnapshot((snapshot) => {
        setMessages(snapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data()
        })))
        document.getElementsByClassName('App_ChatBox_Loading')[0].style.display = 'none';
        document.getElementsByClassName('App_ChatBox')[0].style.display = 'block';
        updateMessagesScroll();
        const lst = document.getElementsByClassName('user-ListItem')
        for (var i = 0; i < lst.length; i++) {
          lst[i].className = 'user-ListItem';
        }
        document.getElementById('userListItem' + peerID).className = 'user-ListItem-Active'
      })
    }
  };

  const updateMessagesScroll = () => {
    var out = document.getElementById('messageOverflowContainer').children
    out[out.length - 1].scrollIntoView({
      behavior: "smooth",
      block: "end",
      inline: "nearest"
    });
  }

  const openMainPage = () => {
    document.getElementsByClassName('globalPage')[0].style.display = 'none';
    document.getElementsByClassName('mainPage')[0].style.display = 'block';
  }

  const openGlobalPage = () => {
    document.getElementsByClassName('mainPage')[0].style.display = 'none';
    document.getElementsByClassName('globalPage')[0].style.display = 'block';
  }

  const datesAreOnSameDay = (first, second) =>
    first.getFullYear() === second.getFullYear() &&
    first.getMonth() === second.getMonth() &&
    first.getDate() === second.getDate();

  return (
    <div id="header" className="App">
      <header className="App-Content">
        <div className="App-Header">
          <img className="headerImage" src={headerLogo} alt="Logo" />
        </div>
        <div id="loggedInContainer">
          <div className="App_SideBar">
            <div className="App-Page-List">
              <button className="sideButtonActive" onClick={openMainPage}>
                <img src={homeIcon} alt="Home" />
              </button>
              <button className="sideButtonInactive" onClick={openGlobalPage}>
                <img src={searchIcon} alt="Global" />
              </button>
            </div>
          </div>
          <div className="mainPage">
            <div className="App_ChatList">
              <div className="userProfileList">
                <div className="profileImage">
                  {userDisplayname.slice(0, 1)}
                </div>
                <div className="profileContent">
                  <b>{userDisplayname}</b><br></br>
                  <i>{email}</i>
                </div>
                <div className="profileOptions">
                  <button onClick={signOut}>Logout</button>
                </div>
              </div>
              <div className="userList">
                <div className="listOptions">
                  <button className="listButtonActive">
                    Chats
                  </button>
                  <button className="buttonInactive">
                    Groups
                  </button>
                </div>
                <div className="listContainer">
                  {
                    users.map(({ id, user }) => (id !== email && isPeer(id))
                      ? (
                        <UserListItem key={id} onClick={openPeer} id={user.id} displayName={user.DisplayName} isUserPeer={true} />
                      ) : (
                        ""
                      )
                    )}
                </div>
                <div className="listContainer_Loading">
                  <div className="loadingBG">
                    <div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
                  </div>
                </div>
                <div className="listSearchBox">
                  <input type="text" placeholder="Search for chats or groups." />
                </div>
              </div>
            </div>
            <div className="App_ChatBox_Def">
              <div className="App_ChatBox_Def_Text">
                Click on Any User and Start Chatting!
              </div>
            </div>
            <div className="App_ChatBox_Loading">
              <div className="loadingBG">
                <div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
              </div>
            </div>
            <div className="App_ChatBox">
              <div className="chatHeader">
                <div className="chatBoxProfileImage">
                  {pName.slice(0, 1)}
                </div>
                <div className="chatBoxProfileContent">
                  <strong>{pName}</strong><br></br>
                  <i>{pID}</i>
                </div>
              </div>
              <div className="messageOverflowContainer" id='messageOverflowContainer'>
                <div className="messageContainer">
                  {
                    messages.map(({ id, data }) => {
                      return <Message key={id} recieved={data.recieved} content={data.content} timeStamp={datesAreOnSameDay(data.timeStamp.toDate(), new Date()) ? data.timeStamp.toDate().getHours().toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false }) + ":" + data.timeStamp.toDate().getMinutes().toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false }) + ", Today" : data.timeStamp.toDate().getHours().toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false }) + ":" + data.timeStamp.toDate().getMinutes().toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false }) + ", " + data.timeStamp.toDate().getDate().toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false }) + " " + months[data.timeStamp.toDate().getMonth()]} />;
                    })
                  }
                </div>
              </div>
              <div className="chatBoxInput">
                <input id="chatBoxInputText" type="text" placeholder="Type your message" />
                <button className="chatBoxInputSendBtn" onClick={
                  (e) => {
                    if (document.getElementById('chatBoxInputText').value.toString().trim() !== '')
                      sendMessage(document.getElementById('chatBoxInputText').value)
                    document.getElementById('chatBoxInputText').value = ''
                  }
                }><img src={sendIcon} /></button>
              </div>
            </div>
          </div>
          <div className="globalPage">
            <div className='searchBarGlobal'>
              <input type='text' placeholder='Search for People here' />
              <button><img className='searchButton' src={searchIcon} /></button>
            </div>
            <div className='searchContainerGlobal'>
              <div className='searchHints'>
                <div className="grid-container">
                  <div className="gridCell00">
                    00
                  </div>
                  <div className="gridCell01">
                    01
                  </div>
                  <div className="gridCell02">
                    02
                  </div>
                  <div className="gridCell10">
                    10
                  </div>
                  <div className="gridCell11">
                    11
                  </div>
                  <div className="gridCell12">
                    12
                  </div>
                </div>
              </div>
              <div className='searchResults'>

              </div>
            </div>
          </div>
        </div>
        <div id="signInContainer">
          <SignIn signInHandler={signIn} />
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
