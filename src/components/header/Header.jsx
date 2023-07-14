import './header.css' 
import Search from '../search/Search'
import Sort from '../sort/Sort'
import Button from '../button/Button'
import Filter from '../filter/Filter'
import { useState } from 'react'

export default function Header(props) {

  //State
  const [sortedBy, setSortedBy] = useState("alpha");

  //Function

  //Remove all filters
  const removeFilters = () => {
    props.setSearch("");
    setSortedBy("alpha");
    props.setFilterCategories([]);
    props.setFavourite(false);
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

        <Search setSearch={props.setSearch} search={props.search}/>

        <Sort setSortBy={props.setSortBy} setSortedBy={setSortedBy} sortedBy={sortedBy}/>

        <Filter setFilterCategories={props.setFilterCategories} categories={props.categories} filterCategories={props.filterCategories} setFavourite={props.setFavourite} isFavourite={props.favourite}/>

        <Button text="Remove filters" func={removeFilters}/>

              
      </header>
    </div>
  )
}
