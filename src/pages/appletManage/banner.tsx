import {Button, Form, Image, Input, List, message, Modal, Space, Spin, Table} from "antd";
import {useEffect, useState} from "react";
import {history,connect} from "umi";
import BannerType from '@/ModelTypes/TypeBanner';
const Banner=(props:any)=>{
    const [loading, setLoading] = useState(false);
    // 需要删除的id
    const [uid,setUid]=useState(0);
    const [isOpen,setIsOpen]=useState(false)
    const columns=[
        {
            title: 'ID',
            dataIndex: 'id',
            render: (text: any, record: any) => (
                <Button type="link" onClick={()=>toEdit(record)}>{text}</Button>
            ),
        },
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
            title: '显示在小程序',
            dataIndex: 'carouselStatus',
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
                    <Button type='primary' danger onClick={()=>isdelete(record.id)}>删除</Button>
                </Space>
            ),
        },
    ]

    // 删除的弹窗
    const isdelete=async (e:number)=>{
        setUid(e)
        setIsOpen(true)
    };
    // 确定删除
    const determineDelete=async ()=>{
        let res=await props.dispatch({
            type:'Banner/remove',
            payload:uid
        })
        if (res.ErrorCode==0){
            message.success('删除成功');
            setIsOpen(false);
        }else {
            message.error(res.Data)
        }
    };
    const toadd=()=>{
        history.push('/appletManage/addBanner')
    };
    const toEdit=(e:BannerType)=>{
        history.push(`/appletManage/editBanner?id=${e.id}`)
    };
    useEffect(() => {
        console.log(props)
    }, []);
    // const onFinish=(vals:any)=>{
    //     console.log("vals",vals);
    // };
    return(
        <Spin spinning={loading}>
            <List>
                <List.Item>
                    <div>
                        <Button type="primary" onClick={toadd}>
                            新增轮播图
                        </Button>
                    </div>
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

            {/*<Form*/}
            {/*    onFinish={onFinish}*/}
            {/*>*/}
            {/*    <Form.Item name='Spflx' label='Spflx'>*/}
            {/*        <Input/>*/}
            {/*    </Form.Item>*/}
            {/*    <Form.Item name='Gmfdz' label='Gmfdz'>*/}
            {/*        <Input/>*/}
            {/*    </Form.Item>*/}
            {/*    <Form.Item name='Gmfkhh' label='Gmfkhh'>*/}
            {/*        <Input/>*/}
            {/*    </Form.Item>*/}
            {/*    <Form.Item name='Gmflxdh' label='Gmflxdh'>*/}
            {/*        <Input/>*/}
            {/*    </Form.Item>*/}
            {/*    <Form.Item name='Gmfmc' label='Gmfmc'>*/}
            {/*        <Input/>*/}
            {/*    </Form.Item>*/}
            {/*    <Form.Item name='Gmfnsrsbh' label='Gmfnsrsbh'>*/}
            {/*        <Input/>*/}
            {/*    </Form.Item>*/}
            {/*    <Form.Item name='Gmfyhzh' label='Gmfyhzh'>*/}
            {/*        <Input/>*/}
            {/*    </Form.Item>*/}
            {/*    <Form.Item name='Fpjfyx' label='Fpjfyx'>*/}
            {/*        <Input/>*/}
            {/*    </Form.Item>*/}
            {/*    <Form.Item name='Kprsjhm' label='Kprsjhm'>*/}
            {/*        <Input/>*/}
            {/*    </Form.Item>*/}
            {/*    <Form.Item name='Ly' label='Ly'>*/}
            {/*        <Input/>*/}
            {/*    </Form.Item>*/}
            {/*    <Form.Item name='isJyxxEwm' label='isJyxxEwm'>*/}
            {/*        <Input/>*/}
            {/*    </Form.Item>*/}
            {/*    <Form.Item name='Ywlsh' label='Ywlsh'>*/}
            {/*        <Input/>*/}
            {/*    </Form.Item>*/}
            {/*    <Form.Item name='isJcxxEwm' label='isJcxxEwm'>*/}
            {/*        <Input/>*/}
            {/*    </Form.Item>*/}
            {/*</Form>*/}
        </Spin>
    )
}
const mapStateToProps = (state: any) => {
    return {
        BanneriList: state.Banner.list
    }
};
export default  connect(mapStateToProps) (Banner)