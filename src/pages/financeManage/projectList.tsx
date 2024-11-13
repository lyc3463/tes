import {Button, Form, Input, List, message, Modal, Select, Space, Table} from "antd";
import {history,connect} from "umi";
import {useEffect, useState} from "react";
import * as ProjectService from '@/services/project';
import {getContainInfo, remove} from "@/services/project";

const ProjectList=(props:any)=>{
    // 删除的弹窗
    const [isDeleteOpen,setIsDeleteOpen]=useState(false);
    // 展示当前项目下包含的科目
    const [iskemuList,setiskemuList]=useState([]);
    // 展示当前项目下包含的账户
    const [iszhList,setiszhList]=useState([]);
    // 需要删除的id
    const [uid,setUid]=useState();
    const [name,setName]=useState('');
    const columns =[
        {
            title: '项目名称',
            dataIndex: 'project_name',
            key: 'project_name',
        },
        {
            title: '所属公司',
            dataIndex: 'company_name',
            key: 'company_name',
        },
        {
            title: '操作',
            dataIndex: 'cao',
            key: 'cao',
            render:(text:any,record:any)=>{
                return(
                    <Space>
                        <Button type='primary' onClick={()=>{toedit(record.id)}}>编辑</Button>
                        <Button type='primary' danger onClick={()=>isdelete(record.id)}>删除</Button>
                    </Space>
                )
            }
        }
    ];

    // 查询当前项目底下包含的资料
    const isdelete=async (e:number)=>{
        setUid(e);
        let res=await ProjectService.getContainInfo(e)
        if (res?.ErrorCode==0){
            setIsDeleteOpen(true)
            setiskemuList(res.Data[1])
            setiszhList(res.Data[2])
        }
    };

    // 确定强制删除
    const ConfirmDelete= ()=>{
        props.dispatch({
            type:'Project/remove',
            payload:uid
        }).then((res:any)=>{
            if (res.ErrorCode==0){
                message.success('删除成功');
                setIsDeleteOpen(false);
            }else {
                message.error(res.Data)
            }
        })

    };
    const toProject=()=>{
        history.push('/financeManage/addProject')
    };
   const toedit=(e:number)=>{
       history.push(`/financeManage/editProject?id=${e}`)
   };
    const getList=()=>{
        props.dispatch({
            type:'Project/fetch',
            payload:{name}
        })
    };
    useEffect(() => {
        getList();
    }, []);
    const sousuo=()=>{
        getList()
    };
    return(
        <div>
            <List>
                <List.Item>
                    <div>
                        <Button type="primary"  onClick={toProject}>
                            添加项目
                        </Button>
                    </div>
                    <Space>
                        <Input
                            addonBefore="项目名称:"
                            onChange={(e)=>setName(e.target.value)}
                        />

                        <Button type="primary" onClick={sousuo}>
                            搜索
                        </Button>
                    </Space>
                </List.Item>
            </List>
            <Table
                rowKey={(columns) => columns.id}
                columns={columns}
                style={{border:'1px solid #ddd',borderRadius:'4px'}}
                dataSource={props.ProjectList} pagination={false}
                size='small'
            />
            {/*删除的弹窗*/}
            <Modal open={isDeleteOpen} onCancel={()=>setIsDeleteOpen(false)} onOk={ConfirmDelete}>
                {/* 检查两个数组是否都为空 */}
                {iskemuList.length === 0 && iszhList.length === 0 ? (
                    <div>该账户没有绑定有科目和账户</div>
                ) : (
                    <>
                        <div>
                            <h2>当前项目绑定有以下信息确定要删除吗?</h2>
                            {/* 如果iskemuList不为空，则渲染它的内容 */}
                            {iskemuList.map((item, index) => (
                                <div key={index}>{item}</div>
                            ))}
                        </div>
                        {/* 如果iszhList不为空，则渲染它的内容 */}
                        {iszhList.map((item, index) => (
                            <div key={index}>{item}</div>
                        ))}
                    </>
                )}
            </Modal>
        </div>
    )
}
const mapStateToProps = (state: any) => {
    return {
        ProjectList: state.Project.list
    }
};
export default  connect(mapStateToProps)(ProjectList)
