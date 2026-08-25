import React, {useState} from 'react';
import dayjs from 'dayjs';
import { numberToRMB } from "@/utils/OpenTool";
import {Modal} from "antd";

interface PrintProps {
    printList: Record<string, any>[];
    className?: string;
}
type PrintItemType = PrintProps['printList'][number];

const AllFinancialDataPrint = React.forwardRef<HTMLDivElement, PrintProps>(({ printList, className }, ref) => {
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
            <div ref={ref} className={className ?? "print-only-content"}>
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
                                                            margin: '0',  // 增加底部间距，与下方单号信息分离
                                                            fontSize: '14px',
                                                            fontWeight: 600,
                                                        }}>{item.number}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', margin: '16px 0', alignItems: 'stretch' }}>
                                                <table style={{ width: '80%', borderCollapse: 'collapse' }}>
                                                    <thead>
                                                    <tr style={{ border: '1px solid red' }}>
                                                        <th style={{ border: '1px solid red', color: 'red', padding: '8px', textAlign: 'center', width: '20%' }}>明细科目</th>
                                                        <th style={{ border: '1px solid red', color: 'red', padding: '8px', textAlign: 'center', width: '20%' }}>摘要</th>
                                                        <th style={{ border: '1px solid red', color: 'red', padding: '8px', textAlign: 'center', width: '10%' }}>数量</th>
                                                        <th style={{ border: '1px solid red', color: 'red', padding: '8px', textAlign: 'center', width: '10%' }}>单位</th>
                                                        <th style={{ border: '1px solid red', color: 'red', padding: '8px', textAlign: 'center', width: '10%' }}>单价</th>
                                                        <th style={{ border: '1px solid red', color: 'red', padding: '8px', textAlign: 'center', width: '10%' }}>金额</th>
                                                    </tr>
                                                    </thead>
                                                    <tbody>
                                                    {item.fdList.length > 0 ? (
                                                        item.fdList.map((itemz: Record<string, any>, index: number) => {
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
                                                                    }}>{ itemz.quantity || ''}</td>
                                                                    <td style={{
                                                                        border: '1px solid red',
                                                                        color: '#000',
                                                                        height: '32px',
                                                                        fontSize: '12px',
                                                                        textAlign: 'center',
                                                                        borderBottom: isLastRow ? '1px solid red' : 'none'
                                                                    }}>{itemz.unit || ''}</td>
                                                                    <td style={{
                                                                        border: '1px solid red',
                                                                        color: '#000',
                                                                        height: '32px',
                                                                        fontSize: '12px',
                                                                        textAlign: 'center',
                                                                        borderBottom: isLastRow ? '1px solid red' : 'none'
                                                                    }}>{itemz.unitPrice|| ''}</td>
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
                                                            color: 'red',
                                                            height: '32px',
                                                            fontSize: '12px',
                                                            textAlign: 'center',
                                                            fontWeight: 'bold'
                                                        }}></td>
                                                        <td style={{
                                                            border: '1px solid red',
                                                            color: 'red',
                                                            height: '32px',
                                                            fontSize: '12px',
                                                            textAlign: 'center',
                                                            fontWeight: 'bold'
                                                        }}></td>
                                                        <td style={{
                                                            border: '1px solid red',
                                                            color: '#000',
                                                            height: '32px',
                                                            fontSize: '12px',
                                                            textAlign: 'center'
                                                        }}></td>
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
                                                <span>经手人:<span style={{ color: '#000' }}>{item.createUserName}</span></span>
                                                <span>会计</span>
                                                <span>复核:<span style={{ color: '#000' }}>{item.reviewerName}</span></span>
                                                <span>出纳</span>
                                                <span>记账</span>
                                                <span>到票</span>
                                            </div>
                                        </div>
                                    ) : item.moneyType===2?(
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
                                                            margin: '0',  // 增加底部间距，与下方单号信息分离
                                                            fontSize: '14px',
                                                            fontWeight: 600,
                                                        }}>{item.number}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', margin: ' 0', alignItems: 'stretch' }}>
                                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                                    <thead>
                                                    <tr style={{ border: '1px solid #4d85ff' }}>
                                                        <th style={{ border: '1px solid #4d85ff', color: '#4d85ff', padding: '8px', textAlign: 'center', width: '20%' }}>明细科目</th>
                                                        <th style={{ border: '1px solid #4d85ff', color: '#4d85ff', padding: '8px', textAlign: 'center', width: '20%' }}>摘要</th>
                                                        <th style={{ border: '1px solid #4d85ff', color: '#4d85ff', padding: '8px', textAlign: 'center', width: '10%' }}>数量</th>
                                                        <th style={{ border: '1px solid #4d85ff', color: '#4d85ff', padding: '8px', textAlign: 'center', width: '10%' }}>单位</th>
                                                        <th style={{ border: '1px solid #4d85ff', color: '#4d85ff', padding: '8px', textAlign: 'center', width: '10%' }}>单价</th>
                                                        <th style={{ border: '1px solid #4d85ff', color: '#4d85ff', padding: '8px', textAlign: 'center', width: '10%' }}>金额</th>
                                                    </tr>
                                                    </thead>
                                                    <tbody>
                                                    {item.fdList.length > 0 ? (
                                                        item.fdList.map((itemz: Record<string, any>, index: number) => {
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
                                                                    }}>{itemz.quantity || ''}</td>
                                                                    <td style={{
                                                                        border: '1px solid #4d85ff',
                                                                        color: '#000',
                                                                        height: '32px',
                                                                        fontSize: '12px',
                                                                        textAlign: 'center',
                                                                        borderBottom: isLastRow ? '1px solid #4d85ff' : 'none'
                                                                    }}>{itemz.unit || ''}</td>
                                                                    <td style={{
                                                                        border: '1px solid #4d85ff',
                                                                        color: '#000',
                                                                        height: '32px',
                                                                        fontSize: '12px',
                                                                        textAlign: 'center',
                                                                        borderBottom: isLastRow ? '1px solid #4d85ff' : 'none'
                                                                    }}>{itemz.unitPrice || ''}</td>
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
                                                        }}></td>
                                                        <td style={{
                                                            border: '1px solid #4d85ff',
                                                            color: '#000',
                                                            height: '32px',
                                                            fontSize: '12px',
                                                            textAlign: 'center',
                                                            fontWeight: 'bold'
                                                        }}></td>
                                                        <td style={{
                                                            border: '1px solid #4d85ff',
                                                            color: '#000',
                                                            height: '32px',
                                                            fontSize: '12px',
                                                            textAlign: 'center',
                                                            fontWeight: 'bold'
                                                        }}></td>
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
                                    ):(
                                        <div style={{ width: '800px', margin: '0 auto', fontFamily: 'SimSun' }}>
                                            {/* 标题 */}
                                            <h2 style={{
                                                textAlign: 'center',
                                                color: '#4d85ff',
                                                borderBottom: '2px solid #4d85ff',
                                                paddingBottom: '8px'
                                            }}>
                                                费用报销单
                                            </h2>

                                            {/* 顶部信息 */}
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                                <span style={{ color: '#4d85ff',fontWeight:600}}>报销部门：<span style={{fontWeight:400,color:'#000'}}>{item.company_name}</span></span>
                                                <span style={{ color: '#4d85ff',fontWeight:600}}>日期：<span style={{fontWeight:400,color:'#000'}}>{dayjs(item.orderDate).format('YYYY-MM-DD')}</span></span>
                                                <span><span style={{fontWeight:400,color:'#000'}}>{item.number}</span></span>
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
                                                                height: '40px', width: '30%' }}>用途</th>
                                                            <th style={{  border: '1px solid #4d85ff',
                                                                textAlign: 'center',
                                                                height: '40px', width: '10%' }}>数量</th>
                                                            <th style={{  border: '1px solid #4d85ff',
                                                                textAlign: 'center',
                                                                height: '40px', width: '10%' }}>单位</th>
                                                            <th style={{  border: '1px solid #4d85ff',
                                                                textAlign: 'center',
                                                                height: '40px', width: '10%' }}>单价</th>
                                                            <th style={{  border: '1px solid #4d85ff',
                                                                textAlign: 'center',
                                                                height: '40px', width: '20%' }}>总价</th>
                                                        </tr>
                                                        </thead>
                                                        <tbody>
                                                        {item.fdList.map((row: any, i: number) => (
                                                            <tr key={i}>
                                                                <td style={{ border: '1px solid #4d85ff',
                                                                    textAlign: 'center',
                                                                    height: '40px',fontSize:'12px'}}>{row.summary}</td>
                                                                <td style={{ border: '1px solid #4d85ff',
                                                                    textAlign: 'center',
                                                                    height: '40px',fontSize:'12px'}}>{row.quantity||''}</td>
                                                                <td style={{ border: '1px solid #4d85ff',
                                                                    textAlign: 'center',
                                                                    height: '40px',fontSize:'12px'}}>{row.unit||''}</td>
                                                                <td style={{ border: '1px solid #4d85ff',
                                                                    textAlign: 'center',
                                                                    height: '40px',fontSize:'12px'}}>{row.unitPrice||''}</td>
                                                                <td style={{ border: '1px solid #4d85ff',
                                                                    textAlign: 'center',
                                                                    height: '40px',fontSize:'12px'}}>{row.amount||''}</td>
                                                            </tr>
                                                        ))}
                                                        <tr>
                                                            <td style={{ border: '1px solid #4d85ff',
                                                                textAlign: 'center',
                                                                height: '40px'}}>合计</td>
                                                            <td style={{ border: '1px solid #4d85ff',
                                                                textAlign: 'center',
                                                                height: '40px',}}></td>
                                                            <td style={{ border: '1px solid #4d85ff',
                                                                textAlign: 'center',
                                                                height: '40px',}}></td>
                                                            <td style={{ border: '1px solid #4d85ff',
                                                                textAlign: 'center',
                                                                height: '40px',}}></td>
                                                            <td style={{ border: '1px solid #4d85ff',
                                                                textAlign: 'center',
                                                                height: '40px',}}>{item.totalAmount}</td>

                                                        </tr>
                                                        <tr>
                                                            <td style={{ border: '1px solid #4d85ff',
                                                                textAlign: 'center',
                                                                height: '40px',}}>金额大写</td>
                                                            <td style={{ border: '1px solid #4d85ff',
                                                                textAlign: 'center',
                                                                height: '40px',}}></td>
                                                            <td style={{ border: '1px solid #4d85ff',
                                                                textAlign: 'center',
                                                                height: '40px',}}></td>
                                                            <td style={{ border: '1px solid #4d85ff',
                                                                textAlign: 'center',
                                                                height: '40px',}}></td>
                                                            <td style={{ border: '1px solid #4d85ff',
                                                                textAlign: 'center',
                                                                height: '40px',}}>{numberToRMB(item.totalAmount)}</td>
                                                        </tr>
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
                                                            {item.remark}
                                                        </div>
                                                    </div>

                                                    {/* 中：领导审批 */}
                                                    <div style={{ flex: 1, borderBottom: '1px solid #4d85ff' }}>
                                                        <div style={{ padding: '6px', color: '#4d85ff', borderBottom: '1px solid #4d85ff',fontWeight:600  }}>
                                                            领导审批
                                                        </div>
                                                        <div style={{ padding: '6px', height: '80px' }} />
                                                    </div>

                                                    {/* 下：借款信息（关键） */}
                                                    <div style={{
                                                        // padding: '6px',
                                                        height: '41px',
                                                        display: 'flex',
                                                        justifyContent: 'space-evenly',
                                                        alignItems:'center',
                                                        color: '#000'
                                                    }}>
                                                        <span>原借款：</span>
                                                        <span>应退/补款：</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: "space-around", marginBottom: '10px', color: '#4d85ff' }}>
                                                <span>会计主管:</span>
                                                <span>复核:</span>
                                                <span>出纳:</span>
                                                <span>经手人:<span style={{color:'#000'}}>{item.createUserName}</span></span>
                                                <span>领款人:</span>
                                            </div>
                                            <div>
                                                {/* 供应商名称 */}
                                                {item.supplierName && typeof item.supplierName === 'string' && item.supplierName.trim() !== '' ? (
                                                    <>
                                                        {item.supplierName}
                                                        {/* 后面有内容才显示逗号 */}
                                                        {(item.supplierAddress || item.personPhone || item.personName) && '，'}
                                                    </>
                                                ) : ''}

                                                {/* 供应商地址 */}
                                                {item.supplierAddress && typeof item.supplierAddress === 'string' && item.supplierAddress.trim() !== '' ? (
                                                    <>
                                                        {item.supplierAddress}
                                                        {/* 后面有内容才显示逗号 */}
                                                        {(item.personPhone || item.personName) && '，'}
                                                    </>
                                                ) : ''}

                                                {/* 联系人 */}
                                                {item.personName && typeof item.personName === 'string' && item.personName.trim() !== '' ? (
                                                    <>
                                                        {item.personName}
                                                        {/* 后面有电话才显示逗号 */}
                                                        {item.personPhone && '，'}
                                                    </>
                                                ) : ''}

                                                {/* 联系电话 */}
                                                {item.personPhone && typeof item.personPhone === 'string' && item.personPhone.trim() !== '' ? item.personPhone : ''}
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