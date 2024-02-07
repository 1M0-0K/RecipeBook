import './header.css' 
import Search from '../search/Search'
import Sort from '../sort/Sort'
import Button from '../button/Button'
import Filter from '../filter/Filter'
import {useDispatch} from 'react-redux';
import {
    setSearchValue,
    setViewFavourite,
    setSelectedCategories,
    setSortBy
} from '../../reducers/recipes';

export default function Header() {

    const dispatch = useDispatch();

    //Function

    //Remove all filters
    const removeFilters = () => {
        dispatch(setSearchValue(""));
        dispatch(setSortBy((a, b) => a.name>b.name ?1:-1));
        dispatch(setSelectedCategories(null));
        dispatch(setViewFavourite(false));
    }

    //Hide the header
    const hideSide = () => {
        //We change the --toggle to 1 to set the left to a negativ number
        document.documentElement.style.setProperty('--toggle', 1);
    }

  //Rendering
  return (
    <div className="header-lock">
      <header>

        <button className="header-close" onClick={hideSide}></button>

        <Search/>

        <Sort/>

        <Filter/>

        <Button text="Remove filters" func={removeFilters}/>

              
      </header>
    </div>
  )
}
