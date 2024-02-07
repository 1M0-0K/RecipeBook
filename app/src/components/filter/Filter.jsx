import './filter.css' 
import FilterElement from '../filter-element/FilterElement'
import Favourite from '../favourite/Favourite'
import {useSelector as selector} from 'react-redux';
import {getCategories} from '../../reducers/recipes';

export default function Filter() {
    const categories = selector(getCategories);

    //Rendering
    return (

        <div className="filters">

          <h5>Categories:</h5>
          <ul className="filter">
            <Favourite name="Favourite"/>  
            {categories && categories.map(category => ( <FilterElement key={category} name={category}/>))}
          </ul>

        </div>

    )
}
