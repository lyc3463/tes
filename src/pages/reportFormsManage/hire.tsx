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
    const [floor_area,setfloor_area]=useState(0);// 建筑面积总和
    const [rentable_area,setrentable_area]=useState(0);// 可租面积总和
    const [residue_add_area,setresidue_add_area]=useState(0);// 可增加面积总和
    const [unitCount,setunitCount]=useState(0);// 单元数量总和
    const [rentable_areaSum,setrentable_areaSum]=useState(0);// 已租面积总和
    const [priceSum,setpriceSum]=useState(0);// 已租总和
    const [manageFee,setmanageFee]=useState(0);// 已租管理费总和
    const [tenantCount,settenantCount]=useState(0);// 租户数量总和

    const calculateSums=(sumDate)=>{
        // 初始化四个求和变量
        let floor_area = 0;
        let rentable_area = 0;
        let residue_add_area = 0;
        let unitCount = 0;
        let rentable_areaSum = 0;
        let priceSum = 0;
        let manageFee = 0;
        let tenantCount = 0;
        // 遍历数组，累加每个属性的值
        sumDate.map(transaction => {
            floor_area += transaction.floor_area || 0; // 使用||0确保未定义或null值不会破坏计算
            rentable_area += transaction.rentable_area || 0;
            residue_add_area += transaction.residue_add_area || 0;
            unitCount += transaction.unitCount || 0;
            rentable_areaSum += transaction.rentable_areaSum || 0;
            priceSum += transaction.priceSum || 0;
            manageFee += transaction.manageFee || 0;
            tenantCount += transaction.tenantCount || 0;
        });
        // 返回一个对象，包含四个求和结果
        return {
            floor_area: floor_area.toFixed(2)*1,
            rentable_area: rentable_area.toFixed(2)*1,
            residue_add_area: residue_add_area.toFixed(2)*1,
            unitCount: unitCount.toFixed(2)*1,
            rentable_areaSum: rentable_areaSum.toFixed(2)*1,
            priceSum: priceSum.toFixed(2)*1,
            manageFee: manageFee.toFixed(2)*1,
            tenantCount: tenantCount.toFixed(2)*1
        };
    }

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
                    <span>{record.floor_area.toFixed(2)}㎡</span>
                )
            }
        },
        {
            title: '可租面积㎡',
            dataIndex: 'rentable_area',
            key: 'rentable_area',
            render: (_:any, record:any) => {
                return(
                    <span>{record.rentable_area.toFixed(2)}㎡</span>
                )
            }
        },
        {
            title: '剩余可增加面积㎡',
            dataIndex: 'residue_add_area',
            key: 'residue_add_area',
            render: (_:any, record:any) => {
                return(
                    <span>{record.residue_add_area.toFixed(2)}㎡</span>
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
            render: (_:any, record:any) => {
                return(
                    <span>{record.rentable_areaSum.toFixed(2)}㎡</span>
                )
            }
        },
        {
            title: '已租租金',
            dataIndex: 'priceSum',
            key: 'priceSum',
            render: (_:any, record:any) => {
                return(
                    <span>{record.priceSum.toFixed(2)}元</span>
                )
            }
        },
        {
            title: '已租管理费',
            dataIndex: 'manageFee',
            key: 'manageFee',
            render: (_:any, record:any) => {
                return(
                    <span>{record.manageFee.toFixed(2)}元</span>
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
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                let sum=calculateSums(res.Data);
                console.log('累加',sum);
                setfloor_area(sum.floor_area);
                setrentable_area(sum.rentable_area);
                setresidue_add_area(sum.residue_add_area);
                setunitCount(sum.unitCount);
                setrentable_areaSum(sum.rentable_areaSum);
                setpriceSum(sum.priceSum);
                setmanageFee(sum.manageFee);
                settenantCount(sum.tenantCount);
            }
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
                        item.floor_area.toFixed(2),
                        item.rentable_area.toFixed(2),
                        item.residue_add_area.toFixed(2),
                        item.unitCount,
                        item.rentable_areaSum.toFixed(2),
                        item.priceSum.toFixed(2),
                        item.tenantCount.toFixed(2),
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
                            <Table.Summary.Cell index={1}>
                                {floor_area}㎡
                            </Table.Summary.Cell>
                            <Table.Summary.Cell index={2}>
                                {rentable_area}㎡
                            </Table.Summary.Cell>
                            <Table.Summary.Cell index={3}>
                                {residue_add_area}㎡
                            </Table.Summary.Cell>
                            <Table.Summary.Cell index={4}>
                                {unitCount}间
                            </Table.Summary.Cell>
                            <Table.Summary.Cell index={5}>
                                {rentable_areaSum}㎡
                            </Table.Summary.Cell>
                            <Table.Summary.Cell index={6}>
                                {priceSum}元
                            </Table.Summary.Cell>
                            <Table.Summary.Cell index={7}>
                                {manageFee}元
                            </Table.Summary.Cell>
                            <Table.Summary.Cell index={8}>
                                {tenantCount}个
                            </Table.Summary.Cell>
                        </Table.Summary.Row>
                    </Table.Summary>
                )}
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