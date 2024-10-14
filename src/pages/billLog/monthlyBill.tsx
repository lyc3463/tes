import {Button, Input, List, Space, Table} from "antd";
import {connect} from "umi";
import {useEffect} from "react";

const MonthlyBill=(props:any)=>{
    const columns =[
        {
            title: '日期',
            dataIndex: 'data',
            key: 'data',
        },
        {
            title: '交租日期',
            dataIndex: 'jiaozuData',
            key: 'jiaozuData',
        },
        {
            title: '姓名',
            dataIndex: 'fuzeren',
            key: 'fuzeren',
        },
        {
            title: '类型',
            dataIndex: 'type',
            key: 'type',
        },
        {
            title: '缴费金额(元)',
            dataIndex: 'zujin',
            key: 'zujin',
        },
        {
            title: '违约金(元)',
            dataIndex: 'zujin',
            key: 'zujin',
        },
        {
            title: '已交金额(元)',
            dataIndex: 'zujin',
            key: 'zujin',
        },
        {
            title: '操作',
            dataIndex: '',
            key: '',
            render:(text:any)=>{
                return(
                    <div>
                        <a style={{marginRight:'10px'}}>详情</a>
                    </div>
                )
            }
        },
    ];
    useEffect(() => {
        console.log(props)
    }, []);
    return(
        <div>
            <List>
                <List.Item>
                    <div>
                        <Button type="primary">
                            创建电表参数
                        </Button>
                    </div>
                    <Space>
                        <Input
                            addonBefore="电表参数名称:"
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
                pagination={false}
                rowClassName={(record, index) =>
                    index % 2 === 1 ? 'tbodd' : 'tbeven'
                }
            />
        </div>
    )
}
const mapStateToProps = (state: any) => {
    return {
        MonthlyBillList: state.MonthlyBill.list
    }
};
export default connect(mapStateToProps) (MonthlyBill)