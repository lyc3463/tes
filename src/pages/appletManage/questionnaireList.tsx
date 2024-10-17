import {Button, Form, Input, List, Modal, Space, Table} from "antd";
import {history} from "umi";

const QuestionnaireList=()=>{
    const columns =[
        {
            title: '题目',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '问题类型',
            dataIndex: 'type',
            key: 'type',
            render:(text:any,record:any)=>(
                <div>
                    {text==1?<span style={{color:'blue'}}>选项题</span>:<span style={{color:'red'}}>简答题</span>}
                </div>
            )
        },
        {
            title: '操作',
            dataIndex: 'cao',
            key: 'cao',
            render:(text:any,record:any)=>(
                <div>

                </div>
            )
        }
    ];
    const toadd=()=>{
        history.push('/appletManage/addQuestionnaire')
    }
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
                        />
                        <Button type="primary">
                            搜索
                        </Button>
                    </Space>
                </List.Item>
            </List>
            <Table
                columns={columns}
                style={{border:'1px solid #ddd',borderRadius:'4px'}}
                pagination={false}
                size='small'
                scroll={{y:'70vh'}}
            />
        </div>
    )
}
export default QuestionnaireList