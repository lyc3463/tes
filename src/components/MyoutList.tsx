import {message, Table, Tag} from "antd";
import dayjs from "dayjs";
import {connect} from "umi";
import {useEffect, useState} from "react";
import * as ArrearsBillService from "@/services/ArrearsBill";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";

const MyoutList=(props)=>{
    // 当前页数
    const [page,setPage]=useState(1);
    const [name,setName]=useState('');
    const [tenandId,settenandId]=useState(0);
    const [startDate,setStartDate]=useState('2000-01-01');
    const [endDate,setEndDate]=useState('2099-01-01');
    const [stutes,setstutes]=useState(3);

    // 总页码
    const [count,setcount]=useState(0);
    // 列表
    const [dataSource,setdataSource]=useState([]);
    // 租金管理费统计
    const [moneySum,setmoneySum]=useState(0);
    // 租金已交费用统计
    const [NotBillSum,setNotBillSum]=useState(0);
    const zuColumns=[
        {
            title: '账单周期',
            dataIndex: 'payrentDate',
            key: 'payrentDate',
            render:(text:any,record:any)=>{
                return(
                    <div>
                        {dayjs(record.billBeginDate).format("YYYY-MM-DD")}至{dayjs(record.billEndDate).format("YYYY-MM-DD")}
                    </div>
                )
            }
        },
        {
            title: '租户姓名',
            dataIndex: 'tenant_name',
            key: 'tenant_name',
        },
        {
            title: '租户手机号',
            dataIndex: 'tenant_phone',
            key: 'tenant_phone',
        },
        {
            title: '账单类型',
            dataIndex: 'billType',
            key: 'billType',
            render:(text:any,record:any)=>{
                return(
                    <div>
                        租金/管理费
                    </div>
                )
            }
        },
        {
            title: '缴费金额(元)',
            dataIndex: 'payAmount',
            key: 'payAmount',
            render:(text:any,record:any)=>{
                return(
                    <div style={{color:'red'}}>
                        {record.payAmount}元
                    </div>
                )
            }
        },
        {
            title: '已交金额(元)',
            dataIndex: 'stopAmount',
            key: 'stopAmount',
            render:(text:any,record:any)=>{
                return(
                    <div style={{color:'red'}}>
                        {record.stopAmount}元
                    </div>
                )
            }
        },
        {
            title: '违约金天数',
            dataIndex: 'defaultNum',
            key: 'defaultNum',
            render:(text:any,record:any)=>{
                return(
                    <div>
                        {record.defaultNum}天
                    </div>
                )
            }
        },
        {
            title: '违约金(元)',
            dataIndex: 'defaultAmount',
            key: 'defaultAmount',
            render:(text:any,record:any)=>{
                return(
                    <div>
                        {record.defaultAmount}元
                    </div>
                )
            }
        },
        {
            title: '优惠金额',
            dataIndex: 'preRen',
            key: 'preRen',
            render:(text:any,record:any)=>{
                return(
                    <div>
                        {record.preRen}元
                    </div>
                )
            }
        },
        {
            title: '优惠前租金',
            dataIndex: 'xx',
            key: 'xx',
            render:(text:any,record:any)=>{
                return(
                    <div>
                        {record.preRen+record.payAmount}元
                    </div>
                )
            }
        },
        {
            title: '缴费状态',
            dataIndex: 'billStatus',
            key: 'billStatus',
            render:(text:any,record:any)=>{
                return(
                    <div>
                        {record.billStatus==3?<Tag color='red'>退租</Tag>:<Tag>未知状态</Tag>}
                    </div>
                )
            }
        },
    ];
    // 查看租金缴费列表
    const getzujinList=(phone)=>{
        ArrearsBillService.zujinList({page,name,phone,startDate,endDate,tenandId,stutes}).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                console.log("列表",res);
                setdataSource(res.Data);
            }else {
                message.error(res.Data);
            }
        })
    };
    // 分页
    const logFenye=(phone:string)=>{
        ArrearsBillService.zujinListFenye({name,phone,startDate,endDate,tenandId,stutes}).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                setcount(res.Data.count);
                setmoneySum(res.Data.moneySum);
                setNotBillSum(res.Data.NotBillSum);
            }else {
                message.error(res.Data);
            }
        })
    };
    useEffect(() => {
        logFenye(props.phone);
    }, []);
    useEffect(() => {
        getzujinList(props.phone);
        console.log('props',props);
    }, [props]);
  return(
      <div>
          <Table
              columns={zuColumns}
              style={{border:'1px solid #ddd',borderRadius:'4px'}}
              pagination={false}
              scroll={{y:'70vh',x:2000}}
              rowKey={(columns) => columns.id}
              size='small'
              dataSource={dataSource}
          />
      </div>
  )
}

export default connect() (MyoutList)