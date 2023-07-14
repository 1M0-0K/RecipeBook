import './recipes.css' 
import NewRecipe from '../new-recipe/NewRecipe'
import Recipe from '../recipe/Recipe'
import FullRecipe from '../full-recipe/FullRecipe';
import AddRecipe from '../add-recipe/AddRecipe';
import { useState} from 'react';

export default function Recipes({recipes, newRecipe, addRecipe, removeRecipe, notification, addFavourite, updateRecipe}) {

  //State
  const [showRecipe, setShowRecipe] = useState(-1);
  const [showNewRecipe, setShowNewRecipe] = useState(-1);
 
  //Rendering
  return (

      <main>

        <div className="recipes">
          
          {newRecipe && <NewRecipe show={setShowNewRecipe} />}

          {recipes.map( recipe => (
              
              <Recipe key={recipe.date} info={recipe} onClick={setShowRecipe} addFavourite={addFavourite}/>

          ))}

        </div>

        {(showNewRecipe > -1) && recipes
        .filter(recipe => recipe.date === showNewRecipe)
        .map(recipe => 
          <AddRecipe key={recipe.date} recipeFunction={updateRecipe} recipe={recipe} close={setShowNewRecipe} notification={notification} /> 
        )}
        
        {
         (showNewRecipe === -2) && <AddRecipe recipeFunction={addRecipe} recipe={-1} close={setShowNewRecipe} notification={notification} />
        }

        {(showRecipe !== -1) && recipes
        .filter(recipe => recipe.date === showRecipe)
        .map(recipe => 
          <FullRecipe key={recipe.date} recipe={recipe} edit={setShowNewRecipe} close={setShowRecipe} remove={removeRecipe} notification={notification} addFavourite={addFavourite}/>
       )}

      </main>

  )
}
