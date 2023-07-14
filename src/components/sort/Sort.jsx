import { useEffect, useState } from 'react';
import './sort.css' 

export default function Sort({setSortBy, sortedBy, setSortedBy}) {

  //Function

  //Get the time in minutes from the recipe 
  const calcTime = (elem) => {
    
    //Get the number from the string 
    let time = parseFloat(String(elem).replace(/[^\d\.]*/g, '')) || 0;
    //Get the time unit from the string
    const unit = String(elem).replace(/[\d\.\ ]*/g, '');
    //Check if the time is in hours and convert it in to minutes
    if(unit.toLowerCase() === "hours") {time = time * 60;}

    return time;
  }

  //Effect

  //Set the sorting function based on the selected criteria
  useEffect(() => {
    switch(sortedBy){
      case "alpha":
        setSortBy(() => (a, b) => a.name>b.name ?1:-1);
        break;
      case "new":
        setSortBy(() => (a, b) => a.date>b.date ?1:-1)
        break;
      case "old":
        setSortBy(() => (a, b) => a.date<b.date ?1:-1)
        break;
      case "time":
        setSortBy(() => (a, b) => calcTime(a.details.time)>calcTime(b.details.time) ?1:-1)
        break;
      default:
        setSortBy(() => (a, b) => a.name>b.name ?1:-1);
    }
  },[sortedBy]);
  
  //Rendering
  return (

        <div className="sort">

          <h5>Sort:</h5>
          
          <select className="sort-by" value={sortedBy} onChange={(e) => setSortedBy(e.target.value)}>
            <option value="alpha">Name</option>
            <option value="new">Newer</option>
            <option value="old">Older</option>
            <option value="time">Quickest</option>
          </select>

        </div>

  )
}
