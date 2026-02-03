import {useState} from "react";
import {Tabs} from "antd";
import OldCheckFinance from "@/pages/check/oldCheckFinance";
import NewCheckFinance from "@/pages/check/newCheckFinance";


const CheckFinance=()=>{
    const [activeKey, setActiveKey] = useState(sessionStorage.getItem('checkFinancialDataActiveKey') || '1');
    const onChange = (key:string) => {
        setActiveKey(key);
        sessionStorage.setItem('checkFinancialDataActiveKey', key);
    };
    return(
         <Tabs activeKey={activeKey} onChange={onChange}>
             <Tabs.TabPane tab="旧数据" key="1">
                 <OldCheckFinance />
             </Tabs.TabPane>
             <Tabs.TabPane tab="新数据" key="2">
                 <NewCheckFinance />
             </Tabs.TabPane>
         </Tabs>
    )
}

export default CheckFinance