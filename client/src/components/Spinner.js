import React from 'react'
import { Spin } from 'antd'

function Spinner() {
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'row',
            alignItems: 'center',
            minHeight: '70vh'
        }}>
            <Spin size="large" />
        </div>
    )
}

export default Spinner