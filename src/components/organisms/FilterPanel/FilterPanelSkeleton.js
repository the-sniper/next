import React from 'react'
import Skeletons from '../../components/Skeletons'

function FilterPanelSkeleton() {
    return (
        <div className="filterPanelSkeleton">
            <Skeletons type="search" />
            <Skeletons type="title" />
            <Skeletons type="leftPanel" />
        </div>
    )
}

export default FilterPanelSkeleton
