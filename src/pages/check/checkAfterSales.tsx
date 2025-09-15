import {Tabs} from "antd";
import CheckRename from "@/pages/check/checkRename";
import CheckRenew from "@/pages/check/checkRenew";
import CheckOutRent from "@/pages/check/checkOutRent";
import CheckPreferential from "@/pages/check/checkPreferential";
import CheckByStages from "@/pages/check/checkByStages";
import {useState} from "react";
import CheckDeept from "@/pages/check/checkDeept";


const CheckAfterSales=()=>{
    const [activeKey, setActiveKey] = useState(sessionStorage.getItem('activeTabKey2') || '1');
    const onChange = (key) => {
        setActiveKey(key);
        sessionStorage.setItem('activeTabKey2', key);
    };
    return(
        <div>
            <Tabs activeKey={activeKey} onChange={onChange}>
                <Tabs.TabPane tab='更名审核' key='1'>
                    <CheckRename/>
                </Tabs.TabPane>
                <Tabs.TabPane tab='续租审核' key='3'>
                    <CheckRenew/>
                </Tabs.TabPane>
                <Tabs.TabPane tab='退租审核' key='4'>
                    <CheckOutRent/>
                </Tabs.TabPane>
                <Tabs.TabPane tab='优惠审核' key='5'>
                    <CheckPreferential/>
                </Tabs.TabPane>
                <Tabs.TabPane tab='分期审核' key='6'>
                    <CheckByStages/>
                </Tabs.TabPane>
                <Tabs.TabPane tab='押金审核' key='7'>
                    <CheckDeept/>
                </Tabs.TabPane>
            </Tabs>
        </div>
    )
}
export default CheckAfterSales