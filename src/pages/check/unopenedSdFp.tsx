import {connect, history} from 'umi'
import {useEffect, useState} from "react";
import dayjs from "dayjs";
import {
    Button,
    DatePicker,
    Form,
    Image,
    Input,
    List,
    message,
    Modal,
    Pagination,
    Select,
    Space,
    Spin,
    Table,
    Tag
} from "antd";
import TypeCheckFp from "@/ModelTypes/TypeCheckFp";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import {checkSessionStorage, updateSessionStorage} from "@/utils/OpenTool";
const UnopenedSdFp=(props)=>{
    const [isLoading,setIsLoading]=useState(false);
    const [page,setPage]=useState(1);
    const [pageSize,setPageSize]=useState(50);
    const [type,settype]=useState(0);
    const [tenantr,settenantr]=useState(checkSessionStorage('/check/checkFp/','unopenedSdFpTenantr')||0);
    const [stutes,setstutes]=useState(checkSessionStorage('/check/checkFp/','unopenedSdFpStutes')||0);
    const [zuhuList,setZuhuList]=useState([]);
    const columns =[
        {
            title: '周期',
            dataIndex: 'created',
            key: 'created',
            render:(text:any,record:any,)=>{
                return(
                    <div>
                        {dayjs(record.monthBeginDate).format('YYYY-MM-DD')}至{dayjs(record.monthEndDate).format('YYYY-MM-DD')}
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
            title: '账单类型',
            dataIndex: 'consumptionType',
            key: 'consumptionType',
            render:(_:any,item:any)=>{
                let consumptionTypeText;
                switch (item.billType) {
                    case 1:
                        consumptionTypeText = <Tag style={{ color: '#4CAF50' }}>电费</Tag>;
                        break;
                    case 2:
                        consumptionTypeText = <Tag style={{ color: '#F44336' }}>水费</Tag>;
                        break;
                    default:
                        consumptionTypeText = <Tag style={{ color: '#777777' }}>未知类型</Tag>;
                }
                return (
                    consumptionTypeText
                );
            }
        },
        {
            title: '金额(元)',
            dataIndex: 'eleMoney',
            key: 'eleMoney',
            render:(_:any,item:any)=>{
                return(
                    <div>
                        {item.eleMoney.toFixed(2)}
                    </div>
                )
            }
        },
        {
            title: '状态',
            dataIndex: 'billStatus',
            key: 'billStatus',
            render:(_:any,item:any)=>{
                let consumptionTypeText;
                switch (item.billStatus) {
                    case 1:
                        consumptionTypeText = <Tag style={{ color: '#4CAF50' }}>未开票</Tag>;
                        break;
                    case 2:
                        consumptionTypeText = <Tag style={{ color: '#F44336' }}>已开票</Tag>;
                        break;
                    default:
                        consumptionTypeText = <Tag style={{ color: '#777777' }}>待审核</Tag>;
                }
                return (
                    consumptionTypeText
                );
            }
        }
    ];

    const getList=()=>{
      props.dispatch({
          type:'UnopenedSdFp/fetch',
          payload:{page,pageSize,tenantr,type,stutes}
      })
    };
    useEffect(() => {
        getList();
    }, [page,pageSize]);
    const changeStutes=(e)=>{
        setstutes(e);
        updateSessionStorage('/check/checkFp/','unopenedSdFpStutes',e);
    };
    useEffect(() => {
        logFenye();
    }, []);
    const logFenye=()=>{
        props.dispatch({
            type:"BYZhuhu/fetch",
            payload:{page:1,name:'',phone:'',pagecount:100000}
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                setZuhuList(res.Data);
            }
        })
    };
    const changeHouse=(e)=>{
        settenantr(e);
        updateSessionStorage('/check/checkFp/','unopenedSdFpTenantr',e);
    };
    const sousuo=()=>{
        getList();
    };
    return(
        <Spin spinning={isLoading}>
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
                                状态:
                            </div>
                            <Select
                                onChange={changeStutes}
                                value={stutes}
                                style={{ width: 120 }}
                                options={[
                                    { value: 0, label: '全部' },
                                    { value: 1, label: '未开票' },
                                    { value: 2, label: '已开票' },
                                    { value: 3, label: '待审核' },
                                ]}
                            />
                        </Space.Compact>
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
                                租户:
                            </div>
                            <Select
                                value={tenantr}
                                onChange={changeHouse}
                                showSearch
                                style={{ width: 500 }}
                                optionFilterProp="children"
                                filterOption={(input, option) => {
                                    // 假设每个 option 都有一个与数据项对应的 value 属性
                                    const item = zuhuList.find(unit => unit.id == option.value); // 您可能需要优化这个查找过程
                                    return item?.tenant_name?.toLowerCase().includes(input.toLowerCase());
                                }}
                            >
                                <Select.Option value={0} key={0}>
                                    全部
                                </Select.Option>
                                {zuhuList.map((item:any,index:any)=>{
                                    return(
                                        <Select.Option value={item.id} key={item.id}>
                                            {item.tenant_name}-{item.tenant_phone}
                                        </Select.Option>
                                    )
                                })}
                            </Select>
                        </Space.Compact>
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
                scroll={{y:'60vh'}}
                rowKey={(columns) => columns.id}
                dataSource={props.CheckFpList}
            />
        </Spin>
    )
}
const mapStateToProps = (state: any) => {
    return {
        CheckFpList: state.UnopenedSdFp.list,
        count:state.UnopenedSdFp.count
    }
};
export default connect(mapStateToProps) (UnopenedSdFp)