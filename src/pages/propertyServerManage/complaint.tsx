import {Button, Input, List, Pagination, Select, Space, Spin, Table, Tag} from "antd";
import {useEffect, useState} from "react";
import {connect} from "umi";
import dayjs from "dayjs";

const Complaint=(props:any)=>{
    const [loading, setLoading] = useState(false);
    const [page,setPage]=useState(1);
    const [name,setName]=useState('');
    const [phoen,setPhone]=useState('');
    const [state,setState]=useState(0);
    const [startDate,setstartDate]=useState('2000-01-01');
    const [endDate,setendDate]=useState('2099-01-01');
    const [openID,setopenID]=useState('');
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
            title: '昵称',
            dataIndex: 'appUserName',
        },
        {
            title: '租户手机号',
            dataIndex: 'appUserPhone',
        },
        {
            title: '投诉内容',
            dataIndex: 'complaint_content',
            render: (_: any, record: any) => (
                <Input.TextArea value={record.complaint_content}>

                </Input.TextArea>
            ),
        },
    ];
    // 获取投诉建议列表
    const getList=()=>{
        props.dispatch({
            type:'Tousu/fetch',
            payload:{page,name,phoen,state,startDate,endDate,openID}
        })
    };
    const getfenye=()=>{
        props.dispatch({
            type:'Tousu/fenye',
            payload:{name,phoen,state,startDate,endDate,openID}
        })
    };
    useEffect(() => {
        getList();
    }, [page]);
    const onChange=(e)=>{

    };
    useEffect(() => {
        getfenye();
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
                    size='small'
                    // rowClassName={(record, index) =>
                    //     index % 2 === 1 ? 'tbodd' : 'tbeven'
                    // }
                />
                {props.count?<Pagination total={props.count.count} pageSize={50} current={page}  onChange={onChange} pageSizeOptions={[50]}/>:''}
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
