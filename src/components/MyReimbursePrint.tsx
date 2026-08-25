import dayjs from "dayjs";
import React, { useState } from "react";
import {Modal, Image, Button} from "antd";
import {getImgSrc, numberToRMB} from "@/utils/OpenTool";
import {FilePdfOutlined} from "@ant-design/icons";
import CaigouTagList from "@/components/CaigouTagListProps";

// 抽离明细类型
interface FdListItem {
    id: string | number;
    summary?: string;
    subjectName?: string;
    amount?: number;
    quantity?: number;
    unit?: string;
    unitPrice?: number;
}

// 单据主体类型
interface PrintItem {
    orderCode: string;
    number: string;
    orderDate: string;
    createUserName: string;
    reviewerName: string;
    company_name: string;
    project_name: string;
    account_name: string;
    account_code: string;
    account_type: number;
    paidAmount: number;
    totalAmount: number;
    moneyType: number;
    remark?: string;
    supplierName?: string;
    personPhone?: string;
    supplierAddress?: string;
    personName?: string;
    foImage?: string;
    fdList: FdListItem[];
    poList: any[];
}

// 组件入参外层类型
interface PrintProps {
    printItem: PrintItem;
}

// 标准函数组件，类型正确
const ReimbursePrint = ({ item }: { item: PrintProps }) => {

    const [open, setOpen] = useState(false);
      // 采购单
    const [isOpenInfo,setIsOpenInfo]=useState(false);
    // 解构简化，全局直接使用 data 代替 item.printItem
    const data = item.printItem;
    console.log('详情', data);
    

    const th = {
        border: "1px solid #4d85ff",
        color: "#4d85ff",
        padding: "6px",
        textAlign: "center"
    };

    const td = {
        border: "1px solid #4d85ff",
        textAlign: "center",
        height: "40px"
    };

    const rowBox = {
        display: "flex",
        justifyContent: "space-between",
        padding: "8px"
    };

    return (
        <div style={{ width: "800px", margin: "0 auto", fontFamily: "SimSun" }}>
            {/* 标题 */}
            <h2 style={{
                textAlign: "center",
                color: "#4d85ff",
                borderBottom: "2px solid #4d85ff",
                paddingBottom: "8px"
            }}>
                费用报销单
            </h2>

            {/* 顶部信息 */}
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
        <span style={{ color: "#4d85ff", fontWeight: 600 }}>
          报销部门：
          <span style={{ fontWeight: 400, color: "#000" }}>{data.company_name}</span>
        </span>
                <span style={{ color: "#4d85ff", fontWeight: 600 }}>
          日期：
          <span style={{ fontWeight: 400, color: "#000" }}>
            {dayjs(data.orderDate).format("YYYY-MM-DD")}
          </span>
        </span>
                <span>
          <a onClick={() => setOpen(true)} style={{ fontWeight: 400, color: "#000" }}>{data.number}</a>
        </span>
            </div>

            {/* 主表格区域 */}
            <div style={{ display: "flex", alignItems: "stretch" }}>
                {/* 左侧明细表格 */}
                <div style={{ flex: "0 0 70%" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                        <tr>
                            <th style={{ ...td, width: "20%" }}>用途</th>
                            <th style={{ ...td, width: "10%" }}>数量</th>
                            <th style={{ ...td, width: "10%" }}>单位</th>
                            <th style={{ ...td, width: "10%" }}>单价</th>
                            <th style={{ ...td, width: "10%" }}>总价</th>
                        </tr>
                        </thead>
                        <tbody>
                        {data.fdList.map((row, i) => (
                            <tr key={i}>
                                <td style={{ ...td, fontSize: "12px" }}>{row.summary}</td>
                                <td style={{ ...td, fontSize: "12px" }}>{row.quantity || ""}</td>
                                <td style={{ ...td, fontSize: "12px" }}>{row.unit || ""}</td>
                                <td style={{ ...td, fontSize: "12px" }}>{row.unitPrice || ""}</td>
                                <td style={{ ...td, fontSize: "12px" }}>{row.amount || ""}</td>
                            </tr>
                        ))}
                        <tr>
                            <td style={td}>合计</td>
                            <td style={td}></td>
                            <td style={td}></td>
                            <td style={td}></td>
                            <td style={td}>{data.totalAmount}</td>
                        </tr>
                        <tr>
                            <td style={td}>金额大写</td>
                            <td style={td}></td>
                            <td style={td}></td>
                            <td style={td}></td>
                            <td style={td}>{numberToRMB(data.totalAmount)}</td>
                        </tr>
                        </tbody>
                    </table>
                </div>

                {/* 右侧备注审批栏 */}
                <div style={{
                    flex: "0 0 20%",
                    border: "1px solid #4d85ff",
                    borderLeft: "none",
                    display: "flex",
                    flexDirection: "column"
                }}>
                    <div style={{ flex: 1, borderBottom: "1px solid #4d85ff" }}>
                        <div style={{ padding: "6px", borderBottom: "1px solid #4d85ff", color: "#4d85ff", fontWeight: 600 }}>
                            备注
                        </div>
                        <div style={{ padding: "6px", color: "#000" }}>
                            {data.remark}
                        </div>
                    </div>
                    <div style={{ flex: 1, borderBottom: "1px solid #4d85ff" }}>
                        <div style={{ padding: "6px", color: "#4d85ff", borderBottom: "1px solid #4d85ff", fontWeight: 600 }}>
                            领导审批
                        </div>
                        <div style={{ padding: "6px", height: "80px" }} />
                    </div>
                    <div style={{
                        height: "41px",
                        display: "flex",
                        justifyContent: "space-evenly",
                        alignItems: "center",
                        color: "#000"
                    }}>
                        <span>原借款：</span>
                        <span>应退/补款：</span>
                    </div>
                </div>
            </div>

            {/* 底部签字栏 */}
            <div style={{ display: "flex", justifyContent: "space-around", marginBottom: "20px", color: "#4d85ff" }}>
                <span>会计主管:</span>
                <span>复核:</span>
                <span>出纳:</span>
                <span>经手人:<span style={{ color: "#000" }}>{data.createUserName}</span></span>
                <span>领款人:</span>
            </div>

            {/* 供应商信息 */}
            <div>
                {data.supplierName?.trim() && (
                    <>
                        {data.supplierName}
                        {(data.supplierAddress || data.personPhone || data.personName) && "，"}
                    </>
                )}
                {data.supplierAddress?.trim() && (
                    <>
                        {data.supplierAddress}
                        {(data.personPhone || data.personName) && "，"}
                    </>
                )}
                {data.personName?.trim() && (
                    <>
                        {data.personName}
                        {data.personPhone && "，"}
                    </>
                )}
                {data.personPhone?.trim()}
            </div>
            <Modal open={open} onCancel={() => setOpen(false)} onOk={() => setOpen(false)}>
                {(() => {
                    // 拆分并区分图片 / PDF
                    const allFiles = (data.foImage || '')
                        .split('|')
                        .filter(url => url.trim());

                    const imgList: string[] = [];
                    const pdfList: string[] = [];

                    allFiles.forEach(item => {
                        if (/\.pdf$/i.test(item)) {
                            pdfList.push(item);
                        } else {
                            imgList.push(item);
                        }
                    });

                    return (
                        <>
                            {/* 图片区域 */}
                            <Image.PreviewGroup>
                                {imgList.length > 0 && (
                                    <div style={{ marginBottom: 16 }}>
                                        <h4>图片附件</h4>
                                        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                                            {imgList.map((item, index) => {
                                                const imgUrl = getImgSrc(item);
                                                return (
                                                    <div
                                                        key={index}
                                                        style={{
                                                            display: 'inline-block',
                                                            position: 'relative',
                                                            margin: '5px',
                                                        }}
                                                    >
                                                        <Image
                                                            width={50}
                                                            height={50}
                                                            style={{ objectFit: 'cover' }}
                                                            src={imgUrl}
                                                        />
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </Image.PreviewGroup>
                            {/* PDF区域 */}
                            {pdfList.length > 0 && (
                                <div>
                                    <h4>PDF附件</h4>
                                    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                                        {pdfList.map((name, idx) => (
                                            <div
                                                key={idx}
                                                style={{
                                                    marginBottom:6,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '8px'
                                                }}
                                            >
                                                <FilePdfOutlined style={{ color: '#f5222d' }} />
                                                <a
                                                    href={`${window.ServerConfig.imgServer}/${name}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    {name}
                                                </a>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {allFiles.length === 0 && <div>暂无附件</div>}
                        </>
                    );
                })()}
                {data.poList.length > 0 && (
                    <div style={{ marginTop: 16 }}>
                        <Button type="primary" onClick={() => setIsOpenInfo(true)}>
                            查看采购单详情
                        </Button>
                    </div>
                )}
            </Modal>
            <Modal open={isOpenInfo} title='单号详情' onCancel={()=>setIsOpenInfo(false)} width={1200} onOk={()=>{setIsOpenInfo(false);}}>
                <CaigouTagList list={data.poList.map((item:any)=>{
                    return (
                        {
                            ...item,
                            orderCode: item.number || '',
                            id: item.poId || 0,
                        }
                    )
                })}/>
            </Modal>
        </div>
    );
};

export default ReimbursePrint;