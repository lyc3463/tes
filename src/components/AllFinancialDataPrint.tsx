import React from 'react';
import dayjs from 'dayjs';
import { numberToRMB } from "@/utils/OpenTool";

interface PrintProps {
    printList: Array<{
        orderCode: string;
        orderDate: string;
        createUserName: string;
        reviewerName: string;
        company_name: string;
        project_name: string;
        account_name: string;
        account_code: string;
        account_type: number,
        paidAmount: number,
        totalAmount: number,
        moneyType: number,
        remark?: string;
        fdList: Array<{
            id: string | number;
            summary?: string;
            subjectName?: string;
            amount?: number;
        }>;
    }>
}
type PrintItemType = PrintProps['printList'][number];

const AllFinancialDataPrint = React.forwardRef<HTMLDivElement, PrintProps>(({ printList }, ref) => {
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
                                    {item.moneyType === 1 ? (
                                        <div>
                                            <div style={{
                                                display: "flex",
                                                flexDirection: "column",
                                                alignItems: 'center',
                                                width: '100%',
                                                fontFamily: 'SimSun, serif'
                                            }}>
                                                <div style={{
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    width: '100%',
                                                    maxWidth: '800px',
                                                }}>
                                                    <h2 style={{
                                                        margin: '0 0 20px 0',
                                                        fontSize: '22px',
                                                        fontWeight: 700,
                                                        color: 'red',
                                                        textDecoration: 'none',
                                                        letterSpacing: '2px',
                                                        borderBottom: '2px solid red',
                                                        textAlign: 'center'
                                                    }}>收入证明单</h2>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                        <p style={{
                                                            margin: '0 0 16px 0',
                                                            fontSize: '16px',
                                                            fontWeight: 600,
                                                            color: '#000',
                                                        }}>{item.project_name}</p>
                                                        <p style={{
                                                            margin: '0',
                                                            fontSize: '14px',
                                                            fontWeight: 600,
                                                            color: 'red',
                                                        }}>日期: <span style={{ color: '#000' }}>{dayjs(item.orderDate).format('YYYY-MM-DD')}</span></p>
                                                        <p style={{
                                                            margin: '0',
                                                            fontSize: '14px',
                                                        }}></p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', margin: '16px 0', alignItems: 'stretch' }}>
                                                <table style={{ width: '80%', borderCollapse: 'collapse' }}>
                                                    <thead>
                                                    <tr style={{ border: '1px solid red' }}>
                                                        <th style={{ border: '1px solid red', color: 'red', padding: '8px', textAlign: 'center', width: '20%' }}>明细科目</th>
                                                        <th style={{ border: '1px solid red', color: 'red', padding: '8px', textAlign: 'center', width: '40%' }}>摘要</th>
                                                        <th style={{ border: '1px solid red', color: 'red', padding: '8px', textAlign: 'center', width: '25%' }}>金额</th>
                                                    </tr>
                                                    </thead>
                                                    <tbody>
                                                    {item.fdList.length > 0 ? (
                                                        item.fdList.map((itemz, index) => {
                                                            const isLastRow = index === item.fdList.length - 1;
                                                            return (
                                                                <tr key={itemz.id}>
                                                                    <td style={{
                                                                        border: '1px solid red',
                                                                        color: '#000',
                                                                        height: '32px',
                                                                        fontSize: '12px',
                                                                        textAlign: 'center',
                                                                        borderBottom: isLastRow ? '1px solid red' : 'none'
                                                                    }}>{itemz.subjectName || ''}</td>
                                                                    <td style={{
                                                                        border: '1px solid red',
                                                                        color: '#000',
                                                                        height: '32px',
                                                                        fontSize: '12px',
                                                                        textAlign: 'center',
                                                                        borderBottom: isLastRow ? '1px solid red' : 'none'
                                                                    }}>{itemz.summary || ''}</td>
                                                                    <td style={{
                                                                        border: '1px solid red',
                                                                        color: '#000',
                                                                        height: '32px',
                                                                        fontSize: '12px',
                                                                        textAlign: 'center',
                                                                        borderBottom: isLastRow ? '1px solid red' : 'none'
                                                                    }}>{itemz.amount === 0 ? '' : itemz.amount || ''}</td>
                                                                </tr>
                                                            );
                                                        })
                                                    ) : ''}
                                                    <tr>
                                                        <td style={{
                                                            border: '1px solid red',
                                                            color: 'red',
                                                            height: '32px',
                                                            fontSize: '12px',
                                                            textAlign: 'center',
                                                            fontWeight: 'bold'
                                                        }}>统计</td>
                                                        <td style={{
                                                            border: '1px solid red',
                                                            color: '#000',
                                                            height: '32px',
                                                            fontSize: '12px',
                                                            textAlign: 'center'
                                                        }}>{numberToRMB(item.totalAmount)}</td>
                                                        <td style={{
                                                            border: '1px solid red',
                                                            color: '#000',
                                                            height: '32px',
                                                            fontSize: '12px',
                                                            textAlign: 'center',
                                                            fontWeight: 'bold'
                                                        }}>{item.totalAmount || ''}</td>
                                                    </tr>
                                                    </tbody>
                                                </table>
                                                <div style={{
                                                    color: '#000',
                                                    flex:'1',
                                                    fontSize: '14px',
                                                    borderTop: '1px solid red',
                                                    borderBottom: '1px solid red',
                                                    borderRight: '1px solid red',
                                                    borderLeft: 'none',
                                                    boxSizing: 'border-box',
                                                    padding: '8px',
                                                    minHeight: '100%'
                                                }}>
                                                    <div>{item.remark || ''}</div>
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: "space-around", color: 'red', marginBottom: '20px' }}>
                                                <span>负责人:<span style={{ color: '#000' }}>{item.createUserName}</span></span>
                                                <span>会计</span>
                                                <span>复核:<span style={{ color: '#000' }}>{item.reviewerName}</span></span>
                                                <span>出纳</span>
                                                <span>记账</span>
                                                <span>到票</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <div>
                                            <div style={{
                                                display: "flex",
                                                flexDirection: "column",
                                                alignItems: 'center',
                                                width: '100%',
                                                fontFamily: 'SimSun, serif'
                                            }}>
                                                <div style={{
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    width: '100%',
                                                    maxWidth: '800px',
                                                }}>
                                                    <h2 style={{
                                                        margin: '0 0 20px 0',
                                                        fontSize: '22px',
                                                        fontWeight: 700,
                                                        color: '#4d85ff',
                                                        textDecoration: 'none',
                                                        letterSpacing: '2px',
                                                        borderBottom: '2px solid #4d85ff',
                                                        textAlign: 'center'
                                                    }}>支付证明单</h2>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                        <p style={{
                                                            margin: '0 0 16px 0',
                                                            fontSize: '16px',
                                                            fontWeight: 600,
                                                            color: '#000',
                                                        }}>{item.project_name}</p>
                                                        <p style={{
                                                            margin: '0',
                                                            fontSize: '14px',
                                                            fontWeight: 600,
                                                            color: '#4d85ff',
                                                        }}>日期: <span style={{ color: '#000' }}>{dayjs(item.orderDate).format('YYYY-MM-DD')}</span></p>
                                                        <p style={{
                                                            margin: '0',
                                                            fontSize: '14px',
                                                        }}></p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', margin: ' 0', alignItems: 'stretch' }}>
                                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                                    <thead>
                                                    <tr style={{ border: '1px solid #4d85ff' }}>
                                                        <th style={{ border: '1px solid #4d85ff', color: '#4d85ff', padding: '8px', textAlign: 'center', width: '30%' }}>明细科目</th>
                                                        <th style={{ border: '1px solid #4d85ff', color: '#4d85ff', padding: '8px', textAlign: 'center', width: '40%' }}>摘要</th>
                                                        <th style={{ border: '1px solid #4d85ff', color: '#4d85ff', padding: '8px', textAlign: 'center', width: '30%' }}>金额</th>
                                                    </tr>
                                                    </thead>
                                                    <tbody>
                                                    {item.fdList.length > 0 ? (
                                                        item.fdList.map((itemz, index) => {
                                                            const isLastRow = index === item.fdList.length - 1;
                                                            return (
                                                                <tr key={itemz.id}>
                                                                    <td style={{
                                                                        border: '1px solid #4d85ff',
                                                                        color: '#000',
                                                                        height: '32px',
                                                                        fontSize: '12px',
                                                                        textAlign: 'center',
                                                                        borderBottom: isLastRow ? '1px solid #4d85ff' : 'none'
                                                                    }}>{itemz.subjectName || ''}</td>
                                                                    <td style={{
                                                                        border: '1px solid #4d85ff',
                                                                        color: '#000',
                                                                        height: '32px',
                                                                        fontSize: '12px',
                                                                        textAlign: 'center',
                                                                        borderBottom: isLastRow ? '1px solid #4d85ff' : 'none'
                                                                    }}>{itemz.summary || ''}</td>
                                                                    <td style={{
                                                                        border: '1px solid #4d85ff',
                                                                        color: '#000',
                                                                        height: '32px',
                                                                        fontSize: '12px',
                                                                        textAlign: 'center',
                                                                        borderBottom: isLastRow ? '1px solid #4d85ff' : 'none'
                                                                    }}>{itemz.amount === 0 ? '' : itemz.amount || ''}</td>
                                                                </tr>
                                                            );
                                                        })
                                                    ) : ''}
                                                    <tr>
                                                        <td style={{
                                                            border: '1px solid #4d85ff',
                                                            color: '#4d85ff',
                                                            height: '32px',
                                                            fontSize: '12px',
                                                            textAlign: 'center',
                                                            fontWeight: 'bold'
                                                        }}>统计</td>
                                                        <td style={{
                                                            border: '1px solid #4d85ff',
                                                            color: '#000',
                                                            height: '32px',
                                                            fontSize: '12px',
                                                            textAlign: 'center'
                                                        }}>{numberToRMB(item.totalAmount)}</td>
                                                        <td style={{
                                                            border: '1px solid #4d85ff',
                                                            color: '#000',
                                                            height: '32px',
                                                            fontSize: '12px',
                                                            textAlign: 'center',
                                                            fontWeight: 'bold'
                                                        }}>{item.totalAmount || ''}</td>
                                                    </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                            <div style={{ display: 'flex', border: '1px solid #4d85ff', borderTop: 'none', height: '60px', color: '#4d85ff' }}>
                                                <div style={{ flex: '0 0 50%', boxSizing: 'border-box', padding: '0 8px', display: 'flex', borderRight: '1px solid #4d85ff' }}>
                                                    <div style={{ flex: '0 0 30%', borderRight: '1px solid #4d85ff', justifyContent: 'center', alignItems: 'center', display: 'flex' }}>受款人及地址</div>
                                                    <div style={{ flex: '0 0 70%', justifyContent: 'center', alignItems: 'center', display: 'flex' }}></div>
                                                </div>
                                                <div style={{ flex: '0 0 50%', boxSizing: 'border-box', padding: '0 8px', display: 'flex' }}>
                                                    <div style={{ flex: '0 0 30%', borderRight: '1px solid #4d85ff', justifyContent: 'center', alignItems: 'center', display: 'flex' }}>备注</div>
                                                    <div style={{ flex: '0 0 70%', justifyContent: 'center', alignItems: 'center', display: 'flex',color:'#000' }}>{item.remark}</div>
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: "space-around", marginBottom: '20px', color: '#4d85ff' }}>
                                                <span>主营人:</span>
                                                <span>会计</span>
                                                <span>出纳:</span>
                                                <span>记账</span>
                                                <span>证明人</span>
                                                <span>经手人:<span style={{color:'#000'}}>{item.createUserName}</span></span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </React.Fragment>
                        );
                    })
                }
            </div>
        </div>
    );
});

export default AllFinancialDataPrint;