import {Button, Form, Input, List, message, Modal, Select, Space, Table} from "antd";
import {history,connect} from "umi";
import {useEffect, useState} from "react";
import * as ProjectService from '@/services/project';
import {getContainInfo, remove} from "@/services/project";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";

const ProjectList=(props:any)=>{
    // 删除的弹窗
    const [isDeleteOpen,setIsDeleteOpen]=useState(false);
    // 展示当前项目下包含的账户
    const [iszhList,setiszhList]=useState([]);
    // 需要删除的id
    const [uid,setUid]=useState();
    // 项目名字
    const [name,setName]=useState('');
    // 公司id
    const [companyId,setCompanyId]=useState(0);
    // 公司列表
    const [companyList,setCompanyList]=useState([]);
    const columns =[
        {
            title: '项目名称',
            dataIndex: 'project_name',
            key: 'project_name',
        },
        {
            title: '所属公司',
            dataIndex: 'company_name',
            key: 'company_name',
        },
        {
            title: '操作',
            dataIndex: 'cao',
            key: 'cao',
            render:(text:any,record:any)=>{
                return(
                    <Space>
                        <Button type='primary' onClick={()=>{toedit(record.id)}}>编辑</Button>
                        <Button type='primary' danger onClick={()=>isdelete(record.id)}>删除</Button>
                    </Space>
                )
            }
        }
    ];

    // 查询当前项目底下包含的资料
    const isdelete=async (e:number)=>{
        setUid(e);
        let res:any=await ProjectService.getContainInfo(e)
        if (res?.ErrorCode==0){
            console.log("res",res);
            setIsDeleteOpen(true)
            // setiskemuList(res.Data)
            setiszhList(res.Data)
        }
    };

    // 确定强制删除
    const ConfirmDelete= ()=>{
        if (iszhList.length>0){
            message.error('绑定有账户，此项目不能强制删除');
        }else {
            props.dispatch({
                type:'Project/remove',
                payload:uid
            }).then((res:any)=>{
                if (res.ErrorCode==0){
                    message.success('删除成功');
                    setIsDeleteOpen(false);
                }else {
                    message.error(res.Data)
                }
            })
        }
    };
    const toProject=()=>{
        history.push('/financeManage/addProject')
    };
   const toedit=(e:number)=>{
       history.push(`/financeManage/editProject?id=${e}`)
   };
    const getList=()=>{
        props.dispatch({
            type:'Project/fetch',
            payload:{name,companyId}
        })
    };
    useEffect(() => {
        getList();
        getCompanList();
    }, []);
    const sousuo=()=>{
        getList();
    };
    // 监听公司id
    const changeCompany=(e:number)=>{
        setCompanyId(e);
    };
    // 公司拼接
    const conterCompay=(item)=>{
        let oldarr=[ {label:'全部',value:0}];
        let newarr=item.map((item:any)=>{
            return {
                label:item.company_name,
                value:item.id
            }
        });
        setCompanyList(oldarr.concat(newarr));
    };
    // 获取公司列表
    const getCompanList=()=>{
        props.dispatch({
            type:'Compan/fetch',
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                conterCompay(res.Data)
            }else {
                conterCompay([])
            }
        })
    };
    return(
        <div>
            <List>
                <List.Item>
                    <div>
                        <Button type="primary"  onClick={toProject}>
                            添加项目
                        </Button>
                    </div>
                    <Space>
                        <Input
                            addonBefore="项目名称:"
                            onChange={(e)=>setName(e.target.value)}
                        />
                        <Space.Compact>
                            <div
                                style={{
                                    borderRadius: '6px',
                                    borderStartEndRadius: 0,
                                    borderEndEndRadius: 0,
                                    padding: '0 11px',
                                    border: '1px solid #d9d9d9',
                                    display: 'flex',
                                    alignItems: 'center',
                                    borderInlineEnd: 0,
                                }}
                            >
                                公司:
                            </div>
                            <Select
                                onChange={changeCompany}
                                defaultValue={companyId}
                                style={{ width: 240 }}
                                options={companyList}
                                showSearch
                                optionFilterProp="children"
                                filterOption={(input, option) => {
                                    // 假设每个 option 都有一个与数据项对应的 value 属性
                                    const item = companyList.find(unit => unit.value == option.value);
                                    return item?.label?.toLowerCase().includes(input.toLowerCase());
                                }}
                            >
                            </Select>
                        </Space.Compact>
                        <Button type="primary" onClick={sousuo}>
                            搜索
                        </Button>
                    </Space>
                </List.Item>
            </List>
            <Table
                rowKey={(columns) => columns.id}
                columns={columns}
                style={{border:'1px solid #ddd',borderRadius:'4px'}}
                dataSource={props.ProjectList} pagination={false}
                size='small'
            />
            {/*删除的弹窗*/}
            <Modal open={isDeleteOpen} onCancel={()=>setIsDeleteOpen(false)} onOk={ConfirmDelete}>
                {/* 检查两个数组是否都为空 */}
                { iszhList.length === 0 ? (
                    <div>该账户没有绑定有账户,可以删除</div>
                ) : (
                    <>
                        <div>
                            <h2>当前项目绑定有以下信息</h2>
                            {/* 如果iskemuList不为空，则渲染它的内容 */}
                            {iszhList.map((item, index) => (
                                <div key={index}>{item}</div>
                            ))}
                        </div>

                    </>
                )}
            </Modal>
        </div>
    )
}
const mapStateToProps = (state: any) => {
    return {
        ProjectList: state.Project.list
    }
};
export default  connect(mapStateToProps)(ProjectList)
