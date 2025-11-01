import {useEffect, useRef, useState} from "react";
import {Button, Form, Image, Input, InputNumber, message, Select, Space, Spin} from "antd";
import {useNavigate,connect,history} from "umi";
import NoyasuoImgCmp from "@/components/NoyasuoImgCmp";
import {firstLetterUpperCase} from "@/utils/OpenTool";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import * as ThingListvice from '@/services/thingList';
import dayjs from "dayjs";
import * as UnitCalculation from "@/services/unitCalculation";
import CmpImageUploader from "@/components/ImageUploader";

const EditThingList=(props)=>{
    const navigate=useNavigate();
    const formRef=useRef();
    const [spinning, setSpinning] = useState(false);
    const [form] = Form.useForm();
    // 图片
    const [productsImage,setImgName]=useState('');
    // B64
    const [b64,setB64]=useState('');
    // 物品编码
    const [productsCode,setProductsCode]=useState(Date.now().toString());
    // 助查码
    const [abbreviation,setAbbreviation]=useState('');
    const [uid,setUid]=useState('0');
    // 换算分组单位列表
    const [goodsList,setGoodsList]=useState([]);
    // 图片名字
    const oldImgName=(e:string)=>{
        setImgName(e);
    };
    // 图片B64
    const onB64=(e:string)=>{
        setB64(e);
    };
    // 监听物品名称
    const changeThingName=(e)=>{
        const auxiliaryCode=firstLetterUpperCase(e.target.value);
        setAbbreviation(auxiliaryCode);
    };
    const onFinish= (values)=>{
        setSpinning(true);
        let jsonData=JSON.stringify(goodsList);
        props.dispatch({
            type:'ThingList/edit',
            payload:{...values,productsImage,abbreviation,productsCode,jsonData,uid}
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                message.success('修改成功');
                history.push('/warehouse/thingList');
                setSpinning(false);
            }else {
                message.error(res.ErrorCode + res.Data);
                setSpinning(false);
            }
        })
    };
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const id = searchParams.get('id');
        setUid(id);
        getOne(id);
    }, []);
    const getOne=async (id:string)=>{
        setSpinning(true);
        let res:any=await  ThingListvice.one(id);
        if (res.ErrorCode==0){
            console.log('详情',res);
            let data=res.Data;
            formRef.current.setFieldsValue(data);
            setAbbreviation(res.Data.abbreviation);
            setImgName(res.Data.productsImage);
            setB64(res.Data.productsImageBase64);
            setSpinning(false);
            getOneGroupID(res.Data.groupId);
        }else {
            message.error(res.Data);
            setSpinning(false);
        }
    };
    // 获取品牌方列表
    const getList=()=>{
        props.dispatch({
            type:"BrandList/fetch",
        })
    };
    // 获取换算列表
    const getBrandList=()=>{
        props.dispatch({
            type:"UnitCalculation/fetch",
        })
    };
    // 获取单位列表
    const getUnitSettingList=()=>{
        props.dispatch({
            type:"UnitSetting/fetch",
        })
    };
    useEffect(() => {
        getList();
        getBrandList();
        getUnitSettingList();
    }, []);
    const getOneGroupID=(e)=>{
        UnitCalculation.oneGoodsList(e).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                setGoodsList(res.Data);
            }
        })
    };
    const changeGroupId=(e)=>{
        getOneGroupID(e);
    };
    // 根据单位ID获取单位名称
    const getUnitName = (unitId) => {
        if (!Array.isArray(props.UnitSetting) || props.UnitSetting.length === 0) return '';
        const unit = props.UnitSetting.find(item => item.id === unitId);
        return unit ? unit.unitsName : '';
    };

    return (
        <Spin spinning={spinning}>
            <Form
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 14 }}
                form={form}
                ref={formRef}
                layout="horizontal"
                size={'large'}
                initialValues={{specifications:'',barcode:'',remark:''}}

                onFinish={onFinish}
                style={{ marginTop: '1rem' }}
            >
                <Form.Item label='物品名称' name='productsName' rules={[{required: true, message: '请输入物品名称' }]}>
                    <Input placeholder='物品名称' onChange={changeThingName}/>
                </Form.Item>
                <Form.Item label='物品编码'>
                    <Input placeholder='物品编码' disabled value={productsCode}/>
                </Form.Item>
                <Form.Item label='助查码'>
                    <Input placeholder='助查码' disabled value={abbreviation}/>
                </Form.Item>
                <Form.Item label='品牌方' name='brandId' rules={[{required: true, message: '请选择品牌方' }]}>
                    <Select
                        placeholder='请选择品牌方'
                        options={Array.isArray(props.list) && props.list.length > 0
                            ? props.list.map((item:any)=>({
                                label:item.brandName,
                                value:item.id,
                            }))
                            : []}
                    />
                </Form.Item>
                <Form.Item label='换算单位' name='groupId' rules={[{required: true, message: '请选择换算单位' }]}>
                    <Select
                        onChange={changeGroupId}
                        placeholder='换算单位'
                        options={Array.isArray(props.UnitCalculation) && props.UnitCalculation.length > 0
                            ? props.UnitCalculation.map((item:any)=>({
                                label:item.groupName,
                                value:item.id,
                            }))
                            : []}
                    />
                </Form.Item>
                <Form.Item label='单位换算'>
                    {goodsList.map((item:any, index:number)=>{
                        // 获取当前单位名称
                        const currentUnitName = getUnitName(item.from_unit_id);
                        // 获取上一单位名称（当前项的to_unit_id对应的单位名称）
                        const prevUnitName = getUnitName(item.to_unit_id);
                        return(
                            <Space key={item.id} style={{display:'flex',marginBottom:'10px',alignItems:'center'}}>
                                <Select
                                    disabled
                                    placeholder='选择单位'
                                    style={{width:'200px'}}
                                    options={Array.isArray(props.UnitSetting) && props.UnitSetting.length > 0
                                        ? props.UnitSetting.map((item:any)=>({
                                            label:item.unitsName,
                                            value:item.id,
                                        }))
                                        : []}
                                    value={item.from_unit_id}
                                />
                                <InputNumber
                                    addonBefore="单位关系:"
                                    value={index === 0 ? 1 : item.conversion_rate}
                                    disabled
                                    style={{width:'200px'}}
                                    name={`relation_${item.id}`}
                                    min={1}
                                />
                                <span style={{margin: '0 10px'}}>
                                       {index === 0 ? `(${currentUnitName || '未选择单位'})` : `= ${item.conversion_rate || 1} ${prevUnitName || '上一单位'}`}
                                    </span>
                            </Space>
                        )
                    })}
                </Form.Item>
                <Form.Item label='成本价' name='costPrice' rules={[{required: true, message: '请输入成本价' }]}>
                    <InputNumber placeholder='成本价'/>
                </Form.Item>
                <Form.Item label='零售控价' name='presalePrice' rules={[{required: true, message: '请输入零售控价' }]}>
                    <InputNumber placeholder='零售控价'/>
                </Form.Item>
                <Form.Item label='零售价' name='retailPricce' rules={[{required: true, message: '请输入零售价' }]}>
                    <InputNumber placeholder='零售价'/>
                </Form.Item>
                <Form.Item label='预警库存数' name='number' rules={[{required: true, message: '请输入预警库存数' }]}>
                    <InputNumber placeholder='预警库存数' min={0}/>
                </Form.Item>
                <Form.Item label='规格' name='specifications'>
                    <Input placeholder='规格'/>
                </Form.Item>
                <Form.Item label='条码' name='barcode'>
                    <InputNumber placeholder='条码'/>
                </Form.Item>
                <Form.Item label='备注' name='remark'>
                    <Input placeholder='备注'/>
                </Form.Item>
                <Form.Item label='图片'>
                    <CmpImageUploader onImageUpload={oldImgName} oldBase64={onB64}/>
                    {productsImage?<Image src={b64} style={{ width: '80px', height: '80px' }} />:''}
                </Form.Item>
                <Form.Item  style={{textAlign:'center'}}>
                    <Space>
                        <Button type="primary" htmlType="submit">
                            添加
                        </Button>
                        <Button type="primary" onClick={()=>navigate(-1)}>
                            返回
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        </Spin>
    )
}
const mapStateToProps = (state: any) => ({
    list: state.BrandList.list,
    UnitCalculation: state.UnitCalculation.list,
    UnitSetting: state.UnitSetting.list,
});
export default connect(mapStateToProps) (EditThingList);