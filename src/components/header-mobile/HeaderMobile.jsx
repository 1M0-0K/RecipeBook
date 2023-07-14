import { useEffect, useRef, useState } from 'react'
import './headermobile.css' 

export default function HeaderMobile() {

  //Ref

  const headerRef = useRef();
  const scroll = useRef(0);


  //Function

  //Function to hide and show the mobile header on scroll
  const scrollHide = (e) => {
    const modal = document.querySelector(".modal");
    const main = document.querySelector("main");
    
    //Make it work only when we don't have a modal open
    if(!modal || !modal.contains(e.target)){
      //If we scroll up show the header
      if(scroll.current -20 > main.scrollTop){
        headerRef.current.style.top="0";
        scroll.current = main.scrollTop;
      }
      //If we scroll down hide the header
      if(scroll.current + 20 < main.scrollTop ){
        headerRef.current.style.top="-45px";
        scroll.current = main.scrollTop;
      }
    }

  }

  //Function the show the side panel
  const showSide = () => {
    //We change the --toggle variable to 0 to set the left position of the side panel to 0 
    document.documentElement.style.setProperty('--toggle', 0);
  }


  //Effect

  //Add scroll event to the main tag
  useEffect(() => {
  
    document.querySelector("main").addEventListener("scroll", scrollHide)
    
    return () => document.querySelector("main").removeEventListener("scroll", scrollHide);

  })

  return (
    
    <div ref={headerRef} className="header-mobile">
      <div className="header-mobile-icon" onClick={showSide}>
        <i></i>
        <i></i>
        <i></i>
      </div>
    </div>

  )
}
