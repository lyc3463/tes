import {useEffect, useState} from "react";
import {connect} from "umi";
import {Button, DatePicker, Input, InputNumber, List, Pagination, Space, Table, Tag} from "antd";

const Hire=(props:any)=>{
    const [page,setPage]=useState(1);
    const [phone,setPhone]=useState('');
    const [name,setName]=useState('');
    const [beginRents,setBeginRents]=useState(0);
    const [endRents,setEndRents]=useState(9999999999);
    const [stutes,setstutes]=useState(0);
    const [house_id,sethouse_id]=useState(0);
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
                if (text === 2) {
                    statusText = <Tag color="green">已租</Tag>; // 假设使用Ant Design的Tag组件来显示状态
                } else if (text === 1) {
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
    ];
    useEffect(() => {
        logFenye();
        console.log(props)
    }, [page]);
    // 分页
    const logFenye=()=>{
        props.dispatch({
            type:"Hire/fetch",
            payload:{page,name,phone,beginRents,endRents,stutes,house_id}
        })
    };
    // 搜索按钮
    const shousuo=()=>{
        setPage(1);
        props.dispatch({
            type:'Hire/fenye',
            payload:{name,phone,beginRents,endRents,stutes,house_id}
        });
        logFenye()
    };
    const onChange=(val:number)=>{
        setPage(val)
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
                    <Space>
                        <Input
                            addonBefore="单元编号:"
                            onChange={(e)=>setName(e.target.value)}
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
                        <Button type="primary" onClick={shousuo}>
                            搜索
                        </Button>
                    </Space>
                </List.Item>
            </List>
            <Table
                style={{border:'1px solid #ddd',borderRadius:'4px'}}
                columns={columns}
                size='small'
                rowKey={(columns) => columns.id}
                dataSource={props.HireList}
                scroll={{x:1500}}
                pagination={false}
            />
            {props.count?<Pagination total={props.count.count} pageSize={50} current={page}  onChange={onChange} pageSizeOptions={[50]}/>:''}
        </div>
    )
}
const mapStateToProps = (state: any) => {
    return {
        HireList: state.Hire.list,
        count: state.Hire.count,
    }
};
export default connect(mapStateToProps) (Hire)