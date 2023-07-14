import './filter.css' 
import FilterElement from '../filter-element/FilterElement'
import Favourite from '../favourite/Favourite'

export default function Filter({setFilterCategories, filterCategories, categories, setFavourite, isFavourite}) {

  //Rendering
  return (

        <div className="filters">

          <h5>Categories:</h5>
          <ul className="filter">
            <Favourite name="Favourite" setFavourite={setFavourite} isFavourite={isFavourite}/>  
            {categories.map(category => ( <FilterElement key={category} name={category} setCategories={setFilterCategories} categories={filterCategories}/>))}
          </ul>

        </div>

  )
}
