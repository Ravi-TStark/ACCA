import React from 'react'
import './message.css'

function message(props) {
    return (
        <div className="messageRoot">
            <div id="msgBody" className={props.recieved? "messageBody-recieved": "messageBody"}>
                {props.content}
            <div className="message-Timestamp">
                {props.timeStamp}
            </div>
        </div>
        </div>
    )
}

export default message
