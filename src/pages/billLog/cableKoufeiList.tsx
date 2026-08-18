import {useEffect, useState} from "react";
import {Tabs} from "antd";
import ElePrepaidList from "@/pages/billLog/elePrepaid";
import ElePostpaidList from "@/pages/billLog/elePostpaid";


const CableKoufeiList=()=>{
    const [activeKey, setActiveKey] = useState(sessionStorage.getItem('cableKoufeiActive') || '1');
    const onChange = (key) => {
        setActiveKey(key);
        sessionStorage.setItem('cableKoufeiActive', key);
    };
    return(
        <Tabs activeKey={activeKey} onChange={onChange}>
            <Tabs.TabPane tab="预付费" key="1">
                <ElePrepaidList />
            </Tabs.TabPane>
            <Tabs.TabPane tab="后付费" key="2">
                <ElePostpaidList />
            </Tabs.TabPane>
        </Tabs>
    )
}
export default CableKoufeiList