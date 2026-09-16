import {Button, Form, Input, message, Space, Spin} from "antd";
import {buildTree} from "@/utils/OpenTool";
import {qxTree} from "@/constants/qxMenu";
import {useState} from "react";
import {history,connect,useNavigate} from "umi";
import TypeMenu from "@/ModelTypes/TypeMenu";
import {StaticInfo} from "@/StaticInfo";
const tailLayout = {
    wrapperCol: { offset: 4 },
};
let qxList=StaticInfo.uqx;
let authArr =qxList.split('').map(Number)
const AddRole=(props)=>{
    const [form] = Form.useForm();
    const navigate=useNavigate();
    const [spinning,setspinning]=useState(false);
    const treeData = buildTree(qxTree);
    const [selected, setSelected] = useState<string[]>(Array(595).fill('0'));
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
            newSelected[350] = isChecked ? '1' : '0';
            newSelected[373] = isChecked ? '1' : '0';
            newSelected[374] = isChecked ? '1' : '0';
        }
        if (id === 13) {
            newSelected[253] = '1';
            newSelected[10] = '1';
            newSelected[176] = '1';
            newSelected[254] = isChecked ? '1' : '0';
            newSelected[168] =  '1' ;
            newSelected[351] = isChecked ? '1' : '0';
            newSelected[352] = isChecked ? '1' : '0';
            newSelected[353] = isChecked ? '1' : '0';
            newSelected[354] = isChecked ? '1' : '0';
        }
        if (id === 254) {
            newSelected[176] = '1';
            newSelected[13] = '1';
            newSelected[253] = '1';
            newSelected[168] = '1';
        }
        if (id===352){
            newSelected[176] = '1';
        }
        if (id===353){
            newSelected[253] = '1';
        }
        if (id===354){
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
            newSelected[351] = isChecked ? '1' : '0';
            newSelected[352] = isChecked ? '1' : '0';
            newSelected[353] = isChecked ? '1' : '0';
            newSelected[354] = isChecked ? '1' : '0';
            newSelected[375] = isChecked ? '1' : '0';
            newSelected[433] = isChecked ? '1' : '0';
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
            newSelected[346] = isChecked ? '1' : '0';
            newSelected[256] = '1';
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
            newSelected[446] = '1';
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
            newSelected[387] = isChecked ? '1' : '0';
            newSelected[388] = isChecked ? '1' : '0';
            newSelected[389] = isChecked ? '1' : '0';
            newSelected[390] = isChecked ? '1' : '0';
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
            newSelected[579] = isChecked ? '1' : '0';
            newSelected[580] = isChecked ? '1' : '0';
            newSelected[581] = isChecked ? '1' : '0';
            newSelected[582] = isChecked ? '1' : '0';
            newSelected[583] = isChecked ? '1' : '0';
            newSelected[584] = isChecked ? '1' : '0';
            newSelected[585] = isChecked ? '1' : '0';
            newSelected[586] = isChecked ? '1' : '0';
            newSelected[587] = isChecked ? '1' : '0';
            newSelected[588] = isChecked ? '1' : '0';
            newSelected[589] = isChecked ? '1' : '0';
            newSelected[590] = isChecked ? '1' : '0';
            newSelected[591] = isChecked ? '1' : '0';
            newSelected[592] = isChecked ? '1' : '0';
            newSelected[593] = isChecked ? '1' : '0';
            newSelected[594] = isChecked ? '1' : '0';
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
            newSelected[434] = isChecked ? '1' : '0';
        }
        if (id === 50){
            newSelected[165] = isChecked ? '1' : '0';
            newSelected[166] = isChecked ? '1' : '0';
            newSelected[167] = isChecked ? '1' : '0';
        }
        if (id === 51){
            newSelected[260] = isChecked ? '1' : '0';
            newSelected[261] = isChecked ? '1' : '0';
            newSelected[262] = isChecked ? '1' : '0';
            newSelected[258] = '1';
            newSelected[256] = '1';
        }
        if (id === 52){
            newSelected[268] = isChecked ? '1' : '0';
            newSelected[269] = isChecked ? '1' : '0';
            newSelected[270] = isChecked ? '1' : '0';
            newSelected[271] = isChecked ? '1' : '0';
            newSelected[298] = isChecked ? '1' : '0';
            newSelected[404] = isChecked ? '1' : '0';
            newSelected[403] = isChecked ? '1' : '0';
            newSelected[402] = isChecked ? '1' : '0';
            newSelected[401] = isChecked ? '1' : '0';
            newSelected[214] = '1';
            newSelected[256] = '1';
        }
        if (id === 53){
            newSelected[272] = isChecked ? '1' : '0';
            newSelected[273] = isChecked ? '1' : '0';
            newSelected[274] = isChecked ? '1' : '0';
            newSelected[275] = isChecked ? '1' : '0';
            newSelected[431] = isChecked ? '1' : '0';
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
            newSelected[376] = isChecked ? '1' : '0';
            newSelected[145] = '1';
            newSelected[149] = '1';
            newSelected[157] = '1';
            newSelected[161] = '1';
            newSelected[400] = '1';
        }
        if (id === 54){
            newSelected[276] = isChecked ? '1' : '0';
            newSelected[400] = isChecked ? '1' : '0';
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
            newSelected[376] = isChecked ? '1' : '0';
            newSelected[446] = isChecked ? '1' : '0';
            newSelected[468] = isChecked ? '1' : '0';
            newSelected[469] = isChecked ? '1' : '0';
            newSelected[470] = isChecked ? '1' : '0';
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
            newSelected[376] = isChecked ? '1' : '0';
        }
        if (id === 57){
            newSelected[58] = isChecked ? '1' : '0';
            newSelected[59] = isChecked ? '1' : '0';
            newSelected[60] = isChecked ? '1' : '0';
            newSelected[61] = isChecked ? '1' : '0';
            newSelected[62] = isChecked ? '1' : '0';
            newSelected[63] = isChecked ? '1' : '0';
            newSelected[64] = isChecked ? '1' : '0';
            newSelected[347] = isChecked ? '1' : '0';
            newSelected[348] = isChecked ? '1' : '0';
            newSelected[349] = isChecked ? '1' : '0';
            newSelected[357] = isChecked ? '1' : '0';
            newSelected[355] = isChecked ? '1' : '0';
            newSelected[259] = isChecked ? '1' : '0';
            newSelected[362] = isChecked ? '1' : '0';
            newSelected[377] = isChecked ? '1' : '0';
            newSelected[378] = isChecked ? '1' : '0';
            newSelected[379] = isChecked ? '1' : '0';
            newSelected[380] = isChecked ? '1' : '0';
            newSelected[381] = isChecked ? '1' : '0';
            newSelected[382] = isChecked ? '1' : '0';
            newSelected[383] = isChecked ? '1' : '0';
            newSelected[392] = isChecked ? '1' : '0';
            newSelected[386] = isChecked ? '1' : '0';
            newSelected[393] = isChecked ? '1' : '0';
            newSelected[394] = isChecked ? '1' : '0';
            newSelected[400] = isChecked ? '1' : '0';
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
            newSelected[356] = isChecked ? '1' : '0';
            newSelected[358] = isChecked ? '1' : '0' ;
            newSelected[359] = isChecked ? '1' : '0' ;
            newSelected[372] = isChecked ? '1' : '0' ;
            newSelected[405] = isChecked ? '1' : '0' ;
            newSelected[157] = '1' ;
            newSelected[357] = '1' ;
            newSelected[58] = '1' ;
            newSelected[400] = '1' ;
            newSelected[59] = '1' ;
            newSelected[60] = '1' ;
            newSelected[61] = '1' ;
            newSelected[355] = '1' ;
            newSelected[324] = '1' ;
            newSelected[347] = '1' ;

        }
        if (id === 62){
            newSelected[259] = '1' ;
        }
        if (id === 372){
            newSelected[157] = '1' ;
            newSelected[357] = '1' ;
            newSelected[58] = '1' ;
            newSelected[59] = '1' ;
            newSelected[60] = '1' ;
            newSelected[61] = '1' ;
            newSelected[355] = '1' ;
            newSelected[324] = '1' ;
            newSelected[347] = '1' ;
        }
        if (id === 66){
            newSelected[284] = isChecked ? '1' : '0' ;
            newSelected[356] = isChecked ? '1' : '0' ;
            newSelected[357] = isChecked ? '1' : '0' ;
            newSelected[359] = isChecked ? '1' : '0' ;
            newSelected[358] = isChecked ? '1' : '0' ;
            newSelected[157] = '1' ;
            newSelected[357] = '1' ;
            newSelected[58] = '1' ;
            newSelected[400] = '1' ;
            newSelected[59] = '1' ;
            newSelected[60] = '1' ;
            newSelected[61] = '1' ;
            newSelected[355] = '1' ;
            newSelected[324] = '1' ;
            newSelected[347] = '1' ;
        }
        if (id === 330) {
            newSelected[256] ='1';
        }
        if (id === 71){
            newSelected[72] = isChecked ? '1' : '0';
            newSelected[187] = isChecked ? '1' : '0';
            newSelected[185] =  '1';
            newSelected[264] =  isChecked ? '1' : '0';
            newSelected[73] =  isChecked ? '1' : '0';
            newSelected[202] =  isChecked ? '1' : '0';
            newSelected[198] =  '1' ;
            newSelected[387] =  '1' ;
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
            newSelected[256] =  '1' ;
            newSelected[221] =  '1' ;
            newSelected[222] =  '1' ;
            newSelected[223] =  '1' ;
            newSelected[224] =  '1' ;
            newSelected[145] =  '1' ;
            newSelected[149] =  '1' ;
            newSelected[157] =  '1' ;
            newSelected[161] =  '1' ;
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
            newSelected[413] =  isChecked ? '1' : '0' ;
            newSelected[438] =  isChecked ? '1' : '0' ;
            newSelected[437] =  isChecked ? '1' : '0' ;
            newSelected[436] =  isChecked ? '1' : '0' ;
            newSelected[435] =  isChecked ? '1' : '0' ;
        }
        if (id === 438){
            newSelected[437] =  isChecked ? '1' : '0' ;
            newSelected[436] =  isChecked ? '1' : '0' ;
            newSelected[435] =  isChecked ? '1' : '0' ;
        }
        if (id === 77){
            newSelected[80] = isChecked ? '1' : '0';
            newSelected[81] = isChecked ? '1' : '0';
            newSelected[363] = isChecked ? '1' : '0';
            newSelected[364] = isChecked ? '1' : '0';
            newSelected[365] = isChecked ? '1' : '0';
            newSelected[366] = isChecked ? '1' : '0';
            newSelected[370] = isChecked ? '1' : '0';
            newSelected[367] = isChecked ? '1' : '0';
            newSelected[368] = isChecked ? '1' : '0';
            newSelected[369] = isChecked ? '1' : '0';
            newSelected[371] = isChecked ? '1' : '0';
        }
        if (id === 80){
            newSelected[363] = isChecked ? '1' : '0';
            newSelected[364] = isChecked ? '1' : '0';
            newSelected[365] = isChecked ? '1' : '0';
            newSelected[366] = isChecked ? '1' : '0';
            newSelected[370] = isChecked ? '1' : '0';
        }
        if (id === 81){
            newSelected[371] = isChecked ? '1' : '0';
            newSelected[369] = isChecked ? '1' : '0';
            newSelected[368] = isChecked ? '1' : '0';
            newSelected[367] = isChecked ? '1' : '0';

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
            newSelected[387] = isChecked ? '1' : '0';
            newSelected[388] = isChecked ? '1' : '0';
            newSelected[389] = isChecked ? '1' : '0';
            newSelected[390] = isChecked ? '1' : '0';
            newSelected[439] = isChecked ? '1' : '0';
            newSelected[440] = isChecked ? '1' : '0';
            newSelected[446] = isChecked ? '1' : '0';
        }
        if (id === 439){
            newSelected[440] = isChecked ? '1' : '0';
        }
        if (id === 49){
            newSelected[50] = isChecked ? '1' : '0' ;
            newSelected[165] = isChecked ? '1' : '0' ;
            newSelected[166] = isChecked ? '1' : '0' ;
            newSelected[167] = isChecked ? '1' : '0' ;
            newSelected[260] = isChecked ? '1' : '0';
            newSelected[261] = isChecked ? '1' : '0';
            newSelected[262] = isChecked ? '1' : '0';
            newSelected[51] = isChecked ? '1' : '0';
            newSelected[268] = isChecked ? '1' : '0';
            newSelected[269] = isChecked ? '1' : '0';
            newSelected[270] = isChecked ? '1' : '0';
            newSelected[271] = isChecked ? '1' : '0';
            newSelected[298] = isChecked ? '1' : '0';
            newSelected[52] = isChecked ? '1' : '0';
            newSelected[214] = '1';
            newSelected[272] = isChecked ? '1' : '0';
            newSelected[273] = isChecked ? '1' : '0';
            newSelected[274] = isChecked ? '1' : '0';
            newSelected[275] = isChecked ? '1' : '0';
            newSelected[53] = isChecked ? '1' : '0';
            newSelected[404] = isChecked ? '1' : '0';
            newSelected[401] = isChecked ? '1' : '0';
            newSelected[402] = isChecked ? '1' : '0';
            newSelected[403] = isChecked ? '1' : '0';
            newSelected[83] = isChecked ? '1' : '0';
            newSelected[414] = isChecked ? '1' : '0';
            newSelected[415] = isChecked ? '1' : '0';
            newSelected[416] = isChecked ? '1' : '0';
            newSelected[417] = isChecked ? '1' : '0';
            newSelected[420] = isChecked ? '1' : '0';
            newSelected[418] = isChecked ? '1' : '0';
            newSelected[419] = isChecked ? '1' : '0';
            newSelected[421] = isChecked ? '1' : '0';
            newSelected[422] = isChecked ? '1' : '0';
            newSelected[423] = isChecked ? '1' : '0';
            newSelected[424] = isChecked ? '1' : '0';
            newSelected[425] = isChecked ? '1' : '0';
            newSelected[399] = isChecked ? '1' : '0';
            newSelected[426] = isChecked ? '1' : '0';
            newSelected[427] = isChecked ? '1' : '0';
            newSelected[428] = isChecked ? '1' : '0';
            newSelected[429] = isChecked ? '1' : '0';
            newSelected[430] = isChecked ? '1' : '0';
            newSelected[431] = isChecked ? '1' : '0';
            newSelected[256] = '1';
        }
        if (id === 426){
            newSelected[256] = '1';
            newSelected[427] = isChecked ? '1' : '0' ;
            newSelected[428] = isChecked ? '1' : '0' ;
            newSelected[429] = isChecked ? '1' : '0' ;
            newSelected[430] = isChecked ? '1' : '0' ;
        }
        if (id === 83){
            newSelected[256] = '1';
            newSelected[404] = '1';
            newSelected[414] = isChecked ? '1' : '0' ;
            newSelected[415] = isChecked ? '1' : '0' ;
            newSelected[416] = isChecked ? '1' : '0' ;
            newSelected[417] = isChecked ? '1' : '0' ;
            newSelected[418] = isChecked ? '1' : '0' ;
            newSelected[419] = isChecked ? '1' : '0' ;
            newSelected[420] = isChecked ? '1' : '0' ;
        }
        if (id === 399){
            newSelected[421] = isChecked ? '1' : '0' ;
            newSelected[422] = isChecked ? '1' : '0' ;
            newSelected[423] = isChecked ? '1' : '0' ;
            newSelected[424] = isChecked ? '1' : '0' ;
            newSelected[425] = isChecked ? '1' : '0' ;
            newSelected[256] = '1';

        }
        if (id === 404){
            newSelected[402] = isChecked ? '1' : '0' ;
            newSelected[401] = isChecked ? '1' : '0' ;
            newSelected[403] = isChecked ? '1' : '0' ;
        }
        if (id === 84){
            newSelected[85] = isChecked ? '1' : '0' ;
            newSelected[87] = isChecked ? '1' : '0' ;
            newSelected[88] = isChecked ? '1' : '0' ;
            newSelected[89] = isChecked ? '1' : '0' ;
            newSelected[90] = isChecked ? '1' : '0' ;
            newSelected[91] = isChecked ? '1' : '0' ;
            newSelected[311] = isChecked ? '1' : '0' ;
            newSelected[384] = isChecked ? '1' : '0' ;
            newSelected[385] = isChecked ? '1' : '0' ;
            newSelected[406] = isChecked ? '1' : '0' ;
        }
        if (id === 92){
            newSelected[93] = isChecked ? '1' : '0' ;
            newSelected[308] = isChecked ? '1' : '0' ;
            newSelected[313] = isChecked ? '1' : '0' ;
            newSelected[94] = isChecked ? '1' : '0' ;
            newSelected[264] = isChecked ? '1' : '0' ;
            newSelected[185] = isChecked ? '1' : '0' ;
        }
        if (id === 94){
            newSelected[185] = isChecked ? '1' : '0' ;
            newSelected[264] = isChecked ? '1' : '0' ;
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
            newSelected[304] = isChecked ? '1' : '0' ;
            newSelected[305] = isChecked ? '1' : '0' ;
            newSelected[306] = isChecked ? '1' : '0' ;
            newSelected[307] = isChecked ? '1' : '0' ;
        }
        if (id === 2){
            newSelected[1] = '1';
            newSelected[118] = isChecked ? '1' : '0' ;
            newSelected[119] = isChecked ? '1' : '0' ;
            newSelected[373] = isChecked ? '1' : '0' ;
            newSelected[374] = isChecked ? '1' : '0' ;
        }
        if (id === 3){
            newSelected[1] = '1';
            newSelected[315] = isChecked ? '1' : '0' ;
            newSelected[317] = isChecked ? '1' : '0' ;
        }
        if (id === 5){
            newSelected[1] = '1';
            newSelected[300] = isChecked ? '1' : '0' ;
            newSelected[301] = isChecked ? '1' : '0' ;
            newSelected[302] = isChecked ? '1' : '0' ;
            newSelected[303] = isChecked ? '1' : '0' ;
        }
        if (id === 7){
            newSelected[1] = '1';
            newSelected[318] = isChecked ? '1' : '0' ;
        }
        if (id === 46){
            newSelected[45] = '1';
            newSelected[285] = isChecked ? '1' : '0' ;
        }
        if (id === 47){
            newSelected[45] = '1';
            newSelected[344] = isChecked ? '1' : '0' ;
        }
        if (id === 48){
            newSelected[45] = '1';
            newSelected[335] = isChecked ? '1' : '0' ;
            newSelected[334] = isChecked ? '1' : '0' ;
            newSelected[332] = isChecked ? '1' : '0' ;
            newSelected[333] = isChecked ? '1' : '0' ;
            newSelected[434] = isChecked ? '1' : '0' ;
        }
        if (id === 82){
            newSelected[83] = isChecked ? '1' : '0';
        }
        if (id === 101){
            newSelected[102] = isChecked ? '1' : '0' ;
            newSelected[103] = isChecked ? '1' : '0' ;
            newSelected[144] = isChecked ? '1' : '0' ;
            newSelected[297] = isChecked ? '1' : '0' ;
            newSelected[319] = isChecked ? '1' : '0' ;
            newSelected[320] = isChecked ? '1' : '0' ;
            newSelected[412] = isChecked ? '1' : '0' ;
            newSelected[64] ='1';
        }
        if (id === 319){
            newSelected[320] = isChecked ? '1' : '0' ;
            newSelected[64] ='1';
        }
        if (id === 104){
            newSelected[105] = isChecked ? '1' : '0' ;
            newSelected[106] = isChecked ? '1' : '0' ;
            newSelected[107] = isChecked ? '1' : '0' ;
            newSelected[314] = isChecked ? '1' : '0' ;
            newSelected[391] = isChecked ? '1' : '0' ;
            newSelected[432] = isChecked ? '1' : '0' ;
        }
        if (id === 107){
            newSelected[314] = isChecked ? '1' : '0' ;
            newSelected[391] = isChecked ? '1' : '0' ;
            newSelected[432] = isChecked ? '1' : '0' ;
        }
        if (id === 108){
            newSelected[109] = isChecked ? '1' : '0' ;
            newSelected[120] = isChecked ? '1' : '0' ;
            newSelected[121] = isChecked ? '1' : '0' ;
            newSelected[122] = isChecked ? '1' : '0' ;
            newSelected[110] = isChecked ? '1' : '0' ;
            newSelected[111] = isChecked ? '1' : '0' ;
            newSelected[112] = isChecked ? '1' : '0' ;
            newSelected[210] = isChecked ? '1' : '0' ;
            newSelected[211] = isChecked ? '1' : '0' ;
            newSelected[212] = isChecked ? '1' : '0' ;
            newSelected[126] = isChecked ? '1' : '0' ;
            newSelected[127] = isChecked ? '1' : '0' ;
            newSelected[128] = isChecked ? '1' : '0' ;
            newSelected[129] = isChecked ? '1' : '0' ;
            newSelected[130] = isChecked ? '1' : '0' ;
            newSelected[131] = isChecked ? '1' : '0' ;
            newSelected[132] = isChecked ? '1' : '0' ;
            newSelected[133] = isChecked ? '1' : '0' ;
            newSelected[134] = isChecked ? '1' : '0' ;
            newSelected[135] = isChecked ? '1' : '0' ;
            newSelected[136] = isChecked ? '1' : '0' ;
            newSelected[137] = isChecked ? '1' : '0' ;
            newSelected[123] = isChecked ? '1' : '0' ;
            newSelected[124] = isChecked ? '1' : '0' ;
            newSelected[125] = isChecked ? '1' : '0' ;
            newSelected[115] = isChecked ? '1' : '0' ;
            newSelected[116] = isChecked ? '1' : '0' ;
            newSelected[117] = isChecked ? '1' : '0' ;
            newSelected[277] = isChecked ? '1' : '0' ;
            newSelected[278] = isChecked ? '1' : '0' ;
            newSelected[279] = isChecked ? '1' : '0' ;
            newSelected[280] = isChecked ? '1' : '0' ;
            newSelected[281] = isChecked ? '1' : '0' ;
            newSelected[282] = isChecked ? '1' : '0' ;
            newSelected[283] = isChecked ? '1' : '0' ;
            newSelected[141] = isChecked ? '1' : '0' ;
            newSelected[142] = isChecked ? '1' : '0' ;
            newSelected[143] = isChecked ? '1' : '0' ;
            newSelected[138] = isChecked ? '1' : '0' ;
            newSelected[139] = isChecked ? '1' : '0' ;
            newSelected[140] = isChecked ? '1' : '0' ;
            newSelected[345] = isChecked ? '1' : '0' ;
        }
        if (id === 113){
            newSelected[114] = isChecked ? '1' : '0' ;
            newSelected[214] = isChecked ? '1' : '0' ;
            newSelected[215] = isChecked ? '1' : '0' ;
            newSelected[216] = isChecked ? '1' : '0' ;
            newSelected[217] = isChecked ? '1' : '0' ;
            newSelected[218] = isChecked ? '1' : '0' ;
            newSelected[295] = isChecked ? '1' : '0' ;
            newSelected[292] = isChecked ? '1' : '0' ;
            newSelected[293] = isChecked ? '1' : '0' ;
            newSelected[294] = isChecked ? '1' : '0' ;
            newSelected[360] = isChecked ? '1' : '0' ;
            newSelected[361] = isChecked ? '1' : '0' ;
            newSelected[407] = isChecked ? '1' : '0' ;
            newSelected[411] = isChecked ? '1' : '0' ;
            newSelected[408] = isChecked ? '1' : '0' ;
            newSelected[409] = isChecked ? '1' : '0' ;
            newSelected[410] = isChecked ? '1' : '0' ;
        }
        if (id === 12){
            newSelected[258] = isChecked ? '1' : '0' ;
            newSelected[299] = isChecked ? '1' : '0' ;
            newSelected[375] = isChecked ? '1' : '0' ;
        }
        if (id === 14){
            newSelected[256] = isChecked ? '1' : '0' ;
        }
        if (id === 27){
            newSelected[309] = isChecked ? '1' : '0' ;
            newSelected[311] = isChecked ? '1' : '0' ;
        }
        if (id === 28){
            newSelected[310] = isChecked ? '1' : '0' ;
            newSelected[312] = isChecked ? '1' : '0' ;
        }
        if (id === 37){
            newSelected[243] = isChecked ? '1' : '0' ;
            newSelected[244] = isChecked ? '1' : '0' ;
            newSelected[245] = isChecked ? '1' : '0' ;
        }
        if (id === 246){
            newSelected[247] = isChecked ? '1' : '0' ;
            newSelected[248] = isChecked ? '1' : '0' ;
            newSelected[249] = isChecked ? '1' : '0' ;
            newSelected[37] = '1';
        }
        if (id === 219){
            newSelected[225] = isChecked ? '1' : '0' ;
            newSelected[226] = isChecked ? '1' : '0' ;
            newSelected[228] = isChecked ? '1' : '0' ;
        }
        if (id === 220){
            newSelected[227] = isChecked ? '1' : '0' ;
            newSelected[229] = isChecked ? '1' : '0' ;
        }
        if (id === 221){
            newSelected[230] = isChecked ? '1' : '0' ;
            newSelected[231] = isChecked ? '1' : '0' ;
            newSelected[232] = isChecked ? '1' : '0' ;
        }
        if (id === 222){
            newSelected[233] = isChecked ? '1' : '0' ;
            newSelected[234] = isChecked ? '1' : '0' ;
            newSelected[235] = isChecked ? '1' : '0' ;
        }
        if (id === 223){
            newSelected[236] = isChecked ? '1' : '0' ;
            newSelected[237] = isChecked ? '1' : '0' ;
            newSelected[238] = isChecked ? '1' : '0' ;
        }
        if (id === 224){
            newSelected[239] = isChecked ? '1' : '0' ;
            newSelected[240] = isChecked ? '1' : '0' ;
            newSelected[241] = isChecked ? '1' : '0' ;
        }
        if (id === 161){
            newSelected[162] = isChecked ? '1' : '0' ;
            newSelected[163] = isChecked ? '1' : '0' ;
            newSelected[164] = isChecked ? '1' : '0' ;
        }
        if (id === 58){
            newSelected[377] = isChecked ? '1' : '0' ;
        }
        if (id === 59){
            newSelected[378] = isChecked ? '1' : '0' ;
            newSelected[386] = isChecked ? '1' : '0' ;
            newSelected[392] = isChecked ? '1' : '0' ;
        }
        if (id === 60){
            newSelected[379] = isChecked ? '1' : '0' ;
        }
        if (id === 61){
            newSelected[380] = isChecked ? '1' : '0' ;
        }
        if (id === 62){
            newSelected[381] = isChecked ? '1' : '0' ;
            newSelected[259] =  '1' ;
        }
        if (id === 63){
            newSelected[394] = isChecked ? '1' : '0' ;
            newSelected[259] =  '1' ;
        }
        if (id === 348){
            newSelected[357] = isChecked ? '1' : '0' ;
        }
        if (id === 347){
            newSelected[393] = isChecked ? '1' : '0' ;
        }
        if (id === 349){
            newSelected[355] = isChecked ? '1' : '0' ;
            newSelected[382] = isChecked ? '1' : '0' ;
        }
        if (id === 362){
            newSelected[383] = isChecked ? '1' : '0' ;
        }
        if (id === 70){
            newSelected[316] = isChecked ? '1' : '0' ;
        }
        if (id === 259){
            newSelected[405] = isChecked ? '1' : '0' ;
        }
        if (id === 76){
            newSelected[286] = isChecked ? '1' : '0' ;
            newSelected[287] = isChecked ? '1' : '0' ;
            newSelected[288] = isChecked ? '1' : '0' ;
            newSelected[289] = isChecked ? '1' : '0' ;
            newSelected[290] = isChecked ? '1' : '0' ;
            newSelected[291] = isChecked ? '1' : '0' ;
        }
        if (id === 321){
            newSelected[322] = isChecked ? '1' : '0' ;
            newSelected[323] = isChecked ? '1' : '0' ;
        }
        if (id === 330){
            newSelected[336] = isChecked ? '1' : '0' ;
            newSelected[337] = isChecked ? '1' : '0' ;
            newSelected[338] = isChecked ? '1' : '0' ;
            newSelected[339] = isChecked ? '1' : '0' ;
            newSelected[340] = isChecked ? '1' : '0' ;
            newSelected[413] = isChecked ? '1' : '0' ;
        }
        if (id === 420){
            newSelected[418] = isChecked ? '1' : '0' ;
            newSelected[419] = isChecked ? '1' : '0' ;
        }
        if (id === 85){
            newSelected[384] = isChecked ? '1' : '0' ;
        }
        if (id === 87){
            newSelected[385] = isChecked ? '1' : '0' ;
        }
        if (id === 91){
            newSelected[406] = isChecked ? '1' : '0' ;
        }
        if (id === 93){
            newSelected[308] = isChecked ? '1' : '0' ;
            newSelected[313] = isChecked ? '1' : '0' ;
        }
        if (id === 94){
            newSelected[308] = isChecked ? '1' : '0' ;
            newSelected[264] = isChecked ? '1' : '0' ;
            newSelected[185] =  '1';
        }
        if (id === 97){
            newSelected[190] = isChecked ? '1' : '0' ;
            newSelected[191] = isChecked ? '1' : '0' ;
            newSelected[192] = isChecked ? '1' : '0' ;
            newSelected[193] = isChecked ? '1' : '0' ;
            newSelected[209] = isChecked ? '1' : '0' ;
            newSelected[263] = isChecked ? '1' : '0' ;
        }
        if (id === 98){
            newSelected[304] = isChecked ? '1' : '0' ;
            newSelected[305] = isChecked ? '1' : '0' ;
            newSelected[306] = isChecked ? '1' : '0' ;
            newSelected[307] = isChecked ? '1' : '0' ;
            newSelected[190] =  '1' ;
        }
        if (id === 102){
            newSelected[297] = isChecked ? '1' : '0' ;
        }
        if (id === 103){
            newSelected[144] = isChecked ? '1' : '0' ;
            newSelected[412] = isChecked ? '1' : '0' ;
        }
        if (id === 109){
            newSelected[120] = isChecked ? '1' : '0' ;
            newSelected[121] = isChecked ? '1' : '0' ;
            newSelected[122] = isChecked ? '1' : '0' ;
        }
        if (id === 110){
            newSelected[123] = isChecked ? '1' : '0' ;
            newSelected[124] = isChecked ? '1' : '0' ;
            newSelected[125] = isChecked ? '1' : '0' ;
            newSelected[210] = '1';
            newSelected[211] = '1';
            newSelected[212] = '1';
        }
        if (id === 111){
            newSelected[126] = isChecked ? '1' : '0' ;
            newSelected[127] = isChecked ? '1' : '0' ;
            newSelected[128] = isChecked ? '1' : '0' ;
            newSelected[110] = '1';
            newSelected[210] = '1';
            newSelected[211] = '1';
            newSelected[212] = '1';
        }
        if (id === 112){
            newSelected[210] = isChecked ? '1' : '0' ;
            newSelected[211] = isChecked ? '1' : '0' ;
            newSelected[212] = isChecked ? '1' : '0' ;
            newSelected[129] = isChecked ? '1' : '0' ;
            newSelected[130] = isChecked ? '1' : '0' ;
            newSelected[131] = isChecked ? '1' : '0' ;
            newSelected[132] = isChecked ? '1' : '0' ;
            newSelected[133] = isChecked ? '1' : '0' ;
            newSelected[134] = isChecked ? '1' : '0' ;
            newSelected[135] = isChecked ? '1' : '0' ;
            newSelected[136] = isChecked ? '1' : '0' ;
            newSelected[137] = isChecked ? '1' : '0' ;
            newSelected[110] ='1';
        }
        if (id === 115){
            newSelected[278] = isChecked ? '1' : '0' ;
            newSelected[279] = isChecked ? '1' : '0' ;
            newSelected[280] = isChecked ? '1' : '0' ;
        }
        if (id === 116){
            newSelected[281] = isChecked ? '1' : '0' ;
            newSelected[282] = isChecked ? '1' : '0' ;
            newSelected[283] = isChecked ? '1' : '0' ;
        }
        if (id === 117){
            newSelected[141] = isChecked ? '1' : '0' ;
            newSelected[142] = isChecked ? '1' : '0' ;
            newSelected[143] = isChecked ? '1' : '0' ;
        }
        if (id === 277){
            newSelected[138] = isChecked ? '1' : '0' ;
            newSelected[139] = isChecked ? '1' : '0' ;
            newSelected[140] = isChecked ? '1' : '0' ;
        }
        if (id === 114){
            newSelected[215] = isChecked ? '1' : '0' ;
            newSelected[216] = isChecked ? '1' : '0' ;
            newSelected[217] = isChecked ? '1' : '0' ;
            newSelected[218] = isChecked ? '1' : '0' ;
            newSelected[407] = isChecked ? '1' : '0' ;
            newSelected[295] = '1';
        }
        if (id === 295){
            newSelected[292] = isChecked ? '1' : '0' ;
            newSelected[293] = isChecked ? '1' : '0' ;
            newSelected[294] = isChecked ? '1' : '0' ;
        }
        if (id === 360){
            newSelected[361] = isChecked ? '1' : '0' ;
        }
        if (id === 411){
            newSelected[408] = isChecked ? '1' : '0' ;
            newSelected[409] = isChecked ? '1' : '0' ;
            newSelected[410] = isChecked ? '1' : '0' ;
        }
        if (id === 441){
            newSelected[442] = isChecked ? '1' : '0' ;
            newSelected[444] = isChecked ? '1' : '0' ;
            newSelected[445] = isChecked ? '1' : '0' ;
            newSelected[452] = isChecked ? '1' : '0' ;
            newSelected[446] = isChecked ? '1' : '0' ;
            newSelected[448] = isChecked ? '1' : '0' ;
            newSelected[449] = isChecked ? '1' : '0' ;
            newSelected[450] = isChecked ? '1' : '0' ;
            newSelected[451] = isChecked ? '1' : '0' ;
            newSelected[447] = isChecked ? '1' : '0' ;
            newSelected[456] = isChecked ? '1' : '0' ;
            newSelected[457] = isChecked ? '1' : '0' ;
            newSelected[458] = isChecked ? '1' : '0' ;
            newSelected[459] = isChecked ? '1' : '0' ;
            newSelected[460] = isChecked ? '1' : '0' ;
            newSelected[461] = isChecked ? '1' : '0' ;
            newSelected[462] = isChecked ? '1' : '0' ;
            newSelected[463] = isChecked ? '1' : '0' ;
            newSelected[464] = isChecked ? '1' : '0' ;
            newSelected[465] = isChecked ? '1' : '0' ;
            newSelected[466] = isChecked ? '1' : '0' ;
            newSelected[467] = isChecked ? '1' : '0' ;
            newSelected[468] = isChecked ? '1' : '0' ;
            newSelected[443] = isChecked ? '1' : '0' ;
            newSelected[453] = isChecked ? '1' : '0' ;
            newSelected[454] = isChecked ? '1' : '0' ;
            newSelected[455] = isChecked ? '1' : '0' ;
            newSelected[456] = isChecked ? '1' : '0' ;
            newSelected[457] = isChecked ? '1' : '0' ;
            newSelected[458] = isChecked ? '1' : '0' ;
            newSelected[459] = isChecked ? '1' : '0' ;
            newSelected[469] = isChecked ? '1' : '0' ;
            newSelected[470] = isChecked ? '1' : '0' ;
            newSelected[471] = isChecked ? '1' : '0' ;
            newSelected[472] = isChecked ? '1' : '0' ;
            newSelected[473] = isChecked ? '1' : '0' ;
            newSelected[474] = isChecked ? '1' : '0' ;
            newSelected[475] = isChecked ? '1' : '0' ;
            newSelected[476] = isChecked ? '1' : '0' ;
            newSelected[477] = isChecked ? '1' : '0' ;
            newSelected[478] = isChecked ? '1' : '0' ;
            newSelected[479] = isChecked ? '1' : '0' ;
            newSelected[480] = isChecked ? '1' : '0' ;
            newSelected[481] = isChecked ? '1' : '0' ;
            newSelected[482] = isChecked ? '1' : '0' ;
            newSelected[483] =  '1'  ;
            newSelected[484] = isChecked ? '1' : '0' ;
            newSelected[485] = isChecked ? '1' : '0' ;
            newSelected[486] = isChecked ? '1' : '0' ;
            newSelected[487] = isChecked ? '1' : '0' ;
            newSelected[488] = isChecked ? '1' : '0' ;
            newSelected[489] = isChecked ? '1' : '0' ;
            newSelected[490] = isChecked ? '1' : '0' ;
            newSelected[491] = isChecked ? '1' : '0' ;
            newSelected[492] = '1'  ;
            newSelected[493] = isChecked ? '1' : '0' ;
            newSelected[494] = isChecked ? '1' : '0' ;
            newSelected[495] =  '1'  ;
            newSelected[496] =  '1'  ;
            newSelected[497] = isChecked ? '1' : '0' ;
            newSelected[498] =  '1'  ;
            newSelected[500] = isChecked ? '1' : '0' ;
            newSelected[501] = isChecked ? '1' : '0' ;
            newSelected[502] =  '1'  ;
            newSelected[503] = isChecked ? '1' : '0' ;
            newSelected[504] = isChecked ? '1' : '0' ;
            newSelected[505] = isChecked ? '1' : '0' ;
            newSelected[506] = isChecked ? '1' : '0' ;
            newSelected[507] = isChecked ? '1' : '0' ;
            newSelected[508] = isChecked ? '1' : '0' ;
            newSelected[509] = isChecked ? '1' : '0' ;
            newSelected[510] = isChecked ? '1' : '0' ;
            newSelected[511] = isChecked ? '1' : '0' ;
            newSelected[512] = isChecked ? '1' : '0' ;
            newSelected[513] = isChecked ? '1' : '0' ;
            newSelected[514] = isChecked ? '1' : '0' ;
            newSelected[515] = isChecked ? '1' : '0' ;
            newSelected[516] = isChecked ? '1' : '0' ;
            newSelected[517] = isChecked ? '1' : '0' ;
            newSelected[518] = isChecked ? '1' : '0' ;
            newSelected[519] =  '1'  ;
            newSelected[520] =  '1'  ;
            newSelected[521] = isChecked ? '1' : '0' ;
            newSelected[522] = isChecked ? '1' : '0' ;
            newSelected[523] = isChecked ? '1' : '0' ;
            newSelected[524] = isChecked ? '1' : '0' ;
            newSelected[525] = isChecked ? '1' : '0' ;
            newSelected[526] = isChecked ? '1' : '0' ;
            newSelected[527] = isChecked ? '1' : '0' ;
            newSelected[528] = isChecked ? '1' : '0' ;
            newSelected[529] = isChecked ? '1' : '0' ;
            newSelected[530] = isChecked ? '1' : '0' ;
            newSelected[531] = isChecked ? '1' : '0' ;
            newSelected[532] = isChecked ? '1' : '0' ;
            newSelected[533] = isChecked ? '1' : '0' ;
            newSelected[534] = isChecked ? '1' : '0' ;
            newSelected[535] = isChecked ? '1' : '0' ;
            newSelected[536] = isChecked ? '1' : '0' ;
            newSelected[537] = isChecked ? '1' : '0' ;
            newSelected[538] = isChecked ? '1' : '0' ;
            newSelected[539] = isChecked ? '1' : '0' ;
            newSelected[540] = isChecked ? '1' : '0' ;
            newSelected[541] = isChecked ? '1' : '0' ;
            newSelected[542] = isChecked ? '1' : '0' ;
            newSelected[543] =  '1'  ;
            newSelected[258] =  '1'  ;
            newSelected[11] =  '1'  ;
            newSelected[544] = isChecked ? '1' : '0' ;
            newSelected[545] = isChecked ? '1' : '0' ;
            newSelected[546] = isChecked ? '1' : '0' ;
            newSelected[547] = isChecked ? '1' : '0' ;
            newSelected[548] = isChecked ? '1' : '0' ;
            newSelected[549] = isChecked ? '1' : '0' ;
            newSelected[550] = isChecked ? '1' : '0' ;
            newSelected[551] = isChecked ? '1' : '0' ;
            newSelected[552] = isChecked ? '1' : '0' ;
            newSelected[553] = isChecked ? '1' : '0' ;
            newSelected[554] = isChecked ? '1' : '0' ;
            newSelected[555] = isChecked ? '1' : '0' ;
            newSelected[556] = isChecked ? '1' : '0' ;
            newSelected[557] = isChecked ? '1' : '0' ;
            newSelected[558] = isChecked ? '1' : '0' ;
            newSelected[559] = isChecked ? '1' : '0' ;
            newSelected[560] = isChecked ? '1' : '0' ;
            newSelected[561] = isChecked ? '1' : '0' ;
            newSelected[562] = isChecked ? '1' : '0' ;
            newSelected[567] = isChecked ? '1' : '0' ;
            newSelected[568] = isChecked ? '1' : '0' ;
            newSelected[569] = isChecked ? '1' : '0' ;
        }
        if (id === 442){
            newSelected[464] = isChecked ? '1' : '0' ;
            newSelected[465] = isChecked ? '1' : '0' ;
            newSelected[466] = isChecked ? '1' : '0' ;
            newSelected[467] = isChecked ? '1' : '0' ;
            newSelected[460] = isChecked ? '1' : '0' ;
            newSelected[461] = isChecked ? '1' : '0' ;
            newSelected[462] = isChecked ? '1' : '0' ;
            newSelected[463] = isChecked ? '1' : '0' ;
            newSelected[456] = isChecked ? '1' : '0' ;
            newSelected[457] = isChecked ? '1' : '0' ;
            newSelected[458] = isChecked ? '1' : '0' ;
            newSelected[459] = isChecked ? '1' : '0' ;
            newSelected[475] = isChecked ? '1' : '0' ;
            newSelected[476] = isChecked ? '1' : '0' ;
            newSelected[477] = isChecked ? '1' : '0' ;
            newSelected[478] = isChecked ? '1' : '0' ;
            newSelected[471] = isChecked ? '1' : '0' ;
            newSelected[472] = isChecked ? '1' : '0' ;
            newSelected[473] = isChecked ? '1' : '0' ;
            newSelected[474] = isChecked ? '1' : '0' ;
            newSelected[545] = isChecked ? '1' : '0' ;
            newSelected[546] = isChecked ? '1' : '0' ;
            newSelected[547] = isChecked ? '1' : '0' ;
            newSelected[548] = isChecked ? '1' : '0' ;
        }
        if (id === 464){
            newSelected[465] = isChecked ? '1' : '0' ;
            newSelected[466] = isChecked ? '1' : '0' ;
            newSelected[467] = isChecked ? '1' : '0' ;
        }
        if (id === 460){
            newSelected[461] = isChecked ? '1' : '0' ;
            newSelected[462] = isChecked ? '1' : '0' ;
            newSelected[463] = isChecked ? '1' : '0' ;
        }
        if (id === 456){
            newSelected[457] = isChecked ? '1' : '0' ;
            newSelected[458] = isChecked ? '1' : '0' ;
            newSelected[459] = isChecked ? '1' : '0' ;
        }
        if (id === 475){
            newSelected[476] = isChecked ? '1' : '0' ;
            newSelected[477] = isChecked ? '1' : '0' ;
            newSelected[478] = isChecked ? '1' : '0' ;
        }
        if (id === 471){
            newSelected[472] = isChecked ? '1' : '0' ;
            newSelected[473] = isChecked ? '1' : '0' ;
            newSelected[474] = isChecked ? '1' : '0' ;
        }
        if (id === 545){
            newSelected[546] = isChecked ? '1' : '0' ;
            newSelected[547] = isChecked ? '1' : '0' ;
            newSelected[548] = isChecked ? '1' : '0' ;
        }
        if (id === 443){
            newSelected[453] = isChecked ? '1' : '0' ;
            newSelected[454] = isChecked ? '1' : '0' ;
            newSelected[455] = isChecked ? '1' : '0' ;
        }
        if (id === 444){
            newSelected[491] = isChecked ? '1' : '0' ;
            newSelected[492] ='1' ;
            newSelected[488] ='1' ;
            newSelected[493] = isChecked ? '1' : '0' ;
            newSelected[494] = isChecked ? '1' : '0' ;
            newSelected[497] = isChecked ? '1' : '0' ;
            newSelected[500] = isChecked ? '1' : '0' ;
            newSelected[501] = isChecked ? '1' : '0' ;
            newSelected[496] ='1' ;
            newSelected[502] ='1' ;
            newSelected[498] ='1' ;
            newSelected[503] = isChecked ? '1' : '0' ;
            newSelected[504] = isChecked ? '1' : '0' ;
            newSelected[505] = isChecked ? '1' : '0' ;
            newSelected[506] = isChecked ? '1' : '0' ;
            newSelected[507] = isChecked ? '1' : '0' ;
            newSelected[508] = isChecked ? '1' : '0' ;
            newSelected[509] = isChecked ? '1' : '0' ;
            newSelected[510] = isChecked ? '1' : '0' ;
            newSelected[511] = isChecked ? '1' : '0' ;
            newSelected[512] = isChecked ? '1' : '0' ;
            newSelected[513] = isChecked ? '1' : '0' ;
            newSelected[514] = isChecked ? '1' : '0' ;
        }
        if (id === 491){
            newSelected[492] ='1' ;
            newSelected[498] ='1' ;
            newSelected[488] ='1' ;
            newSelected[493] = isChecked ? '1' : '0' ;
            newSelected[494] = isChecked ? '1' : '0' ;
            newSelected[497] = isChecked ? '1' : '0' ;
        }
        if (id === 500){
            newSelected[501] = isChecked ? '1' : '0' ;
            newSelected[502] ='1' ;
        }
        if (id === 503){
            newSelected[504] = isChecked ? '1' : '0' ;
            newSelected[505] = isChecked ? '1' : '0' ;
            newSelected[506] = isChecked ? '1' : '0' ;
            newSelected[498] ='1' ;
            newSelected[488] ='1' ;
        }
        if (id === 507){
            newSelected[508] = isChecked ? '1' : '0' ;
            newSelected[502] ='1' ;
        }
        if (id === 509){
            newSelected[498] ='1' ;
            newSelected[488] ='1' ;
            newSelected[510] = isChecked ? '1' : '0' ;
            newSelected[511] = isChecked ? '1' : '0' ;
            newSelected[512] = isChecked ? '1' : '0' ;
        }
        if (id === 513){
            newSelected[514] = isChecked ? '1' : '0' ;
            newSelected[502] ='1' ;
        }
        if (id === 447){
            newSelected[443] ='1' ;
            newSelected[483] ='1' ;
            newSelected[479] = isChecked ? '1' : '0' ;
            newSelected[480] = isChecked ? '1' : '0' ;
            newSelected[481] = isChecked ? '1' : '0' ;
            newSelected[482] = isChecked ? '1' : '0' ;
            newSelected[485] = isChecked ? '1' : '0' ;
            newSelected[484] = isChecked ? '1' : '0' ;
            newSelected[486] = isChecked ? '1' : '0' ;
            newSelected[487] = isChecked ? '1' : '0' ;
            newSelected[489] = isChecked ? '1' : '0' ;
            newSelected[490] = isChecked ? '1' : '0' ;
            newSelected[567] = isChecked ? '1' : '0' ;
            newSelected[568] = isChecked ? '1' : '0' ;
            newSelected[569] = isChecked ? '1' : '0' ;
            newSelected[570] = isChecked ? '1' : '0' ;
            newSelected[571] = isChecked ? '1' : '0' ;
            newSelected[572] = isChecked ? '1' : '0' ;
            newSelected[573] = isChecked ? '1' : '0' ;
            newSelected[574] = isChecked ? '1' : '0' ;
            newSelected[575] = isChecked ? '1' : '0' ;
            newSelected[576] = isChecked ? '1' : '0' ;
            newSelected[577] = isChecked ? '1' : '0' ;
            newSelected[578] = isChecked ? '1' : '0' ;
        }
        if (id === 445){
            newSelected[526] = isChecked ? '1' : '0' ;
            newSelected[527] = isChecked ? '1' : '0' ;
            newSelected[528] = isChecked ? '1' : '0' ;
            newSelected[529] = isChecked ? '1' : '0' ;
            newSelected[530] = isChecked ? '1' : '0' ;
            newSelected[531] = isChecked ? '1' : '0' ;
            newSelected[532] = isChecked ? '1' : '0' ;
            newSelected[496] ='1' ;
            newSelected[498] ='1' ;
            newSelected[488] ='1' ;
            newSelected[258] =  '1' ;
            newSelected[11] =  '1' ;
        }
        if (id === 446){
            newSelected[468] = isChecked ? '1' : '0' ;
            newSelected[469] = isChecked ? '1' : '0' ;
            newSelected[470] = isChecked ? '1' : '0' ;
        }
        if (id === 448){
            newSelected[488] = isChecked ? '1' : '0' ;
            newSelected[533] = isChecked ? '1' : '0' ;
            newSelected[535] = isChecked ? '1' : '0' ;
            newSelected[536] = isChecked ? '1' : '0' ;
            newSelected[537] = isChecked ? '1' : '0' ;
            newSelected[538] = isChecked ? '1' : '0' ;
            newSelected[539] = isChecked ? '1' : '0' ;
            newSelected[534] = isChecked ? '1' : '0' ;
            newSelected[498] ='1' ;
            newSelected[496] ='1' ;
            newSelected[495] ='1' ;
            newSelected[502] ='1' ;
        }
        if (id === 533){
            newSelected[534] = isChecked ? '1' : '0' ;
            newSelected[535] = isChecked ? '1' : '0' ;
            newSelected[536] = isChecked ? '1' : '0' ;
            newSelected[498] ='1' ;
            newSelected[496] ='1' ;
            newSelected[495] ='1' ;
            newSelected[502] ='1' ;
        }
        if (id === 537){
            newSelected[538] = isChecked ? '1' : '0' ;
            newSelected[498] ='1' ;
            newSelected[496] ='1' ;
            newSelected[495] ='1' ;
            newSelected[502] ='1' ;
        }
        if (id === 449){
            newSelected[515] = isChecked ? '1' : '0' ;
            newSelected[516] = isChecked ? '1' : '0' ;
            newSelected[517] = isChecked ? '1' : '0' ;
            newSelected[518] = isChecked ? '1' : '0' ;
            newSelected[525] = isChecked ? '1' : '0' ;
            newSelected[521] = isChecked ? '1' : '0' ;
            newSelected[522] = isChecked ? '1' : '0' ;
            newSelected[523] = isChecked ? '1' : '0' ;
            newSelected[524] = isChecked ? '1' : '0' ;
            newSelected[519] ='1' ;
            newSelected[488] ='1' ;
            newSelected[520] ='1' ;
        }
        if (id === 537){
            newSelected[538] = isChecked ? '1' : '0' ;
            newSelected[498] ='1' ;
            newSelected[496] ='1' ;
            newSelected[495] ='1' ;
            newSelected[502] ='1' ;
            newSelected[488] ='1' ;
        }
        if (id === 515){
            newSelected[516] = isChecked ? '1' : '0' ;
            newSelected[517] = isChecked ? '1' : '0' ;
            newSelected[518] = isChecked ? '1' : '0' ;
            newSelected[519] ='1' ;
            newSelected[520] ='1' ;
            newSelected[488] ='1' ;
        }
        if (id === 450){
            newSelected[540] = isChecked ? '1' : '0' ;
            newSelected[541] = isChecked ? '1' : '0' ;
            newSelected[542] = isChecked ? '1' : '0' ;
            newSelected[544] = isChecked ? '1' : '0' ;
            newSelected[549] = isChecked ? '1' : '0' ;
            newSelected[550] = isChecked ? '1' : '0' ;
            newSelected[551] = isChecked ? '1' : '0' ;
            newSelected[560] = isChecked ? '1' : '0' ;
            newSelected[561] = isChecked ? '1' : '0' ;
            newSelected[483] ='1' ;
            newSelected[498] ='1' ;
            newSelected[543] ='1' ;
        }
        if (id === 540){
            newSelected[541] = isChecked ? '1' : '0' ;
            newSelected[483] ='1' ;
        }
        if (id === 542){
            newSelected[544] = isChecked ? '1' : '0' ;
            newSelected[543] ='1' ;
            newSelected[498] ='1' ;
        }
        if (id === 560){
            newSelected[561] = isChecked ? '1' : '0' ;
            newSelected[543] ='1' ;
            newSelected[498] ='1' ;
        }
        if (id === 451){
            newSelected[554] = isChecked ? '1' : '0' ;
            newSelected[555] = isChecked ? '1' : '0' ;
            newSelected[556] = isChecked ? '1' : '0' ;
            newSelected[557] = isChecked ? '1' : '0' ;
            newSelected[558] = isChecked ? '1' : '0' ;
            newSelected[559] = isChecked ? '1' : '0' ;
            newSelected[562] = isChecked ? '1' : '0' ;
            newSelected[360] = '1';
            newSelected[361] = '1';
        }
        if (id === 452){
            newSelected[552] = isChecked ? '1' : '0' ;
            newSelected[553] = isChecked ? '1' : '0' ;
        }
        // 设置新的选中状态
        setSelected(newSelected);
    };

    const onFinish= (values)=>{
        let authority=selected.join('');
        setspinning(true);
         props.dispatch({
            type:'Role/add',
            payload:{...values,authority}
        }).then((res)=>{
            if (res.ErrorCode==0){
                message.success('添加成功');
                history.push('/systemManage/role');
                setspinning(false);
            }else {
                setspinning(false);
                message.error(res.Data);
            }
         })
    };
    return(
        <Spin spinning={spinning}>
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
                    <Space>
                        <Button type="primary"  htmlType="submit">
                            添加
                        </Button>
                        <Button type="primary" onClick={()=>navigate(-1)}>
                            返回
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        </Spin>
    )
}
export default connect() (AddRole)