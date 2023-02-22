import Skeletons from '@/components/Skeletons'
import React from 'react'

function SearchSkeleton() {
    return (
        <div className="searchSkeletonBody">
            {[...Array(6)].map((data, index) => (
                <div key={index}>
                    <Skeletons type="gridImage" />
                    <Skeletons type="title" />
                    <Skeletons type="text" />
                    <Skeletons type="text" />
                    <Skeletons type="actionButton" />
                </div>
            ))}
        </div>
    )
}

export default SearchSkeleton
