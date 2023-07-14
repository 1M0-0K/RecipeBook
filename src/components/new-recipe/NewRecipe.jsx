import './newrecipe.css' 
import Button from '../button/Button';

export default function NewRecipe({show}) {

  //Rendering
  return (
    <div className="new-recipe">
            <p className="recipe-desc">To add a new recipe press the button below.</p>
            <Button func={() => show(-2)} text="New recipe"/>
    </div>

  )
}
