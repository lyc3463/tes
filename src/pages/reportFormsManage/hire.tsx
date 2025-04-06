import {useEffect, useState} from "react";
import {connect} from "umi";
import {Button, DatePicker, Input, InputNumber, List, Pagination, Space, Table, Tag} from "antd";

const Hire=(props:any)=>{
    const [name,setName]=useState('');
    const [beginRents,setBeginRents]=useState(0);
    const [endRents,setEndRents]=useState(9999999999);

    const columns =[
        {
            title: '房屋名称',
            dataIndex: 'house_name',
            key: 'house_name',
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
            title: '已租面积㎡',
            dataIndex: 'll',
            key: 'll',
            render: (_:any, record:any) => {
                return(
                    <span>{record.rentable_area-record.residue_add_area}㎡</span>
                )
            }
        },
        {
            title: '平均租金',
            dataIndex: 'rents',
            key: 'rents',
            render: (_:any, record:any) => {
                return(
                    <span>{record.rents}元</span>
                )
            }
        },
        {
            title: '平均单价',
            dataIndex: 'price',
            key: 'price',
            render: (_:any, record:any) => {
                return(
                    <span>{record.price}元</span>
                )
            }
        },
        {
            title: '出租率',
            dataIndex: 'rentalRate',
            key: 'rentalRate',
            render: (_:any, record:any) => {
                return(
                    <span>{(record.rentalRate*100).toFixed(2)}%</span>
                )
            }
        },
        {
            title: '使用率',
            dataIndex: 'usageRate',
            key: 'usageRate',
            render: (_:any, record:any) => {
                return(
                    <span>{(record.usageRate*100).toFixed(2)}%</span>
                )
            }
        },

    ];
    useEffect(() => {
        logFenye();
    }, []);
    // 分页
    const logFenye=()=>{
        props.dispatch({
            type:"Hire/fetch",
            payload:{name,beginRents,endRents}
        })
    };
    // 搜索按钮
    const shousuo=()=>{
        logFenye()
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
                        {/*<Input*/}
                        {/*    addonBefore="房屋名称:"*/}
                        {/*    onChange={(e)=>setName(e.target.value)}*/}
                        {/*/>*/}
                        {/*<InputNumber*/}
                        {/*    min={0}*/}
                        {/*    onChange={changeBeginRents}*/}
                        {/*    addonBefore="最小租金:"*/}
                        {/*/>*/}
                        {/*<InputNumber min={beginRents}*/}
                        {/*             onChange={changeEndRents}*/}
                        {/*             addonBefore="最大租金:"*/}
                        {/*/>*/}
                        {/*<Button type="primary" onClick={shousuo}>*/}
                        {/*    搜索*/}
                        {/*</Button>*/}
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
        </div>
    )
}
const mapStateToProps = (state: any) => {
    return {
        HireList: state.Hire.list,
    }
};
export default connect(mapStateToProps) (Hire)