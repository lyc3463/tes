import Region from "@/pages/appletManage/region";
import Renovation from "@/pages/appletManage/renovation";
import Characteristic from "@/pages/appletManage/characteristic";
import {Tabs} from "antd";
import {useState} from "react";
const PropertyDescription = () => {
    const [activeKey, setActiveKey] = useState(sessionStorage.getItem('activeTabKey3') || '1');
    const onChange = (key) => {
        setActiveKey(key);
        sessionStorage.setItem('activeTabKey3', key);
    };
    return(
        <div>
            <Tabs  activeKey={activeKey} onChange={onChange}>
                <Tabs.TabPane tab="区域管理" key="1">
                    <Region/>
                </Tabs.TabPane>
                <Tabs.TabPane tab="装修" key="2">
                    <Renovation/>
                </Tabs.TabPane>
                <Tabs.TabPane tab="特色" key="3">
                    <Characteristic/>
                </Tabs.TabPane>
            </Tabs>
        </div>
    )
}
export default PropertyDescription