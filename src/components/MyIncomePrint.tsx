import dayjs from "dayjs";
import {numberToRMB} from "@/utils/OpenTool";
import React from "react";

const IncomePrint = ({ item }: { item: any }) => {
    return (
        <div>
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
                    <span>会计:</span>
                    <span>复核:<span style={{ color: '#000' }}>{item.reviewerName}</span></span>
                    <span>出纳:</span>
                    <span>记账:</span>
                    <span>到票:</span>
                </div>
            </div>
        </div>
    );
};

export default IncomePrint;