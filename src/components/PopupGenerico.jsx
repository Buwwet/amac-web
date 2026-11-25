import Popup from "./Popup";


// ricky: Literalmente como lo diseñamos en el figma.
export default function PopupGenerico({title, body, primaryContent, secondaryContent, onPrimaryClick, onSecondaryClick, closePopup, children}) {

    return <div className="generic-popup-cont">
        <Popup isOpen={true} closePopup={closePopup}>
            <div className="popup-generic">
                <p className="title">{title}</p>
                    {children}
                <p>{body}</p>
                <a aria-label="acceptar" className="btn btn-primario" onClick={onPrimaryClick}>
                    {primaryContent}
                </a>
                <a aria-label="rechazar" className="btn btn-secundario" onClick={onSecondaryClick}>
                    {secondaryContent}
                </a>
            </div>
            
        </Popup>
    </div>    
}