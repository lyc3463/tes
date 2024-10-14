import {Button, Input, List, Select, Space, Table} from "antd";

const MovementCable=()=>{
    const columns =[
        {
            title: '序号',
            dataIndex: 'xuhao',
            key: 'xuhao',
        },
        {
            title: '采集器编号',
            dataIndex: 'bianhao',
            key: 'bianhao',
        },
        {
            title: '通讯地址',
            dataIndex: 'dizhi',
            key: 'dizhi',
        },
        {
            title: '用户',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '抄表时间',
            dataIndex: 'caoshijian',
            key: 'caoshijian',
        },
        {
            title: '功能',
            dataIndex: 'gongneng',
            key: 'gongneng',
        },
        {
            title: '数据',
            dataIndex: 'shuju',
            key: 'shuju',
        },
        {
            title: '状态',
            dataIndex: 'stutes',
            key: 'stutes',
            fixed: 'right',
            render: (text:any, record:any) => {
                return(
                    <div>
                        {record.stutes===1?<span style={{color:'green'}}>已完成</span>:<span style={{color:'red'}}>未完成</span>}
                    </div>
                )
            },
        },
        {
            title: '操作',
            dataIndex: 'cao',
            key: 'cao',
            fixed: 'right',
            width: 200,
            render: (text:any, record:any) => {
                return(
                    <div>
                        {/*<a onClick={()=>{setDel(true)}}>删除</a>*/}
                        {/*<a onClick={()=>{setrz(true)}} style={{marginLeft:'5px'}}>抄表日志</a>*/}
                    </div>
                )
            },
        }
    ]
    return(
        <div>
            {/*<List>*/}
            {/*    <List.Item>*/}
            {/*        <div>*/}
            {/*            <Button type="primary">*/}
            {/*                创建收费项目*/}
            {/*            </Button>*/}
            {/*        </div>*/}
            {/*        <Space>*/}
            {/*            <Input*/}
            {/*                addonBefore="收费项目名称:"*/}
            {/*            />*/}
            {/*            <Space.Compact>*/}
            {/*                <div*/}
            {/*                    style={{*/}
            {/*                        borderRadius: '6px',*/}
            {/*                        borderStartEndRadius: 0,*/}
            {/*                        borderEndEndRadius: 0,*/}
            {/*                        padding: '0 11px',*/}
            {/*                        border: '1px solid #d9d9d9',*/}
            {/*                        display: 'flex',*/}
            {/*                        alignItems: 'center',*/}
            {/*                        borderInlineEnd: 0,*/}
            {/*                    }}*/}
            {/*                >*/}
            {/*                    收费类型:*/}
            {/*                </div>*/}
            {/*                <Select*/}
            {/*                    defaultValue="255"*/}
            {/*                    style={{ width: 120 }}*/}
            {/*                    options={[*/}
            {/*                        { value: '255', label: '全部' },*/}
            {/*                        { value: '1', label: '周期收费' },*/}
            {/*                        { value: '2', label: '一次性收费' },*/}
            {/*                        { value: '3', label: '押金类收费' },*/}
            {/*                    ]}*/}
            {/*                />*/}
            {/*            </Space.Compact>*/}
            {/*            <Button type="primary">*/}
            {/*                搜索*/}
            {/*            </Button>*/}
            {/*        </Space>*/}
            {/*    </List.Item>*/}
            {/*</List>*/}
            <Table
                columns={columns}
                rowKey={(columns) => columns.id}
                pagination={false}
                rowClassName={(record, index) =>
                    index % 2 === 1 ? 'tbodd' : 'tbeven'
                }
            />
        </div>
    )
}
export default MovementCable