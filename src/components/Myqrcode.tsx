import React from 'react';
import {QRCodeCanvas} from 'qrcode.react';

const MyQRCodeComponent = ({ value }) => {
    return (
        <div>
            <h1>My QR Code</h1>
            <QRCodeCanvas value={value}/>
        </div>
    );
};

export default MyQRCodeComponent;