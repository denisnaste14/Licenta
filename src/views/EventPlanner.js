import React, { useEffect, useState } from 'react'
import './viewsCSS/EventPlanner.css'
import { useAuth } from '../context/AuthContext.js'
import { db } from '../utils/firebase.js'
import Event from '../components/Event'

export default function EventPlanner() {
  const { loggedUser } = useAuth()
  const [currentUser, setCurrentUser] = useState(false)
  const [events, setEvents] = useState([])

  useEffect(() => {
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

    db.collection('event').onSnapshot(snapshot => {
      setEvents(snapshot.docs.map(doc => (
        {
          id: doc.id,
          description: doc.data().description,
          location: doc.data().location,
          dateTime: doc.data().dateTime.toDate(),
          participants: doc.data().participants
        })))
    });

  }, [])

  function eventComponents(){
    var components=[]
    events.forEach(event=>{
      components.push(<Event event={event} currentUser={currentUser}/>)
    })
    return components;
  }

  return (

    <div>{eventComponents()}</div>
  )
}
