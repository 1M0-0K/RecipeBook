import { useEffect, useState } from 'react'
import './search.css';
import {useSelector as selector, useDispatch} from 'react-redux';
import {
    getSearchValue,
    setSearchValue
} from '../../reducers/recipes';

export default function Search() {

    const dispatch = useDispatch();
    const searchValue = selector(getSearchValue);
    //State
    const [recipe,setRecipe] = useState("");

    //Function

    const onChange = (e)=>{
        setRecipe(e.target.value);
        dispatch(setSearchValue(e.target.value));
    }

    //Effect

    //Update the state base on the search string
    useEffect(() => {

    (!searchValue.length && setRecipe(""))

    },[searchValue])

    //Rendering
    return (

        <form className="search-form">
          
          <p>Search recipes</p>
          <input type="text" autoFocus value={recipe} placeholder="e.g. Omelette du fromage" onChange={onChange} />

        </form>

    )
}
