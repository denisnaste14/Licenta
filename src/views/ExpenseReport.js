import React from 'react'
import './viewsCSS/ExpenseReport.css'

export default function ExpenseReport() {
  var dataNow = new Date()
  var an = dataNow.getFullYear();
  var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

  function displayYearsOptions(){
    var components=[]
    components.push(<option> {an-1} </option>)
    components.push(<option> {an} </option>)
    components.push(<option> {an+1} </option>)
    return components
  }

  function displayMonthsOptions(){
    var components=[]
    months.forEach(x=>{
      components.push(<option>{x}</option>)
    })
    return components
  }


  return (
    <div className='expense-report-page'>
      <div className='expense-report-select-container'>
      View expense report for year &nbsp;
      <select className='expense-report-select'>
       {displayYearsOptions()} 
      </select>
      &nbsp; and month &nbsp;
      <select className='expense-report-select'>
        {displayMonthsOptions()}
      </select>
      </div>
    </div>
  )
}
