import {connect} from "umi";
import {useEffect, useState} from "react";
import {Button, Form, Input, InputNumber, List, message, Modal, Pagination, Space, Table} from "antd";
import dayjs from "dayjs";
const EnterAmount=(props)=>{
    const [page,setPage]=useState(1);
    const [name,setName]=useState('');
    const [open,setOpen]=useState(false);
    const [uid,setUid]=useState(0);
    const [money,setMoney]=useState(0);
    const columns =[
        {
            title: '租户姓名',
            dataIndex: 'tenant_name',
            key: 'tenant_name',
        },
        {
            title: '收费项目名称',
            dataIndex: 'item_name',
            key: 'item_name',
        },
        {
            title: '操作',
            dataIndex: 'cao',
            key: 'cao',
            render: (text:any, record:any) => {
                return(
                    <Button type='primary' onClick={()=>shuru(record.id)}>
                        每户输入金额
                    </Button>
                )
            }
        },
    ];
    // 分页
    const logFenye=()=>{
        props.dispatch({
            type:"EnterAmount/fetch",
            payload:{page,name}
        })
    };
    useEffect(() => {
        logFenye();
    }, [page]);
    const sousuo=()=>{
        setPage(1);
        props.dispatch({
            type:"EnterAmount/fenye",
            payload:{name}
        });
        logFenye();
    };
    const onChange=(e)=>{
        setPage(e)
    };
    const shuru=(id:number)=>{
        setOpen(true);
        setUid(id);
    };
    const onOk=()=>{
        props.dispatch({
            type:'',
            payload:{uid,money}
        }).then((res:any)=>{
            if (res.ErrorCode==0){
                message.success('添加成功');
                setOpen(false)
            }else {
                message.error(res.Data);
            }
        })
    }
    return(
        <div>
            <List>
                <List.Item>
                    <Space>
                        <Input
                            addonBefore="租户姓名:"
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
                rowKey={(columns) => columns.id}
                pagination={false}
                size='small'
                dataSource={props.EnterAmountList}
                rowClassName={(record, index) =>
                    index % 2 === 1 ? 'tbodd' : 'tbeven'
                }
            />
            {props.count?<Pagination total={props.count.count} pageSize={50} current={page}  onChange={onChange} pageSizeOptions={[50]}/>:''}
            <Modal open={open} onOk={onOk} onCancel={()=>setOpen(false)} title='输入金额'>
                <Form>
                    <Form.Item label='金额(元)'>
                        <InputNumber min={0} onChange={(e:any)=>setMoney(e)}/>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}
const mapStateToProps = (state: any) => {
    return {
        EnterAmountList: state.EnterAmount.list,
        count: state.EnterAmount.count,
    }
};
export default connect(mapStateToProps) (EnterAmount)