import React from 'react'
import './StylesCss/ChatUser.css'

export default function ChatUser(props) {
  return (
    <div className={`${(props.userChoosen!==false && props.userChoosen['id']===props.chatUser['id']) 
      ? "chat-user-container-selected" : "chat-user-container"}`} onClick={props.onClick}>
        <div className='chat-user-image-wrapper'>
            <img className='chat-user-image' src={props.chatUser['imgSrc']} alt=''/>
        </div>
        <div className='chat-user-name'>
            {props.chatUser['name']}
        </div>
    </div>
  )
}
