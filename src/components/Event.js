import React from 'react'
import './StylesCss/Event.css'
import '../utils/FontawsomeIcons/Icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Timestamp } from "firebase/firestore"
import { db } from '../utils/firebase'
import 'react-toastify/dist/ReactToastify.css'
import { toast } from 'react-toastify'

toast.configure()
export default function Event(props) {
    var data = new Date(props.event.dateTime);
    var d = data.toDateString() + " at " + data.toLocaleTimeString();
    var participants = props.event['participants'];
    var isParticipant = false;

    participants.forEach(element => {
        if (props.currentUser['id'] === element)
            isParticipant = true;
    });

    function participateHandler(e) {
        e.preventDefault()
        participants.push(props.currentUser['id']);
        const eventUpdated = {
            dateTime: Timestamp.fromDate(props.event.dateTime),
            description: props.event['description'],
            location: props.event['location'],
            participants: participants
        }
        db.collection('event').doc(props.event['id']).update(eventUpdated);
        isParticipant = true;
    }


    function cantParticipateHandler(e) {
        e.preventDefault()
        var index = participants.indexOf(props.currentUser['id'])
        if (index > -1)
            participants.splice(index, 1);
        else {
            console.log("nu")
            return
        }

        console.log(participants)
        const eventUpdated = {
            dateTime: Timestamp.fromDate(props.event.dateTime),
            description: props.event['description'],
            location: props.event['location'],
            participants: participants
        }
        db.collection('event').doc(props.event['id']).update(eventUpdated);
        isParticipant = true;
    }

    function handleDelete(e) {
        e.preventDefault()
        var eventID = props.event['id'];
        db.collection('event').doc(eventID).delete().catch(() => {
            toast.error("Erorr removing event!", { position: toast.POSITION.TOP_CENTER, autoClose: 1300 })
        })
            .then(() => {
                toast.success("Event successfully deleted!", { position: toast.POSITION.TOP_CENTER, autoClose: 1300 })
            })
    }

    return (

        <div className='event-container'>
            {
                props.deleteState &&
                <div className='event-delete-btn-wrapper'>
                    <button className='event-delete-btn' title='' onClick={(e) => handleDelete(e)}>[ Delete event ]</button>
                </div>
            }
            <div className='event-label'> <FontAwesomeIcon icon='circle-info' /> Description:</div>
            <div className='event-description'>{props.event['description']}</div>
            <div className='event-label'> <FontAwesomeIcon icon='location-dot' /> Location:</div>
            <div className='event-location'>{props.event['location']}</div>
            <div className='event-label'> <FontAwesomeIcon icon='calendar-times' /> Date and time:</div>
            <div className='event-date'>{d}</div>
            <div className='event-label'> <FontAwesomeIcon icon='user-group' /> Number of participants:</div>
            <div className='event-participants-containter'>
                <div className='event-participants'>{participants.length}</div>
                {
                    !isParticipant ?
                        <div className='event-participate-btn-wrapper'>
                            <button className='event-participate-btn' onClick={(e) => { participateHandler(e) }}>Participate</button>
                        </div>
                        :
                        <div className='event-participate-btn-wrapper'>
                            <button className='event-participate-btn' onClick={(e) => { cantParticipateHandler(e) }}>Can't participate</button>
                        </div>
                }
            </div>

        </div>
    )
}
