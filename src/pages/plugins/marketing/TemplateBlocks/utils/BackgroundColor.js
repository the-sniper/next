import React from 'react'
import { Button, Dialog } from '@mui/material'

const BackgroundColor = ({ template, setTemplate, index, colorPopup, bgColor }) => {
    const handleColorPopup = () => {
        const tempArray = template
        tempArray[index]['colorPopup'] = !tempArray[index]['colorPopup']
        setTemplate([...tempArray])
    }
    const handleColorChange = (e) => {
        const tempArray = template
        tempArray[index]['bgColor'] = e.target.value
        setTemplate([...tempArray])
    }
    return (
        <div>
            <Dialog className="locationPopup" open={colorPopup} onClose={() => handleColorPopup()}>
                <div className="locationPopupInner">
                    <Button className="closePopup" onClick={() => handleColorPopup()}>
                        <span className="material-icons">close</span>
                    </Button>
                    <h3>Block Information</h3>
                    <p>Select the following information for the selected block</p>

                    <input type="color" value={bgColor} onChange={handleColorChange} />
                </div>
            </Dialog>
        </div>
    )
}

export default BackgroundColor
