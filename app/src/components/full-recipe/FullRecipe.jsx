import { useEffect, useState, Fragment } from 'react';
import './fullrecipe.css' 
import { useRef } from 'react';
import Button from '../button/Button';
import Dialog from '../dialog/Dialog';
import {API_URL} from '../../common/const.js';
import {useDispatch} from 'react-redux';
import {
    setFullRecipe, 
    setUpdateRecipe, 
    removeRecipe,
    toggleFavouriteRecipe
} from '../../reducers/recipes';

export default function FullRecipe({recipe}) {

  //States
  const [dialog,setDialog] = useState(false);

  //Constants

    const dispatch = useDispatch();
    const modalRef = useRef();

    const ingredients = JSON.parse(recipe.ingredients);
    const steps = JSON.parse(recipe.steps);
    const notes = JSON.parse(recipe.notes);
    //Effects

    //Add event to close the modal on ESC key press
    useEffect(() => {
        document.addEventListener("keydown", closeModal);
        return () => {
          document.removeEventListener("keydown",closeModal);
        }
    })

    //Functions

    //Close the modal on Escape key press
    const closeModal = (e) => {
        if(e.key === "Escape"){
            dispatch(setFullRecipe(null));
        }

        if(e.target === e.currentTarget){
            dispatch(setFullRecipe(null));
        }
    }

    //Function for removing the recipe
    const remove = (option) => {
        if(option === true){
            dispatch(removeRecipe(recipe.id));
            dispatch(setFullRecipe(null));            
        }
    }

    //Render
    return (

    <div ref={modalRef} onClick={(e) => closeModal(e)} className="modal">

      <div className="full-recipe">
        <div className="full-recipe-header">

          <h2>{recipe.name}</h2>
          <button className="close" onClick={() => dispatch(setFullRecipe(null))}></button>

        </div>
        
        <div className="full-recipe-body">

          <div className="left">

            <div className="full-recipe-image">
              <img src={`${API_URL}/images/${recipe.img}`} alt={recipe.name}/>
              <div className={recipe.favourite ? "recipe-heart selected" : "recipe-heart"} onClick={() => dispatch(toggleFavouriteRecipe(recipe.id))}>
                <i></i>
              </div>
            </div>

            <ul className="full-recipe-details">
                <li className="recipe-category">
                  <i></i>
                  <p>{recipe.category}</p>
                </li>
                <li className="recipe-time">
                  <i></i>
                  <p>{recipe.time}</p>
                </li>
                <li className="recipe-difficulty" >
                  <i className="selected"></i>
                  <i className={(recipe.difficulty > 1)?"selected":""}></i>
                  <i className={(recipe.difficulty > 2)?"selected":""}></i>
                  <p>{recipe.difficulty === 1? "Easy" : recipe.difficulty === 2? "Medium": "Hard"}</p>
                </li>
                <li className="recipe-serving">
                  <i></i>
                  <i></i>
                  <p>{recipe.servings}</p>
                </li>
            </ul>

            <h3>Ingredients</h3>
            <ul className="full-recipe-scroll-lock">
                {Object.keys(ingredients).map((part, index) => {
                  return <Fragment key={index}>
                    {part !== "all" && <h4>{part}</h4>}
                    {  
                      ingredients[part].map((ing, index) => { 
                        return <li key={index}><p>{ing.split(":")[0]}</p><p>{ing.split(":")[1]}</p></li>
                      })
                    }
                    </Fragment>
                  
                })}
            </ul>

          </div>

          <div className="right">

            <div  className="full-recipe-scroll-lock">
              <h3>Instructions</h3>
              <ol>
                {Object.keys(steps).map((part, index) => {
                  return <Fragment key={index}>
                    {part !== "all" && <h4>{part}</h4>}
                    {  
                      steps[part].map((step, index) => { 
                        return <li key={index}><p>{step}</p></li>
                      })
                    }
                    </Fragment>
                  
                })}
              </ol>

              <h3>Notes</h3>
              <ul>
                {notes["all"].map((note, index) => { return <li key={index}><p>{note}</p></li> })}
              </ul>
            </div>

          </div>

        </div>

        <div className="full-recipe-footer">
            <Button text="Remove" func={() => setDialog(true)}/>
            <Button text="Edit" func={() =>{dispatch(setFullRecipe(null)); dispatch(setUpdateRecipe(recipe.id))}}/>
        </div>

      </div>

      {dialog && <Dialog text="Do you want to remove this recipe?" func={remove} close={setDialog}/>}

    </div>


    )
}
