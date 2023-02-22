import React from 'react'
import Skeletons from '../../Skeletons'

function ProductViewSkeleton() {
    return (
        <div className="productViewSkeleton">
            <div className="pvsImage">
                <Skeletons type="gridImage" />
                <div className="d-flex">
                    <Skeletons type="thumbnail" />
                    <Skeletons type="thumbnail" />
                    <Skeletons type="thumbnail" />
                </div>
            </div>
            <Skeletons type="title" />
            <Skeletons type="box" />
            <div className="pvsAct">
                <Skeletons type="actionButton" />
                <Skeletons type="actionButton" />
            </div>
            <div className="pvsInfo">
                <Skeletons type="text" />
                <Skeletons type="text" />
                <Skeletons type="text" />
                <Skeletons type="text" />
                <Skeletons type="text" />
                <Skeletons type="text" />
            </div>
        </div>
    )
}

export default ProductViewSkeleton
