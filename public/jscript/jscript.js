((window, document, undefined)=>{
  'use strict'

  //Selectors
  const form = document.querySelector("form.search-form");
  const search = document.querySelector(".search-form>div>input");
  const sort = document.querySelector(".sort-by"); 
  const resetFilers = document.querySelector("#filters-reset");
  const clearSearch = document.querySelector(".clear");
  const favourite = document.querySelector(".filter>li>input#fav").parentElement;
  const newRecipe = document.querySelector(".new-recipe");
  const notificationsDisplay = document.querySelector("#notifications");

  const recipesList = document.querySelector(".recipes");
  const categoriesList = document.querySelector(".filter");
  const editRecipe = document.querySelector("#edit-recipe");
  const viewRecipe = document.querySelector("#full-recipe");
  const modals = document.querySelectorAll(".modal");
  const closeBtns = document.querySelectorAll(".close");
  const removeBtn = document.querySelector(".full-recipe-footer>button:first-child");
  const addBtn = document.querySelector(".add-recipe-footer>button");
  const dialog = document.querySelector(".modal-dialog");
  const dialogMessage = dialog.querySelector(".dialog-body>p");
  const dialogYes = dialog.querySelector(".dialog-footer>button:first-child");
  const dialogNo = dialog.querySelector(".dialog-footer>button:last-child");
  const dialogClose = dialog.querySelector(".dialog-close");
  let dialogFunction;

  const addName = document.querySelector(".add-recipe-header>input");
  const addImage = document.querySelector(".add-recipe-body>.left input[type='file']");
  const addCategory = document.querySelector(".add-recipe-details>li:first-child>input");
  const addTime = document.querySelector(".add-recipe-details>li:nth-child(2)>input");
  const addServings = document.querySelector(".add-recipe-details>li:last-child>input");
  const addIngredients = document.querySelector(".add-recipe-scroll-lock");
  const addInstructions = document.querySelector(".right>.add-recipe-scroll-lock>ol");
  const addNotes = document.querySelector(".right>.add-recipe-scroll-lock>ul");
  const addImageName = document.querySelector(".add-recipe-body .left .file-name");
  

  let newRecipeName = '';
  let newRecipeImg = '';
  let newRecipeFavourite = 0;
  let newRecipeCategory = '';
  let newRecipeServings = '';
  let newRecipeTime = '';
  let newRecipeIngredients = {"all": []};
  let newRecipeSteps = {"all": []};
  let newRecipeNotes = {"all": []};

  let searchValue = '';
  let sortValue = '';
  let favouriteValue = 0;
  let categoriesValue = [];

  let timer;

  //Methods

  const debounce = (func) => {
    clearTimeout(timer);
    timer = setTimeout(func, 1000);
  }

  const displayNotification = (type, message) => {

      let newNot = document.createElement("div");
      newNot.classList.add("notification");
      switch(type){
          case "error":
              newNot.classList.add("error");
          break;
          default:
              newNot.classList.add("info");
      }
      newNot.textContent = message;

      notificationsDisplay.appendChild(newNot);


      setTimeout(() => {
          newNot.remove();
      }, 3000);

  }

  const searchChangeHandle = (e) => {
    (e.target.value.length>0) ? search.classList.add("filled") : search.classList.remove("filled");

    searchValue = e.target.value;
    debounce(fetchRecipes);
  }

  const sortChangeHandle = (e) => {
    sortValue = e.target.value;
    debounce(fetchRecipes);
  }

  const generateURL = () => {
    let url = '';
    if(sortValue.length > 0 && sortValue != 'name'){
      url += '/' + sortValue;
    }
    if(favouriteValue == 1){
      url += '/' + favouriteValue;
    }
    if(categoriesValue.length > 0){
      url += '/cat,' + categoriesValue.join(',');
    }
    if(searchValue.length > 0){
      url += '/' + searchValue;
    }
    return url;
  }

  const resetFiltersHandle = () => {
    search.value = "";
    searchValue = "";
    sort.value = "name";
    sortValue = "";
    favouriteValue = 0;
    categoriesValue = [];
    const cats = document.querySelectorAll(".filters .filter input");

    for(let i = 0; i< cats.length; i++){
      cats[i].checked = false;
    }

    fetchRecipes();
  }

  const clearSearchHandle = () => {
    search.value = "";
    searchValue = "";
    search.classList.remove("filled")
    search.focus();
  }

  const checkCategoryHandle = (category) => {
    if(categoriesValue.includes(category.value)){
      categoriesValue = [...categoriesValue.filter(cat => cat !== category.value)];
    }else{
      categoriesValue = [...categoriesValue, category.value];
    }
    debounce(fetchRecipes);
  }

  const checkFavouriteHandle = (e) => {
    favouriteValue = !e.checked ? 1 : 0;
    fetchRecipes();
  }

  const clearElement = (el, defaultElement = newRecipe) => {
    el.replaceChildren(defaultElement);
  }

  const displayRecipes = (recipes) => {
    clearElement(recipesList);
    if(recipes.length > 0 && typeof(recipes) !== "string"){
      recipes.map( recipe => {
        
        recipesList.innerHTML += `
          <div class="recipe" data-id="${recipe.id}">
            <div class="recipe-image">
            <img src="${recipe.img.length > 0 ? "./images/" + recipe.img : "./img/logo.png"}" alt="${recipe.name}" />
            <div class="${recipe.favourite === '1' ? 'recipe-heart selected' : 'recipe-heart' }">
                <i></i>
              </div>
            </div>
            <div class="recipe-details">
              
            <h3 class="recipe-name">${recipe.name}</h3>
              <ul class="recipe-stats">
                <li class="recipe-difficulty">
                  <i class="${recipe.difficulty > 0 && "selected"}"></i>
                  <i class="${recipe.difficulty > 1 && "selected"}"></i>
                  <i class="${recipe.difficulty > 2 && "selected"}"></i>
                </li>
                <li class="recipe-time">
                  <i></i>
                  <p>${recipe.time}</p>
                </li>
                <li class="recipe-favourite">
                  <i class="${recipe.favourite == 1 && "selected"}"></i>
                </li>
              </ul>

            </div>

          </div>
        `;
      });
    } 
    
  }

  const displayCategories = (categories) => {
    clearElement(categoriesList, favourite);

    categories.map(category => {
      categoriesList.innerHTML += `
        <li class="category">
          <input type="checkbox" value="${category.category}" name="${category.category}"  id="${category.category}">
          <label for="${category.category}" class="checkmark">
            ${category.category}
          </label>
        </li>
      `;
    })
  }

  const displayRecipe = (id) => {
    localStorage.setItem("recipe", JSON.stringify(id));
    viewRecipe.dataset["id"] = id.id;
    viewRecipe.querySelector(".full-recipe-header>h2").innerText = id.name;
    viewRecipe.querySelector(".full-recipe-image>img").src = id.img.length > 0 ? `/images/${id.img}` : "./img/logo.png";
    if(id.favourite === "1") viewRecipe.querySelector(".full-recipe-image>div").classList.add("selected");
    viewRecipe.querySelector(".recipe-category>p").innerText = id.category;
    viewRecipe.querySelector(".recipe-time>p").innerText = id.time;
    viewRecipe.querySelector(".recipe-difficulty").classList.add(`d${id.difficulty}`);
    viewRecipe.querySelector(".recipe-difficulty>p").innerText = (id.difficulty === 1) ? "Easy" : (id.difficulty === 2) ? "Medium": "Hard";
    viewRecipe.querySelector(".recipe-serving>p").innerText = id.servings;

    viewRecipe.querySelector(".left .full-recipe-scroll-lock").innerHTML = ""; 
    let ingredients = JSON.parse(id.ingredients);
    Object.keys(ingredients).map((part) => {

      if(part !== "all"){
        viewRecipe.querySelector(".left .full-recipe-scroll-lock").innerHTML += `<h4>${part}</h4>`;
      }

      ingredients[part].map((ing) => { 
        viewRecipe.querySelector(".left .full-recipe-scroll-lock").innerHTML += `<li><p>${ing.split(":")[0]}</p><p>${ing.split(":")[1]}</p></li>`
        })
    });

    viewRecipe.querySelector(".right .full-recipe-scroll-lock>ol").innerHTML  = "";
    let steps = JSON.parse(id.steps);
    Object.keys(steps).map((part) => {

      if(part !== "all"){
        viewRecipe.querySelector(".right .full-recipe-scroll-lock>ol").innerHTML += `<h4>${part}</h4>`
      }

      steps[part].map((step) => { 
        viewRecipe.querySelector(".right .full-recipe-scroll-lock>ol").innerHTML += `<li><p>${step}</p></li>`
        })
    });
    
    viewRecipe.querySelector(".right .full-recipe-scroll-lock>ul").innerHTML = "";
    let notes = JSON.parse(id.notes);
    notes["all"].map((note) => { 
      viewRecipe.querySelector(".right .full-recipe-scroll-lock>ul").innerHTML += `<li><p>${note}</p></li>`
      })
  }

  const displayIngredients = (element, ingredients) => {
    element.innerHTML = "";
    ingredients["all"]  && Object.keys(ingredients).map((key) => {

      if(key !== "all"){
        if(ingredients[key].length === 0){
          element.innerHTML += `<div><h4>${key}</h4><button data-group-id="${key}" class="mini-remove ingredient-group-remove"></button></div>`;
        }else{
          element.innerHTML += `<div><h4>${key}</h4></div>`;
        }
      }
        
      ingredients[key].map((ingredient, index) => { 
      
        element.innerHTML +=  `<li>
          
          <p>${ingredient.split(":")[0]}</p>
          <p>${ingredient.split(":")[1]}</p>
          <button data-group-id=${key} data-item-id=${index} class="mini-remove ingredient-remove"></button>

        </li>`
      })
      
      element.innerHTML += `<li>
        <input type="text" placeholder="Ingredient" />
        <input type="text" placeholder="Amount"/>
        <button data-group-id=${key} class="mini-add ingredient-add"></button>
      </li>`

    })
  }

  const displayInstructions = (element, steps) => {
    element.innerHTML = "";
    steps["all"]  && Object.keys(steps).map((key) => {

      if(key !== "all"){
        if(steps[key].length === 0){
          element.innerHTML += `<div><h4>${key}</h4><button data-group-id=${key} class="mini-remove step-group-remove"></button></div>`;
        }else{
          element.innerHTML += `<div><h4>${key}</h4></div>`;
        }
      }
        
      steps[key].map((step, index) => { 
      
        element.innerHTML +=  `<li>
          
          <p>${step}</p>
          <button data-group-id=${key} data-item-id=${index} class="mini-remove step-remove"></button>

        </li>`
      })
      
      element.innerHTML += `<li>
        <input type="text" placeholder="Steps" />
        <button data-group-id=${key} class="mini-add step-add"></button>
      </li>`

    })
  }

  const displayNotes = (element, notes) => {
    element.innerHTML = "";
    
    notes["all"].map((note, index) => { 
      element.innerHTML +=`<li>
        <p>${note}</p>
        <button data-item-id=${index} class="mini-remove note-remove"></button>
      </li>`;
    })
      
    element.innerHTML += `<li>
      <input type="text" placeholder="Notes" />
      <button data-group-id="all" class="mini-add note-add"></button>
    </li>`;

  }

  //Update recipe's data 
  
  const addIngredient = (e, key) => {

    let iName = e.parentNode.children[0];
    let iCan = e.parentNode.children[1];

    if(iName.value.length === 0){
      displayNotification("error", "Type an ingredient");
      return;
    }

    if(iCan.value.length === 0){
      addIngredientGroup(iName.value);
      iName.value = "";
      iCan.value = "";
      displayIngredients(addIngredients, newRecipeIngredients);
      return;
    }
  
    const newGroup = [...newRecipeIngredients[key], iName.value+":"+iCan.value];
    newRecipeIngredients = {...newRecipeIngredients, [key]:newGroup};

    displayIngredients(addIngredients, newRecipeIngredients);

    iName.value = "";
    iCan.value = "";
    iName.focus();
  }

  const removeIngredient = (key, index) => {
    const newGroup = newRecipeIngredients[key].filter((ing, i) => i != index);
    newRecipeIngredients = {...newRecipeIngredients, [key]:newGroup};
    displayIngredients(addIngredients, newRecipeIngredients);
  }

  const addIngredientGroup = (key) => {
    if(!newRecipeIngredients[key]){
      newRecipeIngredients = {...newRecipeIngredients, [key]:[]};
    }
  }

  const removeIngredientGroup = (key) => {
    const copy = {...newRecipeIngredients};
    delete copy[key];
    newRecipeIngredients = {...copy};
    displayIngredients(addIngredients, newRecipeIngredients);
  }

  const addSteps = (e, key) => {
    let step = e.parentNode.children[0];

    if(step.value.length === 0){
      displayNotification("error", "Type a step!");
      return;
    }

    if(step.value[0] === '>'){
      addStepsGroup(step.value.replace('>',""));
      step.value = "";
      displayInstructions(addInstructions, newRecipeSteps);
      return;
    }

    const newGroup = [...newRecipeSteps[key], step.value];
    newRecipeSteps = {...newRecipeSteps, [key]:newGroup};

    displayInstructions(addInstructions, newRecipeSteps);
    step.value = "";
    step.focus();
  }

  const removeSteps = (key, index) => {
    const newGroup = newRecipeSteps[key].filter((ing, i) => i != index);
    newRecipeSteps = {...newRecipeSteps, [key]:newGroup};
    displayInstructions(addInstructions, newRecipeSteps);
  }

  const addStepsGroup = (key) => {
    if(!newRecipeSteps[key]){
      newRecipeSteps = {...newRecipeSteps, [key]: []};
    }
  }

  const removeStepsGroup = (key) => {
    const copy = {...newRecipeSteps};
    delete copy[key];
    newRecipeSteps = {...copy};
    displayInstructions(addInstructions, newRecipeSteps);
  }

  const addNote = (e) => {

    let note = e.parentNode.children[0];

    if(note.value.length === 0){
      displayNotification("error", "Type a note!");
      return;
    }

    const notes = [...newRecipeNotes["all"], note.value];
    newRecipeNotes = {"all": notes};
    displayNotes(addNotes, newRecipeNotes);
    note.value = "";
    note.focus();
  }

  const removeNote = (index) => {
    const notes = newRecipeNotes["all"].filter((ing, i) => i != index);
    newRecipeNotes = {"all": notes};
    displayNotes(addNotes, newRecipeNotes);
  }

  const getDifficulty = () => {
    let difficulty;
    let time = parseFloat(String(newRecipeTime).replace(/[^\d\.]*/g, '')) || 0;
    const unit = String(newRecipeTime).replace(/[\d\.\ ]*/g, '');
    if(unit.toLowerCase() === "hours" || unit.toLowerCase() === "hour") {time = time * 60;}
    let ingredients = 0;
    Object.keys(newRecipeIngredients).map((key) => ingredients += newRecipeIngredients[key].length);

    const localDiff = time + 10 * ingredients;

    if(localDiff < 50){
      difficulty = 0;
    }else if(localDiff < 150){
      difficulty = 1;
    }else{
      difficulty = 2;
    }

    return difficulty;
  }

  const fillRecipeHandle = (recipe) => {
    newRecipeName = '';
    newRecipeImg = '';
    newRecipeFavourite = 0;
    newRecipeCategory = '';
    newRecipeServings = '';
    newRecipeTime = '';
    newRecipeIngredients = {"all": []};
    newRecipeSteps = {"all": []};
    newRecipeNotes = {"all": []};

    if(recipe){

      newRecipeName = recipe.name;
      newRecipeImg = recipe.img;
      newRecipeFavourite = recipe.favourite;
      newRecipeCategory = recipe.category;
      newRecipeServings = recipe.servings;
      newRecipeTime = recipe.time;
      newRecipeIngredients = JSON.parse(recipe.ingredients);
      newRecipeSteps = JSON.parse(recipe.steps);
      newRecipeNotes = JSON.parse(recipe.notes);
    }
    
    addName.value = newRecipeName;
    addCategory.value = newRecipeCategory;
    addTime.value = newRecipeTime;
    addServings.value = newRecipeServings;
    displayIngredients(addIngredients, newRecipeIngredients);
    displayInstructions(addInstructions, newRecipeSteps);
    displayNotes(addNotes, newRecipeNotes);

    if(editRecipe.style.display === "none"){
      editRecipe.style.display = "flex";
    }else{
      editRecipe.style.display = "none";
    }
  }

  const addRecipe = () => {
    const recipe = JSON.parse(localStorage.getItem("recipe"));
    let safe = true;
    let message;
 
    if(!recipe && !newRecipeImg){
      message = "Choose an image";
      safe = false;
    }

    else if(newRecipeName.length === 0){
      message = "Type a name";
      safe = false;
    }

    else if(newRecipeCategory.length === 0){
      message = "Type a category";
      safe = false;
    }

    else if(newRecipeTime.length === 0){
      message = "Type how much time this recipe takes";
      safe = false;
    }

    else if(newRecipeServings.length === 0){
      message = "Type how many servings you get from this recipe";
      safe = false;
    }
    
    if(safe){

      const  path = recipe ? recipe.img : `${Date.now()}_${newRecipeName.replace(/ /g,"_").toLowerCase()}.jpg`;

      const recipeNew = {
        "name": newRecipeName,
        "img": path,
        "favourite": newRecipeFavourite,
        "category": newRecipeCategory,
        "servings": newRecipeServings,
        "time": newRecipeTime,
        "difficulty": getDifficulty(),
        "ingredients": newRecipeIngredients,
        "steps": newRecipeSteps,
        "notes": newRecipeNotes
      }
      
      if(recipe){
        recipeNew.id  = recipe.id;
      }
      const data = new FormData();
      data.append('image', newRecipeImg);
      data.append('recipe', JSON.stringify(recipeNew));

      if(recipe){
        updateRecipe(data);
      }else{
        insertRecipe(data);
      }

    }else{
      displayNotification("error", message);
    }
  }

  const viewRecipeHandle = (id) => {
    fetchRecipe(id);

    if(viewRecipe.style.display === "none"){
      viewRecipe.style.display = "flex";
    }else{
      viewRecipe.style.display = "none";
    }
  }

  const changeImageHandle = (e) => {
    newRecipeImg = e.target.files[0];
    addImageName.innerText  = e.target.files[0]?.name;
  }

  const changeNameHandle = (e) => {
    newRecipeName = e.target.value;
  }

  const changeCategoryHandle = (e) => {
    newRecipeCategory = e.target.value;
  }

  const changeTimeHandle = (e) => {
    newRecipeTime = e.target.value;
  }

  const changeServingsHandle = (e) => {
    newRecipeServings = e.target.value;
  }

  const displayDialog = (msg, func) => {
    dialogMessage.innerText = msg;
    dialogFunction = func;
    dialog.style.display = "flex";
  }

  const closeViewModal = () => {
    modals[1].style.display = "none";
  }

  const closeAddModal = () => {
    localStorage.removeItem("recipe");
    modals[0].style.display = "none";
    addImageName.innerText = "";
    addImage.value = "";
  }
  
  const closeDialog = () => {
    dialog.style.display = "none";
  }

  const removeRecipe = () => {
    fetch('./api/recipe/' + viewRecipe.dataset['id'], {'method' : 'DELETE'}).then(data => data.text()).then(data => {
      closeViewModal();
      fetchRecipes(); 
      data.length > 0 && displayNotification("error", data);
    });
  }
  const insertRecipe = (data) => {
    fetch('./api/recipe/', {'method' : 'POST', 'body': data}).then(data => data.text()).then(data => {
      closeAddModal();
      fetchRecipes();
      data.length > 0 && displayNotification("error", data);
    });
  }

  const updateRecipe = (data) => {
    fetch('./api/recipe/update', {'method' : 'POST', 'body': data}).then(data => data.text()).then(data => {
      closeAddModal();
      fetchRecipes();
      data.length > 0 && displayNotification("error", data);
    });
  }

  const fetchRecipes = () => {
    fetch('./api/recipes' + generateURL()).then(data => data.json()).then(data => displayRecipes(data));
  }

  const fetchRecipe = (id) => {
    fetch('./api/recipe/' + id).then(data => data.json()).then(data => displayRecipe(data));
  }

  const fetchCategories = () => {
    fetch('./api/categories').then(data => data.json()).then(data => displayCategories(data));
  }

  const toggleFavourite = (e) => {
    let id = e.target.closest("div.recipe");
    id ?? (id = e.target.closest("div#full-recipe"));
    id = id.dataset["id"];
    fetch('./api/favourite/' + id).then(data => data.text()).then(data => data && fetchRecipes());
  }

  //Events
  form.onsubmit = (e) => e.preventDefault();

  search.addEventListener("keyup", searchChangeHandle); 
  sort.addEventListener("change", sortChangeHandle);

  clearSearch.addEventListener("click", clearSearchHandle);

  resetFilers.addEventListener("click", resetFiltersHandle);

  modals[0].addEventListener("click", (e) => (e.target === e.currentTarget) && closeAddModal());
  modals[1].addEventListener("click", (e) => (e.target === e.currentTarget) && closeViewModal());
  closeBtns[0].addEventListener("click", closeAddModal);
  closeBtns[1].addEventListener("click", closeViewModal);
  removeBtn.addEventListener("click", () => displayDialog("Do you want to remove this recipe?", removeRecipe));
  addBtn.addEventListener("click", addRecipe);
  dialogYes.addEventListener("click", () => {closeDialog(); dialogFunction();});
  dialogNo.addEventListener("click", () => {closeDialog();});
  dialogClose.addEventListener("click", () => {closeDialog();});

  addImage.addEventListener("change", changeImageHandle);

  addEventListener("keydown", (e) => {
    if(e.key === "Escape"){
      closeAddModal();
      closeViewModal();
    }
  })

  addName.addEventListener("keyup", changeNameHandle);
  addCategory.addEventListener("keyup", changeCategoryHandle);
  addTime.addEventListener("keyup", changeTimeHandle);
  addServings.addEventListener("keyup", changeServingsHandle);

  addEventListener("mouseup", (e) => {
    if(e.target.closest("div.recipe-heart")){
      toggleFavourite(e);
    }else if(e.target.closest("div.recipe") && !e.target.closest("div.recipe-heart")){
      viewRecipeHandle(e.target.closest("div.recipe").dataset["id"]);
    }else if(e.target.closest("button.new-recipe-btn")){
      fillRecipeHandle();
    }else if(e.target.closest(".full-recipe-footer>button:last-child")){
      closeViewModal();
      fillRecipeHandle(JSON.parse(localStorage.getItem("recipe")));
    }else if(e.target.parentElement.classList.contains("category")){
      let element = e.target.parentElement.children[0];
      checkCategoryHandle(element);
    }else if(e.target.parentElement.classList.contains("favourite")){
      let element = e.target.parentElement.children[0];
      checkFavouriteHandle(element);
    }else if(e.target.classList.contains("ingredient-add")){
      addIngredient(e.target, e.target.dataset['groupId']);
    }else if(e.target.classList.contains("ingredient-remove")){
      removeIngredient(e.target.dataset['groupId'], e.target.dataset['itemId']);
    }else if(e.target.classList.contains("ingredient-group-remove")){
      removeIngredientGroup(e.target.dataset['groupId']);
    }else if(e.target.classList.contains("step-add")){
      addSteps(e.target, e.target.dataset['groupId']);
    }else if(e.target.classList.contains("step-remove")){
      removeSteps(e.target.dataset['groupId'], e.target.dataset['itemId']);
    }else if(e.target.classList.contains("step-group-remove")){
      removeStepsGroup(e.target.dataset['groupId']);
    }else if(e.target.classList.contains("note-add")){
      addNote(e.target, e.target.dataset['groupId']);
    }else if(e.target.classList.contains("note-remove")){
      removeNote(e.target.dataset['itemId']);
    }
  })

  addEventListener("load", () => {
    fetchCategories();
    fetchRecipes();
  })

})(window, document);
