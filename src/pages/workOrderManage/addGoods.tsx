import {Spin} from "antd";
import {useState} from "react";

const AddGoods=()=>{
    const [spinning,setspinning]=useState(false);
    return(
        <Spin spinning={spinning}>

        </Spin>
    )
};
export default AddGoods