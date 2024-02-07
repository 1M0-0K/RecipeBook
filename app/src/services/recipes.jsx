import {
    apiAddRecipe,
    apiGetRecipes,
    apiSetFavouriteRecipe,
    apiUpdateRecipe,
    apiRemoveRecipe,
} from '../api/recipes';

export const sSetFavourite = async(id) => {
    try{    
        const response = apiSetFavouriteRecipe(id);
        return response;
    }catch(error){
        return error;
    }
}

export const sAddRecipe = async(recipe, id) => {
    try{
        const response = await apiAddRecipe(recipe, id);
        return response;
    }catch(error){
        return error;
    }
}

export const sGetRecipes = async() => {
    try{
        const response = await apiGetRecipes();
        return response;
    }catch(error){
        return error;
    }
}

export const sUpdateRecipe = async(recipe, id) => {
    try{
        const response = await apiUpdateRecipe(recipe, id);
        return response;
    }catch(error){
        return error;
    }
}

export const sRemoveRecipe = async(id) => {
    try{
        const response = await apiRemoveRecipe(id);
        return response;
    }catch(error){
        return error;
    }
}
