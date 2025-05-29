import {Button, Form, Input, List, message, Modal, Pagination, Select, Space, Spin, Table, Tag} from "antd";
import {history,connect} from "umi";
import {useEffect, useState} from "react";
import {getRandomNumber} from "@/utils/OpenTool";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import {StaticInfo} from "@/StaticInfo";

const Cable=(props:any)=>{
    const [page,setPage]=useState(1);
    const [pageSize,setPageSize]=useState(50);
    const [collectorId,setCollectorId]=useState(sessionStorage.getItem('waterCableManageCableCollectorId')||'');
    const [did,setDid]=useState(0);
    const [open,setOpen]=useState(false);
    const [isSpinning,setIsSpinning]=useState(false);
    const [name,setNmae]=useState(sessionStorage.getItem('waterCableManageCableName')||'');
    const [remark,setremark]=useState(sessionStorage.getItem('waterCableManageCableRemark')||'');
    // 用户权限
    const [uqx,setUqx]=useState([]);
    const toedit=(e)=>{
        history.push(`/waterCableManage/editCable?id=${e}`);
    };
    const columns =[
        {
            title: '采集器',
            dataIndex: 'collectorid',
            key: 'collectorid',
        },
        {
            title: '通讯质量',
            dataIndex: 'communicate_quality',
            key: 'communicate_quality',
            render:(_:any,record:any)=>{
                let quality;
                if (getRandomNumber(1,10) <= 1) {
                    quality =<Tag color='red'>差</Tag>;
                } else if (getRandomNumber(1,10) <= 2) {
                    quality = <Tag color='gold'>良</Tag>;
                } else {
                    quality = <Tag color='green'>好</Tag>;
                }
                return(
                    <>
                        {quality}
                    </>
                )
            }
        },
        {
            title: '通讯地址',
            dataIndex: 'address',
            key: 'address',
        },
        {
            title: '租户',
            dataIndex: 'tenant_name',
            key: 'tenant_name',
            render:(_:any,record:any)=>{
                return(
                    <div>
                        {record.tenant_name==null?"未关联租户":record.tenant_name}
                    </div>
                )
            }
        },
        {
            title: '电表类型',
            dataIndex: 'electricity_type',
            key: 'electricity_type',
            width: 200,
            render:(_:any,record:any)=>{
                let tag;
                if (record.electricity_type=='65361'){
                    tag=<Tag color='cyan'>单相单费率07抄表</Tag>
                }else if (record.electricity_type=='65362'){
                    tag=<Tag color='blue'>三相单费率07抄表</Tag>
                }else if (record.electricity_type=='16225'){
                    tag=<Tag color='green'>单相单费率2020Z款远程预付费</Tag>
                }else if (record.electricity_type=='16226'){
                    tag=<Tag color='red'>三相单费率2020Z款远程预付费</Tag>
                }else {
                    tag=<Tag color='red'>未知类型</Tag>
                }
                return(
                    <>
                        <div>
                            {tag}
                        </div>
                    </>
                )
            }
        },
        {
            title: '价钱名称',
            dataIndex: 'price_name',
            key: 'price_name',
        },
        {
            title: '描述',
            dataIndex: 'remark',
            key: 'remark',
        },
        {
            title: '积累用电量',
            dataIndex: 'eleNumSum',
            key: 'eleNumSum',
            render:(_:any,record:any)=>{
                return(
                    <>
                        <span>{record.eleNumSum}kwh</span>
                    </>
                )
            }
        },
        {
            title: '当前电量',
            dataIndex: 'c0',
            key: 'c0',
            render:(_:any,record:any)=>{
                return(
                    <>
                        <span>{record.c0}kwh</span>
                    </>
                )
            }
        },
        {
            title: '状态',
            dataIndex: 'relay_state',
            key: 'relay_state',
            render:(_:any,record:any)=>{
                return(
                    <div>
                        {record.relay_state==1?<Tag color='green'>合闸</Tag>:<Tag color='red'>拉闸</Tag>}
                    </div>
                )
            }
        },
        {
            title: '操作',
            dataIndex: 'caozuo',
            key: 'caozuo',
            fixed: 'right',
            width: 200,
            render:(_:any,record:any)=>{
                return(
                    <>
                       <Space>
                           <Button type='primary' onClick={()=>tojiben(record)}>基本业务</Button>
                           {uqx[177]=='1'?<Button type='primary' onClick={(e)=>toedit(record.id)}>编辑</Button> :''}
                           {uqx[179]=='1'?<Button type='primary' danger onClick={(e)=>onDeleteOpen(record.id)}>删除</Button> :''}
                       </Space>
                    </>
                )
            }
        }
    ];
    useEffect(() => {
        logFenye();
    }, [page,pageSize]);
    const  toAdd=()=>{
        history.push('/waterCableManage/addCable')
    }
    const tojiben=(e)=>{
        history.push(`/waterCableManage/ElectricityBasicBusiness?id=${e.id}`)
    };
    // 分页
    const logFenye=()=>{
        props.dispatch({
            type:"Cable/fetch",
            payload:{page,collectorId,name,remark,pageSize}
        })
    };
    // 监听页数
    const onChange=(page,pageSizz)=>{
        setPage(page);
        setPageSize(pageSizz);
        logFenye();
    };
    // 搜索
    const sousuo=()=>{
        setPage(1);
        getFenyeInfo();
        logFenye();
    };
    const getFenyeInfo=()=>{
        props.dispatch({
            type:"Cable/fenye",
            payload:{collectorId,name,remark,pageSize}
        })
    };
    // 监听采集器输入框
    const changeCollectorId=(e)=>{
        setCollectorId(e.target.value);
        sessionStorage.setItem('waterCableManageCableCollectorId',e.target.value);
    };
    // 删除弹窗
    const onDeleteOpen=(e)=>{
        setDid(e);
        setOpen(true);
    };
    // 确定删除
    const onOk=()=>{
        setIsSpinning(true)
        props.dispatch({
            type:'Cable/remove',
            payload:did
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                message.success('删除成功');
                setOpen(false);
                setIsSpinning(false);
            }else {
                message.error(res.Data);
                setIsSpinning(false)
            }
        })
    };
    useEffect(() => {
        let uq=StaticInfo.uqx.split('');
        setUqx(uq);
        getFenyeInfo();
    }, []);
    const changeRemark=(e)=>{
        setremark(e.target.value);
        sessionStorage.setItem('waterCableManageCableRemark',e.target.value);
    };
    const changeName=(e)=>{
        setNmae(e.target.value);
        sessionStorage.setItem('waterCableManageCableName',e.target.value);
    };
    return(
        <Spin spinning={isSpinning}>
            <List>
                <List.Item>
                    <div>
                        {uqx[178]=='1'?  <Button type="primary" onClick={toAdd}>添加电表</Button>:''}
                    </div>
                    <Space>
                        <Input
                            onChange={changeCollectorId}
                            addonBefore="电表地址:"
                            value={collectorId}

                        />
                        <Input
                            onChange={changeRemark}
                            addonBefore="电表描述:"
                            value={remark}
                        />
                        <Input
                            onChange={changeName}
                            addonBefore="租户姓名:"
                            value={name}
                        />
                        <Button type="primary" onClick={sousuo}>
                            搜索
                        </Button>
                    </Space>
                </List.Item>
            </List>
            <Table
                columns={columns}
                style={{border:'1px solid #ddd',borderRadius:'4px'}}
                scroll={{x:1500}}
                pagination={false}
                size='small'
                rowKey={(columns) => columns.id}
                dataSource={props.CableList}
                summary={(columns) => (
                    <Table.Summary fixed>
                        <Table.Summary.Row>
                            <Table.Summary.Cell
                                index={1}
                            >
                                统计
                            </Table.Summary.Cell>
                            <Table.Summary.Cell index={0}>
                            </Table.Summary.Cell>
                            <Table.Summary.Cell index={0}>
                            </Table.Summary.Cell>
                            <Table.Summary.Cell index={2}>

                            </Table.Summary.Cell>
                            <Table.Summary.Cell index={3}>

                            </Table.Summary.Cell>
                            <Table.Summary.Cell index={4}>

                            </Table.Summary.Cell>
                            <Table.Summary.Cell index={0}>

                            </Table.Summary.Cell>
                            <Table.Summary.Cell index={5}>
                                {props.count?props.count.eleNumSum:''}kwh
                            </Table.Summary.Cell>
                            <Table.Summary.Cell index={7}>
                                {props.count?props.count.c0Sum:''}kwh
                            </Table.Summary.Cell>
                            <Table.Summary.Cell index={0}>
                            </Table.Summary.Cell>
                            <Table.Summary.Cell index={6}>

                            </Table.Summary.Cell>
                        </Table.Summary.Row>
                    </Table.Summary>
                )}
            />
            {props.count?<Pagination total={props.count.count} showSizeChanger pageSize={pageSize} current={page}  onChange={onChange} pageSizeOptions={[50,100,500,1000,10000]}/>:''}
        {/*    删除的弹窗*/}
            <Modal open={open} title='删除的弹窗' onOk={onOk} onCancel={()=>setOpen(false)}>
                <div>确定要删除电表吗?</div>
            </Modal>
        </Spin>
    )
}
const mapStateToProps = (state: any) => {
    return {
        CableList: state.Cable.list,
        count: state.Cable.count
    }
};
export default connect(mapStateToProps) (Cable)