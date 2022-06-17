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
  const [newImgText, setNewImgText] = useState('')
  const [users, setUsers] = useState([])

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

    db.collection('user').onSnapshot(snapshot => {
      setUsers(snapshot.docs.map(doc => (
        {
          id: doc.id,
          imgSrc: doc.data().imgSrc,
          bio: doc.data().bio,
          admin: doc.data().admin,
          name: doc.data().name
        })))
    });
  }, [currentUser, users, loggedUser])


  function handleUpdateCurrentProfile(e) {
    e.preventDefault()
    var name, about;
    console.log(aboutField)
    if (aboutField === '')
      about = currentUser['bio']
    else
      about = aboutField;
    if (nameField === '')
      name = currentUser['name'];
    else
      name = nameField;


    if (file) {
      const upload = storage.ref(`profilePic/${file.name}`).put(file);
      upload.on("state_changed",
        snapshot => { },
        error => {
          console.log(error)
          return
        },
        () => {
          storage.ref("profilePic/").child(file.name)
            .getDownloadURL().then(url => {
              const newProfile = {
                admin: currentUser['admin'],
                bio: about,
                name: name,
                imgSrc: url
              }
              db.collection('user').doc(currentUser['id'])
                .update(newProfile);
              setEditState(!editState)
              setFile(null); setNewImgText(''); setImgSrc(url);
              setAboutField(''); setNameField('')
            });
        }
      )
    }
    else {
      const newProfile = {
        admin: currentUser['admin'],
        bio: about,
        name: name,
        imgSrc: currentUser['imgSrc']
      }
      db.collection('user').doc(currentUser['id']).update(newProfile);
      setEditState(!editState)
      setAboutField(''); setNameField('')
    }
  }

  function makeAdminHandler(e,x){
    e.preventDefault();
    const newMember ={
      admin: true,
      bio: x['bio'],
      name: x['name'],
      imgSrc: x['imgSrc'],
    }
    db.collection('user').doc(x['id']).update(newMember);
  }

  function displayMembers() {
    var userComp = []
    users.forEach((x) => {
      if (x['id'] !== currentUser['id'])
        userComp.push(<>
          <div className='member-wrapper'>
            <div className='member-container'>
              <div className='member-image-wrapper'>
                <img className='member-image' src={x['imgSrc']} alt=''/>
              </div>
              <div className='member-content'>
                {
                  x['admin'] ?
                  <p className='profile-admin'>Administrator</p>
                  :
                  <div className='member-space'></div>
                }
                <p className='member-name'>Name: {x['name']}</p>
                {
                  x['bio']!==""?
                  <p className='member-about'>About: {x['bio']}</p>
                  :
                  <p className='member-about'>About: There is no information yet</p>
                }
                {
                  currentUser['admin']===true && x['admin']===false
                  &&
                  <div className='member-btn-wrapper'>
                    <button className='member-btn' onClick={(e)=>{makeAdminHandler(e, x)}}> Make Admin</button>
                  </div>
                }
                
              </div>
            </div>
          </div>
        </>)
    })
    return userComp;
  }


  return (
    <>
      <div className='members-page-container'>
        <div className='current-member-container'>
          <div className='current-member-image-wrapper'>
            <img className='current-member-image' src={imgSrc === '' ? currentUser['imgSrc'] : imgSrc} alt=''/>
            {
              !editState &&
              <>
                <input id='profile-pic-change' className='input-change-profile-img' type="file" onChange={e => { setFile(e.target.files[0]); setNewImgText(e.target.files[0].name) }} />
                <label id='profile-pic-change-label' for='profile-pic-change' title='Choose an image'>
                  <FontAwesomeIcon icon="camera-retro" />
                  <div className='profile-pic-changed-fileName'>
                    {newImgText}
                  </div>
                </label>

              </>
            }
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
                currentUser['bio'] !== '' ?
                  <textarea className='current-member-textarea' defaultValue={currentUser['bio']} disabled={editState}
                    onChange={e => setAboutField(e.target.value)} />
                  :
                  <textarea className='current-member-textarea' defaultValue="There is no information yet" disabled={editState}
                    onChange={e => setAboutField(e.target.value)} />
              }
              <div className='current-member-edit'>
                <button onClick={() => setEditState(!editState)} title='Edit your profile' type='button'>
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

        <div className='members-list-container'>
          {displayMembers()}
        </div>
      </div>
    </>
  )
}
