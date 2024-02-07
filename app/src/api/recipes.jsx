import axios from 'axios';
import {API_URL} from '../common/const';

const favouriteRecipe = "favourite";
const allRecipes = "recipes";
const addRecipes = "add";
const updateRecipe = "update";
const removeRecipe = "delete";

export const apiSetFavouriteRecipe = async(recipe_id) => {
    try{
        const response = await axios.put(`${API_URL}/${favouriteRecipe}/${recipe_id}`)
        return response;
    }catch(error){
        if(error.status === 404){
            return "404 error";
        }else{
            return error;
        }
    }
}

export const apiGetRecipes = async() => {
    try{
        const response = await axios.get(`${API_URL}/${allRecipes}`)
        return response;
    }catch(error) {
        Promise.reject(error);
        if(error.status === 404){
            return "404 error";
        }else{
            return error;
        }
    }
}

export const apiAddRecipe = async(recipe, id) => {
    try{
        const response = await axios.post(`${API_URL}/${addRecipes}/${id}`, recipe)
        return response;
    }catch(error) {
        if(error.status === 404){
            return "404 error";
        }else{
            return error;
        }
    }
}

export const apiUpdateRecipe = async(recipe, id) => {
    try{
        const response = await axios.put(`${API_URL}/${updateRecipe}/${id}`, recipe)
        return response;
    }catch(error) {
        if(error.status === 404){
            return "404 error";
        }else{
            return error;
        }
    }
}

export const apiRemoveRecipe = async(id) => {
    try{
        const response = await axios.delete(`${API_URL}/${removeRecipe}/${id}`)
        return response;
    }catch(error) {
        if(error.status === 404){
            return "404 error";
        }else{
            return error;
        }
    }
}


