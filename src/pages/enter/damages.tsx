import {
    Button,
    DatePicker,
    Input,
    List,
    message,
    Modal,
    Pagination,
    Select,
    Space,
    Spin,
    Table,
    Tag,
    Tooltip
} from "antd";
import {history,connect} from "umi";
import dayjs from "dayjs";
import {useEffect, useState} from "react";
import * as DamagesService from "@/services/damages";
import {checkSessionStorage, updateSessionStorage} from "@/utils/OpenTool";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";

const Damages=(props)=>{
    // 当前页数
    const [page,setPage]=useState(1);
    const [pageSize,setPageSize]=useState(50);
    // 手机号
    const [phone,setPhone]=useState(checkSessionStorage('/enter/afterSales/','damagesPhone')||'');
    // 状态 0全部，1未审核，2审核通过
    const [stutes,setStutes]=useState(1);
    // 开始时间
    const [startDate,setStartDate]=useState(checkSessionStorage('/enter/afterSales/','damagesStartDate')||'2000-01-01');
    // 结束时间
    const [endDate,setEndDate]=useState(checkSessionStorage('/enter/afterSales/','damagesEndDate')||'2099-01-01');
    const [did,setDid]=useState(0);
    const [open,setOpen]=useState(false);
    const [spinning,setspinning]=useState(false);
    const [list,setList]=useState([]);
    const [count,setCount]=useState(0);
    const toadd=()=>{
        history.push('/enter/addDamages')
    };
    const columns =[
        {
            title: '单元名称',
            dataIndex: 'unitList',
            key: 'unitList',
            sorter: {
                compare: (a, b) => {
                    // 获取 a 和 b 的 unitList 中第一个 unit_name
                    const aUnitName = a.unitList[0]?.unit_name || '';
                    const bUnitName = b.unitList[0]?.unit_name || '';

                    // 比较 unit_name
                    if (aUnitName < bUnitName) return -1;
                    if (aUnitName > bUnitName) return 1;
                    return 0;
                },
                multiple: 1,
            },
            width:200,
            render: (text:any, record:any) => {
                const limitedUnitList = record.unitList.slice(0, 2);
                return(
                    <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '100%' }}>
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
            title: '日期',
            dataIndex: 'created',
            key: 'created',
            render:(_:any,record:any)=>(
                <div>
                    {dayjs(record.created).format("YYYY-MM-DD")}
                </div>
            )
        },
        {
            title: '租户名字',
            dataIndex: 'tenant_name',
            key: 'tenant_name',
            render:(text:any,record:any,)=>{
                return(
                    <div style={{width:'100px',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>
                        <Tooltip title={record.tenant_name}>
                            {record.tenant_name}
                        </Tooltip>
                    </div>
                )
            }
        },
        {
            title: '联系方式',
            dataIndex: 'tenant_phone',
            key: 'tenant_phone',
        },
        {
            title: '状态',
            dataIndex: 'renameStatus',
            key: 'renameStatus',
            render:(text:any,record:any,)=>{
                return(
                    <div>{record.renameStatus==2?<Tag color='green'>已审核</Tag>:<Tag color='red'>未审核</Tag>}</div>
                )
            }
        },
        {
            title: '操作',
            dataIndex: 'cx',
            key: 'cx',
            render:(text:any,record:any,)=>{
                return(
                    <Space>
                        {
                            record.renameStatus==2?'':<> <Button type='primary' onClick={()=>toedit(record.Id)}>编辑</Button>
                                <Button type='primary' danger onClick={()=>IsDelOpen(record.Id)}>删除</Button></>
                        }
                    </Space>
                )
            }
        }
    ];
    // 监听页数
    const onChange=(e:number,pageSize:number)=>{
        setPage(e);
        setPageSize(pageSize);
    };
    // 时间选择
    const changeDate=(_:any,data:string[])=>{
        if (data.length === 2 && data[0] === '' && data[1] === '') {
            setStartDate('2000-01-01');
            setEndDate('2099-01-01');
            updateSessionStorage('/enter/afterSales/','damagesStartDate','2000-01-01');
            updateSessionStorage('/enter/afterSales/','damagesEndDate','2099-01-01');

        } else {
            setStartDate(data[0]);
            setEndDate(data[1]);
            updateSessionStorage('/enter/afterSales/','damagesStartDate',data[0]);
            updateSessionStorage('/enter/afterSales/','damagesEndDate',data[1]);

        }
    };
    // 监听姓名
    const changePhone=(e)=>{
        setPhone(e.target.value);
        updateSessionStorage('/enter/afterSales/','damagesPhone',e.target.value);
    };
    // 监听状态
    const changeStutes=(e:number)=>{
        setStutes(e);
    };
    // 分页
    const logFenye=()=>{
        DamagesService.fetch({page,pageSize,stutes,phone,startDate,endDate}).then((res:TypeErrorCode)=>{
            console.log('res',res);
            if(res.ErrorCode==0){
                setList(res.Data.data);
            }else{
                message.error(res.Data || "查询失败");
            }
        })
    };
    useEffect(() => {
        logFenye();
    }, [page]);

    // 搜索
    const suosou=()=>{
        setPage(1);
        logFenye();
    };
    const toedit=(e:number)=>{
        history.push(`/enter/editDamages?id=${e}`);
    };
    const IsDelOpen=(e)=>{
        setDid(e);
        setOpen(true);
    };
    const onOk=()=>{
        setspinning(true);
        DamagesService.remove(did).then((res:TypeErrorCode)=>{
            if(res.ErrorCode==0){
                message.success("删除成功");
                setOpen(false);
                logFenye();
            }else{
                message.error(res.Data || "删除失败");
            }
        })
        setspinning(false);
    };
    return(
        <Spin spinning={spinning}>
            <List>
                <List.Item>
                    <Button type='primary' onClick={toadd}>申请违约金免除</Button>
                    <Space>
                        <Input
                            addonBefore="手机号:"
                            onChange={changePhone}
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
                                日期:
                            </div>
                            {startDate=='2000-01-01'&&endDate=='2099-01-01'?<DatePicker.RangePicker onChange={changeDate}/>:<DatePicker.RangePicker onChange={changeDate} defaultValue={[dayjs(startDate),dayjs(endDate)]}/>}
                        </Space.Compact>
                        <Button type="primary" onClick={suosou}>
                            搜索
                        </Button>
                    </Space>
                </List.Item>
            </List>
            <Table
                columns={columns}
                rowKey={(columns) => columns.Id}
                pagination={false}
                size='small'
                scroll={{y:'70vh'}}
                dataSource={list}
                rowClassName={(record, index) =>
                    index % 2 === 1 ? 'tbodd' : 'tbeven'
                }
            />
            <Pagination total={count} showSizeChanger pageSize={pageSize} current={page}  onChange={onChange} pageSizeOptions={[50]}/>
            <Modal onOk={onOk} onCancel={()=>setOpen(false)} loading={spinning} open={open} title='是否要删除?'>
                <div>
                    是否要删除?
                </div>
            </Modal>
        </Spin>
    )
}

export default Damages;