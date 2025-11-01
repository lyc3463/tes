import {Button, DatePicker, Input, List, Space, Spin, Table} from "antd";
import {useState} from "react";

const SalesInfo=()=>{
    const [spinning,setSpinning]=useState(false);
    const columns=[
        {
            title:'销售日期',
            dataIndex:'name',
            key:'name',
        },
        {
            title:'销售单号',
            dataIndex:'number',
            key:'number',
        },
        {
            title:'出库仓库',
            dataIndex:'number',
            key:'number',
        },
        {
            title:'物品图片',
            dataIndex:'totalPrice',
            key:'totalPrice',
        },
        {
            title:'物品名称',
            dataIndex:'price',
            key:'price',
        },
        {
            title:'物品编码',
            dataIndex:'price',
            key:'price',
        },
        {
            title:'物品编码',
            dataIndex:'price',
            key:'price',
        },
        {
            title:'数量',
            dataIndex:'totalPrice',
            key:'totalPrice',
        },
        {
            title:'单价',
            dataIndex:'totalPrice',
            key:'totalPrice',
        },
        {
            title:'物品总价',
            dataIndex:'totalPrice',
            key:'totalPrice',
        },
        {
            title:'客户姓名',
            dataIndex:'price',
            key:'price',
        },
        {
            title:'客户联系方式',
            dataIndex:'price',
            key:'price',
        },
        {
            title:'备注',
            dataIndex:'remark',
            key:'remark',
        },
    ];
    return(
        <Spin spinning={spinning}>
            <List>
                <List.Item>
                    <Space>
                        <Input
                            addonBefore="仓库名称:"
                        />
                        <Input
                            addonBefore="单号:"
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
                                日期:
                            </div>
                            <DatePicker.RangePicker/>
                        </Space.Compact>
                        <Button type="primary" >
                            搜索
                        </Button>
                    </Space>
                </List.Item>
            </List>
            <Table
                columns={columns}
                style={{border:'1px solid #ddd',borderRadius:'4px'}}
                pagination={false}
                scroll={{y:'60vh'}}
                rowKey={(columns) => columns.id}
                size='small'
            />
        </Spin>
    )
}
export default SalesInfo;
