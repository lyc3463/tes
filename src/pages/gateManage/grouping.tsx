import {connect,history} from "umi";
import {Button, Input, List, Space, Table} from "antd";

const Grouping=(props)=>{
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            render: (text: any, record: any) => (
                <Button type="link">{text}</Button>
            ),
        },
        {
            title: '分组名称',
            dataIndex: 'deviceSn',
        },
        {
            title: '操作',//简单常用操作放这里，复杂放详情
            dataIndex: 'operation',
        },
    ];
    const toadd=()=>{
        history.push('/gateManage/addGrouping')
    }
    return(
        <div>
            <List>
                <List.Item>
                    <div>
                        <Button type="primary" onClick={toadd}>
                            新增下发分组
                        </Button>
                    </div>
                    <Space>
                        <Input
                            addonBefore="分组名称:"
                        />
                        <Button type="primary" >
                            搜索
                        </Button>
                    </Space>
                </List.Item>
            </List>
            <Table
                columns={columns}
                rowKey={(columns) => columns.id}
                pagination={false}
                dataSource={props.GroupingList}
                rowClassName={(record, index) =>
                    index % 2 === 1 ? 'tbodd' : 'tbeven'
                }
            />
        </div>
    )
}
const mapStateToProps = (state: any) => {
    return {
        GroupingList: state.Grouping.list
    }
};
export default connect(mapStateToProps) (Grouping)