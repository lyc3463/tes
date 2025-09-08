import {Button, Form, Input, List, message, Modal, Radio, Space, Spin, Table, Tabs, Tag, Tooltip} from "antd";
import {useEffect, useState} from "react";
import * as AppPzService from '@/services/appPz';
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import {history} from "@@/core/history";
const ConfigurationWxId=()=>{
    const [spinning,setspinning]=useState(false);
    const [dataSource,setdataSource]=useState([]);
    const [name,setname]=useState('');
    const [uid,setUid]=useState(0);
    const [open,setopen]=useState(false);
    const columns =[
        {
            title: '企业名称',
            dataIndex: 'qyName',
            key: 'qyName',
        },
        {
            title: '企业ID',
            dataIndex: 'authCorpId',
            key: 'authCorpId',
        },
        {
            title: '操作',
            dataIndex: 'xx',
            key: 'xx',
            render:(text:any,record:any)=>{
                return(
                    <Space>
                        <Button type='primary' danger onClick={()=>isDelete(record.id)} >删除</Button>
                       <Button type='primary' onClick={()=>toEdit(record.id)}>编辑</Button>
                    </Space>
                )
            }
        },
    ];
    const toadd=()=>{
        history.push('/systemManage/addConfigurationWxId/');
    };
    const toEdit=(e)=>{
        history.push(`/systemManage/editConfigurationWxId?id=${e}`);
    };
    const isDelete=(e)=>{
        setUid(e);
        setopen(true);
    };
    const getlist=()=>{
        setspinning(true);
        AppPzService.getWxInfoList(name).then((res:TypeErrorCode)=>{
            try {
                if(res.ErrorCode===0){
                    setdataSource(res.Data);
                    setspinning(false);
                }else {
                    message.error(res.Data);
                    setspinning(false);
                }
            }catch (e) {
                message.error(e);
                setspinning(false);
            }
        })
    };
    useEffect(()=>{
        getlist();
    },[]);
    const sousuo=()=>{
        getlist();
    };
    const onOk=()=>{
        setspinning(true);
        AppPzService.deleteWxInfo(uid).then((res:TypeErrorCode)=>{
            try {
                if(res.ErrorCode===0){
                    setspinning(false);
                    message.success('删除成功')
                    getlist();
                    setopen(false);
                }else {
                    message.error(res.Data);
                    setspinning(false);
                    setopen(false);
                }
            }catch (e) {
                message.error(e);
                setspinning(false);
                setopen(false);
            }
        })
    };
    return(
        <Spin spinning={spinning}>
            <List>
                <List.Item>
                    <div>
                        <Button type="primary" onClick={toadd}>添加企业</Button>
                    </div>
                    <Space>
                        <Input
                            addonBefore="企业名称:"
                            onChange={(e)=>{
                                setname(e.target.value);
                            }}
                        />
                        <Button type="primary" onClick={sousuo}>
                            搜索
                        </Button>
                    </Space>
                </List.Item>
            </List>
            <Table
                columns={columns}
                pagination={false}
                dataSource={dataSource}
                scroll={{y:'60vh'}}
                rowKey={(columns) => columns.id}
                size='small'
            />
            <Modal open={open} loading={spinning} onCancel={()=>setopen(false)} onOk={onOk}>
                <div>确定要删除吗？</div>
            </Modal>
        </Spin>
    )
}
export default ConfigurationWxId