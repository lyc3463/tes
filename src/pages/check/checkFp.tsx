import {connect, history} from 'umi'
import {useEffect, useState} from "react";
import {Tabs} from "antd";
import CheckShuidian from "@/pages/check/checkShuidian";
import CheckAllFp from "@/pages/check/checkAllFp";
import UnopenedSdFp from "@/pages/check/unopenedSdFp";
import UnopenedAllFp from "@/pages/check/unopenedAllFp";
const CheckFp=(props:any)=>{
    const [activeKey, setActiveKey] = useState(sessionStorage.getItem('activeTabfp') || '1');
    const onChange = (key) => {
        setActiveKey(key);
        sessionStorage.setItem('activeTabfp', key);
    };
    return(
        <div>
            <Tabs  activeKey={activeKey} onChange={onChange}>
                <Tabs.TabPane tab='审核水电发票' key='1'>
                    <CheckShuidian/>
                </Tabs.TabPane>
                <Tabs.TabPane tab='审核发票' key='2'>
                    <CheckAllFp/>
                </Tabs.TabPane>
                <Tabs.TabPane tab='未开水电发票' key='3'>
                    <UnopenedSdFp/>
                </Tabs.TabPane>
                <Tabs.TabPane tab='未开发票列表' key='4'>
                    <UnopenedAllFp/>
                </Tabs.TabPane>
            </Tabs>
        </div>
    )
}
const mapStateToProps = (state: any) => {
    return {
        CheckFpList: state.CheckFp.list,
        count:state.CheckFp.count
    }
};
export default connect(mapStateToProps) (CheckFp)