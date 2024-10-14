import {Button, List, Pagination, Space, Spin, Table} from "antd";
import {useEffect, useState} from "react";
import {connect} from "umi";

const ReportLog=(props:any)=>{
    const [loading, setLoading] = useState(false);
    const [page,setPage]=useState(1);
    const columns=[
        {
            title: 'ID',
            dataIndex: 'roomId',
            render: (text: any, record: any) => (
                <Button type="link" >{text}</Button>
            ),
        },
        {
            title: '日期',
            dataIndex: 'date',
        },
        {
            title: '报修租户',
            dataIndex: 'name',
        },
        {
            title: '报修内容',
            dataIndex: 'content',
        },
        {
            title: '操作',
            dataIndex: 'operation',
            render: (_: any, record: any) => (
                <Space>
                    <Button type='link'>已完成</Button>
                    <Button type='link'>详情</Button>
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