import {Button, Input, InputNumber, List, Modal, Pagination, Space, Spin, Table, Tag} from "antd";
import {connect,history} from "umi";
import {useEffect, useState} from "react";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import dayjs from "dayjs";

const HouseBill=(props:any)=>{
    const [name,setName]=useState(sessionStorage.getItem('houseManageHouseBillName')||'');
    const [phone,setPhone]=useState(sessionStorage.getItem('houseManageHouseBillPhone')||'');
    const [page,setPage]=useState(1);
    const [count,setcount]=useState(1);
    const [pagecount,setpagecount]=useState(50);
    useEffect(() => {
        shousuo();
    }, []);
    useEffect(() => {
        logFenye();
    }, [page]);
    // 分页
    const logFenye=()=>{
        props.dispatch({
            type:"Zuhu/fetch",
            payload:{page,name,phone,pagecount}
        })
    };
    // 搜索按钮
    const shousuo=()=>{
        setPage(1);
        props.dispatch({
            type:'Zuhu/fenye',
            payload:{name,phone,pagecount}
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                setcount(res.Data.count)
            }
        });
        logFenye()
    };
    const onChange=(val:number)=>{
        setPage(val)
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
        sessionStorage.setItem('houseManageHouseBillName',e.target.value);
    };
    const changePhone=(e)=>{
        setPhone(e.target.value);
        sessionStorage.setItem('houseManageHouseBillPhone',e.target.value);
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
            </List>
            <Table
                style={{border:'1px solid #ddd',borderRadius:'4px'}}
                columns={columns}
                size='small'
                rowKey={(columns) => columns.id}
                dataSource={props.ZuhuList}
                scroll={{y:'60vh'}}
                pagination={false}
            />
           <Pagination total={count} pageSize={50} current={page}  onChange={onChange} pageSizeOptions={[50]}/>
        </div>
    )
}
const mapStateToProps = (state: any) => {
    return {
        ZuhuList: state.Zuhu.list,

    }
};
export default connect(mapStateToProps) (HouseBill)