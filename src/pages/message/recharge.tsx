import  styles from './recharge.less'
import {Button, Input, InputNumber, message, Modal, Radio, Space, Spin, Tag} from "antd";
import {useEffect, useState} from "react";
import * as RechargeService from '@/services/recharge';
import {connect,history} from "umi";
import ErrorCodeType from "@/ModelTypes/TypeErrorCode";
import Myqrcode from "@/components/Myqrcode";
import {RedoOutlined} from "@ant-design/icons";
import dayjs from "dayjs";
import {StaticInfo} from "@/StaticInfo";

/* ============================================================
 * 【纯前端】微信扫码跳转小程序 —— 配置说明
 *
 * 实现方式："小程序后台 → 扫普通链接二维码打开小程序" + 前端 qrcode.react 画普通 HTTPS 链接二维码
 * 优点：纯前端出码，后端不需要写任何接口（不用接小程序码/Scheme）
 * 前置：必须先去小程序后台配置一次（10分钟），详见下面注释
 * ============================================================ */

// ① 小程序 AppID（以 wx 开头，mp.weixin.qq.com → 开发 → 开发设置 → 开发者ID）
const WX_MINI_APPID = (process.env.WX_MINI_APPID as string) || 'wxef845cb34de67d20';

// ② 扫码后进入的小程序页面路径（前面不能带 /！）
//    例如：pages/recharge/index   pages/index/index   pages/sms/index
const WX_MINI_PAGE_PATH = 'pages/index/index';

/* ============================================================
 *  ↓ 关键：普通二维码链接配置（纯前端出码的核心） ↓
 *
 *  请先去 小程序后台 → 开发 → 开发设置 → 扫普通链接二维码打开小程序 → 添加：
 *    协议类型：https
 *    二维码规则：https://<下面填的 H5_DOMAIN><下面填的 H5_PATH_PREFIX>
 *                例如：https://app.mycompany.com/sms/
 *    小程序功能页面：对应上面 ② 的 WX_MINI_PAGE_PATH
 *    参数传递方式：选 "二维码参数放到小程序页面参数 scene"（或 Query，按你小程序解析习惯）
 *    然后把校验文件上传到 https://<H5_DOMAIN>/ 根目录完成域名所有权验证
 *
 *  改完之后，把下面两个常量的值替换成你自己真实的域名 + 路径前缀即可。
 * ============================================================ */
// 你的 HTTPS 域名（必须已 ICP 备案，且和后台规则一致，结尾不要 /）
const WX_MINI_QR_DOMAIN = 'https://app.yourdomain.com';
// 后台配置的二维码规则路径（和后台保持一致，开头结尾都加 / 避免拼错）
const WX_MINI_QR_PATH_PREFIX = '/sms/';

// ③ 默认业务参数（最终会拼进 URL），小程序页面 onLoad 解析 scene/query 可拿到
//    注意：整个 scene 建议 ≤ 32 字符（微信 scene 限制）
const WX_MINI_DEFAULT_SCENE = () => `pid=${StaticInfo.park_id || 0}`;

// ④ 二维码宽度 px
const WX_QR_WIDTH = 280;

// 出码模式：
//   'link'  = ✅ 推荐（纯前端 + 后台配置普通二维码规则，扫码直达小程序，不用后端接口）
//   'mini'  = 调后端接口生成微信小程序码（扫码直达小程序，需要后端协议号 1880 已实现 generateWxaCode）
//   'scheme'= 兜底（前端拼 weixin://dl/business URL Scheme，需要后端生成 ticket，不推荐纯前端场景使用）
type QrMode = 'link' | 'mini' | 'scheme';
const WX_QR_MODE: QrMode = 'link';

const Recharge=()=>{
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
    // code (微信/支付宝支付码)
    const [code,setCode]=useState('');
    // 当前 Tab：1=支付二维码（原流程）  2=小程序码
    const [tabKey,setTabKey]=useState<'1'|'2'>('1');
    // 小程序码图片（base64 或 URL）
    const [wxaImg,setWxaImg]=useState('');
    // 小程序码加载中
    const [wxaLoading,setWxaLoading]=useState(false);
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
    // 支付宝二维码支付
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
            RechargeService.adddgchongzhi(
                {newMoney,remarks,payType:"A_NATIVE",numberItems,rechargetype:5,startDate:dayjs().format('YYYY-MM-DD')}
            ).then((res:ErrorCodeType)=>{
                if (res.ErrorCode==0){
                    console.log('相应',res);
                    setCode(res.Data.data.qr_code);
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
        setCode('');
        setWxaImg('');
    };

    /* ======================= 小程序码 / 纯前端链接码 ======================= */

    /**
     * 构造二维码内容：按 WX_QR_MODE 选择不同策略
     */
    const buildQrContent = (): string => {
        const scene = WX_MINI_DEFAULT_SCENE();
        // ========= 推荐：纯前端 + 后台配置普通链接规则 =========
        if (WX_QR_MODE === 'link') {
            // 拼：https://你的域名/路径前缀/?scene=xxx
            // 注意：确保 WX_MINI_QR_DOMAIN + WX_MINI_QR_PATH_PREFIX 和小程序后台配置的二维码规则一致
            const url = new URL(WX_MINI_QR_PATH_PREFIX + '?scene=' + encodeURIComponent(scene), WX_MINI_QR_DOMAIN);
            return url.toString();
        }
        // ========= 后端生成真·小程序码模式（不在前端出码） =========
        if (WX_QR_MODE === 'mini') {
            return ''; // 这个分支由 generateMiniCode 走接口拿图片
        }
        // ========= scheme 兜底（需要后端给 ticket 的参数，纯前端不建议用） =========
        return `weixin://dl/business/?appid=${WX_MINI_APPID}&path=${encodeURIComponent(WX_MINI_PAGE_PATH + '?scene=' + encodeURIComponent(scene))}`;
    };

    /**
     * 生成码：
     *   'link' | 'scheme' → 用前端 Myqrcode（qrcode.react）画普通二维码，立即展示（纯前端，零接口）
     *   'mini'            → 调后端 generateWxaCode（协议号 1880）拿小程序码图片，img 展示
     */
    const generateMiniCode = () => {
        const scene = WX_MINI_DEFAULT_SCENE();
        if (scene.length > 32) {
            message.warning('scene 参数长度超过微信限制 32 字符，请精简');
        }

        if (WX_QR_MODE !== 'mini') {
            // —— 纯前端出码 ——
            const content = buildQrContent();
            if (!content) return;
            setCode(content);
            setIsTihuan(true);
            return;
        }

        // —— 接口出码 ——
        setWxaLoading(true);
        RechargeService.generateWxaCode({
            scene,
            page: WX_MINI_PAGE_PATH,
            width: WX_QR_WIDTH,
        }).then((res: ErrorCodeType) => {
            setWxaLoading(false);
            if (res.ErrorCode === 0) {
                const raw = res.Data;
                let imgSrc = '';
                if (typeof raw === 'string') {
                    imgSrc = raw.startsWith('data:image') || raw.startsWith('http')
                        ? raw
                        : `data:image/png;base64,${raw}`;
                } else if (raw) {
                    const anyRaw = raw as any;
                    const payload = anyRaw.url || anyRaw.img || anyRaw.image || anyRaw.base64 || '';
                    if (anyRaw.url) {
                        imgSrc = anyRaw.url;
                    } else if (payload) {
                        imgSrc = typeof payload === 'string' && payload.startsWith('data:image')
                            ? payload
                            : `data:image/png;base64,${payload}`;
                    }
                }
                if (!imgSrc) {
                    message.error('小程序码返回为空，请检查后端接口');
                    return;
                }
                setWxaImg(imgSrc);
                setIsTihuan(true);
            } else {
                message.error(`${res.ErrorCode} ${res.Data}`);
            }
        }).catch(() => setWxaLoading(false));
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
                    {/* 根据模式切换提示语 & 二维码展示 */}
                    {tabKey === '1' ? (
                        <>
                            <div><span style={{fontSize:'16px',color:'red'}}>请使用支付宝扫码支付↓</span></div>
                            <div className={styles.qrBox}>
                                <Myqrcode value={code}></Myqrcode>
                            </div>
                            <div className={styles.okCss}>扫码成功后，如没有反应请点击下面确定付款按钮</div>
                        </>
                    ) : (
                        <>
                            <div><span style={{fontSize:'16px',color:'green'}}>请用微信扫一扫，直达小程序 ↓</span></div>
                            {WX_QR_MODE === 'mini' ? (
                                // 真·小程序码模式：展示后端返回的图片
                                <div className={styles.qrBox}>
                                    {wxaImg ? (
                                        <img
                                            src={wxaImg}
                                            alt='小程序码'
                                            width={WX_QR_WIDTH}
                                            height={WX_QR_WIDTH}
                                            style={{display:'block',margin:'0 auto',border:'1px solid #eee',padding:8,borderRadius:6}}
                                        />
                                    ) : (
                                        <Spin spinning={wxaLoading}><div style={{width:WX_QR_WIDTH,height:WX_QR_WIDTH,background:'#fafafa',border:'1px dashed #ddd',borderRadius:6}}/></Spin>
                                    )}
                                </div>
                            ) : (
                                // link / scheme：前端画普通二维码
                                <div>
                                    <div className={styles.qrBox}>
                                        <Myqrcode value={code}></Myqrcode>
                                    </div>
                                    <div className={styles.okCss} style={{color:'#666',maxWidth:420}}>
                                        {WX_QR_MODE === 'link' ? (
                                            <>
                                                <b>当前模式：纯前端链接码（推荐，无需后端接口）</b><br/>
                                                · 二维码内容：<code style={{wordBreak:'break-all'}}>{code}</code><br/>
                                                · 扫码能打开小程序的前提：<br/>
                                                &nbsp;&nbsp;① 你已在 <b>小程序后台 → 扫普通链接二维码打开小程序</b> 添加了对应规则<br/>
                                                &nbsp;&nbsp;② 规则匹配 <code>{WX_MINI_QR_DOMAIN}{WX_MINI_QR_PATH_PREFIX}</code><br/>
                                                &nbsp;&nbsp;③ 指向小程序页面 <code>{WX_MINI_PAGE_PATH}</code><br/>
                                                &nbsp;&nbsp;④ 小程序页面 <code>onLoad</code> 已处理 <code>options.scene</code><br/>
                                            </>
                                        ) : (
                                            <>
                                                <b>当前模式：URL Scheme（纯前端占位，需后端生成 ticket 才可用）</b><br/>
                                                · 如果需要稳定可用，把 <code>WX_QR_MODE</code> 改成 <code>'link'</code> 后配置小程序后台，或 <code>'mini'</code> 后接入后端小程序码接口。
                                            </>
                                        )}
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                    <Space style={{marginTop:12}}>
                        <Button type='primary' onClick={cancelOk}>{tabKey === '1' ? '我已付款，并且离开' : '关闭二维码'}</Button>
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
                                <label className={styles.controlLabel}>出码方式</label>
                                <Radio.Group
                                    style={{marginLeft:'20px'}}
                                    value={Number(tabKey)}
                                    onChange={(e)=>setTabKey(e.target.value === 2 ? '2' : '1')}
                                >
                                    <Radio value={1}>支付二维码（支付宝扫码付款）</Radio>
                                    {/* <Radio value={2}>小程序码（微信扫码 → 直达小程序）</Radio> */}
                                </Radio.Group>
                            </div>
                            {tabKey === '2' && (
                                <div className={styles.controlGroup}>
                                    <label className={styles.controlLabel}>小程序配置</label>
                                    <div className={styles.controls} style={{color:'#555',lineHeight:1.9}}>
                                        <div>出码模式：
                                            {WX_QR_MODE === 'link'   && <Tag color="green">纯前端链接码（无需后端接口）</Tag>}
                                            {WX_QR_MODE === 'mini'   && <Tag color="blue">后端小程序码（需协议号1880）</Tag>}
                                            {WX_QR_MODE === 'scheme' && <Tag color="orange">URL Scheme（需后端生成ticket）</Tag>}
                                        </div>
                                        <div>AppID：<code>{WX_MINI_APPID}</code></div>
                                        <div>跳转页面：<code>{WX_MINI_PAGE_PATH}</code></div>
                                        {WX_QR_MODE === 'link' ? (
                                            <div>链接匹配：<code>{WX_MINI_QR_DOMAIN}{WX_MINI_QR_PATH_PREFIX}</code></div>
                                        ) : null}
                                        <div>scene 参数：<code>{WX_MINI_DEFAULT_SCENE()}</code> <span style={{color:'#999'}}>（长度 {WX_MINI_DEFAULT_SCENE().length}/32）</span></div>
                                        <div style={{color:'#888',fontSize:12,marginTop:4}}>
                                            修改请在页面顶部常量区：<code>WX_MINI_APPID / WX_MINI_PAGE_PATH / WX_MINI_QR_DOMAIN / WX_MINI_QR_PATH_PREFIX / WX_QR_MODE</code>
                                        </div>
                                        {WX_QR_MODE === 'link' && (
                                            <div style={{color:'#888',fontSize:12,marginTop:4,lineHeight:1.9}}>
                                                <b>使用前必做（mp.weixin.qq.com 小程序后台）：</b><br/>
                                                ① 开发 → 开发设置 → 扫普通链接二维码打开小程序 → 添加<br/>
                                                ② 协议 https，规则填 <code>{WX_MINI_QR_DOMAIN}{WX_MINI_QR_PATH_PREFIX}</code>，页面填 <code>{WX_MINI_PAGE_PATH}</code><br/>
                                                ③ 下载校验文件放到 <code>{WX_MINI_QR_DOMAIN}/</code> 根目录<br/>
                                                ④ 小程序 <code>{WX_MINI_PAGE_PATH}</code> 的 onLoad 里用 <code>decodeURIComponent(options.scene)</code> 拿参数
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                            <div className={styles.fromActions}>
                                <button type='button' className={styles.btn} onClick={() => tabKey === '1' ? add() : generateMiniCode()}>
                                    {tabKey === '1' ? '立即购买' : '生成小程序码'}
                                </button>
                            </div>
                        </fieldset>
                    </form>
                </>
            }
        </div>

    )
}

export default connect() (Recharge)