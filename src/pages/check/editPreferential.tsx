import {useEffect, useState} from "react";
import {connect, history,useNavigate} from "umi";
import {Button, DatePicker, Form, Image, Input, InputNumber, message, Radio, Space, Spin} from "antd";
import * as Preferential from '@/services/preferential';
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import dayjs from "dayjs";
import ImageUpload from "@/components/ImageUploader";
const tailLayout = {
    wrapperCol: { offset: 4 },
};
const EditPreferential=(props)=>{
    const navigate=useNavigate();
    const [uid,setUid]=useState<string|undefined>('0');
    // 分期金额
    const [preRen,setpreRen]=useState(0);
    // 分期类型
    const [preType,setpreType]=useState(0);
    const [spinning,setspinning]=useState(false);
    // 租户姓名
    const [tenant_name,settenant_name]=useState('');
    // 租户手机号
    const [tenant_phone,settenant_phone]=useState('');
    // 优惠开始 月份
    const [startDate,setStartDate]=useState('2000-01-01');
    // 优惠结束月份
    const [endDate,setEndDate]=useState('2000-02-01');
    const [imgB64, setImgB64] = useState<string[]>([]);
    const [imgName,setImgName]=useState<string[]>([]);
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const id = searchParams.get('id');
        setUid(id);
        getInfo(id);
    }, []);
    const getInfo=(id:string)=>{
        setspinning(true);
        Preferential.one(id).then((res:TypeErrorCode)=>{
            console.log('res',res);
            if (res.ErrorCode==0){
                setspinning(false);
                setpreRen(res.Data.preRen);
                setUid(res.Data.id);
                setpreType(res.Data.preType);
                settenant_name(res.Data.tenant_name);
                settenant_phone(res.Data.tenant_phone);
                setStartDate(res.Data.preBeginTime);
                setEndDate(res.Data.preEndTime);
                setImgName(res.Data.pdfImage.split("|"));
                setImgB64(res.Data.pdfImageBase64.split("|"));

            }else {
                setspinning(false);
                message.error(res.Data);
            }
        });
    };
    const onOK=()=>{
        setspinning(true)
        const imgList=imgName.join('|');
        props.dispatch({
            type:'Preferential/edit',
            payload:{uid,preRen,startDate,endDate,preType,imgList}
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                setspinning(false);
                message.success('修改成功');
                history.push('/enter/afterSales/');
            }else {
                message.error(res.Data);
                setspinning(false);
            }
        })
    };
    const changeDate=(_,data)=>{
        if (data.length === 2 && data[0] === '' && data[1] === '') {
            setStartDate(dayjs(startDate).format('YYYY-MM-DD'));
            setEndDate(dayjs(endDate).format('YYYY-MM-DD'));
        } else {
            setStartDate(dayjs(data[0]).format('YYYY-MM-DD'));
            setEndDate(dayjs(data[1]).format('YYYY-MM-DD'));
        }
    };
    // 图片base64
    const onImageUpload=(base64:any)=>{
        setImgName([...imgName,base64]);
    };
    const oldBase64=(base64:any)=>{
        setImgB64([...imgB64,base64]);
    };
    // 删除租户证件图片
    const handleDeletezuhu = (index: number) => {
        const newImages = [...imgB64];
        newImages.splice(index, 1);
        setImgB64(newImages);
        const newB64 = [...imgName];
        newB64.splice(index, 1);
        setImgName(newB64);
    };
  return(
      <Spin spinning={spinning}>
          <Form
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 14 }}
              layout="horizontal"
              size={'large'}
              style={{ marginTop: '1rem' }}
          >
              {/*<Form.Item label='合同名称'>*/}
              {/*    <Input/>*/}
              {/*</Form.Item>*/}
              <Form.Item label='租户姓名'>
                  <Input value={tenant_name}/>
              </Form.Item>
              <Form.Item label='租户手机号'>
                  <Input value={tenant_phone}/>
              </Form.Item>
              <Form.Item label='优惠开始-结束月份'>
                  <DatePicker.RangePicker picker="month" value={[dayjs(startDate),dayjs(endDate)]} onChange={changeDate}/>
              </Form.Item>
              {/*<Form.Item label='优惠结束月份'>*/}
              {/*    <DatePicker picker="month" value={dayjs(endDate)}/>*/}
              {/*</Form.Item>*/}
              <Form.Item label='优惠金额(元)'>
                  <InputNumber value={preRen} onChange={(e)=>setpreRen(e)}/>
              </Form.Item>
              <Form.Item label='优惠类型'>
                  <Radio.Group value={preType} onChange={(e)=>setpreType(e.target.value)}>
                      <Radio value={2}>未满合同优惠</Radio>
                      <Radio value={1}>满合同优惠</Radio>
                  </Radio.Group>
              </Form.Item>
              <Form.Item label='图片'>
                  <ImageUpload onImageUpload={onImageUpload} oldBase64={oldBase64}/>
                  {/* 有图片才渲染预览区域 */}
                  {imgB64.length > 0 && (
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
                  )}
              </Form.Item>
              <Form.Item {...tailLayout}>
                  <Space>
                      <Button type="primary" onClick={onOK}>
                          确定修改
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
export default connect() (EditPreferential);