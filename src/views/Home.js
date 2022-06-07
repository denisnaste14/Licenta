import React, { useEffect, useState } from 'react'
import NewsCardLeft from '../components/NewsCardLeft'
import NewsCardRight from '../components/NewsCardRight'
import { db, storage } from '../utils/firebase.js'
import '../utils/FontawsomeIcons/Icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import "./viewsCSS/Home.css"
import { useAuth } from '../context/AuthContext.js'
import DateTimePicker from 'react-datetime-picker';
import { Timestamp } from "firebase/firestore"
import 'react-toastify/dist/ReactToastify.css'
import { toast } from 'react-toastify'

toast.configure()
function Home() {
  const { loggedUser } = useAuth()
  
  const [myuser, setMyuser] = useState(false)
  const [news, setNews] = useState([])
  const [ascending, setAscending] = useState(false)  
  const [deleteState, setDeleteState] = useState(false)
  const [addState, setAddState] = useState(false)
  const [error, setError] = useState('')

  //news add states
  const [text, setText] = useState('')
  const [imgSrc, setImgSrc] = useState('')
  const [title, setTitle]=useState('')
  const [dateTime, setDateTime] = useState(new Date())
  const [file, setFile] = useState(false)

  useEffect(() => {
    db.collection('news').onSnapshot(snapshot => {
      setNews(snapshot.docs.map(doc => (
        { 
          id: doc.id, 
          title: doc.data().title,
          imgSrc: doc.data().imgSrc, 
          text: doc.data().text, 
          dateTime: doc.data().dateTime.toDate() 
        })))
    });
    if (myuser === false) {
      db.collection('user')
      .doc(loggedUser['uid'])
      .onSnapshot(snapshot => {
        setMyuser(snapshot.data());
      });
    }
  }, [loggedUser, myuser])

  function displayNews() {
    var items = [];
    news.forEach((x, index) => {
      if (index % 2 === 0) {
        items.push(<NewsCardLeft newsCard={x} enableDelete={deleteState} />);
      }
      else {
        items.push(<NewsCardRight newsCard={x} enableDelete={deleteState} />);
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

  async function handleAdd(e) {
    e.preventDefault();
    setError('')
    if (imgSrc === '' && file === false) {
      setError("Please either complete image source link or choose a file")
      return;
    }

    if (imgSrc !== '') {
      const newsData = {
        title:title,
        text: text,
        imgSrc: imgSrc,
        dateTime: Timestamp.fromDate(dateTime)
      }
      await db.collection('news').add(newsData).then(() => {
        setAddState(false)
        toast.success("Announcement added successfully!", { position: toast.POSITION.TOP_CENTER, autoClose: 1300 })
      }).catch(() => {
        toast.error("Erorr adding announcement!", { position: toast.POSITION.TOP_CENTER, autoClose: 1300 })
      })
      return;
    } else {
      const upload = storage.ref(`images/${file.name}`).put(file);
      upload.on("state_changed",
        snapshot => { },
        error => {
          console.log(error)
        },
        () => {
          storage.ref("images").child(file.name).getDownloadURL().then(url => {
            const newsData = {
              title: title,
              text: text,
              imgSrc: url,
              dateTime: Timestamp.fromDate(dateTime)
            }
            db.collection('news').add(newsData).then(() => {
              setAddState(false)
              toast.success("Announcement added successfully!", { position: toast.POSITION.TOP_CENTER, autoClose: 1300 })
            }).catch(() => {
              toast.error("Erorr adding announcement!", { position: toast.POSITION.TOP_CENTER, autoClose: 1300 })
            })
          });
        }
      )
    }
  }
  return (
    <>
      {myuser &&
      <div className='home-body'>
        <div className='select-sort-news-container'>
          {
            myuser['admin'] &&
            <button className='news-manage-button' onClick={() => { setAddState(!addState); setError('')}}><FontAwesomeIcon icon="square-plus" /> Add</button>
          }
          {
            myuser['admin'] &&
            <button className='news-manage-button' onClick={() => setDeleteState(!deleteState)}><FontAwesomeIcon icon="trash-can" /> Delete</button>
          }
          <div>
            <FontAwesomeIcon icon="sort" /> Sort by:	&nbsp;
            <select className='select-sort-news' defaultValue={"Latest news"} onChange={() => setAscending(!ascending)}>
              <option>Latest news</option>
              <option>Older news</option>
            </select>
          </div>
        </div>

        {
          addState &&
          <div className='news-add-form-container'>
            <div className='news-add-bad-fields'>
              {error !== '' ? <><FontAwesomeIcon icon='triangle-exclamation' opacity='0.75' /> {error}</> : ""}
            </div>
            <form onSubmit={(e) => handleAdd(e)}>
            <div className='news-add-group'>
                <label for="title" className='news-add-label'> Title:</label><br />
                <input className='news-add-input' type="text" onChange={e => setTitle(e.target.value)} required/>              
              </div>
              <div className='news-add-group'>
                <label for="text" className='news-add-label'> Text:</label><br />
                <textarea rows="10" className='news-add-textarea' type="text" onChange={e => { setText(e.target.value) }} required /><br />
              </div>
              <div className='news-add-group'>
                <label className='news-add-label'> Image source link:</label><br />
                <input className='news-add-input' type="text" onChange={e => setImgSrc(e.target.value)} />
              </div>
              <div>or</div>
              <div className='news-add-group'>
                <label className='news-add-label'> Choose image from browser:</label><br />
                <input className='news-add-input' type="file" onChange={e => setFile(e.target.files[0])} /><br />
              </div>
              <div className='news-add-group'>
                <label className='news-add-label'> Date and time:</label><br />
                <div><DateTimePicker onChange={setDateTime} value={dateTime} maxDetail="second" required={true} /></div>
              </div>

              <div className='news-add-submit-btn'>
                <input type="submit" value="Add announcement" id='news-add-submit' disabled={false} />
              </div>
            </form>
          </div>
        }
        {ascending === true ? sortNewsAscending() : sortNewsDescending()}
      </div>
      }
    </>
  )
}

export default Home