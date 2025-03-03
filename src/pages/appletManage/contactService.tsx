import {Button, Form, Image, message, Modal, Space, Spin, Table, Tag} from "antd";
import {history,connect} from "umi";
import {useEffect, useState} from "react";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";

const ContactService=(props)=>{
    const [did,setDid]=useState(0);
    const [isDeleteOpen,setisDeleteOpen]=useState(false);
    const [isSpinning,setIsSpinning]=useState(false);
    const columns =[
        {
            title: '名称',
            dataIndex: 'csName',
            key: 'csName',
        },
        {
            title: '链接',
            dataIndex: 'csLink',
            key: 'csLink',
        },
        {
            title: '链接类型',
            dataIndex: 'csType',
            key: 'csType',
            render:(text:any,record:any,)=>{
                return(
                    <Space>
                        {record.csType==1?<Tag color='green'>物业客服</Tag>:<Tag color='blue'>招商客服</Tag>}
                    </Space>
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
                        <Button type='primary' danger onClick={()=>isDelete(record.id)}>删除</Button>
                        <Button type='primary' onClick={()=>toedit(record.id)}>编辑</Button>
                    </Space>
                )
            }
        }
    ];
    // 获取列表
    const getList=()=>{
        props.dispatch({
            type:'ContactService/fetch'
        })
    };
    // 添加页面
    const toadd=()=>{
        history.push('/appletManage/addContactService');
    };
    // 编辑页面
    const toedit=(e:number)=>{
        history.push(`/appletManage/editContactService?id=${e}`);
    };
    // 删除弹窗
    const isDelete=(e)=>{
        setDid(e);
        setisDeleteOpen(true);
    };
    // 确定删除联系客服链接
    const onOk=()=>{
        setIsSpinning(true);
        props.dispatch({
            type:'ContactService/remove',
            payload:did
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                message.success('删除成功');
                setIsSpinning(false);
                setisDeleteOpen(false);
            }else {
                message.error(res.Data);
                setIsSpinning(false);
                setisDeleteOpen(false);
            }
        })
    };
    useEffect(() => {
        getList();
        console.log('props',props)
    }, []);
    return(
        <Spin spinning={isSpinning}>
            <Form style={{backgroundColor:'#f5f5f5',padding:'10px',marginBottom:"20px",border:'1px solid #e3e3e3',borderRadius:'4px'}}>
                <Form.Item>
                    <Button type='primary' onClick={toadd}>添加联系客服链接</Button>
                </Form.Item>
            </Form>
            <Table
                columns={columns}
                style={{border:'1px solid #ddd',borderRadius:'4px'}}
                pagination={false}
                rowKey={(columns) => columns.id}
                dataSource={props.ContactServiceList}
                scroll={{y:'70vh'}}
            />
            <Modal open={isDeleteOpen} onCancel={()=>setisDeleteOpen(false)} onOk={onOk} loading={isSpinning}>
                确定要删除吗?
            </Modal>
        </Spin>
    )
}
const mapStateToProps = (state: any) => {
    return {
        ContactServiceList: state.ContactService.list
    }
};
export default connect(mapStateToProps) (ContactService)