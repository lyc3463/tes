import dayjs from "dayjs";
import {numberToRMB} from "@/utils/OpenTool";
import React from "react";

const ReimbursePrint = ({ item }: { item: any }) => {
    const th = {
        border: '1px solid #4d85ff',
        color: '#4d85ff',
        padding: '6px',
        textAlign: 'center'
    };

    const td = {
        border: '1px solid #4d85ff',
        textAlign: 'center',
        height: '40px',
    };

    const rowBox = {
        display: 'flex',
        justifyContent: 'space-between',
        padding: '8px'
    };
    return (
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
                <div style={{ flex: '0 0 70%' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                        <tr>
                            <th style={{ ...td, width: '20%' }}>用途</th>
                            <th style={{ ...td, width: '10%' }}>数量</th>
                            <th style={{ ...td, width: '10%' }}>单位</th>
                            <th style={{ ...td, width: '10%' }}>单价</th>
                            <th style={{ ...td, width: '10%' }}>总价</th>
                        </tr>
                        </thead>
                        <tbody>
                        {item.fdList.map((row: any, i: number) => (
                            <tr key={i}>
                                <td style={{...td,fontSize:'12px'}}>{row.summary}</td>
                                <td style={{...td,fontSize:'12px'}}>{row.quantity||''}</td>
                                <td style={{...td,fontSize:'12px'}}>{row.unit||''}</td>
                                <td style={{...td,fontSize:'12px'}}>{row.unitPrice||''}</td>
                                <td style={{...td,fontSize:'12px'}}>{row.amount||''}</td>
                            </tr>
                        ))}
                        <tr>
                            <td style={td}>合计</td>
                            <td style={td}>{item.totalAmount}</td>
                            <td style={td}></td>
                            <td style={td}></td>
                            <td style={td}></td>
                        </tr>

                        <tr>
                            <td style={td}>金额大写</td>
                            <td style={td}></td>
                            <td style={td}></td>
                            <td style={td}></td>
                            <td style={td}></td>
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
            <div style={{ display: 'flex', justifyContent: "space-around", marginBottom: '20px', color: '#4d85ff' }}>
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
    );
};

export default ReimbursePrint;
