import React, { useState } from 'react'
import "./StylesCss/NewsCardLeft.css"
import "./StylesCss/NewsCardRight.css"
export default function (props) {
  const [showMore, setShowMore] = useState(false);
  var data = new Date (props.newsCard.dateTime);
  var d = data.toDateString() + " at " + data.toLocaleTimeString();
  return (
    !showMore ?
      <div className='news-card-container-right'>
        <div className='news-card-img'>
          <img src={props.newsCard.imgSrc}>
          </img>
        </div>
        <div className='news-card-content'>
          <div className='news-card-title'>
            Anunt nou!
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
      </div>
      :
      <div className='news-card-container-sm'>
        <div className='news-card-title'>
          Anunt nou!
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
