import {useEffect, useState} from "react";
import {Button, Form, Modal, Radio, Select, Slider, Input, InputNumber, message, DatePicker, Tabs} from "antd";
import {connect} from "umi";
import {StaticInfo} from "@/StaticInfo";
import Bymoney from "@/pages/kehu/bymoney";

const Zhanghupeizhi=(props)=>{
    const [disabled, setDisabled] = useState(false);
    const [isopen,setopen]=useState(false);
    // 结算方式 1实时结算 2每天自动结算 3指定日期结算 4手动结算
    const [settlement,setSettlement]=useState(0);
    // 当前余额
    const [balance,setBalance]=useState(0);
    // 最大结算金额
    const [maxAmount,setMaxAmount]=useState(0);
    // 账户保留金额
    const [reserveAmount,setReserveAmount]=useState(0);
    // 指定结算日期
    const [settlementTime,setSettlementTime]=useState(1);
    const days = Array.from({ length: 28 }, (_, i) => i + 1);
    const [remark,setRemark]=useState('');
    // 手续费
    const [commission,setCommission]=useState(0);
    // 提现金额
    const [withdAmount,setWithdAmount]=useState(0);
    // 结算方式类型
    const [settlementz,setsettlementz]=useState(0);
    // 用户权限
    const [uqx,setUqx]=useState([]);
    // 监听结算方式
    const changeRadio=(e)=>{
        setSettlement(e.target.value);
    };
    const getInfo=()=>{
      props.dispatch({
          type:'Zhanghupeizhi/one'
      }).then((res)=>{
          if (res.ErrorCode===0){
              setSettlement(res.Data.settlement);
              setBalance(res.Data.balance);
              setMaxAmount(res.Data.maxAmount);
              setReserveAmount(res.Data.reserveAmount);
              setCommission(res.Data.commission);
              setsettlementz(settlement);
              if (res.Data.settlementTime){
                  setSettlementTime(res.Data.settlementTime);
              }else {
                  setReserveAmount(1);
              }
          }else {
              message.error(res.Data);
          }
      })
    };
    useEffect(() => {
        getInfo();
    }, []);
    const onbaocun=()=>{
      props.dispatch({
          type:'Zhanghupeizhi/edit',
          payload:{settlement,settlementTime,maxAmount,reserveAmount,commission}
      }).then((res:any)=>{
          if (res.ErrorCode==0){
              message.success('保存成功');
              getInfo()
          }else {
              message.error(res.Data)
          }
      })
    };
    const handleCheckChange=(e)=>{
        setSettlementTime(e)
    };
    // 手动提现
    const onOK=()=>{
        if (settlement==4){
            if (withdAmount>balance){
                message.error('提现金额大于当前余额')
            }else if(withdAmount<=0){
                message.error('提现金额为0')
            } else {
                props.dispatch({
                    type:'Zhanghupeizhi/add',
                    payload:{withdAmount,remark,commission}
                }).then((res)=>{
                    console.log('res',res)
                    if (res.ErrorCode==0){
                        message.success('提交成功，等待管理员审核');
                        getInfo();
                        setopen(false);
                        setRemark('');
                    }else {
                        message.error(res.Data)
                    }
                })
            }
        }else {
           message.warning('当前类型不是手动结算类型')
        }
    };
    useEffect(() => {
        let uq=StaticInfo.uqx.split('');
        setUqx(uq);
    }, []);
    return(
        <div>
            <Form>
                <Form.Item label='所属园区'>
                    <span>{sessionStorage.getItem('park_name')}</span>
                    <p>提现手续费:<span style={{color:'red'}}>{(commission/1000).toFixed(3)}</span></p>
                </Form.Item>
                {/*<Form.Item label='结算微信商户名'>*/}
                {/*    <span style={{color:'rgb(0, 128, 0)'}}>前汇物业</span>*/}
                {/*</Form.Item>*/}
                <Form.Item label='当前余额'>
                    <span style={{fontSize:'25px',fontWeight:'500'}}>{balance}</span>元<span style={{marginLeft:'15px'}}>可提现金额<span style={{color:'red'}}>{balance}</span>元</span>
                    {uqx[317]=='1'?<Button type='primary' onClick={()=>setopen(true)} >手动立即提现</Button>:''}
                    <p style={{color:'#888'}}>如未设置默认银行卡请到<span style={{color:'red'}}>钱包管理/银行卡管理</span>设置默认银行卡</p>
                </Form.Item>
                {/*<Form.Item label='今日提现预计到账日'>*/}
                {/*    <span style={{color:'#555'}}>2024年07月23日 23:59前</span>*/}
                {/*</Form.Item>*/}
                {/*<Form.Item label='结算钱包类型' style={{width:'20vw'}}>*/}
                {/*    <Select/>*/}
                {/*</Form.Item>*/}
                <Form.Item label='结算方式'>
                    <Radio.Group onChange={changeRadio} value={settlement} >
                        <Radio value={1}>实时结算</Radio>
                        <Radio value={2}>每天自动结算一次(如果)</Radio>
                        <Radio value={3}>指定结算日</Radio>
                        <Radio value={4}>手动结算</Radio>
                    </Radio.Group>
                    <p style={{color:'#888'}}>每日结算：每日6时自动结算前一天收款一次性转入收款账户</p>
                    <p style={{color:'#888'}}>指定结算日：每月指定日期结算(如当月没有指定日期会存到下个月再提现)</p>
                    <p style={{color:'#888'}}>手动结算：手动通过后台发起转账结算</p>
                </Form.Item>
                {
                    settlement==3? <Form.Item className="days-container">
                        <Select  onChange={handleCheckChange} value={settlementTime} style={{width:"200px"}}>
                            {days.map((item:any,index:any)=>{
                                return(
                                    <Select.Option value={item} key={index} >
                                        每月{item}号
                                    </Select.Option>
                                )
                            })}
                        </Select>
                        {/*<Radio.Group onChange={handleCheckChange} value={settlementTime}>*/}
                        {/*    {days.map((item:any,index:any)=>{*/}
                        {/*        return (*/}
                        {/*            <Radio value={item} key={index}>{item}号</Radio>*/}
                        {/*        )*/}
                        {/*    })}*/}
                        {/*</Radio.Group>*/}
                    </Form.Item>:''
                }
                <Form.Item label='最大结算金额(元)'>
                   <InputNumber min={0} value={maxAmount} onChange={(e:number)=>setMaxAmount(e)}/>
                </Form.Item>
                <Form.Item label='账户保留金额(元)'>
                    <InputNumber min={0} value={reserveAmount} onChange={(e:number)=>setReserveAmount(e)}/>
                </Form.Item>
                {/*<Form.Item  label='客服/报信电话'>*/}
                {/*    <Input style={{width:'20vw'}}/>*/}
                {/*    <p style={{color:'#888'}}>开通在线支付功能,请完善客服电话，用于故障报修,开票,退款等售后问题</p>*/}
                {/*    <p style={{color:'#888'}}>长时间无法联系商家可能导致线上支付权限被关闭或支付限额</p>*/}
                {/*</Form.Item>*/}
                <Form.Item style={{backgroundColor:'#f5f5f5',borderTop:'1px solid #e5e5e5',padding:'19px 20px 20px',margin:'20px 0'}}>
                    {uqx[315]=='1'? <Button type='primary' onClick={onbaocun}>保存设置</Button>:''}
                    <Button style={{marginLeft:'20px'}}>返回</Button>
                </Form.Item>
            </Form>
            <Modal open={isopen} onOk={onOK} onCancel={()=>setopen(false)} title='是否要提现'>
                {/*<div>当前有<span style={{color:'red'}}>{balance}</span>元可提现,实际到款<span style={{color:'red'}}>{(balance-(balance*(commission/1000))).toFixed(2)}元</span></div>*/}
                <Form>
                    <Form.Item label='输入提现金额(元)'>
                        <InputNumber max={balance} onChange={(e:any)=>setWithdAmount(e)} min={0}/>
                    </Form.Item>
                </Form>
                {/*<p style={{color:'#555',fontSize:'12px'}}>实际到款=当前余额-(当前余额*手续费)</p>*/}
                <Form>
                    <Form.Item label='备注'>
                        <Input.TextArea onChange={(e)=>setRemark(e.target.value)} value={remark}/>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}
export default connect() (Zhanghupeizhi)