import React from 'react'
import './SignIn.css'

function SignIn(props) {
    return (
        <div className="signInContainer">
            <div className="signInContent">Chat with Anyone in the World, Anytime.</div>
            <div className="signInSubContent">No Sign Up. No worries. Just Login with your Google Account.</div>
            <button><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/1004px-Google_%22G%22_Logo.svg.png" alt="Google Logo"/> <span>Sign In With Google</span></button>
        </div>
    )
}

export default SignIn
