import React, { Component, useEffect, useRef, useState } from 'react';
import { history, Link } from 'umi';
import {
  Button,
  Form,
  Input,
  Tabs,
  Space,
  Switch,
  InputNumber,
  Alert,
  Spin,
  message,
  Modal,
} from 'antd';
import { StaticInfo } from '@/StaticInfo';
import { EventMgr } from '@/Event/EventMgr';
import { info_event } from '@/Event/EventEnum';
import styles from './login.less';
import Captcha from 'react-captcha-code';
import moment from 'moment';
import { canvasRefProps } from 'react-captcha-code/build/types/captcha';
import Loading from '@/loading';
import Wlcw from '@/components/wlcw';
import * as CommonService from '@/services/common';
import * as LoginService from '@/services/login';
import CryptoUtils from '@/utils/Crypto';
import { v4 as uuidv4 } from 'uuid';
import { sleep } from '@/utils/common';
import {phonePattern, pwdPattern, replaceEnglishCommasWithChinese} from "@/utils/OpenTool";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";

type Fnc = () => void;
const noop = () => { };

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 3, span: 18 },
};

export default function Login() {
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const [modal, modalContextHolder] = Modal.useModal();
  const [loading, setLoading] = useState(false);
  const [showError, setShowError] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const evtthis = Symbol('Login');
  const [pwdvisible, setPwdvisible] = useState(false);
  const [error, setError] = useState(false);
  const [errorstr, setErrorstr] = useState('');
  const [yzvsi, setYzvsi] = useState(false);
  const [yzm, setYzm] = useState('');
  const [yzmval, setYzmval] = useState('');
  const [maskvsi, setMaskvsi] = useState(false);
  const [yfsyzm, setYfsyzm] = useState(false);
  const [sjh, setSjh] = useState('');
  const [count, setCount] = useState(60);
  const [inited, setInited] = useState(0);
  const [jzpwdcg, setJzpwdcg] = useState(false);
  const [ua, setUa] = useState('');
  const [ksdjs, setKsdjs] = useState(false);
  const [valPhone,setValPhone]=useState('')
  const captchaRef: React.RefObject<canvasRefProps> = useRef(null);
  // 登录倒计时时间
  const [countdown, setCountdown] = useState(0);
  // 控制按钮是否禁用
  const [isDisabled, setIsDisabled] = useState(false);
  // 修改密码获取验证码
  const [editPassword, setEditPassword] = useState(false);
  // 修改密码输入的手机号
  const [editpwdPhone, setEditpwdPhone] = useState('');
  // 找回密码倒计时时间
  const [editCountdown, setEditCountdown] = useState(0);
  // 修改密码填写的验证码
  const [editPwdYzm,setEditPwdYzm]=useState('');
  const tickRef = useRef<Fnc>(noop);
  // 找回密码输入密码弹窗
  const [mmOpen,setmmOpen]=useState(false);
  // 找回密码验证码弹窗
  const [isyzmOpen,setIsyzmOpen]=useState(false);
  useEffect(() => {
    didmount();
    console.log('看看csx是什么',StaticInfo.csx);
    return () => {
      unmount();
    }
  }, []);
  useEffect(() => {
    if (inited == 1) {
      if (localStorage.getItem('pwd')) {
        // values.username,
        // values.password,

        form.setFieldValue(
          'username',
          localStorage.getItem('username'),
        );
        form.setFieldValue(
          'password',
          localStorage.getItem('pwd'),
        );
        form.setFieldValue('jizhu', true);
      }
    }
  }, [inited]);
  const didmount = async () => {
    let zuixin = await fetch('/ver.json')
      .then(res => {
        return res.json();
      })
      .then(resjson => {
        const curversion = resjson.version;
        console.log('最新版本',curversion);
        const jeguo = localStorage.getItem('curversion') == curversion;
        console.log('结果',jeguo);
        if (!jeguo) {
          localStorage.setItem('curversion', curversion);
        }
        return jeguo;
      });
    if (!zuixin) {
      window.location.replace(window.location.href);
      return;
    }
    StaticInfo.userState = false;
    sessionStorage.removeItem('sxxx');

    EventMgr.on(info_event.Error, evtthis, onError);
    EventMgr.on(info_event.showWait, evtthis, shhowWait);
    EventMgr.on(info_event.hideWait, evtthis, hideWait);
    if (!localStorage.getItem('username')) {
      setYzvsi(true);
      captchaRef.current?.refresh();
    }
    let inited = await initinfo();
    if (inited) {
      setInited(1);
    } else {
      setInited(-1);
      modal.error({
        content: '请求超时',
        centered: true,
        okText: '刷新'
      });
    }
  }
  const unmount = () => {
    clearTimeout(showWaitTimeout);
    EventMgr.off(info_event.Error, evtthis, onError);
    EventMgr.off(info_event.showWait, evtthis, shhowWait);
    EventMgr.off(info_event.hideWait, evtthis, hideWait);
  }
  const mimacg = (val: any) => {
    if (localStorage.getItem('pwd') && !jzpwdcg) {
      form.setFieldValue('password', '');
      // form.setFieldValue('jizhu', false);
      setJzpwdcg(true)
    }
  }
  const initinfo = async () => {
    let lczw = localStorage.getItem('fp');
    if (lczw) {
      StaticInfo.deviceId = lczw;
    } else {
      StaticInfo.deviceId = uuidv4();
      localStorage.setItem('fp', StaticInfo.deviceId);
    }
    let res: any = await CommonService.get1001();
    let bd = moment().valueOf();
    if (res.ErrorCode == 0) {
      StaticInfo.csx = res.Data - bd;
      return Promise.resolve().then(function () {
        return true;
      });
    } else {
      return Promise.resolve().then(function () {
        return false;
      });
    }
  }
  const onError = async (_str: string) => {
    setError(true);
    setErrorstr(_str);
    await sleep(3000);
    setError(false);
    setErrorstr('');
  }
  const login = (values: any) => {
    if (values.username === '') {
      EventMgr.event(info_event.Error, '请填写账号');
      return;
    }
    if (values.password === '') {
      EventMgr.event(info_event.Error, '请填写密码');
      return;
    }
    if (yzm === '') {
      message.error('请填写验证码')
      return;
    }
    EventMgr.event(info_event.showWait);
    let mm =CryptoUtils.md5(values.password);
    LoginService.login(
        values.username,
        mm,
        'shebie',
        1,
        yzm,
        1
    ).then((res: TypeErrorCode) => {
      if (res.ErrorCode == 0) {
        console.log('登录信息',res.Data);
        let data = res.Data;
        StaticInfo.userId = data.id;
        StaticInfo.userState = true;
        StaticInfo.token = data.token;
        StaticInfo.park_id = data.park_id;
        StaticInfo.username= data.uname;
        StaticInfo.uqx= data.authority;
        StaticInfo.park_name= data.park_name;
        StaticInfo.beginTime= data.beginTime;
        StaticInfo.endTime= data.endTime;
        StaticInfo.meal_id= data.meal_id;
        StaticInfo.isTask= data.isTask;
        StaticInfo.parkList= data.parkList;
        sessionStorage.setItem('userId',data.id);
        sessionStorage.setItem('userState','true');
        sessionStorage.setItem('token',data.token);
        sessionStorage.setItem('park_id',data.park_id);
        sessionStorage.setItem('username',data.uname);
        sessionStorage.setItem('uqx',data.authority);
        sessionStorage.setItem('park_name',data.park_name);
        sessionStorage.setItem('loginbeginTime',data.beginTime);
        sessionStorage.setItem('loginendTime',data.endTime);
        sessionStorage.setItem('loginmeal_id',data.meal_id);
        sessionStorage.setItem('isTask',data.isTask);
        sessionStorage.setItem('parkList',JSON.stringify(data.parkList));
        history.push('/');
      } else {
        message.error(res.ErrorCode + res.Data)
        if (res.ErrorCode == -1013) {
          sleep(3000).then(res => {
            window.location.replace(window.location.href);
          });
        } else {
          captchaRef.current?.refresh();
        }
      }
    });
  }
  let showWaitTimeout = setTimeout(() => { }, 1000);
  const shhowWait = () => {
    setMaskvsi(true);
    showWaitTimeout = setTimeout(showWaitChaoshi, 30000);
  }
  const showWaitChaoshi = async () => {
    clearTimeout(showWaitTimeout);
    setMaskvsi(false);
    modal.error({
      content: '请求超时',
      centered: true,
      okText: '刷新'
    });
    window.location.replace(window.location.href);
  }
  const hideWait = () => {
    clearTimeout(showWaitTimeout);
    setMaskvsi(false);
  }
  const setpwdVisible = (vsi: boolean) => {
    setPwdvisible(vsi);
  }
  // const yzmcg = (code: any) => {
  //   setYzm(code);
  // }
  // const yzminputcg = (e: any) => {
  //   setYzmval(e.target.value);
  // }

  const handleErrorClose = () => {
    setShowError(false);
  }

  const zhuce = () => {
    history.push('/editPassword/')
  }
  // const getyzm=async ()=>{
  //
  //   console.log(res)
  // }
  const getyzm = async () => {
    // if (phonePattern.test(valPhone)) return true
    // let name=replaceEnglishCommasWithChinese(values.username);
    // console.log("name",name);
    let type=1;
    let shebei='设备'
    let res=await LoginService.loginYzm(valPhone,type,shebei,1);
    if (res.ErrorCode==0){
      message.success('验证码已发送，请留意');
    }else {
      message.error(res.Data);
      return false
    }
    // 假设这里有一个发送验证码的请求
    // 这里我们仅模拟倒计时
    setIsDisabled(true); // 禁用按钮
    setCountdown(60); // 设置倒计时为60秒

    // 使用setTimeout来模拟倒计时
    const interval = setInterval(() => {
      setCountdown((prevCountdown) => {
        if (prevCountdown <= 1) {
          clearInterval(interval); // 清除定时器
          setIsDisabled(false); // 倒计时结束，启用按钮
          return 0; // 重置倒计时
        }
        return prevCountdown - 1; // 倒计时减一
      });
    }, 1000); // 每秒更新一次倒计时
  };
  const getEditPwdYzm = async () => {
    if (!phonePattern.test(editpwdPhone)) {
      message.error('请输入有效的手机号');
      return false
    }
    let type=1;
    let shebei='设备'
    let res:any=await LoginService.loginYzm(editpwdPhone,type,shebei,1);
    if (res.ErrorCode==0){
      message.success('验证码已发送，请留意');
    }else {
      message.error(res.Data);
      return false
    }
    setEditPassword(true); // 禁用按钮
    setEditCountdown(60); // 设置倒计时为60秒

    const interval = setInterval(() => {
      setEditCountdown((prevCountdown) => {
        if (prevCountdown <= 1) {
          clearInterval(interval); // 清除定时器
          setEditPassword(false); // 倒计时结束，启用按钮
          return 0; // 重置倒计时
        }
        return prevCountdown - 1; // 倒计时减一
      });
    }, 1000); // 每秒更新一次倒计时
  };
  //   忘记密码输入手机验证
  const onEditPasswordPhoneValue = (values: any) => {
    if (!editPwdYzm){
      message.error('请输入验证码');
      return false
    }
    LoginService.duanxinyanzhen(values.phone,editPwdYzm).then((res:any)=>{
      if (res.ErrorCode==0){
        message.success('验证码通过');
        setIsyzmOpen(false);
        setmmOpen(true);
      }else {
        message.error(res.Data)
      }
    })
  };
  // 确定修改密码
  const onOKmm=(values:any)=>{
    let md5Pwd= CryptoUtils.md5(values.password);
    LoginService.editPwd(editpwdPhone,md5Pwd).then((res:any)=>{
      if (res.ErrorCode==0){
        message.success('修改成功');
        setmmOpen(false);
      }else {
        message.error(res.Data)
      }
    })
  };
  // 验证两次输入的密码是否一致
  const compareToFirstPassword = (_, value) => {
    if (!value || !editForm.getFieldValue('password')) {
      return Promise.resolve();
    }
    if (value !== editForm.getFieldValue('password')) {
      return Promise.reject(new Error('两次输入的密码不一致!'));
    }
    return Promise.resolve();
  };
  return (
    <>
      <div className={styles.loginCs}>
        <div className={styles.bgBox}>
          {/*左侧图片*/}
          <div className={styles.imgBox}>
            <img/>
          </div>
          {/*右侧图片*/}
          <div className={styles.rightBox}>
            <p style={{fontSize:'30px',color:"#000",fontWeight:'600',textAlign:'center'}}>公司端系统</p>
            <Form
                name="loginForm"
                form={form}
                onFinish={login}
            >
              <Form.Item  name="username"  rules={[{required: true, message: '请输入账户' },{pattern: phonePattern, message: '请输入有效的手机号'}]}>
                <Input placeholder='请输入用户账户' onChange={(e)=>{setValPhone(e.target.value)}}/>
              </Form.Item>
              <Form.Item name="password" rules={[{ required: true, message: '请输入密码'}]}>
                <Input.Password placeholder='请输入密码'/>
              </Form.Item>
              <Form.Item>
                <Input placeholder='验证码' style={{width:'10vw',marginRight:'5px'}} onChange={(e)=>setYzm(e.target.value)}/>
                <a
                    href="#"
                    className={styles.yzmBtn}
                    onClick={isDisabled ? undefined : getyzm}
                    style={{ pointerEvents: isDisabled ? 'none' : 'auto', cursor: isDisabled ? 'not-allowed' : 'pointer' }}
                >
                {countdown > 0 ? `${countdown}秒后重新获取` : '获取验证码'}
                </a>
              </Form.Item>
              <Form.Item>
                <div  className={styles.loginBox}>
                  <Button  type='primary' htmlType="submit"  className={styles.btn}>登录</Button>
                  <a type='primary' className={styles.yzmBtn} onClick={()=>setIsyzmOpen(true)}>忘记密码</a>
                  <p style={{fontSize:'12px',color:'#999'}}>版本:3.1.2</p>
                </div>
              </Form.Item>
            </Form>
            {/*<Input placeholder='输入验证码' style={{margin:'20px 0',width:'10vw'}}/>*/}
          </div>
        </div>
      </div>
      <div style={{textAlign:'center'}}>
        <a href='#' style={{textDecoration:'none',color:'#555',marginRight:"30px"}}>本系统由广州慧弘易码事网络科技有限公司提供技术支持</a><a target='_blank' style={{textDecoration:'none',color:'#555'}} href='https://beian.miit.gov.cn/#/Integrated/index'>粤ICP备2024319327号-3</a>
      </div>
      {/*忘记密码输入手机验证弹窗*/}
      <Modal open={isyzmOpen} onCancel={()=>setIsyzmOpen(false)} title='找回密码' footer={false}>
        <Form
            name='editPwd'
            onFinish={onEditPasswordPhoneValue}
        >
          <Form.Item label='手机号' name='phone' rules={[{required: true, message: '请输入手机号' },{pattern: phonePattern, message: '请输入有效的手机号'}]} onChange={(e)=>{setEditpwdPhone(e.target.value)}}>
            <Input/>
          </Form.Item>
          <Form.Item label='验证码'>
            <Input placeholder='验证码' style={{width:'10vw',marginRight:'5px'}} onChange={(e)=>setEditPwdYzm(e.target.value)}/>
            <a
                href="#"
                className={styles.yzmBtn}
                onClick={editPassword ? undefined : getEditPwdYzm}
                style={{ pointerEvents: editPassword ? 'none' : 'auto', cursor: editPassword ? 'not-allowed' : 'pointer' }}
            >
              {editCountdown > 0 ? `${editCountdown}秒后重新获取` : '获取验证码'}
            </a>
          </Form.Item>
          <Form.Item>
            <Button  type='primary' htmlType="submit">下一步</Button>
          </Form.Item>
        </Form>
      </Modal>
      {/*输入密码弹窗*/}
      <Modal open={mmOpen} onCancel={()=>setmmOpen(false)} title='找回密码' footer={false}>
        <Form
            form={editForm}
            onFinish={onOKmm}
        >
          <Form.Item label='输入密码' name='password' rules={[{required: true, message: '请输入密码' },{pattern: pwdPattern, message: '密码必须包含大小写加特殊符号，总长度6位以上'}]}>
            <Input.Password/>
          </Form.Item>
          <Form.Item
              label='确认密码'
              name="confirmPassword"
              rules={[
                  {required: true, message: '请确认密码'},
                  {validator: compareToFirstPassword },
              ]}
          >
            <Input.Password/>
          </Form.Item>
          <Form.Item>
            <Button  type='primary' htmlType="submit">确定修改</Button>
          </Form.Item>
        </Form>
      </Modal>
      {/*<Spin spinning={loading} fullscreen />*/}
      {/*<div className={styles.loginbg}>*/}
      {/*  <div className={styles.panel}>*/}
      {/*    <h2 className={styles.title}>物业管理后台</h2>*/}
      {/*    <Form*/}
      {/*        {...layout}*/}
      {/*        name="loginForm"*/}
      {/*        form={form}*/}
      {/*        onFinish={login}*/}
      {/*    >*/}
      {/*      <Form.Item*/}
      {/*          label="账号"*/}
      {/*          name="username"*/}
      {/*          labelCol={{ span: 6 }}*/}
      {/*          wrapperCol={{ span: 18 }}*/}
      {/*          rules={[*/}
      {/*            { required: true, message: 'Please input your username!' },*/}
      {/*          ]}*/}
      {/*      >*/}
      {/*        <Input style={{ width: '100%' }} />*/}
      {/*      </Form.Item>*/}
      {/*      <Form.Item*/}
      {/*          label="密码"*/}
      {/*          name="password"*/}
      {/*          labelCol={{ span: 6 }}*/}
      {/*          wrapperCol={{ span: 18 }}*/}
      {/*          rules={[*/}
      {/*            { required: true, message: 'Please input your password!' },*/}
      {/*          ]}*/}
      {/*      >*/}
      {/*        <Input.Password />*/}
      {/*      </Form.Item>*/}
      {/*      <Form.Item*/}
      {/*          label='验证码'*/}
      {/*          name="yzm"*/}
      {/*          labelCol={{ span: 6 }}*/}
      {/*          wrapperCol={{ span: 18 }}*/}
      {/*          rules={[*/}
      {/*            { required: true, message: 'Please input your password!' },*/}
      {/*          ]}*/}
      {/*      >*/}
      {/*        <Input.Password/>*/}
      {/*      </Form.Item>*/}
      {/*      {yzvsi ? (*/}
      {/*          <Form.Item*/}
      {/*              label="验证码"*/}
      {/*              name='cacode'*/}
      {/*              labelCol={{ span: 6 }}*/}
      {/*              wrapperCol={{ span: 18 }}*/}
      {/*              rules={[*/}
      {/*                { required: yzvsi, message: 'Please input captcha code!' },*/}
      {/*              ]}*/}
      {/*          >*/}
      {/*            <div style={{ display: 'flex' }}>*/}
      {/*              <Input*/}
      {/*                  value={yzmval}*/}
      {/*                  onChange={yzminputcg}*/}
      {/*                  style={{ marginRight: '8px' }}*/}
      {/*              />*/}
      {/*              <Captcha*/}
      {/*                  ref={captchaRef}*/}
      {/*                  height={32}*/}
      {/*                  charNum={4}*/}
      {/*                  onChange={yzmcg}*/}
      {/*              />*/}
      {/*            </div>*/}
      {/*          </Form.Item>*/}
      {/*      ) : (*/}
      {/*          ''*/}
      {/*      )}*/}
      {/*      <Form.Item {...tailLayout}>*/}
      {/*        <Button type="primary" htmlType="submit" block>*/}
      {/*          登录*/}
      {/*        </Button>*/}
      {/*      </Form.Item>*/}
      {/*    </Form>*/}
      {/*    <div style={{ padding: '0px 36px' }}>*/}
      {/*      <Button block onClick={zhuce}>*/}
      {/*        注册*/}
      {/*      </Button>*/}
      {/*    </div>*/}

      {/*    <div*/}
      {/*        style={{*/}
      {/*          textAlign: 'center',*/}
      {/*          bottom: '1rem',*/}
      {/*          position: 'absolute',*/}
      {/*          width: 'calc(100% - 2rem)',*/}
      {/*          fontSize: '12px',*/}
      {/*          color: '#666666'*/}
      {/*        }}*/}
      {/*    >*/}
      {/*      /!* CloudPay ©{new Date().getFullYear()} *!/*/}
      {/*    </div>*/}
      {/*  </div>*/}
      {/*</div>*/}
      {/*{showError ? (*/}
      {/*    <div*/}
      {/*        style={{*/}
      {/*          width: '50%',*/}
      {/*          marginLeft: 'auto',*/}
      {/*          marginRight: 'auto',*/}
      {/*          paddingTop: '1rem',*/}
      {/*        }}*/}
      {/*    >*/}
      {/*      <Alert*/}
      {/*          message="登录失败"*/}
      {/*          description="请检查用户名和密码是否正确！"*/}
      {/*          type="error"*/}
      {/*          showIcon*/}
      {/*          closable*/}
      {/*          afterClose={handleErrorClose}*/}
      {/*      />*/}
      {/*    </div>*/}
      {/*) : null}*/}
    </>
  );
}

