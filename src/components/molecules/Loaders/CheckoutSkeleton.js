import React from 'react'
import Skeletons from '../../Skeletons'
import ListViewSkeleton from './ProductCardSkeletons/ListViewSkeleton'

function CheckoutSkeleton() {
    return (
        <div className="checkoutSkeletonBody">
            <div className="checkoutSkeletonCnt">
                <div className="cscLt">
                    <div className="cscItem">
                        <Skeletons type="gridImage" />
                        <div className="cscInfo">
                            <Skeletons type="text" />
                            <Skeletons type="text" />
                            <Skeletons type="text" />
                            <Skeletons type="text" />
                            <Skeletons type="text" />
                        </div>
                    </div>
                    <Skeletons type="text" />
                    <div className="apptInfo">
                        <Skeletons type="text" />
                        <Skeletons type="text" />
                        <Skeletons type="text" />
                    </div>
                    <div className="apptDate">
                        <Skeletons type="box" />
                        <Skeletons type="box" />
                        <Skeletons type="box" />
                        <Skeletons type="box" />
                    </div>
                </div>
                <div className="cscRt">
                    <Skeletons type="text" />
                    <Skeletons type="text" />
                    <Skeletons type="text" />
                    <Skeletons type="text" />
                    <Skeletons type="text" />
                    <Skeletons type="text" />
                    <Skeletons type="input" />
                    <Skeletons type="actionButton" />
                </div>
            </div>
        </div>
    )
}

export default CheckoutSkeleton
