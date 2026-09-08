import {Button, DatePicker, Form, Image, Input, message, Select, Space, Tooltip} from "antd";
import {phonePattern} from "@/utils/OpenTool";
import {useNavigate} from "umi";
import {useCallback, useEffect, useState} from "react";
import * as ZuhuService from "@/services/zuhu";
import * as WxService from "@/services/changeWeChat";
import ImageUpload from "@/components/ImageUploader";
import ImageUploadPng from "@/components/ImageUploadPng";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";

// 缓存key
const CACHE_KEY = "AddChangeWeChat_form_cache";

const AddChangeWeChat=(props)=>{
    const navigate=useNavigate();
    const [form] = Form.useForm();
    // 加载中
    const [spinning, setSpinning] = useState(false);
    const [selectTenantId, setSelectTenantId] = useState<number | null>(null);
    // 租户下拉列表
    const [tenantList, setTenantList] = useState([]);
    // 原手机号
    const [phoneOld, setPhoneOld] = useState('');
    // 图片列表
    const [imgList, setImgList] = useState([]);
    // 上传图片存储
    const [imgB64, setImgB64] = useState<string[]>([]);
    const [imgName, setImgName] = useState<string[]>([]);

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
            selectTenantId,
            phoneOld,
            imgB64,
            imgName,
            formValues: form.getFieldsValue()
        };
        try {
            sessionStorage.setItem(CACHE_KEY, JSON.stringify(data));
        } catch (e) {
            console.warn('草稿保存失败：', e);
        }
    }, [selectTenantId, phoneOld, imgB64, imgName, form]);

    // 清空缓存
    const clearCache = () => sessionStorage.removeItem(CACHE_KEY);

    // 清空草稿
    const resetAllFormData = () => {
        clearCache();
        setSelectTenantId(null);
        setPhoneOld('');
        setImgB64([]);
        setImgName([]);
        form.resetFields();
    };

    const onFinish=(vals:any)=>{
        const imgList = imgName.join("|");
        WxService.add({...vals,selectTenantId,phoneOld,imgList}).then((res:TypeErrorCode)=>{
            if(res.ErrorCode===0){
                message.success("添加成功");
                // 提交成功后清空草稿缓存
                clearCache();
                navigate(-1);
            }else{
                message.error(res.Data);
            }
        })
    };
    // 获取全部租户下拉列表
    const getTenantList = async () => {
        setSpinning(true);
        try {
            const res:any = await ZuhuService.byfetch({
                page: 1,
                name: '',
                phone: '',
                pagecount: 1000
            });
            if (res.ErrorCode === 0) {
                setTenantList(res.Data.data || []);
            } else {
                message.error(res.Data);
            }
        } catch (err) {
            message.error("租户列表加载失败");
        } finally {
            setSpinning(false);
        }
    };
    // 切换租户，加载该租户违约账单
    const changeTenantId = (tenantId: number) => {
        setSelectTenantId(tenantId);
        const targetTenant = tenantList.find(item => item.id === tenantId);
        if (targetTenant) {
            const phone = targetTenant.tenant_phone;
            setPhoneOld(phone);
        }
    };
    useEffect(() => {
        // 加载缓存：回填state与表单字段
        const cache = loadCache();
        if (cache) {
            setSelectTenantId(cache.selectTenantId ?? null);
            setPhoneOld(cache.phoneOld ?? '');
            setImgB64(cache.imgB64 ?? []);
            setImgName(cache.imgName ?? []);
            if (cache.formValues) {
                form.setFieldsValue(cache.formValues);
            }
        }
        getTenantList();
    }, []);
    // 任意state变动自动存缓存
    useEffect(() => {
        saveCache();
    }, [saveCache]);
    // 表单字段变动也立即存
    const handleFormChange = () => {
        saveCache();
    };
    // 图片上传回调
    const onImageUpload = (base64: string) => {
        setImgName([...imgName, base64]);
    };
    const oldBase64 = (base64: string) => {
        setImgB64([...imgB64, base64]);
    };

    // 删除图片
    const handleDeletezuhu = (index: number) => {
        const newImages = [...imgB64];
        newImages.splice(index, 1);
        setImgB64(newImages);
        const newB64 = [...imgName];
        newB64.splice(index, 1);
        setImgName(newB64);
    };

    return(
        <div>
            <Form
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 14 }}
                layout="horizontal"
                size={'large'}
                form={form}
                onFinish={onFinish}
                onValuesChange={handleFormChange}
                initialValues={{phoneReason: ''}}
                style={{ marginTop: '1rem' }}
            >
                <Form.Item label='租户' >
                    <Select
                        onChange={changeTenantId}
                        showSearch
                        placeholder="请选择租户"
                        optionFilterProp="children"
                        filterOption={(input, option) => {
                            const item = tenantList.find(tenant => tenant.id === option?.value);
                            return item?.tenant_name?.toLowerCase().includes(input.toLowerCase());
                        }}
                        style={{ width: "100%" }}
                    >
                        {tenantList.map((item, index) => (
                            <Select.Option value={item.id} key={index}>
                                {item.tenant_name} - {item.tenant_phone}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item label='原手机号'>
                    <Input disabled value={phoneOld} />
                </Form.Item>
                <Form.Item label='新手机号' name='phoneNew' rules={[{required:true,message:'请输入新手机号'},{pattern:phonePattern,message:'请输入正确的手机号'}]}>
                    <Input />
                </Form.Item>
                <Form.Item label='图片'>
                    <ImageUploadPng onImageUpload={onImageUpload} oldBase64={oldBase64} />
                    <Space wrap size={10} style={{ marginTop: 10 }}>
                        {imgB64.map((item, index) => (
                            <div key={index} style={{ position: "relative" }}>
                                <Image
                                    src={item}
                                    width={70}
                                    height={70}
                                    style={{ borderRadius: 6, objectFit: "cover" }}
                                    preview
                                />
                                <Button
                                    danger
                                    size="small"
                                    style={{ position: "absolute", top: 2, right: 2, width: 22, height: 22, padding: 0 }}
                                    onClick={() => handleDeletezuhu(index)}
                                >
                                    ×
                                </Button>
                            </div>
                        ))}
                    </Space>
                </Form.Item>
                <Form.Item label='备注' name='phoneReason'>
                    <Input.TextArea />
                </Form.Item>
                <Form.Item  style={{textAlign:'center'}}>
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
        </div>
    )
}
export default AddChangeWeChat;