import {Tabs} from "antd";
import WarehouseList from "@/pages/warehouse/warehouseList";
import WarehouseType from "@/pages/warehouse/warehouseType";
import UnitSetting from "@/pages/warehouse/unitSetting";
import UnitCalculation from "@/pages/warehouse/unitCalculation";
import {useState} from "react";
import BrandList from "@/pages/warehouse/brandList";
import PayType from "@/pages/warehouse/payType";


const WarehouseAndType=()=>{
    const [activeKey, setActiveKey] = useState(sessionStorage.getItem('warehouseAndTypeActiveKey') || '1');
    const onChange = (key) => {
        setActiveKey(key);
        sessionStorage.setItem('warehouseAndTypeActiveKey', key);
    };
    return(
        <Tabs activeKey={activeKey} onChange={onChange}>
           <Tabs.TabPane tab='仓库列表' key='1'>
               <WarehouseList/>
           </Tabs.TabPane>
            <Tabs.TabPane tab='仓库类型' key='2'>
                <WarehouseType/>
            </Tabs.TabPane>
            <Tabs.TabPane tab='单位设置' key='3'>
                <UnitSetting/>
            </Tabs.TabPane>
            <Tabs.TabPane tab='单位计算' key='4'>
                <UnitCalculation/>
            </Tabs.TabPane>
            <Tabs.TabPane tab='品牌列表' key='5'>
                <BrandList/>
            </Tabs.TabPane>
            <Tabs.TabPane tab='支付方式' key='6'>
                <PayType/>
            </Tabs.TabPane>
        </Tabs>
    )
}
export default WarehouseAndType;
