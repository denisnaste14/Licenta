import React, { useEffect, useState, useRef } from 'react'
import './viewsCSS/EventPlanner.css'
import { useAuth } from '../context/AuthContext.js'
import { db } from '../utils/firebase.js'
import Event from '../components/Event'
import '../utils/FontawsomeIcons/Icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import DateTimePicker from 'react-datetime-picker';
import 'react-toastify/dist/ReactToastify.css'
import { toast } from 'react-toastify'
import { Timestamp } from "firebase/firestore"

toast.configure()
export default function EventPlanner() {
  const { loggedUser } = useAuth()
  const [currentUser, setCurrentUser] = useState(false)
  const [events, setEvents] = useState([])
  const [deleteState, setDeleteState] = useState(false)
  const [addState, setAddState] = useState(false)
  const [editState, setEditState] = useState(false)
  const [editEventState, setEditEventState] = useState(false)
  const emptySpan = useRef()

  const [descrEdit,setDescrEdit] = useState('')
  const [locatEdit,setLocatEdit] = useState('')
  const [dateTimeEdit,setDateTimeEdit] = useState(new Date())
  const [participantsEdit, setParticipantsEdit] = useState([])
  const [idEdit, setIdEdit] = useState('')

  const [description, setDescription] = useState('')
  const [location, setLocation] = useState('')
  const [dateTime, setDateTime] = useState(new Date())

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

  }, [currentUser, loggedUser])

  function eventComponents(){
    var components=[]
    events.sort(function (a, b) {
      return new Date(b['dateTime']) - new Date(a['dateTime']);
    })
    events.forEach(event=>{
      components.push(
        <>
        {
          editState&&
        <div className='edit-event-container'>
          <button className='edit-event-btn' onClick={(e) => {setEditEventState(!editEventState); handleEditEvent(e,event)}}><FontAwesomeIcon icon="edit" /> {'[Edit event]'}</button>
        </div>
        }
      <Event event={event} currentUser={currentUser} deleteState={deleteState}/>
      </>
      )
    })
    return components;
  }

  function handleSubmit(e){
    e.preventDefault()
    if(!editState){
    var participants=[]
    participants.push(currentUser['id'])
    const newEvent={
      description: description,
      location: location,
      dateTime: Timestamp.fromDate(dateTime),
      participants:participants
    }
    db.collection('event').add(newEvent).then(() => {
      setAddState(false)
      toast.success("New event planned successfully!", { position: toast.POSITION.TOP_CENTER, autoClose: 1300 })
    }).catch(() => {
      toast.error("Erorr planning the event!", { position: toast.POSITION.TOP_CENTER, autoClose: 1300 })
    })
    }
    else{
      var desc, loc;
      (description === '') ? desc=descrEdit : desc = description;
      (location === '') ? loc=locatEdit : loc = location;
      const updatedEvent={
        description: desc,
        location: loc,
        dateTime: Timestamp.fromDate(dateTimeEdit),
        participants: participantsEdit
      }
      db.collection('event').doc(idEdit).update(updatedEvent).then(()=>{
        setEditEventState(false);
        setAddState(false);
        setEditState(false);
        setDescrEdit('')
        setLocatEdit('')
        setDateTimeEdit('')
        setParticipantsEdit('')
        setIdEdit('')
        toast.success("Event modified successfully!", { position: toast.POSITION.TOP_CENTER, autoClose: 1300 })
      }).catch(() => {
        toast.error("Erorr in modifying the event", { position: toast.POSITION.TOP_CENTER, autoClose: 1300 })
      })
    }
  }

  function handleEditEvent(e,event){
    e.preventDefault()
    setDescrEdit(event['description'])
    setLocatEdit(event['location'])
    setDateTimeEdit(event['dateTime'])
    setParticipantsEdit(event['participants'])
    setIdEdit(event['id'])
    emptySpan.current.scrollIntoView({ behavior: "smooth" });
  }

  return (

    <div className='event-planner-page'>
      <span ref={emptySpan}></span>
      <div className='event-planner-admin-actions'>
          {
            currentUser['admin'] &&
            <>
                <button className='event-planner-admin-btn' onClick={() => {setDescrEdit(''); setLocatEdit('');setAddState(!addState); setEditEventState(false); setEditState(false);}}>
                  <FontAwesomeIcon icon="square-plus" /> Add
                </button>
                <button className='event-planner-admin-btn' onClick={() => {setDeleteState(!deleteState); setEditEventState(false); setEditState(false); setAddState(false)}}>
                  <FontAwesomeIcon icon="trash-can" /> Delete
                </button>
                <button className='event-planner-admin-btn' onClick={(e) => {setAddState(false); setDeleteState(false); setEditState(!editState); setEditEventState(false)}}>
                  <FontAwesomeIcon icon="edit" /> Edit
                </button>
            </>
          }
          </div>
          {
              (addState || editEventState) &&
              <div className='event-planner-form-container'>
                <form onSubmit={(e) => handleSubmit(e)}>
                  <div className='event-planner-group'>
                    <label for="text" className='event-planner-label'> Text:</label><br />
                    <textarea rows="10" className='event-planner-textarea' type="text" defaultValue={descrEdit} onChange={e => { setDescription(e.target.value) }} required /><br />
                  </div>
                  <div className='event-planner-group'>
                    <label className='event-planner-label'> Location:</label><br />
                    <input className='event-planner-input' defaultValue={locatEdit} type="text" onChange={e => setLocation(e.target.value)} />
                  </div>
                  <div className='event-planner-group'>
                    <label className='event-planner-label'> Date and time:</label><br />
                    {   
                        !editState?
                        <div><DateTimePicker onChange={setDateTime} value={dateTime} maxDetail="second" required={true}/></div>
                        :
                        <div><DateTimePicker onChange={setDateTimeEdit} value={dateTimeEdit} maxDetail="second" required={true}/></div>
                      }
                    
                  </div>
    
                  <div className='event-planner-submit-btn'>
                    {
                      !editState ?
                    <input type="submit" value="Plan event" id='event-planner-submit'/>
                    :
                    <input type="submit" value="Update event" id='event-planner-submit'/>
                    }
                  </div>
                </form>
              </div>
               
          }
      {eventComponents()}
    </div>
  )
}
