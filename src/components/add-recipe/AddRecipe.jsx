import './addrecipe.css' 
import { Fragment, useEffect, useState } from 'react';
import { useRef } from 'react';
import Button from '../button/Button';

export default function AddRecipe({recipe, close, notification, recipeFunction}) {
  //States

  const [step,setStep] = useState("");
  const [note,setNote] = useState("");
  const [iName,setIName] = useState("");
  const [iCan,setICan] = useState("");
  const [rName, setRName] = useState("");
  const [rDate, setRDate] = useState("");
  const [rImage, setRImage] = useState("");
  const [rPath, setRPath] = useState("");
  const [rFavourite, setRFavourite] = useState(false);
  const [rCategory, setRCategory] = useState("");
  const [rTime, setRTime] = useState("");
  const [rServings, setRServings] = useState("");
  const [rIngredients, setRIngredients] = useState({"all":[]});
  const [rSteps, setRSteps] = useState({"all":[]});
  const [rNotes, setRNotes] = useState([]);
  const [rDifficulty, setRDifficulty] = useState(0);

  //Refs

  const modalRef = useRef();
  const imageRef = useRef();


  //Effects

  useEffect(() => {
    
    if(recipe !== -1){
      setRName(recipe.name);
      setRPath(recipe.img);
      setRDate(recipe.date);
      setRCategory(recipe.details.category);
      setRTime(recipe.details.time);
      setRServings(recipe.details.servings);
      setRFavourite(recipe.favourite);
      setRIngredients({...recipe.ingredients});
      setRSteps({...recipe.steps});
      setRNotes([...recipe.notes]);
    }

    return () => {setRName("");
                  setRDate("");
                  setRPath("");
                  setRCategory("");
                  setRTime("");
                  setRServings("");
                  setRFavourite(false);
                  setRIngredients({"all":[]});
                  setRSteps({"all":[]});
                  setRNotes([]);
      };

  },[])

  useEffect(() => {
    document.addEventListener("keydown", closeModal);

    return () => {
      document.removeEventListener("keydown",closeModal);
    }
  },[])

  useEffect(() => {
    let time = parseFloat(String(rTime).replace(/[^\d\.]*/g, '')) || 0;
    const unit = String(rTime).replace(/[\d\.\ ]*/g, '');
    if(unit.toLowerCase() === "ore") {time = time * 60;}
    const ingredients = rIngredients.length;

    const localDiff = time + 10*ingredients;

    if(localDiff < 50){
      setRDifficulty(0);
    }else if(localDiff < 150){
      setRDifficulty(1);
    }else{
      setRDifficulty(2);
    }

  },[rIngredients, rTime]);

  //Functions
  
  const addIngredient = (e, key) => {

    if(iName.length === 0){
      notification("Type an ingredient");
      return;
    }

    if(iCan.length === 0){
      addIngredientGroup(iName);
      setIName("");
      setICan("");
      e.target.parentNode.childNodes[0].value="";
      e.target.parentNode.childNodes[1].value="";
      return;
    }
  
    const newGroup = [...rIngredients[key], iName+":"+iCan];
    setRIngredients(prev => ({...prev, [key]:newGroup}));
    setIName("");
    setICan("");
    e.target.parentNode.childNodes[0].value="";
    e.target.parentNode.childNodes[1].value="";
    e.target.parentElement.childNodes[0].focus();
  }

  const removeIngredient = (key, index) => {
    const newGroup = rIngredients[key].filter((ing, i) => i !== index);
    setRIngredients(prev => ({...prev,[key]:newGroup}));
  }

  const addIngredientGroup = (key) => {
    if(!rIngredients[key]){
      setRIngredients(prev => ({...prev, [key]:[]}));
    }
  }

  const removeIngredientGroup = (key) => {
    setRIngredients(prev => {
      const copy = {...prev};
      delete copy[key];
      return copy;
    });
  }

  const addSteps = (e, key) => {

    if(step.length === 0){
      notification("There are no instructions");
      return;
    }

    if(step[0] === '>'){
      addStepsGroup(step.replace('>',""));
      setStep("");
      e.target.parentNode.childNodes[0].value="";
      return;
    }

    const newGroup = [...rSteps[key], step];
    setRSteps(prev => ({...prev, [key]:newGroup}));
    setStep("");
    e.target.parentNode.childNodes[0].value="";
    e.target.parentElement.childNodes[0].focus();
  }

  const removeSteps = (key, index) => {
    const newGroup = rSteps[key].filter((ing, i) => i !== index);
    setRSteps(prev => ({...prev,[key]:newGroup}));
  }

  const addStepsGroup= (key) => {
    if(!rSteps[key]){
      setRSteps(prev => ({...prev, [key]:[]}));
    }
  }

  const removeStepsGroup= (key) => {
    setRSteps(prev => {
      const copy = {...prev};
      delete copy[key];
      return copy;
    });
  }

  const addNotes = (e) => {

    if(note.length === 0){
      notification("The note is empty");
      return;
    }

    setRNotes(prev => [...prev, note]);
    setNote("");
    e.target.parentElement.childNodes[0].focus();
  }

  const removeNotes = (index) => {
    setRNotes(prev => prev.filter((nt, i) => i !== index ));
  }

  const closeModal = (e) => {
    if(e.key === "Escape"){
        close(-3);
    }
  }


  const save = () => {
    let safe = true;
    const date = rDate.length === 0 ? Date.now() : rDate;
    const path = rPath.length === 0 ? `${date}_${rName.replace(/ /g,"_").toLowerCase()}.jpg` : rPath;

    const recipeNew = {
      "date": date,
      "name": rName,
      "img": path,
      "favourite": rFavourite,
      "details": {
        "category": rCategory,
        "servings": rServings,
        "time": rTime,
        "difficulty": rDifficulty,
      },
      "ingredients": rIngredients,
      "steps": rSteps,
      "notes": rNotes
    }

    if(recipe === -1 && imageRef.current.files.length === 0){
      notification("Choose an image");
      safe = false;
    }

    else if(rName.length === 0){
      notification("Type a name");
      safe = false;
    }

    else if(rCategory.length === 0){
      notification("Type a category");
      safe = false;
    }

    else if(rTime.length === 0){
      notification("Type how much time this recipe takes");
      safe = false;
    }

    else if(rServings.length === 0){
      notification("Type how many servings you get from this recipe");
      safe = false;
    }

    if(safe === true){
      recipeFunction(rImage, recipeNew);
      close(-3);
    }

  }

  //Rendering

  return (

    <div ref={modalRef} onClick={(e) => (e.target === e.currentTarget) && close(-3) } className="modal">

      <div className="add-recipe">
        <div className="add-recipe-header">
          
          <input type="text" autoFocus onKeyDown={e => {e.key === "Enter" && e.target.parentElement.parentElement.childNodes[1].childNodes[0].childNodes[1].childNodes[0].childNodes[1].focus()}} value={rName} onChange={(e) => setRName(e.currentTarget.value)} placeholder="Recipe name"/>
          <button className="close" onClick={() => close(-3)}></button>

        </div>
        
        <div className="add-recipe-body">

          <div className="left">

            <label>Image:

              <input ref={imageRef} type="file" onChange={(e) => {setRImage(e.target.files[0]); e.target.parentElement.childNodes[3].innerText=e.target.files[0].name}}/> 
              <span>Choose</span>
              <p className="file-name"></p>

            </label>

            <ul className="add-recipe-details">
                <li>
                  Category: <input type="text" onKeyDown={e => {e.key === "Enter" && e.target.parentElement.nextSibling.childNodes[1].focus()}} value={rCategory} onChange={(e) => setRCategory(e.target.value)} placeholder="Breakfast"/>
                </li>
                <li>
                  Time: <input type="text" onKeyDown={e => {e.key === "Enter" && e.target.parentElement.nextSibling.childNodes[1].focus()}} value={rTime} onChange={(e) => setRTime(e.target.value)} placeholder="25 minutes"/>
                </li>
                <li>
                  Servings: <input type="text" onKeyDown={e => {e.key === "Enter" && e.target.parentElement.parentElement.parentElement.childNodes[3].lastChild.childNodes[0].focus()}} value={rServings} onChange={(e) => setRServings(e.target.value)} placeholder="5 pieces"/>
                </li>
            </ul>

            <h3>Ingredients</h3>
            <ul className="add-recipe-scroll-lock">
              {
                rIngredients["all"]  && Object.keys(rIngredients).map((key, index) => {
                  return <Fragment key={index}>

                    {key !== "all" && <div> <h4>{key}</h4>  {rIngredients[key].length === 0 && <button onClick={() => removeIngredientGroup(key)} className="mini-remove"></button>} </div>}
                      
                    {rIngredients[key].map((ingredient, index) => { 
                    
                      return <li key={index}>
                        
                        <p>{ingredient.split(":")[0]}</p>
                        <p>{ingredient.split(":")[1]}</p>
                        <button onClick={() => removeIngredient(key,index)} className="mini-remove"></button>

                      </li>
                    })
                    }

                    <li>
                      <input type="text"  onKeyDown={e => {e.key === "Enter" && e.target.nextSibling.focus()}} onChange={e => setIName(e.target.value)} placeholder="Ingredient" />
                      <input type="text"  onKeyDown={e => {e.key === "Enter" && addIngredient(e,key)}} onChange={e => setICan(e.target.value)} placeholder="Amount"/>
                      <button onClick={e => addIngredient(e, key)} className="mini-add"></button>
                    </li>

                  </Fragment>
                })

              }
            </ul>

          </div>

          <div className="right">

            <div  className="add-recipe-scroll-lock">
              <h3>Instructions</h3>
              <ol>
              {
                rSteps["all"]  && Object.keys(rSteps).map((key, index) => {
                  return <Fragment key={index}>

                    {key !== "all" && <div> <h4>{key}</h4>  {rSteps[key].length === 0 && <button onClick={() => removeStepsGroup(key)} className="mini-remove"></button>} </div>}
                      
                    {rSteps[key].map((step, index) => { 
                    
                      return <li key={index}>
                        
                        <p>{step}</p>
                        <button onClick={() => removeSteps(key,index)} className="mini-remove"></button>

                      </li>
                    })
                    }
                    <li>
                      <input type="text" placeholder="Steps" onKeyDown={e => {e.key === "Enter" && addSteps(e, key)}} onChange={e => setStep(e.target.value)} />
                      <button onClick={e => addSteps(e, key)} className="mini-add"></button>
                    </li>

                  </Fragment>
                })

              }
              </ol>

              <h3>Notes</h3>
              <ul>
                {rNotes.map((note, index) => { return <li key={index}>
                  <p>{note}</p>
                  <button onClick={() => removeNotes(index)} className="mini-remove"></button>
                </li>})}
                <li>
                  <input type="text" placeholder="Notes" value={note} onKeyDown ={(e)=> {e.key==="Enter" && addNotes(e)}} onChange={e => setNote(e.target.value)} />
                  <button onClick={e => addNotes(e)} className="mini-add"></button>
                </li>
              </ul>
            </div>

          </div>

        </div>

        <div className="add-recipe-footer">
            <Button text="Save" func={() => save()}/>
        </div>

      </div>

    </div>

  )
}
