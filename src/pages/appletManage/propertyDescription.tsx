import Region from "@/pages/appletManage/region";
import Renovation from "@/pages/appletManage/renovation";
import Characteristic from "@/pages/appletManage/characteristic";
import {Button, Tabs} from "antd";
import {useEffect, useState} from "react";
import {StaticInfo} from "@/StaticInfo";
const PropertyDescription = () => {
    const [activeKey, setActiveKey] = useState(sessionStorage.getItem('activeTabKey3') || '1');
    // 用户权限
    const [uqx,setUqx]=useState([]);
    const onChange = (key) => {
        setActiveKey(key);
        sessionStorage.setItem('activeTabKey3', key);
    };
    useEffect(() => {
        let uq=StaticInfo.uqx.split('');
        setUqx(uq);
    }, []);
    return(
        <div>
            <Tabs  activeKey={activeKey} onChange={onChange}>
                {uqx[210]=='1'?<Tabs.TabPane tab="区域管理" key="1">
                    <Region/>
                </Tabs.TabPane>:''}
                {uqx[211]=='1'?<Tabs.TabPane tab="装修" key="2">
                    <Renovation/>
                </Tabs.TabPane>:''}
                {uqx[212]=='1'?<Tabs.TabPane tab="特色" key="3">
                    <Characteristic/>
                </Tabs.TabPane>:''}


            </Tabs>
        </div>
    )
}
export default PropertyDescription