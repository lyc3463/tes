import { Tag, Space, Modal, Descriptions, Table } from 'antd';
import { useState } from 'react';
import * as Application from "@/services/application";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import dayjs from "dayjs";

// 入参类型
interface CaigouTagListProps {
    list: Array<{ id: number | string; orderCode: string; supplierName?: string }>;
    onRemove?: (id: number | string) => void;
}

const CaigouTagList = (props: CaigouTagListProps) => {
    const { list, onRemove } = props;

    // 弹窗控制
    const [open, setOpen] = useState(false);
    // 接口返回的详情数据
    const [detailData, setDetailData] = useState<any>(null);
    // 加载状态
    const [loading, setLoading] = useState(false);
    // 供应商名称
    const [supplierName, setSupplierName] = useState('');

    // 点击标签 → 请求数据 → 弹窗
    const handleClickTag = (item: any) => {
        setLoading(true);
        setSupplierName(item.supplierName || '');
        Application.one(item.id).then((res: TypeErrorCode) => {
            if (res.ErrorCode === 0) {
                console.log('res',res)
                setDetailData(res.Data);
                setOpen(true);
            }
        }).finally(() => {
            setLoading(false);
        });
    };

    // 产品表格列
    const productColumns = [
        {
            title: '产品名称',
            dataIndex: 'productsName',
            key: 'productsName',
        },
        {
            title: '单价',
            dataIndex: 'price',
            key: 'price',
            render: (t) => `${t} 元`,
        },
        {
            title: '数量',
            dataIndex: 'quantityTotal',
            key: 'quantityTotal',
        },
        {
            title: '单位',
            dataIndex: 'unitsName',
            key: 'unitsName',
        },
        {
            title: '总价',
            dataIndex: 'totalPrice',
            key: 'totalPrice',
            render: (t) => `${t} 元`,
        },
    ];
    return (
        <>
            <Space wrap size={[8, 8]}>
                {list.length <= 0 ? (
                    <span style={{ color: '#999' }}>暂无已选择采购单</span>
                ) : (
                    list.map(item => (
                        <Tag
                            key={item.id}
                            closable={!!onRemove}
                            onClose={onRemove ? () => onRemove(item.id) : undefined}
                            color="blue"
                            style={{ cursor: 'pointer' }}
                            onClick={() => handleClickTag(item)}
                        >
                            {item.orderCode}
                        </Tag>
                    ))
                )}
            </Space>

            {/* 详情弹窗 */}
            <Modal
                title="采购单详情"
                open={open}
                width={900}
                destroyOnClose
                loading={loading}
                onCancel={() => {
                    setOpen(false);
                    setDetailData(null);
                }}
                footer={null}
            >
                {detailData && (
                    <>
                        <Descriptions column={2} bordered size="small">
                            <Descriptions.Item label="采购单号">
                                {detailData.orderCode || ''}
                            </Descriptions.Item>
                            <Descriptions.Item label="采购日期">
                                {dayjs(detailData.orderTime).format('YYYY-MM-DD')}
                            </Descriptions.Item>
                            <Descriptions.Item label="供应商">
                                {supplierName || ''}
                            </Descriptions.Item>
                            <Descriptions.Item label="物品总价">
                                {detailData.totalAmount || '-'} 元
                            </Descriptions.Item>
                            <Descriptions.Item label="已交金额">
                                {detailData.paidAmount||'0'} 元
                            </Descriptions.Item>
                            <Descriptions.Item label="备注">
                                {detailData.remark || ''}
                            </Descriptions.Item>
                            <Descriptions.Item label="订单类型">
                                {detailData.orderType === 1 ? '采购入库' : '直接入库' || ''}
                            </Descriptions.Item>
                        </Descriptions>

                        {/* 产品列表表格 */}
                        <div style={{ marginTop: 16 }}>
                            <h4 style={{ marginBottom: 8 }}>采购产品明细</h4>
                            <Table
                                columns={productColumns}
                                dataSource={detailData.ppList || []}
                                rowKey="id"
                                pagination={false}
                                size="small"
                                bordered
                            />
                        </div>
                    </>
                )}
            </Modal>
        </>
    );
};

export default CaigouTagList;