import {Button, Form, Input, List, Pagination, Space, Table, Tag, Tooltip} from "antd";
import {connect,history,useLocation} from "umi";
import {useEffect, useState} from "react";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import {calculateSums, checkSessionStorage, fuzzySearch, updateSessionStorage} from "@/utils/OpenTool";

const Zuhuguanlian=(props:any)=>{
    const location=useLocation();
    // 姓名
    const [name,setName]=useState(checkSessionStorage('/kehu/zuhuguanlian/','name')||'');
    // 手机号
    const [phone,setPhone]=useState(checkSessionStorage('/kehu/zuhuguanlian/','phone')||'');
    // 页数
    const [page,setPage]=useState(1);
    // 每页数量
    const [pagecount,setpagecount]=useState(50);
    // 单元名称
    const [unitName,setunitName]=useState('');
    // 展示的数据
    const [ZuhuList,setZuhuList]=useState([]);
    // 原数组
    const [oldZuhuList,setOldZuhuList]=useState([]);
    // 总条数
    const [count,setcount]=useState(0);
    // 公共押金
    const [depositSum,setdepositSum]=useState(0);
    // 账单金额
    const [billMoneySum,setbillMoneySum]=useState(0);
    // 积分
    const [integralSum,setintegralSum]=useState(0);
    // 余额
    const [balanceSum,setbalanceSum]=useState(0);
    const columns =[
        {
            title: '单元名称',
            dataIndex: 'unitList',
            key: 'unitList',
            sorter: {
                compare: (a, b) => {
                    // 获取 a 和 b 的 unitList 中第一个 unit_name
                    const aUnitName = a.unitList[0]?.unit_name || '';
                    const bUnitName = b.unitList[0]?.unit_name || '';

                    // 比较 unit_name
                    if (aUnitName < bUnitName) return -1;
                    if (aUnitName > bUnitName) return 1;
                    return 0;
                },
                multiple: 1,
            },
            width:200,
            render: (text:any, record:any) => {
                const limitedUnitList = record.unitList.slice(0, 2);
                return(
                        <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '100%' }}>
                            {limitedUnitList.map((item, index) => (
                                <span key={index}>{item.unit_name}{index < limitedUnitList.length - 1 ? ',' : ''}</span>
                            ))}
                            {/* 如果 unitList 数组长度大于 2，则显示省略号或其他提示 */}
                            {record.unitList.length > 2 && <span>...</span>}
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
            title: '联系方式',
            dataIndex: 'tenant_phone',
            key: 'tenant_phone',
        },
        {
            title: '身份证',
            dataIndex: 'tenant_card',
            key: 'tenant_card',
            width:250,
        },
        {
            title: '积分(分)',
            dataIndex: 'integral',
            key: 'integral',
            sorter: (a, b) => a.integral - b.integral,
            render:(text:any,record:any,)=>{
                return(
                    <div>
                        {record.integral.toFixed(2)}元
                    </div>
                )
            }
        },
        {
            title: '余额(元)',
            dataIndex: 'balance',
            key: 'balance',
            sorter: (a, b) => a.balance - b.balance,
            render:(text:any,record:any,)=>{
                return(
                    <div>
                        {record.balance.toFixed(2)}元
                    </div>
                )
            }
        },
        {
            title: '全部账单(元)',
            dataIndex: 'billMoney',
            key: 'billMoney',
            sorter: (a, b) => a.billMoney - b.billMoney,
            render:(text:any,record:any,)=>{
                return(
                    <div>
                        {record.billMoney.toFixed(2)}元
                    </div>
                )
            }
        },
        {
            title: '押金总和(元)',
            dataIndex: 'deposit',
            key: 'deposit',
            sorter: (a, b) => a.deposit - b.deposit,
            render:(text:any,record:any,)=>{
                return(
                    <div>
                        {record.deposit.toFixed(2)}元
                    </div>
                )
            }
        },
        // {
        //     title: '关联状态',
        //     dataIndex: 'userId',
        //     key: 'userId',
        //     render: (text:any, record:any) => {
        //         return(
        //             <Space>
        //                 {
        //                     record.userId?<Tag color='green'>已关联</Tag>:<Tag color='red'>用户未登录</Tag>
        //                 }
        //             </Space>
        //         )
        //     }
        // },
        {
            title: '操作',
            dataIndex: 'caoz',
            key: 'caoz',
            render: (text:any, record:any) => {
                return(
                    <Space>
                        <Button type='primary' onClick={()=>toguanlian(record.id)}>关联</Button>
                        <Button type='primary' onClick={()=>toyajinlist(record.id)}>押金列表</Button>
                    </Space>
                )
            }
        }
    ];
    // 去关联页面
    const toguanlian=(e:number)=>{
        history.push(`/kehu/byzhuhu?id=${e}`);
    };
    // 去关联页面
    const toyajinlist=(e:number)=>{
        history.push(`/kehu/yajinlist?id=${e}`);
    };
    useEffect(() => {
        logFenye();
    }, [page,pagecount]);
    // 分页
    const logFenye=()=>{
        props.dispatch({
            type:"BYZhuhu/fetch",
            payload:{page,name,phone,pagecount}
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                setZuhuList(res.Data.data);
                setOldZuhuList(res.Data.data);
                setcount(res.Data.count);
                setbalanceSum(res.Data.balanceSum);
                setbillMoneySum(res.Data.billMoneySum);
                setdepositSum(res.Data.depositSum);
                setintegralSum(res.Data.integralSum);
            }
        })
    };
    // 搜索按钮
    const shousuo=()=>{
        setPage(1);
        // logFenyeInfo();
        logFenye();
    };
    const onChange=(val:number,pageSize:number)=>{
        setPage(val);
        setpagecount(pageSize);
    };
    const chaxundanyuan=()=>{
        let a=fuzzySearch(oldZuhuList,unitName);
        setZuhuList(a);
        let b=calculateSums(a);
        setcount(a.length);
        setbalanceSum(b.balanceSum);
        setbillMoneySum(b.billMoneySum);
        setdepositSum(b.depositSum);
        setintegralSum(b.integralSum);
    };
    const changeName=(e:any)=>{
        setName(e.target.value);
        updateSessionStorage('/kehu/zuhuguanlian/','name',e.target.value);
    };
    const changePhone=(e:any)=>{
        setPhone(e.target.value);
        updateSessionStorage('/kehu/zuhuguanlian/','phone',e.target.value);
    };
    return(
        <div>
            <List>
                <List.Item>
                    <Space>
                        <Input
                            addonBefore="姓名:"
                            onChange={changeName}
                            value={name}
                        />
                        <Input
                            addonBefore="手机号:"
                            onChange={changePhone}
                            value={phone}
                        />
                        <Button type="primary" onClick={shousuo}>
                            搜索
                        </Button>
                    </Space>
                </List.Item>
                <List.Item>
                    <Space>
                        <Input
                            addonBefore="单元名称:"
                            onChange={(e)=>setunitName(e.target.value)}
                        />
                        <Button type="primary" onClick={chaxundanyuan}>
                            查询单元
                        </Button>
                    </Space>
                </List.Item>
            </List>
            <Table
                style={{border:'1px solid #ddd',borderRadius:'4px'}}
                columns={columns}
                size='small'
                rowKey={(columns) => columns.id}
                dataSource={ZuhuList}
                scroll={{x:1500,y:'60vh'}}
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
                                总人数:{count}人
                            </Table.Summary.Cell>
                            <Table.Summary.Cell index={0}>
                            </Table.Summary.Cell>
                            <Table.Summary.Cell index={0}>
                            </Table.Summary.Cell>
                            <Table.Summary.Cell index={6}>
                                {integralSum.toFixed(2)}分
                            </Table.Summary.Cell>
                            <Table.Summary.Cell index={5}>
                                {balanceSum.toFixed(2)}元
                            </Table.Summary.Cell>
                            <Table.Summary.Cell
                                index={7}
                            >
                                {billMoneySum.toFixed(2)}元
                            </Table.Summary.Cell>
                            <Table.Summary.Cell
                                index={8}
                            >
                                {depositSum.toFixed(2)}元
                            </Table.Summary.Cell>
                        </Table.Summary.Row>
                    </Table.Summary>
                )}
            />
            <Pagination showSizeChanger total={count} pageSize={pagecount} current={page}  onChange={onChange} pageSizeOptions={[50, 100, 500, 1000]}/>
        </div>
    )
}
const mapStateToProps = (state: any) => {
    return {
        ZuhuList: state.BYZhuhu.list,
        count: state.BYZhuhu.count,
    }
};
export default connect(mapStateToProps) (Zuhuguanlian)