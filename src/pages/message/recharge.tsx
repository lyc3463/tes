import  styles from './recharge.less'
import {Button, Input, InputNumber, message, Modal, Radio, Space} from "antd";
import {useEffect, useState} from "react";
import * as RechargeService from '@/services/recharge';
import {connect,history} from "umi";
import ErrorCodeType from "@/ModelTypes/TypeErrorCode";
import Myqrcode from "@/components/Myqrcode";
import {RedoOutlined} from "@ant-design/icons";
import dayjs from "dayjs";

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
    // 替换页面
    const [isTihuan,setIsTihuan]=useState(false);
    // code
    const [code,setCode]=useState('');
    const selectNuber=(item:any)=>{
        setMoney(item.money);
        setNumberItems(item.title);
    };
    const changemoney=(e:any)=>{
        setMoney(e);
    };
    useEffect(() => {
        if (money<500){
            setNumberItems(money/0.1);
        }else if (money>=500&&money<1000){
            setNumberItems((money/0.1)+(money*0.5));
        }else if (money>=1000&&money<5000){
            setNumberItems((money/0.1)+(money*1));
        }else if (money>=5000){
            setNumberItems((money/0.1)+(money*1));
        }
    }, [money]);
    // 获取园区短信条数
    const getOneNuber=()=>{
        RechargeService.one().then((res:ErrorCodeType)=>{
            if (res.ErrorCode==0){
                setRemaining(res.Data.SmsNumber);
                setParkName(res.Data.park_name);
            }else {
                message.error(res.Data);
            }
        })
    };
    useEffect(() => {
        getOneNuber();
    }, []);
    // 微信二维码支付
    const wxQrPay=()=>{
        if (money<=0){
            message.warning('请输入金额');
        }else {
            let newMoney=money*100;
            let remarks=`短信充值;充值金额${money}元;充值条数${numberItems}条`;
            // RechargeService.adddgchongzhi(
            //     {newMoney,remarks,rechargetype:1,startDate:dayjs().format('YYYY-MM-DD'),numberItems}
            // ).then((res:ErrorCodeType)=>{
            //         if (res.ErrorCode==0){
            //             setCode(res.Data);
            //             getOneNuber();
            //             setIsTihuan(true);
            //         }else {
            //             message.error(res.Data);
            //         }
            //     });
            props.dispatch({
                type:'Recharge/addchongzhi',
                payload:{newMoney,remarks,rechargetype:1,startDate:dayjs().format('YYYY-MM-DD'),numberItems}
            }).then((res:ErrorCodeType)=>{
                if (res.ErrorCode==0){
                    console.log('参数',res.Data);
                    setCode(res.Data);
                    getOneNuber();
                    setIsTihuan(true);
                }else {
                    message.error(res.Data);
                }
            });
        }
    };
    // 支付宝二维码支付
    const aliQrPay=()=>{
        if (money<=0){
            message.warning('请输入金额');
        }else {
            let newMoney=money*100;
            let remarks=`微信充值短信${numberItems}条`;
            RechargeService.addaliPayQr(
                {newMoney,remarks,payType:"alipay_qr",numberItems,rechargetype:5,startDate:dayjs().format('YYYY-MM-DD')}
            )
            // props.dispatch({
            //     type:'Recharge/addaliPayQr',
            //     payload:{newMoney,remarks,payType:"alipay_qr",numberItems,rechargetype:5,startDate:dayjs().format('YYYY-MM-DD')}
            // })
                .then((res:ErrorCodeType)=>{
                if (res.ErrorCode==0){
                    console.log('res.Data',res)
                    setCode(res.Data.payInfo);
                    getOneNuber();
                    setIsTihuan(true);
                }else {
                    message.error(res.Data);
                }
            });
        }
    };
    const add=()=>{
        // aliQrPay();
        wxQrPay();
        // if (money<=0){
        //     message.warning('请输入金额');
        // }else {
        //     let newMoney=money*100;
        //     let remarks=`短信充值;充值金额${newMoney}分;充值条数${numberItems}条`;
        //     props.dispatch({
        //         type:'Recharge/addchongzhi',
        //         payload:{newMoney,remarks,numberItems,rechargetype:1,startDate:dayjs().format('YYYY-MM-DD')}
        //     }).then((res:ErrorCodeType)=>{
        //         if (res.ErrorCode==0){
        //             setCode(res.Data);
        //             getOneNuber();
        //             setIsTihuan(true);
        //         }else {
        //             message.error(res.Data);
        //         }
        //     });
        // }
    };
    const cancelOk=()=>{
        getOneNuber();
        setIsTihuan(false);
    };
    return(
        <div>
            <div className={styles.titleBox}><h4>支付充值</h4></div>
            <div className={styles.tip}>
                通知短信每条0.1元，暂不支持退款
                <br/>
                购买的短信用于发送剩余金额报警、充值成功通知等,发送失败不扣费。
                <br/>
                {/*仅支持最近90天消费订单申请*/}
                {/*<b style={{color:'red'}}>电子发票</b>*/}
                {/*，单次开票金额需满200元,由短信运营商开具。*/}
                {/*<br/>*/}
                {/*短信通知功能需*/}
                {/*<b style={{color:"red"}}>打开定时抄表，设置一级，二级报警值后生效 </b>*/}
                {/*<br/>*/}
            </div>
            {
                isTihuan?<div style={{  paddingLeft:'100px'}}>
                    <div><span style={{fontSize:'16px',color:'red'}}>请使用支付宝扫码支付↓</span></div>
                    <div className={styles.qrBox}>
                        <Myqrcode value={code}></Myqrcode>
                    </div>
                    <div className={styles.okCss}>扫码成功后，如没有反应请点击下面确定付款按钮</div>
                    <Space>
                        <Button type='primary' onClick={cancelOk}>我已付款，并且离开</Button>
                    </Space>
                </div>:<>
                    <form className={styles.content}>
                        <fieldset style={{border:'none'}}>
                            <div className={styles.controlGroup}>
                                <label className={styles.controlLabel}>区域名称</label>
                                <div className={styles.controls}>{parkName}</div>
                            </div>
                            <div className={styles.controlGroup}>
                                <label className={styles.controlLabel}>当前剩余</label>
                                <div className={styles.controls}><span>{remaining}条</span><Button style={{border:'none'}} onClick={()=> getOneNuber()}><RedoOutlined /></Button></div>
                            </div>
                            <div className={styles.controlGroup}>
                                <div className={styles.controls}>
                                    <InputNumber value={money} className={styles.post} min={1} name='totle_fee' placeholder='每条0.1元' onChange={(e)=>changemoney(e)}/> 元
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
                </>
            }
        </div>

    )
}

export default connect() (Recharge)