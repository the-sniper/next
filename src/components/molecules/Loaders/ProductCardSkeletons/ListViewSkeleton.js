import React from 'react'
import Skeletons from '../../../Skeletons'

function ListViewSkeleton() {
    return (
        <div className="listViewSkeleton">
            <Skeletons type="gridImage" />
            <div>
                <Skeletons type="title" />
                <Skeletons type="text" />
                <Skeletons type="text" />
            </div>
            <div>
                <Skeletons type="text" />
                <Skeletons type="text" />
                <Skeletons type="actionButton" />
            </div>
        </div>
    )
}

export default ListViewSkeleton
