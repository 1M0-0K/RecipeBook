import './recipes.css' 
import NewRecipe from '../new-recipe/NewRecipe'
import Recipe from '../recipe/Recipe'
import FullRecipe from '../full-recipe/FullRecipe';
import AddRecipe from '../add-recipe/AddRecipe';
import Loading from '../loading/Loading';
import { useState, useEffect} from 'react';
import {useSelector as selector, useDispatch} from "react-redux";
import {
    isNewRecipe,
    setNewRecipe,
    getFullRecipe,
    getUpdateRecipe,
    loadRecipes,
    getRecipes,
    getSearchValue,
    getSortBy,
    getSelectedCategories,
    getViewFavourite
} from '../../reducers/recipes'

export default function Recipes() {

    //Defs
    const dispatch = useDispatch();
    const recipes = selector(getRecipes);
    const searchValue = selector(getSearchValue);
    const sortBy = selector(getSortBy);
    const categories = selector(getSelectedCategories); 
    const favourite = selector(getViewFavourite);
    const [selectedRecipes, setSelectedRecipes] = useState([]);
    const newRecipe = selector(isNewRecipe);
    const fullRecipe = selector(getFullRecipe);
    const updateRecipe = selector(getUpdateRecipe);
    const [loading,setLoading] = useState(false);

    //Effects

    useEffect( () => {
        dispatch(loadRecipes());
    }, [])


    //Update the recipes based on search and categories and sort them 
    useEffect(() => {
        //Empty the updated recipes list every time it's updating 
        setSelectedRecipes([]); 

        //Get all recipes that contains the searched string, are in on of the selected categories
        //Check for favourites if it's the case
        //Sort the list by the selected criteria
        //Update the list with the selected recipes
        recipes && selectedRecipes && setSelectedRecipes(
            recipes.filter(recipe => recipe.name.toLowerCase().includes(searchValue.toLowerCase()))
                   .filter(recipe => (categories.length > 0 ? categories.includes(recipe.category) : true) && (favourite ? recipe.favourite === favourite : true))
                   .sort(sortBy)
        )

        //Check ifewe need to show the Add Recipe card
        if(searchValue.length || categories.length || favourite === 1){
            dispatch(setNewRecipe(false));
        }else{
            dispatch(setNewRecipe(true));
        }


        return () => {
            setSelectedRecipes([]); 
        }

    }, [searchValue, sortBy, categories, favourite])

    //Update recipes when the recipes are requested from the server
    useEffect(() => {
        setSelectedRecipes(recipes);
    }, [recipes])

    useEffect(() => {
        if(selectedRecipes){
            setLoading(false);
        }else{
            setLoading(true);
        }
    }, [selectedRecipes])

 
//Rendering
    return (

        <main>

            {loading && <Loading/>}

            {!loading && 
            <>

                <div className="recipes">
                  
                    {newRecipe && <NewRecipe/>}


                    {(selectedRecipes !== null) && selectedRecipes.map( recipe => (
                      
                        <Recipe key={recipe.id} recipe={recipe}/>

                    ))}

                </div>
                {(updateRecipe !== null && updateRecipe !== "new") && selectedRecipes
                .filter(recipe => recipe.id === updateRecipe)
                .map(recipe => 
                    <AddRecipe key={recipe.id} recipe={recipe}/> 
                )}
                
                {
                    (updateRecipe === "new") && <AddRecipe recipe={-1}/>
                }
                {(fullRecipe !== null) && selectedRecipes
                .filter(recipe => recipe.id === fullRecipe)
                .map(recipe => 
                    <FullRecipe key={recipe.id} recipe={recipe}/>
                )}

            </>
            }

        </main>

    )
}
