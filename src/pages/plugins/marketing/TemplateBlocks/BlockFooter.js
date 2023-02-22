import React from 'react'

const BlockFooter = ({ storeDetails }) => {
    return (
        <table
            style={{
                width: '100%',
                textAlign: 'center',
                padding: '10px',
                paddingTop: '15px',
                borderTop: '1px solid #f2f2f2',
            }}
        >
            <tr>
                <td style={{ paddingTop: '10px', fontWeight: '600' }}>{storeDetails?.name}</td>
            </tr>
            <tr>
                <td style={{ paddingTop: '5px', paddingBottom: '20px', fontSize: '13px' }}>
                    {storeDetails?.address}
                </td>
            </tr>
        </table>
    )
}

export default BlockFooter
