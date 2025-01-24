import {useEffect, useRef, useState} from "react";
import {connect,useLocation,history} from "umi";
import {Button, Form, Input, message} from "antd";
import * as RoleService from '@/services/role';
import {buildTree, ensureArrayLength, mmPattern, phonePattern} from "@/utils/OpenTool";
import {qxTree} from "@/constants/qxMenu";
import TypeMenu from "@/ModelTypes/TypeMenu";
import {StaticInfo} from "@/StaticInfo";
const tailLayout = {
    wrapperCol: { offset: 4 },
};
let qxList=StaticInfo.uqx;
let authArr =qxList.split('').map(Number);
const EditRole=(props)=>{
    const treeData = buildTree(qxTree);
    const location=useLocation();
    const formRef =useRef();
    const [selected, setSelected] = useState<string[]>(Array(346).fill('0'));
    // 路由参数
    const [uid,setUid]=useState<string|undefined>();
    useEffect(()=>{
        const searchParams = new URLSearchParams(location.search);
        const id = searchParams.get('id');
        setUid(id);
        getOneUserInfo(id);
    },[]);
    let getOneUserInfo=(id:string)=>{
        RoleService.one(id).then((res:any)=>{
            if (res.ErrorCode==0){
                formRef.current?.setFieldsValue(res.Data);
                const authorityString = res.Data.authority;
                const splitArray = authorityString.split('');
                const adjustedArray = ensureArrayLength(splitArray, selected.length, '0');
                setSelected(adjustedArray);
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
    const  handleCheckboxChange=(id: number, isChecked: boolean)=> {
        // 创建一个新的数组来存储新的选中状态
        let newSelected = [...selected];
        // 更新指定 ID 的节点的选中状态
        newSelected[id] = isChecked ? '1' : '0';
        if (id === 1 ) {
            newSelected[2] = isChecked ? '1' : '0';
            newSelected[3] = isChecked ? '1' : '0';
            newSelected[4] = isChecked ? '1' : '0';
            newSelected[5] = isChecked ? '1' : '0';
            newSelected[6] = isChecked ? '1' : '0';
            newSelected[118] = isChecked ? '1' : '0';
            newSelected[119] = isChecked ? '1' : '0';
            newSelected[315] = isChecked ? '1' : '0';
            newSelected[317] = isChecked ? '1' : '0';
            newSelected[301] = isChecked ? '1' : '0';
            newSelected[302] = isChecked ? '1' : '0';
            newSelected[303] = isChecked ? '1' : '0';
            newSelected[318] = isChecked ? '1' : '0';
            newSelected[300] = isChecked ? '1' : '0';
            newSelected[7] = isChecked ? '1' : '0';
        }
        if (id === 13) {
            newSelected[253] = '1';
            newSelected[10] = '1';
            newSelected[176] = '1';
            newSelected[254] = isChecked ? '1' : '0';
            newSelected[168] =  '1' ;
        }
        if (id === 254) {
            newSelected[176] = '1';
            newSelected[13] = '1';
            newSelected[253] = '1';
            newSelected[168] = '1';
        }
        if (id === 18 ){
            newSelected[176] = isChecked ? '1' : '0';
            newSelected[177] = isChecked ? '1' : '0';
            newSelected[178] = isChecked ? '1' : '0';
            newSelected[179] = isChecked ? '1' : '0';
            newSelected[184] = isChecked ? '1' : '0';
            newSelected[172] = isChecked ? '1' : '0';
            newSelected[180] = isChecked ? '1' : '0';
        }
        if (id === 20){
            newSelected[180] = isChecked ? '1' : '0';
            newSelected[181] = isChecked ? '1' : '0';
            newSelected[182] = isChecked ? '1' : '0';
            newSelected[183] = isChecked ? '1' : '0';
            newSelected[172] = isChecked ? '1' : '0';
            newSelected[180] = isChecked ? '1' : '0';
        }
        if (id === 19){
            newSelected[250] = isChecked ? '1' : '0';
            newSelected[251] = isChecked ? '1' : '0';
            newSelected[252] = isChecked ? '1' : '0';
            newSelected[253] = isChecked ? '1' : '0';
            newSelected[331] = isChecked ? '1' : '0';
        }
        if (id === 8){
            newSelected[9] = isChecked ? '1' : '0';
            newSelected[168] = isChecked ? '1' : '0';
            newSelected[169] = isChecked ? '1' : '0';
            newSelected[170] = isChecked ? '1' : '0';
            newSelected[171] = isChecked ? '1' : '0';
        }
        if (id === 16){
            newSelected[18] = isChecked ? '1' : '0';
            newSelected[17] = isChecked ? '1' : '0';
            newSelected[19] = isChecked ? '1' : '0';
            newSelected[20] = isChecked ? '1' : '0';
            newSelected[172] = isChecked ? '1' : '0';
            newSelected[173] = isChecked ? '1' : '0';
            newSelected[174] = isChecked ? '1' : '0';
            newSelected[175] = isChecked ? '1' : '0';
            newSelected[176] = isChecked ? '1' : '0';
            newSelected[177] = isChecked ? '1' : '0';
            newSelected[178] = isChecked ? '1' : '0';
            newSelected[179] = isChecked ? '1' : '0';
            newSelected[180] = isChecked ? '1' : '0';
            newSelected[181] = isChecked ? '1' : '0';
            newSelected[182] = isChecked ? '1' : '0';
            newSelected[183] = isChecked ? '1' : '0';
            newSelected[184] = isChecked ? '1' : '0';
            newSelected[250] = isChecked ? '1' : '0';
            newSelected[251] = isChecked ? '1' : '0';
            newSelected[252] = isChecked ? '1' : '0';
            newSelected[253] = isChecked ? '1' : '0';
            newSelected[331] = isChecked ? '1' : '0';
        }
        if (id === 17){
            newSelected[172] = isChecked ? '1' : '0';
            newSelected[173] = isChecked ? '1' : '0';
            newSelected[174] = isChecked ? '1' : '0';
            newSelected[175] = isChecked ? '1' : '0';
        }
        if (id === 10){
            newSelected[11] = isChecked ? '1' : '0';
            newSelected[12] = isChecked ? '1' : '0';
            newSelected[13] = isChecked ? '1' : '0';
            newSelected[14] = isChecked ? '1' : '0';
            newSelected[257] = isChecked ? '1' : '0';
            newSelected[258] = isChecked ? '1' : '0';
            newSelected[299] = isChecked ? '1' : '0';
            newSelected[256] = isChecked ? '1' : '0';
            newSelected[254] = isChecked ? '1' : '0';
            newSelected[176] = '1' ;
            newSelected[253] = '1';
            newSelected[168] = '1';
        }
        if (id === 21){
            newSelected[22] = isChecked ? '1' : '0';
            newSelected[23] = isChecked ? '1' : '0';
            newSelected[24] = isChecked ? '1' : '0';
        }
        if (id === 25){
            newSelected[26] = isChecked ? '1' : '0';
            newSelected[27] = isChecked ? '1' : '0';
            newSelected[28] = isChecked ? '1' : '0';
            newSelected[29] = isChecked ? '1' : '0';
            newSelected[309] = isChecked ? '1' : '0';
            newSelected[310] = isChecked ? '1' : '0';
            newSelected[311] = isChecked ? '1' : '0';
            newSelected[312] = isChecked ? '1' : '0';
        }
        if (id === 30){
            newSelected[31] = isChecked ? '1' : '0';
            newSelected[32] = isChecked ? '1' : '0';
            newSelected[33] = isChecked ? '1' : '0';
            newSelected[34] = isChecked ? '1' : '0';
            newSelected[176] = '1';
            newSelected[253] = '1' ;
        }
        if (id === 33){
            newSelected[176] = '1';
        }
        if (id === 34){
            newSelected[253] = '1';
        }
        if (id === 35){
            newSelected[36] = isChecked ? '1' : '0';
            newSelected[37] = isChecked ? '1' : '0';
            newSelected[38] = isChecked ? '1' : '0';
            newSelected[243] = isChecked ? '1' : '0';
            newSelected[244] = isChecked ? '1' : '0';
            newSelected[245] = isChecked ? '1' : '0';
            newSelected[246] = isChecked ? '1' : '0';
            newSelected[247] = isChecked ? '1' : '0';
            newSelected[248] = isChecked ? '1' : '0';
            newSelected[249] = isChecked ? '1' : '0';
        }
        if (id === 40){
            newSelected[198] = isChecked ? '1' : '0';
            newSelected[199] = isChecked ? '1' : '0';
            newSelected[200] = isChecked ? '1' : '0';
            newSelected[201] = isChecked ? '1' : '0';
            newSelected[145] = '1';
            newSelected[149] = '1';
            newSelected[157] = '1';
            newSelected[161] = '1';
            newSelected[39] = '1';
        }
        if (id === 41){
            newSelected[185] = isChecked ? '1' : '0';
            newSelected[186] = isChecked ? '1' : '0';
            newSelected[188] = isChecked ? '1' : '0';
            newSelected[189] = isChecked ? '1' : '0';
            newSelected[39] = '1';
            newSelected[307] = '1';
            newSelected[190] = '1';
        }
        if (id === 42){
            newSelected[204] = isChecked ? '1' : '0';
            newSelected[205] = isChecked ? '1' : '0';
            newSelected[206] = isChecked ? '1' : '0';
            newSelected[207] = isChecked ? '1' : '0';
            newSelected[39] = '1';
            newSelected[11] = '1';
            newSelected[37] = '1';
            newSelected[246] = '1';
            newSelected[153] = '1';
            newSelected[246] = '1';
        }
        if (id === 43){
            newSelected[153] = isChecked ? '1' : '0';
            newSelected[154] = isChecked ? '1' : '0';
            newSelected[155] = isChecked ? '1' : '0';
            newSelected[156] = isChecked ? '1' : '0';
            newSelected[342] = isChecked ? '1' : '0';
        }
        if (id === 44){
            newSelected[219] = isChecked ? '1' : '0';
            newSelected[220] = isChecked ? '1' : '0';
            newSelected[221] = isChecked ? '1' : '0';
            newSelected[222] = isChecked ? '1' : '0';
            newSelected[223] = isChecked ? '1' : '0';
            newSelected[224] = isChecked ? '1' : '0';
            newSelected[225] = isChecked ? '1' : '0';
            newSelected[226] = isChecked ? '1' : '0';
            newSelected[227] = isChecked ? '1' : '0';
            newSelected[228] = isChecked ? '1' : '0';
            newSelected[229] = isChecked ? '1' : '0';
            newSelected[230] = isChecked ? '1' : '0';
            newSelected[231] = isChecked ? '1' : '0';
            newSelected[232] = isChecked ? '1' : '0';
            newSelected[233] = isChecked ? '1' : '0';
            newSelected[234] = isChecked ? '1' : '0';
            newSelected[235] = isChecked ? '1' : '0';
            newSelected[236] = isChecked ? '1' : '0';
            newSelected[237] = isChecked ? '1' : '0';
            newSelected[238] = isChecked ? '1' : '0';
            newSelected[239] = isChecked ? '1' : '0';
            newSelected[240] = isChecked ? '1' : '0';
            newSelected[241] = isChecked ? '1' : '0';
        }
        if (id === 45){
            newSelected[46] = isChecked ? '1' : '0';
            newSelected[285] = isChecked ? '1' : '0';
            newSelected[47] = isChecked ? '1' : '0';
            newSelected[344] = isChecked ? '1' : '0';
            newSelected[48] = isChecked ? '1' : '0';
            newSelected[332] = isChecked ? '1' : '0';
            newSelected[333] = isChecked ? '1' : '0';
            newSelected[334] = isChecked ? '1' : '0';
            newSelected[335] = isChecked ? '1' : '0';
        }
        if (id === 50){
            newSelected[165] = isChecked ? '1' : '0';
            newSelected[166] = isChecked ? '1' : '0';
            newSelected[167] = isChecked ? '1' : '0';
            newSelected[49] = '1';
        }
        if (id === 51){
            newSelected[260] = isChecked ? '1' : '0';
            newSelected[261] = isChecked ? '1' : '0';
            newSelected[262] = isChecked ? '1' : '0';
            newSelected[258] = '1';
            newSelected[49] = '1';
        }
        if (id === 52){
            newSelected[268] = isChecked ? '1' : '0';
            newSelected[269] = isChecked ? '1' : '0';
            newSelected[270] = isChecked ? '1' : '0';
            newSelected[271] = isChecked ? '1' : '0';
            newSelected[298] = isChecked ? '1' : '0';
            newSelected[214] = '1';
        }
        if (id === 53){
            newSelected[272] = isChecked ? '1' : '0';
            newSelected[273] = isChecked ? '1' : '0';
            newSelected[274] = isChecked ? '1' : '0';
            newSelected[275] = isChecked ? '1' : '0';
        }
        if (id === 72){
            newSelected[71] = '1';
            newSelected[187] = isChecked ? '1' : '0';
            newSelected[264] = isChecked ? '1' : '0';
            newSelected[185] = '1';
        }
        if (id === 73){
            newSelected[71] = '1';
            newSelected[202] = isChecked ? '1' : '0';
            newSelected[198] = '1';
        }
        if (id === 74){
            newSelected[71] = '1';
            newSelected[208] = isChecked ? '1' : '0';
            newSelected[206] = '1';
        }
        if (id === 75){
            newSelected[71] = '1';
            newSelected[203] = isChecked ? '1' : '0';
            newSelected[153] = '1';
        }
        if (id === 56){
            newSelected[54] = '1';
            newSelected[276] = isChecked ? '1' : '0';
            newSelected[145] = '1';
            newSelected[149] = '1';
            newSelected[157] = '1';
            newSelected[161] = '1';
        }
        if (id === 54){
            newSelected[276] = isChecked ? '1' : '0';
            newSelected[55] = isChecked ? '1' : '0';
            newSelected[145] = isChecked ? '1' : '0';
            newSelected[146] = isChecked ? '1' : '0';
            newSelected[147] = isChecked ? '1' : '0';
            newSelected[148] = isChecked ? '1' : '0';
            newSelected[149] = isChecked ? '1' : '0';
            newSelected[150] = isChecked ? '1' : '0';
            newSelected[151] = isChecked ? '1' : '0';
            newSelected[152] = isChecked ? '1' : '0';
            newSelected[157] = isChecked ? '1' : '0';
            newSelected[158] = isChecked ? '1' : '0';
            newSelected[159] = isChecked ? '1' : '0';
            newSelected[160] = isChecked ? '1' : '0';
            newSelected[161] = isChecked ? '1' : '0';
            newSelected[162] = isChecked ? '1' : '0';
            newSelected[163] = isChecked ? '1' : '0';
            newSelected[164] = isChecked ? '1' : '0';
            newSelected[56] = isChecked ? '1' : '0';
        }
        if (id === 55){
            newSelected[54] =  '1';
            newSelected[145] = isChecked ? '1' : '0';
            newSelected[146] = isChecked ? '1' : '0';
            newSelected[147] = isChecked ? '1' : '0';
            newSelected[148] = isChecked ? '1' : '0';
            newSelected[149] = isChecked ? '1' : '0';
            newSelected[150] = isChecked ? '1' : '0';
            newSelected[151] = isChecked ? '1' : '0';
            newSelected[152] = isChecked ? '1' : '0';
            newSelected[157] = isChecked ? '1' : '0';
            newSelected[158] = isChecked ? '1' : '0';
            newSelected[159] = isChecked ? '1' : '0';
            newSelected[160] = isChecked ? '1' : '0';
            newSelected[161] = isChecked ? '1' : '0';
            newSelected[162] = isChecked ? '1' : '0';
            newSelected[163] = isChecked ? '1' : '0';
            newSelected[164] = isChecked ? '1' : '0';
        }
        if (id === 145){
            newSelected[54] = '1' ;
            newSelected[55] = '1';
            newSelected[146] = isChecked ? '1' : '0';
            newSelected[147] = isChecked ? '1' : '0';
            newSelected[148] = isChecked ? '1' : '0';
        }
        if (id === 149){
            newSelected[54] = '1' ;
            newSelected[55] = '1';
            newSelected[145] = '1';
            newSelected[150] = isChecked ? '1' : '0';
            newSelected[151] = isChecked ? '1' : '0';
            newSelected[152] = isChecked ? '1' : '0';
        }
        if (id === 157){
            newSelected[54] = '1' ;
            newSelected[55] = '1';
            newSelected[145] = '1';
            newSelected[149] = '1';
            newSelected[158] = isChecked ? '1' : '0';
            newSelected[159] = isChecked ? '1' : '0';
            newSelected[160] = isChecked ? '1' : '0';
        }
        if (id === 276){
            newSelected[54] = '1' ;
            newSelected[56] = '1';
            newSelected[145] = '1';
            newSelected[149] = '1';
            newSelected[157] = '1';
            newSelected[161] = '1';
        }
        if (id === 57){
            newSelected[58] = isChecked ? '1' : '0';
            newSelected[59] = isChecked ? '1' : '0';
            newSelected[60] = isChecked ? '1' : '0';
            newSelected[61] = isChecked ? '1' : '0';
            newSelected[62] = isChecked ? '1' : '0';
            newSelected[63] = isChecked ? '1' : '0';
            newSelected[64] = isChecked ? '1' : '0';
        }
        if (id === 65){
            newSelected[66] = isChecked ? '1' : '0';
            newSelected[284] = isChecked ? '1' : '0';
            newSelected[67] = isChecked ? '1' : '0';
            newSelected[68] = isChecked ? '1' : '0';
            newSelected[69] = isChecked ? '1' : '0';
            newSelected[70] = isChecked ? '1' : '0';
            newSelected[316] = isChecked ? '1' : '0';
            newSelected[259] = isChecked ? '1' : '0';
            newSelected[266] = isChecked ? '1' : '0';
            newSelected[267] = isChecked ? '1' : '0';
            newSelected[157] = '1' ;
        }
        if (id === 71){
            newSelected[72] = isChecked ? '1' : '0';
            newSelected[187] = isChecked ? '1' : '0';
            newSelected[185] =  '1';
            newSelected[264] =  isChecked ? '1' : '0';
            newSelected[73] =  isChecked ? '1' : '0';
            newSelected[202] =  isChecked ? '1' : '0';
            newSelected[198] =  '1' ;
            newSelected[74] =  isChecked ? '1' : '0' ;
            newSelected[208] =  isChecked ? '1' : '0' ;
            newSelected[206] = '1';
            newSelected[75] =  isChecked ? '1' : '0' ;
            newSelected[203] =  isChecked ? '1' : '0' ;
            newSelected[153] =  '1' ;
            newSelected[76] =  isChecked ? '1' : '0' ;
            newSelected[287] =  isChecked ? '1' : '0' ;
            newSelected[286] =  isChecked ? '1' : '0' ;
            newSelected[288] =  isChecked ? '1' : '0' ;
            newSelected[289] =  isChecked ? '1' : '0' ;
            newSelected[290] =  isChecked ? '1' : '0' ;
            newSelected[291] =  isChecked ? '1' : '0' ;
            newSelected[219] =  '1' ;
            newSelected[220] =  '1' ;
            newSelected[221] =  '1' ;
            newSelected[222] =  '1' ;
            newSelected[223] =  '1' ;
            newSelected[224] =  '1' ;
            newSelected[321] =  isChecked ? '1' : '0' ;
            newSelected[322] =  isChecked ? '1' : '0' ;
            newSelected[323] =  isChecked ? '1' : '0' ;
            newSelected[324] =  isChecked ? '1' : '0' ;
            newSelected[325] =  isChecked ? '1' : '0' ;
            newSelected[326] =  isChecked ? '1' : '0' ;
            newSelected[327] =  isChecked ? '1' : '0' ;
            newSelected[328] =  isChecked ? '1' : '0' ;
            newSelected[330] =  isChecked ? '1' : '0' ;
            newSelected[336] =  isChecked ? '1' : '0' ;
            newSelected[337] =  isChecked ? '1' : '0' ;
            newSelected[338] =  isChecked ? '1' : '0' ;
            newSelected[339] =  isChecked ? '1' : '0' ;
            newSelected[340] =  isChecked ? '1' : '0' ;
            newSelected[341] =  isChecked ? '1' : '0' ;
        }
        if (id === 77){
            newSelected[78] = isChecked ? '1' : '0';
            newSelected[79] = isChecked ? '1' : '0';
            newSelected[80] = isChecked ? '1' : '0';
            newSelected[81] = isChecked ? '1' : '0';
        }
        if (id === 67){
            newSelected[324] =  '1' ;
            newSelected[65] = '1' ;
            newSelected[328] = '1' ;
            newSelected[327] = '1' ;
            newSelected[325] = '1' ;
            newSelected[326] = '1' ;
        }
        if (id === 324){
            newSelected[325] = isChecked ? '1' : '0' ;
            newSelected[326] = isChecked ? '1' : '0' ;
            newSelected[327] = isChecked ? '1' : '0' ;
            newSelected[328] = isChecked ? '1' : '0' ;
            newSelected[71] =  '1' ;
        }
        if (id === 39){
            newSelected[40] = isChecked ? '1' : '0' ;
            newSelected[198] = isChecked ? '1' : '0';
            newSelected[199] = isChecked ? '1' : '0';
            newSelected[200] = isChecked ? '1' : '0';
            newSelected[201] = isChecked ? '1' : '0';
            newSelected[145] = '1';
            newSelected[149] = '1';
            newSelected[157] = '1';
            newSelected[161] = '1';
            newSelected[41] = isChecked ? '1' : '0' ;
            newSelected[185] = isChecked ? '1' : '0';
            newSelected[186] = isChecked ? '1' : '0';
            newSelected[188] = isChecked ? '1' : '0';
            newSelected[189] = isChecked ? '1' : '0';
            newSelected[307] = '1';
            newSelected[190] = '1';
            newSelected[42] = isChecked ? '1' : '0' ;
            newSelected[204] = isChecked ? '1' : '0';
            newSelected[205] = isChecked ? '1' : '0';
            newSelected[206] = isChecked ? '1' : '0';
            newSelected[207] = isChecked ? '1' : '0';
            newSelected[11] = '1';
            newSelected[37] = '1';
            newSelected[246] = '1';
            newSelected[153] = '1';
            newSelected[246] = '1';
            newSelected[43] = isChecked ? '1' : '0' ;
            newSelected[153] = isChecked ? '1' : '0';
            newSelected[154] = isChecked ? '1' : '0';
            newSelected[155] = isChecked ? '1' : '0';
            newSelected[156] = isChecked ? '1' : '0';
            newSelected[342] = isChecked ? '1' : '0';
            newSelected[44] = isChecked ? '1' : '0' ;
            newSelected[219] = isChecked ? '1' : '0';
            newSelected[220] = isChecked ? '1' : '0';
            newSelected[221] = isChecked ? '1' : '0';
            newSelected[222] = isChecked ? '1' : '0';
            newSelected[223] = isChecked ? '1' : '0';
            newSelected[224] = isChecked ? '1' : '0';
            newSelected[225] = isChecked ? '1' : '0';
            newSelected[226] = isChecked ? '1' : '0';
            newSelected[227] = isChecked ? '1' : '0';
            newSelected[228] = isChecked ? '1' : '0';
            newSelected[229] = isChecked ? '1' : '0';
            newSelected[230] = isChecked ? '1' : '0';
            newSelected[231] = isChecked ? '1' : '0';
            newSelected[232] = isChecked ? '1' : '0';
            newSelected[233] = isChecked ? '1' : '0';
            newSelected[234] = isChecked ? '1' : '0';
            newSelected[235] = isChecked ? '1' : '0';
            newSelected[236] = isChecked ? '1' : '0';
            newSelected[237] = isChecked ? '1' : '0';
            newSelected[238] = isChecked ? '1' : '0';
            newSelected[239] = isChecked ? '1' : '0';
            newSelected[240] = isChecked ? '1' : '0';
            newSelected[241] = isChecked ? '1' : '0';
        }
        if (id === 49){
            newSelected[50] = isChecked ? '1' : '0' ;
            newSelected[165] = isChecked ? '1' : '0' ;
            newSelected[166] = isChecked ? '1' : '0' ;
            newSelected[167] = isChecked ? '1' : '0' ;
        }
        if (id === 84){
            newSelected[85] = isChecked ? '1' : '0' ;
            newSelected[87] = isChecked ? '1' : '0' ;
            newSelected[88] = isChecked ? '1' : '0' ;
            newSelected[89] = isChecked ? '1' : '0' ;
            newSelected[90] = isChecked ? '1' : '0' ;
            newSelected[91] = isChecked ? '1' : '0' ;
        }
        if (id === 92){
            newSelected[93] = isChecked ? '1' : '0' ;
            newSelected[308] = isChecked ? '1' : '0' ;
            newSelected[313] = isChecked ? '1' : '0' ;
            newSelected[94] = isChecked ? '1' : '0' ;
            newSelected[265] = isChecked ? '1' : '0' ;
        }
        if (id === 96){
            newSelected[97] = isChecked ? '1' : '0' ;
            newSelected[190] = isChecked ? '1' : '0' ;
            newSelected[191] = isChecked ? '1' : '0' ;
            newSelected[192] = isChecked ? '1' : '0' ;
            newSelected[193] = isChecked ? '1' : '0' ;
            newSelected[209] = isChecked ? '1' : '0' ;
            newSelected[263] = isChecked ? '1' : '0' ;
            newSelected[98] = isChecked ? '1' : '0' ;
        }
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