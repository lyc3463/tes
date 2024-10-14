import {Button, Form, Input, List, message, Modal, Select, Space, Table} from "antd";
import {history,connect} from "umi";
import {useEffect, useState} from "react";
import * as CompanService from "@/services/compan";

const CompanyList=(props:any)=>{
    // 需要删除的id
    const [uid,setUid]=useState(0);
    // 删除的弹窗
    const [isDeleteOpen,setIsDeleteOpen]=useState(false);
    // 公司关联有的所有项目
    const [projectList,setProjectList]=useState([]);

    const columns =[

        {
            title: '公司名称',
            dataIndex: 'company_name',
            key: 'company_name',
        },
        {
            title: '操作',
            dataIndex: 'caozuo',
            key: 'caozuo',
            render:(text:any,record:any)=>{
                return(
                    <Space>
                        <Button onClick={()=>toedit(record.id)} type='primary'>编辑</Button>
                        <Button type='primary' danger onClick={()=>isDelete(record.id)}>删除</Button>
                    </Space>
                )
            }
        }
    ]

    // 删除的弹窗
    const isDelete=async (e:number)=>{
        setUid(e);
        let res=await CompanService.getContainInfo(e)
        if (res?.ErrorCode==0){
            setIsDeleteOpen(true);
            setProjectList(res.Data);
        }
    };
    const toedit=(e:number)=>{
        history.push(`/financeManage/editCompany?id=${e}`)
    };
    const toaddCompany=()=>{
        history.push('/financeManage/addCompany')
    };

    const determineDelete=()=>{
        props.dispatch({
            type:'Compan/remove',
            payload:uid
        }).then((res)=>{
            if (res.ErrorCode==0){
                message.success('删除成功')
                setIsDeleteOpen(false)
            }else {
                message.error(res.Data)

            }
        })};
    return(
        <div>

            <List>
                <List.Item>
                    <div>
                        <Button type="primary"  onClick={toaddCompany}>
                            添加公司
                        </Button>
                    </div>
                    <Space>
                        <Input

                            addonBefore="公司名称:"
                        />

                        <Button type="primary">
                            搜索
                        </Button>
                    </Space>
                </List.Item>
            </List>
            <Table
                rowKey={(columns) => columns.id}
                columns={columns}
                dataSource={props.CompanList} pagination={false}
                style={{border:'1px solid #ddd',borderRadius:'4px'}}
                size='small'
            />
            <Modal open={isDeleteOpen} onOk={determineDelete} onCancel={()=>setIsDeleteOpen(false)}>
                {projectList.length === 0? (
                    <div>该公司下面没有绑定有项目可以删除</div>
                ) : (
                    <>
                        <div>
                            <h2>当前公司绑定有以下信息确定要删除吗?</h2>
                            {projectList.map((item, index) => (
                                <div key={index}>{item.project_name}</div>
                            ))}
                        </div>
                    </>
                )}
            </Modal>
        </div>
    )
}
const mapStateToProps = (state: any) => {
    return {
        CompanList: state.Compan.list
    }
};
export default connect(mapStateToProps) (CompanyList)