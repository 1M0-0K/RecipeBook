import './newrecipe.css' 
import Button from '../button/Button';
import {useDispatch} from "react-redux";
import {setUpdateRecipe} from '../../reducers/recipes';

export default function NewRecipe() {

    const dispatch = useDispatch();

    //Rendering
    return (
    <div className="new-recipe">
            <p className="recipe-desc">To add a new recipe press the button below.</p>
            <Button func={() => dispatch(setUpdateRecipe("new"))} text="New recipe"/>
    </div>

    )
}
