import {connect,history} from 'umi'
import {Button, Form, Input, InputNumber, message, Radio, Select} from "antd";
import CryptoUtils from '@/utils/Crypto';
import {mmPattern, phonePattern, buildTree, filterAndUpdateList} from "@/utils/OpenTool";
import {qxTree} from "@/constants/qxMenu";
import {useEffect, useState} from "react";
import { StaticInfo } from '@/StaticInfo';
import TypeMenu from "@/ModelTypes/TypeMenu";
import * as RoleService from '@/services/role';
const tailLayout = {
    wrapperCol: { offset: 4 },
};
let qxList=StaticInfo.uqx;
let authArr =qxList.split('').map(Number)
const AddUser=(props:any)=>{
    const [form] = Form.useForm();
    const treeData = buildTree(qxTree);
    const [roleList,setRoleList]=useState([]);
    const [selected, setSelected] = useState<string[]>(Array(296).fill('0'));
    const onFinish= (values)=>{
        let mm =CryptoUtils.md5(values.passWord);
        values.passWord=mm;
        let joinqx=selected.join('');
        console.log(joinqx);
        //  props.dispatch({
        //     type:'Users/add',
        //     payload:{...values,joinqx}
        // }).then((res)=>{
        //     if (res.ErrorCode==0){
        //         message.success('添加成功');
        //         history.push('/systemManage/userManage')
        //     }else {
        //         message.error(res.Data)
        //     }
        //  })
    };
    const TreeMenu=({ tree, selected,disabled, setSelected }: { tree: TypeMenu[]; selected: string[];disabled:number[], setSelected: (newSelected: string[]) => void }) =>{
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
    const handleCheckboxChange=(id: number, isChecked: boolean)=> {
        // 创建一个新的数组来存储新的选中状态
        let newSelected = [...selected];
        // 更新指定 ID 的节点的选中状态
        newSelected[id] = isChecked ? '1' : '0';
        // 设置新的选中状态
        setSelected(newSelected);
    };
    useEffect(() => {
        filterAndUpdateList(props.RoleList, 'role_name', 'id', setRoleList);
    }, []);
    // 下拉选择角色获取角色权限
    const change=(e)=>{
        RoleService.one(e).then((res:any)=>{
            if (res.ErrorCode==0){
                setSelected(res.Data.authority)
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
                <Form.Item label="管理员名称" name="name" rules={[{required: true, message: '请输入管理员名称'}]}>
                    <Input placeholder="例:xx账户"/>
                </Form.Item>
                <Form.Item label='选择角色' name='role_id'>
                    <Select onChange={change}>
                        {roleList.map((item:any,index:any)=>{
                            return(
                                <Select.Option value={item.value} key={index}>
                                    {item.label}
                                </Select.Option>
                            )
                        })}
                    </Select>
                </Form.Item>
                <Form.Item label="管理员手机号" name="phone" rules={[{required: true, message: '请输入管理员手机号'},{pattern: phonePattern, message: '请输入有效的手机号'}]}>
                    <Input/>
                </Form.Item>
                <Form.Item label="管理员密码" name="passWord" rules={[{required: true, message: '请输入密码'},{pattern: mmPattern, message: '请输入长度6位数的密码'}]}>
                    <Input.Password/>
                </Form.Item>
                <Form.Item label="员工权限">
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
const mapStateToProps = (state: any) => {
    return {
        RoleList: state.Role.list
    }
};
export default connect(mapStateToProps) (AddUser)