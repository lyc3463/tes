import React from 'react';
import dayjs from 'dayjs';
import { numberToRMB } from "@/utils/OpenTool";

interface PrintProps {
    printList: Array<{
        consumptionDate: string;
        phone: string;
        consumptionType: number;
        consumptionMoney: number;
        id: number;

    }>
}
type PrintItemType = PrintProps['printList'][number];

const MyReceiptPrint = React.forwardRef<HTMLDivElement, PrintProps>(({ printList }, ref) => {
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
                {
                    printList.map((item: PrintItemType, index: number) => {
                        return (
                            <React.Fragment key={index}>
                                <div className="financial-record">
                                    <div style={{ width: '800px', margin: '0 auto', fontFamily: 'SimSun' }}>
                                        {/* 标题 */}
                                        <h2 style={{
                                            textAlign: 'center',
                                            color: '#4d85ff',
                                            borderBottom: '2px solid #4d85ff',
                                            paddingBottom: '8px'
                                        }}>
                                            收据单
                                        </h2>

                                        {/* 顶部信息 */}
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                            <span style={{ color: '#4d85ff',fontWeight:600}}>日期：<span style={{fontWeight:400,color:'#000'}}>{dayjs(item.consumptionDate).format('YYYY-MM-DD')}</span></span>
                                        </div>

                                        {/* 主表格 */}
                                        <div style={{ display: 'flex', alignItems: 'stretch' }}>

                                            {/* 左边：表格 */}
                                            <div style={{ flex: '0 0 79%' }}>
                                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                                    <thead>
                                                    <tr>
                                                        <th style={{  border: '1px solid #4d85ff',
                                                            textAlign: 'center',
                                                            height: '40px', width: '30%' }}>联系方式</th>
                                                        <th style={{  border: '1px solid #4d85ff',
                                                            textAlign: 'center',
                                                            height: '40px', width: '10%' }}>来源</th>
                                                        <th style={{  border: '1px solid #4d85ff',
                                                            textAlign: 'center',
                                                            height: '40px', width: '10%' }}>金额</th>
                                                    </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr >
                                                            <td style={{ border: '1px solid #4d85ff',
                                                                textAlign: 'center',
                                                                height: '40px',fontSize:'12px'}}>{item.phone}</td>
                                                            <td style={{ border: '1px solid #4d85ff',
                                                                textAlign: 'center',
                                                                height: '40px',fontSize:'12px'}}>{item.consumptionType==1?'微信充值':"大额转账"}</td>
                                                            <td style={{ border: '1px solid #4d85ff',
                                                                textAlign: 'center',
                                                                height: '40px',fontSize:'12px'}}>{item.consumptionMoney}</td>
                                                        </tr>
                                                    <tr>
                                                        <td style={{ border: '1px solid #4d85ff',
                                                            textAlign: 'center',
                                                            height: '40px'}}>合计</td>
                                                        <td style={{ border: '1px solid #4d85ff',
                                                            textAlign: 'center',
                                                            height: '40px',}}></td>
                                                        <td style={{ border: '1px solid #4d85ff',
                                                            textAlign: 'center',
                                                            height: '40px',}}>{item.consumptionMoney}</td>
                                                    </tr>
                                                    {/*<tr>*/}
                                                    {/*    <td style={{ border: '1px solid #4d85ff',*/}
                                                    {/*        textAlign: 'center',*/}
                                                    {/*        height: '40px',}}>金额大写</td>*/}
                                                    {/*    <td style={{ border: '1px solid #4d85ff',*/}
                                                    {/*        textAlign: 'center',*/}
                                                    {/*        height: '40px',}}></td>*/}
                                                    {/*    <td style={{ border: '1px solid #4d85ff',*/}
                                                    {/*        textAlign: 'center',*/}
                                                    {/*        height: '40px',}}></td>*/}

                                                    {/*</tr>*/}
                                                    </tbody>
                                                </table>
                                            </div>

                                            {/* 右边：上下结构 */}
                                            <div style={{
                                                flex: '0 0 20%',
                                                border: '1px solid #4d85ff',
                                                borderLeft: 'none',
                                                display: 'flex',
                                                flexDirection: 'column'
                                            }}>

                                                {/* 上：备注 */}
                                                <div style={{ flex: 1, borderBottom: '1px solid #4d85ff' }}>
                                                    <div style={{ padding: '6px', borderBottom: '1px solid #4d85ff', color: '#4d85ff',fontWeight:600 }}>
                                                        备注
                                                    </div>
                                                    <div style={{ padding: '6px', color: '#000' }}>

                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                    </div>

                                </div>
                            </React.Fragment>
                        );
                    })
                }
            </div>
        </div>
    );
});

export default MyReceiptPrint;