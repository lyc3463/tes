import {useState,useEffect} from "react";
import {connect} from "umi";
import {Button, DatePicker, Input, List, Pagination, Select, Space, Table, Tabs, Tag} from "antd";
import dayjs from "dayjs";
import {checkSessionStorage, updateSessionStorage} from "@/utils/OpenTool";
import ManualRecharge from '@/pages/message/manualRecharge';
import AutoTopUp from "@/pages/message/autoTopUp";
const ChongzhiLog=(props)=>{
    // const [page,setPage]=useState(1);
    // const [pageSize,setPageSize]=useState(50);
    // // 审核状态
    // const [stutes,setStutes]=useState(checkSessionStorage('/message/chongzhiLog','stutes')||0);
    // const [startDate,setStartDate]=useState(checkSessionStorage('/message/chongzhiLog','startDate')||'2000-01-01');
    // const [endDate,setEndDate]=useState(checkSessionStorage('/message/chongzhiLog','endDate')||'2099-01-01');
    // const columns =[
    //     {
    //         title: '日期',
    //         dataIndex: 'created',
    //         key: 'created',
    //         render:(_:any,record:any)=>{
    //             return(
    //                 <div>
    //                     {dayjs(record.created).format("YYYY-MM-DD")}
    //                 </div>
    //             )
    //         }
    //     },
    //     {
    //         title: '金额(元)',
    //         dataIndex: 'smsAmount',
    //         key: 'smsAmount',
    //     },
    //     {
    //         title: '购买条数(条)',
    //         dataIndex: 'smsNumber',
    //         key: 'smsNumber',
    //     },
    //     {
    //         title: '状态',
    //         dataIndex: 'smsStatus',
    //         key: 'smsStatus',
    //         render:(text:any,record:any)=>{
    //             return(
    //                 <div>{record.smsStatus==1?<Tag color='red'>未审核</Tag>:<Tag color='green'>已审核</Tag>}</div>
    //             )
    //         }
    //     }
    // ];
    // const onChange=(e,pageSize)=>{
    //     setPage(e);
    //     setPageSize(pageSize);
    // };
    // const fenye=()=>{
    //     props.dispatch({
    //         type:'Recharge/fetch',
    //         payload:{page,startDate,endDate,stutes,pageSize}
    //     })
    // };
    // useEffect(() => {
    //     fenye();
    // }, [page,pageSize]);
    // const changeType=(e)=>{
    //     setStutes(e);
    //     updateSessionStorage('/message/chongzhiLog','stutes',e);
    // };
    // // 监听日期
    // const changeDate=(_:any,data:string[])=>{
    //     if (data.length === 2 && data[0] === '' && data[1] === '') {
    //         setStartDate('2000-01-01');
    //         setEndDate('2099-01-01');
    //         updateSessionStorage('/message/chongzhiLog','startDate','2000-01-01');
    //         updateSessionStorage('/message/chongzhiLog','endDate','2099-01-01');
    //     } else {
    //         setStartDate(data[0]);
    //         setEndDate(data[1]);
    //         updateSessionStorage('/message/chongzhiLog','startDate',data[0]);
    //         updateSessionStorage('/message/chongzhiLog','endDate',data[1]);
    //     }
    // };
    // const sousuo=()=>{
    //     setPage(1);
    //     getFenYeInfo();
    //     fenye();
    // };
    // const getFenYeInfo=()=>{
    //     props.dispatch({
    //         type:'Recharge/fenye',
    //         payload:{startDate,endDate,stutes,pageSize}
    //     });
    // };
    // useEffect(() => {
    //     getFenYeInfo();
    // }, []);
    return(
        <div>
            <Tabs>
                <Tabs.TabPane tab='手动充值' key='1'>
                    <ManualRecharge/>
                </Tabs.TabPane>
                <Tabs.TabPane tab='自动充值' key='2'>
                    <AutoTopUp/>
                </Tabs.TabPane>
            </Tabs>
            {/*<div>*/}
            {/*    <List style={{backgroundColor:'#f5f5f5',padding:'10px',marginBottom:"20px",border:'1px solid #e3e3e3',borderRadius:'4px'}}>*/}
            {/*        <List.Item>*/}
            {/*            <Space>*/}
            {/*                <Space.Compact>*/}
            {/*                    <div*/}
            {/*                        style={{*/}
            {/*                            borderRadius: '6px',*/}
            {/*                            borderStartEndRadius: 0,*/}
            {/*                            borderEndEndRadius: 0,*/}
            {/*                            padding: '0 11px',*/}
            {/*                            border: '1px solid #d9d9d9',*/}
            {/*                            display: 'flex',*/}
            {/*                            alignItems: 'center',*/}
            {/*                            borderInlineEnd: 0,*/}
            {/*                        }}*/}
            {/*                    >*/}
            {/*                        状态:*/}
            {/*                    </div>*/}
            {/*                    <Select*/}
            {/*                        onChange={changeType}*/}
            {/*                        value={stutes}*/}
            {/*                        style={{ width: 120 }}*/}
            {/*                        options={[*/}
            {/*                            { value:0, label: '全部' },*/}
            {/*                            { value:1, label: '未审核' },*/}
            {/*                            { value:2, label: '已审核' },*/}
            {/*                        ]}*/}
            {/*                    />*/}
            {/*                </Space.Compact>*/}
            {/*                <Space.Compact>*/}
            {/*                    <div*/}
            {/*                        style={{*/}
            {/*                            borderRadius: '6px',*/}
            {/*                            borderStartEndRadius: 0,*/}
            {/*                            borderEndEndRadius: 0,*/}
            {/*                            padding: '0 11px',*/}
            {/*                            border: '1px solid #d9d9d9',*/}
            {/*                            display: 'flex',*/}
            {/*                            alignItems: 'center',*/}
            {/*                            borderInlineEnd: 0,*/}
            {/*                        }}*/}
            {/*                    >*/}
            {/*                        日期:*/}
            {/*                    </div>*/}
            {/*                    {startDate=='2000-01-01'&&endDate=='2099-01-01'?<DatePicker.RangePicker onChange={changeDate}/>:<DatePicker.RangePicker onChange={changeDate} defaultValue={[dayjs(startDate),dayjs(endDate)]}/>}*/}
            {/*                </Space.Compact>*/}
            {/*                <Button type="primary" onClick={sousuo}>*/}
            {/*                    搜索*/}
            {/*                </Button>*/}
            {/*            </Space>*/}
            {/*        </List.Item>*/}
            {/*    </List>*/}
            {/*    <Table*/}
            {/*        columns={columns}*/}
            {/*        rowKey={(columns) => columns.id}*/}
            {/*        pagination={false}*/}
            {/*        dataSource={props.RechargeList}*/}
            {/*        size='small'*/}
            {/*        rowClassName={(record, index) =>*/}
            {/*            index % 2 === 1 ? 'tbodd' : 'tbeven'*/}
            {/*        }*/}
            {/*    />*/}
            {/*    {props.count?<Pagination total={props.count.count} showSizeChanger pageSize={pageSize} current={page}  onChange={onChange} pageSizeOptions={[50,100,500,1000,10000]}/>:''}*/}

            {/*</div>*/}
        </div>
    )
}
const mapStateToProps = (state: any) => {
    return {
        RechargeList: state.Recharge.list,
        count: state.Recharge.count
    }
};
export default connect(mapStateToProps) (ChongzhiLog)