import { InputNumber, Modal, Space } from "antd";
import { useMemo } from "react";

export type UnitSplitModalProps = {
    open: boolean;
    currentUnitId?: number;
    unitsList?: any[];
    quantity: number;
    onQuantityChange: (value: number) => void;
    onConfirm: () => void;
    onCancel: () => void;
};

const findParentUnitId = (currentUnitsId?: number, arr: any[] = []) => {
    if (!currentUnitsId || !Array.isArray(arr) || arr.length === 0) return 0;
    const matchedItem = arr.find((item: any) => Number(item.to_unit_id) === Number(currentUnitsId));
    return matchedItem ? Number(matchedItem.from_unit_id) : 0;
};

const UnitSplitModal = ({
    open,
    currentUnitId = 0,
    unitsList = [],
    quantity,
    onQuantityChange,
    onConfirm,
    onCancel,
}: UnitSplitModalProps) => {
    const parentUnitId = useMemo(
        () => findParentUnitId(currentUnitId, unitsList),
        [currentUnitId, unitsList]
    );

    const parentUnit = useMemo(
        () => unitsList.find((item: any) => Number(item.from_unit_id) === Number(parentUnitId)),
        [unitsList, parentUnitId]
    );

    return (
        <Modal
            open={open}
            onCancel={onCancel}
            onOk={onConfirm}
            title="向上拆"
            width={400}
        >
            <Space direction="vertical" style={{ width: '100%' }}>
                <div>当前单位ID: {currentUnitId || 0}</div>
                <div>
                    {parentUnitId
                        ? `上一级单位: ${parentUnit?.unitsName || parentUnitId}`
                        : '当前单位已是最大单位，无法继续向上拆'}
                </div>
                <InputNumber
                    min={0}
                    value={quantity}
                    onChange={(value) => onQuantityChange(Number(value || 0))}
                    placeholder="请输入拆分数量"
                    style={{ width: '100%' }}
                    disabled={!parentUnitId}
                />
            </Space>
        </Modal>
    );
};

export default UnitSplitModal;
