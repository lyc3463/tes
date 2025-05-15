import {connect} from "umi";
import {useEffect, useState} from "react";
import dayjs from "dayjs";
import {Button, DatePicker, Input, List, Pagination, Select, Space, Table, Tag} from "antd";

const Finance=(props)=>{
    const [page,setPage]=useState(1);
    const [pageSize,setPageSize]=useState(50);
    const [startDate,setStartDate]=useState('2000-01-01');
    const [endDate,setEndDate]=useState('2099-01-01');

    const columns =[
        {
            title: '日期',
            dataIndex: 'countDate',
            key: 'countDate',
            render:(text:any,record:any,)=>{
                return(
                    <div>
                        {dayjs(record.countDate).format('YYYY-MM-DD')}
                    </div>
                )
            }
        },
        {
            title: '租户总余额(元)',
            dataIndex: 'balance',
            key: 'balance',
        },
        {
            title: '充值总金额(元)',
            dataIndex: 'rechargeAmount',
            key: 'rechargeAmount',
        },
        {
            title: '扣费总金额(元)',
            dataIndex: 'amount',
            key: 'amount',

        },
    ];
    // 监听日期
    const changeDate=(_:any,data:string[])=>{
        if (data.length === 2 && data[0] === '' && data[1] === '') {
            setStartDate('2000-01-01');
            setEndDate('2099-01-01');
        } else {
            setStartDate(data[0]);
            setEndDate(data[1]);
        }
    };
    // 搜索
    const sousuo=()=>{
        setPage(1);
        getFenyeInfo();
        logFenye();
    };
    const getFenyeInfo=()=>{
        props.dispatch({
            type:'Finance/fenye',
            payload:{startDate,endDate,pageSize}
        });
    };
    // 分页
    const logFenye=()=>{
        props.dispatch({
            type:"Finance/fetch",
            payload:{page,startDate,endDate,pageSize}
        })
    };
    // 监听页数
    const onChange=(e:number,pageSize:number)=>{
        setPage(e);
        setPageSize(pageSize);
    };
    useEffect(() => {
        logFenye();
    }, [page,pageSize]);
    useEffect(() => {
        getFenyeInfo();
    }, []);
    return(
        <div>
            <List>
                <List.Item>
                    {/*<Space>*/}
                    {/*    <Space.Compact>*/}
                    {/*        <div*/}
                    {/*            style={{*/}
                    {/*                borderRadius: '6px',*/}
                    {/*                borderStartEndRadius: 0,*/}
                    {/*                borderEndEndRadius: 0,*/}
                    {/*                padding: '0 11px',*/}
                    {/*                border: '1px solid #d9d9d9',*/}
                    {/*                display: 'flex',*/}
                    {/*                alignItems: 'center',*/}
                    {/*                borderInlineEnd: 0,*/}
                    {/*            }}*/}
                    {/*        >*/}
                    {/*            时间:*/}
                    {/*        </div>*/}
                    {/*        <DatePicker.RangePicker onChange={changeDate}/>*/}
                    {/*    </Space.Compact>*/}
                    {/*    <Button type="primary" onClick={sousuo}>*/}
                    {/*        搜索*/}
                    {/*    </Button>*/}
                    {/*</Space>*/}
                </List.Item>
            </List>
            <Table
                columns={columns}
                style={{border:'1px solid #ddd',borderRadius:'4px'}}
                pagination={false}
                scroll={{y:'70vh'}}
                rowKey={(columns) => columns.id}
                dataSource={props.FinanceList}
                size='small'
            />
            {props.count?<Pagination total={props.count.count} showSizeChanger pageSize={pageSize} current={page}  onChange={onChange} pageSizeOptions={[50,100,500,1000,10000]}/>:''}
        </div>
    )
}
const mapStateToProps = (state: any) => {
    return {
        FinanceList: state.Finance.list,
        count: state.Finance.count
    }
};
export default connect(mapStateToProps) (Finance)