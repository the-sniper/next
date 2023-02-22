import React, { useState } from 'react'
import Block1 from './Block1'
import BackgroundColor from './utils/BackgroundColor'
import ImageEditor from './utils/ImageEditor'

const Block4 = ({
    index,
    text1,
    colorPopup,
    imagePopup,
    bgColor,
    image1,
    image2,
    image3,
    image4,
    textPopup,
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
                            <tr style={{ verticalAlign: 'top' }}>
                                <td style={{ width: '150px' }}>
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
                                <td style={{ width: '60%' }}>
                                    <Block1
                                        bgColor={bgColor}
                                        text1={text1 ? text1 : 'sample text'}
                                        index={index}
                                        colorPopup={colorPopup}
                                        template={template}
                                        setTemplate={setTemplate}
                                        preview={preview}
                                        textPopup={textPopup}
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

export default Block4
