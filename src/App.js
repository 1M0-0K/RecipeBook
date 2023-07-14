import { useEffect, useRef, useState } from 'react'
import Header from './components/header/Header'
import Recipes from './components/recipes/Recipes'
import Loading from './components/loading/Loading'
import useQuery from './useQuery';
import HeaderMobile from './components/header-mobile/HeaderMobile';

function App() {

  const {data:fetchedRecipeList, isLoading, error, setRequest} = useQuery("http://192.168.0.103:3001");

  //States

  const [categories,setCategories] = useState([]);
  const [favourite,setFavourite] = useState(false);
  const [search,setSearch] = useState("");
  const [newRecipe,setNewRecipe] = useState(true);
  const [recipeList,setRecipeList] = useState([]);
  const [selectedRecipes,setSelectedRecipes] = useState([]);
  const [filterCategories, setFilterCategories] = useState([]);

  const [sortBy, setSortBy] = useState(() => (a,b) => a.name>b.name?1:-1);


  //Refs
  
  const notificationDisplay = useRef();


  //Effects

  //Update the recipes based on search and categories and sort them 
  useEffect(() => {
    
    //Empty the updated recipes list every time it's updating 
    setSelectedRecipes([]);

    //Check if we selected a category
    if(filterCategories.length >0){
      //Get all recipes that contains the searched string, are in on of the selected categories
      //Check for favourites if it's the case
      //Sort the list by the selected criteria
      //Update the list with the selected recipes
      recipeList.filter(perRecipe => perRecipe.name.toLowerCase().includes(search.toLowerCase()))
      .filter(perRecipe => filterCategories.includes(perRecipe.details.category) && (favourite ? perRecipe.favourite === favourite : true))
      .sort(sortBy)
      .map( perRecipe => ( setSelectedRecipes(prevSelected => [...prevSelected,perRecipe])
      ));
    }else{
      recipeList.filter(perRecipe => perRecipe.name.toLowerCase().includes(search.toLowerCase()))
      .filter(perRecipe => favourite ? perRecipe.favourite === favourite : true)
      .sort(sortBy)
      .map( perRecipe => ( setSelectedRecipes(prevSelected => [...prevSelected,perRecipe])
      ));
    }
    
    //Check if we need to show the Add Recipe card
    if(search.length || filterCategories.length || favourite === true){
      setNewRecipe(false)
    }else{
      setNewRecipe(true)
    }

    return () => {
      setSelectedRecipes([]); 
    }

  }, [search, filterCategories, sortBy, recipeList, favourite])

  //Update the recipe list after we make a request to the server
  useEffect(() => {
  
    if(fetchedRecipeList !== null && fetchedRecipeList.recipes){
        setRecipeList(fetchedRecipeList.recipes);
    }

  }, [fetchedRecipeList])

  //Display errors in a notification
  useEffect(() => {

    if(error !== null){
      notification(error);
    }

  }, [error]);

  //Get all the categories from the recipes list
  useEffect(() => {

    recipeList.map(recipe => setCategories(prev => [...prev,recipe.details.category]));
    setCategories(prev => [...new Set(prev)]);

  },[recipeList]);

  //Functions
  
  //Function for adding new notifications 
  const notification = (message) => {
    //Display at most 3 notifications
    if(notificationDisplay.current.childElementCount > 3){
      return;
    }

    //Create a notification and display it 
    let newNot = document.createElement("div");
    newNot.classList.add("notification");
    newNot.textContent = message;

    notificationDisplay.current.insertBefore(newNot, notificationDisplay.current.childNodes[0]);

    setTimeout(() => {
      newNot.remove();
    }, 3000);

  }

  //Function for removing recipes
  const removeRecipe = (recipe) => {
    
      //Remove the recipe from the list
      const curRecipe = recipeList.filter(rec => rec.date !== recipe.date);
      // setRecipeList(prev => prev.filter(rec => rec.date !== recipe.date));
      
      //Prepare data 
      const data = new FormData();
      data.append('path', recipe.img);
      const fileRecipe = {recipes:curRecipe};
      data.append('recipes', JSON.stringify(fileRecipe));

      //Send a delete request to the server
      setRequest("DELETE",data);

  }

  //Function for adding recipes
  const addRecipe = (image, recipe) => {
    
    //Add the recipe to the list
    const curRecipe = [...recipeList, recipe];

    //Prepare data
    const data = new FormData();
    data.append('image', image);
    data.append('path', recipe.img);
    const fileRecipe = {recipes:curRecipe};
    data.append('recipes', JSON.stringify(fileRecipe));

    //Send a post request to the server
    setRequest("POST", data);
  }

  //Function for updating recipes
  const updateRecipe = (image, recipe) => {
    
    //Remove the recipe from the list
    const newRecipe = recipeList.filter(rec => rec.date !== recipe.date);
    //Add the updated recipe to the list
    const curRecipe = [...newRecipe, recipe];
    const fileRecipe = {recipes:curRecipe};

    //Prepare data
    const data = new FormData();
    if(image){
      data.append('image', image);
    }

    data.append('path', recipe.img);
    data.append('recipes', JSON.stringify(fileRecipe));

    //Send a put request to the server
    setRequest("PUT", data);
  }

  //Function to add a recipe to favourites
  const addFavourite = (recipe) => {

    //Toggle favourite status;
    recipe.favourite = !recipe.favourite;
    //Update the recipe
    const newRecipe = recipeList.filter(rec => rec.date !== recipe.date);
    const curRecipe = [...newRecipe, recipe];
    const fileRecipe = {recipes:curRecipe};

    //Prepare data
    const data = new FormData();
    data.append('recipes', JSON.stringify(fileRecipe));

    //Send a put request to the server
    setRequest("PUT", data);
  }



  //Rendering
  return (
    <div className="container">

      <HeaderMobile />

      <Header setSearch={setSearch} search={search} setFilterCategories={setFilterCategories} categories={categories} filterCategories={filterCategories} setSortBy={setSortBy} notification={notification} setFavourite={setFavourite} favourite={favourite}/>

      {isLoading && <Loading/>}
      {!isLoading &&<Recipes recipes={selectedRecipes} addRecipe={addRecipe} newRecipe={newRecipe} removeRecipe={removeRecipe} notification={notification} addFavourite={addFavourite} updateRecipe={updateRecipe}/>}

      <div id="notifications" ref={notificationDisplay}></div>
    </div>
  );
}

export default App;

