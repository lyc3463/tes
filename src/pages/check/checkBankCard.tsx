import {connect} from "umi";
import {Button, Input, List, message, Pagination, Select, Space, Spin, Table, Tag, Tooltip} from "antd";
import {useEffect, useState} from "react";
import * as TenantBankCardService from '@/services/tenantBankCard';
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import {checkSessionStorage, updateSessionStorage} from "@/utils/OpenTool";

const CheckBankCard=(prosp)=>{
    const [spinning,setSpinning]=useState(false); // 加载状态
    const [list,setList]=useState([]);// 列表数据
    const [page,setPage]=useState(1);// 当前页数
    const [pageSize,setPageSize]=useState(50); // 每页显示条数
    const [name,setName]=useState(checkSessionStorage('/check/checkBankCard/','name')||''); // 租户姓名
    const [phone,setPhone]=useState(checkSessionStorage('/check/checkBankCard/','phone')||''); // 手机号
    const [cardNum,setCardNum]=useState(checkSessionStorage('/check/checkBankCard/','cardNum')||''); // 银行卡号
    const [status,setStatus]=useState(checkSessionStorage('/check/checkBankCard/','status')||0); // 状态
    const [userId,setUserId]=useState(0); // 用户id
    const [count,setCount]=useState(0); // 总条数
    const columns=[
        {
            title: '租户姓名',
            dataIndex: 'tenant_name',
            key: 'tenant_name',
            render: (text:any, record:any) => {
                return(
                    <div style={{width:'100px',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>
                        <Tooltip title={record.tenant_name}>
                            {record.tenant_name}
                        </Tooltip>
                    </div>
                )
            },
        },
        {
            title: '银行卡号',
            dataIndex: 'cardNum',
            key: 'cardNum',

        },
        {
            title: '预留手机号',
            dataIndex: 'bankPhone',
            key: 'bankPhone',
        },
        {
            title: '户名',
            dataIndex: 'accountName',
            key: 'accountName',
        },
        {
            title: '银行名称',
            dataIndex: 'bankName',
            key: 'bankName',
        },
        {
            title: '状态',
            dataIndex: 'bankStatus',
            key: 'bankStatus',
            render:(text:any,record:any)=>{
                return(
                    <div>
                        {record.bankStatus==1?<Tag color="red">未审核</Tag>:<Tag color="green">已审核</Tag>}
                    </div>
                )
            }
        },
        {
            title: '操作',
            dataIndex: 'custom_date',
            key: 'custom_date',
            align:'center',
            render: (text, record) => (
                <Space>
                    <Button type="primary" onClick={()=>isCheck(record.id)}>
                        审核通过
                    </Button>
                    <Button type="primary">
                        详情
                    </Button>
                    <Button type="primary" danger>
                        解绑
                    </Button>
                </Space>
            )
        },
    ];
    const getList=()=>{
        setSpinning(true);
        TenantBankCardService.fetch({page,cardNum,phone,name,userId,status,pageSize}).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                setList(res.Data);
                console.log(res);
                setSpinning(false);
            }else {
                message.error(res.Data);
                setSpinning(false);
            }
        })
    };
    const getFenye=()=>{
        setSpinning(true);
        TenantBankCardService.fenye({cardNum,phone,name,userId,status,pageSize}).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                setCount(res.Data.count);
                setSpinning(false);
            }else {
                message.error(res.Data);
                setSpinning(false);
            }
        })
    };
    useEffect(() => {
        getList();
    }, [page,pageSize]);
    useEffect(() => {
        getFenye();
    }, []);
    const isCheck=(uid:number)=>{
        TenantBankCardService.check(uid,2).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                message.success(res.Data);
                getList();
            }else {
                message.error(res.Data);
            }
        })
    };
    const onChange=(page,pageSize)=>{
        setPage(page);
        setPageSize(pageSize);
    };
    const changeName=(e:any)=>{
        setName(e.target.value);
        updateSessionStorage('/check/checkBankCard/','name',e.target.value);
    };
    const changePhone=(e:any)=>{
        setPhone(e.target.value);
        updateSessionStorage('/check/checkBankCard/','phone',e.target.value);
    };
    const changeCardNum=(e:any)=>{
        setCardNum(e.target.value);
        updateSessionStorage('/check/checkBankCard/','cardNum',e.target.value);
    };
    const changeStute=(e:any)=>{
        setStatus(e);
        updateSessionStorage('/check/checkBankCard/','status',e);
    };
    const sousuo=()=>{
        setPage(1);
        getList();
        getFenye();
    };
    const onC=()=>{
        TenantBankCardService.test({amount:'200.11',reamak:'测试'}).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                message.success(res.Data);
            } else {
                message.error(res.Data);
            }
        })
    };
    return(
        <Spin spinning={spinning}>
            <List>
                <List.Item>
                    <Space>
                        <Input
                            addonBefore="姓名:"
                            value={name}
                            onChange={changeName}
                        />
                        <Input
                            addonBefore="手机号:"
                            value={phone}
                            onChange={changePhone}
                        />
                        <Input
                            addonBefore="卡号:"
                            value={cardNum}
                            onChange={changeCardNum}
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
                                状态:
                            </div>
                            <Select
                                onChange={changeStute}
                                value={status}
                                style={{ width: 120 }}
                                options={[
                                    { value:0, label: '全部' },
                                    { value:1, label: '未审核' },
                                    { value:2, label: '已审核' },

                                ]}
                            />
                        </Space.Compact>
                        <Button type="primary" onClick={sousuo}>
                            搜索
                        </Button>
                        {/*<Button type="primary" onClick={onC}>*/}
                        {/*    测试*/}
                        {/*</Button>*/}
                    </Space>
                </List.Item>
            </List>
            <Table
                columns={columns}
                style={{border:'1px solid #ddd',borderRadius:'4px'}}
                pagination={false}
                scroll={{y:'60vh'}}
                dataSource={list}
                rowKey={(columns) => columns.id}
                size='small'
            />
            <Pagination total={count} showSizeChanger pageSize={pageSize} current={page}  onChange={onChange} pageSizeOptions={[50,100,500,1000,10000]}/>
        </Spin>
    )
}
export default connect()(CheckBankCard)