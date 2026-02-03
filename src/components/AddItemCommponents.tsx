import {useEffect, useState} from "react";
import {Button, Form, Image, Input, InputNumber, message, Radio, Select, Space, Spin} from "antd";
import {useNavigate,connect,history} from "umi";
import CmpImageUploader from "@/components/ImageUploader";
import {firstLetterUpperCase} from "@/utils/OpenTool";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import * as UnitCalculation from '@/services/unitCalculation';

const AddItemCommponents=(props)=>{
    const { onOperationResult = () => {} } = props;
    const { isDestroyOnClose = () => {} } = props;
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
    // 换算分组单位列表
    const [goodsList,setGoodsList]=useState([]);
    const [isHs,setIsHs]=useState(0);
    const [groupId,setGroupId]=useState(0);
    const [unitsId,setUnitsId]=useState(0);

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
            type:'ThingList/add',
            payload:{...values,unitsId,productsImage,abbreviation,productsCode,jsonData,isHs,groupId}
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                message.success('添加成功');
                setSpinning(false);
                // 添加成功，返回false通知父组件关闭弹窗
                onOperationResult(false);
                isDestroyOnClose(true);
            }else {
                message.error(res.ErrorCode + res.Data);
                setSpinning(false);
                // 添加失败，返回true通知父组件不关闭弹窗
                onOperationResult(true);
                isDestroyOnClose(false);
            }
        })
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
    // 监听换算单位变化
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
    // 组件挂载时刷新编码（确保每次打开都重新生成）
    useEffect(() => {
        setProductsCode(Date.now().toString());
    }, []);
    const changeUnitsId=(e)=>{
        console.log('选择单位',e);
        setUnitsId(e);
    };
    return (
        <Spin spinning={spinning}>
            <Form
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 14 }}
                form={form}
                layout="horizontal"
                size={'large'}
                initialValues={{specifications:'',barcode:'',remark:'',number:0,groupId:0}}

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
                <Form.Item label='单位' >
                    <Select
                        placeholder='单位'
                        onChange={changeUnitsId}
                        options={Array.isArray(props.UnitSetting) && props.UnitSetting.length > 0
                            ? props.UnitSetting.map((item:any)=>({
                                label:item.unitsName,
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
                <Form.Item label='零售控价' name='presalePrice' rules={[{required: true, message: '请填写零售控价' }]}>
                    <InputNumber placeholder='零售控价'/>
                </Form.Item>
                <Form.Item label='零售价' name='retailPricce' rules={[{required: true, message: '请输入零售价' }]}>
                    <InputNumber placeholder='零售价'/>
                </Form.Item>
                <Form.Item label='预警库存数' name='number'>
                    <InputNumber placeholder='预警库存数' min={0}/>
                </Form.Item>
                <Form.Item label='规格' name='specifications'>
                    <Input placeholder='规格'/>
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
export default connect(mapStateToProps) (AddItemCommponents);