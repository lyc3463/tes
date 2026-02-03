import {connect} from "umi";
import {useEffect, useState} from "react";
import dayjs from "dayjs";
import {
    Button,
    DatePicker, Image,
    Input,
    InputNumber,
    List,
    message,
    Modal,
    Pagination,
    Select,
    Space,
    Spin,
    Table,
    Tag
} from "antd";
import {history} from "@@/core/history";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import {checkSessionStorage, updateSessionStorage} from "@/utils/OpenTool";

const OutboundReport=(props:any)=>{
    const [spinning,setSpinning]=useState(false);
    // 仓库名称
    const [warehouseName,setWarehouseName]=useState(checkSessionStorage('/warehouse/paymentManagement','outboundReportWarehouseName')||'');
    // 物品名称
    const [itemName,setItemName]=useState(checkSessionStorage('/warehouse/paymentManagement','outboundReportItemName')||'');
    // 开始时间
    const [startDate,setStartDate]=useState(checkSessionStorage('/warehouse/paymentManagement','outboundReportStartDate')||'2000-01-01');
    // 结束时间
    const [endDate,setEndDate]=useState(checkSessionStorage('/warehouse/paymentManagement','outboundReportEndDate')||'2099-01-01');
    const columns=[
        {
            title:'所属仓库',
            dataIndex:'warehouseName',
            key:'warehouseName',
            align:'center',
            ellipsis: true,
        },
        {
            title:'物品图片',
            dataIndex:'productsImageBase64',
            key:'productsImageBase64',
            align:'center',
            render:(text)=>{
                return <Image src={text} alt="" style={{width:'50px',height:'50px'}}/>
            }
        },
        {
            title:'物品编码',
            dataIndex:'productsCode',
            key:'productsCode',
            align:'center',
            ellipsis: true,
        },
        {
            title:'物品名称',
            dataIndex:'productsName',
            key:'productsName',
            align:'center',
            ellipsis: true,
        },
        {
            title:'数量',
            dataIndex:'quantitySum',
            key:'quantitySum',
            align:'center',
            ellipsis: true,
        },
        {
            title:'单位',
            dataIndex:'unitsName',
            key:'unitsName',
            align:'center',
            ellipsis: true,
        },
        {
            title:'价钱',
            dataIndex:'priceSum',
            key:'priceSum',
            align:'center',
            ellipsis: true,
        },
    ];
    // 列表信息
    const getList=()=>{
        props.dispatch({
            type:'OutboundReport/fetch',
            payload:{ warehouseName, itemName, startDate, endDate}
        })
    };
    useEffect(() => {
        getList();
    }, []);
    // 监听日期
    const changeDate=(_:any,data:string[])=>{
        if (data.length === 2 && data[0] === '' && data[1] === '') {
            setStartDate('2000-01-01');
            setEndDate('2099-01-01');
            updateSessionStorage('/warehouse/paymentManagement','outboundReportStartDate','2000-01-01');
            updateSessionStorage('/warehouse/paymentManagement','outboundReportEndDate','2099-01-01');
        } else {
            setStartDate(data[0]);
            setEndDate(data[1]);
            updateSessionStorage('/warehouse/paymentManagement','outboundReportStartDate',data[0]);
            updateSessionStorage('/warehouse/paymentManagement','outboundReportEndDate',data[1]);
        }
    };
    const changeWarehouseName=(e)=>{
        setWarehouseName(e.target.value);
        updateSessionStorage('/warehouse/paymentManagement','outboundReportWarehouseName',e.target.value);
    };
    const changeItemName=(e)=>{
        setItemName(e.target.value);
        updateSessionStorage('/warehouse/paymentManagement','outboundReportItemName',e.target.value);
    };
    return(
        <Spin spinning={spinning}>
            <List>
                <List.Item>
                    <Space>
                        <Input
                            addonBefore="仓库名称:"
                            value={warehouseName}
                            onChange={changeWarehouseName}
                        />
                        <Input
                            addonBefore="物品名称:"
                            value={itemName}
                            onChange={changeItemName}
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
                                日期:
                            </div>
                            {startDate=='2000-01-01'&&endDate=='2099-01-01'?<DatePicker.RangePicker onChange={changeDate}/>:<DatePicker.RangePicker onChange={changeDate} defaultValue={[dayjs(startDate),dayjs(endDate)]}/>}
                        </Space.Compact>
                        <Button type="primary" onClick={()=>getList()}>
                            搜索
                        </Button>
                    </Space>
                </List.Item>
            </List>
            <Table
                columns={columns}
                style={{border:'1px solid #ddd',borderRadius:'4px'}}
                pagination={false}
                scroll={{y:'60vh'}}
                dataSource={props.list}
                rowKey={(record:any, index:number) => index}  // 仅在无其他唯一标识时使用索引
                size='small'
            />
        </Spin>
    )
}
const mapStateToProps = (state: any) => ({
    list: state.OutboundReport.list,
});
export default connect(mapStateToProps)(OutboundReport);
