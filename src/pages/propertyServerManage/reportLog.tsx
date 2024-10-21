import {Button, Input, List, Pagination, Space, Spin, Table, Tag} from "antd";
import {useEffect, useState} from "react";
import {connect} from "umi";
import dayjs from "dayjs";

const ReportLog=(props:any)=>{
    const [loading, setLoading] = useState(false);
    const [page,setPage]=useState(1);
    const columns=[
        {
            title: '日期',
            dataIndex: 'created',
            render: (_: any, record: any) => (
                <div>
                    {dayjs(_).format('YYYY-MM-DD HH:mm:ss')}
                </div>
            ),
        },
        {
            title: '报修租户',
            dataIndex: 'tenant_name',
        },
        {
            title: '联系电话',
            dataIndex: 'tenant_phone',
        },
        {
            title: '跟进人',
            dataIndex: 'userName',
            render:(_:any,record:any)=>(
                <div>
                    {record.userName?<Tag color='green'>{record.userName}</Tag>:<Tag color='red'>未分配跟进人</Tag>}
                </div>
            )
        },
        {
            title: '报修内容',
            dataIndex: 'repair_content',
            render: (_: any, record: any) => (
                <Input.TextArea value={_}/>
            ),
        },
        {
            title: '操作',
            dataIndex: 'operation',
            render: (_: any, record: any) => (
                <Space>
                    <Button type='link'>分配跟进人</Button>
                </Space>
            ),
        },
    ];
    useEffect(() => {
        console.log(props)
    }, []);
    const onChange=(e:number)=>{
        setPage(e);
    };
    return(
        <Spin spinning={loading}>
            <List>
                <List.Item>

                </List.Item>
            </List>
            <Table
                columns={columns}
                rowKey={(columns) => columns.id}
                pagination={false}
                dataSource={props.ReportList}
                rowClassName={(record, index) =>
                    index % 2 === 1 ? 'tbodd' : 'tbeven'
                }
            />
            {props.count?<Pagination total={props.count.count} pageSize={50} current={page}  onChange={onChange} pageSizeOptions={[50]}/>:''}
        </Spin>
    )
}
const mapStateToProps = (state: any) => {
    return {
        ReportList: state.Report.list,
        count: state.Report.count
    }
};
export default connect(mapStateToProps) (ReportLog)