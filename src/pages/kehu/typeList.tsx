import {Button, Form, Table} from "antd";
import {history,connect} from "umi";
import {useEffect} from "react";

const TypeList=(props)=>{
    const columns =[
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            render: (text:any, record:any) => {
                return(
                    <Button type='link'>{text}</Button>
                )
            },
        },
        {
            title: '标签名称',
            dataIndex: 'label_name',
            key: 'label_name',
        }
    ]
    const toadd=()=>{
        history.push('/kehu/addType')
    }
    return(
        <div>
            <Form style={{backgroundColor:'#f5f5f5',padding:'10px',marginBottom:"20px",border:'1px solid #e3e3e3',borderRadius:'4px'}}>
                <Form.Item>
                    <Button type='primary' onClick={toadd}>添加标签</Button>
                </Form.Item>
            </Form>
            <Table
                columns={columns}
                style={{border:'1px solid #ddd', borderRadius:'4px'}}
                rowKey={(columns) => columns.id}
                dataSource={props.BiaoqianList}
                pagination={false}
            />

        </div>
    )
}
const mapStateToProps = (state: any) => {
    return {
        BiaoqianList: state.Biaoqian.list
    }
};

export default  connect(mapStateToProps)(TypeList)