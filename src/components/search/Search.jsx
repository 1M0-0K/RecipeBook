import { useEffect, useState } from 'react'
import './search.css' 

export default function Search({setSearch, search}) {

  //State
  const [recipe,setRecipe] = useState("");

  //Function

  const onChange = (e)=>{
    setRecipe(e.target.value);
    setSearch(e.target.value);
  }

  //Effect
  
  //Update the state base on the search string
  useEffect(() => {

    (!search.length && setRecipe(""))

  },[search])

  //Rendering
  return (

        <form className="search-form">
          
          <p>Search recipes</p>
          <input type="text" autoFocus value={recipe} placeholder="e.g. Omelette du fromage" onChange={onChange} />

        </form>

  )
}
