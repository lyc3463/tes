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
import ImageUploader from "@/components/ImageUploader";
import id from "ajv/lib/vocabularies/core/id";
import {checkSessionStorage, updateSessionStorage} from "@/utils/OpenTool";
const UnopenedAllFp=(props)=>{
    const [isLoading,setIsLoading]=useState(false);
    const [page,setPage]=useState(1);
    const [pageSize,setPageSize]=useState(50);
    const [type,settype]=useState(checkSessionStorage('/check/checkFp/','unopenedAllFptype')||0);
    const [tenantr,settenantr]=useState(checkSessionStorage('/check/checkFp/','unopenedAllFpTenantr')||0);
    const [stutes,setstutes]=useState(checkSessionStorage('/check/checkFp/','unopenedAllFpStutes')||0);
    const [zuhuList,setZuhuList]=useState([]);
    const [name,setName]=useState(checkSessionStorage('/check/checkFp/','unopenedAllFpName')||'');
    const [setzuhuId,setsetzuhuId]=useState(0);
    const columns =[
        {
            title: '日期',
            dataIndex: 'consumptionDate',
            key: 'consumptionDate',
            render:(text:any,record:any,)=>{
                return(
                    <div>
                        {dayjs(record.consumptionDate).format('YYYY-MM-DD')}
                    </div>
                )
            }
        },
        {
            title: '租户姓名',
            dataIndex: 'user_name',
            key: 'user_name',
        },
        {
            title: '账单类型',
            dataIndex: 'consumptionType',
            key: 'consumptionType',
            render:(_:any,item:any)=>{
                let consumptionTypeText;
                switch (item.consumptionType) {
                    case 1:
                        consumptionTypeText = <Tag style={{ color: '#4CAF50' }}>微信充值</Tag>;
                        break;
                    case 2:
                        consumptionTypeText = <Tag style={{ color: '#F44336' }}>租金</Tag>;
                        break;
                    case 3:
                        consumptionTypeText = <Tag style={{ color: '#2196F3' }}>电费</Tag>;
                        break;
                    case 4:
                        consumptionTypeText = <Tag style={{ color: '#FFC107' }}>水费</Tag>;
                        break;
                    case 5:
                        consumptionTypeText = <Tag style={{ color: '#9C27B0' }}>公共缴费</Tag>;
                        break;
                    case 6:
                        consumptionTypeText = <Tag style={{ color: '#E91E63' }}>手动充值</Tag>;
                        break;
                    case 7:
                        consumptionTypeText = <Tag style={{ color: '#795548' }}>损耗</Tag>;
                        break;
                    case 8:
                        consumptionTypeText = <Tag style={{ color: '#795548' }}>违约金</Tag>;
                        break;
                    case 9:
                        consumptionTypeText = <Tag style={{ color: '#795588' }}>月保</Tag>;
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
            dataIndex: 'consumptionMoney',
            key: 'consumptionMoney',
            render:(_:any,item:any)=>{
                return(
                    <div>
                        {item.consumptionMoney.toFixed(2)}
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
            type:'UnopenedAllFp/fetch',
            payload:{page,pageSize,tenantr,type,stutes,name}
        })
    };
    const getfyInfo=()=>{
        props.dispatch({
            type:'UnopenedAllFp/fenye',
            payload:{pageSize,tenantr,type,stutes,name}
        })
    };
    useEffect(() => {
        getList();
    }, [page,pageSize]);
    const changeStutes=(e)=>{
        setstutes(e);
        updateSessionStorage('/check/checkFp/','unopenedAllFpStutes',e);
    };
    useEffect(() => {
        // logFenye();
        getfyInfo();
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
    const  findItemById=(list, id)=> {
        return list.find(item => item.id === id) || null;
    }
    const changeHouse=(e)=>{
        setsetzuhuId(e);
        let a=findItemById(zuhuList,e);
        settenantr(a.userId);
        updateSessionStorage('/check/checkFp/','unopenedAllFpTenantr',a.userId);
    };
    const sousuo=()=>{
        setPage(1);
        getList();
        getfyInfo();
    };
    const onChange=(e:number,pageSizez:number)=>{
        setPage(e);
        setPageSize(pageSizez);
    };
    const changeType=(e)=>{
        settype(e);
        updateSessionStorage('/check/checkFp/','unopenedAllFptype',e);
    };
    const changeName=(e)=>{
        setName(e.target.value);
        updateSessionStorage('/check/checkFp/','unopenedAllFpName',e.target.value);
    };
    return(
        <Spin spinning={isLoading}>
            <List>
                <List.Item>
                    <Space>
                        <Input
                            style={{ width: 300 }}
                            addonBefore="名称:"
                            value={name}
                            onChange={changeName}
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
                                类型:
                            </div>
                            <Select
                                onChange={changeType}
                                value={type}
                                style={{ width: 120 }}
                                options={[
                                    { value:0, label: '全部' },
                                    { value:2, label: '租金' },
                                    { value:5, label: '公共缴费' },
                                    { value:7, label: '服务费' },
                                    { value:8, label: '违约金' },
                                    { value:9, label: '月保' },
                                ]}
                            />
                        </Space.Compact>
                        {/*<Space.Compact>*/}
                        {/*    <div*/}
                        {/*        style={{*/}
                        {/*            borderRadius: '6px',*/}
                        {/*            borderStartEndRadius: 0,*/}
                        {/*            borderEndEndRadius: 0,*/}
                        {/*            padding: '0 11px',*/}
                        {/*            border: '1px solid #d9d9d9',*/}
                        {/*            display: 'flex',*/}
                        {/*            alignItems: 'center',*/}
                        {/*            borderInlineEnd: 0,*/}
                        {/*        }}*/}
                        {/*    >*/}
                        {/*        租户:*/}
                        {/*    </div>*/}
                        {/*    <Select*/}
                        {/*        value={setzuhuId}*/}
                        {/*        onChange={changeHouse}*/}
                        {/*        showSearch*/}
                        {/*        style={{ width: 300 }}*/}
                        {/*        optionFilterProp="children"*/}
                        {/*        filterOption={(input, option) => {*/}
                        {/*            // 假设每个 option 都有一个与数据项对应的 value 属性*/}
                        {/*            const item = zuhuList.find(unit => unit.id == option.value); // 您可能需要优化这个查找过程*/}
                        {/*            return item?.tenant_name?.toLowerCase().includes(input.toLowerCase());*/}
                        {/*        }}*/}
                        {/*    >*/}
                        {/*        <Select.Option value={0} key={0}>*/}
                        {/*            全部*/}
                        {/*        </Select.Option>*/}
                        {/*        {zuhuList.map((item:any,index:any)=>{*/}
                        {/*            return(*/}
                        {/*                <Select.Option value={item.id} key={item.id}>*/}
                        {/*                    {item.tenant_name}-{item.tenant_phone}*/}
                        {/*                </Select.Option>*/}
                        {/*            )*/}
                        {/*        })}*/}
                        {/*    </Select>*/}
                        {/*</Space.Compact>*/}
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
                            <Table.Summary.Cell
                                index={7}
                            >
                                {props.count?props.count.moneySum.toFixed(2):''}元
                            </Table.Summary.Cell>
                        </Table.Summary.Row>
                    </Table.Summary>
                )}
            />
            {props.count?<Pagination total={props.count.count} showSizeChanger pageSize={pageSize} current={page}  onChange={onChange} pageSizeOptions={[50,100,500,1000,10000]}/>:''}
        </Spin>
    )
}
const mapStateToProps = (state: any) => {
    return {
        CheckFpList: state.UnopenedAllFp.list,
        count:state.UnopenedAllFp.count
    }
};
export default connect(mapStateToProps) (UnopenedAllFp)