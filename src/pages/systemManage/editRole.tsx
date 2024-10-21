import {useEffect, useRef, useState} from "react";
import {connect,useLocation,history} from "umi";
import {Button, Form, Input, message} from "antd";
import * as RoleService from '@/services/role';
import {buildTree, mmPattern, phonePattern} from "@/utils/OpenTool";
import {qxTree} from "@/constants/qxMenu";
import TypeMenu from "@/ModelTypes/TypeMenu";
import {StaticInfo} from "@/StaticInfo";
const tailLayout = {
    wrapperCol: { offset: 4 },
};
let qxList=StaticInfo.uqx;
let authArr =qxList.split('').map(Number)
const EditRole=(props)=>{
    const treeData = buildTree(qxTree);
    const location=useLocation();
    const formRef =useRef();
    const [selected, setSelected] = useState<string[]>(Array(313).fill('0'));
    // 路由参数
    const [uid,setUid]=useState<string|undefined>();
    useEffect(()=>{
        const searchParams = new URLSearchParams(location.search);
        const id = searchParams.get('id');
        setUid(id);
        getOneUserInfo(id);
    },[]);
    let getOneUserInfo=(id:string)=>{
        RoleService.one(id).then((res)=>{
            if (res?.ErrorCode==0){
                formRef.current?.setFieldsValue(res.Data);
                setSelected(res.Data.authority.split(''));
            }else {
                message.error(res.Data)
            }
        });
    };
    const TreeMenu=({ tree, selected,disabled, setSelected }: { tree: TypeMenu[]; selected: string[];disabled:number[], setSelected: (newSelected: string[]) => void })=> {
        return (
            <ul>
                {tree.map(node => (
                    <li key={node.id}>
                        <input
                            type="checkbox"
                            disabled={disabled[node.id]==0}
                            checked={selected[node.id] === '1'}
                            onChange={e => handleCheckboxChange(node.id, e.target.checked)}
                        />
                        {node.name}
                        {node.children && node.children.length > 0 && (
                            <TreeMenu tree={node.children} selected={selected} disabled={disabled} setSelected={setSelected} />
                        )}
                    </li>
                ))}
            </ul>
        );
    };
    const handleCheckboxChange=(id: number, isChecked: boolean) =>{
        // 创建一个新的数组来存储新的选中状态
        let newSelected = [...selected];
        // 更新指定 ID 的节点的选中状态
        newSelected[id] = isChecked ? '1' : '0';
        // 设置新的选中状态
        setSelected(newSelected);
    };
    const onFinish=(value:any)=>{
        let authority=selected.join('');
        props.dispatch({
            type:'Role/edit',
            payload:{...value,uid,authority}
        }).then((res)=>{
            if (res.ErrorCode==0){
                message.success('修改成功');
                history.push('/systemManage/role');
            }else {
                message.error(res.Data);
            }
        })
    };
    return(
        <div>
            <Form
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 14 }}
                ref={formRef}
                layout="horizontal"
                size={'large'}
                onFinish={onFinish}
                style={{ marginTop:'1rem'}}
            >
                <Form.Item label="角色名称" name="role_name" rules={[{required: true, message: '请输入角色名称'}]}>
                    <Input placeholder="例:名称"/>
                </Form.Item>
                <Form.Item label="角色权限">
                    <TreeMenu tree={treeData} selected={selected} disabled={authArr}  setSelected={setSelected} />
                </Form.Item>
                <Form.Item {...tailLayout}>
                    <Button type="primary"  htmlType="submit">
                        修改
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}
export default connect() (EditRole)