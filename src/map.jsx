import React from 'react'
import StateMap from './map/StateMap.jsx'
import MapDropdown from './component/MapDropdown.jsx';


const map = () => {
    return (
        <div>
            <div className='mt-9'>
                <MapDropdown />
            </div>
            <div className='ml-4  mt-7 w-[800px]'>
                <StateMap />
            </div>
        </div>
    )
}

export default map
