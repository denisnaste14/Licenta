import React, { useState, useEffect, useRef } from 'react'
import './viewsCSS/Chat.css'
import { useAuth } from '../context/AuthContext.js'
import { db } from '../utils/firebase.js'
import ChatUser from '../components/ChatUser'
import Message from '../components/Message'
import '../utils/FontawsomeIcons/Icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Timestamp } from "firebase/firestore"

export default function Chat() {

  const { loggedUser } = useAuth()
  const [currentUser, setCurrentUser] = useState(false)
  const [users, setUsers] = useState([])
  const [userChoosen, setUserChoosen] = useState(false)
  const [messages, setMessages] = useState([])
  const [newText, setNewText] = useState('')
  const emptySpan = useRef()

  useEffect(() => {
    db.collection('user').onSnapshot(snapshot => {
      setUsers(snapshot.docs.map(doc => (
        {
          id: doc.id,
          imgSrc: doc.data().imgSrc,
          bio: doc.data().bio,
          admin: doc.data().admin,
          name: doc.data().name
        })))
    });

    if (currentUser === false) {
      db.collection('user')
        .doc(loggedUser['uid'])
        .onSnapshot(snapshot => {
          setCurrentUser({
            id: snapshot.id,
            imgSrc: snapshot.data().imgSrc,
            bio: snapshot.data().bio,
            admin: snapshot.data().admin,
            name: snapshot.data().name
          });
        });
    }

    if(currentUser && userChoosen){
      db.collection('messages').orderBy("dateTime").onSnapshot(snapshot =>{
        setMessages(snapshot.docs.filter(doc=>(
          (doc.data().from === currentUser['id'] && doc.data().to === userChoosen['id']) ||
            (doc.data().to === currentUser['id'] && doc.data().from === userChoosen['id'])
        ))
        .map(doc =>(
          {
            id: doc.id,
            text: doc.data().text,
            dateTime: doc.data().dateTime.toDate(),
            from: doc.data().from,
            to: doc.data().to
          })))
      });
      emptySpan.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [userChoosen, currentUser, loggedUser])

  function displayChatUsers() {
    var chatUserComponents = []
    users.forEach((x) => {
      if (x['id'] !== currentUser['id'])
        chatUserComponents.push(<ChatUser chatUser={x} userChoosen={userChoosen} onClick={() => setUserChoosen(x)} />)
    })
    return chatUserComponents;
  }

  async function handleMessageSend(e) {
    e.preventDefault();
    var dateTime = new Date();

    const messageObj = {
      text: newText,
      dateTime: Timestamp.fromDate(dateTime),
      from: currentUser['id'],
      to: userChoosen['id']
    }

    await db.collection('messages').add(messageObj).then(() => {
      setNewText('')
    })
    emptySpan.current.scrollIntoView({ behavior: "smooth" });
  }
  return (
    <>
      <div className='chat-container'>
        <div className='chat-members-container'>
          {displayChatUsers()}
        </div>
        {
          userChoosen ?
            <div className='chat-room-container'>
              <div className='chat-room-title'>
                <img className='chat-room-user-image' src={userChoosen['imgSrc']} alt=''/>
                {userChoosen['name']}
              </div>
              <div className='chat-room-content'>
                {messages && messages.map(msg => <Message msg={msg} currentUser={currentUser} choosenUser={userChoosen} />)}
                <span ref={emptySpan}></span>
              </div>
              <div className='chat-room-send-form-container'>
                <form onSubmit={(e) => { handleMessageSend(e) }}>
                  <textarea placeholder="type a new message..." value={newText} onChange={e => { setNewText(e.target.value) }} required>
                  </textarea>
                  <button type='submit'>Send <FontAwesomeIcon icon='paper-plane' /></button>
                </form>
              </div>
            </div>
            :
            <div className='chat-room-no-user-choosen'>Choose one user from the list to start a conversation!</div>
        }
      </div>
    </>
  )
}
