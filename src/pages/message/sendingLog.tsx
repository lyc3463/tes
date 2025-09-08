import {Tabs} from "antd";
import {connect} from "umi";
import {useState} from "react";
import CaptchaLog from "@/pages/message/captchaLog";
import SmsList from "@/pages/message/SmsList";


const SendingLog=(props:any)=>{
    const [activeKey, setActiveKey] = useState(sessionStorage.getItem('activeTabKey2') || '1');
    const onChange = (key) => {
        setActiveKey(key);
        sessionStorage.setItem('activeTabKey2', key);
    };
    return(
       <>
           <Tabs activeKey={activeKey} onChange={onChange}>
               <Tabs.TabPane tab='验证码发送记录' key='1'>
                   <CaptchaLog/>
               </Tabs.TabPane>
               <Tabs.TabPane tab='短信发送记录' key='2'>
                   <SmsList/>
               </Tabs.TabPane>
           </Tabs>
       </>
    )
}

export default connect() (SendingLog)