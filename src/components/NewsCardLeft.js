import React from 'react'
import "./StylesCss/NewsCardLeft.css"
export default function (props) {
  return (
    <div className='news-card-container'>
        <div className='news-card-img'>
            <img src={props.imgSrc}>
            </img>
        </div>
        <div className='news-card-content'>

        </div>
    </div>
  )
}
