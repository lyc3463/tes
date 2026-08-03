import {connect,history,useNavigate} from "umi";
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
import {
    checkSessionStorage,
    checkSessionStoragevalue,
    deleteSessionStorageRoutevalue,
    numberToRMB,
    updateSessionStorageValue
} from "@/utils/OpenTool";

const AddChongzhi=(props:any)=>{
    const navigate=useNavigate();
    // 充值类型
    const [handType,setHandType]=useState(1);
    const [spinning,setspinning]=useState(false);
    const [isxianshi,setisxianshi]=useState(false);
    // 输入查询的手机号
    const [userPhone,setUserPhone]=useState(checkSessionStoragevalue('/billLog/addChongzhi','phone')||'');
    // 输入充值的金额
    const [addbalance,setaddbalance]=useState(checkSessionStoragevalue('/billLog/addChongzhi','balance')||0);
    // 弹窗输入充值的金额
    const [openBalance,setopenBalance]=useState(0);
    // 点击充值的弹窗
    const [open,setOpen]=useState(false);
    // 备注
    const [remark,setremark]=useState('');
    // 用户列表数组
    const [userForm,setUserForm]=useState<any[]>([]);
    // 当前选中要充值的用户ID
    const [currentSelectUserId, setCurrentSelectUserId] = useState<number>(0);
    // 当前选中用户信息（弹窗展示）
    const [currentUserInfo, setCurrentUserInfo] = useState<any>(null);

    // 确认充值提交
    const onFinish=()=>{
        setspinning(true);
        if (addbalance != openBalance){
            message.error('输入充值金额与弹窗金额不一致');
            setspinning(false);
            return;
        }
        props.dispatch({
            type:'ManualRecharge/add',
            payload:{
                addbalance,
                userId: currentSelectUserId,
                handType,
                remark
            }
        }).then((res:any)=>{
            if (res.ErrorCode === 0){
                message.success('充值添加成功');
                setspinning(false);
                setOpen(false);
                setremark(''); // 清空备注
                deleteSessionStorageRoutevalue('/billLog/addChongzhi');
                history.push('/billLog/manualRecharge');
            }else {
                message.error(res.Data);
                setspinning(false);
                setOpen(false);
            }
        })
    };

    const changeHandAmount=(e)=>{
        setHandType(e.target.value);
    };

    // 搜索用户
    const sousuo=()=>{
        setspinning(true);
        if (!userPhone){
            setspinning(false);
            setisxianshi(false);
            setUserForm([]);
            return ;
        }
        AppUserService.userInfo(userPhone).then((res:TypeErrorCode)=>{
            if (res.ErrorCode === 0){
                console.log('res',res)
                if (!Array.isArray(res.Data) || res.Data.length === 0) {
                    message.warning('未能查询到该用户');
                    setspinning(false);
                    setisxianshi(false);
                    setUserForm([]);
                }else {
                    setUserForm(res.Data)
                    setspinning(false);
                    setisxianshi(true);
                }
            }else {
                message.error(res.Data);
                setspinning(false);
                setisxianshi(false);
                setUserForm([]);
            }
        })
    };

    // 单条用户充值按钮点击事件，传入当前行完整数据
    const chongzhiOpen = (item: any) => {
        if (addbalance === 0){
            message.warning('请先填写充值金额');
            return;
        }
        // 缓存当前操作用户
        setCurrentSelectUserId(item.userId);
        setCurrentUserInfo(item);
        setOpen(true);
    };

    const changePhone=(e)=>{
        setUserPhone(e.target.value);
        updateSessionStorageValue('/billLog/addChongzhi','phone',e.target.value);
    };
    const changeBalance=(e)=>{
        setaddbalance(e);
        updateSessionStorageValue('/billLog/addChongzhi','balance',e);
    };

    useEffect(() => {
        sousuo();
    }, []);

    const isEmptyData = !Array.isArray(userForm) || userForm.length === 0;

    return(
        <Spin spinning={spinning}>
            <List>
                <List.Item>
                    <Space>
                        <Input
                            addonBefore="手机号码:"
                            onChange={changePhone}
                            value={userPhone}
                        />
                        <Button type="primary" onClick={sousuo}>搜索</Button>
                        <Space.Compact>
                            <div style={{padding: '0 11px',display: 'flex',alignItems: 'center',borderInlineEnd: 0}}>
                                充值类型:
                            </div>
                            <Radio.Group defaultValue={handType} onChange={changeHandAmount}>
                                <Radio value={1}>余额</Radio>
                            </Radio.Group>
                        </Space.Compact>
                        <InputNumber
                            min={0}
                            addonBefore="充值量(元):"
                            onChange={changeBalance}
                            value={addbalance}
                        />
                        <Button type='primary' onClick={()=>navigate(-1)}>返回</Button>
                    </Space>
                </List.Item>
            </List>
            {
                !isxianshi ? null : (
                    <>
                        <form className={styles.gridForm1} >
                            <div className={styles.gridItem}>用户头像</div>
                            <div className={styles.gridItem}>用户姓名</div>
                            <div className={styles.gridItem}>用户手机号</div>
                            <div className={styles.gridItem}>租户姓名</div>
                            <div className={styles.gridItem}>余额</div>
                            <div className={styles.gridItem}>操作</div>
                        </form>
                        {
                            isEmptyData ? (
                                <div style={{padding:'20px',textAlign:'center'}}>暂无匹配用户数据</div>
                            ) : (
                                userForm.map((item) => {
                                    const {
                                        userId,
                                        userImage,
                                        userName,
                                        tenant_phone,
                                        tenant_name,
                                        balance
                                    } = item;
                                    return (
                                        <form key={userId} className={styles.gridForm1}>
                                            <div className={styles.gridItem}>
                                                {userImage ? (
                                                    <Image
                                                        style={{width:'50px',height:'50px'}}
                                                        src={`${window.ServerConfig.imgServer}${userImage}.png`}
                                                        fallback="/avatar-default.png"
                                                    />
                                                ) : (
                                                    <div style={{width:50,height:50,background:'#eee',textAlign:'center',lineHeight:'50px'}}>无头像</div>
                                                )}
                                            </div>
                                            <div className={styles.gridItem}>{userName ?? '-'}</div>
                                            <div className={styles.gridItem}>{tenant_phone ?? '-'}</div>
                                            <div className={styles.gridItem}>{tenant_name ?? '-'}</div>
                                            <div className={styles.gridItem}>{balance}</div>
                                            <div className={styles.gridItem}>
                                                <Button type="primary" size="small" onClick={()=>chongzhiOpen(item)}>充值</Button>
                                            </div>
                                        </form>
                                    )
                                })
                            )
                        }
                    </>
                )
            }

            {/* 充值弹窗 */}
            <Modal
                open={open}
                onCancel={()=>{
                    setOpen(false);
                    setremark(''); // 关闭弹窗清空备注
                }}
                title='确认充值'
                onOk={onFinish}
                loading={spinning}
            >
                <Form>
                    <Form.Item label='选择的类型'>
                        <Radio.Group value={handType}>
                            <Radio value={1}>余额</Radio>
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item label='手机号'>
                        {/* 展示当前点击充值行的手机号 */}
                        <Input value={currentUserInfo?.tenant_phone ?? ''} disabled />
                    </Form.Item>
                    <Form.Item label='充值量'>
                        <InputNumber
                            min={0}
                            onChange={(e)=>setopenBalance(e)}
                            value={openBalance}
                            style={{width:'100%'}}
                        />
                    </Form.Item>
                    <Form.Item label='备注'>
                        <Input.TextArea
                            value={remark}
                            onChange={(e)=>setremark(e.target.value)}
                            rows={3}
                        />
                    </Form.Item>
                    <Form.Item label='大写金额'>
                        <span style={{color:'red',fontWeight:'600'}}>{numberToRMB(addbalance)}</span>
                    </Form.Item>
                </Form>
            </Modal>
        </Spin>
    )
}

export default  connect()(AddChongzhi)