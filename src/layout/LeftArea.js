import React from 'react';
import '../Ades.css';

function LeftArea({children}) {
    return (
        <div id="notifications" className='leftArea'>
            {children}
        </div>
    )
}

export default LeftArea;