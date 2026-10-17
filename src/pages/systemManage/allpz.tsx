import {Tabs} from "antd";
import {useState} from "react";
import RechargeSetUp from "@/pages/systemManage/rechargeSetUp";
import ConfigurationWxId from "@/pages/systemManage/configurationWxId";

const Allpz=()=>{
    const [activeKey, setActiveKey] = useState(sessionStorage.getItem('chongzhiacz') || '1');
    const onChange = (key) => {
        setActiveKey(key);
        sessionStorage.setItem('chongzhiacz', key);
    };
    return(
        <div>
            <Tabs  activeKey={activeKey} onChange={onChange}>
                {/* <Tabs.TabPane tab='手动充值配置' key='1'>
                    <RechargeSetUp/>
                </Tabs.TabPane> */}
                <Tabs.TabPane tab='配置企业ID' key='2'>
                    <ConfigurationWxId/>
                </Tabs.TabPane>
            </Tabs>
        </div>
    )
}
export default Allpz