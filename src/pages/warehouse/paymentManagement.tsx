import {useState} from "react";
import {Tabs} from "antd";
import ProcurementOrder from "@/pages/warehouse/procurementOrder";
import SalesPayment from "@/pages/warehouse/salesPayment";
import ReturnFee from "@/pages/warehouse/returnFee";
import PaymentDetails from "@/pages/warehouse/paymentDetails";
import InventoryReport from "@/pages/warehouse/inventoryReport";
import OutboundReport from "@/pages/warehouse/outboundReport";
import {userQx} from "@/utils/OpenTool";


const PaymentManagement=()=>{
    const [activeKey, setActiveKey] = useState(sessionStorage.getItem('paymentManagementActiveKey') || '1');
    const onChange = (key) => {
        setActiveKey(key);
        sessionStorage.setItem('paymentManagementActiveKey', key);
    };
    return(
        <Tabs activeKey={activeKey} onChange={onChange}>
            {userQx()[540]=='1'?<Tabs.TabPane tab='采购付款' key='1'>
                <ProcurementOrder/>
            </Tabs.TabPane>:''}
            {userQx()[542]=='1'?<Tabs.TabPane tab='销售收款' key='2'>
                <SalesPayment/>
            </Tabs.TabPane>:''}
            {userQx()[560]=='1'?<Tabs.TabPane tab='退货收款' key='3'>
                <ReturnFee/>
            </Tabs.TabPane>:''}
            {userQx()[550]=='1'?<Tabs.TabPane tab='入库报表' key='4'>
                <InventoryReport/>
            </Tabs.TabPane>:''}
            {userQx()[551]=='1'?<Tabs.TabPane tab='出库报表' key='5'>
                <OutboundReport/>
            </Tabs.TabPane>:''}
            {userQx()[549]=='1'?<Tabs.TabPane tab='缴费明细' key='6'>
                <PaymentDetails/>
            </Tabs.TabPane>:''}
        </Tabs>
    )
}
export default PaymentManagement;
