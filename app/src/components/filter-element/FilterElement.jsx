import { useEffect, useState } from 'react';
import './filterelement.css' 
import {useSelector as selector, useDispatch} from 'react-redux';
import {
    setSelectedCategories,
    getSelectedCategories
} from '../../reducers/recipes';

export default function FilterElement(props) {

    const dispatch = useDispatch();
    const categories = selector(getSelectedCategories);

    //State
    const [checked,setChecked] = useState(false);


    //Function

    //Function to check/uncheck the checkbox and add or remove the current category
    const onChecked = () => {
        if(!checked){
            dispatch(setSelectedCategories([...categories, props.name]));
        }else{
            dispatch(setSelectedCategories(categories.filter(category => category !== props.name)));
        }

        setChecked(!checked);

    }

    //Effect
    //Update the checkbox when the categories are updated, used for removing all filters
    useEffect(() => {

        (!categories && setChecked(false))

    }, [categories])

    //Rendering
    return (

            <li onClick={onChecked} >
              <span className={"checkmark "+(checked && "checked")}></span>
              <p>{props.name}</p>
            </li>

    )
}
