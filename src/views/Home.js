import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import NewsCardLeft from '../components/NewsCardLeft'
import NewsCardRight from '../components/NewsCardRight'
import { db } from '../utils/firebase.js'
import firebase from 'firebase/compat/app'
import '../components/FontawsomeIcons/Icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import "./viewsCSS/Home.css"
function Home() {
  const [news, setNews] = useState([]);
  const [ascending, setAscending] = useState(false);
  useEffect(() => {
    db.collection('news').onSnapshot(snapshot => {
      setNews(snapshot.docs.map(doc => ({ id: doc.id, imgSrc: doc.data().imgSrc, text: doc.data().text, dateTime: doc.data().dateTime.toDate() })))
    });
  }, [])

  
  function displayNews() {
    var items = [];
    news.forEach((x, index) => {
      if (index % 2 === 0) {
        items.push(<NewsCardLeft newsCard={x} />);
      }
      else {
        items.push(<NewsCardRight newsCard={x} />);
      }
    })
    return items;
  }

  function sortNewsDescending() {
    news.sort(function (a, b) {
      return new Date(b['dateTime']) - new Date(a['dateTime']);
    })
    return displayNews();
  }

  function sortNewsAscending() {
    news.sort(function (a, b) {
      return new Date(a['dateTime']) - new Date(b['dateTime']);
    })
    return displayNews();
  }

  news.forEach(x => {
    console.log(firebase.firestore.Timestamp.fromDate(x.dateTime).toDate());
    console.log(x.text);
    console.log(x.imgSrc);
  });
  return (
    <>
      <Navbar />
      <div className='home-body'>
      <div className='select-sort-news-container'>
        <FontAwesomeIcon icon="sort"/> Sort by:	&nbsp;
        <select className='select-sort-news' defaultValue={"Latest news"} onChange={() => setAscending(!ascending)}>
          <option>Latest news</option>
          <option>Older news</option>
        </select>
      </div>
        {ascending === true ? sortNewsAscending() : sortNewsDescending()}
      </div>
    </>
  )
}

export default Home