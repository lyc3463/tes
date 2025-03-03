import {Button, Form, Image, message, Modal, Space, Spin, Table} from "antd";
import {history,connect} from "umi";
import {useEffect, useState} from "react";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
const FriendlyLinks=(props:any)=>{
    const [did,setDid]=useState();
    const [isDeleteOpen,setisDeleteOpen]=useState(false);
    const [isSpinning,setIsSpinning]=useState(false);
    const columns =[
        {
            title: '名称',
            dataIndex: 'link_name',
            key: 'link_name',
        },
        {
            title: '链接',
            dataIndex: 'link_address',
            key: 'link_address',
        },
        {
            title: '图片',
            dataIndex: 'link_image',
            key: 'link_image',
            render:(text:any,record:any)=>{
                return <Image src={text} style={{width:'50px',height:'50px'}}/>
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
    // 获取友情连接列表
    const getList=()=>{
        props.dispatch({
            type:'Links/fetch'
        })
    };
    useEffect(() => {
        getList();
    }, []);
    const toadd=()=>{
        history.push('/appletManage/addLinks');
    };
    const toedit=(e:number)=>{
        history.push(`/appletManage/editLinks?id=${e}`);
    };
    const isDelete=(e)=>{
        setDid(e);
        setisDeleteOpen(true);
    };
    const onDelete=async ()=>{
        setIsSpinning(true);
        props.dispatch({
            type:'Links/remove',
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
                    <Button type='primary' onClick={toadd}>添加友情链接</Button>
                </Form.Item>
            </Form>
            <Table
                columns={columns}
                style={{border:'1px solid #ddd',borderRadius:'4px'}}
                pagination={false}
                rowKey={(columns) => columns.id}
                dataSource={props.LinksList}
                scroll={{y:'70vh'}}
            />
            <Modal open={isDeleteOpen} onOk={onDelete} onCancel={()=>setisDeleteOpen(false)}>
                确定要删除吗?
            </Modal>
        </Spin>
    )
}
const mapStateToProps = (state: any) => {
    return {
        LinksList: state.Links.list
    }
};
export default connect(mapStateToProps) (FriendlyLinks)