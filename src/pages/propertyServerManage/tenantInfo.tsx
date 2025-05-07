import {Button, DatePicker, Input, List, message, Modal, Pagination, Select, Space, Spin, Table, Tag} from "antd";
import {useEffect, useState} from "react";
import {history,connect} from "umi";
import dayjs from "dayjs";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import {StaticInfo} from "@/StaticInfo";

const TenantInfo=(props:any)=>{
    const [loading,setLoading]=useState(false)
    // 开始时间
    const [startDate,setStartDate]=useState('2000-01-01');
    // 结束时间
    const [endDate,setEndDate]=useState('2099-01-01');
    const [page,setPage]=useState(1);
    const [pageSize,setPageSize]=useState(50);
    const [stutes,setStutes]=useState(0);
    const [openid,setOpenid]=useState(0);
    // 租户手机号
    const [phone,setPhone]=useState('');
    // 发送内容
    const [content,setContent]=useState('');
    const [uid,setUid]=useState(0);
    const [dopen,setdopen]=useState(false);
    // 用户权限
    const [uqx,setUqx]=useState([]);
    const columns =[
        {
            title: '日期',
            dataIndex: 'messageTime',
            key: 'messageTime',
            render:(text:any,record:any)=>(
                <div>
                    {dayjs(text).format('YYYY-MM-DD')}
                </div>
            )
        },
        {
            title: '租户名称',
            dataIndex: 'tenant_name',
            key: 'tenant_name',
        },
        {
            title: '消息内容',
            dataIndex: 'message_content',
            key: 'message_content',
            render:(text:any,record:any)=>(
                <Input.TextArea value={text}>

                </Input.TextArea>
            )
        },
        // {
        //     title: '状态',
        //     dataIndex: 'messageStatus',
        //     key: 'messageStatus',
        //     render:(text:any,record:any)=>(
        //         <>
        //             {record.messageStatus==0?<Tag color='red'>未读</Tag>:<Tag color='green'>已读</Tag>}
        //         </>
        //     )
        // },
        {
            title: '操作',
            dataIndex: 'cao',
            key: 'cao',
            render:(text:any,record:any)=>(
                <Space>
                    {uqx[261]=='1'?<Button type='primary' danger onClick={()=>onDelete(record)}>删除</Button>:''}
                    {/*<Button type='primary'>编辑</Button>*/}
                </Space>
            )
        }
    ];
    const toadd=()=>{
        history.push('/propertyServerManage/addTenantInfo')
    };
    useEffect(() => {
        logFenye();
    }, [page,pageSize]);
    // 删除的弹窗
    const onDelete=(record:any)=>{
      setUid(record.id);
      setdopen(true);
    };
    // 监听日期
    const changeDate=(_:any,data:string[])=>{
        if (data.length === 2 && data[0] === '' && data[1] === '') {
            setStartDate('2000-01-01');
            setEndDate('2099-01-01');
        } else {
            setStartDate(data[0]);
            setEndDate(data[1]);
        }
    };
    const logFenye=()=>{
        props.dispatch({
            type:"TenantInfo/fetch",
            payload:{page,content,phone,startDate,endDate,stutes,openid,pageSize}
        })
    };
    const sousuo=()=>{
        setPage(1);
        props.dispatch({
            type:"TenantInfo/fenye",
            payload:{content,phone,startDate,endDate,stutes,openid,pageSize}
        });
        logFenye();
    };
    const onChange=(e:number,pageSize:number)=>{
      setPage(e);
      setPageSize(pageSize);
    };
    // 确定删除
    const onOk=()=>{
        setLoading(true);
        props.dispatch({
            type:"TenantInfo/remove",
            payload:uid
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                message.success('删除成功');
                setLoading(false);
                setdopen(false);
            }else {
                message.error(res.Data);
                setLoading(false);
                setdopen(false);
            }
        });
    };
    useEffect(() => {
        let uq=StaticInfo.uqx.split('');
        setUqx(uq);
    }, []);
    return(
        <Spin spinning={loading}>
            <List>
                <List.Item>
                    <div>
                        <div>
                            {uqx[260]=='1'?<Button type="primary" onClick={toadd}>通知用户</Button> :''}
                        </div>
                    </div>
                    <Space>
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
                                时间:
                            </div>
                            <DatePicker.RangePicker onChange={changeDate}/>
                        </Space.Compact>
                        <Button type="primary" onClick={sousuo}>
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
                scroll={{y:'70vh'}}
                dataSource={props.TenantInfoList}
                // rowClassName={(record, index) =>
                //     index % 2 === 1 ? 'tbodd' : 'tbeven'
                // }
            />
            {props.count?<Pagination total={props.count.count} showSizeChanger pageSize={pageSize} current={page}  onChange={onChange} pageSizeOptions={[50,100,500,1000,10000]}/>:''}
            <Modal title='删除租户消息' open={dopen} loading={loading} onOk={onOk} onCancel={()=>setdopen(false)}>
                <div>是否要删除</div>
            </Modal>
        </Spin>
    )
}
const mapStateToProps = (state: any) => {
    return {
        TenantInfoList: state.TenantInfo.list,
        count: state.TenantInfo.count
    }
};
export default connect(mapStateToProps) (TenantInfo)