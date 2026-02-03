import React from 'react'; // 添加 React 导入
import dayjs from 'dayjs'; // 添加 dayjs 导入（用于日期格式化）

// 定义组件 Props 类型（确保传入的数组和字段类型安全）
interface PrintProps {
    orderCode: string;
    title: string;
    warehouseName: string;
    orderTime: string;
    user_name: string;
    pmName,
    paidAmount,
    totalAmount,
    discountRate,
    displayData: Array<{
        id: string | number;
        productsName?: string;
        productsCode?: string;
        unitsName?: string;
        quantity?: number;
        totalPrice?: number;
        discountRateDp?: number;
        price?: number;
    }>;
}

const DrawPrint: React.FC<PrintProps> = ({discountPrice,customerName,totalAmount,discountRate,paidAmount,pmName,title, orderCode,user_name, warehouseName, orderTime, displayData }) => {
    return (
        <>
            <div style={{
                display: "flex",
                flexDirection: "column",
                alignItems: 'center',
                width: '100%',
                padding: '20px 0', // 增加上下内边距，避免内容贴边
            }}>
                <h2 style={{
                    margin: '0 0 16px 0', // 仅保留底部间距，与下方内容分离
                    fontSize: '20px',
                    fontWeight: 600
                }}>{title}</h2>

                {/* 优化嵌套容器样式 */}
                <div>
                    <p style={{ margin: '0 0 4px 0' }}>
                        单号: {orderCode} | 销售人: {user_name} | 客户: {customerName}|日期: {dayjs(orderTime).format('YYYY-MM-DD')}
                    </p>
                    <p style={{ margin: 0 }}>
                        折扣率: {discountRate}% | 折后价: {totalAmount}元 | 实收金额: {paidAmount}元 | 总金额: {discountPrice}元
                    </p>
                </div>

            </div>

            {/* 物品列表表格（渲染 goods 数组） */}
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                <tr style={{ border: '1px solid #000' }}>
                    <th style={{ border: '1px solid #000', padding: '8px', textAlign: 'center' }}>物品名称</th>
                    <th style={{ border: '1px solid #000', padding: '8px', textAlign: 'center' }}>编号</th>
                    <th style={{ border: '1px solid #000', padding: '8px', textAlign: 'center' }}>单位</th>
                    <th style={{ border: '1px solid #000', padding: '8px', textAlign: 'center' }}>数量</th>
                    <th style={{ border: '1px solid #000', padding: '8px', textAlign: 'center' }}>折扣%</th>
                    <th style={{ border: '1px solid #000', padding: '8px', textAlign: 'center' }}>单价(元)</th>
                    <th style={{ border: '1px solid #000', padding: '8px', textAlign: 'center' }}>售价(元)</th>
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
                            <td style={{ border: '1px solid #000', padding: '8px', textAlign: 'center' }}>{item.discountRateDp || 0}</td>
                            <td style={{ border: '1px solid #000', padding: '8px', textAlign: 'center' }}>{item.price || 0}</td>
                            <td style={{ border: '1px solid #000', padding: '8px', textAlign: 'center' }}>{item.totalPrice || 0}</td>
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
        </>
    );
};

export default DrawPrint;