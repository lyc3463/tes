import {Button, DatePicker, Form, Image, Input, message, Select, Space, Tooltip} from "antd";
import {phonePattern} from "@/utils/OpenTool";
import {useNavigate} from "umi";
import {useEffect, useRef, useState} from "react";
import * as ZuhuService from "@/services/zuhu";
import * as WxService from "@/services/changeWeChat";
import ImageUpload from "@/components/ImageUploader";
import ImageUploadPng from "@/components/ImageUploadPng";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";

const EditChangeWeChat=(props)=>{
    const navigate=useNavigate();
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
    // 编辑
    const [uid, setUid] = useState<number | 0>(0);
    const formRef=useRef();


    const onFinish=(vals:any)=>{
        const imgList = imgName.join("|");
        WxService.edit({...vals,selectTenantId,phoneOld,imgList,uid}).then((res:TypeErrorCode)=>{
            if(res.ErrorCode===0){
                message.success("编辑成功");
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
    const changeTenantId = (tenantId: number) => {
        setSelectTenantId(tenantId);
        const targetTenant = tenantList.find(item => item.id === tenantId);
        if (targetTenant) {
            const phone = targetTenant.tenant_phone;
            setPhoneOld(phone);
        }
    };
    const getInfo= async (e)=>{
        const res: any = await WxService.one(e);
        console.log(res);
        if (res.ErrorCode === 0) {
            formRef.current.setFieldsValue(res.Data);
            setUid(res.Data.id);
            setSelectTenantId(res.Data.tenantId);
            setPhoneOld(res.Data.phoneOld);
            setImgName(res.Data.pdfImage.split("|"));
            console.log(res.Data.pdfImage.split("|"));
        }
    };
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const id = searchParams.get('id');
        getTenantList();
        getInfo(id);
    }, []);
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
                ref={formRef}
                onFinish={onFinish}
                initialValues={{phoneReason: ''}}
                style={{ marginTop: '1rem' }}
            >
                <Form.Item label='租户' >
                    <Select
                        onChange={changeTenantId}
                        showSearch
                        value={selectTenantId}
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
                    <ImageUploadPng onImageUpload={onImageUpload} oldBase64={oldBase64}/>
                    {/* 有图片才渲染预览区域 */}
                    {imgName.length > 0 && (
                        <Space wrap size={10} style={{ marginTop: 10 }}>
                            {imgName.map((item, index) => (
                                <div key={index} style={{ position: "relative" }}>
                                    <Image
                                        src={`${window.ServerConfig.imgServer}${item}.png`}
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
                    )}
                </Form.Item>
                <Form.Item label='备注' name='phoneReason'>
                    <Input.TextArea />
                </Form.Item>
                <Form.Item  style={{textAlign:'center'}}>
                    <Space>
                        <Button type="primary" htmlType="submit">
                            编辑
                        </Button>
                        <Button type="primary" onClick={()=>navigate(-1)}>
                            返回
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        </div>
    )
}
export default EditChangeWeChat;
