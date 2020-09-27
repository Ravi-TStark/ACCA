import React from 'react'
import logoLarge from './img/acca0.png'
import './signIn.css'

function signIn(props) {
    return (
        <div id="signInPage" className="signInContainer">
            <div className="signInLeft">
            <div className="signInContent">Chat with Anyone in the World, Anytime.</div>
                <div className="signInSubContent">No Sign Up. No worries. Just Login with your Google Account.</div>
                <button onClick={props.signInHandler}><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/1004px-Google_%22G%22_Logo.svg.png" alt="Google Logo"/> <span>Sign In With Google</span></button>
            
            </div>
            <div className="signInRight">
            <img className="logoLarge" src={logoLarge} alt="ACCA Logo"/>
            </div>
                
        </div>
    )
}

export default signIn

