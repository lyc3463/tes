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
export function findChangedPermissions(oldBinaryString, newBinaryString) {
    // 确保 qxTree 作为参数传递（如果它是必需的）
    const oldPermissions = getPermissionsFromArrayAndBinaryString(qxTree, oldBinaryString);
    const newPermissionsArray = getPermissionsFromArrayAndBinaryString(qxTree, newBinaryString);

    // 从新权限中提取ID集合
    const newPermissionsIds = new Set(
        newPermissionsArray
            .filter(perm => perm && perm.id !== undefined)
            .map(perm => perm.id)
    );

    // 找出在旧权限中存在但在新权限中不存在的权限（被移除的权限）
    const removedPermissions = oldPermissions
        .filter(oldPerm => oldPerm && oldPerm.id !== undefined && !newPermissionsIds.has(oldPerm.id));

    // 找出在新权限中存在但在旧权限中不存在的权限（被添加的权限）
    const addedPermissions = newPermissionsArray
        .filter(newPerm => newPerm && newPerm.id !== undefined && !oldPermissions.some(oldPerm => oldPerm.id === newPerm.id));

    // 返回被移除和被添加的权限
    return {
        removedPermissions,
        addedPermissions
    };
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

//当前月份总天数
export function getDaysInCurrentMonth() {
    // 创建一个表示当前日期的 Date 对象
    const currentDate = new Date();

    // 获取当前年份和月份
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1; // getMonth() 返回的是 0-11，所以要加 1

    // 创建一个表示下个月第一天的 Date 对象
    // 例如，如果当前日期是 2023-10-15，那么下个月的第一天是 2023-11-01
    const nextMonthFirstDay = new Date(currentYear, currentMonth, 1);

    // 获取上个月最后一天的日期（即当前月份的天数）
    // 例如，如果下个月第一天是 2023-11-01，那么上个月的最后一天是 2023-10-31
    // 减去一天，得到的就是当前月份的最后一天
    const lastDayOfCurrentMonth = new Date(nextMonthFirstDay - 1);

    // 返回当前月份的天数
    return lastDayOfCurrentMonth.getDate();
}

export function numberToRMB(n) {
    const fraction = ['角', '分'];  // 角分
    const digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];  // 数字
    const unit = ['', '拾', '佰', '仟', '万', '亿', '兆'];  // 单位
    const isNegative = n < 0;  // 判断是否为负数
    n = Math.abs(n);  // 获取绝对值

    let result = '';
    let parts = [];

    // 处理小数部分（角分），确保小数部分为两位
    let fractionPart = (n % 1).toFixed(2).slice(2); // 获取小数部分并确保两位
    if (fractionPart !== '00') {  // 如果小数部分有非零值，处理角分
        for (let i = 0; i < fractionPart.length; i++) {
            if (fractionPart[i] !== '0') {  // 只有当是非零值时，才拼接角分
                parts.push(digit[parseInt(fractionPart[i])] + fraction[i]);
            }
        }
    }

    // 处理整数部分
    let unitIndex = 0;
    let integerPart = Math.floor(n);
    while (integerPart > 0) {
        let section = integerPart % 10;
        if (section !== 0) {
            result = digit[section] + unit[unitIndex] + result;
        } else {
            // 连续的零只保留一个零
            if (result.charAt(0) !== '零') {
                result = '零' + result;
            }
        }
        integerPart = Math.floor(integerPart / 10);
        unitIndex++;
    }

    // 处理负数情况
    if (isNegative) {
        result = '负' + result;
    }

    // 拼接完整的人民币大写（圆替代元）
    result += '圆';  // 确保整数部分后面有“圆”而不是“元”
    result += parts.join(''); // 加上小数部分的“角分”

    // 如果小数部分为空，去掉“零”
    if (result.indexOf('零') > 0) {
        result = result.replace(/零/g, ''); // 可以根据需求保留或者删除零
    }

    return result;
}
