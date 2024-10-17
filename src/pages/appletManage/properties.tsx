import {Button, Image, List, Modal, Space, Spin, Table} from "antd";
import {useEffect, useState} from "react";
import {history,connect} from "umi";
import * as PropertiesService from '@/services/properties';
const Properties=(props:any)=>{
    const [loading, setLoading] = useState(false);
    // 打开删除的弹窗
    const [isopen,setIsopen]=useState(false)
    // 删除楼盘的id
    const [deleteID,setDeleteID]=useState<number|undefined>()
    // 楼盘底下的房源
    const [fangyuanlist,setFangyuanList]=useState([])

    const columns=[
        {
            title: '楼盘标题',
            dataIndex: 'properties_title',
        },
        {
            title: '缩省图',
            dataIndex: 'properties_image',
            render: (text: any, record: any) => (
                <Image src={text} style={{width:'50px',height:'50px'}}/>
            ),
        },
        {
            title: '显示在小程序',
            dataIndex: 'properties_status',
            render: (text: any, record: any) => (
                <div>
                    {text?<span style={{color:'green'}}>是</span>:<span style={{color:'red'}}>否</span>}
                </div>
            ),
        },
        {
            title: '操作',//简单常用操作放这里，复杂放详情
            dataIndex: 'operation',
            render: (_: any, record: any) => (
                <Space>
                    <Button type='primary' onClick={()=>{history.push(`/appletManage/editProperties/?id=${record.id}`)}}>编辑</Button>
                    <Button type='primary' danger onClick={()=>isDelete(record.id)}>删除</Button>
                </Space>
            ),
        },
    ];
    useEffect(() => {
        console.log(props)
    }, []);
    const isDelete=async (e:number)=>{
        setDeleteID(e)
        let res:any=await PropertiesService.getHouse(e)
        if (res.ErrorCode==0){
            setFangyuanList(res.Data)
        }
        setIsopen(true)
    }

    const toadd=()=>{
        history.push('/appletManage/addProperties')
    }
    // 强制删除
    const setOK=async ()=>{
       let res=await props.dispatch({
           type:'Properties/remove',
           payload:deleteID
       })
        if (res.ErrorCode==0){
            setIsopen(false)
        }
    }

    return (
        <Spin spinning={loading}>
            <List>
                <List.Item>
                    <div>
                        <Button type="primary" onClick={toadd}>
                            新增楼盘
                        </Button>
                    </div>
                </List.Item>
            </List>
            <Table
                columns={columns}
                rowKey={(columns) => columns.id}
                pagination={false}
                dataSource={props.PropertiesList}
                scroll={{y:'70vh'}}
                rowClassName={(record, index) =>
                    index % 2 === 1 ? 'tbodd' : 'tbeven'
                }
            />
            <Modal open={isopen} onOk={setOK} onCancel={()=>setIsopen(false)}>
                {
                    fangyuanlist&&fangyuanlist.length>0?(<div><h3>该楼盘绑定以下房源，确定要强制删除吗?</h3>{fangyuanlist.map(item=><div>{item}</div>)}</div>):(<div>该楼盘未有房源可以直接删除</div>)
                }
            </Modal>
        </Spin>
    )
}
const mapStateToProps = (state: any) => {
    return {
        PropertiesList: state.Properties.list
    }
};
export default  connect(mapStateToProps)(Properties)