import {Tabs} from "antd";
import {useState} from "react";
import TurnoverRate from "@/pages/warehouse/turnoverRate";
import SalesRanking from "@/pages/warehouse/salesRanking";

const ThingTurnoverRate=()=>{
    const [activeKey, setActiveKey] = useState(sessionStorage.getItem('thingTurnoverRateActiveKey') || '1');
    const onChange = (key) => {
        setActiveKey(key);
        sessionStorage.setItem('thingTurnoverRateActiveKey', key);
    };
    return(
        <Tabs activeKey={activeKey} onChange={onChange}>
            <Tabs.TabPane tab='周转情况' key='1'>
                <TurnoverRate/>
            </Tabs.TabPane>
            <Tabs.TabPane tab='销售排名' key='2'>
                <SalesRanking/>
            </Tabs.TabPane>
        </Tabs>
    )
}
export default ThingTurnoverRate