import React, { useState } from 'react'
import './StylesCss/Event.css'
import '../utils/FontawsomeIcons/Icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Timestamp } from "firebase/firestore"
import { db } from '../utils/firebase'

export default function (props) {
    var data = new Date(props.event.dateTime);
    var d = data.toDateString() + " at " + data.toLocaleTimeString();
    var participants = props.event['participants'];
    var isParticipant=false;

    participants.forEach(element => {
        if (props.currentUser['id'] === element)
            isParticipant=true;
    });

    function participateHandler(e){
        e.preventDefault()
        participants.push(props.currentUser['id']);
        const eventUpdated = {
            dateTime: Timestamp.fromDate(props.event.dateTime),
            description: props.event['description'],
            location: props.event['location'],
            participants: participants
        }
        db.collection('event').doc(props.event['id']).update(eventUpdated);
        isParticipant=true;
    }

    
    function cantParticipateHandler(e){
        e.preventDefault()
        var index = participants.indexOf(props.currentUser['id'])
        if(index> -1)
            participants.splice(index,1);
        else
        {
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
        isParticipant=true;
    }

    return (
        <div className='event-container'>
            <div className='event-label'> <FontAwesomeIcon icon='circle-info'/> Description:</div>
            <div className='event-description'>{props.event['description']}</div>
            <div className='event-label'> <FontAwesomeIcon icon='location-dot'/> Location:</div>
            <div className='event-location'>{props.event['location']}</div>
            <div className='event-label'> <FontAwesomeIcon icon='calendar-times'/> Date and time:</div>
            <div className='event-date'>{d}</div>
            <div className='event-label'> <FontAwesomeIcon icon='user-group'/> Number of participants:</div>
            <div className='event-participants-containter'>
                    <div className='event-participants'>{participants.length}</div>
                    {
                        !isParticipant ?
                        <div className='event-participate-btn-wrapper'>
                            <button className='event-participate-btn' onClick={(e)=>{participateHandler(e)}}>Participate</button>
                        </div>
                        :
                        <div className='event-participate-btn-wrapper'>
                        <button className='event-participate-btn' onClick={(e)=>{cantParticipateHandler(e)}}>Can't participate</button>
                    </div>
                    }  
            </div>

        </div>
    )
}
