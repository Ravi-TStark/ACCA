import React from 'react'
import './searchResultItem.css'

function searchResultItem(props) {
    return (
        <div className='searchResultContainer'>
            <div className="searchUser-ProfileImage">
                S
            </div>
            <div className="search-ListInfo">
                <strong>{props.displayName}</strong><br></br>
                <i>{props.id}</i>
            </div>
            {
                !props.isUserPeer ? <button className='addPeerBtn' onClick={props.onClick("ID")}>
                    +     
                </button> : 
                <div className='addPeerBtn'>✓</div>
            }
        </div>
    )
}

export default searchResultItem
