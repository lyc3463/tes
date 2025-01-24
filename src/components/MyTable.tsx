import {useEffect, useState} from "react";
import * as StatisticsService from '@/services/statistics';
import dayjs from "dayjs";
import {Button, message, Pagination, Table, Tag} from "antd";

const MyTable=(props:any)=>{
    const [page,setPage]=useState(1);
    const [startDate,setStartDate]=useState('');
    const [endDate,setEndDate]=useState('');
    const [list,setList]=useState([]);
    const [cid,setCid]=useState('');
    const [name,setName]=useState('');
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
          getList(start,endTime);
      }else if (props.value==2){
          let startTime = dayjs(props.startTime);
          let endOfMonthDate = startTime.clone().endOf('month').date();
          let endTime = startTime.clone().endOf('month').startOf('second').add(59, 'second').add(59, 'minute').subtract(1, 'millisecond');
          let endTimeSimpler = startTime.clone().endOf('month').subtract(1, 'millisecond');
          let start = startTime.format('YYYY-MM-DD HH:mm:ss');
          let end = endTimeSimpler.format('YYYY-MM-DD HH:mm:ss');
          // let start=dayjs(props.startTime).format('YYYY-MM-DD HH:mm:ss');
          // let parsedTime = dayjs(start);
          // const parsedEndTime = parsedTime.clone().minute(59).second(59).hour(23);
          // let endTime=dayjs(parsedEndTime).format('YYYY-MM-DD HH:mm:ss');
          setStartDate(start);
          setEndDate(end);
          getList(start,end);
      }else if (props.value==3){
          let start=dayjs(props.startTime).format('YYYY-MM-DD HH:mm:ss');
          let parsedTime = dayjs(start);
          const parsedEndTime = parsedTime.endOf('month');
          let endTime=dayjs(parsedEndTime).format('YYYY-MM-DD HH:mm:ss');
          setStartDate(start);
          setEndDate(endTime);
          getList(start,endTime);
      }
      else if (props.value==4){
          let start=dayjs(props.startTime).format('YYYY-MM-DD HH:mm:ss');
          let year = parseInt(start.split('-')[0], 10); // 提取年份（更直接的方式）
          let endOfYear = dayjs().year(year).endOf('year');
          let endTime=dayjs(endOfYear).format('YYYY-MM-DD HH:mm:ss');
          setStartDate(start);
          setEndDate(endTime);
          getList(start,endTime);
      }
    };
    const getList=(vals:string,vals2:string)=>{
      StatisticsService.fetch(page,'','',vals,vals2,2,0,'').then((res:any)=>{
          if (res.ErrorCode==0){
              console.log(res);
              setList(res.Data)
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
    return(
        <div>
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
            />
            <Pagination />
        </div>
    )
}
export default MyTable