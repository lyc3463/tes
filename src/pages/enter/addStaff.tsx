import {
    Button,
    Form,
    Pagination,
    Table,
    Modal,
    Select,
    DatePicker,
    Input,
    InputNumber,
    message,
    Image,
    Space
} from "antd";
import {useEffect, useState} from "react";
import {connect,history} from "umi";
import {filterAndUpdateList,getDaysInCurrentMonth} from "@/utils/OpenTool";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import dayjs from "dayjs";
import * as CustomServer from "@/services/custom";
import ImageUploader from "@/components/ImageUploader";
const tailLayout = {
    wrapperCol: { offset: 3 },
};
const getYearMonth = (date) => date.year() * 12 + date.month();

const ops= [
    {
        value: '3',
        label: '诚意合同',
    },
    {
        value: '2',
        label: '定金合同',
    },
    {
        value: '1',
        label: '正式合同',
    }
]
interface FormItemType {
    type: 'rental' | 'freePeriod' | 'increment' | string;
    key: string;

}
const AddStaff=(props:any)=>{
    const [form] = Form.useForm();
    // 递增
    const [formItems, setFormItems] = useState([{ key: 1, beginTime: null, endTime: null, rentBeginTime: null,rentEndTime:null,incremental:1}]);
    // 物品清单
    const [wupinList, setwupinList] = useState([
        { key: 1,wupinName:null,wupininfo:null,wupinNuber:0},
    ]);
    // 客户列表
    const [kehuList,setKehuList]=useState([]);
    // 单元列表
    const [unitList,setUnitList]=useState([]);
    // 开始时间
    const [startDate,setStartDate]=useState('');
    // 结束时间
    const [endDate,setEndDate]=useState('');
    // 交付日
    const [deliveryDate,setDeliveryDate]=useState('');
    // 租户证件图片
    const [documentImage,setImgName]=useState('');
    // 证件图片B64
    const [b64,setB64]=useState('');
    // 单元图片
    const [unitImage,setunitImgName]=useState('');
    // 补充协议图片名字
    const [xyimgnames,setxyimgnames]=useState([]);
    // 补充协议图片b64
    const [xyimgb64,setxyimgb64]=useState([]);
    const [unitB64,setuintB64]=useState('');
    // 删除递增表单项
    const removeFormItemByKey = key => {
        setFormItems(prevItems => prevItems.filter(item => item.key !== key));
    };
    // 删除物品表单项
    const removeqingdan = key => {
        setwupinList(prevItems => prevItems.filter(item => item.key !== key));
    };
    const onFinish= (values)=>{
        let formItemsjson=JSON.stringify(formItems);
        let wupinListjson=JSON.stringify(wupinList);
        let imgs=xyimgnames.join('|');
        let date={rentJson:formItemsjson,goodsJson:wupinListjson};
        let jsonDate=JSON.stringify(date);
        props.dispatch({
            type:'Staff/add',
            payload:{...values,endDate,startDate,jsonDate,deliveryDate,documentImage,unitImage,imgs}
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                message.success('添加成功');
                history.push('/enter/staff');
            }else {
                message.error(res.Data);
            }
        })
    };
    useEffect(() => {
        filterAndUpdateList(props.CheckCompanyList, 'custom_name', 'id', setKehuList);
        getUnitList();
        getCheckCompanyList();
    }, []);
    const changeData=(_,item)=>{
        setStartDate(item[0]);
        setEndDate(item[1]);
    };
    // 更新起租日
    const updateqizuDate = (key, updates) => {
        setFormItems(prevItems => prevItems.map(item => item.key === key ? { ...item, ...updates } : item));
    };
    // 更新免租期
    const updatemz = (key, updates) => {
        setFormItems(prevItems => prevItems.map(item => item.key === key ? { ...item, ...updates } : item));
    };
     // 更新递增
    const updatedz = (key, updates) => {
        setFormItems(prevItems => prevItems.map(item => item.key === key ? { ...item, ...updates } : item));
    };
    // 添加递增表单项
    const addFormItem = () => {
        const newKey = formItems.length ? Math.max(...formItems.map(item => item.key)) + 1 : 1;
        setFormItems([...formItems, { key: newKey, beginTime: null, endTime: null, rentBeginTime: null,rentEndTime:null, incremental:1}]);
    };
    // 添加物品表单项
    const addwuping = () => {
        const newKey = wupinList.length ? Math.max(...wupinList.map(item => item.key)) + 1 : 1;
        setwupinList([...wupinList, { key: newKey,wupinName: null,wupininfo: null,wupinNuber: 0}]);
    };
    const handleSearch = (value:any) =>{
        props.dispatch({
            type: 'CheckCompany/fetch',
            payload: {page: 1, name:value, startDate: '2000-01-01', endDate: '2099-01-01'}
        })
    };
    // 获取单元列表
    const getUnitList=()=>{
        props.dispatch({
            type:'Unit/fetch'
        })
    };
    // 获取客户列表
    const getCheckCompanyList=()=>{
        props.dispatch({
            type:'CheckCompany/fetch'
        })
    };
    // 租户证件图片
    const oldImgName=(e:string)=>{
        setImgName(e);
    };
    // 租户证件图片
    const onB64=(e:string)=>{
        setB64(e);
    };
    // 单元图片
    const getunitImgName=(e:string)=>{
        setunitImgName(e);
    };
    // 单元图片
    const getunitB64=(e:string)=>{
        setuintB64(e)
    };
    const disabled30DaysDate = (current, { from, type }) => {
        if (from) {
            const minDate = from.add(-getDaysInCurrentMonth(), 'days');
            const maxDate = from.add(getDaysInCurrentMonth(), 'days');
            switch (type) {
                case 'year':
                    return current.year() < minDate.year() || current.year() > maxDate.year();
                case 'month':
                    return (
                        getYearMonth(current) < getYearMonth(minDate) ||
                        getYearMonth(current) > getYearMonth(maxDate)
                    );
                default:
                    return Math.abs(current.diff(from, 'days')) >= getDaysInCurrentMonth();
            }
        }
        return false;
    };
    // const changeclient=(e)=>{
    //     CustomServer.one(e).then((res:TypeErrorCode)=>{
    //         if (res.ErrorCode==0){
    //             console.log(res.Data);
    //         }else {
    //             message.error(res.Data);
    //         }
    //     })
    // };
    const changedeliveryDate=(_:any,item:any)=>{
      setDeliveryDate(item);
    };
    // 修改物品清单的数量
    const updateMiber=(key, updates)=>{
        setwupinList(prevItems => prevItems.map(item => item.key === key ? { ...item, ...updates } : item));
    };
    // 修改物品清单的标准
    const updatebiaozhun=(key, updates)=>{
        setwupinList(prevItems => prevItems.map(item => item.key === key ? { ...item, ...updates } : item));
    };
    // 修改物品清单的名称
    const updateName=(key, updates)=>{
        setwupinList(prevItems => prevItems.map(item => item.key === key ? { ...item, ...updates } : item));
    };
    // 补充协议图片名字
    const imgNames=(e:string)=>{
        setxyimgnames((prevItems=>[...prevItems,e]))
    };
    // 补充协议图片
    const xyB64=(e:string)=>{
        setxyimgb64((prevItems=>[...prevItems,e]))
    };
    // 删除补充协议
    const handleDelete=(index:number)=>{
        const newImages = [...xyimgnames];
        newImages.splice(index, 1);
        setxyimgnames(newImages);
        const newB64 = [...xyimgb64];
        newB64.splice(index, 1);
        setxyimgb64(newB64);
    };
    return(
        <div>
            <Form
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 14 }}
                form={form}
                layout="horizontal"
                size={'large'}
                onFinish={onFinish}
                style={{ marginTop:'1rem'}}
            >
                <Form.Item label='合同编号' name='identifier'>
                    <Input/>
                </Form.Item>
                <Form.Item label='客户' name='clientId'>
                    <Select showSearch  onSearch={handleSearch} >
                        {props.CheckCompanyList?props.CheckCompanyList.map((item:any,index:any)=>{
                            return(
                                <Select.Option value={item.id} key={index}>
                                    {item.custom_name}
                                </Select.Option>
                            )
                        }):""
                        }
                    </Select>
                </Form.Item>
                <Form.Item label='身份证' name='customCard'>
                    <Input/>
                </Form.Item>
                <Form.Item label='合同类型' name='contractType'>
                   <Select>
                       <Select.Option value={1}>
                           定金合同
                       </Select.Option>
                       <Select.Option value={2}>
                           正式合同
                       </Select.Option>
                   </Select>
                </Form.Item>
                <Form.Item label='单元' name='unit_id'>
                    <Select placeholder='单元'>
                        {props.UnitList?props.UnitList.map((item:any,index:any)=>{
                            return(
                                <Select.Option value={item.id} key={index}>
                                    {item.unit_name}
                                </Select.Option>
                            )
                        }):''}
                    </Select>
                </Form.Item>
                <Form.Item label='起租日'>
                    <DatePicker.RangePicker onChange={changeData}/>
                </Form.Item>
                <Form.Item label='租金(元)' name='zuMoney'>
                    <InputNumber/>
                </Form.Item>
                <Form.Item label='管理费(元)' name='manageFee'>
                    <InputNumber/>
                </Form.Item>
                <Form.Item label='管理费每年递增%' name='manageFeeRent'>
                    <InputNumber min={0}/>
                </Form.Item>
                <Form.Item label='押金(元)' name='deposit' >
                    <InputNumber/>
                </Form.Item>
                <Form.Item label='经营主体' name='businessEntity' >
                    <Input/>
                </Form.Item>
                <Form.Item label='经营范围' name='businessScope' >
                    <Input/>
                </Form.Item>
                <Form.Item label='交付日' >
                    <DatePicker onChange={changedeliveryDate}/>
                </Form.Item>
                <Form.Item label='装修费用' name='decorationCost'>
                    <InputNumber/>
                </Form.Item>
                <Form.Item label='派遣人' name='dispatchName'>
                    <Input/>
                </Form.Item>
                <Form.Item label='派遣人身份证' name='dispatchCard'>
                    <Input/>
                </Form.Item>
                <Form.Item label='补充协议' name='remark'>
                    <Input.TextArea/>
                </Form.Item>
                <Form.Item label='补充协议图片'>
                   <ImageUploader onImageUpload={imgNames} oldBase64={xyB64}/>
                    <Space style={{display:'flex',flexWrap:'wrap'}}>
                        <Space style={{display:'flex',flexWrap:'wrap',marginTop:'25px'}}>
                            {xyimgb64.length>0?xyimgb64.map((item:any,index:number)=>{
                                return(
                                    <div key={index} style={{ display: 'flex', alignItems: 'center', position: 'relative',marginLeft:'20px'}}>
                                        <Image src={item} style={{ width: '80px', height: '80px' }} />
                                        <Button
                                            type="primary"
                                            danger
                                            onClick={() => handleDelete(index)}
                                            style={{
                                                position: 'absolute',
                                                top: '0',
                                                left: '0',
                                                zIndex: 1,
                                                padding: '2px 4px',
                                                transform: 'translate(-50%, -50%)',
                                            }}
                                        >
                                            删除
                                        </Button>
                                    </div>
                                )
                            }):''}
                        </Space>
                    </Space>
                </Form.Item>
                <Form.Item label='单元平面图' >
                    <ImageUploader onImageUpload={getunitImgName} oldBase64={getunitB64}/>
                    {unitB64?<Image src={unitB64} style={{width:'80px',height:'80px'}}/>:''}
                </Form.Item>
                <Form.Item label='租户证件图片' >
                    <ImageUploader onImageUpload={oldImgName} oldBase64={onB64}/>
                    {b64?<Image src={b64} style={{width:'80px',height:'80px'}}/>:''}
                </Form.Item>
                <Form.Item {...tailLayout}>
                    {formItems.map((item:any,index:number) => (
                        <div style={{ display: 'flex'}} key={item.key}>
                            <Form.Item label="起租日">
                                <DatePicker.RangePicker
                                    onChange={(dates,data) => updateqizuDate(item.key,{beginTime: data[0], endTime: data[1]})}
                                />
                            </Form.Item>
                            <Form.Item label="免租期" >
                                <DatePicker.RangePicker disabledDate={disabled30DaysDate}
                                    onChange={(dates,data) => updatemz(item.key,{rentBeginTime: data[0], rentEndTime: data[1]})}
                                />
                            </Form.Item>
                            <Form.Item label="递增" >
                                <InputNumber
                                    value={item.incremental}
                                    onChange={(value) => updatedz(item.key,{incremental:value})}
                                />
                            </Form.Item>
                            <Form.Item>
                                <Button onClick={() => removeFormItemByKey(item.key)} type="link" style={{ marginLeft: 'auto' }}>
                                    删除
                                </Button>
                            </Form.Item>
                        </div>

                    ))}
                    <Button type="primary" onClick={addFormItem} style={{ marginTop: '16px' }}>
                        新增递增
                    </Button>
                </Form.Item>
                <Form.Item {...tailLayout}>
                    {wupinList.map((item:any,index:number) => (
                        <div style={{ display: 'flex'}} key={item.key}>
                            <Form.Item label="物品名称">
                                <Input
                                    value={item.wupinName}
                                    onChange={(value) => updateName(item.key,{wupinName:value.target.value})}
                                />
                            </Form.Item>
                            <Form.Item label="交付标准">
                                <Input
                                    value={item.wupininfo}
                                    onChange={(value) => updatebiaozhun(item.key,{wupininfo:value.target.value})}
                                />
                            </Form.Item>
                            <Form.Item label="数量">
                                <InputNumber
                                    value={item.wupinNuber}
                                    onChange={(value) => updateMiber(item.key,{wupinNuber:value})}
                                />
                            </Form.Item>
                            <Form.Item>
                                <Button onClick={() => removeqingdan(item.key)} type="link" style={{ marginLeft: 'auto' }}>
                                    删除
                                </Button>
                            </Form.Item>
                        </div>

                    ))}
                    <Button type="primary" onClick={addwuping} style={{ marginTop: '16px' }}>
                        新增物品清单
                    </Button>
                </Form.Item>
                <Form.Item {...tailLayout}>
                    <Button type="primary" htmlType="submit">
                        录入合同
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}
const mapStateToProps = (state: any) => {
    return {
        CheckCompanyList: state.CheckCompany.list,
        UnitList: state.Unit.list,
    }
};
export default connect(mapStateToProps) (AddStaff)