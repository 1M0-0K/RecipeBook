import { useEffect } from 'react';
import './dialog.css' 


export default function Dialog({text, func, close}) {

  //Rendering
  return (

    <div className="modal-dialog">

      <div className="dialog">
        <div className="dialog-header">

          <button className="dialog-close" onClick={() => {func(false); close(false)}}></button>

        </div>
        
        <div className="dialog-body">
          <p>{text}</p>
        </div>

        <div className="dialog-footer">
            <button onClick={() => {func(true); close(false)}}>Yes</button>
            <button onClick={() => {func(false); close(false)}}>No</button>
        </div>

      </div>

    </div>

  )
}

