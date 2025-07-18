import {connect,history} from "umi";
import {useEffect, useState} from "react";
import {Button, message, Modal, Space, Table, Tag} from "antd";
import {MenuFoldOutlined} from "@ant-design/icons";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import {filtermessageData} from "@/utils/OpenTool";

const NotificationList = (props) => {
    const [list,setList]=useState([]);
    const [open,setOpen]=useState(false);
    const [listLength,setListLength]=useState(0);
    const getNotificationList=()=>{
          props.dispatch({
            type: 'NotificationList/fetch',
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                let newarr=filtermessageData(res.Data);
                if (Array.isArray(newarr) && newarr.length> 0){
                    setOpen(true);
                }
                setList(newarr);
                if (newarr.length>0){
                    setListLength(newarr.length);
                }else {
                    setListLength(0);
                }
            }else {
                message.error(res.ErrorCode + res.Data);
            }
          })
    };
    const columns = [
        {
            title: '内容',
            dataIndex: 'tmContent',
            key: 'tmContent',
        },
        {
            title: '操作',
            dataIndex: 'x',
            key: 'x',
            render: (text: any, record: any) => {
                return <Space>
                    <Button onClick={()=>tochuli(record.tmType)} type='primary'>前往处理</Button>
                </Space>;
            }
        }
    ];
    const tochuli=(e)=>{
        if (e==1){
            history.push('/enter/invoiceLookUp/');
        }else if (e==2){
            history.push('/check/checkFp/');
        }else if (e==3){
            history.push('/wisdomStop/carManage/');
        }else if (e==4){
            history.push('/check/checkAfterSales/');
        }else if (e==5){
            history.push('/check/checkAfterSales/');
        }else if (e==6){
            history.push('/check/checkAfterSales/');
        }else if (e==7){
            history.push('/check/checkAfterSales/');
        }else if (e==8) {
            history.push('/check/checkAfterSales/');
        }else if (e==9) {
            history.push('/check/checkStaff/');
        }
        setOpen(false);
    };
    useEffect(() => {
        getNotificationList();
    }, []);
    const isopen=()=>{
        setOpen(true);
        getNotificationList();
    };
    return (
        <div>
            <Button onClick={isopen}><MenuFoldOutlined/><span style={{color:'red'}}>{listLength}</span></Button>
            <Modal open={open} onOk={()=>setOpen(false)} onCancel={()=>setOpen(false)} width={600}>
                <Table
                    columns={columns}
                    rowKey={(columns) => columns.id}
                    dataSource={list}
                    pagination={false}
                    size='small'
                    rowClassName={(record, index) =>
                        index % 2 === 1 ? 'tbodd' : 'tbeven'
                    }
                />
            </Modal>
        </div>
    )
}
const mapStateToProps = (state: any) => {
    return {
        NotificationListList: state.NotificationList.list,
    }
};
export default connect(mapStateToProps) (NotificationList);