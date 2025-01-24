import {Button, Input, InputNumber, List, message, Modal, Select, Space, Spin, Table} from "antd";
import {history,connect} from "umi";
import {useEffect, useState} from "react";
import HonuseType from '@/ModelTypes/TypeHouse'
const House=(props:any)=>{
    const [name,setName]=useState('');
    const [beginRents,setBeginRents]=useState(0);
    const [endRents,setEndRents]=useState(9999999999);
    const [open,setOpne]=useState(false);
    const [uid,setUid]=useState(0);
    const [uname,setUname]=useState('');
    const [spinning,setspinning]=useState(false);
    const columns =[
        {
            title: '房屋名称',
            dataIndex: 'house_name',
            key: 'house_name',
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
            title: '总租金',
            dataIndex: 'rents',
            key: 'rents',
            render: (_:any, record:any) => {
                return(
                    <span>{record.rents}元</span>
                )
            }
        },
        {
            title: '单价',
            dataIndex: 'price',
            key: 'price',
            render: (_:any, record:any) => {
                return(
                    <span>{record.price}元</span>
                )
            }
        },
        {
            title: '详细地址',
            dataIndex: 'address',
            key: 'address',
        },
        {
            title: '总楼层',
            dataIndex: 'floors',
            key: 'floors',
            render: (_:any, record:any) => {
                return(
                  <span>{record.floors}层</span>
                )
            }
        },
        {
            title: '剩余可增加面积㎡',
            dataIndex: 'residue_add_area',
            key: 'residue_add_area',
            render: (_:any, record:any) => {
                return(
                    <span>{record.residue_add_area}㎡</span>
                )
            }
        },
        {
            title: '操作',
            dataIndex: 'caozuo',
            key: 'caozuo',
            fixed: 'right',
            render: (text:any, record:any) => {
                return(
                    <Space>
                        <Button type='primary' onClick={()=>toedit(record.id)}>编辑</Button>
                        <Button type='primary' danger onClick={()=>deleteOpen(record)}>删除</Button>
                    </Space>
                )
            }
        },
    ];
    // 监听最小租金,
    const changeBeginRents=(e)=>{
        if (e){
            setBeginRents(e);
        }else {
            setBeginRents(0);
        }
    };
    // 监听最大租金
    const changeEndRents=(e)=>{
        if (e<beginRents){
            setEndRents(beginRents);
        }else if(e>0){
            setEndRents(e);
        }else {
            setEndRents(9999999999);
        }
    };
    const toadd=()=>{
        history.push('/houseManage/addHouse')
    };
    const toedit=(e:number)=>{
        history.push(`/houseManage/editHouse?id=${e}`)
    };
    useEffect(() => {
        getList();
    }, []);
    const getList=()=>{
        props.dispatch({
            type:'House/fetch',
            payload:{name,beginRents,endRents}
        })
    };
    const changeName=(e:any)=>{
        setName(e.target.value)
    };
    const sousuo=()=>{
        getList();
    };
    const deleteOpen=(e:HonuseType)=>{
        setOpne(true);
        setUid(e.id);
        setUname(e.house_name);
    };
    const onOK=()=>{
        setspinning(true);
        props.dispatch({
            type:'House/remove',
            payload:uid
        }).then((res:any)=>{
            if (res.ErrorCode==0){
                setspinning(false);
                message.success('删除成功');
                setOpne(false);
            }else {
                message.error(res.Data);
                setspinning(false);
            }
        })
    };
    return(
        <Spin spinning={spinning}>
            <List>
                <List.Item>
                    <div>
                        <Button type="primary" onClick={toadd}>
                            新增房屋
                        </Button>
                    </div>
                    <Space>
                        <Input
                            onChange={changeName}
                            addonBefore="房屋名称:"
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
                        <Button type="primary" onClick={sousuo}>
                            搜索
                        </Button>
                    </Space>
                </List.Item>
            </List>
            <Table
                columns={columns}
                rowKey={(columns) => columns.id}
                size='small'
                style={{border:'1px solid #ddd',borderRadius:'4px'}}
                dataSource={props.HouseList}
                pagination={false}
            />
            <Modal onOk={onOK} title='删除' onCancel={()=>setOpne(false)} open={open} loading={spinning}>
                <div>
                   <span>是否要删除:</span><span style={{color:'red'}}>{uname}</span>
                </div>
            </Modal>
        </Spin>
    )
}
const mapStateToProps = (state: any) => {
    return {
        HouseList: state.House.list
    }
};
export default connect(mapStateToProps) (House)