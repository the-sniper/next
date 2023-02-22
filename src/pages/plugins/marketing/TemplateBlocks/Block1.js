import React, { useState } from 'react'
import BackgroundColor from './utils/BackgroundColor'
import TextEditor from './utils/TextEditor'

const Block1 = ({
    index,
    colorPopup,
    textPopup,
    bgColor,
    text1,
    template,
    setTemplate,
    preview,
}) => {
    const [textName, setTextName] = useState('')
    const handleTextPopup = (name) => {
        if (preview) {
            return null
        }
        const tempArray = template
        tempArray[index]['textPopup'] = !tempArray[index]['textPopup']
        setTemplate([...tempArray])
        setTextName(name)
    }
    return (
        <>
            <table className="dtdLns" width="100%">
                <tr>
                    <td width="100%" height="50" style={{ padding: '10px' }}>
                        <span className="editable-text" onClick={() => handleTextPopup('text1')}>
                            <span
                                dangerouslySetInnerHTML={{
                                    __html: text1,
                                }}
                            />
                        </span>
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
            <TextEditor
                index={index}
                textPopup={textPopup}
                template={template}
                setTemplate={setTemplate}
                text={text1}
                textName={textName}
            />
        </>
    )
}

export default Block1
