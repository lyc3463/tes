import {Button, Form, Image, message, Modal, Space, Spin, Table} from "antd";
import {history,connect} from "umi";
import {useEffect, useState} from "react";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
const ParkingPayment=(props)=>{
    const [did,setDid]=useState();
    const [isDeleteOpen,setisDeleteOpen]=useState(false);
    const [isSpinning,setIsSpinning]=useState(false);
    const columns =[
        {
            title: '名称',
            dataIndex: 'ppName',
            key: 'ppName',
        },
        {
            title: '链接',
            dataIndex: 'ppLink',
            key: 'ppLink',
        },
        {
            title: '操作',
            dataIndex: 'cao',
            key: 'cao',
            render:(text:any,record:any,)=>{
                return(
                    <Space>
                        <Button type='primary' danger onClick={()=>isDelete(record.id)}>删除</Button>
                        <Button type='primary' onClick={()=>toedit(record.id)}>编辑</Button>
                    </Space>
                )
            }
        }
    ];
    // 添加页面
    const toadd=()=>{
        history.push('/appletManage/addParkingPayment');
    };
    // 编辑页面
    const toedit=(e:number)=>{
        history.push(`/appletManage/editParkingPayment?id=${e}`);
    };
    // 删除弹窗
    const isDelete=(e)=>{
        setDid(e);
        setisDeleteOpen(true);
    };
    // 获取列表
    const getList=()=>{
        props.dispatch({
            type:'ParkingPayment/fetch'
        })
    };
    useEffect(() => {
        getList();
    }, []);
    // 删除的弹窗
    const onOk=async ()=>{
        setIsSpinning(true);
        props.dispatch({
            type:'ParkingPayment/remove',
            payload:did
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                message.success('删除成功');
                setisDeleteOpen(false);
                setIsSpinning(false);
            }else {
                message.error(res.Data);
                setIsSpinning(false);
            }
        })
    };
    return(
        <Spin spinning={isSpinning}>
            <Form style={{backgroundColor:'#f5f5f5',padding:'10px',marginBottom:"20px",border:'1px solid #e3e3e3',borderRadius:'4px'}}>
                <Form.Item>
                    <Button type='primary' onClick={toadd}>添加停车缴费链接</Button>
                </Form.Item>
            </Form>
            <Table
                columns={columns}
                style={{border:'1px solid #ddd',borderRadius:'4px'}}
                pagination={false}
                rowKey={(columns) => columns.id}
                dataSource={props.ParkingPaymentList}
                scroll={{y:'70vh'}}
            />
            <Modal open={isDeleteOpen} onCancel={()=>setisDeleteOpen(false)} loading={isSpinning} onOk={onOk}>
                确定要删除吗?
            </Modal>
        </Spin>
    )
}
const mapStateToProps = (state: any) => {
    return {
        ParkingPaymentList: state.ParkingPayment.list
    }
};
export default connect(mapStateToProps) (ParkingPayment)