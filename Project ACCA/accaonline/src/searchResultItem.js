import React from 'react'
import './searchResultItem.css'
import handShake from './img/handshake.svg'

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
                !props.isUserPeer ? <button className='addPeerBtn' onClick={e => {props.addPeer(props.id)}}>
                    +     
                </button> : 
                <div className='isPeerBtn'><img className='peerImage' src={handShake}/></div>
            }
        </div>
    )
}

export default searchResultItem
