import {
    connect,
    ConnectProps,
    history,
    Link,
  } from 'umi';
import TypeGongsi from "@/ModelTypes/TypeGongsi";
import {Button, Input, List, message, Modal, Pagination, Select, Space, Spin, Table, Tag} from "antd";
import {useEffect, useState} from "react";
import {StaticInfo} from "@/StaticInfo";
function Gongsiguanli(props: any) {
    const [loading, setLoading] = useState(false);
    // 当前页数
    const [page,setPage]=useState(1);
    const [pageSize,setPageSize]=useState(50);
    // 参数名称
    const [cname,setCname]=useState(sessionStorage.getItem('xiangmuGongsiguanliCname')||'');
    // 收费类型
    const [feetype,setFeetype]=useState(0);
    // 删除的弹窗
    const [open,setOpen]=useState(false);
    // ID
    const [uid,setUid]=useState(0);
    // 删除的名字
    const [uname,setUname]=useState('');
    // 用户权限
    const [uqx,setUqx]=useState([]);
    const columns = [
        {
            title: '名称',
            dataIndex: 'item_name',
        },
        {
            title: '收费类型',
            dataIndex: 'itemType',
            render: (text: any, record: any) =>{
                let displayText;
                switch (record.itemType) {
                    case 1:
                        displayText = <Tag color='green'>周期性收费</Tag>;
                        break;
                    case 2:
                        displayText =  <Tag color='blue'>一次性收费</Tag>;
                        break;
                    case 3:
                        displayText = <Tag color='cyan'>押金类收费</Tag>;
                        break;
                    default:
                        displayText = text || <Tag color='red'>未知类型</Tag>;
                }
                return displayText;
            }
        },
        {
            title: '月金额计算方式',
            dataIndex: 'monthly_amount',
            render: (text: any, record: any) =>{
                let displayText;
                switch (record.monthly_amount) {
                    case 1:
                        displayText = <Tag color='pink'>固定金额</Tag>;
                        break;
                    case 2:
                        displayText =  <Tag color='blue'>按单价收费</Tag>;
                        break;
                    case 3:
                        displayText = <Tag color='cyan'>每户手动输入</Tag>;
                        break;
                    default:
                        displayText = text || <Tag color='red'>未知类型</Tag>;
                }
                return displayText;
            }
        },
        {
            title: '操作',//简单常用操作放这里，复杂放详情
            dataIndex: 'operation',
            render: (_: any, record: any) => (
                <Space>
                    {uqx[171]=='1'?<Button type="primary" danger onClick={()=>deteleOpen(record)}>删除</Button>:''}
                    {uqx[170]=='1'?<Button type="primary" onClick={()=>toedit(record.id)}>编辑</Button>:''}
                </Space>
            ),
        },
    ];
    const tianjia = () => {
        history.push('/xiangmu/addgongsi/')
    };
    const toedit=(e:number)=>{
        history.push(`/xiangmu/editShoufei?id=${e}`)
    };
    // 监听收费项目名称
    const changeName=(e)=>{
        setCname(e.target.value);
        sessionStorage.setItem('xiangmuGongsiguanliCname',e.target.value);
    };
    // 监听收费类型
    const changeType=(e)=>{
        setFeetype(e)
    };
    // 搜索
    const sousuo=()=>{
        setPage(1);
        getFyInfo();
        logFenye();
    };
    const getFyInfo=()=>{
        props.dispatch({
            type:'Gongsi/shousuo',
            payload:{page,cname,feetype,pageSize}
        });
    };
    // 分页
    const logFenye=()=>{
        props.dispatch({
            type:"Gongsi/fetch",
            payload:{page,cname,feetype,pageSize}
        })
    };
    // 监听页数
    const onChange=(e:number,pageSize:number)=>{
        setPage(e);
        setPageSize(pageSize);
    };
    useEffect(() => {
        logFenye();
    }, [page]);
    useEffect(() => {
        getFyInfo();
    }, []);
    const deteleOpen=(e)=>{
        setUid(e.id);
        setUname(e.item_name);
        setOpen(true);
    };
    const onOk=()=>{
        props.dispatch({
            type:"Gongsi/remove",
            payload:uid
        }).then((res:any)=>{
            if (res.ErrorCode==0){
                message.success('删除成功');
                setOpen(false)
            }else {
                message.error(res.Data)
            }
        })
    };
    useEffect(() => {
        let uq=StaticInfo.uqx.split('');
        setUqx(uq);
    }, []);
    return (
        <>
            <Spin spinning={loading}>
                <List>
                    <List.Item>
                        <div>
                            {uqx[169]=='1'?<Button type="primary" onClick={tianjia}>创建收费项目</Button>:''}
                        </div> 
                        <Space>
                            <Input
                                onChange={changeName}
                                addonBefore="收费项目名称:"
                                value={cname}
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
                                    收费类型:
                                </div>
                                <Select
                                    onChange={changeType}
                                    defaultValue={0}
                                    style={{ width: 120 }}
                                    options={[
                                        { value: 0, label: '全部' },
                                        { value: 1, label: '周期收费' },
                                        { value: 2, label: '一次性收费' },
                                        { value: 3, label: '押金类收费' },
                                    ]}
                                />
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
                    dataSource={props.GongsiList}
                    pagination={false}
                    size='small'
                    scroll={{y:'60vh'}}
                    rowClassName={(record, index) =>
                        index % 2 === 1 ? 'tbodd' : 'tbeven'
                    }
                />
                {props.count?<Pagination total={props.count.count} showSizeChanger pageSize={pageSize} current={page}  onChange={onChange} pageSizeOptions={[50,100,500,1000,10000]}/>:''}
                {/*删除的弹窗*/}
                <Modal open={open} onCancel={()=>setOpen(false)} title='删除收费项目' onOk={onOk}>
                    <div>
                        <span>是否要删除：<span style={{color:'red'}}>{uname}</span></span>
                    </div>
                </Modal>
            </Spin>
        </>
    );
}


const mapStateToProps = (state: any) => {
    return {
        GongsiList: state.Gongsi.list,
        count: state.Gongsi.count
    }
};

export default connect(mapStateToProps)(Gongsiguanli);

