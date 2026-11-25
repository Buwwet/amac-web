// por @ricky. Un popup que puede hacer cualquier cosa
// Para ser más versatil, ocupa 100% del espacio que pueda, tienes que usar css del padre para contenerlo.

import { createPortal } from "react-dom";

export default function Popup({isOpen, closePopup, children}) {
    if (!isOpen) return null;

    // createPortal nos permite poner este nodo en otro lugar (i hate position:absolute)
    return <div>
        {createPortal(<div className="popup-background" onClick={closePopup}/>, document.body)}
        {children}
    </div>
}