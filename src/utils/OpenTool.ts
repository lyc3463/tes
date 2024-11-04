import * as XLSX from 'xlsx';

import TypeMenu from "@/ModelTypes/TypeMenu";

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
