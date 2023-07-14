import { useEffect, useState, Fragment } from 'react';
import './fullrecipe.css' 
import { useRef } from 'react';
import Button from '../button/Button';
import Dialog from '../dialog/Dialog';


export default function FullRecipe({recipe, edit, close, remove, notification, addFavourite}) {

  //States
  const [dialog,setDialog] = useState(false);

  //Ref

  const modalRef = useRef();


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
        close(-1);
    }

    if(e.target === e.currentTarget){
      close(-1);
    }
  }

  //Function for removing the recipe
  const removeRecipe = (option) => {
    if(option === true){
      remove(recipe);
      close(-1);
    }
  }

  //Render
  return (

    <div ref={modalRef} onClick={(e) => closeModal(e)} className="modal">

      <div className="full-recipe">
        <div className="full-recipe-header">

          <h2>{recipe.name}</h2>
          <button className="close" onClick={() => close(-1)}></button>

        </div>
        
        <div className="full-recipe-body">

          <div className="left">

            <div className="full-recipe-image">
              <img src={`uploads/${recipe.img}`} alt={recipe.name}/>
              <div className={recipe.favourite ? "recipe-heart selected" : "recipe-heart"} onClick={() => addFavourite(recipe)}>
                <i></i>
              </div>
            </div>

            <ul className="full-recipe-details">
                <li className="recipe-category">
                  <i></i>
                  <p>{recipe.details.category}</p>
                </li>
                <li className="recipe-time">
                  <i></i>
                  <p>{recipe.details.time}</p>
                </li>
                <li className="recipe-difficulty" >
                  <i className="selected"></i>
                  <i className={(recipe.details.difficulty > 1)?"selected":""}></i>
                  <i className={(recipe.details.difficulty > 2)?"selected":""}></i>
                  <p>{recipe.details.difficulty === 1? "Easy" : recipe.details.difficulty === 2? "Medium": "Hard"}</p>
                </li>
                <li className="recipe-serving">
                  <i></i>
                  <i></i>
                  <p>{recipe.details.servings}</p>
                </li>
            </ul>

            <h3>Ingredients</h3>
            <ul className="full-recipe-scroll-lock">
                {Object.keys(recipe.ingredients).map((part, index) => {
                  return <Fragment key={index}>
                    {part !== "all" && <h4>{part}</h4>}
                    {  
                      recipe.ingredients[part].map((ing, index) => { 
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
                {Object.keys(recipe.steps).map((part, index) => {
                  return <Fragment key={index}>
                    {part !== "all" && <h4>{part}</h4>}
                    {  
                      recipe.steps[part].map((step, index) => { 
                        return <li key={index}><p>{step}</p></li>
                      })
                    }
                    </Fragment>
                  
                })}
              </ol>

              <h3>Notes</h3>
              <ul>
                {recipe.notes.map((note, index) => { return <li key={index}><p>{note}</p></li>})}
              </ul>
            </div>

          </div>

        </div>

        <div className="full-recipe-footer">
            <Button text="Remove" func={() => setDialog(true)}/>
            <Button text="Edit" func={() =>{close(-1); edit(recipe.date)}}/>
        </div>

      </div>

      {dialog && <Dialog text="Do you want to remove this recipe?" func={removeRecipe} close={setDialog}/>}

    </div>


  )
}


              // <h4>Aluat</h4>

            // <p><span>-</span><i>2</i><span>+</span></p>
          // {recipe.ingredients.map(ing => <li><p> {ing[0] + ing[1]}</p></li>)}


                // {recipe.ingredients.map((ing, index) => { return <li key={index}><p>{ing.split(":")[0]}</p><p>{ing.split(":")[1]}</p></li>})}

/*
                {Object.keys(recipe.ingredients).map((part) => ( 
                  recipe.ingredients[part].map((ing, index) => { 
                    return <li key={index}><p>{ing.split(":")[0]}</p><p>{ing.split(":")[1]}</p></li>
                  })
                ))}
*/
