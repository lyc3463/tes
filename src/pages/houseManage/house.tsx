import {Button, Input, List, Select, Space, Table} from "antd";
import {history,connect} from "umi";
import {useEffect} from "react";

const House=(props:any)=>{

    const columns =[
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            render: (_:any, record:any) => {
                return(
                    <Button type='link' onClick={()=>toedit(record.id)}>{_}</Button>
                )
            }
        },
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
                        <Button type='primary'>编辑</Button>
                        <Button type='primary' danger>删除</Button>
                    </Space>
                )
            }
        },
    ]
    const toadd=()=>{
        history.push('/houseManage/addHouse')
    }
    const toedit=(e:number)=>{
        history.push(`/houseManage/editHouse?id=${e}`)
    }
    return(
        <div>
            <List>
                <List.Item>
                    <div>
                        <Button type="primary" onClick={toadd}>
                            新增房屋
                        </Button>
                    </div>
                    <Space>
                        <Input
                            addonBefore="房屋名称:"
                        />
                        <Button type="primary">
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
        </div>
    )
}
const mapStateToProps = (state: any) => {
    return {
        HouseList: state.House.list
    }
};
export default connect(mapStateToProps) (House)