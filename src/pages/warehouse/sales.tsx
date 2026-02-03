import {Space, Table, Tabs} from "antd";
import SalesList from "@/pages/warehouse/salesList";
import SalesInfo from "@/pages/warehouse/salesInfo";
import {useState} from "react";
import SalesCustomerList from "@/pages/warehouse/salesCustomerList";
import {userQx} from "@/utils/OpenTool";

const Sales=()=>{
    const [activeKey, setActiveKey] = useState(sessionStorage.getItem('salesActiveKey') || '1');
    const onChange = (key) => {
        setActiveKey(key);
        sessionStorage.setItem('salesActiveKey', key);
    };
    return(
        <div>
           <Tabs activeKey={activeKey} onChange={onChange}>
               {userQx()[526]=='1'?
                   <Tabs.TabPane tab='销售列表' key='1'>
                       <SalesList/>
                   </Tabs.TabPane>:''}
               {userQx()[530]=='1'?
                   <Tabs.TabPane tab='销售审核' key='3'>
                       <SalesCustomerList/>
                   </Tabs.TabPane>:''}
               {userQx()[532]=='1'?
                   <Tabs.TabPane tab='销售明细' key='4'>
                       <SalesInfo/>
                   </Tabs.TabPane>:''}
           </Tabs>
        </div>
    )
}
export default Sales;
