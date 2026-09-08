import {Button, Form, Input, message, Select, Spin, Modal, Space} from "antd";
import { useEffect, useState } from "react";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import { connect } from "umi";

interface WorkOrderRecord {
    id?: number;
    workGood?: string; // 物品名称
    workContent?: string; // 工单内容
}

interface EditWorkOrderProps {
    // 外部控制弹窗
    visible?: boolean;
    // 编辑回显数据
    record?: WorkOrderRecord | null;
    // 提交回调
    onOk?: (values: any, goodsName: string) => void;
    // 关闭弹窗回调
    onCancel?: () => void;
    // 是否展示内置编辑按钮
    showEditBtn?: boolean;
}

const EditWorkOrderModal = (props: EditWorkOrderProps & any) => {
    const {
        visible: outerVisible,
        record,
        onOk,
        onCancel,
        showEditBtn = true,
        dispatch,
    } = props;

    // 内部弹窗状态（兼容外部受控/内部按钮打开两种模式）
    const [innerVisible, setInnerVisible] = useState(false);
    const visible = outerVisible ?? innerVisible;

    const [spinning, setSpinning] = useState(false);
    const [form] = Form.useForm();
    const [workGood, setWorkGood] = useState("");
    const [goodsList, setGoodsList] = useState<any[]>([]);

    // 获取物品下拉列表
    const getGoodsList = () => {
        dispatch({
            type: "Goods/fetch",
        }).then((res: TypeErrorCode) => {
            if (res.ErrorCode === 0) {
                setGoodsList(res.Data.data || []);
            } else {
                message.error(`${res.ErrorCode} ${res.Data}`);
            }
        });
    };

    // 下拉选择物品
    const changeGoods = (goodsId: number) => {
        const selectedItem = goodsList.find((item) => item.id === goodsId);
        if (selectedItem) {
            form.setFieldsValue({
                goodsSelect: goodsId,
                workGood: selectedItem.goodName
            });
        } else {
            form.setFieldsValue({ workGood: "" });
        }
    };

    // 打开弹窗：回填数据
    const openModal = () => {
        setInnerVisible(true);
    };

    // 关闭弹窗：重置表单
    const handleClose = () => {
        setInnerVisible(false);
        form.resetFields();
        setWorkGood("");
        onCancel?.();
    };

    // 表单提交
    const onFinish = async (values: any) => {
        if (!values.workGood) return message.warning("请选择物品");
        setSpinning(true);
        try {
            // values 自带 workGood，只传一个参数给父组件
            await onOk?.(values);
            handleClose();
        } finally {
            setSpinning(false);
        }
    };

    useEffect(() => {
        if (!visible || !record) {
            form.resetFields();
            return;
        }
        form.setFieldsValue({
            goodsSelect: record.goodsId,
            workGood: record.workGood,
            workContent: record.workContent,
        });
    }, [visible, record, goodsList]);

    // 页面初始化加载物品列表
    useEffect(() => {
        getGoodsList();
    }, [dispatch]);

    return (
        <>
            {/* 内置编辑按钮 */}
            {showEditBtn && (
                <Button type="primary" onClick={openModal}>
                    编辑工单
                </Button>
            )}

            <Modal
                title="编辑工单"
                open={visible}
                width={600}
                maskClosable={false}
                onCancel={handleClose}
                footer={null}
            >
                <Spin spinning={spinning}>
                    <Form
                        labelCol={{ span: 4 }}
                        wrapperCol={{ span: 14 }}
                        form={form}
                        layout="horizontal"
                        size="large"
                        onFinish={onFinish}
                        style={{ marginTop: "1rem" }}
                    >
                        <Form.Item label="选择物品" >
                            <Select
                                showSearch
                                onChange={changeGoods}
                                optionFilterProp="children"
                                placeholder="请搜索选择物品"
                                filterOption={(input, option) => {
                                    const target = goodsList.find((item) => item.id === option.value);
                                    return target?.goodName?.toLowerCase().includes(input.toLowerCase());
                                }}
                            >
                                {goodsList.map((item) => (
                                    <Select.Option value={item.id} key={item.id}>
                                        {item.goodName}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <Form.Item label="物品名称" name="workGood">
                            <Input placeholder="物品名称"  disabled />
                        </Form.Item>

                        <Form.Item label="工单内容" name="workContent" rules={[{ required: true, message: "请输入工单内容" }]}>
                            <Input.TextArea rows={4} placeholder="工单内容" />
                        </Form.Item>

                        <Form.Item wrapperCol={{ offset: 4 }}>
                            <Space>
                                <Button onClick={handleClose}>取消</Button>
                                <Button type="primary" htmlType="submit">
                                    确认保存
                                </Button>
                            </Space>
                        </Form.Item>
                    </Form>
                </Spin>
            </Modal>
        </>
    );
};

const mapStateToProps = (state: any) => {
    return {
        GoodsList: state.Goods.list,
    };
};

export default connect(mapStateToProps)(EditWorkOrderModal);