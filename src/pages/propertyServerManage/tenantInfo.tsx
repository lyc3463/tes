import {Button, DatePicker, Input, List, Select, Space, Spin, Table} from "antd";
import {useState} from "react";
import {history,connect} from "umi";

const TenantInfo=(props:any)=>{
    const [loading,setLoading]=useState(false)

    const columns =[
        {
            title: '日期',
            dataIndex: 'data',
            key: 'data',
        },
        {
            title: '租户名称',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '消息内容',
            dataIndex: 'conten',
            key: 'conten',
        },
        {
            title: '操作',
            dataIndex: 'cao',
            key: 'cao',
            // render:(text:any,record:any)=>(
            //     <div>
            //         <a style={{marginRight:'10px'}} onClick={()=>setEdit(true)}>编辑</a>
            //         <a onClick={()=>setdel(true)} style={{color:'red'}}>删除
            //         </a>
            //     </div>
            // )
        }
    ]
    const toadd=()=>{
        history.push('/propertyServerManage/addTenantInfo')
    }
    return(
        <Spin spinning={loading}>
            <List>
                <List.Item>
                    <div>
                        <Button type="primary" onClick={toadd}>
                            通知用户
                        </Button>
                    </div>
                    <Space>
                        <Input
                            // onChange={cggsname}
                            addonBefore="租户名称:"
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
                                时间:
                            </div>
                            <DatePicker.RangePicker/>
                        </Space.Compact>
                        <Button type="primary" /*onClick={sousuo}*/>
                            搜索
                        </Button>
                    </Space>
                </List.Item>
            </List>
            <Table
                columns={columns}
                rowKey={(columns) => columns.id}
                pagination={false}
                // rowClassName={(record, index) =>
                //     index % 2 === 1 ? 'tbodd' : 'tbeven'
                // }
            />
        </Spin>
    )
}
export default connect() (TenantInfo)