import React from 'react';
import { Modal, Button } from 'antd';

const ProvinceKeyboard = ({ onSelect, onClose }) => {
    const provinces = [
        '京', '津', '冀', '晋', '蒙', '辽', '吉', '黑', '沪', '苏',
        '浙', '皖', '闽', '赣', '鲁', '豫', '鄂', '湘', '粤', '桂',
        '琼', '渝', '川', '贵', '云', '藏', '陕', '甘', '青', '宁',
        '新'
    ];

    return (
        <Modal
            title="选择省份"
            visible={true}
            onCancel={onClose}
            footer={null}
        >
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px' }}>
                {provinces.map((province, index) => (
                    <Button
                        key={index}
                        onClick={() => onSelect(province)}
                        style={{ margin: '5px' }}
                    >
                        {province}
                    </Button>
                ))}
            </div>
        </Modal>
    );
};

export default ProvinceKeyboard;