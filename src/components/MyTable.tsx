import {useEffect, useState} from "react";
import * as StatisticsService from '@/services/statistics';
import dayjs from "dayjs";
import {Button, DatePicker, Input, List, message, Pagination, Space, Table, Tag} from "antd";

const MyTable=(props:any)=>{
    const [page,setPage]=useState(1);
    const [startDate,setStartDate]=useState('');
    const [endDate,setEndDate]=useState('');
    const [list,setList]=useState([]);
    const [cid,setCid]=useState('');
    const [name,setName]=useState('');
    const [remake,setRemake]=useState('');
    const [count,setcount]=useState(0);
    const [energyUsage,setenergyUsage]=useState(0);
    useEffect(() => {
        check_key();
        console.log(props)
    }, [props,endDate,startDate]);
    const check_key=()=>{
      if (props.value==1){
          let start=dayjs(props.startTime).format('YYYY-MM-DD HH:mm:ss');
          let parsedTime = dayjs(start);
          const parsedEndTime = parsedTime.clone().minute(59).second(59);
          let endTime=dayjs(parsedEndTime).format('YYYY-MM-DD HH:mm:ss');
          setStartDate(start);
          setEndDate(endTime);
          getList(start,endTime,page);
          getListfenye(start,endTime);
      }else if (props.value==2){
          let startTime = dayjs(props.startTime);
          let endTimeSimpler = startTime.clone().endOf('day');
          let start = startTime.format('YYYY-MM-DD HH:mm:ss');
          let end = endTimeSimpler.format('YYYY-MM-DD HH:mm:ss');
          // console.log('传入进来的时间',start,end);
          setStartDate(start);
          setEndDate(end);
          getList(start,end,page);
          getListfenye(start,end);
      }else if (props.value==3){
          let start=dayjs(props.startTime).format('YYYY-MM-DD HH:mm:ss');
          let parsedTime = dayjs(start);
          const parsedEndTime = parsedTime.endOf('month');
          let endTime=dayjs(parsedEndTime).format('YYYY-MM-DD HH:mm:ss');
          setStartDate(start);
          setEndDate(endTime);
          getList(start,endTime,page);
          getListfenye(start,endTime);
      }
      else if (props.value==4){
          let start=dayjs(props.startTime).format('YYYY-MM-DD HH:mm:ss');
          let year = parseInt(start.split('-')[0], 10); // 提取年份（更直接的方式）
          let endOfYear = dayjs().year(year).endOf('year');
          let endTime=dayjs(endOfYear).format('YYYY-MM-DD HH:mm:ss');
          setStartDate(start);
          setEndDate(endTime);
          getList(start,endTime,page);
          getListfenye(start,endTime);
      }
    };
    const getList=(vals:string,vals2:string,pageNub:number)=>{
      StatisticsService.fetch(pageNub,cid,name,vals,vals2,'扣费成功',0,remake).then((res:any)=>{
          if (res.ErrorCode==0){
              setList(res.Data)
          }else {
              message.error(res.Data)
          }
      })
    };
    const getListfenye=(vals:string,vals2:string)=>{
      StatisticsService.fenye(cid,name,vals,vals2,'扣费成功',0,remake).then((res:any)=>{
          if (res.ErrorCode==0){
              setcount(res.Data.count);
              setenergyUsage(res.Data.energyUsage);
          }else {
              message.error(res.Data)
          }
      })
    };
    const columns=[
        {
            title: '采集器编号',
            dataIndex: 'collector_id',
        },
        {
            title: '表地址',
            dataIndex: 'address',
        },
        {
            title: '表描述',
            dataIndex: 'remark',
        },
        {
            title: '日期',
            dataIndex: 'recordTime',
            render: (_: any, record: any) => (
                <div>
                    {dayjs(record.recordTime).format("YYYY-MM-DD HH:mm:ss")}
                </div>

            ),
        },
        {
            title: '开始',
            dataIndex: 'energyOld',
            render: (_: any, record: any) => (
                <div>
                    {record.energyOld}kWh
                </div>

            ),
        },
        {
            title: '结束',
            dataIndex: 'energyNew',
            render: (_: any, record: any) => (
                <div>
                    {record.energyNew}kWh
                </div>

            ),
        },
        {
            title: '统计值',
            dataIndex: 'energyUsage',
            render: (_: any, record: any) => (
                <div>
                    {record.energyUsage}kWh
                </div>
            ),
        },
        {
            title: '用户',
            dataIndex: 'tenant_name',
            render: (_: any, record: any) => (
                <div>
                    {record.tenant_name?record.tenant_name:<Tag color='red'>未绑定租户</Tag>}
                </div>
            ),
        },
    ];
    const  sousuo=()=>{
        setPage(1);
        getList(startDate,endDate,1);
        getListfenye(startDate,endDate);
    };
    const changePage=(e)=>{
        setPage(e);
        getListfenye(startDate,endDate);
    };
    return(
        <div>
            <List>
                <List.Item>
                    <Space>
                        <Input
                            addonBefore="租户姓名:"
                            onChange={(e)=>setName(e.target.value)}
                        />
                        <Input
                            addonBefore="表地址:"
                            onChange={(e)=>setCid(e.target.value)}
                        />
                        <Input
                            addonBefore="电表备注:"
                            onChange={(e)=>setRemake(e.target.value)}
                        />
                        <Button type="primary" onClick={sousuo}>
                            搜索
                        </Button>
                    </Space>
                </List.Item>
            </List>
            <Table
                columns={columns}
                style={{border:'1px solid #ddd',borderRadius:'4px'}}
                pagination={false}
                size='small'
                rowKey={(columns) => columns.id}
                dataSource={list}
                rowClassName={(record, index) =>
                    index % 2 === 1 ? 'tbodd' : 'tbeven'
                }
                summary={(columns) => (
                <Table.Summary fixed>
                    <Table.Summary.Row>
                        <Table.Summary.Cell
                            index={1}
                        >
                            统计
                        </Table.Summary.Cell>
                        <Table.Summary.Cell index={0}>
                        </Table.Summary.Cell>
                        <Table.Summary.Cell index={0}>
                        </Table.Summary.Cell>
                        <Table.Summary.Cell index={0}>
                        </Table.Summary.Cell>
                        <Table.Summary.Cell index={0}>
                        </Table.Summary.Cell>
                        <Table.Summary.Cell index={0}>
                        </Table.Summary.Cell>
                        <Table.Summary.Cell
                            index={2}
                        >
                            {energyUsage}kWh
                        </Table.Summary.Cell>
                    </Table.Summary.Row>
                </Table.Summary>
            )}
            />
            <Pagination total={count} pageSize={50} current={page} onChange={changePage} pageSizeOptions={[50]}/>
        </div>
    )
}
export default MyTable