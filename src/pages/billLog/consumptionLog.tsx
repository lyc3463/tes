import {Tabs} from "antd";
import {useState} from "react";
import HourConsumptionLog from "@/pages/billLog/hourConsumptionLog";
import DayConsumptionLog from "@/pages/billLog/dayConsumptionLog";
import OldConsumptionLog from "@/pages/billLog/oldConsumptionLog";

const ConsumptionLog=(props)=>{
    const [activeKey, setActiveKey] = useState(sessionStorage.getItem('consumptionLogActive') || '1');
    const onChange = (key) => {
        setActiveKey(key);
        sessionStorage.setItem('consumptionLogActive', key);
    };
    return(
        <div>
            <Tabs activeKey={activeKey} onChange={onChange}>
                <Tabs.TabPane tab='近两个月扣费' key='1'>
                    <HourConsumptionLog/>
                </Tabs.TabPane>
                <Tabs.TabPane tab='历史记录' key='3'>
                    <OldConsumptionLog/>
                </Tabs.TabPane>
                <Tabs.TabPane tab='天扣费' key='2'>
                    <DayConsumptionLog/>
                </Tabs.TabPane>
            </Tabs>
        </div>
    )
}

export default ConsumptionLog