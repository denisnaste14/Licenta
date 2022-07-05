import React, { useEffect, useState } from 'react'
import Report from '../components/Report';
import './viewsCSS/ExpenseReport.css'
import { useAuth } from '../context/AuthContext.js'
import { db } from '../utils/firebase.js'
import ChatUser from '../components/ChatUser';
import DateTimePicker from 'react-datetime-picker';
import 'react-toastify/dist/ReactToastify.css'
import { toast } from 'react-toastify'

toast.configure()
export default function ExpenseReport() {
  var dataNow = new Date()
  var an = dataNow.getFullYear();
  var month = dataNow.getMonth();
  var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

  const [yearSel, setYearSel] = useState(an.toString());
  const [monthSel, setMonthSel] = useState(months.at(month - 1))
  const { loggedUser } = useAuth()
  const [currentUser, setCurrentUser] = useState(false)
  const [report, setReport] = useState([])
  const [users, setUsers] = useState([])
  const [addState, setAddState] = useState(false)
  const [userChoosen, setUserChoosen] = useState(false)
  const [reportChoosen, setReportChoosen] = useState()
  const [reportChoosenExist, setReportChoosenExist] = useState(false)
  

  //Add states
  const [repId,setRepId] =useState('')
  const [issDate, setIssDate] = useState(new Date())
  const [dueDate,setDueDate] = useState(new Date())
  const [admini,setAdmini] = useState(0)
  const [clean,setClean] = useState(0)
  const [elect,setElect] = useState(0)
  const [repair,setRepair] = useState(0)
  const [remain,setRemain] = useState(0)
  const [btnPushed,setBtnPushed] = useState(false)


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

    db.collection('report').onSnapshot(snapshot => {
      setReport(snapshot.docs.filter(doc => {
        var lunaOk = false, anulOk = false;
        var issueDate = doc.data().issueDate.toDate();
        if (monthSel === months.at(issueDate.getMonth() - 1)) lunaOk = true;
        if (yearSel === issueDate.getFullYear().toString()) anulOk = true;
        console.log(issueDate.getFullYear())
        if (issueDate.getMonth() === 0 && issueDate.getFullYear() === an - 1) anulOk = true;
        if (doc.data().uid === currentUser['id'] && lunaOk && anulOk)
          return true
        else
          return false
      }).map(doc => ({
        id: doc.id,
        uid: doc.data().uid,
        issueDate: doc.data().issueDate.toDate(),
        dueDate: doc.data().dueDate.toDate(),
        administration: doc.data().administration,
        cleaning: doc.data().cleaning,
        electricity: doc.data().electricity,
        repairs: doc.data().repairs,
        remaining: doc.data().remaining
      }))
      )
    })

  }, [currentUser, loggedUser, monthSel, yearSel])

  function displayYearsOptions() {
    var components = []
    components.push(<option> {an - 1} </option>)
    components.push(<option> {an} </option>)
    components.push(<option> {an + 1} </option>)
    return components
  }

  function displayMonthsOptions() {
    var components = []
    months.forEach(x => {
      components.push(<option>{x}</option>)
    })
    return components
  }

  function displayChatUsers() {
    var usersComponents = []
    users.forEach((x) => {
      usersComponents.push(<ChatUser chatUser={x} userChoosen={userChoosen} onClick={() => { setUserChoosen(x); setReportChoosenExist(false); handleUserChoosen(x) }} />)
    })
    return usersComponents;
  }

  function handleUserChoosen(x) {
    db.collection('report').onSnapshot(snapshot => {
      setReportChoosen(snapshot.docs.filter(doc => {
        var lunaOk = false, anulOk = false;
        var issueDate = doc.data().issueDate.toDate();
        if (month === issueDate.getMonth()) lunaOk = true;
        if (an === issueDate.getFullYear()) anulOk = true;
        if (month === 0 && issueDate.getFullYear() === an - 1) anulOk = true;
        console.log(x['id'])
        if (doc.data().uid === x['id'] && lunaOk && anulOk) {
          setReportChoosenExist(true);
          
          setRepId(doc.id)
          setIssDate(doc.data().issueDate.toDate())
          setDueDate(doc.data().dueDate.toDate())
          setAdmini(doc.data().administration); setClean(doc.data().cleaning)
          setElect(doc.data().electricity); setRepair(doc.data().repairs)
          setRemain(doc.data().remaining)
          return true
        }
        else
        {
          var dueDateMonth = new Date();
          dueDateMonth.setMonth(dueDateMonth.getMonth()+1);
          setIssDate(new Date())
          setDueDate(dueDateMonth)
          setAdmini(0); setClean(0)
          setElect(0); setRepair(0)
          setRemain(0)
          return false
        }         
      }).map(doc => ({
        id: doc.id,
        uid: doc.data().uid,
        issueDate: doc.data().issueDate.toDate(),
        dueDate: doc.data().dueDate.toDate(),
        administration: doc.data().administration,
        cleaning: doc.data().cleaning,
        electricity: doc.data().electricity,
        repairs: doc.data().repairs,
        remaining: doc.data().remaining
      }))
      )
    })
  }

  function handleSubmit(e) {
    e.preventDefault();
    const newReport={
      uid: userChoosen['id'],
      issueDate: issDate,
      dueDate: dueDate,
      administration: Number(admini),
      cleaning: Number(clean),
      electricity: Number(elect),
      repairs: Number(repair),
      remaining: Number(remain)
    }
    if(!reportChoosenExist){
      db.collection('report').add(newReport).then(()=>{
        setAddState(false)
        setUserChoosen(false)
      toast.success("Expense report generated successfully!", { position: toast.POSITION.TOP_CENTER, autoClose: 1300 })
      }).catch(() => {
        toast.error("Erorr in generating the report!", { position: toast.POSITION.TOP_CENTER, autoClose: 1300 })
      })
    }
    else{
      db.collection('report').doc(repId).update(newReport).then(()=>{
        setAddState(false)
        setUserChoosen(false)
        toast.success("Expense report modified successfully!", { position: toast.POSITION.TOP_CENTER, autoClose: 1300 })
      }).catch(() => {
        toast.error("Erorr in modifying the report!", { position: toast.POSITION.TOP_CENTER, autoClose: 1300 })
      })
    }
    setBtnPushed(false);
  }

  return (
    <div className='expense-report-page'>
      <div className='expense-add-or-update-container'>
        {
          currentUser['admin'] === true &&
          <div className='report-add-btn-wrapper'>
            <button className='report-add-btn' onClick={() => setAddState(!addState)}>Add expense report</button>
          </div>
        }
        {
          addState &&
          <div className='users-container'>
            Choose one user to generate expense report for last month:
            {displayChatUsers()}
          </div>
        }
        {
          addState && userChoosen !== false &&
          <div className='report-add-form-wrapper'>
            {
              !reportChoosenExist===true ?
              <p className='add-update-form'>Generate new expense report for {userChoosen['name']} for last month</p>
              :
              <p className='add-update-form'>Modify the last month expense report for {userChoosen['name']} </p>
            }
            <form onSubmit={(e) => {setBtnPushed(true);handleSubmit(e)}}>
              <div className='report-add-group'>
                <label className='report-add-label'> Data scadentă:</label>
                <DateTimePicker onChange={setDueDate} value={dueDate} maxDetail="second" required={true}/>
              </div>
              <div className='report-add-group'>
                <label className='report-add-label'> Administrare:</label>
                <input type="text" value={admini} onChange={(e)=>setAdmini(e.target.value)}></input>
              </div>
              <div className='report-add-group'>
                <label className='report-add-label'> Curățenie:</label>
                <input type="number" value={clean} onChange={(e)=>setClean(e.target.value)}></input>
              </div>
              <div className='report-add-group'>
                <label className='report-add-label'> Curent electric:</label>
                <input type="number" value={elect} onChange={(e)=>setElect(e.target.value)}></input>
              </div>
              <div className='report-add-group'>
                <label className='report-add-label'> Fond reparații:</label>
                <input type="number" value={repair} onChange={(e)=>setRepair(e.target.value)}></input>
              </div>
              <div className='report-add-group'>
                <label className='report-add-label'> Datorii restante:</label>
                <input type="number" value={remain} onChange={(e)=>setRemain(e.target.value)}></input>
              </div>
              <div className='report-submit-btn-wrapper'>
              {
                !reportChoosenExist===true ?
                <button type='submit' className='report-submit-btn' disabled={btnPushed}>Generate report</button>
                :
                <button type='submit' className='report-submit-btn' disabled={btnPushed}>Update report</button>
              }
              </div>
            </form>
          </div>
        }
      </div>
      <div className='expense-report-select-container'>
        View expense report for year &nbsp;
        <select className='expense-report-select' defaultValue={an.toString()} onChange={(e) => setYearSel(e.target.value)}>
          {displayYearsOptions()}
        </select>
        &nbsp; and month &nbsp;
        <select className='expense-report-select' defaultValue={months.at(month - 1)} onChange={(e) => setMonthSel(e.target.value)}>
          {displayMonthsOptions()}
        </select>
      </div>
      {
        report.length !== 0 ?
          <Report report={report[0]}></Report>
          :
          <div className='no-report'>There is not any expense report for the selected month!</div>
      }
    </div>
  )
}
