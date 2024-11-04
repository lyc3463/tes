import {Button, Form, Input, List, message, Modal, Pagination, Space, Table, Tag} from "antd";
import {connect,history} from 'umi'
import {getRandomNumber} from "@/utils/OpenTool";
import {useEffect, useState} from "react";
const Water=(props:any)=>{
    let mathNumber=getRandomNumber(1,10);
    const [page,setPage]=useState(1);
    const [uid,setUid]=useState(0);
    const [open,setOpne]=useState(false);
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
            title: '通讯地址',
            dataIndex: 'address',
            key: 'address',
        },
        {
            title: '水表类型',
            dataIndex: 'water_type',
            key: 'water_type',
            render:(_:any,record:any)=>{
                return(
                    <>
                        <Tag color='green'>无线普通预付费水表</Tag>
                    </>
                )
            }
        },
        {
            title: '备注',
            dataIndex: 'remark',
            key: 'remark',
        },
        {
            title: '状态',
            dataIndex: 'relay_state',
            key: 'relay_state',
            render:(_:any,record:any)=>{
                return(
                    <>
                        {record.relay_state==0?<Tag color='red'>未连接</Tag>:<Tag color='green'>已连接</Tag>}
                    </>
                )
            }
        },
        {
            title: '积累用水量',
            dataIndex: 'total_used_amount',
            key: 'total_used_amount',
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
                            <Button type='link' onClick={()=>tojiben(record)}>基本业务</Button>
                            <Button type='link' onClick={()=>isdelete(record)}>删除</Button>
                        </Space>
                    </>
                )
            }
        }
    ];
    const toadd=()=>{
        history.push('/waterCableManage/addWater')
    };
    const onChange=(e)=>{
      setPage(e);
    };
    useEffect(() => {
        console.log(props)
    }, []);
    const tojiben=(e)=>{
      history.push(`/waterCableManage/waterjiben?id=${e.id}`)
    };
    const isdelete=(e)=>{
        setUid(e.id);
        setOpne(true);
    };
    const onOk=()=>{
      props.dispatch({
          type:'Watert/remove',
          payload:uid
      }).then((res:any)=>{
          if (res.ErrorCode==0){
              message.success('删除成功');
              setOpne(false)
          }else {
              message.error(res.Data)
          }
      })
    };
    return(
        <div>
            <List>
                <List.Item>
                    <div>
                        <Button type="primary" onClick={toadd}>
                            添加水表
                        </Button>
                    </div>
                    {/*<Space>*/}
                    {/*    <Input*/}
                    {/*        onChange={changeName}*/}
                    {/*        addonBefore="采集器:"*/}
                    {/*    />*/}
                    {/*    <Button type="primary" onClick={sousuo}>*/}
                    {/*        搜索*/}
                    {/*    </Button>*/}
                    {/*</Space>*/}
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
            />
            {props.count?<Pagination total={props.count.count} pageSize={50} current={page}  onChange={onChange} pageSizeOptions={[50]}/>:''}
            <Modal onOk={onOk} onCancel={()=>setOpne(false)} title='删除' open={open}>
                <div>确定删除吗?</div>
            </Modal>
        </div>
    )
}
const mapStateToProps = (state: any) => {
    return {
        WatertList: state.Watert.list,
        count: state.Watert.count,
    }
};
export default  connect(mapStateToProps)(Water)