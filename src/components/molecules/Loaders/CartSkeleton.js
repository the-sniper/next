import React from 'react'
// import Skeletons from '../../../../custom/components/Skeletons'
import ListViewSkeleton from './ProductCardSkeletons/ListViewSkeleton'

function CartSkeleton() {
    return (
        <div className="cartSkeletonBody">
            {/* <Skeletons type="title" /> */}
            <div className="csbItem">
                <div>
                    <ListViewSkeleton />
                </div>
            </div>
        </div>
    )
}

export default CartSkeleton
