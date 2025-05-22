import {useEffect, useState} from "react";
import {connect} from "umi";
import {Button, DatePicker, Input, InputNumber, List, message, Pagination, Space, Spin, Table, Tag} from "antd";
import * as FinanceService from "@/services/finance";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import dayjs from "dayjs";
import {exportDataToExcel} from "@/utils/OpenTool";
import * as HireService from "@/services/hire";
import {StaticInfo} from "@/StaticInfo";

const Hire=(props:any)=>{
    const [spinning,setspinning]=useState(false);
    const [name,setName]=useState('');
    const [beginRents,setBeginRents]=useState(0);
    const [endRents,setEndRents]=useState(9999999999);
    const [uqx,setUqx]=useState([]);

    const columns =[
        {
            title: '房屋名称',
            dataIndex: 'house_name',
            key: 'house_name',
        },
        {
            title: '总楼层',
            dataIndex: 'floors',
            key: 'floors',
            render: (_:any, record:any) => {
                return(
                    <span>{record.floors}层</span>
                )
            }
        },
        {
            title: '建筑面积㎡',
            dataIndex: 'floor_area',
            key: 'floor_area',
            render: (_:any, record:any) => {
                return(
                    <span>{record.floor_area}㎡</span>
                )
            }
        },
        {
            title: '可租面积㎡',
            dataIndex: 'rentable_area',
            key: 'rentable_area',
            render: (_:any, record:any) => {
                return(
                    <span>{record.rentable_area}㎡</span>
                )
            }
        },
        {
            title: '剩余可增加面积㎡',
            dataIndex: 'residue_add_area',
            key: 'residue_add_area',
            render: (_:any, record:any) => {
                return(
                    <span>{record.residue_add_area}㎡</span>
                )
            }
        },
        {
            title: '单元数量(间)',
            dataIndex: 'unitCount',
            key: 'unitCount',

        },
        {
            title: '已租面积㎡',
            dataIndex: 'rentable_areaSum',
            key: 'rentable_areaSum',

        },
        {
            title: '已租租金',
            dataIndex: 'priceSum',
            key: 'priceSum',
            render: (_:any, record:any) => {
                return(
                    <span>{record.priceSum}元</span>
                )
            }
        },
        {
            title: '租户数量(个)',
            dataIndex: 'tenantCount',
            key: 'tenantCount',
        },
        {
            title: '平均单价',
            dataIndex: 'xx',
            key: 'xx',
            render: (_:any, record:any) => {
                let a=record.priceSum;
                let b=record.rentable_areaSum;
                let sum = (b !== 0) ? (a / b) : 0;
                return(
                    <div>
                        {sum.toFixed(2)}元
                    </div>

                )
            }
        },
        {
            title: '出租率',
            dataIndex: 'qq',
            key: 'qq',
            render: (_:any, record:any) => {
                return(
                    <span>{((record.rentable_areaSum/record.rentable_area)*100).toFixed(2)}%</span>
                )
            }
        },
        {
            title: '使用率',
            dataIndex: 'usageRate',
            key: 'usageRate',
            render: (_:any, record:any) => {
                return(
                    <span>{((record.rentable_area/record.floor_area)*100).toFixed(2)}%</span>
                )
            }
        },

    ];
    useEffect(() => {
        logFenye();
        let uq=StaticInfo.uqx.split('');
        setUqx(uq);
    }, []);
    // 分页
    const logFenye=()=>{
        props.dispatch({
            type:"Hire/fetch",
            payload:{name,beginRents,endRents}
        })
    };
    // 搜索按钮
    const shousuo=()=>{
        logFenye()
    };
    const changeBeginRents=(e)=>{
        if (e){
            setBeginRents(e);
        }else {
            setBeginRents(0);
        }
    };
    const changeEndRents=(e)=>{
        if (e<beginRents){
            setEndRents(beginRents);
        }else if(e>0){
            setEndRents(e);
        }else {
            setEndRents(999999);
        }
    };
    const exportToExcel=()=>{
        setspinning(true);
        HireService.fetch({name,beginRents,endRents}).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                let headers=['房屋名称','总楼层(层)','建筑面积㎡','可租面积㎡','剩余可增加面积㎡','单元数量(间)','已租面积㎡','已租租金','租户数量(个)','平均单价(元)','出租率(%)','使用率(%)'];
                const ws_data = [
                    headers.map(header => ({ v: header, t: 's' })), // 表头
                    ...res.Data.map(item => [
                        item.house_name,
                        item.floors,
                        item.floor_area,
                        item.rentable_area,
                        item.residue_add_area,
                        item.unitCount,
                        item.rentable_areaSum,
                        item.priceSum,
                        item.tenantCount,
                        ((item.rentable_areaSum !== 0) ? (item.priceSum / item.rentable_areaSum).toFixed(2) : 0),
                        ((item.rentable_areaSum/item.rentable_area)*100).toFixed(2),
                        ((item.rentable_area/item.floor_area)*100).toFixed(2)
                    ].map(value => ({ v: value, t: typeof value === 'number' ? 'n' : 's' })))
                ];
                exportDataToExcel(ws_data);
                setspinning(false);
            }else {
                message.error(res.Data);
                setspinning(false);
            }
        })
    };
    return(
        <Spin spinning={spinning}>
            <List>
                <List.Item>
                    <Space>
                        {uqx[385]=='1'?
                            <Button type="primary" onClick={exportToExcel}>
                                导出
                            </Button>:''}
                    </Space>
                </List.Item>
            </List>
            <Table
                style={{border:'1px solid #ddd',borderRadius:'4px'}}
                columns={columns}
                size='small'
                rowKey={(columns) => columns.id}
                dataSource={props.HireList}
                scroll={{x:1500}}
                pagination={false}
            />
        </Spin>
    )
}
const mapStateToProps = (state: any) => {
    return {
        HireList: state.Hire.list,
    }
};
export default connect(mapStateToProps) (Hire)