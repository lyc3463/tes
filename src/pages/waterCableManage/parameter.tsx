import {Tabs} from "antd";
import WaterParameter from "@/pages/waterCableManage/waterParameter";
import CableParameter from "@/pages/waterCableManage/cableParameter";
import ParameterList from "@/pages/waterCableManage/parameterList";
const Parameter=()=>{
    return(
        <div>
            <Tabs>
                <Tabs.TabPane key={1} tab={'所有参数'}>
                    <ParameterList/>
                </Tabs.TabPane>
                {/*<Tabs.TabPane key={2} tab={'水表参数列表'}>*/}
                {/*    <WaterParameter/>*/}
                {/*</Tabs.TabPane>*/}
                {/*<Tabs.TabPane key={3} tab={'电表表参数列表'}>*/}
                {/*    <CableParameter/>*/}
                {/*</Tabs.TabPane>*/}
            </Tabs>
        </div>
    )
}
export default Parameter