import React from 'react'
import './userListItem.css'

function userListItem(props) {
    return (
        <div className="user-ListItem" onClick={(e) => {props.onClick(props.id, props.displayName)}}>
            <div className="user-ProfileImage">
                {props.displayName.slice(0,1)}
            </div>
            <div className="user-ListInfo">
                <strong>{props.displayName}</strong><br></br>
                <i>{props.id}</i>
            </div>
            {
                !props.isUserPeer ? <button><i>Add Peer</i></button> : ""
            }
            
        </div>
    )
}

export default userListItem