import React from 'react';
import '../Ades.css';

function ActionArea({children}) {
    return(
        <div className="hamburgerButton">
            {children}
        </div>
    )
}

export default ActionArea;