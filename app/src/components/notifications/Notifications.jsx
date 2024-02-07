import './notifications.css' 
import {useSelector as selector, useDispatch} from 'react-redux';
import {useState, useRef, useEffect} from 'react';
import {
    setSearchValue,
    setViewFavourite,
    setSelectedCategories,
    setSortBy
} from '../../reducers/recipes';
import {
    getNotifications,
    addNotification,
    shiftNotifications,
} from "../../reducers/notification";

export default function Notifications() {

    const dispatch = useDispatch();
    const notifications = selector(getNotifications);
    const notificationsDisplay = useRef();

    useEffect(() => {

        if(notifications.length >0){
            const not = notifications[0];
            displayNotification(not.type, not.msg);

        }

    }, [notifications])

    //Function
    
    const displayNotification = (type, message) => {

        //Create a notification and display it 
        let newNot = document.createElement("div");
        newNot.classList.add("notification");
        switch(type){
            case "error":
                newNot.classList.add("error");
            break;
            default:
                newNot.classList.add("info");
        }
        newNot.textContent = message;

        notificationsDisplay.current.appendChild(newNot);


        setTimeout(() => {
            dispatch(shiftNotifications());
            newNot.remove();
        }, 3000);

    }

    //Rendering
    return (
        <div id="notifications" ref={notificationsDisplay}>

        </div>
    )
}
