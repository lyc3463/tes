import {Button, Input, InputNumber, List, Pagination, Space, Table, Tag} from "antd";
import {history,connect} from "umi";
import {useEffect, useState} from "react";

const Unit=(props:any)=>{
    const [page,setPage]=useState(1);
    const [name,setName]=useState('');
    const [beginRents,setBeginRents]=useState(0);
    const [endRents,setEndRents]=useState(9999999999);

    const columns =[
        // {
        //     title: 'ID',
        //     dataIndex: 'id',
        //     key: 'id',
        //     render: (text:any, record:any) => {
        //         return(
        //            <Button type='link' onClick={()=>toedit(record.id)}>{text}</Button>
        //         )
        //     }
        // },
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
            title: '单价',
            dataIndex: 'price',
            key: 'price',
            render: (_:any, record:any) => {
                return(
                    <span>{record.price}㎡/元</span>
                )
            }
        },
        {
            title: '租金',
            dataIndex: 'rent',
            key: 'rent',
            render: (_:any, record:any) => {
                return(
                    <span>{record.rent}元</span>
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
            title: '可增面积㎡',
            dataIndex: 'add_area',
            key: 'add_area',
            render: (_:any, record:any) => {
                return(
                    <span>{record.add_area}㎡</span>
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
                if (text === 1) {
                    statusText = <Tag color="green">已租</Tag>; // 假设使用Ant Design的Tag组件来显示状态
                } else if (text === 2) {
                    statusText = <Tag color="blue">未租</Tag>;
                } else if (text === 3) {
                    statusText = <Tag color="red">退租</Tag>;
                } else {
                    // 处理未知状态，或显示原始文本
                    statusText = <span>{text}</span>;
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
                        <Button type='primary' onClick={()=>toedit(record.id)}>编辑</Button>
                        <Button type='primary' danger>删除</Button>
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
    // 分页
    const logFenye=()=>{
        props.dispatch({
            type:"Unit/fetch",
            payload:{page,name,beginRents,endRents}
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
            payload:{name,beginRents,endRents}
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
            setEndRents(999999);
        }
    };
    return(
        <div>
            <List>
                <List.Item>
                    <div>
                        <Button type="primary" onClick={toadd}>
                            新增单元
                        </Button>
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
        </div>
    )
}
const mapStateToProps = (state: any) => {
    return {
        UnitList: state.Unit.list,
        count: state.Unit.count
    }
};
export default connect(mapStateToProps) (Unit)