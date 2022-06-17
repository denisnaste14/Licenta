import React from 'react'
import './StylesCss/Message.css'

export default function Message(props) {
    const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const dateToDisplay = "" + props.msg['dateTime'].getDate() + " " + month[props.msg['dateTime'].getMonth()] +
        " " + props.msg['dateTime'].getFullYear() + " at " + props.msg['dateTime'].getHours() +
        ":" + (props.msg['dateTime'].getMinutes() < 10 ? '0':'' )+ props.msg['dateTime'].getMinutes();
    var fromUser = false;
    if (props.msg['from'] === props.currentUser['id'])
        fromUser = props.currentUser;
    else
        fromUser = props.choosenUser;


    return (
        <>
            {
                fromUser === props.choosenUser ?
                    <div className='message-container-wrapper'>
                        <div className='message-container'>
                            <div className='message-image-wrapper'>
                                <img className='message-image' src={fromUser['imgSrc']} alt=''/>
                            </div>
                            <div className='message-name-text'>
                                <div className='message-name'>
                                    {fromUser['name']}
                                </div>
                                <div className='message-text'>
                                    {props.msg['text']}
                                </div>
                                <div className='mesage-date-display'>
                                    {dateToDisplay}
                                </div>
                            </div>
                        </div>
                    </div>
                    :
                    <div className='message-container-wrapper-sent'>
                        <div className='message-container-sent'>
                            <div className='message-image-wrapper'>
                                <img className='message-image' src={fromUser['imgSrc']} alt=''/>
                            </div>
                            <div className='message-name-text'>
                                <div className='message-name'>
                                    {fromUser['name']}
                                </div>
                                <div className='message-text'>
                                    {props.msg['text']}
                                </div>
                                <div className='mesage-date-display'>
                                    {dateToDisplay}
                                </div>
                            </div>
                        </div>
                    </div>
            }
        </>
    )
}
