import {Button, Form, Input, List, message, Modal, Pagination, Space, Table, Tag} from "antd";
import {history,connect} from "umi";
import {useEffect, useState} from "react";
import {StaticInfo} from "@/StaticInfo";

const QuestionnaireList=(props)=>{
    const [name,setName]=useState('');
    const [page,setPage]=useState(1);
    const [pageSize,setPageSize]=useState(50);
    // 删除的名字
    const [uname,setUname]=useState('');
    // 删除的id
    const [uid,setUid]=useState(0);
    // 弹窗
    const [open,setOpen]=useState(false);
    // 用户权限
    const [uqx,setUqx]=useState([]);
    const columns =[
        {
            title: '题目',
            dataIndex: 'problem_name',
            key: 'problem_name',
        },
        {
            title: '问题类型',
            dataIndex: 'problem_type',
            key: 'problem_type',
            render:(text:any,record:any)=>(
                <div>
                    {text==0?<Tag color='green'>选项题</Tag>:<Tag color='red'>简答题</Tag>}
                </div>
            )
        },
        {
            title: '操作',
            dataIndex: 'cao',
            key: 'cao',
            render:(text:any,record:any)=>(
                <Space>
                    {uqx[279]=='1'?<Button type='primary' onClick={()=>toEdit(record.id)}>编辑</Button>:''}
                    {uqx[280]=='1'?<Button type='primary' danger onClick={()=>deleOpen(record)}>删除</Button>:''}
                </Space>
            )
        }
    ];
    const logFenye=()=>{
        props.dispatch({
            type:"Questionnaire/fetch",
            payload:{page,name,pageSize}
        })
    };
    const toadd=()=>{
        history.push('/appletManage/addQuestionnaire')
    };
    const toEdit=(e:number)=>{
        history.push(`/appletManage/editQuestionnaireList?id=${e}`)
    };
    useEffect(() => {
        logFenye()
    }, [page,pageSize]);

    // 监听页码
    const onChange=(e:number,pageSize)=>{
      setPage(e);
      setPageSize(pageSize);
    };
    // 搜索按钮
    const sousuo=()=>{
        setPage(1);
        getFenyeInfo();
        logFenye();
    };
    const getFenyeInfo=()=>{
        props.dispatch({
            type:'Questionnaire/fenye',
            payload:{name,pageSize}
        })
    };
    // 删除弹窗
    const deleOpen=(e)=>{
        setOpen(true);
        setUid(e.id);
        setUname(e.problem_name)
    };
    // 确定删除
    const onOk=()=>{
        props.dispatch({
            type:'Questionnaire/remove',
            payload:uid
        }).then((res:any)=>{
            if (res.ErrorCode==0){
                message.success('删除成功');
                setOpen(false)
            }else {
                message.error(res.Data)
            }
        })
    };
    useEffect(() => {
        let uq=StaticInfo.uqx.split('');
        setUqx(uq);
        getFenyeInfo();
    }, []);
    return(
        <div>
            <List>
                <List.Item>
                    <div>
                        {uqx[278]=='1'?<Button type="primary" onClick={toadd}>添加问题</Button>:''}
                    </div>
                    <Space>
                        <Input
                            addonBefore="问题名称:"
                            onChange={(e)=>setName(e.target.value)}
                        />
                        <Button type="primary" onClick={sousuo}>
                            搜索
                        </Button>
                    </Space>
                </List.Item>
            </List>
            <Table
                columns={columns}
                style={{border:'1px solid #ddd',borderRadius:'4px'}}
                rowKey={(columns) => columns.id}
                pagination={false}
                size='small'
                dataSource={props.QuestionnaireList}
                scroll={{y:'70vh'}}
            />
            {props.count?<Pagination total={props.count.count} showSizeChanger pageSize={pageSize} current={page}  onChange={onChange} pageSizeOptions={[50,100,500,1000,10000]}/>:''}
            <Modal open={open} onCancel={()=>setOpen(false)} onOk={onOk} title='删除题目'>
                <div>
                    <span>是否要删除:<span style={{color:"red"}}>{uname}</span>?</span>
                </div>
            </Modal>
        </div>
    )
}
const mapStateToProps = (state: any) => {
    return {
        QuestionnaireList: state.Questionnaire.list,
        count:state.Questionnaire.count
    }
};
export default connect(mapStateToProps) (QuestionnaireList)