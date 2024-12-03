import {useEffect, useState} from "react";
import {Button, Image, Input, List, message, Modal, Space, Spin, Table, Tag} from "antd";
import {connect,history} from "umi";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";

const WenjuanList=(props)=>{
    const [loading, setLoading] = useState(false);
    const [name,setName]=useState('');
    const [is_enable,setis_enable]=useState(2);
    const [uid,setUid]=useState(0);
    // 启用的弹窗
    const [isOpen,setIsOpen]=useState(false);
    // 停用的弹窗
    const [isopenT,setisopenT]=useState(false);
    const toadd=()=>{
        history.push('/appletManage/addWenjuan');
    };
    const sousuo=()=>{

    };
    useEffect(() => {
        logfenye();
        console.log(props);
    }, []);
    const logfenye=()=>{
      props.dispatch({
          type:"Wenjuan/fetch",
          payload:{name,is_enable}
      })
    };
    const toedit=(e:number)=>{
      history.push(`/appletManage/editWenjuan?id=${e}`);
    };
    const columns=[
        {
            title: '问卷名称',
            dataIndex: 'questName',
        },
        {
            title: '问卷状态',
            dataIndex: 'is_enable',
            render: (_: any, record: any) => (
                <Space>
                    {record.is_enable==0?<Tag color='red'>未启用</Tag>:<Tag color='blue'>已启用</Tag>}
                </Space>
            ),
        },
        {
            title: '操作',//简单常用操作放这里，复杂放详情
            dataIndex: 'operation',
            render: (_: any, record: any) => (
                <Space>
                    {record.is_enable==0?<Button type='primary' onClick={()=>onOn(record.id)}>启用</Button>:<Button type='primary' onClick={()=>onoff(record.id)}>停用</Button>}
                    <Button type='primary' danger>删除</Button>
                    <Button type='primary' onClick={()=>toedit(record.id)}>编辑</Button>
                </Space>
            ),
        },
    ];
    const onOn=(e:number)=>{
        setUid(e);
        setIsOpen(true);

    };
    // 启用的协议
    const onOnoK=()=>{
        setLoading(true);
        props.dispatch({
            type:'Wenjuan/offison',
            payload:{uid,is_enable:1}
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                message.success('启用成功');
                setIsOpen(false);
                setLoading(false)
            }else {
                message.error(res.Data);
                setIsOpen(false);
                setLoading(false)
            }
        })
    };
    // 停用弹窗
    const onoff=(e:number)=>{
        setUid(e);
        setisopenT(true);
    };
    const onoffok=()=>{
        setLoading(true);
        props.dispatch({
            type:'Wenjuan/offison',
            payload:{uid,is_enable:0}
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                message.success('停用成功');
                setisopenT(false);
                setLoading(false)
            }else {
                message.error(res.Data);
                setisopenT(false);
                setLoading(false)
            }
        })
    };
    return(
        <Spin spinning={loading}>
            <List>
                <List.Item>
                    <div>
                        <Button type="primary" onClick={toadd}>
                            新增问卷
                        </Button>
                    </div>
                    <Space>
                        <Input
                            onChange={(e)=>setName(e.target.value)}
                            addonBefore="问卷名称:"
                        />
                        <Button type='primary' onClick={sousuo}>搜索</Button>
                    </Space>
                </List.Item>
            </List>
            <Table
                columns={columns}
                rowKey={(columns) => columns.id}
                pagination={false}
                dataSource={props.WenjuanList}
                scroll={{y:'70vh'}}
                rowClassName={(record, index) =>
                    index % 2 === 1 ? 'tbodd' : 'tbeven'
                }
            />
                {/*启用的弹窗*/}
            <Modal open={isOpen} onOk={onOnoK} onCancel={()=>setIsOpen(false)}>
                是否要启用问卷
            </Modal>
            {/*停用的弹窗*/}
            <Modal open={isopenT} onOk={onoffok} onCancel={()=>setisopenT(false)}>
                是否要停用问卷
            </Modal>
        </Spin>
    )
}
const mapStateToProps = (state: any) => {
    return {
        WenjuanList: state.Wenjuan.list
    }
};
export default connect(mapStateToProps)(WenjuanList)