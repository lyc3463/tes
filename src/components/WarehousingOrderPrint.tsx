import React from 'react';
import dayjs from 'dayjs';
import { numberToRMB } from "@/utils/OpenTool";

interface PrintProps {
    printList: Array<{
        orderCode: string;
        number:string;
        orderTime: string;
        createUserName: string;
        productsName: string;
        quantityTotal: number;
        supplierName: string;
        productsCode: string;
        unitsName: string;
        warehouseName: string;
        price: number,
        quantitySum: number,
    }>,
}
type PrintItemType = PrintProps['printList'][number];

const WarehousingOrderPrint = React.forwardRef<HTMLDivElement, PrintProps>(({ printList }, ref) => {
    let quantityTotal=0;
    let quantitySum=0;
    let priceSum=0;
    let totalAmountSum=0;
    let quantityAmountSum=0;
    printList.forEach(item => {
        quantityTotal += item.quantityTotal || 0;
        quantitySum += item.quantitySum || 0;
        priceSum += item.price || 0;
        totalAmountSum += (item.quantityTotal || 0) * (item.price || 0);
        quantityAmountSum += (item.quantitySum || 0) * (item.price || 0);
    });
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
                            page-break-inside: avoid; 
                        }
                    }
                `}
            </style>
            <div ref={ref} className="print-only-content">
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                    <h2>采购明细</h2>
                    <p>
                        总数量: {quantityTotal.toFixed(3)} | 入库数量: {quantitySum.toFixed(3)}  |单价: {priceSum.toFixed(3)}元
                    </p>
                    <p>
                        总金额: {totalAmountSum.toFixed(3)}元 | 入库总金额: {quantityAmountSum.toFixed(3)}元
                    </p>

                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                    <tr style={{ border: '1px solid #000' }}>
                        <th style={{ border: '1px solid #000', padding: '8px', textAlign: 'center' }}>订单日期</th>
                        <th style={{ border: '1px solid #000', padding: '8px', textAlign: 'center' }}>物品名称</th>
                        <th style={{ border: '1px solid #000', padding: '8px', textAlign: 'center' }}>供应商</th>
                        <th style={{ border: '1px solid #000', padding: '8px', textAlign: 'center' }}>单位</th>
                        <th style={{ border: '1px solid #000', padding: '8px', textAlign: 'center' }}>总数量</th>
                        <th style={{ border: '1px solid #000', padding: '8px', textAlign: 'center' }}>入库数量</th>
                        <th style={{ border: '1px solid #000', padding: '8px', textAlign: 'center' }}>单价</th>
                        <th style={{ border: '1px solid #000', padding: '8px', textAlign: 'center' }}>金额</th>
                    </tr>
                    </thead>
                    {/* 正确：tbody 只写一次，里面循环 tr */}
                    <tbody>
                    {printList.map((item: PrintItemType, index: number) => (
                        <tr key={index} style={{ border: '1px solid #000' }}>
                            <td style={{ border: '1px solid #000', padding: '8px' }}>{dayjs(item.orderTime).format('YYYY-MM-DD') || ''}</td>
                            <td style={{ border: '1px solid #000', padding: '8px' }}>{item.productsName || ''}</td>
                            <td style={{ border: '1px solid #000', padding: '8px', textAlign: 'center' }}>{ item.supplierName|| '-'}</td>
                            <td style={{ border: '1px solid #000', padding: '8px', textAlign: 'center' }}>{ item.unitsName|| ''}</td>
                            <td style={{ border: '1px solid #000', padding: '8px', textAlign: 'center' }}>{ item.quantityTotal|| 0}</td>
                            <td style={{ border: '1px solid #000', padding: '8px', textAlign: 'center' }}>{ item.quantitySum|| 0}</td>
                            <td style={{ border: '1px solid #000', padding: '8px', textAlign: 'center' }}>{ item.price|| 0}</td>
                            <td style={{ border: '1px solid #000', padding: '8px', textAlign: 'center' }}>{ (item.quantityTotal*item.price).toFixed(3)|| 0}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
});

export default WarehousingOrderPrint;