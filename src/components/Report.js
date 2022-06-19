import React from 'react'
import './StylesCss/Report.css'

export default function Report(props) {
  var luni= ['Ianuarie','Februarie','Martie','Aprilie','Mai','Iunie','Iulie','August','Septembrie','Octombrie','Noiembrie','Decembrie']
  var luna,anul, total=0;
  if(props.report['issueDate'].getMonth()===0)
  {
    luna=luni.at(11);
    anul=props.report['issueDate'].getFullYear()-1;
  }else{
    luna=luni.at(props.report['issueDate'].getMonth()-1)
    anul=props.report['issueDate'].getFullYear();
  }

  total=props.report['administration']+props.report['cleaning']+props.report['electricity']+
        +props.report['repairs']+props.report['remaining'];

  return (
    <div className='report-container'>
      <div className='report-title'>
        LISTA DE PREȚURI PENTRU {luna.toUpperCase()} {anul}
      </div>
      <div className='report-date-made'>
        Data emiterii: {props.report['issueDate'].getDate()} {luni.at(props.report['issueDate'].getMonth())} {props.report['issueDate'].getFullYear()}
      </div>
      <div className='report-due-date'>
        Data scadentă: {props.report['dueDate'].getDate()} {luni.at(props.report['dueDate'].getMonth())} {props.report['dueDate'].getFullYear()}
      </div>
      <div className='report-content'>
        <div className='report-group'>
          <div className='report-label'>Administrare:</div>
          <div className='report-content-text'>{props.report['administration']} RON</div>
        </div>
        <div className='report-group'>
          <div className='report-label'>Curățenie:</div>
          <div className='report-content-text'>{props.report['cleaning']} RON</div>
        </div>
        <div className='report-group'>
          <div className='report-label'>Curent electric:</div>
          <div className='report-content-text'>{props.report['electricity']} RON</div>
        </div>
        <div className='report-group'>
          <div className='report-label'>Fond de reparații:</div>
          <div className='report-content-text'>{props.report['repairs']} RON</div>
        </div>
        <div className='report-group'>
          <div className='report-label'>Datorii restante:</div>
          <div className='report-content-text'>{props.report['remaining']} RON</div>
        </div>
        <div className='report-total-group'>
          <div className='report-label'>Total de plată:</div>
          <div className='report-content-text'>{total} RON</div>
        </div>
      </div>
    </div>
  )
}
