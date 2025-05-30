import React from 'react';
import { Modal, Button } from 'antd';

const AlphanumericKeyboard = ({ onInput, onClose }) => {
    const keys = [
        '1', '2', '3', '4', '5', '6', '7', '8', '9', '0',
        'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P',
        'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L',
        'Z', 'X', 'C', 'V', 'B', 'N', 'M', '删除', '关闭'
    ];

    const handleKeyPress = (key) => {
        if (key === '删除') {
            onInput(key);
        } else if (key === '关闭') {
            onClose();
        } else {
            onInput(key);
        }
    };

    return (
        <Modal
            title="输入车牌号"
            open={true}
            onCancel={onClose}
            footer={null}
            width="300px"
        >
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px' }}>
                {keys.map((key, index) => (
                    <Button
                        key={index}
                        onClick={() => handleKeyPress(key)}
                        style={{ margin: '5px' }}
                    >
                        {key}
                    </Button>
                ))}
            </div>
        </Modal>
    );
};

export default AlphanumericKeyboard;