import {Button, DatePicker, Input, List, message, Modal, Pagination, Select, Space, Spin, Table, Tag} from "antd";
import {history,connect} from "umi";
import {useEffect, useState} from "react";
import dayjs from "dayjs";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";

const Rename=(props)=>{
    // 当前页数
    const [page,setPage]=useState(1);
    const [pageSize,setPageSize]=useState(50);
    const [uid,setUid]=useState(0);
    // 手机号
    const [phone,setPhone]=useState(sessionStorage.getItem('enterRenamePhone')||'');
    // 状态 0全部，1未审核，2审核通过
    const [stutes,setStutes]=useState(1);
    // 开始时间
    const [startDate,setStartDate]=useState('2000-01-01');
    // 结束时间
    const [endDate,setEndDate]=useState('2099-01-01');
    const [open,setOpen]=useState(false);
    const [spinning,setspinning]=useState(false);
    const columns =[
        {
            title: '申请日期',
            dataIndex: 'created',
            key: 'created',
            render:(_:any,record:any)=>(
                <div>
                    {dayjs(record.created).format("YYYY-MM-DD")}
                </div>
            )
        },
        {
            title: '合同编号',
            dataIndex: 'identifier',
            key: 'identifier',
        },
        {
            title: '原名字',
            dataIndex: 'tenant_name',
            key: 'tenant_name',
        },
        {
            title: '更改后的名字',
            dataIndex: 'rename',
            key: 'rename',
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
            render:(text:any,record:any,)=>{
                return(
                    <div>{record.renameStatus==2?<Tag color='green'>已审核</Tag>:<Tag color='red'>未审核</Tag>}</div>
                )
            }
        },
        {
            title: '操作',
            dataIndex: 'renameStatus',
            key: 'renameStatus',
            render:(text:any,record:any,)=>{
                return(
                    <Space>{record.renameStatus==2?
                            ''
                        :<>
                            <Button type='primary' onClick={()=>toedit(record.id)}>编辑</Button>
                            <Button type='primary' danger onClick={()=>isDelete(record.id)}>删除</Button>
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
    const onChange=(page,pageSize)=>{
        setPage(page);
        setPageSize(pageSize);
    };
    const toedit=(e)=>{
        history.push(`/enter/editRename?id=${e}`);
    };
    const isDelete=(e)=>{
        setUid(e);
        setOpen(true);
    };
    // 时间选择
    const changeDate=(_:any,data:string[])=>{
        if (data.length === 2 && data[0] === '' && data[1] === '') {
            setStartDate('2000-01-01');
            setEndDate('2099-01-01');
        } else {
            setStartDate(data[0]);
            setEndDate(data[1]);
        }
    };
    // 监听姓名
    const changePhone=(e)=>{
        setPhone(e.target.value);
        sessionStorage.setItem('enterRenamePhone',e.target.value);
    };
    // 监听状态
    const changeStutes=(e:number)=>{
      setStutes(e);
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
    const fenyeinfo=()=>{
        props.dispatch({
            type:'Rename/fenye',
            payload:{phone,stutes,startDate,endDate,pageSize}
        })
    };
    // 搜索
    const suosou=()=>{
        setPage(1);
        fenyeinfo()
        logFenye();
    };
    useEffect(() => {
        fenyeinfo();
    }, []);
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
                           <DatePicker.RangePicker onChange={changeDate}/>
                        </Space.Compact>
                        {/*<Space.Compact>*/}
                        {/*    <div*/}
                        {/*        style={{*/}
                        {/*            borderRadius: '6px',*/}
                        {/*            borderStartEndRadius: 0,*/}
                        {/*            borderEndEndRadius: 0,*/}
                        {/*            padding: '0 11px',*/}
                        {/*            border: '1px solid #d9d9d9',*/}
                        {/*            display: 'flex',*/}
                        {/*            alignItems: 'center',*/}
                        {/*            borderInlineEnd: 0,*/}
                        {/*        }}*/}
                        {/*    >*/}
                        {/*        状态:*/}
                        {/*    </div>*/}
                        {/*    <Select*/}
                        {/*        onChange={changeStutes}*/}
                        {/*        defaultValue={stutes}*/}
                        {/*        style={{ width: 120 }}*/}
                        {/*        options={[*/}
                        {/*            { value:0, label: '全部' },*/}
                        {/*            { value:1, label: '未审核' },*/}
                        {/*            { value:2, label: '已审核' },*/}
                        {/*        ]}*/}
                        {/*    />*/}
                        {/*</Space.Compact>*/}
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
            <Modal open={open} title='是否要删除?' onCancel={()=>setOpen(false)} onOk={onOk} loading={spinning}>
                <div>是否要删除?</div>
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