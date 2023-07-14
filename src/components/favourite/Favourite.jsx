import { useEffect, useState } from 'react';
import './favourite.css' 

export default function Favourite(props) {

  //State
  const [checked,setChecked] = useState(false);

  //Function

  //Function to check/uncheck the checkbox and toggle the favourite category
  const onChecked = () => {

    if(!checked){
      props.setFavourite(true) ;
    }else{
      props.setFavourite(false);
    }

    setChecked(!checked);
  }

  //Effect

  //Update the checkbox, used for removing all filters
  useEffect(() => {

    (!props.isFavourite && setChecked(false))

  }, [props.isFavourite])


  //Rendering
  return (

            <li onClick={onChecked} >
              <span className={"checkmark "+(checked && "checked")}></span>
              <p>{props.name}</p>
            </li>

  )
}
