import {Tabs} from "antd";
import ZuList from "@/pages/billLog/zuList";
import {useState} from "react";
import ReportLogList from "@/pages/propertyServerManage/reportLog";
import GoodsList from "@/pages/workOrderManage/GoodsList";
import RenovationList from "@/pages/propertyServerManage/renovationList";

const ReportAndRenovation=()=>{
    const [activeKey, setActiveKey] = useState(sessionStorage.getItem('ReportAndRenovationActive') || '1');
    const onChange = (key) => {
        setActiveKey(key);
        sessionStorage.setItem('ReportAndRenovationActive', key);
    };
    return(
        <div>
            <Tabs activeKey={activeKey} onChange={onChange}>
                <Tabs.TabPane tab='报修记录' key='1'>
                    <ReportLogList/>
                </Tabs.TabPane>
                <Tabs.TabPane tab='物品列表' key='2'>
                    <GoodsList/>
                </Tabs.TabPane>
                {/*<Tabs.TabPane tab='装修列表' key='3'>*/}
                {/*    <RenovationList/>*/}
                {/*</Tabs.TabPane>*/}
            </Tabs>
        </div>
    )
}
export default ReportAndRenovation