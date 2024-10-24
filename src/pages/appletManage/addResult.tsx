import {connect,history} from "umi";
const tailLayout = {
    wrapperCol: { offset: 4 },
};
const AddResult=(props:any)=>{
    return(
        <div>
            添加问卷
        </div>
    )
}
const mapStateToProps = (state: any) => {
    return {
        QuestionnaireList: state.Questionnaire.list
    }
};
export default connect(mapStateToProps) (AddResult)