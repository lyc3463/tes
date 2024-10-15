import {Button, Input, List, Select, Space, Spin, Table, Tag} from "antd";
import {useEffect, useState} from "react";
import {connect} from "umi";
import dayjs from "dayjs";

const Complaint=(props:any)=>{
    const [loading, setLoading] = useState(false);
    const columns=[

        {
            title: '日期',
            dataIndex: 'created',
            render: (_: any, record: any) => (
                <div>
                    {dayjs(record.created).format("YYYY-MM-DD")}
                </div>

            ),
        },
        {
            title: '租户名称',
            dataIndex: 'tenant_name',
        },
        {
            title: '租户手机号',
            dataIndex: 'tenant_phone',
        },
        {
            title: '投诉内容',
            dataIndex: 'complaint_content',
        },
        {
            title: '状态',
            dataIndex: 'complaintStatus',
            render: (_: any, record: any) => (
                <Space>
                    {
                        record.complaintStatus==0?<Tag color='red'>未处理</Tag>:<Tag color='green'>已处理</Tag>
                    }
                </Space>

            ),
        },
        {
            title: '操作',//简单常用操作放这里，复杂放详情
            dataIndex: 'operation',
            render: (_: any, record: any) => (
                <Space>
                    <Button type='link' onClick={()=>isOK(record.id)}>处理完成</Button>
                </Space>

            ),
        },
    ];
    const isOK=(e:number)=>{

    };
    useEffect(() => {
        console.log(props)
    }, []);
    return(
        <div>
            <Spin spinning={loading}>
                <List>
                    <List.Item>

                    </List.Item>
                </List>
                <Table
                    columns={columns}
                    rowKey={(columns) => columns.id}
                    pagination={false}
                    dataSource={props.TousuList}
                    // rowClassName={(record, index) =>
                    //     index % 2 === 1 ? 'tbodd' : 'tbeven'
                    // }
                />
            </Spin>

        </div>
    )
}
const mapStateToProps = (state: any) => {
    return {
        TousuList: state.Tousu.list,
        count: state.Tousu.count,
    }
};
export default connect(mapStateToProps) (Complaint)
