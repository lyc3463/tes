import  styles from './recharge.less'
import {Radio} from "antd";
const Recharge=()=>{
    const data=[
        {id:1,title:'短信5250条',money:500,youhui:5},
        {id:2,title:'短信11000条',money:1000,youhui:10},
        {id:3,title:'短信57500条',money:5000,youhui:15},
    ]
    return(
        <div>
            <div className={styles.titleBox}><h4>短信在线充值</h4></div>
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
                        <div className={styles.controls}>钱汇物业</div>
                    </div>
                    <div className={styles.controlGroup}>
                        <label className={styles.controlLabel}>当前剩余</label>
                        <div className={styles.controls}>873条</div>
                    </div>
                    <div className={styles.controlGroup}>
                        <label className={styles.controlLabel}>充值金额</label>
                        <div className={styles.controls}>
                            <input type='number' className={styles.post} min='2' max='10000' name='totle_fee' placeholder='每条0.1元'/> 元
                            ( 短信数量：
                            <span style={{color:'red'}}>0</span>条)
                            <br/>
                            <ul style={{listStyle:"none",margin:"20px 0",width:'80%',display:'flex'}}>
                                {
                                    data.map((item:any,index:any)=>{
                                        return(
                                            <li key={index} className={styles.lis}>
                                                <div>
                                                    <b>￥{item.money}</b>
                                                    <br/>
                                                    {item.title}
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
                        <Radio.Group style={{marginLeft:'20px'}}>
                            <Radio value={1}>微信支付</Radio>
                        </Radio.Group>
                    </div>
                    <div className={styles.fromActions}>
                        <button type='button' className={styles.btn}>立即付款</button>
                    </div>
                </fieldset>
            </form>
        </div>
    )
}
export default Recharge