import {connect,history} from "umi";
import {
    Button,
    Form,
    Input,
    InputNumber,
    Select,
    Radio,
    message,
    Spin,
    List,
    Space,
    DatePicker,
    Image,
    Modal
} from "antd";
import {useEffect, useState} from "react";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import * as AppUserService from '@/services/appUser';
import styles from "@/pages/contract/endContran.less";
import {numberToRMB} from "@/utils/OpenTool";
const tailLayout = {
    wrapperCol: { offset: 4 },
};
const AddChongzhi=(props:any)=>{
    // 充值类型
    const [handType,setHandType]=useState(1);
    const [spinning,setspinning]=useState(false);
    // 输入查询的手机号
    const [userPhone,setUserPhone]=useState('');
    // 输入充值的金额
    const [addbalance,setaddbalance]=useState(0);
    // 弹窗输入充值的金额
    const [openBalance,setopenBalance]=useState(0);
    // 用户头像
    const [appUser_image,setappUser_image]=useState('');
    // 用户昵称
    const [appUser_name,setappUser_name]=useState('');
    // 用户手机号
    const [tenant_phone,settenant_phone]=useState('');
    // 公司名称
    const [tenantCompany,settenantCompany]=useState('');
    // 用户余额
    const [balance,setbalance]=useState(0);
    // 用户id
    const [userId,setUserId]=useState(0);
    // 点击充值的弹窗
    const [open,setOpen]=useState(false);
    // 备注
    const [remark,setremark]=useState('');
    const onFinish=()=>{
        setspinning(true);
        if (addbalance!=openBalance){
            message.error('输入不一致');
            setspinning(false);
        }else {
            props.dispatch({
                type:'ManualRecharge/add',
                payload:{addbalance,userId,handType,remark}
            }).then((res:any)=>{
                if (res.ErrorCode==0){
                    message.success('添加成功');
                    setspinning(false);
                    setOpen(false);
                    history.push('/billLog/manualRecharge');
                }else {
                    message.error(res.Data);
                    setspinning(false);
                    setOpen(false);
                }
            })
        }

    };
    const changeHandAmount=(e)=>{
        // console.log();
        setHandType(e.target.value);
    };

    // 搜索输入的手机号
    const sousuo=()=>{
        setspinning(true);
        AppUserService.userInfo(userPhone).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                if (res.Data.userId==0){
                    message.warning('未能查询到该用户');
                    setspinning(false);
                }else {
                    setappUser_image(res.Data.appUser_image);
                    setappUser_name(res.Data.appUser_name);
                    setbalance(res.Data.balance);
                    settenant_phone(res.Data.tenant_phone);
                    setUserId(res.Data.userId);
                    settenantCompany(res.Data.tenantCompany);
                    setspinning(false);
                }

            }else {
                message.error(res.Data);
                setspinning(false);
            }
        })
    };
    const chongzhiOpen=()=>{
        if (addbalance==0){
            message.warning('请输入充值金额');
        }else {
            setOpen(true);
        }
    };
    return(
        <Spin spinning={spinning}>
            <List>
                <List.Item>
                    <Space>
                        <Input
                            addonBefore="手机号码:"
                            onChange={(e)=>setUserPhone(e.target.value)}
                        />
                        <Button type="primary" onClick={sousuo}>
                            搜索
                        </Button>
                        <Space.Compact>
                            <div
                                style={{
                                    // borderRadius: '6px',
                                    borderStartEndRadius: 0,
                                    borderEndEndRadius: 0,
                                    padding: '0 11px',
                                    // border: '1px solid #d9d9d9',
                                    display: 'flex',
                                    alignItems: 'center',
                                    borderInlineEnd: 0,
                                }}
                            >
                                充值类型:
                            </div>
                            <Radio.Group defaultValue={handType} onChange={changeHandAmount}>
                                {/*<Radio value={0}>积分</Radio>*/}
                                <Radio value={1}>余额</Radio>
                            </Radio.Group>
                        </Space.Compact>
                        <InputNumber min={0}
                            addonBefore="充值量(元):"
                            onChange={(e)=>setaddbalance(e)}
                            value={addbalance}
                        />
                    </Space>
                </List.Item>
            </List>
            {
                userId==0?'':<>
                    <form className={styles.gridForm1} >
                        <div className={styles.gridItem}>用户头像</div>
                        <div className={styles.gridItem}>微信昵称</div>
                        <div className={styles.gridItem}>用户手机号</div>
                        <div className={styles.gridItem}>公司名称</div>
                        <div className={styles.gridItem}>余额</div>
                        <div className={styles.gridItem}><Image style={{width:'50px',height:'50px'}} src={appUser_image}/></div>
                        <div className={styles.gridItem}>{appUser_name}</div>
                        <div className={styles.gridItem}>{tenant_phone}</div>
                        <div className={styles.gridItem}>{tenantCompany}</div>
                        <div className={styles.gridItem}>{balance}</div>
                    </form>
                    <div style={{marginTop:'20px',textAlign:'center',width:'1000px'}}>
                        <Space>
                            <Button type='primary' onClick={chongzhiOpen}>充值</Button>
                            <Button type='primary'>取消</Button>
                        </Space>
                    </div>
                </>
            }
            <Modal open={open} onCancel={()=>setOpen(false)} title='请确定' onOk={onFinish} loading={spinning}>
                <Form>
                    <Form.Item label='选择的类型'>
                        <Radio.Group value={handType}>
                            {/*<Radio value={0}>积分</Radio>*/}
                            <Radio value={1}>余额</Radio>
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item label='手机号'>
                        <Input  value={tenant_phone}/>
                    </Form.Item>
                    <Form.Item label='充值量'>
                        <InputNumber min={0}  onChange={(e)=>setopenBalance(e)} value={openBalance}/>
                    </Form.Item>
                    <Form.Item label='备注'>
                        <Input.TextArea value={remark} onChange={(e)=>setremark(e.target.value)}/>
                    </Form.Item>
                    <Form.Item label='大写'>
                        <span style={{color:'red',fontWeight:'600'}}>{numberToRMB(addbalance)}</span>
                    </Form.Item>
                </Form>
            </Modal>
        </Spin>
    )
}

export default  connect()(AddChongzhi)