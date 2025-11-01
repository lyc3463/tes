import {useState} from "react";
import {Tabs} from "antd";
import ProcurementOrder from "@/pages/warehouse/procurementOrder";
import SalesPayment from "@/pages/warehouse/salesPayment";


const PaymentManagement=()=>{
    const [activeKey, setActiveKey] = useState(sessionStorage.getItem('paymentManagementActiveKey') || '1');
    const onChange = (key) => {
        setActiveKey(key);
        sessionStorage.setItem('paymentManagementActiveKey', key);
    };
    return(
        <Tabs activeKey={activeKey} onChange={onChange}>
            <Tabs.TabPane tab='采购付款' key='1'>
                <ProcurementOrder/>
            </Tabs.TabPane>
            <Tabs.TabPane tab='销售收款' key='2'>
                <SalesPayment/>
            </Tabs.TabPane>
            <Tabs.TabPane tab='退货收款' key='3'>
            </Tabs.TabPane>
            <Tabs.TabPane tab='入库报表' key='4'>
            </Tabs.TabPane>
            <Tabs.TabPane tab='出库报表' key='5'>
            </Tabs.TabPane>
        </Tabs>
    )
}
export default PaymentManagement;
