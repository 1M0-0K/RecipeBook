import { useEffect, useState } from 'react';
import './favourite.css' 
import {useSelector as selector, useDispatch} from 'react-redux';
import {
    setViewFavourite,
    getViewFavourite
} from '../../reducers/recipes';

export default function Favourite(props) {

    //State
    const [checked,setChecked] = useState(false);

    const dispatch = useDispatch();
    const favourite = selector(getViewFavourite);

  //Function

  //Function to check/uncheck the checkbox and toggle the favourite category
  const onChecked = () => {

    if(!checked){
        dispatch(setViewFavourite(1));
    }else{
        dispatch(setViewFavourite(0));
    }

    setChecked(!checked);
  }

  //Effect

  //Update the checkbox, used for removing all filters
  useEffect(() => {

    (!favourite && setChecked(false))

  }, [favourite])


  //Rendering
  return (

            <li onClick={onChecked} >
              <span className={"checkmark "+(checked && "checked")}></span>
              <p>{props.name}</p>
            </li>

  )
}
