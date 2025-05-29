import {Button, Form, Input, List, message, Modal, Pagination, Space, Spin, Table, Tag} from "antd";
import {connect,history} from 'umi'
import {getRandomNumber} from "@/utils/OpenTool";
import {useEffect, useState} from "react";
import * as HouseBillService from '@/services/houseBill';
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import {StaticInfo} from "@/StaticInfo";

const Water=(props:any)=>{
    let mathNumber=getRandomNumber(1,10);
    const [page,setPage]=useState(1);
    const [pageSize,setPageSize]=useState(50);
    const [waterAddress,setwaterAddress]=useState(sessionStorage.getItem('waterCableManageWaterAddress')||'');
    const [name,setName]=useState(sessionStorage.getItem('waterCableManageWaterName')||'');
    const [remark,setremark]=useState(sessionStorage.getItem('waterCableManageWaterRemark')||'');
    const [uid,setUid]=useState(0);
    const [open,setOpne]=useState(false);
    const [isSpinning,setIsSpinning]=useState(false);
    // 用户权限
    const [uqx,setUqx]=useState([]);
    const columns =[
        {
            title: '采集器',
            dataIndex: 'collectorid',
            key: 'collectorid',
        },
        {
            title: '电池状态',
            dataIndex: 'battery_state',
            key: 'battery_state',
            render:(_:any,record:any)=>{
                return(
                    <>
                        {record.battery_state==0?<Tag color='green'>正常</Tag>:<Tag color='red'>电池低电压</Tag>}
                    </>
                )
            }
        },
        {
            title: '通讯质量',
            dataIndex: 'zhiliang',
            key: 'zhiliang',
            render:(_:any,record:any)=>{
                let quality;
                if (mathNumber <= 3) {
                    quality =<Tag color='red'>差</Tag>;
                } else if (mathNumber <= 6) {
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
            title: '水表地址',
            dataIndex: 'address',
            key: 'address',
        },
        {
            title: '水表类型',
            dataIndex: 'water_type',
            key: 'water_type',
            render:(_:any,record:any)=>{
                let tag;
                if (record.water_type=='13301'){
                    tag=<Tag color='cyan'>无线无预付</Tag>
                }else {
                    tag=<Tag color='red'>未知类型</Tag>
                }
                return(
                    <div>
                        {tag}
                    </div>
                )
            }
        },
        {
            title: '价钱名称',
            dataIndex: 'price_name',
            key: 'price_name',
        },
        {
            title: '备注',
            dataIndex: 'remark',
            key: 'remark',
        },
        {
            title: '开阀状态',
            dataIndex: 'relay_state',
            key: 'relay_state',
            render:(_:any,record:any)=>{
                return(
                    <>
                        {record.relay_state==1?<Tag color='green'>开阀</Tag>:<Tag color='red'>关阀</Tag>}
                    </>
                )
            }
        },
        {
            title: '租户姓名',
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
            title: '积累用水量',
            dataIndex: 'waterNumSum',
            key: 'waterNumSum',
            render:(_:any,record:any)=>{
                return(
                    <>
                        {record.waterNumSum}m³
                    </>
                )
            }
        },
        {
            title: '当前水量',
            dataIndex: 'total_used_amount',
            key: 'total_used_amount',
            render:(_:any,record:any)=>{
                return(
                    <>
                        {record.total_used_amount}m³
                    </>
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
                            {uqx[251]=='1'?<Button type='primary' onClick={()=>toedit(record)}>编辑</Button> :''}
                            <Button type='primary' onClick={()=>tojiben(record)}>基本业务</Button>
                            {uqx[252]=='1'?<Button type='primary' danger onClick={()=>isdelete(record)}>删除</Button> :''}
                        </Space>
                    </>
                )
            }
        }
    ];
    const toadd=()=>{
        history.push('/waterCableManage/addWater')
    };
    const toedit=(e:any)=>{
        history.push(`/waterCableManage/editWater?id=${e.id}`)
    };
    const onChange=(e,pageSizz)=>{
      setPage(e);
      setPageSize(pageSizz)
    };
    const tojiben=(e)=>{
      history.push(`/waterCableManage/waterjiben?id=${e.id}`)
    };
    const isdelete=(e)=>{
        setUid(e.id);
        setOpne(true);
    };
    const onOk=()=>{
      setIsSpinning(true);
      props.dispatch({
          type:'Watert/remove',
          payload:uid
      }).then((res:any)=>{
          if (res.ErrorCode==0){
              setIsSpinning(false);
              message.success('删除成功');
              setOpne(false)
          }else {
              setIsSpinning(false);
              setOpne(false)
              message.error(res.Data);
          }
      })
    };
    // 获取水表列表
    const getWater=()=>{
      props.dispatch({
          type:'Watert/fetch',
          payload:{page,waterAddress,name,remark,pageSize}
      })
    };
    const sousuo=()=>{
        setPage(1);
        getFenyeInfo();
        getWater();
    };
    const getFenyeInfo=()=>{
        props.dispatch({
            type:'Watert/fenye',
            payload:{waterAddress,name,remark,pageSize}
        });
    };
    useEffect(() => {
        getWater();
    }, [page,pageSize]);
    useEffect(() => {
        let uq=StaticInfo.uqx.split('');
        setUqx(uq);
        getFenyeInfo();
    }, []);
    const changeWaterAddress=(e)=>{
        setwaterAddress(e.target.value);
        sessionStorage.setItem('waterCableManageWaterAddress',e.target.value);
    };
    const changeName=(e)=>{
        setName(e.target.value);
        sessionStorage.setItem('waterCableManageWaterName',e.target.value);
    };
    const changeRemark=(e)=>{
        setremark(e.target.value);
        sessionStorage.setItem('waterCableManageWaterRemark',e.target.value);
    };
    return(
        <Spin spinning={isSpinning}>
            <List>
                <List.Item>
                    <div>
                        {uqx[250]=='1'?<Button type="primary" onClick={toadd}>添加水表</Button>:''}
                    </div>
                    <Space>
                        <Input
                            onChange={changeWaterAddress}
                            addonBefore="水表地址:"
                            value={waterAddress}
                        />
                        <Input
                            onChange={changeName}
                            addonBefore="租户姓名:"
                            value={name}
                        />
                        <Input
                            onChange={changeRemark}
                            addonBefore="水表备注:"
                            value={remark}
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
                dataSource={props.WatertList}
                summary={(columns) => (
                    <Table.Summary fixed>
                        <Table.Summary.Row>
                            <Table.Summary.Cell index={1}>统计</Table.Summary.Cell>
                            <Table.Summary.Cell index={2}></Table.Summary.Cell>
                            <Table.Summary.Cell index={3}></Table.Summary.Cell>
                            <Table.Summary.Cell index={4}></Table.Summary.Cell>
                            <Table.Summary.Cell index={5}></Table.Summary.Cell>
                            <Table.Summary.Cell index={6}></Table.Summary.Cell>
                            <Table.Summary.Cell index={7}></Table.Summary.Cell>
                            <Table.Summary.Cell index={8}></Table.Summary.Cell>
                            <Table.Summary.Cell index={0}></Table.Summary.Cell>
                            <Table.Summary.Cell index={9}>{props.count?props.count.waterNumSum:''}m³</Table.Summary.Cell>
                            <Table.Summary.Cell index={10}>{props.count?props.count.total_used_amount:''}m³</Table.Summary.Cell>

                        </Table.Summary.Row>
                    </Table.Summary>
                )}
            />
            {props.count?<Pagination total={props.count.count} showSizeChanger pageSize={pageSize} current={page}  onChange={onChange} pageSizeOptions={[50,100,500,1000,10000]}/>:''}
            <Modal onOk={onOk} onCancel={()=>setOpne(false)} title='删除' open={open}>
                <div>确定删除吗?</div>
            </Modal>
        </Spin>
    )
}
const mapStateToProps = (state: any) => {
    return {
        WatertList: state.Watert.list,
        count: state.Watert.count,
    }
};
export default  connect(mapStateToProps)(Water)