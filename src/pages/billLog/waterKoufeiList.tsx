import {useEffect, useState} from "react";
import {Tabs} from "antd";
import WaterPrepaidList from "@/pages/billLog/waterPrepaid";
import WaterPostpaidList from "@/pages/billLog/waterPostpaid";


const WaterKoufeiList=()=>{
    const [activeKey, setActiveKey] = useState(sessionStorage.getItem('waterKoufeiActive') || '1');
    const onChange = (key) => {
        setActiveKey(key);
        sessionStorage.setItem('waterKoufeiActive', key);
    };
    return(
        <Tabs activeKey={activeKey} onChange={onChange}>
            <Tabs.TabPane tab='预付费' key='1'>
                <WaterPrepaidList/>
            </Tabs.TabPane>
            <Tabs.TabPane tab='后付费' key='2'>
                <WaterPostpaidList/>
            </Tabs.TabPane>
        </Tabs>
    )
}
export default WaterKoufeiList