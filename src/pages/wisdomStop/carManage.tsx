import {Tabs} from "antd";
import {useState} from "react";
import WxUserCar from "@/pages/wisdomStop/wxUserCar";
import UserCar from "@/pages/wisdomStop/userCar";


const CarManage=()=>{
    const [activeKey, setActiveKey] = useState(sessionStorage.getItem('activeTabCar') || '1');
    const onChange = (key) => {
        setActiveKey(key);
        sessionStorage.setItem('activeTabCar', key);
    };
    return(
        <Tabs activeKey={activeKey} onChange={onChange}>
            <Tabs.TabPane tab='租户车辆' key='1'>
                <WxUserCar/>
            </Tabs.TabPane>
            <Tabs.TabPane tab='系统车辆' key='2'>
                <UserCar/>
            </Tabs.TabPane>
        </Tabs>
    )
}
export default (CarManage)