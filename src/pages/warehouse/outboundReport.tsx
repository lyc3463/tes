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
            title: '物品图片',
            dataIndex: 'productsImage',
            ellipsis: true,
            render: (text: string, record: any) => {
                // 核心修复：先将text转为字符串，再做空值+后缀判断
                // 步骤1：处理非字符串类型（如null/undefined/数字），转为空字符串
                const textStr = String(text || '');

                // 步骤2：判断是否以.png结尾（仅当字符串非空时判断）
                const imageUrl = textStr && textStr.endsWith('.png')
                    ? `${window.ServerConfig.imgServer}${textStr}`
                    : `${window.ServerConfig.imgServer}${textStr}_X.png`;
                // 步骤3：仅当字符串非空时渲染图片，否则返回空
                return textStr ? (
                    <Image
                        src={imageUrl}
                        style={{width:'50px',height:'50px'}}
                        fallback="https://placeholder.pics/svg/50x50/EEEEEE/999999/暂无图片"
                    />
                ) : (
                    ''
                );
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
