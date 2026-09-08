import {Button, Form, Input, InputNumber, message, Space, Spin} from "antd";
import {connect, history,useNavigate} from "umi";
import {useCallback, useEffect, useState} from "react";

const tailLayout = {
    wrapperCol: { offset: 4 },
};

// 缓存key
const CACHE_KEY = "AddHouse_form_cache";

const AddHouse=(props:any)=>{
    const navigate=useNavigate();
    const [form] = Form.useForm();
    const [spinning,setspinning]=useState(false);
    // 可租面积
    const [rentable_area,setrentable_area]=useState(0);
    // 可增加面积
    const [residue_add_area,setresidue_add_area]=useState(0);
    // 单价
    const [price,setprice]=useState(0);
    // 不能低于租金
    const [noRents,setnoRents]=useState(0);

    // 读取缓存
    const loadCache = useCallback(() => {
        const str = sessionStorage.getItem(CACHE_KEY);
        if (!str) return null;
        try {
            return JSON.parse(str);
        } catch (e) {
            sessionStorage.removeItem(CACHE_KEY);
            return null;
        }
    }, []);

    // 保存state+表单字段到缓存
    const saveCache = useCallback(() => {
        const data = {
            rentable_area,
            residue_add_area,
            price,
            formValues: form.getFieldsValue()
        };
        sessionStorage.setItem(CACHE_KEY, JSON.stringify(data));
    }, [rentable_area, residue_add_area, price, form]);

    // 清空缓存
    const clearCache = () => sessionStorage.removeItem(CACHE_KEY);

    // 清空草稿
    const resetAllFormData = () => {
        clearCache();
        setrentable_area(0);
        setresidue_add_area(0);
        setprice(0);
        form.resetFields();
    };

    const onFinish=async (values:any)=>{
        setspinning(true);
        let res=await props.dispatch({
            type:'House/add',
            payload:{...values,rentable_area,residue_add_area,price}
        })
        if (res.ErrorCode==0){
            setspinning(false);
            message.success('添加成功');
            // 添加成功后清空草稿缓存
            clearCache();
            history.push('/houseManage/houseList')
        }else {
            message.error(res.Data);
            setspinning(false);
        }
    };
    const changeArea=(e:number)=>{
        setresidue_add_area(e);
        setrentable_area(e);
    };
    // 监听单价
    const changeprice=(e)=>{
        setprice(e);
    };
    useEffect(() => {
        // 加载缓存：回填state与表单字段
        const cache = loadCache();
        if (cache) {
            setrentable_area(cache.rentable_area ?? 0);
            setresidue_add_area(cache.residue_add_area ?? 0);
            setprice(cache.price ?? 0);
            if (cache.formValues) {
                form.setFieldsValue(cache.formValues);
            }
        }
    }, []);
    // 任意state变动自动存缓存
    useEffect(() => {
        saveCache();
    }, [saveCache]);
    // 表单字段变动也立即存
    const handleFormChange = () => {
        saveCache();
    };
    useEffect(() => {
        setnoRents(rentable_area*price);
    }, [rentable_area,price]);
    return(
        <Spin spinning={spinning}>
            <Form
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 14 }}
                form={form}
                layout="horizontal"
                size={'large'}
                onFinish={onFinish}
                onValuesChange={handleFormChange}
                style={{ marginTop: '1rem' }}
            >
                <Form.Item label='房屋名称' name='house_name' rules={[{required: true, message: '请填写房屋名称'}]}>
                    <Input/>
                </Form.Item>
                <Form.Item label='建筑面积㎡' name='floor_area' rules={[{required: true, message: '请填写建筑面积'}]}>
                    <InputNumber/>
                </Form.Item>
                <Form.Item label='可租面积㎡'>
                    <InputNumber onChange={changeArea} value={rentable_area}/>
                </Form.Item>
                <Form.Item label='单价/(元)'>
                    <InputNumber value={price} onChange={changeprice}/>
                </Form.Item>
                <Form.Item label='总租金/(元)' name='rents' rules={[
                    { required: true, message: '请填写总租金' },
                    {
                        validator: (_, value) => {
                            if (value < noRents) {
                                return Promise.reject(`不能低于 ${noRents}元`);
                            }
                            return Promise.resolve();
                        },
                    },
                ]}>
                    <InputNumber/>
                </Form.Item>
                <Form.Item label='注意'>
                   <span style={{fontSize:'12px',color:'#555'}}>总租金不能低于{noRents}元=单价*可租面积</span>
                </Form.Item>
                <Form.Item label='详细地址' name='address' rules={[{required: true, message: '请填写详细地址'}]}>
                    <Input/>
                </Form.Item>
                <Form.Item label='总楼层/(层)' name='floors' rules={[{required: true, message: '请填写总楼层'}]}>
                    <InputNumber/>
                </Form.Item>
                <Form.Item label='剩余可增加面积㎡'>
                    <InputNumber value={residue_add_area} disabled/>
                </Form.Item>
                <Form.Item {...tailLayout}>
                   <Space>
                       <Button type="primary" htmlType="submit">
                           添加
                       </Button>
                       <Button type="primary" onClick={()=>navigate(-1)}>
                           返回
                       </Button>
                       <Button danger onClick={resetAllFormData}>
                           清空草稿
                       </Button>
                   </Space>
                </Form.Item>
            </Form>
        </Spin>
    )
}
export default connect() (AddHouse)