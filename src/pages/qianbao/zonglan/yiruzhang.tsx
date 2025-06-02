import {Button, DatePicker, Form, Modal, Pagination, Select, Table, Input, Space, Tag, List, message, Spin} from "antd";
import {connect} from "umi";
import dayjs from "dayjs";
import {useEffect, useState} from "react";
import * as RechargeRateService from "@/services/rechargeRate";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import {checkSessionStorage, exportDataToExcel, updateSessionStorage} from "@/utils/OpenTool";
import * as TixianService from "@/services/ruzhang";
import {StaticInfo} from "@/StaticInfo";
const Yiruzhang=(props)=>{
    const [page,setPage]=useState(1);
    const [pageSize,setPageSize]=useState(50);
    const [stutes,setStutes]=useState(2);
    const [startDate,setStartDate]=useState(checkSessionStorage('/qianbao/zonglan/yiruzhang/','startDate')||'2000-01-01');
    const [endDate,setEndDate]=useState(checkSessionStorage('/qianbao/zonglan/yiruzhang/','endDate')||'2099-01-01');
    const [spinning,setspinning]=useState(false);
    const [uqx,setUqx]=useState([]);
    const columns =[
        {
            title: '日期',
            dataIndex: 'created',
            key: 'created',
            render:(text,record)=>{
                return(
                    <div>{dayjs(record.created).format("YYYY-MM-DD HH:mm:ss")}</div>
                )
            }
        },
        {
            title: '银行卡号',
            dataIndex: 'cardId',
            key: 'cardId',
        },
        {
            title: '户名',
            dataIndex: 'accountName',
            key: 'accountName',
        },
        {
            title: '开户行',
            dataIndex: 'bankName',
            key: 'bankName',
        },
        {
            title: '提现申请人',
            dataIndex: 'userName',
            key: 'userName',
        },
        {
            title: '提现金额(元)',
            dataIndex: 'withdAmount',
            key: 'withdAmount',
        },
        {
            title: '手续费比例',
            dataIndex: 'commission',
            key: 'commission',
            render:(text,record)=>{
                return(
                    <div>{record.commission/1000}</div>
                )
            }
        },
        {
            title: '到账金额(元)',
            dataIndex: 'withdAmount',
            key: 'withdAmount',
            render:(text,record)=>{
                return(
                    <div>{(record.withdAmount-(record.withdAmount*record.commission/1000)).toFixed(2)}元</div>
                )
            }
        },
    ];
    // 分页
    const logFenye=()=>{
        props.dispatch({
            type:"Ruzhang/fetch",
            payload:{page,stutes,startDate,endDate,pageSize}
        })
    };
    const sousuo=()=>{
        setPage(1);
        getFenye();
        logFenye();
    };
    const getFenye=()=>{
        props.dispatch({
            type:"Ruzhang/fenye",
            payload:{stutes,startDate,endDate,pageSize}
        });
    };
    // 监听日期
    const changeDate=(_:any,data:string[])=>{
        if (data.length === 2 && data[0] === '' && data[1] === '') {
            setStartDate('2000-01-01');
            setEndDate('2099-01-01');
            updateSessionStorage('/qianbao/zonglan/yiruzhang/','startDate','2000-01-01');
            updateSessionStorage('/qianbao/zonglan/yiruzhang/','endDate','2099-01-01');
        } else {
            setStartDate(data[0]);
            setEndDate(data[1]);
            updateSessionStorage('/qianbao/zonglan/yiruzhang/','startDate',data[0]);
            updateSessionStorage('/qianbao/zonglan/yiruzhang/','endDate',data[1]);
        }
    };
    const  onChange=(e,pageSize)=>{
        setPage(e);
        setPageSize(pageSize);
    };
    useEffect(() => {
        logFenye();
    }, [page,pageSize]);
    useEffect(() => {
        getFenye();
        let uq=StaticInfo.uqx.split('');
        setUqx(uq);
    }, []);
    const exportToExcel=()=>{
        setspinning(true);
        TixianService.fetch({page:1,stutes,startDate,endDate,pageSize:100000}).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                let headers=['日期','银行卡号','户名','开户行','申请人','提现金额(元)','手续费比例','到账金额(元)'];
                const ws_data = [
                    headers.map(header => ({ v: header, t: 's' })), // 表头
                    ...res.Data.map(item => [
                        (dayjs(item.created).format("YYYY-MM-DD HH:mm:ss")),
                        item.cardId,
                        item.accountName,
                        item.bankName,
                        item.userName,
                        item.withdAmount,
                        item.commission/1000,
                        (item.withdAmount-(item.withdAmount*item.commission/1000)).toFixed(2)
                    ].map(value => ({ v: value, t: typeof value === 'number' ? 'n' : 's' }))) // 数据行，根据值类型设置单元格类型
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
                        <Space.Compact>
                            <div
                                style={{
                                    borderRadius: '6px',
                                    borderStartEndRadius: 0,
                                    borderEndEndRadius: 0,
                                    padding: '0 11px',
                                    border: '1px solid #d9d9d9',
                                    display: 'flex',
                                    alignItems: 'center',
                                    borderInlineEnd: 0,
                                }}
                            >
                                时间:
                            </div>
                            {startDate=='2000-01-01'&&endDate=='2099-01-01'?<DatePicker.RangePicker onChange={changeDate}/>:<DatePicker.RangePicker onChange={changeDate} defaultValue={[dayjs(startDate),dayjs(endDate)]}/>}
                        </Space.Compact>
                        <Button type="primary" onClick={sousuo}>
                            搜索
                        </Button>
                        {uqx[374]=='1'?<Button type="primary" onClick={exportToExcel}>导出</Button>:''}

                    </Space>
                </List.Item>
            </List>
            <Table
                columns={columns}
                rowKey={(columns) => columns.id}
                dataSource={props.TixianList}
                pagination={false}
                size='small'
                scroll={{y:'60vh'}}
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
                            <Table.Summary.Cell
                                index={7}
                            >
                                {props.count?props.count.withdAmountSum:''}元
                            </Table.Summary.Cell>
                            <Table.Summary.Cell index={8}>
                                {props.count?props.count.actualAmountSum:''}元
                            </Table.Summary.Cell>
                        </Table.Summary.Row>
                    </Table.Summary>
                )}
            />
            {props.count?<Pagination total={props.count.count} pageSize={50} current={page}  onChange={onChange} pageSizeOptions={[50]}/>:''}
        </Spin>
    )
}
const mapStateToProps = (state: any) => {
    return {
        TixianList: state.Ruzhang.list,
        count: state.Ruzhang.count
    }
};
export default connect(mapStateToProps) (Yiruzhang)