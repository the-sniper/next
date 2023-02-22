import moment from 'moment'
import React from 'react'

const BlockHeader = ({ storeDetails }) => {
    return (
        <>
            <table style={{ width: '100%' }}>
                <tr>
                    <td
                        style={{
                            textAlign: 'right',
                            fontSize: '12px',
                            padding: '10px',
                            paddingBottom: '0',
                            color: 'gray',
                        }}
                    >
                        {moment().format('LL')}
                    </td>
                </tr>
                <tr>
                    <td
                        style={{
                            width: '100%',
                            textAlign: 'center',
                            paddingBottom: '20px',
                            borderBottom: '1px solid #f2f2f2',
                        }}
                    >
                        <img
                            src={
                                process.env.REACT_APP_DOMAIN +
                                '/uploads/store/' +
                                storeDetails?.logo
                            }
                            height="100px"
                            width="auto"
                            style={{ marginLeft: 'auto', marginRight: 'auto' }}
                        />
                    </td>
                </tr>
            </table>
        </>
    )
}

export default BlockHeader
