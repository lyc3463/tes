import {Tabs} from "antd";
import OldFinancialData from "@/pages/enter/oldFinancialData";
import NewFinancialData from "@/pages/enter/newFinancialData";
import {useState} from "react";

const FinancialData=(props:any)=>{
    const [activeKey, setActiveKey] = useState(sessionStorage.getItem('financialDataActiveKey') || '1');
    const onChange = (key) => {
        setActiveKey(key);
        sessionStorage.setItem('financialDataActiveKey', key);
    };
    return(
        <Tabs activeKey={activeKey} onChange={onChange}>
            <Tabs.TabPane tab="报销单" key="1">
                <OldFinancialData />
            </Tabs.TabPane>
            <Tabs.TabPane tab="财务单" key="2">
                <NewFinancialData />
            </Tabs.TabPane>
        </Tabs>
    )
}
export default FinancialData