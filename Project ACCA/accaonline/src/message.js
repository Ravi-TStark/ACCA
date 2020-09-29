import React from 'react'
import './message.css'

function message(props) {
    return (
        <div className="messageRoot">
            <div id="msgBody" className={props.recieved? "messageBody-recieved": "messageBody"}>
                <div className="message-Content">
                    {props.content}
                </div>
        </div>

        <div className={props.recieved? "message-Timestamp-recieved": "message-Timestamp"}>
                {props.timeStamp}
            </div>
        </div>
    )
}

export default message
