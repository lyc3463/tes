import  styles from './recharge.less'
import {Input, InputNumber, message, Radio} from "antd";
import {useEffect, useState} from "react";
import * as RechargeService from '@/services/recharge';
import {connect} from "umi";

const Recharge=(props)=>{
    const data=[
        {id:1,title:5250,money:500,youhui:5},
        {id:2,title:11000,money:1000,youhui:10},
        {id:3,title:57500,money:5000,youhui:15},
    ];
    const [money,setMoney]=useState(0);
    const [numberItems,setNumberItems]=useState(0);
    const [remaining,setRemaining]=useState(0);
    const [parkName,setParkName]=useState('');
    const selectNuber=(item:any)=>{
        setMoney(item.money);
        setNumberItems(item.title);
    };
    const changemoney=(e:any)=>{
        setMoney(e);
    };
    useEffect(() => {
        if (money<500){
            setNumberItems(money/0.1)
        }else if (money>=500&&money<1000){
            setNumberItems((money/0.1)+(money*0.5))
        }else if (money>=1000&&money<5000){
            setNumberItems((money/0.1)+(money*1))
        }else if (money>=5000){
            setNumberItems((money/0.1)+(money*1))
        }
    }, [money]);
    // 获取园区短信条数
    const getOneNuber=()=>{
        RechargeService.one().then((res:any)=>{
            if (res.ErrorCode==0){
                setRemaining(res.Data.SmsNumber);
                setParkName(res.Data.park_name);
            }else {
                message.error(res.Data)
            }
        })
    };
    useEffect(() => {
        getOneNuber()
    }, []);
    const add=()=>{
        if (money<0.1){
            message.error('请输入金额')
        }else {
            props.dispatch({
                type:'Recharge/add',
                payload:{money,numberItems}
            }).then((res:any)=>{
                if (res.ErrorCode==0){
                    message.success('已提交申请,请等待管理员审核')
                }else {
                    message.error(res.Data)
                }
            })
        }
    };
    return(
        <div>
            <div className={styles.titleBox}><h4>手动充值</h4></div>
            <div className={styles.tip}>
                通知短信每条0.1元，暂不支持退款
                <br/>
                购买的短信用于发送剩余金额报警、充值成功通知等,发送失败不扣费。
                <br/>
                仅支持最近90天消费订单申请
                <b style={{color:'red'}}>电子发票</b>
                ，单次开票金额需满200元,由短信运营商开具。
                <br/>
                短信通知功能需
                <b style={{color:"red"}}>打开定时抄表，设置一级，二级报警值后生效 </b>
                <br/>
            </div>
            <form className={styles.content}>
                <fieldset style={{border:'none'}}>
                    <div className={styles.controlGroup}>
                        <label className={styles.controlLabel}>区域名称</label>
                        <div className={styles.controls}>{parkName}</div>
                    </div>
                    <div className={styles.controlGroup}>
                        <label className={styles.controlLabel}>当前剩余</label>
                        <div className={styles.controls}>{remaining}条</div>
                    </div>
                    <div className={styles.controlGroup}>
                        <div className={styles.controls}>
                            <InputNumber value={money} className={styles.post} min={0.1} name='totle_fee' placeholder='每条0.1元' onChange={(e)=>changemoney(e)}/> 元
                            ( 短信数量：
                            <span style={{color:'red'}}>{numberItems}</span>条)
                            <br/>
                            <ul style={{listStyle:"none",margin:"20px 0",width:'80%',display:'flex'}}>
                                {
                                    data.map((item:any,index:any)=>{
                                        return(
                                            <li key={index} className={styles.lis} onClick={()=>selectNuber(item)}>
                                                <div>
                                                    <b>￥{item.money}</b>
                                                    <br/>
                                                    <span>短信{item.title}条</span>
                                                    <br/>
                                                    <span style={{color:'red'}}>赠{item.youhui}%</span>
                                                </div>
                                            </li>
                                        )
                                    })
                                }
                            </ul>
                        </div>
                    </div>
                    <div className={styles.controlGroup}>
                        <label className={styles.controlLabel}>支付方式</label>
                        <Radio.Group style={{marginLeft:'20px'}} defaultValue={1}>
                            <Radio value={1}>微信支付</Radio>
                        </Radio.Group>
                    </div>
                    <div className={styles.fromActions}>
                        <button type='button' className={styles.btn} onClick={add}>立即购买</button>
                    </div>
                </fieldset>
            </form>
        </div>
    )
}

export default connect() (Recharge)