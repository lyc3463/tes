import {Button, Form, Input, Space, Table, Tag} from "antd";
import {connect,history} from 'umi'
import {getRandomNumber} from "@/utils/OpenTool";
const Water=(props:any)=>{
    let mathNumber=getRandomNumber(1,10)
    const columns =[
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: '标签',
            dataIndex: 'biaoqian',
            key: 'biaoqian',
        },
        {
            title: '采集器',
            dataIndex: 'caijiqi',
            key: 'caijiqi',
        },
        {
            title: '在线状态',
            dataIndex: 'zaixianstutes',
            key: 'zaixianstutes',

        },
        {
            title: '通讯质量',
            dataIndex: 'zhiliang',
            key: 'zhiliang',
            render:(_:any,record:any)=>{
                let quality;
                if (mathNumber <= 3) {
                    quality =<Tag color='red'>差</Tag>;
                } else if (mathNumber <= 6) {
                    quality = <Tag color='gold'>良</Tag>;
                } else {
                    quality = <Tag color='green'>好</Tag>;
                }
                return(
                    <>
                        {quality}
                    </>
                )
            }
        },
        {
            title: '通讯地址',
            dataIndex: 'dizhi',
            key: 'dizhi',
        },
        {
            title: '用户',
            dataIndex: 'user',
            key: 'user',
        },
        {
            title: '电表类型',
            dataIndex: 'type',
            key: 'type',
        },
        {
            title: '备注',
            dataIndex: 'beizhu',
            key: 'beizhu',
        },
        {
            title: '状态',
            dataIndex: 'stutes',
            key: 'stutes',
        },
        {
            title: '积累用水量',
            dataIndex: 'yongdian',
            key: 'yongdian',
        },
        {
            title: '操作',
            dataIndex: 'caozuo',
            key: 'caozuo',
            fixed: 'right',
            width: 200,
            render:(_:any,record:any)=>{
                return(
                    <>

                    </>
                )
            }
        }
    ]
    const toadd=()=>{
        history.push('/waterCableManage/addWater')
    }

    return(
        <div>
            <Form style={{backgroundColor:'#f5f5f5',padding:'10px',marginBottom:"20px",border:'1px solid #e3e3e3',borderRadius:'4px'}}>
                <div style={{display:'flex'}}>
                    <Space>
                        <Form.Item label='采集器ID'>
                            <Input placeholder='请输入采集器ID'/>
                        </Form.Item>
                        <Form.Item label='备注信息'>
                            <Input placeholder='备注信息'/>
                        </Form.Item>
                        <Form.Item>
                            <Button type='primary'>搜索</Button>
                        </Form.Item>
                    </Space>
                </div>
                <Button type='primary' onClick={toadd}>增加水表</Button>
            </Form>
            <Table columns={columns} style={{border:'1px solid #ddd',borderRadius:'4px'}} pagination={false}/>
        </div>
    )
}

export default  connect()(Water)