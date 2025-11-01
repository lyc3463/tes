import {Tabs} from "antd";
import {useState} from "react";

const ThingTurnoverRate=()=>{
    const [activeKey, setActiveKey] = useState(sessionStorage.getItem('thingTurnoverRateActiveKey') || '1');
    const onChange = (key) => {
        setActiveKey(key);
        sessionStorage.setItem('thingTurnoverRateActiveKey', key);
    };
    return(
        <Tabs activeKey={activeKey} onChange={onChange}>
            <Tabs.TabPane tab='周转情况' key='1'>
            </Tabs.TabPane>
            <Tabs.TabPane tab='销售排名' key='2'>
            </Tabs.TabPane>
        </Tabs>
    )
}
export default ThingTurnoverRate