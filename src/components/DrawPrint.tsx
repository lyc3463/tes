import React from 'react'; // 添加 React 导入
import dayjs from 'dayjs'; // 添加 dayjs 导入（用于日期格式化）

// 定义组件 Props 类型（确保传入的数组和字段类型安全）
interface PrintProps {
    orderCode: string;
    title: string;
    warehouseName: string;
    orderTime: string;
    paidAmount: number;
    user_name: string;
    displayData: Array<{
        id: string | number;
        productsName?: string;
        productsCode?: string;
        unitsName?: string;
        quantity?: number;
    }>;
}

const DrawPrint: React.FC<PrintProps> = ({ title, orderCode,user_name, warehouseName, orderTime, displayData }) => {
    return (
        <div style={{ fontSize: '14px', width: '100%' }}>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <h2>{title}</h2>
                <p>
                     单号: {orderCode} | 申请人: {user_name} |
                </p>
                <p>
                    仓库: {warehouseName} |  领用日期: {dayjs(orderTime).format('YYYY-MM-DD')}
                </p>
            </div>

            {/* 物品列表表格（渲染 goods 数组） */}
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                <tr style={{ border: '1px solid #000' }}>
                    <th style={{ border: '1px solid #000', padding: '8px', textAlign: 'center' }}>物品名称</th>
                    <th style={{ border: '1px solid #000', padding: '8px', textAlign: 'center' }}>编号</th>
                    <th style={{ border: '1px solid #000', padding: '8px', textAlign: 'center' }}>单位</th>
                    <th style={{ border: '1px solid #000', padding: '8px', textAlign: 'center' }}>数量</th>
                </tr>
                </thead>
                <tbody>
                {displayData.length > 0 ? (
                    displayData.map((item) => (
                        <tr key={item.id} style={{ border: '1px solid #000' }}>
                            <td style={{ border: '1px solid #000', padding: '8px' }}>{item.productsName || '未知物品'}</td>
                            <td style={{ border: '1px solid #000', padding: '8px', textAlign: 'center' }}>{item.productsCode || '-'}</td>
                            <td style={{ border: '1px solid #000', padding: '8px', textAlign: 'center' }}>{item.unitsName || '-'}</td>
                            <td style={{ border: '1px solid #000', padding: '8px', textAlign: 'center' }}>{item.quantity || 0}</td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan={5} style={{ border: '1px solid #000', padding: '8px', textAlign: 'center' }}>
                            暂无物品数据
                        </td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>
    );
};

export default DrawPrint;