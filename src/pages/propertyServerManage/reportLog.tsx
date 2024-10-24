import {Button, Input, List, message, Modal, Pagination, Select, Space, Spin, Table, Tag} from "antd";
import {useEffect, useState} from "react";
import {connect} from "umi";
import dayjs from "dayjs";

const ReportLog=(props:any)=>{
    const [loading, setLoading] = useState(false);
    const [page,setPage]=useState(1);
    const [isOpen,setIsOpen]=useState(false);
    const [uid,setUid]=useState(0);
    // 跟进人ID
    const [userID,setUserID]=useState(0);
    const columns=[
        {
            title: '日期',
            dataIndex: 'created',
            render: (_: any, record: any) => (
                <div>
                    {dayjs(_).format('YYYY-MM-DD HH:mm:ss')}
                </div>
            ),
        },
        {
            title: '报修租户',
            dataIndex: 'tenant_name',
        },
        {
            title: '联系电话',
            dataIndex: 'tenant_phone',
        },
        {
            title: '跟进人',
            dataIndex: 'userName',
            render:(_:any,record:any)=>(
                <div>
                    {record.userName?<Tag color='green'>{record.userName}</Tag>:<Tag color='red'>未分配跟进人</Tag>}
                </div>
            )
        },
        {
            title: '报修内容',
            dataIndex: 'repair_content',
            render: (_: any, record: any) => (
                <Input.TextArea value={_}/>
            ),
        },
        {
            title: '操作',
            dataIndex: 'operation',
            render: (_: any, record: any) => (
                <Space>
                    <Button type='link' onClick={()=>genjin(record)}>分配跟进人</Button>
                </Space>
            ),
        },
    ];
    useEffect(() => {
        console.log(props)
    }, []);
    // 确定分配跟进人按钮
    const onOk=()=>{
        props.dispatch({
            type:'Report/fenpei',
            payload:{uid,userID}
        }).then((res:any)=>{
            if (res.ErrorCode==0){
                message.success('分配成功');
                setIsOpen(false);
            }else {
                message.error(res.Data)
            }
        })
    };
    // 分配跟进人弹窗
    const genjin=(e)=>{
      setIsOpen(true);
      setUid(e.id);
    };
    const onChange=(e:number)=>{
        setPage(e);
    };
    // 选择跟进人
    const changeSelect=(e)=>{
        setUserID(e);
    };
    return(
        <Spin spinning={loading}>
            <List>
                <List.Item>

                </List.Item>
            </List>
            <Table
                columns={columns}
                rowKey={(columns) => columns.id}
                pagination={false}
                dataSource={props.ReportList}
                rowClassName={(record, index) =>
                    index % 2 === 1 ? 'tbodd' : 'tbeven'
                }
            />
            {props.count?<Pagination total={props.count.count} pageSize={50} current={page}  onChange={onChange} pageSizeOptions={[50]}/>:''}
            {/* 分配跟进人弹窗*/}
            <Modal title='分配跟进人' open={isOpen} onCancel={()=>setIsOpen(false)} onOk={onOk}>
                <Select style={{width:'100%'}} onChange={changeSelect}>
                    {props.UsersList&&props.UsersList.length>0?props.UsersList.map((item:any,index:any)=>{
                        return(
                            <Select.Option value={item.id} key={index}>
                                {item.user_name}
                            </Select.Option>
                        )
                    }):''}
                </Select>
            </Modal>
        </Spin>
    )
}
const mapStateToProps = (state: any) => {
    return {
        ReportList: state.Report.list,
        count: state.Report.count,
        UsersList: state.Users.list,
    }
};
export default connect(mapStateToProps) (ReportLog)