import CKEditor from 'ckeditor4-react'
import { Button, Dialog } from '@material-ui/core'
import React from 'react'

const TextEditor = ({ template, setTemplate, index, textPopup, text, textName }) => {
    const handleTextPopup = () => {
        const tempArray = template
        tempArray[index]['textPopup'] = !tempArray[index]['textPopup']
        setTemplate([...tempArray])
    }
    const handleTextChange = (value) => {
        const tempArray = template
        tempArray[index][textName] = value
        setTemplate([...tempArray])
    }
    return (
        <div>
            <Dialog className="locationPopup" open={textPopup} onClose={() => handleTextPopup()}>
                <div className="locationPopupInner">
                    <Button className="closePopup" onClick={() => handleTextPopup()}>
                        <span className="material-icons">close</span>
                    </Button>
                    <h3>Edit Text</h3>
                    <CKEditor
                        config={{
                            allowedContent: true,
                        }}
                        type="classic"
                        data={text}
                        onChange={(event, editor) => {
                            handleTextChange(event.editor.getData())
                        }}
                    />
                </div>
            </Dialog>
        </div>
    )
}

export default TextEditor
