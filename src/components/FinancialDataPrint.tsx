import React from 'react'; // 添加 React 导入
import dayjs from 'dayjs';
import {numberToRMB} from "@/utils/OpenTool"; // 添加 dayjs 导入（用于日期格式化）

// 定义组件 Props 类型（确保传入的数组和字段类型安全）
interface PrintProps {
    orderCode: string;
    title: string;
    orderDate: string;
    createUserName: string;
    reviewerName: string;
    company_name: string;
    project_name: string;
    account_name: string;
    account_code: string;
    account_type:number,
    paidAmount:number,
    totalAmount:number,
    moneyType:number,
    remark?: string;
    goodsList: Array<{
        id: string | number;
        summary?: string;
        subjectName?: string;
        amount?: number;
    }>;
}

const FinancialDataPrint: React.FC<PrintProps> = ({orderCode,title, orderDate,createUserName, reviewerName, company_name, project_name, account_name, account_code, account_type,paidAmount,totalAmount,moneyType,remark, goodsList }) => {
    return (
        <>
            {moneyType==1?<>

                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: 'center',
                    width: '100%',
                    padding: '20px 0',
                    fontFamily: 'SimSun, serif'
                }}>
                    <div style={{
                        display: "flex",
                        flexDirection: "column",
                        width: '100%',
                        maxWidth: '800px',
                    }}>
                        {/* 主标题 - 优化排版样式 */}
                        <h2 style={{
                            margin: '0 0 20px 0',  // 增加底部间距，与项目信息分离
                            fontSize: '22px',      // 调整字号，避免过大
                            fontWeight: 700,
                            color:'red',
                            textDecoration: 'none', // 移除下划线，提升现代感
                            letterSpacing: '2px',   // 增加字间距，提升可读性
                            borderBottom: '2px solid red', // 添加底部边框替代下划线
                            textAlign: 'center'     // 确保标题居中
                        }}>{title}</h2>
                        {/* 公司名称 */}
                        <div style={{display:'flex',justifyContent:'space-between'}}>
                            <p style={{
                                margin: '0 0 16px 0',  // 增加底部间距，与标题分离
                                fontSize: '16px',
                                fontWeight: 600,
                                color:'#000',
                            }}>{project_name}</p>
                            {/* 项目信息 */}
                            <p style={{
                                margin: '0',  // 增加底部间距，与下方单号信息分离
                                fontSize: '14px',
                                fontWeight: 600,
                                color:'red',
                            }}>日期: <span style={{ color: '#000' }}>{dayjs(orderDate).format('YYYY-MM-DD')}</span></p>
                            <p style={{
                                margin: '0',  // 增加底部间距，与下方单号信息分离
                                fontSize: '14px',
                            }}></p>
                        </div>
                    </div>
                </div>
                {/* 物品列表表格（渲染 goods 数组） */}
                <div style={{ display: 'flex', margin: '16px 0', alignItems: 'stretch' }}> {/* 添加alignItems: 'stretch'使子元素高度一致 */}
                    {/* 物品列表表格（渲染 goods 数组） */}
                    <table style={{ width: '80%', borderCollapse: 'collapse' }}>
                        <thead>
                        <tr style={{ border: '1px solid red' }}>
                            {/* 调整列宽分配比例，摘要列设置更大宽度 */}
                            <th style={{ border: '1px solid red',color:'red', padding: '8px', textAlign: 'center', width: '20%' }}>明细科目</th>
                            <th style={{ border: '1px solid red',color:'red', padding: '8px', textAlign: 'center', width: '40%' }}>摘要</th>
                            <th style={{ border: '1px solid red',color:'red', padding: '8px', textAlign: 'center', width: '20%' }}>金额</th>
                        </tr>
                        </thead>
                        <tbody>
                        {goodsList.length > 0 ? (
                            goodsList.map((item, index) => {  // 添加index参数用于判断是否为最后一行
                                const isLastRow = index === goodsList.length - 1;  // 判断是否为最后一条数据
                                return (
                                    <tr key={item.id}>
                                        {/* 动态设置底部边框，非最后一行隐藏底部边框 */}
                                        <td style={{
                                            border: '1px solid red',
                                            color: '#000',
                                            height: '32px',
                                            fontSize:'12px',
                                            textAlign: 'center',
                                            borderBottom: isLastRow ? '1px solid red' : 'none'  // 最后一行显示底部边框
                                        }}>{item.subjectName || ''}</td>
                                        <td style={{
                                            border: '1px solid red',
                                            color: '#000',
                                            height: '32px',
                                            fontSize:'12px',
                                            textAlign: 'center',
                                            borderBottom: isLastRow ? '1px solid red' : 'none'
                                        }}>{item.summary || ''}</td>
                                        <td style={{
                                            border: '1px solid red',
                                            color: '#000',
                                            height: '32px',
                                            fontSize:'12px',
                                            textAlign: 'center',
                                            borderBottom: isLastRow ? '1px solid red' : 'none'
                                        }}>{item.amount === 0 ? '' : item.amount || ''}</td>
                                    </tr>
                                );
                            })
                        ) : ''}
                        {/* 总金额统计行 - 修复列数不匹配问题（改为3列） */}
                        <tr>
                            <td  style={{
                                border: '1px solid red',
                                color: 'red',
                                height: '32px',
                                fontSize: '12px',
                                textAlign: 'center',
                                fontWeight: 'bold'  // 加粗显示统计文字
                            }}>统计</td>
                            <td style={{
                                border: '1px solid red',
                                color: '#000',
                                height: '32px',
                                fontSize: '12px',
                                textAlign: 'center'
                            }}>{numberToRMB(totalAmount)}</td>
                            <td style={{
                                border: '1px solid red',
                                color: '#000',
                                height: '32px',
                                fontSize: '12px',
                                textAlign: 'center',
                                fontWeight: 'bold'  // 加粗显示总金额
                            }}>{totalAmount}</td>
                        </tr>
                        </tbody>
                    </table>
                    {/* 备注区域 - 移到表格外部并与之并排显示 */}
                    <div style={{
                        width: '20%',
                        color: '#000',
                        fontSize: '14px',
                        borderTop:'1px solid red',
                        borderBottom:'1px solid red',
                        borderRight:'1px solid red',
                        borderLeft:'none',
                        boxSizing: 'border-box', // 确保边框包含在元素尺寸内
                        padding: '8px', // 增加内边距，避免内容紧贴边框
                        minHeight: '100%'
                    }}>
                        <div>{remark || ''}</div>
                    </div>
                </div>
                <div style={{display:'flex',justifyContent:"space-around",color:'red'}}>
                    <span>负责人:<span style={{color:'#000'}}>{createUserName || ''}</span></span>
                    <span>会计:</span>
                    <span>复核:<span style={{color:'#000'}}>{reviewerName || ''}</span></span>
                    <span>出纳:</span>
                    <span>记账:</span>
                    <span>到票:</span>
                </div>
            </>:<>
                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: 'center',
                    width: '100%',
                    padding: '20px 0',
                    fontFamily: 'SimSun, serif'
                }}>
                    <div style={{
                        display: "flex",
                        flexDirection: "column",
                        width: '100%',
                        maxWidth: '800px',
                    }}>
                        {/* 主标题 - 优化排版样式 */}
                        <h2 style={{
                            margin: '0 0 20px 0',  // 增加底部间距，与项目信息分离
                            fontSize: '22px',      // 调整字号，避免过大
                            fontWeight: 700,
                            color:'#4d85ff',
                            textDecoration: 'none', // 移除下划线，提升现代感
                            letterSpacing: '2px',   // 增加字间距，提升可读性
                            borderBottom: '2px solid #4d85ff', // 添加底部边框替代下划线
                            textAlign: 'center'     // 确保标题居中
                        }}>{title}</h2>
                        {/* 公司名称 */}
                        <div style={{display:'flex',justifyContent:'space-between'}}>
                            <p style={{
                                margin: '0 0 16px 0',  // 增加底部间距，与标题分离
                                fontSize: '16px',
                                fontWeight: 600,
                                color:'#4d85ff',
                            }}>{project_name}</p>
                            {/* 项目信息 */}
                            <p style={{
                                margin: '0',  // 增加底部间距，与下方单号信息分离
                                fontSize: '14px',
                                fontWeight: 600,
                                color:'#4d85ff',
                            }}>日期: {dayjs(orderDate).format('YYYY-MM-DD')}</p>
                            <p style={{
                                margin: '0',  // 增加底部间距，与下方单号信息分离
                                fontSize: '14px',
                            }}></p>
                        </div>
                    </div>
                </div>
                {/* 物品列表表格（渲染 goods 数组） */}
                <div style={{ display: 'flex', margin: ' 0', alignItems: 'stretch' }}> {/* 添加alignItems: 'stretch'使子元素高度一致 */}
                    {/* 物品列表表格（渲染 goods 数组） */}
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                        <tr style={{ border: '1px solid #4d85ff' }}>
                            {/* 调整列宽分配比例，摘要列设置更大宽度 */}
                            <th style={{ border: '1px solid #4d85ff',color:'#4d85ff', padding: '8px', textAlign: 'center', width: '30%' }}>明细科目</th>
                            <th style={{ border: '1px solid #4d85ff',color:'#4d85ff', padding: '8px', textAlign: 'center', width: '40%' }}>摘要</th>
                            <th style={{ border: '1px solid #4d85ff',color:'#4d85ff', padding: '8px', textAlign: 'center', width: '30%' }}>金额</th>
                        </tr>
                        </thead>
                        <tbody>
                        {goodsList.length > 0 ? (
                            goodsList.map((item, index) => {  // 添加index参数用于判断是否为最后一行
                                const isLastRow = index === goodsList.length - 1;  // 判断是否为最后一条数据
                                return (
                                    <tr key={item.id}>
                                        {/* 动态设置底部边框，非最后一行隐藏底部边框 */}
                                        <td style={{
                                            border: '1px solid #4d85ff',
                                            color: '#4d85ff',
                                            height: '32px',
                                            fontSize:'12px',
                                            textAlign: 'center',
                                            borderBottom: isLastRow ? '1px solid #4d85ff' : 'none'  // 最后一行显示底部边框
                                        }}>{item.subjectName || ''}</td>
                                        <td style={{
                                            border: '1px solid #4d85ff',
                                            color: '#4d85ff',
                                            height: '32px',
                                            fontSize:'12px',
                                            textAlign: 'center',
                                            borderBottom: isLastRow ? '1px solid #4d85ff' : 'none'
                                        }}>{item.summary || ''}</td>
                                        <td style={{
                                            border: '1px solid #4d85ff',
                                            color: '#4d85ff',
                                            height: '32px',
                                            fontSize:'12px',
                                            textAlign: 'center',
                                            borderBottom: isLastRow ? '1px solid #4d85ff' : 'none'
                                        }}>{item.amount === 0 ? '' : item.amount || ''}</td>
                                    </tr>
                                );
                            })
                        ) : ''}
                        {/* 总金额统计行 - 修复列数不匹配问题（改为3列） */}
                        <tr>
                            <td  style={{
                                border: '1px solid #4d85ff',
                                color: '#4d85ff',
                                height: '32px',
                                fontSize: '12px',
                                textAlign: 'center',
                                fontWeight: 'bold'  // 加粗显示统计文字
                            }}>统计</td>
                            <td style={{
                                border: '1px solid #4d85ff',
                                color: '#4d85ff',
                                height: '32px',
                                fontSize: '12px',
                                textAlign: 'center'
                            }}>{numberToRMB(totalAmount)}</td>
                            <td style={{
                                border: '1px solid #4d85ff',
                                color: '#4d85ff',
                                height: '32px',
                                fontSize: '12px',
                                textAlign: 'center',
                                fontWeight: 'bold'  // 加粗显示总金额
                            }}>{totalAmount}</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
                <div style={{display:'flex',border:'1px solid #4d85ff',borderTop:'none',height:'60px',color:'#4d85ff'}}>
                    {/* 第一个50%宽度容器 - 内部按30%+70%拆分 */}
                    <div style={{flex: '0 0 50%', boxSizing: 'border-box', padding: '0 8px', display: 'flex',borderRight:'1px solid #4d85ff'}}>
                        <div style={{flex: '0 0 30%',borderRight:'1px solid #4d85ff',justifyContent:'center',alignItems:'center',display:'flex'}}>受款人及地址</div>
                        <div style={{flex: '0 0 70%',justifyContent:'center',alignItems:'center',display:'flex'}}></div>
                    </div>
                    {/* 第二个50%宽度容器 - 内部按30%+70%拆分 */}
                    <div style={{flex: '0 0 50%', boxSizing: 'border-box', padding: '0 8px', display: 'flex'}}>
                        <div style={{flex: '0 0 30%',borderRight:'1px solid #4d85ff',justifyContent:'center',alignItems:'center',display:'flex'}}>备注</div>
                        <div style={{flex: '0 0 70%',justifyContent:'center',alignItems:'center',display:'flex'}}>{remark}</div>
                    </div>
                </div>
                <div style={{display:'flex',justifyContent:"space-around",color:'#4d85ff'}}>
                    <span>主营人:</span>
                    <span>会计:</span>
                    <span>出纳:</span>
                    <span>记账:</span>
                    <span>证明人:</span>
                    <span>经手人:{createUserName}</span>
                </div>
            </>}
        </>
    );
};

export default FinancialDataPrint;