import React from 'react';
import {QRCodeCanvas} from 'qrcode.react';

const MyQRCodeComponent = ({ value }) => {
    return (
        <div>
            <QRCodeCanvas value={value}/>
            {/*<div style={{fontSize:"15px",color:'#555'}}>请拍照或者截图保留</div>*/}
        </div>
    );
};

export default MyQRCodeComponent;