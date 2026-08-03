import {Button, Input, InputNumber, List, message, Modal, Pagination, Space, Spin, Table, Tag} from "antd";
import {connect,history} from "umi";
import {useEffect, useState} from "react";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import * as HouseBillService from '@/services/houseBill';
import {checkSessionStorage, filterItemsWithUnitList, fuzzySearch, updateSessionStorage} from "@/utils/OpenTool";
import dayjs from "dayjs";
import TenantBill from "@/pages/houseManage/tennerBill";

const HouseBill=(props:any)=>{
    const [name,setName]=useState(checkSessionStorage('/houseManage/houseBill/','name')||'');
    const [phone,setPhone]=useState(checkSessionStorage('/houseManage/houseBill/','phone')||'');
    const [page,setPage]=useState(1);
    const [count,setcount]=useState(1);
    const [pagecount,setpagecount]=useState(10000);
    const [zuhuList,setZuhuList]=useState([]);
    const [unitName,setunitName]=useState('');
    const [oldList,setOldList]=useState([]);
    const [tenantBillList,setTenantBillList]=useState([]);
    const [openTenantBillModal,setOpenTenantBillModal]=useState(false);
    const [expandContractId, setExpandContractId] = useState<number | null>(null);

    useEffect(() => {
        logFenye();
    }, [page,pagecount]);
    // 分页
    const logFenye = () => {
        props.dispatch({
            type: "BYZhuhu/fetch",
            payload: { page, name, phone, pagecount }
        }).then((res: TypeErrorCode) => {
            if (res.ErrorCode === 0) {
                // let resultList = res.Data.data;
                // if (name === '' && phone === '') {
                //     resultList = filterItemsWithUnitList(res.Data.data);
                // }
                setZuhuList(res.Data.data);
                setOldList(res.Data.data);
            } else {
                message.error(res.Data);
            }
        });
    };
    // 搜索按钮
    const shousuo=()=>{
        setPage(1);
        logFenye();
    };
    const onChange=(val:number,pageSize:number)=>{
        setPage(val);
        setpagecount(pageSize);
    };
    const getbillList=(tenantId)=>{
        HouseBillService.fetch(tenantId).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                const data = res.Data;
                if (!Array.isArray(data) || data.length === 0) {
                    message.warning("该租户暂无账单数据！");
                    return;
                }
                setTenantBillList(res.Data);
                setOpenTenantBillModal(true);
            }else {
                message.warning(res.Data);
            }
        })
    };
    const columns =[
        {
            title: '租户姓名',
            dataIndex: 'tenant_name',
            key: 'tenant_name',
            width:300,
            render: (text:any, record:any) => {
                return(
                    <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '100%' }}>
                        {record.tenant_name}
                    </div>
                )
            }
        },
        {
            title: '联系方式',
            dataIndex: 'tenant_phone',
            key: 'tenant_phone',
            width:300,
        },
        {
            title: '操作',
            dataIndex: 'caoz',
            key: 'caoz',
            render: (text:any, record:any) => {
                return(
                    <Space>
                        <Button type='primary' onClick={()=>toinfo(record.id)}>详情</Button>
                    </Space>
                )
            }
        }
    ];
    const toinfo=(e)=>{
        getbillList(e);
    };
    const changeName=(e)=>{
        setName(e.target.value);
        updateSessionStorage('/houseManage/houseBill/','name',e.target.value);
    };
    const changePhone=(e)=>{
        setPhone(e.target.value);
        updateSessionStorage('/houseManage/houseBill/','phone',e.target.value);
    };
    const chaxundanyuan=()=>{
        let a=fuzzySearch(oldList,unitName);
        setZuhuList(a);
    };
    return(
        <div>
            <List>
                <List.Item>
                    <Space>
                        <Input
                            addonBefore="姓名:"
                            onChange={changeName}
                            value={name}
                        />
                        <Input
                            addonBefore="手机号:"
                            onChange={changePhone}
                            value={phone}
                        />
                        <Button type="primary" onClick={shousuo}>
                            搜索
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
                style={{border:'1px solid #ddd',borderRadius:'4px'}}
                columns={columns}
                size='small'
                rowKey={(columns) => columns.id}
                dataSource={zuhuList}
                scroll={{y:'60vh'}}
                pagination={false}
            />
           <Pagination total={count} pageSize={pagecount} current={page}  onChange={onChange}  showSizeChanger/>
            {/*点击详情弹窗*/}
            <Modal
                open={openTenantBillModal}
                footer={null}
                onCancel={() => {
                    setOpenTenantBillModal(false);
                    setExpandContractId(null); // 关闭弹窗时收起
                }}
                width={900}
            >
                <List
                    dataSource={tenantBillList}
                    renderItem={(item: any, index) => {
                        // 判断当前项是否展开
                        const isExpanded = expandContractId === item.contractId;

                        return (
                            <div
                                style={{
                                    border: '1px solid #e8e8e8',
                                    borderRadius: 8,
                                    marginBottom: 12,
                                    overflow: 'hidden',
                                }}
                            >
                                {/* ========== 可点击的标题行（高亮+可点击样式） ========== */}
                                <List.Item
                                    onClick={() => {
                                        // 点击切换展开/收起
                                        setExpandContractId(isExpanded ? null : item.contractId);
                                    }}
                                    style={{
                                        backgroundColor: '#f7f8fa',
                                        cursor: 'pointer',
                                        padding: '12px 16px',
                                    }}
                                >
                                    <Space size="large" wrap>
                                        {/* 合同编号：高亮样式 */}
                                        <span style={{ fontWeight: 600, color: '#222', fontSize: 14 }}>
                                            合同编号：{item.identifier}
                                        </span>
                                        <span style={{ color: '#666' }}>
                                            {dayjs(item.beginTime).format('YYYY-MM-DD')} 至 {dayjs(item.endTime).format('YYYY-MM-DD')}
                                        </span>
                                        <span style={{ color: '#1890ff', fontSize: 12 }}>
                                            {isExpanded ? '▼ 点击收起' : '▶ 点击查看账单'}
                                        </span>
                                    </Space>
                                </List.Item>
                                {/* ========== 展开时才显示账单组件 ========== */}
                                {isExpanded && (
                                    <div style={{ padding: 16, backgroundColor: '#fff' }}>
                                        <TenantBill contractInfo={item} />
                                    </div>
                                )}
                            </div>
                        );
                    }}
                />
            </Modal>
        </div>
    )
};
const mapStateToProps = (state: any) => {
    return {
        ZuhuList: state.BYZhuhu.list,
    }
};
export default connect(mapStateToProps) (HouseBill)