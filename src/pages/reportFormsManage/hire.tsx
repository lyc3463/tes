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
            title: '单元数量(间)',
            dataIndex: 'unitCount',
            key: 'unitCount',

        },
        {
            title: '已租面积㎡',
            dataIndex: 'rentable_areaSum',
            key: 'rentable_areaSum',

        },
        {
            title: '已租租金',
            dataIndex: 'priceSum',
            key: 'priceSum',
            render: (_:any, record:any) => {
                return(
                    <span>{record.priceSum}元</span>
                )
            }
        },
        {
            title: '租户数量(个)',
            dataIndex: 'tenantCount',
            key: 'tenantCount',
        },
        {
            title: '平均单价',
            dataIndex: 'xx',
            key: 'xx',
            render: (_:any, record:any) => {
                let a=record.priceSum;
                let b=record.rentable_areaSum;
                let sum = (b !== 0) ? (a / b) : 0;
                return(
                    <div>
                        {sum.toFixed(2)}元
                    </div>

                )
            }
        },
        {
            title: '出租率',
            dataIndex: 'qq',
            key: 'qq',
            render: (_:any, record:any) => {
                return(
                    <span>{((record.rentable_areaSum/record.rentable_area)*100).toFixed(2)}%</span>
                )
            }
        },
        {
            title: '使用率',
            dataIndex: 'usageRate',
            key: 'usageRate',
            render: (_:any, record:any) => {
                return(
                    <span>{((record.rentable_area/record.floor_area)*100).toFixed(2)}%</span>
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