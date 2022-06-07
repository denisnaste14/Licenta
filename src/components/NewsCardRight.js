import React, { useState } from 'react'
import "./StylesCss/NewsCardLeft.css"
import "./StylesCss/NewsCardRight.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
import { db } from '../utils/firebase';
export default function NewsCardRight(props) {
  const [showMore, setShowMore] = useState(false);
  var data = new Date(props.newsCard.dateTime);
  var d = data.toDateString() + " at " + data.toLocaleTimeString();

  async function handleDelete(e){
    e.preventDefault()
    var newsCardID=props.newsCard.id;
    db.collection('news').doc(newsCardID).delete().catch(() =>{
      toast.error("Erorr removing announcement!", {position: toast.POSITION.TOP_CENTER, autoClose: 2000})
    })
    .then(()=>{
      toast.success("Announcement successfully deleted!", {position: toast.POSITION.TOP_CENTER, autoClose: 2000})
    })
  }

  return (
    !showMore ?
      <div className='news-card-container-wrapper'>
        {props.enableDelete &&
          <div className='news-card-delete-container'>
            <button className='news-card-delete-btn' onClick={(e)=>handleDelete(e)}> <FontAwesomeIcon icon='trash-can' className='nc-trash-can-icon' /> [Delete announcement] </button>
          </div>
        }
        <div className='news-card-container-right'>
          <div className='news-card-img'>
            <img src={props.newsCard.imgSrc} alt="News">
            </img>
          </div>
          <div className='news-card-content'>
            <div className='news-card-title'>
            {props.newsCard.title}
            </div>
            <div className='news-card-text'>
              <p>
                {showMore ? props.newsCard.text : `${props.newsCard.text.substring(0, 400)}`}
                <button className="news-card-text-sm_btn" onClick={() => setShowMore(!showMore)}>
                  {showMore ? "Show less" : props.newsCard.text.length<400 ? "" :"Show more"}
                </button>
              </p>
            </div>
            <div className='news-card-date'>
              Announcement published in {d}
            </div>
          </div>
        </div>
      </div>
      :
      <div className='news-card-container-sm'>
        <div className='news-card-title'>
          {props.newsCard.title}
        </div>
        <div className='news-card-text'>
          <p>
            {showMore ? props.newsCard.text : `${props.newsCard.text.substring(0, 400)}`}
            <button className="news-card-text-sm_btn" onClick={() => setShowMore(!showMore)}>
              {showMore ? "Show less" : "Show more"}
            </button>
          </p>
        </div>
        <div className='news-card-date'>
          Announcement published in {d}
        </div>
      </div>
  )
}
