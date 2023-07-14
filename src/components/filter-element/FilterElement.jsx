import { useEffect, useState } from 'react';
import './filterelement.css' 

export default function FilterElement(props) {

  //State
  const [checked,setChecked] = useState(false);


  //Function

  //Function to check/uncheck the checkbox and add or remove the current category
  const onChecked = () => {

    if(!checked){
      props.setCategories(prev => [...prev, props.name ]) ;
    }else{
      props.setCategories(prev => prev.filter(category => category !== props.name));
    }

    setChecked(!checked);

  }

  //Effect
  //Update the checkbox when the categories are updated, used for removing all filters
  useEffect(() => {

    (!props.categories.length && setChecked(false))

  }, [props.categories])

  //Rendering
  return (

            <li onClick={onChecked} >
              <span className={"checkmark "+(checked && "checked")}></span>
              <p>{props.name}</p>
            </li>

  )
}
