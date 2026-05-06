import {
  connect,
  history,
  useNavigate
} from 'umi';
import _ from 'lodash';
import { StaticInfo } from '@/StaticInfo';
import { useEffect, useState } from 'react';
import { EventMgr } from '@/Event/EventMgr';
import type { RadioChangeEvent } from 'antd';
import {
  Image,
  Descriptions,
  Space,
  Input,
  Button,
  message,
  Tabs,
  Table,
  Avatar,
  Row,
  Col,
  Popover,
  Form,
  Select,
  DatePicker,
  Radio,
  Checkbox,
  InputNumber,
  Statistic,
  Spin
} from 'antd';
import { getAvatarUrl } from '@/utils/common';
import { SyncOutlined } from '@ant-design/icons';
import {replaceEnglishCommasWithChinese} from "@/utils/OpenTool";


const { Option } = Select;

const tailLayout = {
  wrapperCol: { offset: 4 },
};

const { TextArea } = Input;

function Addgongsi(props: any) {
  const navigate=useNavigate();

  // 收费类型 1周期性收费 2一次性收费 3押金类收费
  const [itemType,setItemType]=useState(1);
  // 月金额计算方式 1固定金额 2按照单价收费 3每户手动输入
  const [monthly_amount,setMonthly_amount]=useState(1);
  // 扣款方式类型 1当期收当期 2当期收上期 3当期收下期
  const [deduction_method,setDeduction_method]=useState(0);
  //  收费间隔
  const [item_interval,setItem_interval]=useState(0);
  // 单价
  const [price,setPrice]=useState(0);
  // 预支付金额
  const [prepaidAmount,setPrepaidAmount]=useState(0);
  // 计量方式
  const [count_method,setCountMethod]=useState(1);
  const [spinning,setspinning]=useState(false);
  const [form] = Form.useForm();
  // 收费类型
  const shoufeiType=(e:any)=>{
    setItemType(e.target.value)
  }

  // 月金额计算方式类型
  const jierType=(e:any)=>{
    setMonthly_amount(e.target.value)
  }
  // 扣款方式类型
  const koukuanType=(e:any)=>{
    setDeduction_method(e.target.value)
  }
  const onFinish = async (values: any) => {
    console.log('参数',values);

    setspinning(true);
    let res=await props.dispatch({
      type:'Gongsi/add',
      payload:{...values,itemType,monthly_amount,deduction_method,item_interval,price,prepaidAmount,count_method,remark:replaceEnglishCommasWithChinese(values.remark)}
    })
    if (res.ErrorCode==0){
      message.success('添加成功');
      history.push('/xiangmu/gongsiguanli');
      setspinning(false);
    }else {
      message.error(res.Data);
      setspinning(false);
    }
  };
  // 收费间隔
  const changeJianGe=(e)=>{
    setItem_interval(e)
  }
  //  单价
  const changePrice=(e)=>{
    console.log(e)
    setPrice(e)
  }
  // 预支付金额
  const ChangePrepaidAmount=(e)=>{
    setPrepaidAmount(e);
  }
  // 计量方式
  const changeCountMethod=(e)=>{
      setCountMethod(e.target.value)
  }
  return (
    <Spin spinning={spinning}>
      <Form
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 14 }}
        form={form}
        layout="horizontal"
        size={'large'}
        onFinish={onFinish}
        style={{ marginTop: '1rem' }}
      >
        <Form.Item label='收费项目名称' name='item_name' rules={[{required: true, message: '请输入收费项目名称'}]}>
          <Input/>
        </Form.Item>
        <Form.Item label='收费类型'>
          <Radio.Group onChange={shoufeiType} defaultValue={itemType}>
            <Radio value={1}>周期性收费</Radio>
            <Radio value={2}>一次性收费</Radio>
            <Radio value={3}>押金类收费</Radio>
          </Radio.Group>
        </Form.Item>
        {
          itemType==1?<><Form.Item label='收费间隔'>
            每<InputNumber controls={false} defaultValue={item_interval} onChange={changeJianGe} min={0}/>天收费一次
            {/*<p style={{color:'#555',fontSize:'12px'}}>注意：下方单价和固定金额为每1天数额 。</p>*/}
          </Form.Item>
            {/*<Form.Item label='扣款方式'>*/}
            {/*  <Radio.Group onChange={koukuanType} defaultValue={deduction_method}>*/}
            {/*    <Radio value={1}>当期收当期(预付费)</Radio>*/}
            {/*    <Radio value={2}>当期收上期(后付费)</Radio>*/}
            {/*    <Radio value={3}>当期收下期(预付费且押一个周期)</Radio>*/}
            {/*  </Radio.Group>*/}
            {/*</Form.Item>*/}
          </>:''
        }
        {/*{*/}
        {/*  itemType==1?<Form.Item label='预付金额(元)'>*/}
        {/*    <InputNumber defaultValue={prepaidAmount}  onChange={ChangePrepaidAmount}/>*/}
        {/*  </Form.Item>:''*/}
        {/*}*/}
        <Form.Item label='月金额计算方式'>
          <Radio.Group onChange={jierType} defaultValue={monthly_amount}>
            <Radio value={1}>固定金额</Radio>
            <Radio value={2}>按照单价计算</Radio>
            {itemType==1? '':<Radio value={3}> 每户手动输入</Radio>}
          </Radio.Group>
        </Form.Item>
        {
          monthly_amount==1?<Form.Item label='固定金额'>
            <InputNumber onChange={changePrice} min={0}/>
          </Form.Item>:''
        }
        {
          monthly_amount==2?
              <>
                <Form.Item label='计量方式'>
                  <Radio.Group onChange={changeCountMethod} value={count_method}>
                    <Radio value={1}>合同面积</Radio>
                    {/*<Radio value={2}>套内面积</Radio>*/}
                    {/*<Radio value={3}>公摊面积</Radio>*/}
                    {/*<Radio value={2}>按电费</Radio>*/}
                    {/*<Radio value={3}>按水费</Radio>*/}
                  </Radio.Group>
                </Form.Item>
              </>:''
        }
        {
          monthly_amount==2?
              <Form.Item label='单价(元)'>
                <InputNumber onChange={changePrice}/>
              </Form.Item>:''
        }
        <Form.Item label='添加备注' name='remark' rules={[{required: true, message: '请输入备注'}]}>
          <Input.TextArea/>
        </Form.Item>

        <Form.Item {...tailLayout}>
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
  );
}


export default connect()(Addgongsi);
