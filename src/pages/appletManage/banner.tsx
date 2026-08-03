import {Button, Form, Image, Input, List, message, Modal, Space, Spin, Table} from "antd";
import {useEffect, useState} from "react";
import {history,connect} from "umi";
import BannerType from '@/ModelTypes/TypeBanner';
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import {StaticInfo} from "@/StaticInfo";
const Banner=(props:any)=>{
    const [loading, setLoading] = useState(false);
    // 需要删除的id
    const [uid,setUid]=useState(0);
    const [isOpen,setIsOpen]=useState(false);
    const [name,setName]=useState('');
    // 用户权限
    const [uqx,setUqx]=useState([]);
    const columns=[
        {
            title: '轮播图编号',
            dataIndex: 'carousel_name',
        },
        {
            title: '图片',
            dataIndex: 'carousel_image',
            render: (text: any, record: any) => (
                <Image src={text} style={{width:"50px",height:'50px'}}/>
            ),
        },

        {
            title: '操作',//简单常用操作放这里，复杂放详情
            dataIndex: 'operation',
            render: (_: any, record: any) => (
                <Space>
                    {uqx[121]=='1'?<Button type='primary' danger onClick={()=>isdelete(record.id)}>删除</Button> :''}
                    {uqx[122]=='1'?<Button type='primary'  onClick={()=>toEdit(record)}>编辑</Button> :''}
                </Space>
            ),
        },
    ];

    // 删除的弹窗
    const isdelete=async (e:number)=>{
        setUid(e)
        setIsOpen(true)
    };
    // 确定删除
    const determineDelete= ()=>{
        setLoading(true);
        props.dispatch({
            type:'Banner/remove',
            payload:uid
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                message.success('删除成功');
                setIsOpen(false);
                setLoading(false);
            }else {
                message.error(res.Data)
                setLoading(false);
            }
        })
    };
    const toadd=()=>{
        history.push('/appletManage/addBanner');
    };
    const toEdit=(e:BannerType)=>{
        history.push(`/appletManage/editBanner?id=${e.id}`);
    };
    useEffect(() => {
        logfenye();
    }, []);
    const sousuo=()=>{
        logfenye();
        console.log('props',props);
    };
    const logfenye=()=>{
        props.dispatch({
            type:'Banner/fetch',
            payload:{name}
        })
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
                        {uqx[120]=='1'?<Button type="primary" onClick={toadd}>新增轮播图</Button> :''}
                    </div>
                    <Space>
                        <Input
                            onChange={(e)=>setName(e.target.value)}
                            addonBefore="轮播图编号:"
                        />
                        <Button type='primary' onClick={sousuo}>搜索</Button>
                    </Space>
                </List.Item>
            </List>
            <Table
                columns={columns}
                rowKey={(columns) => columns.id}
                pagination={false}
                dataSource={props.BanneriList}
                scroll={{y:'70vh'}}
                rowClassName={(record, index) =>
                    index % 2 === 1 ? 'tbodd' : 'tbeven'
                }
            />
        {/*    删除的弹窗*/}
            <Modal open={isOpen} onOk={determineDelete} onCancel={()=>setIsOpen(false)}>
                确定要删除当前轮播图吗？
            </Modal>
        </Spin>
    )
}
const mapStateToProps = (state: any) => {
    return {
        BanneriList: state.Banner.list
    }
};
export default  connect(mapStateToProps) (Banner)