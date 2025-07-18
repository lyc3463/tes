import {Button, Input, InputNumber, List, message, Modal, Pagination, Space, Spin, Table, Tag} from "antd";
import {connect,history} from "umi";
import {useEffect, useState} from "react";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import dayjs from "dayjs";
import {checkSessionStorage, filterItemsWithUnitList, fuzzySearch, updateSessionStorage} from "@/utils/OpenTool";

const HouseBill=(props:any)=>{
    const [name,setName]=useState(checkSessionStorage('/houseManage/houseBill/','name')||'');
    const [phone,setPhone]=useState(checkSessionStorage('/houseManage/houseBill/','phone')||'');
    const [page,setPage]=useState(1);
    const [count,setcount]=useState(1);
    const [pagecount,setpagecount]=useState(10000);
    const [zuhuList,setZuhuList]=useState([]);
    const [unitName,setunitName]=useState('');
    const [oldList,setOldList]=useState([]);
    useEffect(() => {
        getFenye();
    }, []);
    useEffect(() => {
        logFenye();
    }, [page,pagecount]);
    // 分页
    const logFenye=()=>{
        if (name==''&&phone==''){
            props.dispatch({
                type:"BYZhuhu/fetch",
                payload:{page,name,phone,pagecount}
            }).then((res:TypeErrorCode)=>{
                if (res.ErrorCode==0){
                   let newArr= filterItemsWithUnitList(res.Data);
                    setZuhuList(newArr);
                    setOldList(newArr);
                }else {
                    message.error(res.Data);
                }
            })
        }else {
            props.dispatch({
                type:"BYZhuhu/fetch",
                payload:{page,name,phone,pagecount}
            }).then((res:TypeErrorCode)=>{
                if (res.ErrorCode==0){
                    setZuhuList(res.Data);
                    setOldList(res.Data);
                }else {
                    message.error(res.Data);
                }
            })
        }
    };
    // 搜索按钮
    const shousuo=()=>{
        setPage(1);
        getFenye();
        logFenye();
    };
    const onChange=(val:number,pageSize:number)=>{
        setPage(val);
        setpagecount(pageSize);
    };
    const getFenye=()=>{
        props.dispatch({
            type:'BYZhuhu/fenye',
            payload:{name,phone,pagecount}
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                setcount(res.Data.count);
            }
        });
    };
    const columns =[
        {
            title: '单元名称',
            dataIndex: 'unitList',
            key: 'unitList',
            width:300,
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
            width:300,
            render: (text:any, record:any) => {
                return(
                    <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '100%' }}>
                        {record.tenant_name}
                    </div>
                )
            }
        },
        {
            title: '联系方式',
            dataIndex: 'tenant_phone',
            key: 'tenant_phone',
            width:300,
        },
        {
            title: '操作',
            dataIndex: 'caoz',
            key: 'caoz',
            render: (text:any, record:any) => {
                return(
                    <Space>
                        <Button type='primary' onClick={()=>toinfo(record.id)}>详情</Button>
                    </Space>
                )
            }
        }
    ];
    const toinfo=(e)=>{
        history.push(`/houseManage/tennerBill?id=${e}`)
    };
    const changeName=(e)=>{
        setName(e.target.value);
        updateSessionStorage('/houseManage/houseBill/','name',e.target.value);
    };
    const changePhone=(e)=>{
        setPhone(e.target.value);
        updateSessionStorage('/houseManage/houseBill/','phone',e.target.value);
    };
    const chaxundanyuan=()=>{
        let a=fuzzySearch(oldList,unitName);
        setZuhuList(a);
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
                dataSource={zuhuList}
                scroll={{y:'60vh'}}
                pagination={false}
            />
           <Pagination total={count} pageSize={pagecount} current={page}  onChange={onChange}  showSizeChanger  />
        </div>
    )
};
const mapStateToProps = (state: any) => {
    return {
        ZuhuList: state.BYZhuhu.list,
    }
};
export default connect(mapStateToProps) (HouseBill)