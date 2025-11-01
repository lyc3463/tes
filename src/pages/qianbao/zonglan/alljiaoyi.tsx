import {Tabs} from "antd";
import {useState} from "react";
import NewAlljiaoyi from "@/pages/qianbao/zonglan/newAlljiaoyi";
import OldJiaoyi from "@/pages/qianbao/zonglan/oldJiaoyi";


const Alljiaoyi=(props)=>{
    const [activeKey, setActiveKey] = useState(sessionStorage.getItem('alljiaoyiActive') || '1');
    const onChange = (key) => {
        setActiveKey(key);
        sessionStorage.setItem('alljiaoyiActive', key);
    };
    return(
          <Tabs activeKey={activeKey} onChange={onChange}>
              <Tabs.TabPane tab='近两个月记录' key='1'>
                  <NewAlljiaoyi/>
              </Tabs.TabPane>
              <Tabs.TabPane tab='历史记录' key='2'>
                  <OldJiaoyi/>
              </Tabs.TabPane>
          </Tabs>
    )
};

export default Alljiaoyi