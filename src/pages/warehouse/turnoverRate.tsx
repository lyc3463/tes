import {connect} from "umi";
import {useEffect, useState} from "react";
import {Button, DatePicker,Image, Input, List, Modal, Pagination, Space, Spin, Table} from "antd";
import dayjs from "dayjs";
import {checkSessionStorage, updateSessionStorage} from "@/utils/OpenTool";

const TurnoverRate=(props)=>{
    const [page, setPage] = useState(1);
    const [orderCode, setOrderCode] = useState(checkSessionStorage('/warehouse/thingTurnoverRate','TurnoverRateOrderCode') ||'');
    const [productsName, setProductsName] = useState(checkSessionStorage('/warehouse/thingTurnoverRate','TurnoverRateProductsName') ||'');
    const [startDate, setStartDate] = useState(checkSessionStorage('/warehouse/thingTurnoverRate','TurnoverRateStartDate') ||'2000-01-01');
    const [endDate, setEndDate] = useState(checkSessionStorage('/warehouse/thingTurnoverRate','TurnoverRateEndDate') ||'2099-01-01');
    const [pageSize, setPageSize] = useState(50);
    const [spinning, setSpinning] = useState(false);
    // 表格列配置
    const columns = [
        {
            title: '入库时间',
            dataIndex: 'rkTime',
            ellipsis: true,
            render: (text: string) => (
                dayjs(text).format('YYYY-MM-DD HH:mm:ss')
            ),
        },
        {
            title: '所属单号',
            dataIndex: 'orderCode',
            ellipsis: true,
        },
        {
            title: '物品图片',
            dataIndex: 'productsImageBase64',
            ellipsis: true,
            render: (text: string) => (
                <Image src={text} style={{width:'50px',height:'50px'}}/>
            ),
        },
        {
            title: '物品名称',
            dataIndex: 'productsName',
            ellipsis: true,
        },
        {
            title: '物品编码',
            dataIndex: 'productsCode',
            ellipsis: true,
        },
        {
            title: '单位',
            dataIndex: 'unitsName',
            ellipsis: true,
        },
        {
            title: '周转率',
            dataIndex: 'ops',
            ellipsis: true,
            render: (text: any, record: any) => {
                const { xsTime, rkTime, quantityXs } = record;

                // 1. 判断xsTime是否为默认日期
                if (xsTime === '0001-01-01T00:00:00') {
                    return 0;
                }

                // 2. 解析时间并校验有效性
                const start = dayjs(rkTime);
                const end = dayjs(xsTime);
                if (!start.isValid() || !end.isValid()) {
                    return 0;
                }

                // 3. 计算时间差（分钟）
                const diffMinutes = Math.max(end.diff(start, 'minute'), 1);

                // 4. 处理边界情况（避免除以0）
                if (diffMinutes <= 0 || quantityXs <= 0) {
                    return 0;
                }

                // 5. 计算周转率并保留两位小数
                const turnoverRate = quantityXs / diffMinutes;
                return turnoverRate.toFixed(3);
            },
        },
        // {
        //     title: '入库单价(元)',
        //     dataIndex: 'price',
        //     ellipsis: true,
        // },

    ];
    // 仓库名称改变
    const changeProductsName=(e)=>{
        setProductsName(e.target.value);
        updateSessionStorage('/warehouse/thingTurnoverRate','TurnoverRateProductsName',e.target.value);
    };
    // 单号改变
    const changeOrderCode=(e)=>{
        setOrderCode(e.target.value);
        updateSessionStorage('/warehouse/thingTurnoverRate','TurnoverRateOrderCode',e.target.value);
    };
    // 监听日期
    const changeDate=(_:any,data:string[])=>{
        if (data.length === 2 && data[0] === '' && data[1] === '') {
            setStartDate('2000-01-01');
            setEndDate('2099-01-01');
            updateSessionStorage('/warehouse/thingTurnoverRate','TurnoverRateStartDate','2000-01-01');
            updateSessionStorage('/warehouse/thingTurnoverRate','TurnoverRateEndDate','2099-01-01');
        } else {
            setStartDate(data[0]);
            setEndDate(data[1]);
            updateSessionStorage('/warehouse/thingTurnoverRate','TurnoverRateStartDate',data[0]);
            updateSessionStorage('/warehouse/thingTurnoverRate','TurnoverRateEndDate',data[1]);
        }
    };
    const sousuo=()=>{
        setPage(1);
        getList();
    };
    // 监听页数
    const onChange=(page:number,pageSize:number)=>{
        setPage(page);
        setPageSize(pageSize);
    };
    const getList=()=>{
      props.dispatch({
          type:'TurnoverRate/fetch',
          payload:{page, orderCode, productsName, startDate, endDate, pageSize}
      })
    };

    useEffect(() => {
        getList()
    }, [page,pageSize]);

    return(
        <Spin spinning={spinning}>
            <List>
                <List.Item>
                    <Space>
                        <Input
                            addonBefore="物品名称:"
                            value={productsName}
                            onChange={changeProductsName}
                        />
                        <Input
                            addonBefore="单号:"
                            value={orderCode}
                            onChange={changeOrderCode}
                        />
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
                                日期:
                            </div>
                            {startDate=='2000-01-01'&&endDate=='2099-01-01'?<DatePicker.RangePicker onChange={changeDate}/>:<DatePicker.RangePicker onChange={changeDate} defaultValue={[dayjs(startDate),dayjs(endDate)]}/>}
                        </Space.Compact>
                        <Button type="primary" onClick={sousuo}>
                            搜索
                        </Button>
                    </Space>
                </List.Item>
            </List>
            <Table
                columns={columns}
                rowKey={(columns) => columns.id}
                pagination={false}
                dataSource={props.list}
                size='small'
                rowClassName={(record, index) =>
                    index % 2 === 1 ? 'tbodd' : 'tbeven'
                }
            />
            {props.count?<Pagination total={props.count.count} showSizeChanger pageSize={pageSize} current={page}  onChange={onChange} pageSizeOptions={[50,100,500,1000,10000]}/>:''}
        </Spin>
    )
}
const mapStateToProps = (state: any) => ({
    list: state.TurnoverRate.list,
    count: state.TurnoverRate.count,

});
export default connect(mapStateToProps)(TurnoverRate);
