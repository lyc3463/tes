import * as XLSX from 'xlsx';
import TypeMenu from "@/ModelTypes/TypeMenu";
import {qxTree} from "@/constants/qxMenu/index";
import {message} from "antd";
import dayjs from "dayjs";
import isBetween from 'dayjs/plugin/isBetween'; // 引入插件
import Compressor from 'compressorjs';
import {StaticInfo} from "@/StaticInfo";
import {pinyin} from "pinyin-pro";

dayjs.extend(isBetween);
export  const phonePattern = /^1(3|4|5|6|7|8|9)\d{9}$/;

// export const pwdPattern=/^HXtz@\w{8}$/;
export const pwdPattern= /^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{6,}$/;


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

// 压缩图片
export async function compressBase64(base64: any) {
    if (!base64) return  ''
    const options = {
        quality: 0.8, // 压缩质量
        maxWidth: 700, // 最大宽度
        maxHeight: 350, // 最大高度
    };
    // 将 base64 转换为 Blob 对象
    const byteString = atob(base64.split(',')[1]);
    const mimeString = base64.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([ab], { type: mimeString });

    // 使用 Compressorjs 库进行压缩处理
    return new Promise((resolve, reject) => {
        new Compressor(blob, {
            ...options,
            success(result) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    const compressedDataUrl = e.target.result;
                    resolve(compressedDataUrl); // 返回压缩后的 base64 字符串
                };
                reader.readAsDataURL(result);
            },
            error(err) {
                console.error('压缩失败:', err.message);
                reject(err);
            },
        });
    });
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
        .filter(newPerm => newPerm && newPerm.id !== undefined &&!oldPermissions.some(oldPerm => oldPerm !== undefined && oldPerm.id === newPerm.id))    // 返回被移除和被添加的权限
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

// 数字转大写金额
// ... 已有代码 ...

// 数字转大写金额
// ... 已有代码 ...

// 数字转大写金额
// ... 已有代码 ...

// 数字转大写金额
export function numberToRMB(n) {
    if (n==0) return  '零圆整';
    const fraction = ['角', '分'];  // 角分
    const digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];  // 数字
    const unit = ['', '拾', '佰', '仟', '万', '拾万', '百万', '千万', '亿', '兆'];  // 单位
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
    let integerPart = Math.floor(n);
    let unitIndex = 0;
    let consecutiveZeros = 0; // 记录连续零的个数
    while (integerPart > 0) {
        const digitValue = integerPart % 10;
        if (digitValue !== 0) {
            // 处理连续零，只添加一个零
            if (consecutiveZeros > 0) {
                result = '零' + result;
            }
            result = digit[digitValue] + unit[unitIndex] + result;
            consecutiveZeros = 0;
        } else {
            consecutiveZeros++;
        }
        integerPart = Math.floor(integerPart / 10);
        unitIndex++;
    }
    // 处理万、亿等单位间的零
    result = result.replace(/零万/g, '万');
    result = result.replace(/零亿/g, '亿');
    result = result.replace(/亿万/g, '亿零');
    result = result.replace(/零+/g, '零');
    // 处理负数情况
    if (isNegative) {
        result = '负' + result;
    }
    // 拼接完整的人民币大写（圆替代元）
    if (result) {
        result += '圆';
    }
    result += parts.join('');
    if (!result) {
        result = '零圆整';
    } else if (parts.length === 0) {
        result += '整';
    }
    // 去除多余的零
    result = result.replace(/零圆/g, '圆');
    result = result.replace(/圆零角/g, '圆');
    result = result.replace(/零分/g, '');
    result = result.replace(/圆整/g, '圆整');
    return result;
}

// ... 已有代码 ...

// export  const addNewData = (data, endData) => {
//     const updatedData = [...data];
//     const finalEndTime = dayjs(endData);  // 转换为 dayjs 对象，方便日期比较
//     let bllo=true;
//     // 获取第一条数据的原始 beginTime 和 endTime
//     const firstItem = updatedData[0];
//     const firstBeginTime = dayjs(firstItem.beginTime);
//
//     // 处理第一条数据的结束时间
//     updatedData[0].endTime = firstBeginTime.add(1, 'year').format("YYYY-MM-DD");
//
//     // 遍历后续数据
//     for (let i = 1; i < updatedData.length; i++) {
//         const prevItem = updatedData[i - 1];
//         const prevEndTime = dayjs(prevItem.endTime);
//         // 第二条及之后数据的 beginTime 是上一条数据的 endTime + 1 天
//         const newBeginTime = prevEndTime.add(1, 'day');
//
//         // 判断是否超出传入的 endData 时间
//         const newEndTime = newBeginTime.add(1, 'year');  // 当前数据的结束时间是新 beginTime 加一年
//
//         if (newEndTime.isAfter(finalEndTime)) {
//             // 如果超出传入的结束时间，警告提示并将最后一条数据的 endTime 设置为传入的 endData
//             updatedData[i].endTime = finalEndTime.format("YYYY-MM-DD");
//
//         } else {
//             // 否则正常设置 endTime 为 newBeginTime 加一年
//             bllo=true;
//             updatedData[i].endTime = newEndTime.format("YYYY-MM-DD");
//         }
//
//         // 更新 beginTime
//         updatedData[i].beginTime = newBeginTime.format("YYYY-MM-DD");
//     }
//
//     // 强制将最后一条数据的 endTime 设置为传入的 endData
//     const lastItem = updatedData[updatedData.length - 1];
//     if (dayjs(lastItem.endTime).isBefore(finalEndTime)) {
//         lastItem.endTime = finalEndTime.format("YYYY-MM-DD");
//     }
//     console.log('updatedData',updatedData);
//     return {updatedData,bllo};
// };

export const addNewData = (data, endData) => {
    const updatedData = [...data];
    const finalEndTime = dayjs(endData); // 转换为 dayjs 对象

    // 处理第一项数据的结束时间
    const firstItem = updatedData[0];
    const firstBeginTime = dayjs(firstItem.beginTime);
    const firstEndTime = firstBeginTime.add(1, 'year').subtract(1, 'day'); // 加一年再减一天得到结束时间
    updatedData[0].endTime = firstEndTime.format("YYYY-MM-DD");

    // 遍历后续数据
    for (let i = 1; i < updatedData.length; i++) {
        const prevItem = updatedData[i - 1];
        const prevEndTime = dayjs(prevItem.endTime);
        const newBeginTime = prevEndTime.add(1, 'day'); // 下一天作为新的开始时间
        const newEndTime = newBeginTime.add(1, 'year').subtract(1, 'day'); // 开始时间加一年再减一天得到结束时间

        // 更新当前项的开始时间和结束时间
        updatedData[i].beginTime = newBeginTime.format("YYYY-MM-DD");
        updatedData[i].endTime = newEndTime.format("YYYY-MM-DD");

        // 检查是否超出传入的结束时间（理论上这里不应该超出，因为我们是在循环内部计算的）
        // 但为了保险起见，我们还是保留这个检查
        if (dayjs(newEndTime).isAfter(finalEndTime)) {
            console.warn(`Warning: ${newEndTime.format("YYYY-MM-DD")} is after the final end time ${finalEndTime.format("YYYY-MM-DD")}. Adjusting.`);
            // 如果超出（理论上不应该发生），则调整结束时间为finalEndTime
            updatedData[i].endTime = finalEndTime.format("YYYY-MM-DD");
            // 可能还需要调整开始时间以保持时间间隔的一致性，但这里我们假设不需要
        }
    }

    // 因为我们是在循环内部计算的，且已经考虑了不超过finalEndTime。
    // 但为了完全符合您的要求（尽管在逻辑上可能是多余的），我们还是再次检查。
    const lastItem = updatedData[updatedData.length - 1];
    const lastEndTime = dayjs(lastItem.endTime);
    if (lastEndTime.isBefore(finalEndTime)) {
        // 如果最后一项的结束时间早于传入的结束时间（理论上不应该发生，除非有额外的逻辑修改），则调整。
        // 但根据我们的计算逻辑，这里不会发生，因为我们在循环中已经确保了不超过finalEndTime。
        // 保留这个检查是为了防止未来可能的逻辑变更导致的错误。
        console.warn(`Unexpected: ${lastEndTime.format("YYYY-MM-DD")} is before the final end time ${finalEndTime.format("YYYY-MM-DD")}. Adjusting.`);
        lastItem.endTime = finalEndTime.format("YYYY-MM-DD");
    } else if (lastEndTime.isAfter(finalEndTime)) {
        // 同样，这个条件在当前的逻辑下也不会发生，因为我们在循环中已经处理过了。
        // 保留这个else if是为了展示完整的检查逻辑。
        console.error(`Error: This should not happen. ${lastEndTime.format("YYYY-MM-DD")} is after the final end time ${finalEndTime.format("YYYY-MM-DD")}.`);
    }

    // 返回更新后的数据和一个标志（虽然在这个函数里bllo似乎没有实际用途）
    return { updatedData, bllo: true }; // 注意：bllo始终为true，可能需要重新考虑其用途或移除
};

export const removeLastData = (data) => {
    const updatedData = [...data];  // 创建一个副本，避免直接修改原数组

    // 删除最后一项数据
    updatedData.pop();

    // 获取原数组中删除的最后一项的结束时间
    const lastEndTime = data[data.length - 1].endTime;

    // 如果新的数组不为空，将新的最后一项的结束时间设置为原最后一项的结束时间
    if (updatedData.length > 0) {
        updatedData[updatedData.length - 1].endTime = lastEndTime;
    }

    return updatedData;
};

export const checkEndTime = (data, endData) => {
    let istrue;
    const lastItem = data[data.length - 1];  // 获取最后一条数据
    const lastBeginTime = dayjs(lastItem.beginTime);  // 将最后一条的beginTime转为dayjs对象

    // 计算最后一条数据的结束时间（即beginTime加一年）
    const lastEndTime = lastBeginTime.add(1, 'year');

    // 转换传入的结束时间为dayjs对象
    const finalEndTime = dayjs(endData);

    // 判断最后的结束时间是否大于或等于传入的结束时间
    if (lastEndTime.isAfter(finalEndTime, 'day') || lastEndTime.isSame(finalEndTime, 'day')) {
        istrue = false;  // 如果lastEndTime >= finalEndTime，返回false
    } else {
        istrue = true;   // 否则返回true
    }
    return istrue;
};

// function formatDate(date) {
//     let year = date.getFullYear();
//     let month = String(date.getMonth() + 1).padStart(2, '0'); // 月份从0开始，需要加1
//     let day = String(date.getDate()).padStart(2, '0');
//     return `${year}-${month}-${day}`;
// }

// 拆分租赁日
export const splitDataByEndTimeAndRentPeriod = (data, endData) => {
    console.log("传入的时间",data);
    const result = []; // 存储拆分后的数据
    const finalEndTime = dayjs(endData); // 传入的结束时间
    // 获取原始数据的最后一条记录
    const lastItem = data[data.length - 1];
    let beginTime = dayjs(lastItem.beginTime); // 最后一条数据的开始时间
    let endTime = dayjs(lastItem.endTime); // 最后一条数据的结束时间
    let rentBeginTime = lastItem.rentBeginTime ? dayjs(lastItem.rentBeginTime) : null; // 最后一条数据的免租期开始时间
    let rentEndTime = lastItem.rentEndTime ? dayjs(lastItem.rentEndTime) : null; // 最后一条数据的免租期结束时间
    const incremental = lastItem.incremental; // 获取最后一条数据的incremental值
    // 处理跨年数据
    const newItems = [];

    // 如果结束时间超过传入的结束时间，就限制为传入的结束时间
    if (finalEndTime.isBefore(endTime)) {
        endTime = finalEndTime;
    }

    // 拆分数据：直到结束时间为止，按年拆分
    while (endTime.diff(beginTime, 'year') >= 1) {
        const newEndTime = beginTime.add(1, 'year'); // 生成新的结束时间
        const newItem = {
            ...lastItem,
            incremental,
            beginTime: beginTime.format('YYYY-MM-DD'),
            endTime: newEndTime.format('YYYY-MM-DD')
        };

        // 处理免租期
        if (rentBeginTime && rentEndTime) {
            if (rentBeginTime.isBetween(beginTime, newEndTime, null, '[]') && rentEndTime.isBetween(beginTime, newEndTime, null, '[]')) {
                newItem.rentBeginTime = rentBeginTime.format('YYYY-MM-DD');
                newItem.rentEndTime = rentEndTime.format('YYYY-MM-DD');
            } else {
                newItem.rentBeginTime = null;
                newItem.rentEndTime = null;
            }
        }

        newItems.push(newItem); // 将拆分后的数据放入 newItems 数组
        beginTime = newEndTime.add(1, 'day'); // 更新开始时间，准备拆分下一年
    }

    // 处理最后一段数据
    const lastSegment = {
        ...lastItem,
        incremental,
        beginTime: beginTime.format('YYYY-MM-DD'),
        endTime: endTime.format('YYYY-MM-DD')
    };

    // 处理免租期
    if (rentBeginTime && rentEndTime) {
        if (rentBeginTime.isBetween(beginTime, endTime, null, '[]') && rentEndTime.isBetween(beginTime, endTime, null, '[]')) {
            lastSegment.rentBeginTime = rentBeginTime.format('YYYY-MM-DD');
            lastSegment.rentEndTime = rentEndTime.format('YYYY-MM-DD');
        } else {
            lastSegment.rentBeginTime = null;
            lastSegment.rentEndTime = null;
        }
    }
    newItems.push(lastSegment); // 将最后一条数据加入到结果

    // 将处理过的 data 中的其他项（除了最后一条）添加到结果中
    result.push(...data.slice(0, data.length - 1)); // 保持前面的数据不变

    // 合并拆分后的数据和未拆分的前面数据
    return [...result, ...newItems];
};
export  const calculateTimePeriods = (start, end,zuMy) => {
    const periods = [];
    let currentStart = dayjs(start);
    const finalEnd = dayjs(end);
    let index = 0;
    while (currentStart.isBefore(finalEnd)) {
        // 下一个周期的结束时间是一年后，但不能超过总结束时间
        let nextEnd = currentStart.add(1, "year").subtract(1,'day');
        if (nextEnd.isAfter(finalEnd)) {
            nextEnd = finalEnd; // 最后一个周期不足一年
        }
        periods.push({
            id:index,
            beginTime: currentStart.format("YYYY-MM-DD"),
            endTime: nextEnd.format("YYYY-MM-DD"),
            rentBeginTime:null,
            rentEndTime:null,
            incremental:0,
            zuMoney:zuMy
        });
        index++;// 更新索引
        // currentStart = nextEnd;
        // 更新下一个周期的开始时间
        currentStart = nextEnd.add(1, "day");
    }
    return periods;
};

// 算出开始时间跟结束时间相差多少年
export function calculateDateDifference(date1, date2) {
    // 将字符串转换为Date对象
    const d1 = new Date(date1);
    const d2 = new Date(date2);

    // 获取年份
    const year1 = d1.getFullYear();
    const year2 = d2.getFullYear();

    // 初始化年份和月份差异
    let yearsDifference = year2 - year1;
    let monthsDifference = 0;

    // 重置第二个日期到同年同月同日的d1，然后计算剩余的月份差异
    d2.setFullYear(year1); // 将d2的年份设置为d1的年份
    if (d2 > d1) {
        // 如果调整年份后的d2仍然在d1之后，说明d2在同年的晚些时候
        // 计算月份差异（注意：月份是从0开始的，所以要+1来显示）
        monthsDifference = (d2.getMonth() - d1.getMonth()) + ((d2.getDate() - d1.getDate()) / d1.getDaysInMonth()) || 1; // 这里需要处理日期差异导致的非整月情况，但getDaysInMonth不是标准方法，需要自定义或近似处理
        // 由于上面的计算可能不准确（特别是当跨月且有不同天数时），我们可以采用更简单但可能稍不准确的方法：
        // 直接比较两个日期在同一年内的天数差，然后转换为月份（这里假设每个月30天为近似值）
        // monthsDifference = Math.round(((d2 - d1) / (1000 * 60 * 60 * 24)) / 30); // 更简单但不准确的方法

        // 更准确的方法：逐月比较直到找到差异
        let currentMonth = d1.getMonth();
        let currentDay = d1.getDate();
        while (currentMonth < 12 && (new Date(year1, currentMonth + 1, 0).getDate() < currentDay || (new Date(year1, currentMonth + 1, 0).getDate() === currentDay && new Date(year1, currentMonth + 1, currentDay) < d2))) {
            currentMonth++;
            currentDay = Math.min(currentDay, new Date(year1, currentMonth + 1, 0).getDate()); // 更新currentDay以防跨月时天数不同
            monthsDifference++;
        }
        // 如果最后currentDay仍然小于d2的日期，说明还需要加上剩余的天数转换的月份部分（这里可以简化处理为不足一月按一月算）
        if (new Date(year1, currentMonth, currentDay) < d2) {
            monthsDifference++;
        }

        // 由于我们已经计算了月份差异，所以年份差异可能需要减去（如果d2在同年的早些时候则不需要，但这里我们确保只计算整年+月份差异）
        // 但实际上，由于我们是从d1开始逐年减少到d2的年份来检查的，所以yearsDifference已经是整年差异了
        // 如果d2在同年的晚些时候且有月份差异，我们只需要保留monthsDifference即可
        // 如果要调整逻辑以确保yearsDifference是“最多”的整年数，可以添加以下检查（但在这个案例中不需要）：
        // if (monthsDifference >= 12) { yearsDifference++; monthsDifference -= 12; } // 但这样处理通常不符合我们的需求，因为我们想要分开表示年和月
    }
    // 注意：上面的逻辑已经处理了大部分情况，但在某些极端情况下（如跨闰年）可能需要更精细的处理

    // 由于我们想要的是“整年+剩余月份”的格式，所以不需要调整yearsDifference来减去monthsDifference导致的额外年数

    // 返回结果（可以根据需要格式化为字符串）
    return { years: yearsDifference, months: monthsDifference };
}


// 计算出所有免租期天数
// export function calculateTotalRentalDays(rentalPeriods) {
//     return rentalPeriods.reduce((totalDays, period) => {
//         const begin = new Date(period.rentBeginTime);
//         const end = new Date(period.rentEndTime);
//         const oneDay = 24 * 60 * 60 * 1000; // 一天的毫秒数
//         const daysInPeriod = Math.ceil((end - begin+1) / oneDay); // 计算天数并向上取整以确保包含整天
//         return totalDays + daysInPeriod;
//     }, 0);
// }
// 计算出所有免租期天数
export function calculateTotalRentalDays(rentalPeriods) {
    return rentalPeriods.reduce((totalDays, period) => {
        const begin = period.rentBeginTime ? new Date(period.rentBeginTime) : null;
        const end = period.rentEndTime ? new Date(period.rentEndTime) : null;

        // 如果begin或end为null，则忽略该时间段
        if (!begin || !end) {
            return totalDays; // 不增加天数
        }
        const oneDay = 24 * 60 * 60 * 1000; // 一天的毫秒数
        // 注意：这里不需要+1，因为我们是在计算两个日期之间的完整天数
        const daysInPeriod = Math.ceil((end - begin+1) / oneDay); // 计算天数并向上取整

        return totalDays + daysInPeriod;
    }, 0);
}
export const calculateYearDifference = (startTime, endTime) => {
    const start = dayjs(startTime);  // 转换为 dayjs 对象
    const end = dayjs(endTime);  // 转换为 dayjs 对象
    // 计算年份差
    let yearDiff = end.diff(start, 'year');
    // 检查是否有剩余的天数，如果有剩余天数，则算作 1 年
    const remainingDays = end.diff(start.add(yearDiff, 'year'), 'day');
    if (remainingDays > 0) {
        yearDiff += 1;  // 如果有剩余的天数，增加 1 年
    }
    return yearDiff;
};
export function replaceEnglishCommasWithChinese(input) {
    // 检查输入是否为字符串
    if (typeof input !== 'string') {
        // 如果不是字符串，则直接返回原始输入
        return input;
    }
    // 如果是字符串，则使用replace方法和正则表达式替换所有英文逗号为中文逗号
    return input.replace(/,/g, '，');
}


// 过滤单元名字  例如:[{"id": 2,"unit_name": "301",},{"id": 1,"unit_name": "123"}],[1] 返回123
export function getUnitNamesByIds(data, ids) {
    // 使用filter方法过滤数组，然后使用map方法提取unit_name
    const matchingUnitNames = data
        .filter(item => ids.includes(item.id))
        .map(item => item.unit_name);

    // 使用join方法将数组转换为逗号分隔的字符串
    return matchingUnitNames.join(',');
}
// 过滤单元类型
// export function getUnitNamesByIds(data, ids) {
//     // 使用filter方法过滤数组，然后使用map方法提取unit_name
//     const matchingUnitNames = data
//         .filter(item => ids.includes(item.id))
//         .map(item => item.unit_name);
//
//     // 使用join方法将数组转换为逗号分隔的字符串
//     return matchingUnitNames.join(',');
// }
// 过滤客户名字  例如:[{"id": 2,"custom_name": "301",},{"id": 1,"custom_name": "123"}],[1] 返回123
export function getUserNamesById(data, id) {
    // 使用filter方法筛选出与给定ID匹配的对象，然后使用map方法提取user_name
    return data
        .filter(item => item.id === id) // 注意这里使用===来确保类型匹配（number与number）
        .map(item => item.custom_name);
}
// 过滤单元类型用途
export function getunitTypeById(data, id) {
    // 使用filter方法筛选出与给定ID匹配的对象，然后使用map方法提取user_name
    return data
        .filter(item => item.id === id) // 注意这里使用===来确保类型匹配（number与number）
        .map(item => item.unit_type);
}
// 过滤客户乙方
export function getUseraddNameById(data, id) {
    // 使用filter方法筛选出与给定ID匹配的对象，然后使用map方法提取user_name
    return data
        .filter(item => item.id === id) // 注意这里使用===来确保类型匹配（number与number）
        .map(item => item.company_name);
}
// 过滤客户乙方地址
export function getUseraddRessById(data, id) {
    // 使用filter方法筛选出与给定ID匹配的对象，然后使用map方法提取user_name
    return data
        .filter(item => item.id === id) // 注意这里使用===来确保类型匹配（number与number）
        .map(item => item.office_area);
}

// 过滤客户手机号
export function getUserphoneById(data, id) {
    // 使用filter方法筛选出与给定ID匹配的对象，然后使用map方法提取user_name
    return data
        .filter(item => item.id === id) // 注意这里使用===来确保类型匹配（number与number）
        .map(item => item.custom_phone);
}
// 裁剪数据
export function cropDateStringToYearMonth(dateString) {
    // 检查字符串中是否包含至少一个 '-' 字符
    if (dateString.indexOf('-') === -1) {
        // 如果没有 '-'，则直接返回原字符串
        return dateString;
    }

    // 尝试按 '-' 分割字符串，并获取前两个部分（年和月）
    const parts = dateString.split('-');
    if (parts.length < 2) {
        // 如果分割后得到的数组长度小于2，也直接返回原字符串
        // 这种情况理论上不应该发生，除非传入的字符串非常特殊（例如只包含一个 '-'）
        return dateString;
    }

    // 返回年和月组成的字符串
    return `${parts[0]}-${parts[1]}`;
}

// 计算出来开始时间跟结束相差多少年
export function calculateYearsAndMonthsBetween(date1, date2) {
    const startDate = new Date(date1);
    const endDate = new Date(date2);

    // 检查日期是否有效
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        return null; // 无效日期
    }

    // 初始年份差
    let yearsDifference = endDate.getFullYear() - startDate.getFullYear();
    let monthsDifference = endDate.getMonth() - startDate.getMonth();

    // 调整月份差
    if (monthsDifference < 0) {
        yearsDifference -= 1; // 未满整年，减去一年
        monthsDifference += 12;
    }

    // 如果结束日期比开始日期的“天”小，说明还差几天满一年
    if (endDate.getDate() < startDate.getDate()) {
        monthsDifference -= 1; // 减去一个月
        if (monthsDifference < 0) {
            yearsDifference -= 1;
            monthsDifference += 12;
        }
    }

    // 特殊逻辑：如果结束日期在差几天就满一年的范围内（例如2025-01-30 vs 2024-01-31），将其视为一年
    if (yearsDifference === 0 && monthsDifference === 11 && endDate.getDate() >= startDate.getDate()) {
        yearsDifference = 1; // 将其视为满一年
        monthsDifference = 0;
    }

    return { years: yearsDifference, months: monthsDifference };
}

// 过滤录入财务数据
export function processBills(data) {
    const bills = data;
    // 分离bill_status为0和1的账单
    const pendingBills = bills.filter(bill => bill.bill_status === 0);
    const otherBills = bills.filter(bill => bill.bill_status === 1);

    // 按account_id分组待处理的账单
    const groupedBills = {};
    pendingBills.reverse();

    pendingBills.forEach(bill => {
        if (!groupedBills[bill.account_id]) {
            groupedBills[bill.account_id] = [];
        }
        groupedBills[bill.account_id].push(bill);
    });

    // 对每个账户进行处理
    for (const accountId in groupedBills) {
        const group = groupedBills[accountId];

        // 获取该组的第一个balance值
        let balance = group[0].accountBalance;

        // 遍历该组账单进行累加或减去
        group.forEach((bill, index) => {
            // 每次都更新当前账单的balance，依赖前一项的结果
            if (bill.money_type === 1) {
                balance -= bill.billMoney;
            } else if (bill.money_type === 0) {
                balance += bill.billMoney;
            }

            // 更新当前账单的balance
            bill.accountBalance = balance;
        });
    }
    // 返回更新后的账单数据
    return {
        ErrorCode: 0,
        Data: [...otherBills, ...pendingBills]
    };
}

export function calculateYearsAndMonths(startDateStr,endDateStr) {
    // 将输入字符串分割为开始日期和结束日期

    // 创建日期对象
    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);

    // 结束日期加一天
    endDate.setDate(endDate.getDate() + 1);

    // 计算年份差
    let years = endDate.getFullYear() - startDate.getFullYear();

    // 计算月份差，并调整年份差
    let months = endDate.getMonth() - startDate.getMonth();
    let days = endDate.getDate() - startDate.getDate();

    if (days < 0) {
        months -= 1;
        // 借用下一个月的天数来调整日期
        const prevMonth = new Date(endDate.getFullYear(), endDate.getMonth(), 0);
        days += prevMonth.getDate();
    }

    if (months < 0) {
        years -= 1;
        months += 12;
    }

    // 格式化输出
    let result = `${years}年`;
    if (months > 0) {
        result += `${months}月`;
    }

    return result;
}
// 展示房屋名字
export const getHouseNameById=(array, id)=> {
    const item = array.find(element => element.id === id);
    if (item) {
        return item.house_name;
    }
    return '';
};
// 展示单元名称拼接
export const getNamesByIds=(itemArray, idArray)=> {
    // 使用 filter 和 map 方法结合，或者直接使用 reduce 来构建结果
    const names = idArray.map(id => {
        // 在 itemArray 中查找与当前 id 匹配的对象
        const item = itemArray.find(element => element.id === id);
        // 如果找到，返回其 name，否则返回空字符串（可以根据需要调整）
        return item ? item.unit_name : '';
    }).filter(name => name); // 过滤掉空字符串（如果需要）

    // 将名字数组用 '-' 连接成字符串
    return names.join('-');
}

//租金递增
export const contractsDz=(initialRent,rentItems)=>{
    let previousRent =(rentItems.length>0?rentItems[0].incremental/100:0/100)*initialRent+initialRent; // 用传入的初始租金作为第一年租金
    return rentItems.map((item, index) => {
        // 第一年直接使用初始租金
        if (index === 0) {
            return {
                ...item,
                zuMoney:previousRent
            };
        }
        // 后续年份用前一年的租金计算
        const newRent = previousRent * (1 + item.incremental / 100);

        // 更新前一年的租金记录（虽然数组不可变，但这里为了演示逻辑）
        previousRent = newRent;

        return {
            ...item,
            zuMoney: newRent.toFixed(2)*1 // 保留两位小数
        };
    });
}

export  const groupImages = (images: string[], size: number) => {
    const groups = [];
    // 使用 for 循环，步长为 size，直到索引 i 达到或超过 images.length
    for (let i = 0; i < images.length; i += size) {
        // 从索引 i 开始，切片到 i + size（但不包括 i + size），这将正确处理数组末尾的情况
        const group = images.slice(i, i + size);
        // 将切片得到的子数组添加到 groups 中
        groups.push(group);
    }
    // 此时，groups 包含所有图像，按 size 分组，最后一个子数组可能不完整
    return groups;
};

export  const fuzzySearch=(tenantList, ziti)=>{
    if (ziti=='') {
        return tenantList;
    }
    return tenantList.filter(item => {
        // 检查 unitList 是否存在
        if (item.unitList && item.unitList.length > 0) {
            // 遍历 unitList，检查是否有任意一条 unit_name 包含关键字
            return item.unitList.some(unit =>
                unit.unit_name && unit.unit_name.includes(ziti)
            );
        }
        return false;
    });
}
export  const calculateSums=(sumDate)=>{
    // 初始化四个求和变量
    let balanceSum = 0;
    let billMoneySum = 0;
    let depositSum = 0;
    let integralSum = 0;
    let moneySum = 0;
    // 遍历数组，累加每个属性的值
    sumDate.map(transaction => {
        balanceSum += transaction.balance || 0; // 使用||0确保未定义或null值不会破坏计算
        billMoneySum += transaction.billMoney || 0;
        depositSum += transaction.deposit || 0;
        integralSum += transaction.integral || 0;
        moneySum += transaction.consumptionMoney || 0;
    });

    // 返回一个对象，包含四个求和结果
    return {
        balanceSum: balanceSum.toFixed(4)*1,
        billMoneySum: billMoneySum.toFixed(2)*1,
        depositSum: depositSum.toFixed(2)*1,
        integralSum: integralSum.toFixed(2)*1,
        moneySum: moneySum.toFixed(2)*1
    };
}


// 压缩图片
export async function compressBase642(base64: any) {
    const options = {
        quality: 0.8, // 压缩质量
        maxWidth: 2000, // 最大宽度
        maxHeight: 1500, // 最大高度
    };
    // 将 base64 转换为 Blob 对象
    const byteString = atob(base64.split(',')[1]);
    const mimeString = base64.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([ab], { type: mimeString });

    // 使用 Compressorjs 库进行压缩处理
    return new Promise((resolve, reject) => {
        new Compressor(blob, {
            ...options,
            success(result) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    const compressedDataUrl = e.target.result;
                    resolve(compressedDataUrl); // 返回压缩后的 base64 字符串
                };
                reader.readAsDataURL(result);
            },
            error(err) {
                console.error('压缩失败:', err.message);
                reject(err);
            },
        });
    });
}

// 读取路由缓存
export  const checkSessionStorage=(routeName:string, valueName:string)=>{
    // 从 sessionStorage 获取 sessMumeList
    const sessMumeList = JSON.parse(sessionStorage.getItem('sessMumeList'));
    // 如果 sessMumeList 不存在，返回 false
    if (!sessMumeList) {
        return false;
    }
    // 检查 sessMumeList 中是否存在 routeName
    if (sessMumeList.hasOwnProperty(routeName)) {
        const tenantList = sessMumeList[routeName];

        // 检查 tenantList 中是否存在 valueName
        if (tenantList.hasOwnProperty(valueName)) {
            // 如果存在，返回 ziti 的值
            return tenantList[valueName];
        } else {
            // 如果 tenantList 存在但 ziti 不存在，返回 false
            return false;
        }
    } else {
        // 如果 sessMumeList 存在但 routeName 不存在，返回 false
        return false;
    }
}
//更新路由缓存
export const updateSessionStorage=(routeParam, key, value)=>{
    // 从 sessionStorage 获取 sessMumeList
    let sessMumeList = JSON.parse(sessionStorage.getItem('sessMumeList'));

    // 如果 sessMumeList 不存在，初始化一个空对象
    if (!sessMumeList) {
        sessMumeList = {};
    }

    // 如果 sessMumeList 中不存在 routeParam，初始化一个空对象
    if (!sessMumeList.hasOwnProperty(routeParam)) {
        sessMumeList[routeParam] = {};
    }

    // 更新或添加键值对
    sessMumeList[routeParam][key] = value;

    // 将更新后的 sessMumeList 保存回 sessionStorage
    sessionStorage.setItem('sessMumeList', JSON.stringify(sessMumeList));

};
// 删除路由缓存
export const deleteSessionStorageRoute=(routeParam)=> {
    // 从 sessionStorage 获取 sessMumeList
    let sessMumeList = JSON.parse(sessionStorage.getItem('sessMumeList'));

    // 如果 sessMumeList 存在且包含 routeParam，则删除该路由名称对应的条目
    if (sessMumeList && sessMumeList.hasOwnProperty(routeParam)) {
        delete sessMumeList[routeParam];
        // 将更新后的 sessMumeList 保存回 sessionStorage
        sessionStorage.setItem('sessMumeList', JSON.stringify(sessMumeList));
    }
};

// 缓存添加的value
export const updateSessionStorageValue=(routeParam, key, value)=>{
    let sessMumeList = JSON.parse(sessionStorage.getItem('sessroutere'));

    // 如果 sessMumeList 不存在，初始化一个空对象
    if (!sessMumeList) {
        sessMumeList = {};
    }

    // 如果 sessMumeList 中不存在 routeParam，初始化一个空对象
    if (!sessMumeList.hasOwnProperty(routeParam)) {
        sessMumeList[routeParam] = {};
    }

    // 更新或添加键值对
    sessMumeList[routeParam][key] = value;

    // 将更新后的 sessMumeList 保存回 sessionStorage
    sessionStorage.setItem('sessroutere', JSON.stringify(sessMumeList));
};
// 读取缓存添加的value
export  const checkSessionStoragevalue=(routeName:string, valueName:string)=>{
    // 从 sessionStorage 获取 sessMumeList
    const sessMumeList = JSON.parse(sessionStorage.getItem('sessroutere'));
    // 如果 sessMumeList 不存在，返回 false
    if (!sessMumeList) {
        return false;
    }
    // 检查 sessMumeList 中是否存在 routeName
    if (sessMumeList.hasOwnProperty(routeName)) {
        const tenantList = sessMumeList[routeName];

        // 检查 tenantList 中是否存在 valueName
        if (tenantList.hasOwnProperty(valueName)) {
            // 如果存在，返回 ziti 的值
            return tenantList[valueName];
        } else {
            // 如果 tenantList 存在但 ziti 不存在，返回 false
            return false;
        }
    } else {
        // 如果 sessMumeList 存在但 routeName 不存在，返回 false
        return false;
    }
}

// 删除添加的路由参数
export const deleteSessionStorageRoutevalue=(routeParam)=> {
    // 从 sessionStorage 获取 sessMumeList
    let sessMumeList = JSON.parse(sessionStorage.getItem('sessroutere'));

    // 如果 sessMumeList 存在且包含 routeParam，则删除该路由名称对应的条目
    if (sessMumeList && sessMumeList.hasOwnProperty(routeParam)) {
        delete sessMumeList[routeParam];
        // 将更新后的 sessMumeList 保存回 sessionStorage
        sessionStorage.setItem('sessroutere', JSON.stringify(sessMumeList));
    }
};


// 过滤调不是没有unitList的数组
export  function filterItemsWithUnitList(array) {
    // 如果传入的不是数组或者是一个空数组，直接返回原参数
    if (!Array.isArray(array) || array.length === 0) {
        return array;
    }

    // 过滤出 unitList 是非空数组的元素
    return array.filter(item =>
        Array.isArray(item.unitList) && item.unitList.length > 0
    );
}

// 过滤当前用户的是否有权限读取消息的数据
export function filtermessageData(array) {
    // 如果传入的不是数组或者是一个空数组，直接返回原参数
    if (!Array.isArray(array) || array.length === 0) {
        return array;
    }
    let uqx = StaticInfo.uqx.split('');
    // 定义 tmType 与 uqx 索引的映射关系
    const tmTypeToIndexMap = {
        1: 321,
        2: 339,
        3: 366,
        4: 219,
        5: 221,
        6: 222,
        7: 223,
        8: 224,
        9: 185,
        10: 271,
        12: 83,
        13: 420,
        14: 399,
        15: 426,
        16: 339,
        17: 335,
    };
    // 过滤数组元素
    const newArr = array.filter(item => {
        const index = tmTypeToIndexMap[item.tmType];
        if (index !== undefined && uqx[index] === "1") {
            return true; // 不过滤
        }
        return false; // 过滤掉
    });
    return newArr;
}
// 根据日期与月份生成新的日期
export function addMonthsToDate(dateString:string, monthsToAdd:any) {
    // 解析输入日期
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
        throw new Error('无效的日期格式，请使用YYYY-MM-DD格式');
    }
    // 获取当前月份和年份
    const currentMonth = date.getMonth();
    const currentYear = date.getFullYear();

    // 计算新月份和年份
    const newMonth = currentMonth + monthsToAdd;
    const newYear = currentYear + Math.floor(newMonth / 12);
    const adjustedMonth = newMonth % 12;

    // 创建新日期对象
    const newDate = new Date(date);
    newDate.setFullYear(newYear, adjustedMonth, date.getDate());

    // 处理边缘情况（如1月31日加1个月应该是2月28/29日）
    if (newDate.getDate() !== date.getDate()) {
        newDate.setDate(0); // 设置为上个月的最后一天
    }

    // 格式化返回的日期为YYYY-MM-DD
    const year = newDate.getFullYear();
    const month = String(newDate.getMonth() + 1).padStart(2, '0');
    const day = String(newDate.getDate()-1).padStart(2, '0');

    return `${year}-${month}-${day}`;
}
export function getTimeRangeByMonths(months:number) {
    // 确保传入的月份数在1到12之间
    if (months < 1 || months > 12) {
        throw new Error('Months must be between 1 and 12');
    }

    // 获取当前时间
    const now = dayjs();

    // 计算开始时间（当前时间的 00:00:00）
    const startTime = now.startOf('day');

    // 计算结束时间（当前时间的开始时间加上指定月份数后的最后一天的 23:59:59）
    const endTime = startTime.add(months, 'month').subtract(1, 'day').endOf('day');

    return {
        startTime: startTime.format('YYYY-MM-DD'),
        endTime: endTime.format('YYYY-MM-DD')
    };
}
export function getTimeRangeByMonthsz(dateString:string, months:number) {
    // 确保传入的月份数在1到12之间
    if (months < 1 || months > 12) {
        throw new Error('Months must be between 1 and 12');
    }

    // 解析传入的日期字符串
    const date = dayjs(dateString);

    // 计算开始时间（传入日期的下一天的 00:00:00）
    const startTime = date.add(1, 'day').startOf('day');

    // 计算结束时间（开始时间加上指定月份数后的最后一天的 23:59:59）
    const endTime = startTime.add(months, 'month').subtract(1, 'day').startOf('day');

    return {
        startTime: startTime.format('YYYY-MM-DD HH:mm:ss'),
        endTime: endTime.format('YYYY-MM-DD HH:mm:ss')
    };
}

//下载文件
export function downloadFile(ContentType, FileContents, FileDownloadName) {
    if (!FileContents) {
        console.error('文件内容为空，无法执行下载');
        return; // 终止函数执行
    }
    // 步骤1: 将 base64 内容解码为二进制数据
    const byteCharacters = atob(FileContents);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);

    // 步骤2: 创建 Blob 对象（包含文件内容和类型）
    const blob = new Blob([byteArray], { type: ContentType });

    // 步骤3: 创建临时下载链接
    const url = URL.createObjectURL(blob);

    // 步骤4: 创建隐藏的 a 标签并触发下载
    const a = document.createElement('a');
    a.href = url;
    a.download = FileDownloadName; // 指定下载文件名
    document.body.appendChild(a); // 将 a 标签添加到文档（部分浏览器需要）
    a.click(); // 模拟点击下载
    message.success('已下载成功');

    // 步骤5: 清理资源
    document.body.removeChild(a); // 移除临时 a 标签
    URL.revokeObjectURL(url); // 释放 Blob URL 内存
}
// 汉字转首字母大写
export const  firstLetterUpperCase=(str:string)=>{
    let initialsOrderNumber;
    initialsOrderNumber = pinyin(str, { pattern: 'first', toneType: 'none',separator: '' }).toUpperCase();
    return initialsOrderNumber;
}
// 生成订单号 (园区名首字母拼音大写+当前时间+随机数)
export const  generate=(str:string)=>{
    const initialsOrderNumber = pinyin(str, { pattern: 'first', toneType: 'none',separator: '' }).toUpperCase();
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const dateStr = `${year}${month}${day}`;
    const randomNum = Math.floor(Math.random() * 10000000).toString().padStart(7, '0');
    return `${initialsOrderNumber}${dateStr}${randomNum}`;
};
