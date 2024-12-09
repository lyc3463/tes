import {useEffect, useRef, useState} from "react";
import {filterAndUpdateList} from "@/utils/OpenTool";
import * as StaffServer from "@/services/staff";
import {connect,history} from "umi";
import {Button, DatePicker, Form, Image, Input, InputNumber, message, Select, Space} from "antd";
import dayjs from "dayjs";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import ImageUploader from "@/components/ImageUploader";
import * as contractTypeListServer from "@/services/contractTypeList";
const tailLayout = {
    wrapperCol: { offset: 3 },
};
const EditStaff=(props:any)=>{
    const formRef=useRef();
    const [formItems, setFormItems] = useState([]);
    // 开始时间
    const [startDate,setStartDate]=useState('');
    // 结束时间
    const [endDate,setEndDate]=useState('');
    // 路由参数
    const [uid,setUid]=useState('');
    // 交付日
    const [deliveryDate,setDeliveryDate]=useState('2000-01-01');
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
    // 合同类型ID  1定金合同，2正式合同
    const [contractType,setcontractType]=useState(2);
    // 合同类型列表
    const [ctyList,setCtyList]=useState([]);
    // 合同类型列表ID
    const [contractTypeid,setcontractTypeid]=useState(0);
    // 物品清单
    const [wupinList, setwupinList] = useState([
        { key: 1,wupinName:null,wupininfo:null,wupinNuber:0},
    ]);
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const id = searchParams.get('id');
        setUid(id);
        getOneStaff(id);
        getUnitList();
        getCheckCompanyList();
        getCtyList();
    }, []);
    const getOneStaff= (id:string)=>{
        StaffServer.one(id).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                console.log("data",res.Data)
                formRef.current.setFieldsValue(res.Data[0]);
                    formRef.current.setFieldsValue(res.Data[0]);
                    setEndDate(dayjs(res.Data[0].endTime).format('YYYY-MM-DD'));
                    setStartDate(dayjs(res.Data[0].beginTime).format('YYYY-MM-DD'));
                    setFormItems(res.Data[1]);
                    setB64(res.Data[0].documentBase64);
                    setuintB64(res.Data[0].unitBase64);
                    setImgName(res.Data[0].documentImage);
                    setunitImgName(res.Data[0].unitImage);
                    setDeliveryDate(res.Data[0].deliveryDate);
                    let jsonList=JSON.parse(res.Data[0].goodsJson);
                    setwupinList(jsonList);
                    let joinImageB64=res.Data[0].addBase64.split('|');
                    setxyimgb64(joinImageB64);
                    let joinImageName=res.Data[0].addImage.split('|');
                    setxyimgnames(joinImageName)
            }else {
                message.error(res.Data);
            }
        });
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
    // 获取合同类型列表
    const getCtyList=()=>{
        contractTypeListServer.contractTypeList().then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                setCtyList(res.Data);
            }else {
                message.error(res.Data)
            }
        })
    };
    const onFinish=(val:any)=>{
        if (contractType==2){
            let formItemsjson=JSON.stringify(formItems);
            let wupinListjson=JSON.stringify(wupinList);
            let date={rentJson:formItemsjson,goodsJson:wupinListjson};
            let jsonDate=JSON.stringify(date);
            let imgs=xyimgnames.join('|');
            props.dispatch({
                type:'Staff/editzs',
                payload:{...val,uid,endDate,startDate,jsonDate,deliveryDate,documentImage,unitImage,imgs,contractTypeid}
            }).then((res:any)=>{
                if (res.ErrorCode==0){
                    message.success('修改正式合同成功');
                    history.push('/enter/staff')
                }else {
                    message.error(res.Data)
                }
            })
        }else if (contractType==1){
            props.dispatch({
                type:'Staff/editdj',
                payload:{...val,uid}
            }).then((res:TypeErrorCode)=>{
                if (res.ErrorCode==0){
                    message.success('修改定金合同成功');
                    history.push('/enter/staff');
                }else {
                    message.error(res.Data);
                }
            })
        }

    };
    // 获取当前时间
    const getCurrentDate=()=>{
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const day = String(currentDate.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`
    };
    // 更新起租日
    const updateqizuDate = (key, updates) => {
        setFormItems(prevItems => prevItems.map(item => item.id === key ? { ...item, ...updates } : item));
    };
    // 更新免租期
    const updatemz = (key, updates) => {
        setFormItems(prevItems => prevItems.map(item => item.id === key ? { ...item, ...updates } : item));
    };
     // 更新递增
    const updatedz = (key, updates) => {
        console.log(updates)
        setFormItems(prevItems => prevItems.map(item => item.id === key ? { ...item, ...updates } : item));
    };
    // 添加新表单项
    const addFormItem = () => {
        const newKey = formItems.length ? Math.max(...formItems.map(item => item.id)) + 1 : 1;
        setFormItems([...formItems, { id: newKey, beginTime: getCurrentDate(), endTime: getCurrentDate(), rentBeginTime: getCurrentDate(),rentEndTime:getCurrentDate(), incremental:0}]);
    };
    // 删除表单项
    const removeFormItemByKey = key => {
        setFormItems(prevItems => prevItems.filter(item => item.id !== key));
    };
    // 删除物品表单项
    const removeqingdan = key => {
        setwupinList(prevItems => prevItems.filter(item => item.key !== key));
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
    // 交付日
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
    // 添加物品表单项
    const addwuping = () => {
        const newKey = wupinList.length ? Math.max(...wupinList.map(item => item.key)) + 1 : 1;
        setwupinList([...wupinList, { key: newKey,wupinName: null,wupininfo: null,wupinNuber: 0}]);
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
    function findById(array, id) {
        return array.find(item => item.id === id);
    }
    const changecontractType=(e)=>{
        let result=findById(ctyList,e);
        setcontractType(result.templateType);
        setcontractTypeid(result.id);
    };
    return(
        <div>
            <Form
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 14 }}
                ref={formRef}
                onFinish={onFinish}
                layout="horizontal"
                size={'large'}
                style={{ marginTop:'1rem'}}
            >
                <Form.Item label='合同编号' name='identifier'>
                    <Input/>
                </Form.Item>
                <Form.Item label='合同类型' name='contractType'>
                    <Select onChange={changecontractType} disabled>
                        {
                            ctyList.map((item:any,index:number)=>{
                                return(
                                    <Select.Option value={item.id} key={index}>
                                        {item.templateType==1?'定金合同':'正式合同'}
                                    </Select.Option>
                                )
                            })
                        }
                    </Select>
                </Form.Item>
                <Form.Item label='客户' name='clientId'>
                    <Select>
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
                <Form.Item label='租金' name='zuMoney'>
                    <InputNumber/>
                </Form.Item>
                <Form.Item label='押金' name='deposit' >
                    <InputNumber/>
                </Form.Item>
                {
                    contractType==2?<>
                        <Form.Item label='租户身份证' name='customCard'>
                            <Input/>
                        </Form.Item>
                        <Form.Item label='起租日'>
                            {startDate&&endDate? <DatePicker.RangePicker defaultValue={[dayjs(startDate), dayjs(endDate)]}/>:''}
                        </Form.Item>

                        <Form.Item label='管理费(元)' name='manageFee'>
                            <InputNumber/>
                        </Form.Item>
                        <Form.Item label='管理费每年递增%' name='manageFeeRent'>
                            <InputNumber min={0}/>
                        </Form.Item>
                        <Form.Item label='经营主体' name='businessEntity' >
                            <Input/>
                        </Form.Item>
                        <Form.Item label='经营范围' name='businessScope' >
                            <Input/>
                        </Form.Item>
                        <Form.Item label='交付日' >
                            <DatePicker onChange={changedeliveryDate} value={dayjs(deliveryDate)}/>
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
                                <div style={{ display: 'flex'}} key={item.id}>
                                    <Form.Item label="起租日">
                                        <DatePicker.RangePicker
                                            defaultValue={[dayjs(item.beginTime), dayjs(item.endTime)]}
                                            onChange={(dates,data) => updateqizuDate(item.id,{beginTime: data[0], endTime: data[1]})}
                                        />
                                    </Form.Item>
                                    <Form.Item label="免租期" >
                                        <DatePicker.RangePicker
                                            defaultValue={[dayjs(item.rentBeginTime), dayjs(item.rentEndTime)]}
                                            onChange={(dates,data) => updatemz(item.id,{rentBeginTime: data[0], rentEndTime: data[1]})}
                                        />
                                    </Form.Item>
                                    <Form.Item label="递增">
                                        <InputNumber
                                            value={item.incremental}
                                            onChange={(value) => updatedz(item.id,{incremental:value})}
                                        />
                                    </Form.Item>
                                    <Form.Item>
                                        <Button onClick={() => removeFormItemByKey(item.id)} type="link" style={{ marginLeft: 'auto' }}>
                                            删除
                                        </Button>
                                    </Form.Item>
                                </div>

                            ))}
                            <Button type="primary" onClick={addFormItem} style={{ marginTop: '16px' }}>
                                新增
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
                    </>:''
                }
                <Form.Item {...tailLayout}>
                    <Button type="primary" htmlType="submit">
                        修改
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
export default  connect(mapStateToProps) (EditStaff)