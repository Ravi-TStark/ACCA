import React from 'react'
import './userListItem.css'

function userListItem(props) {
    return (
        <div className="user-ListItem">
        <div className="user-ProfileImage">
          {props.displayName.slice(0,1)}
        </div>
            <div className="user-ListInfo">
                <strong>{props.displayName}</strong><br></br>
                <i>{props.id}</i>
            </div>
            <button><i>Add Peer</i></button>
        </div>
    )
}

export default userListItem