import {Button, Form, Image, message, Modal, Table} from "antd";
import {history,connect} from "umi";
import {useEffect, useState} from "react";

const Links=(props:any)=>{
    const [did,setDid]=useState()
    const [isDeleteOpen,setisDeleteOpen]=useState(false)
    const columns =[
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            render:(text:any,record:any)=>{
                return <Button type='link' onClick={()=>toedit(record.id)}>{text}</Button>
            }
        },
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
                    <div>
                        <Button type='primary' danger onClick={()=>isDelete(record.id)}>删除</Button>
                    </div>
                )
            }
        }
    ]
    const toadd=()=>{
        history.push('/appletManage/addLinks')
    }
   const toedit=(e:number)=>{
       history.push(`/appletManage/editLinks?id=${e}`)
   }
   const isDelete=(e)=>{
        setDid(e)
       setisDeleteOpen(true)
   }
   const onDelete=async ()=>{
        let res=await props.dispatch({
            type:'Links/remove',
            payload:did
        })
       if (res.ErrorCode==0){
           message.success('删除成功')
       }
   }
    return(
        <div>
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
        </div>
    )
}
const mapStateToProps = (state: any) => {
    return {
        LinksList: state.Links.list
    }
};
export default  connect(mapStateToProps)(Links)