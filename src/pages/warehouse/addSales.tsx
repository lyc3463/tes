import {useNavigate} from "umi";
import {useState} from "react";
import {Button, DatePicker, Form, Input, List, Modal, Select, Space, Spin, Table} from "antd";

const AddSales=()=>{
     const navigate=useNavigate();
    const [spinning, setSpinning] = useState(false);
    const [form] = Form.useForm();
    const [open,setOpen]=useState(false);
    const onFinish=async (values)=>{

    };
    const openGoods=()=>{
        setOpen(true);
    };
    const columns = [
        {
            title: '物品名称',
            dataIndex: 'goods_name',
        },
        {
            title: '物品编号',
            dataIndex: 'goods_code',
        },
        {
            title: '助查码',
            dataIndex: 'goods_check_code',
        },
        {
            title: '单位',
            dataIndex: 'goods_unit',
        },
        {
            title: '库存',
            dataIndex: 'goods_num',
        },
    ];
    const columnsz = [
        {
            title: '物品名称',
            dataIndex: 'goods_name',
        },
        {
            title: '物品编号',
            dataIndex: 'goods_code',
        },
        {
            title: '单位',
            dataIndex: 'goods_unit',
        },
        {
            title: '数量',
            dataIndex: 'goods_num',
        },
        {
            title: '单价',
            dataIndex: 'goods_price',
        },
        {
            title: '价钱',
            dataIndex: 'goods_total_price',
        },
        {
            title: '剩余库存',
            dataIndex: 'goods_num',
        },
    ];
    const rowSelection = {

    };
    return(
        <Spin spinning={spinning}>
            <Space>
                <Button type="primary" onClick={()=>navigate(-1)}>
                    返回
                </Button>
                <Button type="primary" htmlType="submit">
                    添加
                </Button>
            </Space>
            <Space style={{display:'flex',justifyContent:'flex-start',alignItems:'center',marginTop:'10px'}}>
                <Input addonBefore="单号:" placeholder='随机生成' style={{width:'300px'}}/>
                <DatePicker placeholder={'请选择出库时间'}/>
                <Select placeholder={'请选择仓库'}>
                    <Select.Option value="1">仓库1</Select.Option>
                    <Select.Option value="2">仓库2</Select.Option>
                    <Select.Option value="3">仓库3</Select.Option>
                </Select>
                <Input addonBefore="备注:" placeholder='备注' style={{width:'300px'}}/>
                <Button type='primary' onClick={openGoods}>当前库存</Button>
            </Space>
            <Space style={{display:'flex',justifyContent:'flex-start',alignItems:'center',marginTop:'10px'}}>
                <Input addonBefore="客户姓名:" placeholder='客户姓名' style={{width:'300px'}}/>
                <Input addonBefore="联系方式:" placeholder='客户联系方式' style={{width:'300px'}}/>
                <Input addonBefore="详细地址:" placeholder='客户详细地址' style={{width:'300px'}}/>
            </Space>
            <Table
                columns={columnsz}
                rowKey={(columns) => columns.id}
                pagination={false}
                size='small'
                rowClassName={(record, index) =>
                    index % 2 === 1 ? 'tbodd' : 'tbeven'
                }
            />
            <Modal open={open} onCancel={()=>setOpen(false)} title={'物品列表'} width={1000}>
                <List>
                    <List.Item>
                        <Space>
                            <Input
                                addonBefore="物品名称:"
                            />
                            <Input
                                addonBefore="助查码:"
                            />
                            <Button type="primary">
                                搜索
                            </Button>
                        </Space>
                    </List.Item>
                </List>
                <Table
                    columns={columns}
                    rowKey={(columns) => columns.id}
                    pagination={false}
                    size='small'
                    rowSelection={rowSelection} // 启用内置选择功能（自动添加选择列）
                    rowClassName={(record, index) =>
                        index % 2 === 1 ? 'tbodd' : 'tbeven'
                    }
                />
            </Modal>
        </Spin>
    )
}
export default AddSales;
