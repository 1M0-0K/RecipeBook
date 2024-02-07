import './button.css' 

export default function Button({text, func}) {


  //Rendering
  return (

        <button onClick={() => func()}>{text}</button>

  )
}
