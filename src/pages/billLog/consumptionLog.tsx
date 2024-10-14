import {connect} from "umi";
import {useEffect} from "react";

const ConsumptionLog=(props:any)=>{
    useEffect(() => {
        console.log(props)
    }, []);
    return(
        <div>
            消费记录
        </div>
    )
}
const mapStateToProps = (state: any) => {
    return {
        ConsumptionLogList: state.ConsumptionLog.list
    }
};
export default connect(mapStateToProps) (ConsumptionLog)