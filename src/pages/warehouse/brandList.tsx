import {connect,history} from "umi";
import {useEffect, useState} from "react";
import {Button, Input, List, message, Modal, Space, Spin, Table} from "antd";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";

const BrandList=(props)=>{
    const [name, setName] = useState('');
    const [spinning, setSpinning] = useState(false);
    const [uid,setUid]=useState(0);
    const [delOpen,setDelOpen]=useState(false);
    const columns = [
        {
            title: '品牌名称',
            dataIndex: 'brandName',
            key: 'brandName',
        },
        {
            title: '操作',
            dataIndex: 'operation',
            key: 'operation',
            render: (text, record) => (
                <Space size="small">
                    <Button type="primary" onClick={()=>{history.push(`/warehouse/brandEdit?id=${record.id}`)}}>编辑</Button>
                    <Button type="primary" danger onClick={()=>isDelOpen(record.id)}>删除</Button>
                </Space>
            ),
        },
    ];
    const changeName=(e:any)=>{
        setName(e.target.value);
    }
    const toadd=()=>{
        history.push('/warehouse/brandAdd');
    };
    const getList=()=>{
        props.dispatch({
            type:'BrandList/fetch',
            payload:{name}
        })
    };
    useEffect(() => {
        getList();
    }, []);
    const isDelOpen=(e)=>{
        setUid(e);
        setDelOpen(true);
    };
    const onOk=()=>{
      setSpinning(true);
      props.dispatch({
          type:'BrandList/remove',
          payload:uid
      }).then((res:TypeErrorCode)=>{
          if (res.ErrorCode==0){
              message.success('删除成功');
              setSpinning(false);
              setDelOpen(false);
          }else {
              message.error('删除失败'+res.ErrorCode+res.Data);
              setSpinning(false);
          }
      })
    };
    const sousuo=()=>{
        getList();
    };
    return(
        <Spin spinning={spinning}>
            <List>
                <List.Item>
                    <div>
                        <Button type="primary" onClick={toadd}>新增品牌</Button>
                    </div>
                    <Space>
                        <Input
                            addonBefore="品牌名称:"
                            onChange={changeName}
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
                dataSource={props.list}
                rowClassName={(record, index) =>
                    index % 2 === 1 ? 'tbodd' : 'tbeven'
                }
            />
            <Modal title="确认删除吗？" open={delOpen} onCancel={()=>setDelOpen(false)} onOk={onOk} loading={spinning}>
                <div>是否要删除?</div>
            </Modal>
        </Spin>
    )
}
const mapStateToProps = (state: any) => ({
    list: state.BrandList.list,
});
export default connect(mapStateToProps) (BrandList);
