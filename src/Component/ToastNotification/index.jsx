import React, { useState } from 'react';

function ToastNotification(props) {

    return (
        <div className="toast-notification-container">
            <p><strong>{props.status}</strong> - <strong>{props.line}</strong></p>
    <p>{props.description} <br /> {'Start Time: ' }<strong>{props.duration.slice(6)}</strong></p>
    <p className="toast-status">{props.alarmStatus}</p>
        </div>

    )
}

export default ToastNotification;