import {connect} from "umi";
import {
    Button,
    DatePicker,
    Image,
    Input,
    List,
    message,
    Modal,
    Pagination,
    Select,
    Space,
    Spin,
    Table,
    Tabs,
    Tag
} from "antd";
import dayjs from "dayjs";
import {useEffect, useRef, useState} from "react";
import {
    calculateSums,
    checkSessionStorage, downloadFile,
    exportDataToExcel,
    fuzzySearch,
    updateSessionStorage
} from "@/utils/OpenTool";
import * as RechargeRateService from '@/services/alljiaoyi';
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import {StaticInfo} from "@/StaticInfo";
import AllFinancialDataPrint from "@/components/AllFinancialDataPrint";
import {useReactToPrint} from "react-to-print";
import MyReceipt from "@/components/MyReceipt";

const OldJiaoyi=(props)=>{
    // 当前页数
    const [page,setPage]=useState(1);
    const [pageSize,setPageSize]=useState(50);
    const [name,setName]=useState(checkSessionStorage('/qianbao/zonglan/alljiaoyi/','oldName')||'');
    const [phone,setPhone]=useState(checkSessionStorage('/qianbao/zonglan/alljiaoyi/','oldPhone')||'');
    const [type,setType]=useState(checkSessionStorage('/qianbao/zonglan/alljiaoyi/','oldType')||0);
    const [startDate,setStartDate]=useState(checkSessionStorage('/qianbao/zonglan/alljiaoyi/','oldStartDate')||'2000-01-01');
    const [endDate,setEndDate]=useState(checkSessionStorage('/qianbao/zonglan/alljiaoyi/','oldEndDate')||'2099-01-01');
    const [userID,setuserID]=useState(0);
    const [spinning,setspinning]=useState(false);
    const [dataSource,setdataSource]=useState([]);
    // 单元名称
    const [unitName,setunitName]=useState('');
    const [moneySum,setmoneySum]=useState(0);
    const [uqx,setUqx]=useState([]);
    const [printModalOpen,setPrintModalOpen]=useState(false);
    const [printList,setPrintList]=useState([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const printRef = useRef();
    const isPrintModalOpen=()=>{
        if(selectedRowKeys.length===0){
            message.error('请选择要打印的报销数据');
            return;
        }
        const selectedIds = selectedRowKeys.map(key => Number(key));
        // 筛选出选中的财务数据，并处理fdList不足7条的情况
        const printList = dataSource
            .filter(item => selectedIds.includes(item.id))
            .map(item => {
                const fdList = item.fdList || []; // 获取当前项目的fdList，默认空数组
                const currentLength = fdList.length;

                // 如果已达到或超过7条，直接返回原数据
                if (currentLength >= 7) {
                    return item;
                }

                // 计算需要补充的空记录数量
                const neededCount = 7 - currentLength;
                // 获取当前fdList中的最大ID，用于生成新记录ID
                const maxId = currentLength > 0
                    ? Math.max(...fdList.map(item => item.id))
                    : 0;

                // 生成补充的空记录
                const newArr = Array.from({ length: neededCount }, (_, i) => ({
                    id: maxId + i + 1,       // 自增ID
                    phone: '',         // 手机号
                    consumptionType:0,             // 空摘要
                    consumptionMoney: 0                // 金额0
                }));

                // 返回包含补充记录的新对象（不修改原数据）
                return {
                    ...item,
                    fdList: [...fdList, ...newArr]
                };
            });
        setPrintList(printList);
        setPrintModalOpen(true);
    };
    // 搜索
    const sousuo=()=>{
        setPage(1);
        logFenye(1,pageSize);
        getFenye(pageSize);
    };
    const getFenye=(pageSizez)=>{
        props.dispatch({
            type:'OldAlljiaoyi/fenye',
            payload:{name,phone,type,startDate,endDate,userID,pageSize:pageSizez}
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                setmoneySum(res.Data.moneySum);
            }else {
                message.error(res.Data);
            }
        });
    };
    // 分页
    const logFenye=(pagez,pageSizez)=>{
        props.dispatch({
            type:"OldAlljiaoyi/fetch",
            payload:{page:pagez,name,phone,type,startDate,endDate,userID,pageSize:pageSizez}
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                console.log('res',res)
                setdataSource(res.Data);
            }else {
                message.error(res.Data);
            }
        })
    };
    // 监听页数
    const onChange=(e:number,pageSize:number)=>{
        setPage(e);
        setPageSize(pageSize);
    };
    useEffect(() => {
        let uq=StaticInfo.uqx.split('');
        setUqx(uq);
    }, []);
    const columns =[
        {
            title: '日期',
            dataIndex: 'consumptionDate',
            key: 'consumptionDate',
            render:(text:any,record:any)=>{
                return(
                    <div>
                        {dayjs(record.consumptionDate).format('YYYY-MM-DD HH:mm:ss')}
                    </div>
                )
            }
        },
        {
            title: '房屋',
            dataIndex: 'house_name',
            key: 'house_name',
        },
        {
            title: '单元名称',
            dataIndex: 'unitList',
            key: 'unitList',
            width:200,
            render: (text:any, record:any) => {
                const limitedUnitList = record.unitList.slice(0, 2);
                return(
                    <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '100px' }}>
                        {limitedUnitList.map((item, index) => (
                            <span key={index}>{item.unit_name}{index < limitedUnitList.length - 1 ? ',' : ''}</span>
                        ))}
                        {/* 如果 unitList 数组长度大于 2，则显示省略号或其他提示 */}
                        {record.unitList.length > 2 && <span>...</span>}
                    </div>
                )
            }
        },
        {
            title: '姓名',
            dataIndex: 'tenant_name',
            key: 'tenant_name',
        },
        {
            title: '手机号',
            dataIndex: 'tenant_phone',
            key: 'tenant_phone',
        },
        {
            title: '类型',
            dataIndex: 'consumptionType',
            key: 'consumptionType',
            render:(_:any,item:any)=>{
                let consumptionTypeText;
                switch (item.consumptionType) {
                    case 1:
                        consumptionTypeText = <Tag style={{ color: '#4CAF50' }}>微信充值</Tag>;
                        break;
                    case 2:
                        consumptionTypeText = <Tag style={{ color: '#F44336' }}>租金</Tag>;
                        break;
                    case 3:
                        consumptionTypeText = <Tag style={{ color: '#2196F3' }}>电费</Tag>;
                        break;
                    case 4:
                        consumptionTypeText = <Tag style={{ color: '#FFC107' }}>水费</Tag>;
                        break;
                    case 5:
                        consumptionTypeText = <Tag style={{ color: '#9C27B0' }}>公共缴费</Tag>;
                        break;
                    case 6:
                        consumptionTypeText = <Tag style={{ color: '#E91E63' }}>手动充值</Tag>;
                        break;
                    case 7:
                        consumptionTypeText = <Tag style={{ color: '#795548' }}>损耗</Tag>;
                        break;
                    case 8:
                        consumptionTypeText = <Tag style={{ color: '#795548' }}>违约金</Tag>;
                        break;
                    case 9:
                        consumptionTypeText = <Tag style={{ color: '#795548' }}>月卡</Tag>;
                        break;
                    case 10:
                        consumptionTypeText = <Tag style={{ color: '#795548' }}>大额转账</Tag>;
                        break;
                    default:
                        consumptionTypeText = <Tag style={{ color: '#777777' }}>未知类型</Tag>;
                }
                return (
                    consumptionTypeText
                );
            }
        },
        {
            title: '金额(元)',
            dataIndex: 'consumptionMoney',
            key: 'consumptionMoney',
            render: (text:any, record:any) => {
                return(
                    <div>
                        {record.consumptionMoney.toFixed(2)}
                    </div>
                )
            }
        },
    ];
    // 监听日期
    const changeDate=(_:any,data:string[])=>{
        if (data.length === 2 && data[0] === '' && data[1] === '') {
            setStartDate('2000-01-01');
            setEndDate('2099-01-01');
            updateSessionStorage('/qianbao/zonglan/alljiaoyi/','oldStartDate','2000-01-01');
            updateSessionStorage('/qianbao/zonglan/alljiaoyi/','oldEndDate','2099-01-01');
        } else {
            setStartDate(data[0]);
            setEndDate(data[1]);
            updateSessionStorage('/qianbao/zonglan/alljiaoyi/','oldStartDate',data[0]);
            updateSessionStorage('/qianbao/zonglan/alljiaoyi/','oldEndDate',data[1]);
        }
    };
    const chaxundanyuan=()=>{
        let a=fuzzySearch(props.RechargeRateList,unitName);
        setdataSource(a);
        let b=calculateSums(a);
        setmoneySum(b.moneySum);
    };
    // 监听输入的姓名
    const changeName=(e)=>{
        setName(e.target.value);
        updateSessionStorage('/qianbao/zonglan/alljiaoyi/','oldName',e.target.value);
    };
    // 监听手机号
    const changePhone=(e)=>{
        setPhone(e.target.value);
        updateSessionStorage('/qianbao/zonglan/alljiaoyi/','oldPhone',e.target.value);
    };
    // 监听类型
    const changeType=(e)=>{
        setType(e);
        updateSessionStorage('/qianbao/zonglan/alljiaoyi/','oldType',e);
    };
    const upDload=()=>{
        RechargeRateService.upDload({page:1,name,phone,type,startDate,endDate,userID,pageSize:10000}).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                downloadFile(res.Data.ContentType,res.Data.FileContents,res.Data.FileDownloadName);
            }else {
                message.error(res.Data);
            }
        })
    };
    const handlePrint = useReactToPrint({
        contentRef: printRef,  // 使用 content 而不是 contentRef
        pageStyle: `
        @page {
            size: A4;
            margin: 2mm 20mm;
        }
        @media print {
            /* 分页样式 */
            .page-break {
                page-break-after: always;
            }
            /* 防止内容被分页截断 */
            .no-break {
                page-break-inside: avoid;
            }
            /* 隐藏 Modal 相关元素 */
            .ant-modal-wrap,
            .ant-modal-mask {
                display: none !important;
            }
            .ant-modal {
                position: static !important;
                width: 100% !important;
                margin: 0 !important;
            }
            .ant-modal-content {
                box-shadow: none !important;
                background: transparent !important;
            }
            .ant-modal-header,
            .ant-modal-footer {
                display: none !important;
            }
            .ant-modal-body {
                padding: 0 !important;
            }
            body *:not(.print-only-content):not(.print-only-content *) {
                        visibility: hidden;
                      }
        }
    `,
    });
    const rowSelection = {
        selectedRowKeys,
        onChange: (selectedKeys: React.Key[], selectedRows: any[]) => {
            setSelectedRowKeys(selectedKeys);
        },
        type: 'checkbox',  // 复选框类型
    };
    return(
        <Spin spinning={spinning}>
            <List>
                <List.Item>
                    <Space>
                        <Input
                            // onChange={(e)=>setName(e.target.value)}
                            onChange={changeName}
                            addonBefore="姓名:"
                            value={name}
                        />
                        <Input
                            // onChange={(e)=>setPhone(e.target.value)}
                            onChange={changePhone}
                            addonBefore="手机号:"
                            value={phone}
                        />
                        <Space.Compact>
                            <div
                                style={{
                                    borderRadius: '6px',
                                    borderStartEndRadius: 0,
                                    borderEndEndRadius: 0,
                                    padding: '0 11px',
                                    border: '1px solid #d9d9d9',
                                    display: 'flex',
                                    alignItems: 'center',
                                    borderInlineEnd: 0,
                                }}
                            >
                                类型:
                            </div>
                            <Select
                                onChange={changeType}
                                defaultValue={type}
                                style={{ width: 120 }}
                                options={[
                                    { value:0, label: '全部' },
                                    { value:1, label: '微信充值' },
                                    // { value:2, label: '租金' },
                                    // { value:3, label: '电费' },
                                    // { value:4, label: '水费' },
                                    // { value:5, label: '公共缴费' },
                                    // { value:6, label: '手动充值' },
                                    // { value:7, label: '服务费' },
                                    // { value:8, label: '违约金' },
                                    // { value:9, label: '月保' },
                                    { value:10, label: '大额转账' },
                                ]}
                            />
                        </Space.Compact>
                        <Space.Compact>
                            <div
                                style={{
                                    borderRadius: '6px',
                                    borderStartEndRadius: 0,
                                    borderEndEndRadius: 0,
                                    padding: '0 11px',
                                    border: '1px solid #d9d9d9',
                                    display: 'flex',
                                    alignItems: 'center',
                                    borderInlineEnd: 0,
                                }}
                            >
                                日期:
                            </div>
                            {startDate=='2000-01-01'&&endDate=='2099-01-01'?<DatePicker.RangePicker onChange={changeDate}/>:<DatePicker.RangePicker onChange={changeDate} defaultValue={[dayjs(startDate),dayjs(endDate)]}/>}
                        </Space.Compact>
                        <Button type="primary" onClick={sousuo}>
                            搜索
                        </Button>
                        <Button type="primary" onClick={isPrintModalOpen}>打印</Button>
                        <Button type="primary" onClick={upDload}>
                            下载
                        </Button>
                    </Space>
                </List.Item>
                <List.Item>
                    <Space>
                        <Input
                            addonBefore="单元名称:"
                            onChange={(e)=>setunitName(e.target.value)}
                        />
                        <Button type="primary" onClick={chaxundanyuan}>
                            查询单元
                        </Button>
                    </Space>
                </List.Item>
            </List>
            <Table
                columns={columns}
                style={{border:'1px solid #ddd',borderRadius:'4px'}}
                pagination={false}
                dataSource={dataSource}
                scroll={{y:'60vh'}}
                rowKey={(columns) => columns.id}
                size='small'
                summary={(columns) => (
                    <Table.Summary fixed>
                        <Table.Summary.Row>
                            <Table.Summary.Cell
                                index={1}
                            >

                            </Table.Summary.Cell>
                            <Table.Summary.Cell index={2}>
                                统计
                            </Table.Summary.Cell>
                            <Table.Summary.Cell index={0}>
                            </Table.Summary.Cell>
                            <Table.Summary.Cell index={0}>
                            </Table.Summary.Cell>
                            <Table.Summary.Cell index={0}>
                            </Table.Summary.Cell>
                            <Table.Summary.Cell index={0}>
                            </Table.Summary.Cell>
                            <Table.Summary.Cell
                                index={7}
                            >
                                {(moneySum).toFixed(2)}元
                            </Table.Summary.Cell>
                        </Table.Summary.Row>
                    </Table.Summary>
                )}
                rowSelection={rowSelection}
            />
            {props.count?<Pagination total={props.count.count} showSizeChanger pageSize={pageSize} current={page}  onChange={onChange} pageSizeOptions={[50,100,500,1000,10000]}/>:''}
            <Modal
                width={1000}
                open={printModalOpen}
                onCancel={()=>setPrintModalOpen(false)}
                footer={[
                    <Button key="print" type="primary" onClick={handlePrint}>打印</Button>,
                    <Button key="cancel" type="primary" onClick={()=>setPrintModalOpen(false)}>关闭</Button>
                ]}
            >
                <div className="print-only-content">
                    {/* 确保传递printList给打印组件 */}
                    <MyReceipt
                        ref={printRef}
                        printList={printList}
                        className="print-only-content"
                    />
                </div>
            </Modal>
        </Spin>
    )
};
const mapStateToProps = (state: any) => {
    return {
        RechargeRateList: state.OldAlljiaoyi.list,
        count: state.OldAlljiaoyi.count,
    }
};
export default connect(mapStateToProps) (OldJiaoyi)