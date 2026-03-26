import {useEffect, useRef, useState} from "react";
import {Button, Form, Image, Input, InputNumber, message, Radio, Select, Space, Spin} from "antd";
import {useNavigate,connect,history} from "umi";
import {firstLetterUpperCase} from "@/utils/OpenTool";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import * as ThingListvice from '@/services/thingList';
import dayjs from "dayjs";
import * as UnitCalculation from "@/services/unitCalculation";
import CmpImageUploader from "@/components/ImageUploader";
import ImageUploadPng from "@/components/ImageUploadPng";

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
    const [productsCode,setProductsCode]=useState('');
    // 助查码
    const [abbreviation,setAbbreviation]=useState('');
    const [uid,setUid]=useState('0');
    // 换算分组单位列表
    const [goodsList,setGoodsList]=useState([]);
    const [isHs,setIsHs]=useState(0);
    const [groupId,setGroupId]=useState(0);
    const [unitsId  ,setUnitsId]=useState(0);
    const [textureId,setTextureId]=useState(0);
    const [yearId,setYearId]=useState(0);
    const [goodsTypeId,setGoodsTypeId]=useState(0);
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
        if (unitsId==0){
            message.error('请选择单位');
            return;
        }
        // if (yearId==0){
        //     message.error('请选择年份');
        //     return;
        // }
        // if (textureId==0){
        //     message.error('请选择口感');
        //     return;
        // }
        // if (goodsTypeId==0){
        //     message.error('请选择物品类型');
        //     return;
        // }
        if (isHs==1 && groupId==0){
            message.error('请选择换算分组单位');
            return;
        }
        if (isHs === 1) {
            const unitExists = goodsList.some(item => item.from_unit_id === unitsId);
            if (!unitExists) {
                message.error('选择的单位不在换算分组中，请重新选择');
                return;
            }
        }
        setSpinning(true);
        let jsonData=JSON.stringify(goodsList);
        props.dispatch({
            type:'ThingList/edit',
            payload:{...values,productsImage,abbreviation,productsCode,jsonData,uid,isHs,groupId,unitsId,yearId,textureId,goodsTypeId}
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
            setProductsCode(res.Data.productsCode);
            setIsHs(res.Data.isHs);
            setGroupId(res.Data.groupId);
            setUnitsId(res.Data.unitsId);
            setSpinning(false);
            getOneGroupID(res.Data.groupId);
            setYearId(res.Data.ytId);
            setTextureId(res.Data.textureId);
            setGoodsTypeId(res.Data.typeId);
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
    // 获取年份列表
    const getYearList=()=>{
        props.dispatch({
            type:"YearSetting/fetch",
        })
    };
    // 获取物品类型
    const getWarehouseTypeList=()=>{
        props.dispatch({
            type:"WarehouseType/fetch",
        })
    };
    // 获取口感列表
    const getTextureList=()=>{
        props.dispatch({
            type:"Texture/fetch",
        })
    };
    useEffect(() => {
        getList();
        getBrandList();
        getUnitSettingList();
        getYearList();
        getTextureList();
        getWarehouseTypeList();
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
        setGroupId(e);
    };
    // 根据单位ID获取单位名称
    const getUnitName = (unitId) => {
        if (!Array.isArray(props.UnitSetting) || props.UnitSetting.length === 0) return '';
        const unit = props.UnitSetting.find(item => item.id === unitId);
        return unit ? unit.unitsName : '';
    };
    const changeIsHs=(e)=>{
        if (e.target.value==0){
            setGroupId(0);
        }
        setIsHs(e.target.value);
    };
    const changeUnitsId=(e)=>{
        console.log('选择单位',e);
        setUnitsId(e);
    };
    // 监听口感变化
    const changeTextureId=(e)=>{
        console.log('选择口感',e);
        setTextureId(e);
    };
    // 监听年份变化
    const changeYearId=(e)=>{
        console.log('选择年份',e);
        setYearId(e);
    };
    // 监听物品类型变化
    const changeGoodsTypeId=(e)=>{
        console.log('选择物品类型',e);
        setGoodsTypeId(e);
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
                initialValues={{specifications:'',barcode:'',remark:'',number:0,groupId:0}}
                onFinish={onFinish}
                style={{ marginTop: '1rem' }}
            >
                <Form.Item label='物品名称' name='productsName' rules={[{required: true, message: '请输入物品名称' }]}>
                    <Input placeholder='物品名称' onChange={changeThingName}/>
                </Form.Item>
                <Form.Item label='物品编码' name='productsCode'>
                    <Input placeholder='物品编码' disabled/>
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
                <Form.Item label='单位'>
                    <Select
                        placeholder='单位'
                        value={unitsId}
                        onChange={changeUnitsId}
                        options={Array.isArray(props.UnitSetting) && props.UnitSetting.length > 0
                            ? props.UnitSetting.map((item:any)=>({
                                label:item.unitsName,
                                value:item.id,
                            }))
                            : []}
                    />
                </Form.Item>
                <Form.Item label='物品类型'>
                    <Select
                        placeholder='物品类型'
                        onChange={changeGoodsTypeId}
                        value={goodsTypeId}
                        showSearch
                        optionFilterProp="children"
                        filterOption={(input, option) => {
                            // 假设每个 option 都有一个与数据项对应的 value 属性
                            const item = props.WarehouseType.find(unit => unit.id == option.value); // 您可能需要优化这个查找过程
                            return item?.typeName?.toLowerCase().includes(input.toLowerCase());
                        }}
                        options={Array.isArray(props.WarehouseType) && props.WarehouseType.length > 0
                            ? props.WarehouseType.map((item:any)=>({
                                label:item.typeName,
                                value:item.id,
                            }))
                            : []}
                    />
                </Form.Item>
                <Form.Item label='口感'>
                    <Select
                        placeholder='口感'
                        onChange={changeTextureId}
                        value={textureId}
                        showSearch
                        optionFilterProp="children"
                        filterOption={(input, option) => {
                            // 假设每个 option 都有一个与数据项对应的 value 属性
                            const item = props.Texture.find(unit => unit.id == option.value); // 您可能需要优化这个查找过程
                            return item?.remark?.toLowerCase().includes(input.toLowerCase());
                        }}
                        options={Array.isArray(props.Texture) && props.Texture.length > 0
                            ? props.Texture.map((item:any)=>({
                                label:item.remark,
                                value:item.id,
                            }))
                            : []}
                    />
                </Form.Item>
                <Form.Item label='年份'>
                    <Select
                        placeholder='年份'
                        onChange={changeYearId}
                        value={yearId}
                        showSearch
                        optionFilterProp="children"
                        filterOption={(input, option) => {
                            // 假设每个 option 都有一个与数据项对应的 value 属性
                            const item = props.YearSetting.find(unit => unit.id == option.value); // 您可能需要优化这个查找过程
                            return item?.remark?.toLowerCase().includes(input.toLowerCase());
                        }}
                        options={Array.isArray(props.YearSetting) && props.YearSetting.length > 0
                            ? props.YearSetting.map((item:any)=>({
                                label:item.ytName,
                                value:item.id,
                            }))
                            : []}
                    />
                </Form.Item>
                <Form.Item label='成本价' name='costPrice' rules={[{required: true, message: '请输入成本价' }]}>
                    <InputNumber placeholder='成本价'/>
                </Form.Item>
                <Form.Item label='是否换算'>
                    <Radio.Group value={isHs} onChange={changeIsHs}>
                        <Radio value={1}>是</Radio>
                        <Radio value={0}>否</Radio>
                    </Radio.Group>
                </Form.Item>
                {
                    isHs==1?<>
                        <Form.Item label='换算单位'>
                            <Select
                                onChange={changeGroupId}
                                placeholder='换算单位'
                                value={groupId}
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
                    </>:''
                }
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
                {/*<Form.Item label='条码' name='barcode'>*/}
                {/*    <InputNumber placeholder='条码'/>*/}
                {/*</Form.Item>*/}
                <Form.Item label='备注' name='remark'>
                    <Input placeholder='备注'/>
                </Form.Item>
                <Form.Item label='图片'>
                    <ImageUploadPng onImageUpload={oldImgName} oldBase64={onB64}/>
                    {productsImage?<Image
                        src={
                            productsImage?.endsWith('.png')
                                ? `${window.ServerConfig.imgServer}${productsImage}`
                                : `${window.ServerConfig.imgServer}${productsImage}_X.png`
                        }
                        style={{ width: '80px', height: '80px' }}
                        // 可选：添加图片加载失败的兜底占位图，提升体验
                        fallback="https://placeholder.pics/svg/80x80/EEEEEE/999999/暂无图片"
                    />:''}
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
        </Spin>
    )
}
const mapStateToProps = (state: any) => ({
    list: state.BrandList.list,
    UnitCalculation: state.UnitCalculation.list,
    UnitSetting: state.UnitSetting.list,
    Texture: state.Texture.list,
    YearSetting: state.YearSetting.list,
    WarehouseType: state.WarehouseType.list,
});
export default connect(mapStateToProps) (EditThingList);