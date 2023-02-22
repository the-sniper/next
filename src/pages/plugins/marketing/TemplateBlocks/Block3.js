import React, { useState } from 'react'
import BackgroundColor from './utils/BackgroundColor'
import ImageEditor from './utils/ImageEditor'

const Block3 = ({
    index,
    colorPopup,
    imagePopup,
    bgColor,
    image1,
    image2,
    image3,
    image4,

    template,
    setTemplate,
    preview,
}) => {
    const [imageName, setImageName] = useState('')
    const handleImagePopup = (name) => {
        if (preview) {
            return null
        }
        const tempArray = template
        tempArray[index]['imagePopup'] = !tempArray[index]['imagePopup']
        setTemplate([...tempArray])
        setImageName(name)
    }
    return (
        <>
            <table width="100%" className="dtdLns">
                <tr>
                    <td style={{ padding: '10px' }}>
                        <table style={{ width: '100%' }}>
                            <tr>
                                <td style={{ width: '50%' }}>
                                    <img
                                        src={
                                            image1
                                                ? image1
                                                : '/assets/images/custombuilder/image_placeholder.png'
                                        }
                                        alt="img..."
                                        onClick={() => handleImagePopup('image1')}
                                        style={{
                                            height: '140px',
                                            width: '100%',
                                            background: 'whitesmoke',
                                            objectFit: image1 ? 'contain' : 'cover',
                                        }}
                                    />
                                </td>
                                <td style={{ width: '50%' }}>
                                    <img
                                        onClick={() => handleImagePopup('image2')}
                                        style={{
                                            height: '140px',
                                            width: '100%',
                                            background: 'whitesmoke',
                                            objectFit: image2 ? 'contain' : 'cover',
                                        }}
                                        src={
                                            image2
                                                ? image2
                                                : '/assets/images/custombuilder/image_placeholder.png'
                                        }
                                        alt="img..."
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td style={{ width: '50%' }}>
                                    <img
                                        src={
                                            image3
                                                ? image3
                                                : '/assets/images/custombuilder/image_placeholder.png'
                                        }
                                        alt="img..."
                                        onClick={() => handleImagePopup('image3')}
                                        style={{
                                            height: '140px',
                                            width: '100%',
                                            background: 'whitesmoke',
                                            objectFit: image3 ? 'contain' : 'cover',
                                        }}
                                    />
                                </td>
                                <td style={{ width: '50%' }}>
                                    <img
                                        src={
                                            image4
                                                ? image4
                                                : '/assets/images/custombuilder/image_placeholder.png'
                                        }
                                        alt="img..."
                                        onClick={() => handleImagePopup('image4')}
                                        style={{
                                            height: '140px',
                                            width: '100%',
                                            background: 'whitesmoke',
                                            objectFit: image4 ? 'contain' : 'cover',
                                        }}
                                    />
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
            <BackgroundColor
                index={index}
                colorPopup={colorPopup}
                template={template}
                setTemplate={setTemplate}
                bgColor={bgColor}
            />
            <ImageEditor
                index={index}
                imagePopup={imagePopup}
                imageName={imageName}
                template={template}
                setTemplate={setTemplate}
            />
        </>
    )
}

export default Block3
