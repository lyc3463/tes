import {Button, DatePicker, Input, List, message, Modal, Pagination, Select, Space, Table, Tag} from "antd";
import dayjs from "dayjs";
import {history,connect} from "umi";
import {useEffect, useState} from "react";
const InvoiceLookUp=(props:any)=>{
    const [page,setPage]=useState(1);
    // 状态 0全部，1未审核，2审核通过
    const [stutes,setStutes]=useState(0);
    const [openID,setOpenID]=useState('');
    const [name,setName]=useState('');
    const [checkOpen,setCheckOpen]=useState(false);
    // 审核id
    const [uid,setUid]=useState(0);
    // 删除id
    const [did,setDid]=useState(0);
    // 删除的弹窗
    const [deleteOpen,setDeleteOpen]=useState(false);
    const columns =[
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
            title: '抬头类型',
            dataIndex: 'rise_type',
            key: 'rise_type',
            render:(_:any,record:any)=>{
                return(
                    <>
                        {record.rise_type==1?<Tag color='green'>企业</Tag>:<Tag color='red'>个人</Tag>}
                    </>
                )
            }
        },
        {
            title: '抬头名称',
            dataIndex: 'rise_name',
            key: 'rise_name',
        },
        {
            title: '税号',
            dataIndex: 'duty_paragraph',
            key: 'duty_paragraph',
        },
        {
            title: '状态',
            dataIndex: 'riseStatus',
            key: 'riseStatus',
            render:(text:any,record:any,)=>{
                return(
                    <div>{record.riseStatus==2?<Tag color='green'>已通过</Tag>:<Tag color='red'>未审核</Tag>}</div>
                )
            }
        },
        {
            title: '操作',
            dataIndex: 'cao',
            key: 'cao',
            render:(text:any,record:any,)=>{
                return(
                   <Space>
                       {record.riseStatus==2?'':<Button type='primary' onClick={()=>check(record)}>审核通过</Button>}
                       <Button type='primary'>编辑</Button>
                       <Button type='primary' danger onClick={()=>deleteClick(record)}>删除</Button>
                   </Space>
                )
            }
        },
    ];
    const onChange=(e)=>{
      setPage(e);
    };
    // 监听状态
    const changeStutes=(e:number)=>{
        setStutes(e);
    };
    // 分页
    const logFenye=()=>{
        props.dispatch({
            type:"InvoiceLookUp/fetch",
            payload:{page,name,stutes,openID}
        })
    };
    useEffect(() => {
        logFenye();
    }, [page]);
    // 搜索
    const suosou=()=>{
        setPage(1);
        props.dispatch({
            type:'InvoiceLookUp/fenye',
            payload:{name,stutes,openID}
        })
        logFenye();
    };
    // 审核通过的弹窗
    const check=(e)=>{
        setUid(e.id);
        setCheckOpen(true);
    };
    // 确定审核通过
    const onCheckOK=()=>{
        props.dispatch({
            type:'InvoiceLookUp/check',
            payload:{uid}
        }).then((res:any)=>{
            if (res.ErrorCode==0){
                message.success('审核通过');
                setCheckOpen(false);
            }else {
                message.error(res.Data)
            }
        })
    };
    // 删除的弹窗
    const deleteClick=(e)=>{
        setDid(e.id);
        setDeleteOpen(false)
    };
    const onDeleteOk=()=>{
        props.dispatch({
            type:'InvoiceLookUp/remove',
            payload:{did}
        }).then((res:any)=>{
            if (res.ErrorCode==0){
                message.success('删除成功');
                setCheckOpen(false);
            }else {
                message.error(res.Data)
            }
        })
    };
    return(
        <div>
            <List>
                <List.Item>
                    <Space>
                        <Input
                            addonBefore="抬头名称:"
                            onChange={(e)=>setName(e.target.value)}
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
                                onChange={changeStutes}
                                defaultValue={stutes}
                                style={{ width: 120 }}
                                options={[
                                    { value:0, label: '全部' },
                                    { value:1, label: '未审核' },
                                    { value:2, label: '已审核' },
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
                dataSource={props.InvoiceLookUpList}
                rowClassName={(record, index) =>
                    index % 2 === 1 ? 'tbodd' : 'tbeven'
                }
            />
            {props.count?<Pagination total={props.count.count} pageSize={50} current={page}  onChange={onChange} pageSizeOptions={[50]}/>:''}
        {/*    审核的弹窗*/}
            <Modal onOk={onCheckOK} open={checkOpen} title={'审核通过'} onCancel={()=>setCheckOpen(false)}>
                <div>确定审核通过吗?</div>
            </Modal>
            {/*    删除的弹窗*/}
            <Modal onOk={onDeleteOk} open={deleteOpen} title={'删除抬头'} onCancel={()=>setDeleteOpen(false)}>
                <div>确定要删除吗?</div>
            </Modal>
        </div>
    )
}
const mapStateToProps = (state: any) => {
    return {
        InvoiceLookUpList: state.InvoiceLookUp.list,
        count: state.InvoiceLookUp.count,
    }
};
export default connect(mapStateToProps) (InvoiceLookUp)