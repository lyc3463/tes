import {Button, Input, InputNumber, List, message, Modal, Pagination, Select, Space, Spin, Table, Tag} from "antd";
import {history,connect} from "umi";
import {useEffect, useState} from "react";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import {StaticInfo} from "@/StaticInfo";

const Unit=(props:any)=>{
    const [page,setPage]=useState(1);
    const [name,setName]=useState('');
    const [beginRents,setBeginRents]=useState(0);
    const [endRents,setEndRents]=useState(999999999);
    const [status,setstatus]=useState(0);
    const [house_id,sethouse_id]=useState(0);
    const [uid,setUid]=useState(0);
    const [open,setOpen]=useState(false);
    const [spinning,setspinning]=useState(false);
    // 用户权限
    const [uqx,setUqx]=useState([]);
    const columns =[
        {
            title: '所属房屋',
            dataIndex: 'house_name',
            key: 'house_name',
        },
        {
            title: '单元名称',
            dataIndex: 'unit_name',
            key: 'unit_name',
        },
        {
            title: '建筑面积㎡',
            dataIndex: 'floor_area',
            key: 'floor_area',
            render: (_:any, record:any) => {
                return(
                    <span>{record.floor_area}㎡</span>
                )
            }
        },
        {
            title: '可租面积㎡',
            dataIndex: 'rentable_area',
            key: 'rentable_area',
            render: (_:any, record:any) => {
                return(
                    <span>{record.rentable_area}㎡</span>
                )
            }
        },
        {
            title: '所属楼层',
            dataIndex: 'floor',
            key: 'floor',
            render: (_:any, record:any) => {
                return(
                    <span>{record.floor}层</span>
                )
            }
        },
        {
            title: '每平方单价',
            dataIndex: 'rent',
            key: 'rent',
            render: (_:any, record:any) => {
                return(
                    <span>{record.rent}㎡/元</span>
                )
            }
        },
        {
            title: '租金',
            dataIndex: 'price',
            key: 'price',
            render: (_:any, record:any) => {
                return(
                    <span>{record.price}元</span>
                )
            }
        },
        {
            title: '单元类型',
            dataIndex: 'unit_type',
            key: 'unit_type',
            render: (text:any, record:any) => {
                return(
                    <div>
                        {record.unit_type==1?<Tag color="lime">商业</Tag>:<Tag color="gold">办公</Tag>}
                    </div>
                )
            }
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            fixed: 'right',
            width: 100,
            render: (text:any, record:any) => {
                let statusText;
                if (text === 2) {
                    statusText = <Tag color="green">已租</Tag>; // 假设使用Ant Design的Tag组件来显示状态
                } else if (text === 1) {
                    statusText = <Tag color="blue">未租</Tag>;
                } else if (text === 3) {
                    statusText = <Tag color="red">退租</Tag>;
                } else {
                    // 处理未知状态，或显示原始文本
                    statusText = <span>未知状态</span>;
                }
                return(
                    <div>
                        {statusText}
                    </div>
                )
            }
        },
        {
            title: '操作',
            dataIndex: 'cao',
            key: 'cao',
            fixed: 'right',
            render: (text:any, record:any) => {
                return(
                    <Space>
                        {uqx[248]=='1'?<Button type='primary' onClick={()=>toedit(record.id)}>编辑</Button> :''}
                        {uqx[249]=='1'?<Button type='primary' danger onClick={()=>isdelete(record.id)}>删除</Button>:''}
                    </Space>
                )
            }
        },
    ];
    const toadd=()=>{
        history.push('/houseManage/addUnit')
    };
    const toedit=(e:number)=>{
        history.push(`/houseManage/editUnit?id=${e}`)
    };
    const isdelete=(e)=>{
      setUid(e);
      setOpen(true);
    };
    // 分页
    const logFenye=()=>{
        props.dispatch({
            type:"Unit/fetch",
            payload:{page,name,beginRents,endRents,status,house_id}
        })
    };
    // 监听页数
    const onChange=(page)=>{
        setPage(page);
        logFenye();
    };
    useEffect(() => {
        logFenye();
    }, [page]);

    const changeName=(e:any)=>{
        setName(e.target.value)
    };
    const sousuo=()=>{
        setPage(1);
        props.dispatch({
            type:"Unit/fetchFenye",
            payload:{name,beginRents,endRents,status,house_id}
        })
        logFenye();
    };
    const changeBeginRents=(e)=>{
        if (e){
            setBeginRents(e);
        }else {
            setBeginRents(0);
        }
    };
    const changeEndRents=(e)=>{
        if (e<beginRents){
            setEndRents(beginRents);
        }else if(e>0){
            setEndRents(e);
        }else {
            setEndRents(999999999);
        }
    };
    const onOK=()=>{
      setspinning(true);
      props.dispatch({
          type:'Unit/remove',
          payload:uid
      }).then((res:TypeErrorCode)=>{
          if (res.ErrorCode==0){
              message.success('删除成功');
              setspinning(false);
              setOpen(false);
          }else {
              message.error(res.Data);
              setspinning(false);
              setOpen(false);
          }
      })
    };
    const changestatus=(e)=>{
        setstatus(e);
    };
    useEffect(() => {
        let uq=StaticInfo.uqx.split('');
        setUqx(uq);
    }, []);
    return(
        <Spin spinning={spinning}>
            <List>
                <List.Item>
                    <div>
                        {uqx[247]=='1'?<Button type="primary" onClick={toadd}>新增单元</Button> :''}
                    </div>
                    <Space>
                        <Input
                            onChange={changeName}
                            addonBefore="单元名称:"
                        />
                        <InputNumber
                            min={0}
                            onChange={changeBeginRents}
                            addonBefore="最小租金:"
                        />
                        <InputNumber min={beginRents}
                            onChange={changeEndRents}
                            addonBefore="最大租金:"
                        />
                        <Space.Compact>
                            <div
                                style={{
                                    borderRadius: '6px',
                                    borderStartEndRadius: 0,
                                    borderEndEndRadius: 0,
                                    padding: '0 11px',
                                    border: '1px solid #d9d9d9',
                                    display: 'flex',
                                    alignItems: 'center',
                                    borderInlineEnd: 0,
                                }}
                            >
                                出租状态:
                            </div>
                            <Select
                                onChange={changestatus}
                                defaultValue={status}
                                style={{ width: 120 }}
                                options={[
                                    { value: 2, label: '已租' },
                                    { value: 1, label: '未租' },
                                    { value: 0, label: '全部' },
                                ]}
                            />
                        </Space.Compact>
                        <Button type="primary" onClick={sousuo}>
                            搜索
                        </Button>
                    </Space>
                </List.Item>
            </List>
            <Table
                columns={columns}
                rowKey={(columns) => columns.id}
                dataSource={props.UnitList}
                pagination={false}
                size='small'
                style={{border:'1px solid #ddd',borderRadius:'4px'}}
            />
            {props.count?<Pagination total={props.count.count} pageSize={50} current={page}  onChange={onChange} pageSizeOptions={[50]}/>:''}
            <Modal open={open} onCancel={()=>setOpen(false)} onOk={onOK} title='删除单元' loading={spinning}>
                <div>
                    是否要删除？
                </div>
            </Modal>
        </Spin>
    )
}
const mapStateToProps = (state: any) => {
    return {
        UnitList: state.Unit.list,
        count: state.Unit.count
    }
};
export default connect(mapStateToProps) (Unit)