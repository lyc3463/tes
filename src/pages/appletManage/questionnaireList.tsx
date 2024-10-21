import {Button, Form, Input, List, message, Modal, Pagination, Space, Table, Tag} from "antd";
import {history,connect} from "umi";
import {useEffect, useState} from "react";

const QuestionnaireList=(props)=>{
    const [name,setName]=useState('');
    const [page,setPage]=useState(1);
    // 删除的名字
    const [uname,setUname]=useState('');
    // 删除的id
    const [uid,setUid]=useState(0);
    // 弹窗
    const [open,setOpen]=useState(false);
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
                    <Button type='primary'>编辑</Button>
                    <Button type='primary' danger onClick={()=>deleOpen(record)}>删除</Button>
                </Space>
            )
        }
    ];
    const logFenye=()=>{
        props.dispatch({
            type:"Questionnaire/fetch",
            payload:{page,name}
        })
    };
    const toadd=()=>{
        history.push('/appletManage/addQuestionnaire')
    };
    useEffect(() => {
        logFenye()
    }, [page]);

    // 监听页码
    const onChange=(e:number)=>{
      setPage(e)
    };
    // 搜索按钮
    const sousuo=()=>{
        setPage(1);
        props.dispatch({
            type:'Questionnaire/fenye',
            payload:{name}
        })
        logFenye();
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
    return(
        <div>
            <List>
                <List.Item>
                    <div>
                        <Button type="primary" onClick={toadd}>
                            添加问题
                        </Button>
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
            {props.count?<Pagination total={props.count.count} pageSize={50} current={page}  onChange={onChange} pageSizeOptions={[50]}/>:''}
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