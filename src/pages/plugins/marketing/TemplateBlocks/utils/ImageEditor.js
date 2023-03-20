import React, { useContext, useEffect, useState } from 'react'
import { Button, Dialog } from '@mui/material'
import ProductContext from '../../../../../context/product/productContext'

const ImageEditor = ({ template, setTemplate, index, imagePopup, imageName }) => {
    const { marketing_lots, getLotImages, lot_images } = useContext(ProductContext)
    const [lots, setLots] = useState([])
    const [lotImages, setLotImages] = useState([])
    const [product, setProduct] = useState({})

    useEffect(() => {
        setLots(marketing_lots)
    }, [marketing_lots])

    useEffect(() => {
        setLotImages(lot_images)
    }, [lot_images])

    const handleImagePopup = () => {
        const tempArray = template
        tempArray[index]['imagePopup'] = !tempArray[index]['imagePopup']
        setTemplate([...tempArray])
    }

    const handleLotImages = (value) => {
        setProduct(value)
        setLotImages([])
        getLotImages({ id: value.id })
    }

    const handleSetImage = (image) => {
        const tempArray = template
        tempArray[index][imageName] = `${
            product.content_head1 === '0' || product.store_id === 0
                ? process.env.REACT_APP_FORWARD_DOMAIN + '/uploads/product/'
                : process.env.REACT_APP_IMAGE_URL
        }${image}`
        setTemplate([...tempArray])
        handleImagePopup()
    }

    const handleBack = () => {
        setProduct({})
        setLotImages([])
    }
    return (
        <div>
            <Dialog className="locationPopup" open={imagePopup} onClose={() => handleImagePopup()}>
                <div className="locationPopupInner">
                    <Button className="closePopup" onClick={() => handleImagePopup()}>
                        <span className="material-icons">close</span>
                    </Button>
                    <h3>Block Information</h3>
                    <p>Select the following information for the selected block</p>
                    {lotImages.length ? (
                        <div>
                            <p>{product.title}</p>
                            {lotImages.map((val) => (
                                <div onClick={() => handleSetImage(val.src)}>
                                    <img
                                        src={`${
                                            product.content_head1 === '0' || product.store_id === 0
                                                ? process.env.REACT_APP_FORWARD_DOMAIN +
                                                  '/uploads/product/'
                                                : process.env.REACT_APP_IMAGE_URL
                                        }${val.src}`}
                                        height="150px"
                                        width="150px"
                                    />
                                </div>
                            ))}
                            <Button type="button" onClick={handleBack}>
                                Back
                            </Button>
                        </div>
                    ) : (
                        lots.map((val) => (
                            <div onClick={() => handleLotImages(val)}>
                                <img
                                    src={`${
                                        val.content_head1 === '0' || val.store_id === 0
                                            ? process.env.REACT_APP_FORWARD_DOMAIN +
                                              '/uploads/product/'
                                            : process.env.REACT_APP_IMAGE_URL
                                    }${val.avatar}`}
                                    height="150px"
                                    width="150px"
                                />
                                <p>{val.title}</p>
                            </div>
                        ))
                    )}
                </div>
            </Dialog>
        </div>
    )
}

export default ImageEditor
