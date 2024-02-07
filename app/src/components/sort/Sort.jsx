import { useEffect, useState } from 'react';
import './sort.css' 
import {useDispatch} from 'react-redux'
import {setSortBy} from '../../reducers/recipes';
import {getTime} from '../../utils/getTime';

export default function Sort() {
    
    //Consts

    const dispatch = useDispatch();
    const [option, setOption] = useState("alpha");
    //Effect

    //Set the sorting function based on the selected criteria
    useEffect(() => {
        switch(option){
            case "alpha":
                dispatch(setSortBy((a, b) => a.name>b.name ?1:-1));
            break;
            case "new":
                dispatch(setSortBy((a, b) => a.date<b.date ?1:-1));
            break;
            case "old":
                dispatch(setSortBy((a, b) => a.date>b.date ?1:-1));
            break;
            case "time":
                dispatch(setSortBy((a, b) => getTime(a.time)>getTime(b.time) ?1:-1));
            break;
            default:
                dispatch(setSortBy((a, b) => a.name>b.name ?1:-1));
        }
    },[option]);

    //Rendering
    return (

        <div className="sort">

          <h5>Sort:</h5>
          
          <select className="sort-by" value={option} onChange={(e) => setOption(e.target.value)}>
            <option value="alpha">Name</option>
            <option value="new">Newer</option>
            <option value="old">Older</option>
            <option value="time">Quickest</option>
          </select>

        </div>

  )
}
