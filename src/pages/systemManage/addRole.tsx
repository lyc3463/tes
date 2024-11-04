import {Button, Form, Input, message} from "antd";
import {buildTree, mmPattern, phonePattern} from "@/utils/OpenTool";
import {qxTree} from "@/constants/qxMenu";
import {useState} from "react";
import {history} from "umi";
import TypeMenu from "@/ModelTypes/TypeMenu";
import {StaticInfo} from "@/StaticInfo";
import {connect} from "@@/exports";
const tailLayout = {
    wrapperCol: { offset: 4 },
};
let qxList=StaticInfo.uqx;
let authArr =qxList.split('').map(Number)
const AddRole=(props)=>{
    const [form] = Form.useForm();
    const treeData = buildTree(qxTree);
    const [selected, setSelected] = useState<string[]>(Array(324).fill('0'));
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
  const  handleCheckboxChange=(id: number, isChecked: boolean)=> {
        // 创建一个新的数组来存储新的选中状态
        let newSelected = [...selected];
        // 更新指定 ID 的节点的选中状态
        newSelected[id] = isChecked ? '1' : '0';
        // 设置新的选中状态
        setSelected(newSelected);
    };
    const onFinish= (values)=>{
        let authority=selected.join('');
         props.dispatch({
            type:'Role/add',
            payload:{...values,authority}
        }).then((res)=>{
            if (res.ErrorCode==0){
                message.success('添加成功');
                history.push('/systemManage/role')
            }else {
                message.error(res.Data)
            }
         })
    };
    return(
        <div>
            <Form
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 14 }}
                form={form}
                layout="horizontal"
                size={'large'}
                onFinish={onFinish}
                style={{ marginTop:'1rem'}}
            >
                <Form.Item label="角色名称" name="name" rules={[{required: true, message: '请输入角色名称'}]}>
                    <Input placeholder="角色名称"/>
                </Form.Item>
                <Form.Item label="角色权限">
                    <TreeMenu tree={treeData} selected={selected} disabled={authArr} setSelected={setSelected} />
                </Form.Item>
                <Form.Item {...tailLayout}>
                    <Button type="primary"  htmlType="submit">
                        添加
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}
export default connect() (AddRole)