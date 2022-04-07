import React from 'react'
import Navbar from '../components/Navbar'
import NewsCardLeft from '../components/NewsCardLeft'
import "./viewsCSS/Home.css"
function Home() {
  return (
    <>
        <Navbar/>
        <div className='home-body'>
            <NewsCardLeft imgSrc='https://newcity-apartments.ro/wp-content/uploads/2019/03/Cam_Bird_Eye_01-3000x1500.jpg'/>
        </div>
    </>
  )
}

export default Home