import {

    Tabs,

} from "antd";
import {useEffect, useState} from "react";
import WxOrder from "@/pages/financeSum/wxOrder";
import BackOrder from "@/pages/financeSum/backOrder";

const PaymentLog=()=>{

    const [activeKey, setActiveKey] = useState(sessionStorage.getItem('payActive') || '1');
    const onChange = (key) => {
        setActiveKey(key);
        sessionStorage.setItem('payActive', key);
    };
    return(
        <Tabs activeKey={activeKey} onChange={onChange}>
            <Tabs.TabPane tab='微信订单' key='1'>
                <WxOrder/>
            </Tabs.TabPane>
            <Tabs.TabPane tab='银行转账订单' key='2'>
                <BackOrder/>
            </Tabs.TabPane>
        </Tabs>

    )
}
export default PaymentLog