import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import {connect,history,useNavigate} from "umi";
import {useEffect, useState} from "react";
import {Button, DatePicker, Form, Input, message, Select, Space, Spin} from "antd";

const AddReleaseSlipInfo=(props)=>{
    const navigate=useNavigate();
    const [goodsList,setGoodsList]=useState([]);
    const [zhuhuList,setZhuhuList]=useState([]);
    const [spinning,setspinning]=useState(false);
    const [goodsJosn,setGoodsJosn]=useState([]);
    const [startDate,setStartDate]=useState('');
    const [userID,setUserId]=useState(0);
    const [form] = Form.useForm();

    // 获取物品列表
    const getGoodsList=()=>{
        props.dispatch({
            type:'Goods/fetch',
            payload:{userId:0,page:1,pageSize:1000,tenantName:'',goodsName:''}
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                setGoodsList(res.Data);
            }
        })
    };
    // 租户列表
    const getTenantList=()=>{
        props.dispatch({
            type:"BYZhuhu/fetch",
            payload:{page:1,name:'',phone:'',pagecount:1000}
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                setZhuhuList(res.Data);
            }
        })
    };
    useEffect(() => {
        getGoodsList();
        getTenantList();
    }, []);
    const changeTenant=(e)=>{
        const selectedZhuhu = zhuhuList.find(item => item.id === e);
        if (selectedZhuhu.userId==0) return message.warning('该租户未登录过，请重新选择租户！');
        setUserId(selectedZhuhu.userId);
    };
    const onFinish=()=>{
        if (goodsJosn.length==0) return message.warning('请添加物品！');
        if (startDate=='') return message.warning('请选择日期！');
        if (userID==0) return message.warning('请选择租户！');
        setspinning(true);
        let json=JSON.stringify(goodsJosn);
        props.dispatch({
            type:'ReleaseSlip/add',
            payload:{startDate,userID,goosJosn:json}
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0||res.ErrorCode==9038){
                message.success('添加成功');
                history.push('/propertyServerManage/releaseSlip');
                setspinning(false);
            }else {
                message.error(res.Data);
                setspinning(false);
            }
        })
    };
    const changeGoods=(e)=>{
        const selectedGoods = goodsList.find(item => item.id === e);
        if (selectedGoods) {
            // 生成递增 ID（与 handleAddGoods 逻辑一致）
            const newId = goodsJosn.length > 0 ? goodsJosn[goodsJosn.length - 1].id + 1 : 1;
            // 向 goodsJosn 添加新条目，title 自动填充为选中物品名称
            setGoodsJosn(prev => [...prev, {
                id: newId,
                title: selectedGoods.goodName,  // 自动填充物品名称
                quantity: 0
            }]);
        }
    };
    // 添加物品：生成递增ID并添加到数组
    const handleAddGoods = () => {
        const newId = goodsJosn.length > 0 ? goodsJosn[goodsJosn.length - 1].id + 1 : 1;
        setGoodsJosn(prev => [...prev, { id: newId, title: '', quantity: 0 }]);
    };

    // 删除物品：根据ID从数组中移除
    const handleRemoveGoods = (id: number) => {
        setGoodsJosn(prev => prev.filter(item => item.id !== id));
    };

    // 更新物品标题
    const handleTitleChange = (id: number, value: string) => {
        setGoodsJosn(prev =>
            prev.map(item => item.id === id ? { ...item, title: value } : item)
        );
    };

    // 更新物品数量
    const handleQuantityChange = (id: number, value: number) => {
        setGoodsJosn(prev =>
            prev.map(item => item.id === id ? { ...item, quantity: value } : item)
        );
    };
    const changeDate=(_:any,date:any)=>{
        setStartDate(date);
    };
    return(
        <Spin spinning={spinning}>
            <Form
                form={form}
                layout="horizontal"
                size={'large'}
                onFinish={onFinish}
                style={{ marginTop: '1rem' ,width:'50vw',margin:'0 auto'}}
            >
                <Form.Item label='选择租户'>
                    <Select
                        onChange={changeTenant}
                        showSearch
                        optionFilterProp="children"
                        filterOption={(input, option) => {
                            // 假设每个 option 都有一个与数据项对应的 value 属性
                            const item =zhuhuList.find(hetongID => hetongID.id == option?.value); // 您可能需要优化这个查找过程
                            return item?.tenant_name?.toLowerCase().includes(input.toLowerCase());
                        }}
                    >
                        {zhuhuList.map((item:any,index:any)=>{
                            return(
                                <Select.Option value={item.id} key={index}>
                                    {item.tenant_name}-{item.tenant_phone}
                                </Select.Option>
                            )
                        })}
                    </Select>
                </Form.Item>
                <Form.Item label='选择放行时间'>
                   <DatePicker onChange={changeDate}/>
                </Form.Item>
                <Form.Item label='选择物品'>
                    <Select
                        onChange={changeGoods}
                        showSearch
                        optionFilterProp="children"
                        filterOption={(input, option) => {
                            // 假设每个 option 都有一个与数据项对应的 value 属性
                            const item =goodsList.find(hetongID => hetongID.id == option?.value); // 您可能需要优化这个查找过程
                            return item?.goodName?.toLowerCase().includes(input.toLowerCase());
                        }}
                    >
                        {goodsList.map((item:any,index:any)=>{
                            return(
                                <Select.Option value={item.id} key={index}>
                                    {item.goodName}
                                </Select.Option>
                            )
                        })}
                    </Select>
                </Form.Item>
                <div style={{ margin: '1.5rem 0' }}>
                    <h3>已添加物品列表</h3>
                    <div style={{ maxHeight: '300px', overflowY: 'auto', marginTop: '1rem' }}>
                        {goodsJosn.length === 0 ? (
                            <p style={{ color: '#999' }}>暂无物品，请点击"添加物品"按钮</p>
                        ) : (
                            goodsJosn.map(item => (
                                <div
                                    key={item.id}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '1rem',
                                        // margin: '1rem 0',
                                        padding: '0.5rem',
                                        border: '1px solid #e8e8e8',
                                        borderRadius: 4
                                    }}
                                >
                                    <Form.Item label={`物品 ${item.id}`}>
                                        <Input
                                            placeholder="请输入物品标题"
                                            value={item.title}
                                            onChange={(e) => handleTitleChange(item.id, e.target.value)}
                                            style={{ width: 400 }}
                                        />
                                    </Form.Item>
                                    <Form.Item label="数量">
                                        <Input
                                            type="number"
                                            min={0}
                                            value={item.quantity}
                                            onChange={(e) => handleQuantityChange(item.id, Number(e.target.value) || 0)}
                                            style={{ width: 100 }}
                                        />
                                    </Form.Item>
                                    <Button
                                        type="text"
                                        danger
                                        onClick={() => handleRemoveGoods(item.id)}
                                    >
                                        删除
                                    </Button>
                                </div>
                            ))
                        )}
                    </div>
                    {/* 添加物品按钮 */}
                    <Button type="primary" onClick={handleAddGoods} style={{ marginTop: 16 }}>
                        增加物品
                    </Button>
                </div>
                <Form.Item>
                    <Space>
                        <Button type="primary" htmlType="submit">
                            添加放行条
                        </Button>
                        <Button type="primary" onClick={()=>navigate(-1)}>
                            返回
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        </Spin>
    )
};
const mapStateToProps = (state: any) => {
    return {
        BYZhuhuList: state.BYZhuhu.list,
        GoodsList: state.Goods.list,
    }
};
export default connect(mapStateToProps)(AddReleaseSlipInfo);
