import React from 'react'
import './AlertMessage.css'

export const AlertMessage = ({ info }) => {
    return (
        info ? (<div className="alert" >
            
            <strong><div className={info.type}>{info.message}</div></strong>
        </div>) : null
    )
}
