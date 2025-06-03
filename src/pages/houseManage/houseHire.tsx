import {Button, Input, InputNumber, List, message, Pagination, Select, Space, Table, Tag} from "antd";
import {connect} from "umi";
import {useEffect, useState} from "react";
import {checkSessionStorage, updateSessionStorage} from "@/utils/OpenTool";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";

const HouseHire=(props)=>{
    const [page,setPage]=useState(1);
    const [pageSize,setPageSize]=useState(50);
    const [name,setName]=useState(checkSessionStorage('/houseManage/houseHire/','name')||'');
    const [beginRents,setBeginRents]=useState(0);
    const [endRents,setEndRents]=useState(9999999999);
    const [status,setstatus]=useState(2);
    const [house_id,sethouse_id]=useState(checkSessionStorage('/houseManage/houseHire/','house_id')||0);
    const [hounsList,sethounsList]=useState([]);
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
                if (text === 1) {
                    statusText = <Tag color="blue">未租</Tag>; // 假设使用Ant Design的Tag组件来显示状态
                } else if (text === 2) {
                    statusText = <Tag color="green">已租</Tag>;
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
    // 分页
    const logFenye=()=>{
        props.dispatch({
            type:"Unit/fetch",
            payload:{page,name,beginRents,endRents,status,house_id,pageSize}
        })
    };
    // 监听页数
    const onChange=(page,pageSize)=>{
        setPage(page);
        setPageSize(pageSize);
    };
    useEffect(() => {
        logFenye();
    }, [page,pageSize]);
    const changeName=(e:any)=>{
        setName(e.target.value);
        updateSessionStorage('/houseManage/houseHire/','name',e.target.value);
    };
    const sousuo=()=>{
        setPage(1);
        logFenye();
        getFenyeInfo();
    };
    const getFenyeInfo=()=>{
        props.dispatch({
            type:"Unit/fetchFenye",
            payload:{name,beginRents,endRents,status,house_id,pageSize}
        })
    };
    const getList=()=>{
        props.dispatch({
            type:'House/fetch',
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                sethounsList(res.Data);
            }else {
                message.error(res.Data);
            }
        })
    };
    const changeHouse=(e)=>{
        sethouse_id(e);
        updateSessionStorage('/houseManage/houseHire/','house_id',e);
    };
    useEffect(() => {
        getFenyeInfo();
        getList();
    }, []);
    return(
        <div>
            <List>
                <List.Item>
                    <Space>
                        <Input
                            onChange={changeName}
                            addonBefore="单元名称:"
                            value={name}
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
                                所属房屋:
                            </div>
                            <Select
                                value={house_id}
                                onChange={changeHouse}
                                showSearch
                                style={{ width: 150 }}
                                optionFilterProp="children"
                                filterOption={(input, option) => {
                                    // 假设每个 option 都有一个与数据项对应的 value 属性
                                    const item = hounsList.find(unit => unit.id == option.value); // 您可能需要优化这个查找过程
                                    return item?.house_name?.toLowerCase().includes(input.toLowerCase());
                                }}
                            >
                                <Select.Option value={0} key={0}>
                                    全部
                                </Select.Option>
                                {hounsList.map((item:any,index:any)=>{
                                    return(
                                        <Select.Option value={item.id} key={item.id}>
                                            {item.house_name}
                                        </Select.Option>
                                    )
                                })}
                            </Select>
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
                scroll={{y:'60vh'}}
                style={{border:'1px solid #ddd',borderRadius:'4px'}}
                // summary={(columns) => (
                //     <Table.Summary fixed>
                //         <Table.Summary.Row>
                //             <Table.Summary.Cell
                //                 index={1}
                //             >
                //                 统计
                //             </Table.Summary.Cell>
                //             <Table.Summary.Cell index={0}>
                //             </Table.Summary.Cell>
                //             <Table.Summary.Cell index={0}>
                //             </Table.Summary.Cell>
                //             <Table.Summary.Cell index={0}>
                //             </Table.Summary.Cell>
                //             <Table.Summary.Cell index={0}>
                //             </Table.Summary.Cell>
                //             <Table.Summary.Cell index={0}>
                //             </Table.Summary.Cell>
                //             <Table.Summary.Cell index={0}>
                //             </Table.Summary.Cell>
                //             <Table.Summary.Cell
                //                 index={7}
                //             >
                //                 {props.count?props.count.rentSum:''}元
                //             </Table.Summary.Cell>
                //         </Table.Summary.Row>
                //     </Table.Summary>
                // )}
            />
            {props.count?<Pagination total={props.count.count} showSizeChanger pageSize={pageSize} current={page}  onChange={onChange} pageSizeOptions={[50,100,500,1000,10000]}/>:''}
        </div>
    )
}
const mapStateToProps = (state: any) => {
    return {
        UnitList: state.Unit.list,
        count: state.Unit.count
    }
};
export default connect(mapStateToProps) (HouseHire)