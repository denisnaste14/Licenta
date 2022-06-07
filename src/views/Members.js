import React, { useState, useEffect } from 'react'
import './viewsCSS/Members.css'
import { useAuth } from '../context/AuthContext.js'
import { db, storage } from '../utils/firebase.js'
import '../utils/FontawsomeIcons/Icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


export default function Members() {
  const { loggedUser } = useAuth()
  const [currentUser, setCurrentUser] = useState(false)
  const [file, setFile] = useState(null)
  const [editState, setEditState] = useState(true)
  const [nameField, setNameField] = useState('')
  const [aboutField, setAboutField] = useState('')
  const [imgSrc, setImgSrc] = useState('')
  const [newImgText,setNewImgText]=useState('')

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
  }, [])

  function profile_picture_change(e) {
    if(e.target.files[0]){
      const newFile= e.target.files[0];
      console.log(newFile)
      setFile(newFile);
    } 
    
  
  }


  function handleUpdateCurrentProfile(e) {
    e.preventDefault()
    if(aboutField==='')
      setAboutField(currentUser['bio'])
    if(nameField==='')
      setNameField(currentUser['name'])

    const newProfile={
      admin:currentUser['admin'],
      bio: aboutField,
      name: nameField
    }

    if (file) {
      console.log(file)
      const upload = storage.ref(`profilePic/${file.name}`).put(file);
      upload.on("state_changed",
        snapshot => { },
        error => {
          console.log(error)
          return
        },
        () => {
          storage.ref("profilePic/").child(file.name).getDownloadURL().then(url => {
            const newProfile={
              admin:currentUser['admin'],
              bio: aboutField,
              name: nameField,
              imgSrc:url
            }
            db.collection('user').doc(currentUser.uid).update(newProfile);
            setEditState(!editState)
            setFile(null)
            setImgSrc(url)
          });
          console.log(imgSrc)
        }
      )
    }
    console.log(newProfile)
  }

  return (
    <>
      <div className='members-page-container'>
        <div className='current-member-container'>
          <div className='current-member-image-wrapper'>
            <img className='current-member-image' src={imgSrc === '' ? currentUser['imgSrc'] : imgSrc} />
            <input id='profile-pic-change' className='input-change-profile-img' type="file" onChange={e => {setFile(e.target.files[0]); setNewImgText(e.target.files[0].name)}} />
            <label id='profile-pic-change-label' for='profile-pic-change' title='Choose an image'>
              <FontAwesomeIcon icon="camera-retro" />
              <div className='profile-pic-changed-fileName'>
                {newImgText}
              </div>
            </label>
          </div>
          <div className='current-member-content'>
            {
              currentUser['admin'] &&
              <p className='profile-admin'>Administrator</p>
            }
            <form className="current-member-form" onSubmit={(e) => handleUpdateCurrentProfile(e)}>
              <label className='profile-labels'>Name:</label>
              <textarea className='current-member-textarea' defaultValue={currentUser['name']} disabled={editState}
                onChange={e => setNameField(e.target.value)} />
              <label className='profile-labels'>About:</label>
              {
                currentUser['bio']!=='' ?     
                  <textarea className='current-member-textarea' defaultValue={currentUser['bio']} disabled={editState}
                    onChange={e => setAboutField(e.target.value)} />  
                  :
                  <textarea className='current-member-textarea' defaultValue="There is no information yet" disabled={editState}
                    onChange={e => setAboutField(e.target.value)} />
              }
              <div className='current-member-edit'>
                <button onClick={() => setEditState(!editState)} title='Edit your profile'>
                  <FontAwesomeIcon icon="edit" />
                </button>
                {
                  !editState &&
                  <button title='Edit your profile' type="submit">
                    Save changes
                  </button>
                }
              </div>
            </form>

          </div>
        </div>
      </div>
    </>
  )
}
