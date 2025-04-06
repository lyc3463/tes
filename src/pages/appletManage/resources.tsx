import {Button, Image, Input, List, message, Modal, Pagination, Radio, Select, Space, Spin, Table} from "antd";
import {useEffect, useState} from "react";
import {connect,history} from "umi";
import * as ResourcesService from "@/services/resources";
import {StaticInfo} from "@/StaticInfo";

const Resources=(props)=>{
    const [loading, setLoading] = useState(false);
    // 当前页数
    const [page,setPage]=useState(1);
    // 房源类型  0办公 1商业 2全部
    const [houingType,setHouingType]=useState(2);
    //  房源状态  0上架 1下架 2全部
    const [houingStatus,setHouingStatus]=useState(2);
    // 最小租金
    const [beginRentHousing,setBeginRentHousing]=useState(0);
    //  最大租金
    const [endRentHousing,setEndRentHousing]=useState(9999999);
    // 最小平方
    const [beginPriceHousing,setBeginPriceHousing]=useState(0);
    // 最大平方
    const [endPriceHousing,setEndPriceHousing]=useState(9999999);
    // 删除的弹窗
    const [isDeleteOpen,setIsDeleteOpen]=useState(false);
    const [houesID,setHouesID]=useState(0)
    // 删除的id
    const [did,setDid]=useState(0);
    // 用户权限
    const [uqx,setUqx]=useState([]);
    const columns=[
        {
            title: '房源名称',
            dataIndex: 'housing_name',
        },
        {
            title: '图片',
            dataIndex: 'housing_image',
            render: (text: any, record: any) => (
                <Image src={record.housing_image} style={{width:'50px',height:'50px'}}/>
            ),
        },
        {
            title: '房源状态',
            dataIndex: 'housing_status',
            render: (text: any, record: any) => (
                <div>
                    {text?<span style={{color:'green'}}>上架</span>:<span style={{color:'red'}}>下架</span>}
                </div>
            ),
        },
        {
            title: '房源类型',
            dataIndex: 'housing_type',
            render: (text: any, record: any) => (
                <div>
                    {text?<span style={{color:'green'}}>商业</span>:<span style={{color:'red'}}>办公</span>}
                </div>
            ),
        },
        {
            title: '排序',
            dataIndex: 'sort',
        },
        {
            title: '操作',//简单常用操作放这里，复杂放详情
            dataIndex: 'operation',
            render: (_: any, record: any) => (
                <Space>
                    {uqx[128]=='1'?<Button type='primary' danger onClick={()=>deleteOpen(record.id)}>删除</Button> :''}
                    {uqx[127]=='1'?<Button type="primary" onClick={()=>history.push(`/appletManage/editResources?id=${record.id}`)}>编辑</Button> :''}
                </Space>
            ),
        },
    ];
    // 确定删除
    const onOk=async ()=>{
        let res:any=await ResourcesService.remove(did)
        if (res?.ErrorCode==0){
            message.success('删除成功')
            setIsDeleteOpen(false)
            props.dispatch({
                type:'Resources/fetch'
            })
        }else {
            message.error(res.Data)
        }
    };
    // 删除的弹窗
    const deleteOpen=(e:number)=>{
        setDid(e);
        setIsDeleteOpen(true)

    };
    const toadd=()=>{
        history.push('/appletManage/addResources')
    };
    useEffect(() => {
        logFenye();
    }, [page]);
    const onChange=(e)=>{
        setPage(e);
    };
    // 分页
    const logFenye=()=>{
        props.dispatch({
            type:"Resources/fetch",
            payload:{page,houingType,houingStatus,beginRentHousing,endRentHousing,beginPriceHousing,endPriceHousing,houesID}
        })
    };
    const changeType=(e)=>{
      setHouingType(e);
    };
    const changeStutes=(e)=>{
      setHouingStatus(e)
    };
    const sousuo=()=>{
      setPage(1);
        props.dispatch({
            type:"Resources/fetchFenye",
            payload:{page,houingType,houingStatus,beginRentHousing,endRentHousing,beginPriceHousing,endPriceHousing,houesID}
        })
      logFenye();
    };
    useEffect(() => {
        let uq=StaticInfo.uqx.split('');
        setUqx(uq);
    }, []);
    return(
        <Spin spinning={loading}>
            <List>
                <List.Item>
                    <div>
                        {uqx[126]=='1'?<Button type="primary" onClick={toadd}>新增房源</Button> :''}
                    </div>
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
                                房源类型:
                            </div>
                            <Select
                                onChange={changeType}
                                defaultValue={houingType}
                                style={{ width: 120 }}
                                options={[
                                    { value:2, label: '全部' },
                                    { value:0, label: '办公' },
                                    { value:1, label: '商业' },
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
                                房源状态:
                            </div>
                            <Select
                                onChange={changeStutes}
                                defaultValue={houingStatus}
                                style={{ width: 120 }}
                                options={[
                                    { value:2, label: '全部' },
                                    { value:1, label: '上架' },
                                    { value:0, label: '下架' },
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
                pagination={false}
                scroll={{y:'70vh'}}
                rowClassName={(record, index) =>
                    index % 2 === 1 ? 'tbodd' : 'tbeven'
                }
                dataSource={props.ResourcesList}
            />
            {props.count?<Pagination total={props.count.count} pageSize={50} current={page}  onChange={onChange} pageSizeOptions={[50]}/>:''}
            {/*删除的弹窗*/}
            <Modal open={isDeleteOpen} onCancel={()=>setIsDeleteOpen(false)} onOk={onOk}>
                是否要删除此数据
            </Modal>
        </Spin>
    )
}
const mapStateToProps = (state: any) => {
    return {
        ResourcesList: state.Resources.list,
        count:state.Resources.count
    }
};
export default connect(mapStateToProps) (Resources)