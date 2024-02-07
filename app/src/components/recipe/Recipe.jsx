import { useRef } from 'react'
import './recipe.css' 
import {API_URL} from '../../common/const.js';
import {useDispatch} from 'react-redux';
import {setFullRecipe, toggleFavouriteRecipe} from '../../reducers/recipes';

export default function Recipe({recipe}) {

    //Constants
    const favRef = useRef();
    const dispatch = useDispatch();

    //Function

    //Function to display the selected recipe
    const onClickCheck = e => {

        if(!favRef.current.contains(e.target)){
            dispatch(setFullRecipe(recipe.id));
        }
    }

    //Rendering
    return (

            <div key={recipe.id} onClick={(e) => onClickCheck(e)} className="recipe">
              
              <div className="recipe-image">
                <img src={`${API_URL}/images/${recipe.img.length > 0 ? recipe.img : "default.jpg"}`} alt={recipe.name}/>
                <div ref={favRef} className={recipe.favourite ? "recipe-heart selected" : "recipe-heart"} onClick={() => dispatch(toggleFavouriteRecipe(recipe.id))}>
                  <i></i>
                </div>
              </div>
              <div className="recipe-details">
                
                <h3 className="recipe-name">{recipe.name}</h3>
                <ul className="recipe-stats">
                  <li className="recipe-difficulty">
                    <i className="selected"></i>
                    <i className={(recipe.difficulty > 1)?"selected":""}></i>
                    <i className={(recipe.difficulty > 2)?"selected":""}></i>
                  </li>
                  <li className="recipe-time">
                    <i></i>
                    <p>{recipe.time}</p>
                  </li>
                  <li className="recipe-favourite">
                    <i className={recipe.favourite ? "selected" : " "}></i>
                  </li>
                </ul>

              </div>

            </div>

  )
}
