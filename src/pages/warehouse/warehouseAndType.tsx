import {Tabs} from "antd";
import WarehouseList from "@/pages/warehouse/warehouseList";
import WarehouseType from "@/pages/warehouse/warehouseType";
import UnitSetting from "@/pages/warehouse/unitSetting";
import UnitCalculation from "@/pages/warehouse/unitCalculation";
import {useState} from "react";
import BrandList from "@/pages/warehouse/brandList";
import PayType from "@/pages/warehouse/payType";
import {userQx} from "@/utils/OpenTool";
import YearSetting from "@/pages/warehouse/yearSetting";
import Texture from "@/pages/warehouse/texture";


const WarehouseAndType=()=>{
    const [activeKey, setActiveKey] = useState(sessionStorage.getItem('warehouseAndTypeActiveKey') || '1');
    const onChange = (key) => {
        setActiveKey(key);
        sessionStorage.setItem('warehouseAndTypeActiveKey', key);
    };
    return(
        <Tabs activeKey={activeKey} onChange={onChange}>
            {userQx()[460]=='1'?<Tabs.TabPane tab='物品类型' key='1'>
                <WarehouseType/>
            </Tabs.TabPane>:''}
            {userQx()[464]=='1'?<Tabs.TabPane tab='仓库列表' key='2'>
                <WarehouseList/>
            </Tabs.TabPane>:''}
            {userQx()[456]=='1'?<Tabs.TabPane tab='单位设置' key='3'>
                <UnitSetting/>
            </Tabs.TabPane>:''}
            {userQx()[475]=='1'?<Tabs.TabPane tab='单位计算' key='4'>
                <UnitCalculation/>
            </Tabs.TabPane>:''}
            {userQx()[471]=='1'?<Tabs.TabPane tab='品牌列表' key='5'>
                <BrandList/>
            </Tabs.TabPane>:''}
            {userQx()[545]=='1'?<Tabs.TabPane tab='支付方式' key='6'>
                <PayType/>
            </Tabs.TabPane>:''}
            <Tabs.TabPane tab='年份设置' key='7'>
                <YearSetting/>
            </Tabs.TabPane>
            <Tabs.TabPane tab='口感设置' key='8'>
                <Texture/>
            </Tabs.TabPane>
        </Tabs>
    )
}
export default WarehouseAndType;
