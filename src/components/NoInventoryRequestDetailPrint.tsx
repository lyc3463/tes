import React, { forwardRef } from 'react'; // 新增 forwardRef 导入
import dayjs from 'dayjs';

// 定义组件 Props 类型
interface PrintProps {
    orderCode: string;
    title: string;
    warehouseName: string;
    orderTime: string;
    user_name: string;
    type: number;
    stockStatus: number;
    stockStutes: number;
    displayData: Array<{
        id: string | number;
        productsName?: string;
        productsCode?: string;
        unitsName?: string;
        quantity?: number;
        quantityKc?: number;
        quantityKc2?: number;
    }>;
}

// 定义 ref 类型（可选，TS 类型提示）
type PrintComponentRef = HTMLDivElement;

// 核心改造：用 forwardRef 包裹组件，接收 ref 参数
const NoInventoryRequestDetailPrint = forwardRef<PrintComponentRef, PrintProps>(
    ({ stockStatus,stockStutes, type, title, orderCode, user_name, warehouseName, orderTime, displayData }, ref) => {
        return (
            <div>
                <style>
                    {`
                    @media print {
                        .print-only-content {
                            display: flex;
                            flex-direction: column;
                            height: 100%;
                        }
                        .financial-record {
                            margin: 5mm 0;
                            height: 50%;
                            box-sizing: border-box;
                            page-break-inside: avoid; /* 防止记录被分页截断 */
                        }
                    }
                `}
                </style>
                <div ref={ref} className="print-only-content">
                    <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                        <h2>{title}</h2>
                        <p>
                            单号: {orderCode} | 申请人: {user_name} |
                        </p>
                        <p>
                            仓库: {warehouseName} | 日期: {dayjs(orderTime).format('YYYY-MM-DD')}
                        </p>
                    </div>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                        <tr style={{ border: '1px solid #000' }}>
                            <th style={{ border: '1px solid #000', padding: '8px', textAlign: 'center' }}>物品名称</th>
                            <th style={{ border: '1px solid #000', padding: '8px', textAlign: 'center' }}>编号</th>
                            <th style={{ border: '1px solid #000', padding: '8px', textAlign: 'center' }}>单位</th>
                            {
                                stockStutes===2||stockStutes===3?
                                    <th style={{ border: '1px solid #000', padding: '8px', textAlign: 'center' }}>盘点数量</th>:''
                            }
                            { stockStutes===3 ? (
                                <>
                                    <th style={{ border: '1px solid #000', padding: '8px', textAlign: 'center' }}>库存数量</th>
                                    <th style={{ border: '1px solid #000', padding: '8px', textAlign: 'center' }}>差异</th>
                                </>
                            ) : ''}
                        </tr>
                        </thead>
                        <tbody>
                        {displayData.length > 0 ? (
                            displayData.map((item) => (
                                <tr key={item.id} style={{ border: '1px solid #000' }}>
                                    <td style={{ border: '1px solid #000', padding: '8px' }}>{item.productsName || '未知物品'}</td>
                                    <td style={{ border: '1px solid #000', padding: '8px', textAlign: 'center' }}>{item.productsCode || '-'}</td>
                                    <td style={{ border: '1px solid #000', padding: '8px', textAlign: 'center' }}>{item.unitsName || '-'}</td>
                                    {
                                        stockStutes===2||stockStutes===3?<td style={{ border: '1px solid #000', padding: '8px', textAlign: 'center' }}>{item.quantity ? item.quantity : 0 || 0}</td>:''
                                    }
                                    {stockStutes===3 ? (
                                        <>
                                            <td style={{ border: '1px solid #000', padding: '8px', textAlign: 'center' }}>
                                                {stockStatus === 1 ? item.quantityKc2 || 0 : item.quantityKc || 0}
                                            </td>
                                            <td style={{ border: '1px solid #000', padding: '8px', textAlign: 'center' }}>
                                                {(item.quantity - item.quantityKc2).toFixed(2) || 0}
                                            </td>
                                        </>
                                    ) : ''}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                {/* 修复：colSpan 计算错误（type=1时应该是6列，否则4列） */}
                                <td
                                    colSpan={type === 1 ? 6 : 4}
                                    style={{ border: '1px solid #000', padding: '8px', textAlign: 'center' }}
                                >
                                    暂无物品数据
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
);

// 可选：给组件添加.displayName，方便调试
NoInventoryRequestDetailPrint.displayName = 'NoInventoryRequestDetailPrint';

export default NoInventoryRequestDetailPrint;