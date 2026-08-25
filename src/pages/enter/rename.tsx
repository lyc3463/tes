import {Button, DatePicker, Descriptions, Input, List, message, Modal, Pagination, Popover, Select, Space, Spin, Table, type TableProps, Tag, Tooltip} from "antd";
import {history,connect} from "umi";
import {useEffect, useState} from "react";
import dayjs from "dayjs";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import {checkSessionStorage, updateSessionStorage} from "@/utils/OpenTool";
import RenameType from '@/ModelTypes/TypeRename';

interface RenameProps {
    dispatch: (action: { type: string; payload?: any }) => any;
    RenameList?: RenameType[];
    count?: { count: number };
}

const Rename=(props: RenameProps)=>{
    // 当前页数
    const [page,setPage]=useState(1);
    const [pageSize,setPageSize]=useState(50);
    const [uid,setUid]=useState(0);
    // 手机号
    const [phone,setPhone]=useState(checkSessionStorage('/enter/afterSales/','renamePhone')||'');
    // 状态 0全部，1未审核，2审核通过,3驳回
    const [stutes,setStutes]=useState(checkSessionStorage('/enter/afterSales/','renameStatus')||0);
    // 开始时间
    const [startDate,setStartDate]=useState(checkSessionStorage('/enter/afterSales/','renameStartDate')||'2000-01-01');
    // 结束时间
    const [endDate,setEndDate]=useState(checkSessionStorage('/enter/afterSales/','renameEndDate')||'2099-01-01');
    // 删除弹窗
    const [open,setOpen]=useState(false);
    const [spinning,setspinning]=useState(false);
    const [tenant_name,setTenant_name]=useState('');
    // 删除弹窗展示的记录信息
    const [deleteRecord,setDeleteRecord]=useState<RenameType>({} as RenameType);

    const columns: TableProps<RenameType>['columns'] =[
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
            render: (text:any, record:RenameType) => {
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
            title: '申请日期',
            dataIndex: 'created',
            key: 'created',
            render:(_:any,record:RenameType)=>(
                <div>
                    {dayjs(record.created).format("YYYY-MM-DD")}
                </div>
            )
        },
        {
            title: '合同编号',
            dataIndex: 'identifier',
            key: 'identifier',
            render:(text:any,record:RenameType)=>{
                return(
                    <div style={{width:'100px',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>
                        <Tooltip title={record.identifier}>
                            {record.identifier}
                        </Tooltip>
                    </div>
                )
            }
        },
        {
            title: '原名字',
            dataIndex: 'tenant_name',
            key: 'tenant_name',
            render:(text:any,record:RenameType,)=>{
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
            title: '更改后的名字',
            dataIndex: 'rename',
            key: 'rename',
            render:(text:any,record:RenameType,)=>{
                return(
                    <div style={{width:'100px',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>
                        <Tooltip title={record.rename}>
                            {record.rename}
                        </Tooltip>
                    </div>
                )
            }
        },
        {
            title: '原手机号',
            dataIndex: 'tenant_phone',
            key: 'tenant_phone',
        },
        {
            title: '更改后的手机号',
            dataIndex: 'rephone',
            key: 'rephone',
        },
        {
            title: '原身份证',
            dataIndex: 'customCard',
            key: 'customCard',
        },
        {
            title: '更改后的身份证',
            dataIndex: 'reCard',
            key: 'reCard',
        },
        {
            title: '状态',
            dataIndex: 'renameStatus',
            key: 'renameStatus',
            render: (text: any, record: RenameType) => {
                const status = record.renameStatus;
                let tagDom;

                if (status === 2) {
                    tagDom = <Tag color="green">已审核</Tag>;
                } else if (status === 3) {
                    // 驳回，增加气泡展示备注
                    tagDom = (
                        <Popover content={record.remark || '无驳回原因'} title="驳回理由">
                            <Tag color="red">驳回？</Tag>
                        </Popover>
                    );
                } else {
                    tagDom = <Tag color="orange">未审核</Tag>;
                }

                return tagDom;
            }
        },
        {
            title: '操作',
            dataIndex: 'renameStatus',
            key: 'renameStatus',
            render:(text:any,record:RenameType,)=>{
                return(
                    <Space>{record.renameStatus==2?
                            ''
                        :<>
                            <Button type='primary' onClick={()=>toedit(record)}>编辑</Button>
                            <Button type='primary' danger onClick={()=>isDelete(record)}>删除</Button>
                        </>}
                    </Space>
                )
            }
        },
    ];
    const toadd=()=>{
      history.push('/enter/addRename');
    };
    // 监听页数
    const onChange=(page:number,pageSize:number)=>{
        setPage(page);
        setPageSize(pageSize);
    };
    const toedit=(e:RenameType)=>{
        history.push(`/enter/editRename?id=${e.id}&renameStatus=${1}`);
    };
    const isDelete=(e:RenameType)=>{
        setUid(e.id);
        setOpen(true);
        setTenant_name(e.tenant_name);
        setDeleteRecord(e);
    };
    // 时间选择
    const changeDate=(_:any,data:string[])=>{
        if (data.length === 2 && data[0] === '' && data[1] === '') {
            setStartDate('2000-01-01');
            setEndDate('2099-01-01');
            updateSessionStorage('/enter/afterSales/','renameStartDate','2000-01-01');
            updateSessionStorage('/enter/afterSales/','renameEndDate','2099-01-01');
        } else {
            setStartDate(data[0]);
            setEndDate(data[1]);
            updateSessionStorage('/enter/afterSales/','renameStartDate',data[0]);
            updateSessionStorage('/enter/afterSales/','renameEndDate',data[1]);
        }
    };
    // 监听姓名
    const changePhone=(e: React.ChangeEvent<HTMLInputElement>)=>{
        setPhone(e.target.value);
        updateSessionStorage('/enter/afterSales/','renamePhone',e.target.value);
    };
    // 监听状态
    const changeStutes=(e:number)=>{
      setStutes(e);
      updateSessionStorage('/enter/afterSales/','renameStatus',e);
    };
    // 分页
    const logFenye=()=>{
        props.dispatch({
            type:"Rename/fetch",
            payload:{page,phone,stutes,startDate,endDate,pageSize}
        })
    };
    useEffect(() => {
        logFenye();
    }, [page,pageSize]);
    // 搜索
    const suosou=()=>{
        setPage(1);
        logFenye();
    };
    const onOk=()=>{
        setspinning(true);
        props.dispatch({
            type:"Rename/remove",
            payload:uid
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                message.success('删除成功');
                setOpen(false);
                setspinning(false);
                logFenye();
            }else {
                message.error(res.Data);
                setOpen(false);
                setspinning(false);
            }
        })
    };
    return(
        <Spin spinning={spinning}>
            <List>
                <List.Item>
                    <Button type='primary' onClick={toadd}>录入更名</Button>
                    <Space>
                        <Input
                            addonBefore="原手机号:"
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
                                onChange={changeStutes}
                                value={stutes}
                                style={{ width: 120 }}
                                options={[
                                    { value:0, label: '全部' },
                                    { value:1, label: '未审核' },
                                    { value:2, label: '已审核' },
                                    { value:3, label: '驳回' },
                                ]}
                            />
                        </Space.Compact>
                        <Button type="primary" onClick={suosou}>
                            搜索
                        </Button>
                    </Space>
                </List.Item>
            </List>
            <Table
                columns={columns}
                rowKey={(columns) => columns.id}
                pagination={false}
                size='small'
                rowClassName={(record, index) =>
                    index % 2 === 1 ? 'tbodd' : 'tbeven'
                }
                dataSource={props.RenameList}
            />
            {props.count?<Pagination total={props.count.count} showSizeChanger pageSize={pageSize} current={page}  onChange={onChange} pageSizeOptions={[50]}/>:''}
            {/*删除*/}
            <Modal open={open} title='是否要删除?' onCancel={()=>setOpen(false)} onOk={onOk} loading={spinning} width={1000}>
                <Descriptions
                    column={2}
                    size="small"
                    bordered
                    labelStyle={{ width: 110, backgroundColor: '#fafafa' }}
                >
                    <Descriptions.Item label="申请日期">{deleteRecord.created?dayjs(deleteRecord.created).format('YYYY-MM-DD'):''}</Descriptions.Item>
                    <Descriptions.Item label="合同编号">{deleteRecord.identifier}</Descriptions.Item>
                    <Descriptions.Item label="原名字">{deleteRecord.tenant_name}</Descriptions.Item>
                    <Descriptions.Item label="更改后的名字">{deleteRecord.rename}</Descriptions.Item>
                    <Descriptions.Item label="原手机号">{deleteRecord.tenant_phone}</Descriptions.Item>
                    <Descriptions.Item label="更改后的手机号">{deleteRecord.rephone}</Descriptions.Item>
                    <Descriptions.Item label="原身份证">{deleteRecord.customCard}</Descriptions.Item>
                    <Descriptions.Item label="更改后的身份证">{deleteRecord.reCard}</Descriptions.Item>
                </Descriptions>
            </Modal>
        </Spin>
    )
}
const mapStateToProps = (state: any) => {
    return {
        RenameList: state.Rename.list,
        count: state.Rename.count
    }
};
export default connect(mapStateToProps) (Rename)