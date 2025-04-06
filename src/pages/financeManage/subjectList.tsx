import {Button, Form, Input, List, message, Modal, Select, Space, Table} from "antd";
import {history,connect} from "umi";
import {useEffect, useState} from "react";
import {StaticInfo} from "@/StaticInfo";

const SubjectList=(props:any)=>{
    const [uid,setUid]=useState(0);
    const [isDeleteOpen,setIsDeleteOpen]=useState(false);
    const [name,setName]=useState('');
    // 用户权限
    const [uqx,setUqx]=useState([]);
    const columns =[
        {
            title: '科目名称',
            dataIndex: 'subject_name',
            key: 'subject_name',
        },
        {
            title: '操作',
            dataIndex: 'cao',
            key: 'cao',
            render:(text:any,record:any)=>{
                return(
                    <Space>
                        {uqx[163]=='1'?<Button type='primary' onClick={()=>{toedit(record.id)}}>编辑</Button>:''}
                        {uqx[164]=='1'?<Button type='primary' danger onClick={()=>isDelete(record.id)}>删除</Button>:''}
                    </Space>
                )
            }
        }
    ];
    const toadd=()=>{
        history.push('/financeManage/addSubjectList')
    };
    const toedit=(e:number)=>{
        history.push(`/financeManage/editSubjectList?id=${e}`)
    };
    // 删除的弹窗
    const isDelete=async (e:number)=>{
        setUid(e);
        setIsDeleteOpen(true);
    };
    // 确定删除
    const determineDelete=()=>{
        props.dispatch({
            type:'Subject/remove',
            payload:uid
        }).then((res)=>{
            if (res.ErrorCode==0){
                message.success('删除成功');
                setIsDeleteOpen(false);
            }else {
                message.error(res.Data);
            }
        })
    };
    const getList=()=>{
        props.dispatch({
            type:'Subject/fetch',
            payload:{name}
        })
    };
    useEffect(() => {
        getList();
    }, []);
    const sousuo=()=>{
        getList()
    };
    useEffect(() => {
        let uq=StaticInfo.uqx.split('');
        setUqx(uq);
    }, []);
    return(
        <div>
            <List>
                <List.Item>
                    <div>
                        {uqx[162]=='1'?
                            <Button type="primary"  onClick={toadd}>
                                添加科目
                            </Button>
                            :''}
                    </div>
                    <Space>
                        <Input
                            addonBefore="科目名称:"
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
                dataSource={props.SubjectList} pagination={false}
                size='small'
            />
            {/*删除的弹窗*/}
            <Modal open={isDeleteOpen} onOk={determineDelete} onCancel={()=>setIsDeleteOpen(false)}>
                <div>确定要删除吗？</div>
            </Modal>
        </div>
    )
}
const mapStateToProps = (state: any) => {
    return {
        SubjectList: state.Subject.list
    }
};
export default connect(mapStateToProps) (SubjectList)