import {Button, Form, Input, InputNumber, message, Modal, Pagination, Select, Space, Spin, Table, Tag, Image} from "antd";
import {useEffect, useState} from "react";
import {connect, history, useNavigate} from "umi";
import dayjs from "dayjs";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import * as RefundService from "@/services/refund";
import * as PaymentLogService from "@/services/paymentLog";
import ImageUploadPng from "@/components/ImageUploadPng";

const tailLayout = {
    wrapperCol: {offset: 4},
};

const AddRefund = (props: any) => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [spinning, setSpinning] = useState(false);
    // 订单选择弹窗
    const [orderModalOpen, setOrderModalOpen] = useState(false);
    const [orderList, setOrderList] = useState<any[]>([]);
    const [orderCount, setOrderCount] = useState(0);
    const [orderPage, setOrderPage] = useState(1);
    const [orderPageSize, setOrderPageSize] = useState(50);
    const [selectedOrderId, setSelectedOrderId] = useState(0);
    // 图片上传
    const [pdfImage, setPdfImage] = useState('');
    // base64 用来显示图片
    const [fileBase64,setFileBase64]=useState('');
    // 获取图片base64
    const getImgBase64=(item:any)=>{
        setFileBase64(item);
    };
    // 选中的订单信息
    const [selectedOrder, setSelectedOrder] = useState<any>(null);

    // 获取订单列表（支付状态为1且订单类型为微信充值/代充值）
    const getOrderList = () => {
        PaymentLogService.fetch({
            page: orderPage,
            orderNum: '',
            startDate: '2000-01-01',
            endDate: '2099-01-01',
            type: 0,
            stutes: 1, // 支付状态为1（充值成功）
            pageSize: orderPageSize,
        }).then((res: any) => {
            if (res.ErrorCode === 0) {
                console.log('21312',res.Data);
                // 过滤出微信充值(2)和代充值(3)的订单
                const filtered = (res.Data.data || []).filter((item: any) => item.orderType === 2 || item.orderType === 3);
                setOrderList(filtered);
            } else {
                message.error(res.Data);
            }
        });
    };

    // 获取订单分页总数
    const getOrderCount = () => {
        PaymentLogService.fenye({
            orderNum: '',
            startDate: '2000-01-01',
            endDate: '2099-01-01',
            type: 0,
            stutes: 1,
            pageSize: orderPageSize,
        }).then((res: any) => {
            if (res.ErrorCode === 0) {
                setOrderCount(res.Data.count);
            }
        });
    };

    useEffect(() => {
        if (orderModalOpen) {
            setOrderPage(1);
            getOrderList();
            // getOrderCount();
        }
    }, [orderModalOpen]);

    useEffect(() => {
        if (orderModalOpen) {
            getOrderList();
        }
    }, [orderPage, orderPageSize]);

    const orderColumns = [
        {
            title: '日期',
            dataIndex: 'created',
            key: 'created',
            render: (text: any) => <div>{dayjs(text).format('YYYY-MM-DD HH:mm:ss')}</div>,
        },
        {title: '订单编号', dataIndex: 'id', key: 'id'},
        {title: '订单描述', dataIndex: 'orderReason', key: 'orderReason', ellipsis: true},
        {
            title: '充值金额(元)',
            dataIndex: 'orderAmount',
            key: 'orderAmount',
            render: (text: any) => <div>{(text / 100).toFixed(2)}元</div>,
        },
        {
            title: '订单类型',
            dataIndex: 'orderType',
            key: 'orderType',
            render: (text: any) => {
                if (text === 2) return <Tag color="blue">微信充值</Tag>;
                if (text === 3) return <Tag color="red">代充值</Tag>;
                return <Tag>未知</Tag>;
            },
        },
        {title: '到账人', dataIndex: 'tenant_name', key: 'tenant_name', ellipsis: true},
    ];

    // 选择订单
    const selectOrder = (record: any) => {
        setSelectedOrderId(record.id);
        setSelectedOrder(record);
    };

    // 确认选择订单，带出数据填入表单
    const confirmOrder = () => {
        if (!selectedOrderId) {
            message.warning('请先选择一条订单');
            return;
        }
        form.setFieldsValue({
            tenantId: selectedOrder.tenantId,
            orderId: selectedOrder.id || '',
            orderAmount: selectedOrder.orderAmount || '',
            applyAmount: selectedOrder.orderAmount || '',
        });
        setOrderModalOpen(false);
    };

    const onOrderChange = (page: number, pageSize: number) => {
        setOrderPage(page);
        setOrderPageSize(pageSize);
    };

    // 图片上传回调
    const handleImageUpload = (imgName: string) => {
        setPdfImage(imgName);
    };
    const handleSubmit  = (values: any, status: number) => {
        if(values.applyAmount>values.orderAmount || values.applyAmount <= 0){
            message.warning('退款金额必须大于0且不超过订单金额');
            return;
        }
        // 超过24小时则不允许退款
        const now = Date.now();
        const orderCreatedTime = new Date(selectedOrder.created).getTime();
        if (now - orderCreatedTime > 24 * 60 * 60 * 1000) {
            message.warning('超过24小时不允许退款');
            return;
        }
        // 请填写原因并上传订单图片
        if (!values.applyReason || !pdfImage) {
            message.warning('请填写原因并上传订单图片');
            return;
        }
        setSpinning(true);
        const params = {
            tenantId: values.tenantId,
            applyAmount: values.applyAmount,
            applyReason: values.applyReason || '',
            pdfImage: pdfImage,
            orderId: values.orderId,
            renameStatus: status,
            jsonData: '',
        };
        RefundService.refundNew(params).then((res: TypeErrorCode) => {
            setSpinning(false);
            if (res.ErrorCode === 0) {
                message.success('提交成功');
                history.push('/enter/afterSales/');
            } else {
                message.error(res.Data);
            }
        });
    };
    // 提交表单
    const onFinish = (values: any) => {
        handleSubmit(values, 1);
    };
    // 直接送审
    const sendCheck = async () => {
        try {
            const values = await form.validateFields();
            handleSubmit(values, 4);
        } catch (errorInfo) {
        console.log('验证失败:', errorInfo);
        }
    }

    return (
        <Spin spinning={spinning}>
            <Form
                labelCol={{span: 4}}
                wrapperCol={{span: 14}}
                form={form}
                layout="horizontal"
                size={'large'}
                onFinish={onFinish}
                style={{marginTop: '1rem'}}
            >
                <Form.Item label="选择订单">
                    <Space>
                        <Button type="primary" onClick={() => setOrderModalOpen(true)}>
                            选择订单
                        </Button>
                    </Space>
                </Form.Item>
                <Form.Item label="租户ID" name="tenantId" hidden
                        rules={[{required: true, message: '请填写租户ID'}]}>
                <InputNumber min={0} style={{width: '100%'}} placeholder="租户ID"/>
                </Form.Item>
                <Form.Item label="订单ID" name="orderId" hidden
                           rules={[{required: true, message: '请填写订单ID'}]}>
                    <Input disabled placeholder="选择订单后自动带出"/>
                </Form.Item>
                <Form.Item label="充值金额(元)" name="orderAmount"
                           rules={[{required: true, message: '请填写充值金额'}]}>
                    <InputNumber disabled min={0} style={{width: '100%'}}/>
                </Form.Item>
                <Form.Item label="退款金额(元)" name="applyAmount"
                           rules={[{required: true, message: '请填写退款金额'}]}>
                    <InputNumber min={0} disabled style={{width: '100%'}} placeholder="退款金额"/>
                </Form.Item>
                <Form.Item label="退款原因" name="applyReason"
                           rules={[{required: true, message: '请填写退款原因'}]}>
                    <Input.TextArea placeholder="退款原因"/>
                </Form.Item>
                <Form.Item label='订单图片' name="pdfImage"
                           rules={[{required: true, message: '请上传订单图片'}]}>
                   <Space style={{display:'flex'}}>
                       <Space style={{display:'flex'}}>
                           <ImageUploadPng onImageUpload={handleImageUpload} oldBase64={getImgBase64}/>
                           {fileBase64?<Image src={fileBase64} style={{width:'80px',height:'80px'}}/>:''}
                       </Space>
                   </Space>
                </Form.Item>
                <Form.Item {...tailLayout}>
                    <Space>
                        <Button type="primary" htmlType="submit">
                            保存草稿
                        </Button>
                        <Button type="primary" danger onClick={() => sendCheck()}>
                            直接送审
                        </Button>
                        <Button type="primary" onClick={() => navigate(-1)}>
                            取消
                        </Button>
                    </Space>
                </Form.Item>
            </Form>

            {/* 订单选择弹窗 */}
            <Modal
                title="选择订单（微信充值/代充值）"
                open={orderModalOpen}
                onCancel={() => setOrderModalOpen(false)}
                width={1200}
                footer={[
                    <Button key="confirm" type="primary" onClick={confirmOrder}>选择</Button>,
                    <Button key="cancel" onClick={() => setOrderModalOpen(false)}>取消</Button>,
                ]}
            >
                <Table
                    columns={orderColumns}
                    dataSource={orderList}
                    rowKey={(record: any) => record.id}
                    pagination={false}
                    size="small"
                    scroll={{y: '50vh'}}
                    rowSelection={{
                        type: 'radio',
                        selectedRowKeys: selectedOrderId ? [selectedOrderId] : [],
                        onChange: (selectedKeys: any[]) => {
                            const id = selectedKeys[0];
                            const record = orderList.find((item: any) => item.id === id);
                            if (record) selectOrder(record);
                        },
                    }}
                />
                <Pagination
                    total={orderCount}
                    showSizeChanger
                    pageSize={orderPageSize}
                    current={orderPage}
                    onChange={onOrderChange}
                    pageSizeOptions={[50, 100, 500]}
                    style={{marginTop: 10, textAlign: 'right'}}
                />
            </Modal>
        </Spin>
    );
};

export default AddRefund;
