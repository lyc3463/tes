import {Button, DatePicker, Image, Input, List, message, Modal, Space, Spin, Table, Tag, Checkbox} from "antd";
import {history,connect} from "umi";
import {useEffect, useState} from "react";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import {StaticInfo} from "@/StaticInfo";
import * as RoleService from '@/services/role';

const Role=(props)=>{
    const [uid,setUid]=useState(0);
    const [isOpen,setIsopen]=useState(false);
    const [isspinning,setisspinning]=useState(false);
    const [name,setName]=useState('');
    const [importPermissionsOpen,setImportPermissionsOpen]=useState(false);
    const [importPermissionsFile,setImportPermissionsFile]=useState([]);
    const [selectedImportIds,setSelectedImportIds]=useState<number[]>([]);
    // 用户权限
    const [uqx,setUqx]=useState([]);
    const columns =[
        {
            title: '角色名称',
            dataIndex: 'role_name',
            key: 'role_name',
        },
        {
            title: '操作',
            dataIndex: 'caozuo',
            key: 'caozuo',
            render:(text:any,record:any,)=>{
                return(
                   <Space>
                       {uqx[293]=='1'?<Button type='primary' onClick={()=>toedit(record.id)}>编辑</Button>:''}
                       {uqx[294]=='1'?<Button type='primary' danger onClick={()=>isdelete(record.id)}>删除</Button>:''}
                   </Space>
                )
            }
        },
    ];
    const toadd=()=>{
        history.push('/systemManage/addRole')
    };
    const toedit=(e)=>{
        history.push(`/systemManage/editRole?id=${e}`)
    };
    // 删除弹窗
    const isdelete=(e:number)=>{
      setUid(e);
      setIsopen(true);
    };
    const onOK=()=>{
        setisspinning(true);
        props.dispatch({
            type:'Role/remove',
            payload:uid
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                message.success('删除成功');
                setIsopen(false);
                setisspinning(false);
            }else {
                message.error(res.Data);
                setIsopen(false);
                setisspinning(false);
            }
        })
    };
    const sousuo=()=>{
        logfenye();
    };
    const logfenye=()=>{
        props.dispatch({
            type:"Role/fetch",
            payload:{name}
        })
    };
    useEffect(() => {
        let uq=StaticInfo.uqx.split('');
        setUqx(uq);
        logfenye();
        getzbRole();
    }, []);
    const importPermissions=()=>{
        setSelectedImportIds([]);
        setImportPermissionsOpen(true);
    };
    const getzbRole=()=>{
        RoleService.zbRole().then((res:TypeErrorCode)=>{
             if (res.ErrorCode==0){
               setImportPermissionsFile(res.Data);
            }else {
                message.error(res.Data);
            }
        })
    };
    const onImportPermissionsOk=()=>{
        // 必须至少选择一个 id
        if (!selectedImportIds || selectedImportIds.length===0){
            message.error('请至少选择一个角色');
            return;
        }
        RoleService.zbFef(JSON.stringify(selectedImportIds)).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                message.success('导入成功');
                // 导入成功后清空默认勾选并关闭弹窗，刷新列表
                setSelectedImportIds([]);
                setImportPermissionsOpen(false);
                logfenye();
            }else {
                message.error(res.Data);
            }
        })
    };
    return(
        <Spin spinning={isspinning}>
            <List>
                <List.Item>
                    <Space>
                        {uqx[292]=='1'?<Button type="primary" onClick={toadd}>添加角色</Button>:''}
                        <Button onClick={importPermissions}>
                            导入角色
                        </Button>
                    </Space>
                    
                    <Space>
                        <Input
                            addonBefore="角色名称:"
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
                size='small'
                style={{border:'1px solid #ddd',borderRadius:'4px'}}
                pagination={false}
                dataSource={props.RoleList}
            />
            <Modal open={isOpen} onOk={onOK} onCancel={()=>setIsopen(false)} title='删除角色'>
                <div>
                    是否要删除角色
                </div>
            </Modal>
            <Modal open={importPermissionsOpen} onCancel={()=>{setImportPermissionsOpen(false); setSelectedImportIds([]);}} title='导入角色' onOk={onImportPermissionsOk}>
                <div>
                    <Checkbox.Group
                        style={{width: '100%'}}
                        value={selectedImportIds}
                        onChange={(checkedValues:any)=>{
                            // 确保都是数字 id
                            const ids = (checkedValues || []).map((v:any)=>Number(v));
                            setSelectedImportIds(ids);
                        }}
                    >
                        <List
                            dataSource={importPermissionsFile}
                            renderItem={(item:any)=>{
                                return (
                                    <List.Item>
                                        <Checkbox value={Number(item.id)}>{item.role_name}</Checkbox>
                                    </List.Item>
                                )
                            }}
                        />
                    </Checkbox.Group>
                </div>
            </Modal>
        </Spin>
    )
}
const mapStateToProps = (state: any) => {
    return {
        RoleList: state.Role.list,
    }
};
export default connect(mapStateToProps) (Role)