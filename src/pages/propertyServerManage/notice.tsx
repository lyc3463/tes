import {Button, DatePicker, Input, List, message, Modal, Select, Space, Spin, Table, Tabs} from "antd";
import TypeNotice from "@/ModelTypes/TypeNotice";
import {useEffect, useState} from "react";
import {history,connect} from "umi";
import dayjs from "dayjs";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import {StaticInfo} from "@/StaticInfo";
import Rename from "@/pages/enter/rename";

const Notice=(props:any)=>{
    const [loading,setLoading]=useState(false);
    // 园区内容
    const [allNoticeName,setallNoticeName]=useState(sessionStorage.getItem('propertyServerManageNoticeName')||'');
    // 开始时间
    const [beginTimeNotice,setbeginTimeNotice]=useState('2000-01-01');
    // 结束时间
    const [endTimeNotice,setendTimeNotice]=useState('2099-01-01');
    // 删除的弹窗
    const [Dopen,setDopen]=useState(false);
    const [uid,setUid]=useState(0);
    // 用户权限
    const [uqx,setUqx]=useState([]);
    // 去添加页面
    const tianjia=()=>{
        history.push('/propertyServerManage/addNotice')
    };
    const toinfo=(e:number)=>{
        history.push(`/propertyServerManage/editNotice?id=${e}`)
    };
    const getNotice=()=>{
      props.dispatch({
          type:'Notice/fetch',
          payload:{allNoticeName,beginTimeNotice,endTimeNotice}
      })
    };
    useEffect(() => {
        getNotice();
    }, []);
    // 时间选择
    const changeDate=(_:any,data:string[])=>{
        if (data.length === 2 && data[0] === '' && data[1] === '') {
            setbeginTimeNotice('2000-01-01');
            setendTimeNotice('2099-01-01');
        } else {
            setbeginTimeNotice(data[0]);
            setendTimeNotice(data[1]);
        }
    };
    const columns =[
        {
            title: '日期',
            dataIndex: 'noticeDate',
            key: 'noticeDate',
            render: (_, record: any) => (
                <span>{dayjs(record.noticeDate).format('YYYY-MM-DD')}</span>
            ),
        },
        {
            title: '消息内容',
            dataIndex: 'notice_content',
            key: 'notice_content',
            render: (_: any, record: any) => (
               <Input.TextArea defaultValue={record.notice_content}/>
            ),
        },
        // {
        //     title: '状态',
        //     dataIndex: 'park_status',
        //     key: 'park_status',
        //     render:(_:any,record:any)=>{
        //         return(
        //             <Space>
        //              {record.park_status? <span style={{color:'green'}}>已发布</span>:<span style={{color:"red"}}>未发布</span>}
        //             </Space>
        //         )
        //     }
        // },
        {
            title: '操作',
            dataIndex: 'cao',
            key: 'cao',
            render:(_:any,record:any)=>{
                return(
                    <Space>
                        {uqx[166]=='1'?<Button type='primary' danger onClick={()=>onDelete(record)}>删除</Button>:''}
                    </Space>
                )
            }
        },
    ];
    // 搜索
    const sousuo=()=>{
        getNotice();
    };
    // 删除的弹窗
    const onDelete=(record:any)=>{
        setDopen(true);
        setUid(record.id);
    };
    // 删除的确定
    const onOk=()=>{
        setLoading(true);
        props.dispatch({
            type:'Notice/remove',
            payload:uid
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                setLoading(false);
                message.success('删除成功');
                setDopen(false);
            }else {
                message.error(res.Data);
                setLoading(false);
                setDopen(false);
            }
        })
    };
    useEffect(() => {
        let uq=StaticInfo.uqx.split('');
        setUqx(uq);
    }, []);
    const changeName=(e)=>{
        setallNoticeName(e.target.value);
        sessionStorage.setItem('propertyServerManageNoticeName',e.target.value);
    };
    return(
        <Spin spinning={loading}>
            <List>
                <List.Item>
                    <div>
                        {uqx[165]=='1'? <Button type="primary" onClick={tianjia}>添加园区公告</Button> :''}
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
                        <Input
                            onChange={changeName}
                            addonBefore="园区内容:"
                            value={allNoticeName}
                        />

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
                dataSource={props.NoticeList}
                // rowClassName={(record, index) =>
                //     index % 2 === 1 ? 'tbodd' : 'tbeven'
                // }
            />
            <Modal title={'删除园区公告'} open={Dopen} loading={loading} onCancel={()=>setDopen(false)} onOk={onOk}>
                <div>确定要删除吗?</div>
            </Modal>
        </Spin>
    )
}
const mapStateToProps = (state: any) => {
    return {
        NoticeList: state.Notice.list
    }
};
export default connect(mapStateToProps) (Notice)