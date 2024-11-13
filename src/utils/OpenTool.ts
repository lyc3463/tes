import * as XLSX from 'xlsx';

import TypeMenu from "@/ModelTypes/TypeMenu";
import {qxTree} from "@/constants/qxMenu/index";

export  const phonePattern = /^1(3|4|5|6|7|8|9)\d{9}$/;
// 验证密码
export  const mmPattern =/^.{6,}$/;

// 过滤出符合Select组件的格式
export const filterAndUpdateList = <T>(
    // 在页面中使用                                                这个就是useState状态，会返回一个 [{label,value}] 这样的数组
    // 例： filterAndUpdateList(CompanList, 'company_name', 'id', setCompaniesList);
    value: T[], // 数组
    labelKey:string, // 要显示的名称
    valueKey:string,  // id
    setList: (list: { label: string; value: any }[]) => void  // 需要接收的状态
) => {
    if (value && value.length > 0) {
        let list = value.map((item: T) => {
            return {
                label: item[labelKey] as string,
                value: item[valueKey]
            };
        });
        setList(list);
    }
};

// 查找父级
export function buildTree(items: TypeMenu[]): TypeMenu[] {
    const map = new Map<number, TypeMenu>();
    items.forEach(item => {
        map.set(item.id, { ...item, children: [] });
    });
    items.forEach(item => {
        if (item.parentId !== undefined && map.has(item.parentId)) {
            map.get(item.parentId)!.children!.push(map.get(item.id)!);
        }
    });
    // 过滤出顶级节点
    return Array.from(map.values()).filter(item => item.parentId === undefined);
}


// 获取当前时间类型  yyyy-MM-DD
export function getCurrentDate() {
    const today = new Date();

    // 获取年份（四位数）
    let year = today.getFullYear();

    // 获取月份（0-11），因此加1并转为两位数
    let month = String(today.getMonth() + 1).padStart(2, '0');

    // 获取日期（1-31），并转为两位数
    let day = String(today.getDate()).padStart(2, '0');

    // 组合成日期字符串
    return `${year}-${month}-${day}`;
}


// 获取时差  传入的参数必须是 日期类型2024-09-01 10：00：00
export function getTimeDifference(inputTimeString) {
    // 将输入的字符串转换为Date对象
    const inputDate = new Date(inputTimeString);
    // 获取当前时间
    const now = new Date();

    // 计算时间差（毫秒）
    const diff = now - inputDate;
    // 转换时间差
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    // 构建并返回时间差字符串
    if (days > 0) {
        return `${days}天${hours}小时${minutes}分钟`;
    } else if (hours > 0) {
        return `${hours}小时${minutes}分钟`;
    } else {
        return `${minutes}分钟`;
    }
}

// 1到10的随机数
export function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}



// base64
export  const getBase64 = file =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = e => resolve(e.target.result);
        reader.onerror = error => reject(error);
    });


// 导出Excel
 export function exportDataToExcel(ws_data) {
    // 创建一个工作簿
    const wb = XLSX.utils.book_new();
     // 创建一个工作表
     const ws = XLSX.utils.aoa_to_sheet(ws_data);
     // 将工作表添加到工作簿
     XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

     // 生成Excel文件
     const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });

     // 触发下载
    function s2ab(s) {
        const buf = new ArrayBuffer(s.length);
        const view = new Uint8Array(buf);
        for (let i = 0; i < s.length; i++) {
            view[i] = s.charCodeAt(i) & 0xFF;
        }
        return buf;
    }

     const blob = new Blob([s2ab(wbout)], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8' });
     const url = URL.createObjectURL(blob);

    // 创建一个临时的a标签用于下载
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'exported_data.xlsx');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // 释放URL对象
    URL.revokeObjectURL(url);
}
// export  function filterPermissionsByString(str) {
//     // 将字符串转换为布尔数组，'1' 表示 true，'0' 表示 false
//     const hasPermission = str.split('').map(char => char === '1');
//
//     // 根据布尔数组过滤权限数组
//     return qxTree.filter((_, index) => hasPermission[index]).map(permission => permission.name);
// }
// export function findDifferences(arr1, arr2) {
//     const setId1 = new Set(arr1.map(item => item.id));
//     const setId2 = new Set(arr2.map(item => item.id));
//
//     // 找出在 setId1 中但不在 setId2 中的元素，并提取 name 属性
//     const diff1 = arr1.filter(item => !setId2.has(item.id)).map(item => item.name);
//     // 找出在 setId2 中但不在 setId1 中的元素，并提取 name 属性
//     const diff2 = arr2.filter(item => !setId1.has(item.id)).map(item => item.name);
//
//     // 合并两个差异数组并返回
//     return [...diff1, ...diff2];
// }
function getPermissionsFromArrayAndBinaryString(qxTreez, binaryString) {
    return binaryString.split('').map((bit, index) => bit === '1' ? qxTreez[index] : null).filter(perm => perm !== null);
}
export function findRemovedPermissions(oldBinaryString, newBinaryString) {
    // 获取旧权限和新权限的数组
    const oldPermissions = getPermissionsFromArrayAndBinaryString(qxTree, oldBinaryString);
    const newPermissionsArray = getPermissionsFromArrayAndBinaryString(qxTree, newBinaryString);
    // 创建一个新权限ID的Set以便快速查找
    const newPermissionsIds = new Set(newPermissionsArray.map(perm => perm.id));

    // 找出在旧权限中存在但在新权限中不存在的权限
    const removedPermissions = oldPermissions.filter(oldPerm => !newPermissionsIds.has(oldPerm.id));

    return removedPermissions;
}

export function ensureArrayLength(array, length, fillValue) {
    // 如果数组长度小于指定长度，则在末尾添加 fillValue 以达到指定长度
    while (array.length < length) {
        array.push(fillValue);
    }
    // 如果数组长度大于指定长度，则截断数组到指定长度
    if (array.length > length) {
        array.length = length;
    }
    return array;
}