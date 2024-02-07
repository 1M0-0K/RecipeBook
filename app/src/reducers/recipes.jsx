import { createSlice } from '@reduxjs/toolkit';
import {
    sAddRecipe,
    sSetFavourite,
    sGetRecipes,
    sUpdateRecipe,
    sRemoveRecipe,
} from '../services/recipes';
import {useSelector as selector} from 'react-redux';
import {addNotification} from './notification';

const byName = (a, b) => a.name>b.name?1:-1;

export const recipes = createSlice({
    name: "recipes",
    initialState:{
        recipes: null, 
        newRecipe: true,
        fullRecipe: null,
        updateRecipe: null,
        categories: null,
        searchValue: "",
        sortBy: byName,
        viewFavourite: 0,
        selectedCategories: [] 
    },
    reducers: {
        setRecipes: (state, {payload}) => {
            return {
                ...state,
                recipes: payload
            };
        },

        setNewRecipe: (state, {payload}) => {
            return {
                ...state,
                newRecipe: payload
            };
        },

        setFullRecipe: (state, {payload}) => {
            return {
                ...state,
                fullRecipe: payload
            };
        },

        setUpdateRecipe: (state, {payload}) =>{
            return{
                ...state,
                updateRecipe: payload
            };
        },

        setSortBy: (state, {payload}) =>{
            return{
                ...state,
                sortBy: payload
            };
        },

        setCategories: (state, {payload}) =>{
            return{
                ...state,
                categories: payload
            };
        },

        setSearchValue: (state, {payload}) =>{
            return{
                ...state,
                searchValue: payload
            };
        },

        setViewFavourite: (state, {payload}) =>{
            return{
                ...state,
                viewFavourite: payload
            };
        },

        setSelectedCategories: (state, {payload}) =>{
            return{
                ...state,
                selectedCategories: payload
            };
        }
    }
    
})

export const loadRecipes = () => async(dispatch) => {
    try{
        const fetchedRecipes = await sGetRecipes();
        if(fetchedRecipes){
            const recipes = fetchedRecipes.data.data;
            if(await dispatch(setRecipes(recipes))){
                const categories = recipes.map(recipe =>  recipe.category);
                dispatch(setCategories([...new Set(categories)]));
            }
        }
    }catch(error){
        console.log(error);
    }
}

export const toggleFavouriteRecipe = (id) => async(dispatch) => {
    try{
        const favourite = await sSetFavourite(id);
        if(favourite.data.data === "favourite_success"){
            dispatch(loadRecipes());
        }else{
            dispatch(addNotification(["error","Sorry, there was a problem. Please try again."]))
        }
        
    }catch(error){
        console.log(error);
    }
}

export const addRecipe = (recipe, image) => async(dispatch) => {
    try{
        const data = new FormData();
        data.append('recipe', JSON.stringify(recipe));
        data.append('image', image);
        const response = await sAddRecipe(data, recipe.id);
        if(response.data.data === "add_success"){
            dispatch(loadRecipes());
        }else{
            dispatch(addNotification(["error","The recipe could not be saved. Please try again."]))
        }
    }catch(error){
        console.log(error);
    }

}

export const updateRecipe = (recipe, image) => async(dispatch) => {
    try{
        const data = new FormData();
        data.append('recipe', JSON.stringify(recipe));
        if(image){
            data.append('image', image);
        }
        
        const response = await sUpdateRecipe(data,recipe.id);
        if(response.data.data === "update_success"){
            dispatch(loadRecipes());
        }else{
            dispatch(addNotification(["error","The recipe could not be changed. Please try again."]))
        }
    }catch(error){
        console.log(error);
    }

}

export const removeRecipe = (recipeId) => async(dispatch) => {
    try{
        const response = await sRemoveRecipe(recipeId);
        if(response.data.data === "remove_success"){
            dispatch(loadRecipes());
        }else{
            dispatch(addNotification(["error","The recipe could not be removed. Please try again."]))
        }
    }catch(error){
        console.log(error);
    }

}

export const {setRecipes} = recipes.actions;
export const {setNewRecipe} = recipes.actions;
export const {setFullRecipe} = recipes.actions;
export const {setUpdateRecipe} = recipes.actions;
export const {setCategories} = recipes.actions;
export const {setSortBy} = recipes.actions;
export const {setSearchValue} = recipes.actions;
export const {setViewFavourite} = recipes.actions;
export const {setSelectedCategories} = recipes.actions;

export const isNewRecipe = ({recipes: {newRecipe}}) => newRecipe;
export const getRecipes = ({recipes: {recipes}}) => recipes;
export const getFullRecipe = ({recipes: {fullRecipe}}) => fullRecipe;
export const getUpdateRecipe = ({recipes: {updateRecipe}}) => updateRecipe;
export const getCategories = ({recipes: {categories}}) => categories;
export const getSearchValue = ({recipes: {searchValue}}) => searchValue;
export const getSortBy = ({recipes: {sortBy}}) => sortBy;
export const getViewFavourite = ({recipes: {viewFavourite}}) => viewFavourite;
export const getSelectedCategories = ({recipes: {selectedCategories}}) => selectedCategories;

export default recipes.reducer;


