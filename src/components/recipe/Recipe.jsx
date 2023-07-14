import { useRef } from 'react'
import './recipe.css' 

export default function Recipe({info, onClick, addFavourite}) {

  //Ref
  const favRef = useRef();

  //Function

  //Function to display the selected recipe
  const onClickCheck = e => {

    if(!favRef.current.contains(e.target)){
      onClick(info.date);
    }
  }

  //Rendering
  return (

            <div key={info.date} onClick={(e) => onClickCheck(e)} className="recipe">
              
              <div className="recipe-image">
                <img src={`uploads/${info.img.length > 0 ? info.img : "default.jpg"}`} alt={info.name}/>
                <div ref={favRef} className={info.favourite ? "recipe-heart selected" : "recipe-heart"} onClick={() => addFavourite(info)}>
                  <i></i>
                </div>
              </div>
              <div className="recipe-details">
                
                <h3 className="recipe-name">{info.name}</h3>
                <ul className="recipe-stats">
                  <li className="recipe-difficulty">
                    <i className="selected"></i>
                    <i className={(info.details.difficulty > 1)?"selected":""}></i>
                    <i className={(info.details.difficulty > 2)?"selected":""}></i>
                  </li>
                  <li className="recipe-time">
                    <i></i>
                    <p>{info.details.time}</p>
                  </li>
                  <li className="recipe-favourite">
                    <i className={info.favourite ? "selected" : " "}></i>
                  </li>
                </ul>

              </div>

            </div>

  )
}
