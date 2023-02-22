import React from 'react'
import Shimmer from './Shimmer'
import SkeletonElement from './SkeletonElement'

function Skeletons(props) {
    return (
        <div className="skeletonWrapper">
            <SkeletonElement type={props.type} />
            <Shimmer />
        </div>
    )
}

export default Skeletons
