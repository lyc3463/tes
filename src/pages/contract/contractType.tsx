import Dingjin from "@/pages/contract/dingjin";
import {Tabs} from "antd";
import EndContran from "@/pages/contract/endContran";
const  ContractType=()=>{
    return(
        <div>
            <Tabs >
                <Tabs.TabPane key='1' tab='定金合同模板'>
                    <Dingjin/>
                </Tabs.TabPane>
                <Tabs.TabPane key='2' tab='正式合同模板'>
                    <EndContran/>
                </Tabs.TabPane>
            </Tabs>
        </div>
    )
}
export default ContractType