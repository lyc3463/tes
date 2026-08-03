// 类型文本映射（和下拉框、Tag 保持一致）
const consumptionTypeTextMap: Record<number, string> = {
    1: '微信充值',
    2: '租金',
    3: '电费',
    4: '水费',
    5: '公共缴费',
    6: '手动充值',
    7: '服务费',
    8: '租金违约金',
    9: '月保',
    10: '大额转账',
    11: '报修',
    12: '装修押金',
    13: '管理费',
    14: '管理费违约金',
};

/**
 * 根据类型值获取对应文本（导出Excel专用）
 * @param type 数字类型
 * @returns 对应文字
 */
export const getConsumptionTypeText = (type: number): string => {
    return consumptionTypeTextMap[type] ?? '未知类型';
};

/**
 * 报警配置映射表，写死，根据 warning_def_id 匹配名称、设备类型、说明
 */
export const WarningDefList = [
    { warning_def_id: 1001, name: "A相有功功率反向", device_type: 0, desc: "指示电流方向是否正常，进出线接反时触发报警。" },
    { warning_def_id: 1002, name: "B相有功功率反向", device_type: 0, desc: "指示电流方向是否正常，进出线接反时触发报警。" },
    { warning_def_id: 1003, name: "C相有功功率反向", device_type: 0, desc: "指示电流方向是否正常，进出线接反时触发报警。" },
    { warning_def_id: 1004, name: "断电报警", device_type: 0, desc: "指示线路通断状态，表端拉闸状态时触发报警，拉闸原因通常包含余额不足，手动拉闸，超负荷，开表盖。" },
    { warning_def_id: 1005, name: "开盖报警", device_type: 0, desc: "支持开盖检测的设备表盖打开时触发报警，可防止非法打开电表盖的偷电行为。" },
    { warning_def_id: 1006, name: "A相过载", device_type: 0, desc: "设备运行期间长时间超过设定的负荷限制，通常会引起电表跳闸断电。" },
    { warning_def_id: 1007, name: "B相过载", device_type: 0, desc: "设备运行期间B相线路长时间超过设定的负荷限制，通常会引起电表跳闸断电。" },
    { warning_def_id: 1008, name: "C相过载", device_type: 0, desc: "设备运行期间C相线路长时间超过设定的负荷限制，通常会引起电表跳闸断电。" },
    { warning_def_id: 1009, name: "计量故障", device_type: 0, desc: "设备因电网剧烈波动或内部元器件损坏原因导致无法正常计量。" },
    { warning_def_id: 1010, name: "电费透支", device_type: 0, desc: "开启预付费模式的电表余额欠费超过1元。" },
    { warning_def_id: 1011, name: "余额不足一级报警", device_type: 0, desc: "开启预付费模式的电表余额小于设定的一级报警金额阈值。" },
    { warning_def_id: 1012, name: "余额不足二级报警", device_type: 0, desc: "开启预付费模式的电表余额小于设定的二级报警金额阈值。" },
    { warning_def_id: 1013, name: "电表连续通讯异常", device_type: 0, desc: "后台与设备连续通讯失败超过10次以上。" },
    { warning_def_id: 1014, name: "设备信号弱", device_type: 0, desc: "设备信号完全无法保障通讯时报警。" },
    { warning_def_id: 1015, name: "连续用电量过低", device_type: 0, desc: "系统设置一定时间段内用电量低于阈值触发报警，可用于检查用户异常或窃电行为。" },
    { warning_def_id: 1016, name: "连续用电量过高", device_type: 0, desc: "系统设置一定时间段内用电量高于阈值触发报警，可用于检查用户异常用电行为。" },
    { warning_def_id: 1017, name: "A相无功功率反向", device_type: 0, desc: "指示三相电表A相无功电能方向是否正常，进出线接反或负荷异常时触发报警。" },
    { warning_def_id: 1018, name: "B相无功功率反向", device_type: 0, desc: "指示三相电表B相无功电能方向是否正常，进出线接反或负荷异常时触发报警。" },
    { warning_def_id: 1019, name: "C相无功功率反向", device_type: 0, desc: "指示三相电表C相无功电能方向是否正常，进出线接反或负荷异常时触发报警。" },
    { warning_def_id: 1020, name: "A相失压", device_type: 0, desc: "指示电表计量是否异常或三相电表A相是否存在不平衡现象。" },
    { warning_def_id: 1021, name: "A相欠压", device_type: 0, desc: "指示电表计量是否异常或三相电表A相电网参数异常。" },
    { warning_def_id: 1022, name: "A相过压", device_type: 0, desc: "指示电表计量是否异常或三相电表A相电网参数异常。" },
    { warning_def_id: 1023, name: "B相失压", device_type: 0, desc: "指示电表计量是否异常或三相电表B相是否存在不平衡现象。" },
    { warning_def_id: 1024, name: "B相欠压", device_type: 0, desc: "指示电表计量是否异常或三相电表B相电网参数异常。" },
    { warning_def_id: 1025, name: "B相过压", device_type: 0, desc: "指示电表计量是否异常或三相电表B相是否存在不平衡现象。" },
    { warning_def_id: 1026, name: "C相失压", device_type: 0, desc: "指示电表计量是否异常或三相电表C相电网参数异常。" },
    { warning_def_id: 1027, name: "C相欠压", device_type: 0, desc: "指示电表计量是否异常或三相电表C相电网参数异常。" },
    { warning_def_id: 1028, name: "C相过压", device_type: 0, desc: "指示电表计量是否异常或三相电表C相电网参数异常。" },
    { warning_def_id: 1043, name: "温度异常", device_type: 0, desc: "指示电表是否检测到温度异常。" },
    { warning_def_id: 1044, name: "总功率因数超下限", device_type: 0, desc: "指示三相电表总功率因数过低，用电质量差。（需特定款表支持）" },
    { warning_def_id: 1045, name: "电流不平衡", device_type: 0, desc: "指示三相电表三相负荷不平衡，增加线路损耗。（需特定款表支持）" },
    { warning_def_id: 1046, name: "电压不平衡", device_type: 0, desc: "指示三相电表三相负荷不平衡，增加线路损耗。（需特定款表支持）" },
    { warning_def_id: 1047, name: "电流逆相序", device_type: 0, desc: "指示三相电表交流电电流的相位与电压相反。（需特定款表支持）" },
    { warning_def_id: 1048, name: "电压逆相序", device_type: 0, desc: "指示三相电表三相电压的相序与正常顺序相反。（需特定款表支持）" },
    { warning_def_id: 1049, name: "恶性负载", device_type: 0, desc: "又称阻性负载，指示电表负载中出现大功率直热式电器，易造成火灾等情况。（需特定款表支持）" },
    { warning_def_id: 1050, name: "电动车充电检测", device_type: 0, desc: "识别特定类型电器接入负载端，提高用电安全。（需特定款表支持）" },
    { warning_def_id: 1051, name: "漏电检测", device_type: 0, desc: "识别电路中是否存在漏电情况，提高用电安全。（需特定款表支持）" },
    { warning_def_id: 1052, name: "调压器检测", device_type: 0, desc: "识别电路中是否存在调压器等装置绕过恶性负载检测。（需特定款表支持）" },
    { warning_def_id: 1053, name: "电弧检测", device_type: 0, desc: "识别电路中是否存在电弧情况，防止引起火灾，提高用电安全。（需特定款表支持）" },
    { warning_def_id: 1029, name: "关阀", device_type: 1, desc: "指示阀门通断状态，表端关阀状态时触发报警，关阀原因通常包含余额不足，手动关阀，电池耗尽，磁干扰等原因。" },
    { warning_def_id: 1030, name: "阀门异常", device_type: 1, desc: "指示设备电子计量传感器部分是否正常工作或存在外部干扰。" },
    { warning_def_id: 1031, name: "传感器异常", device_type: 1, desc: "指示设备电子计量传感器部分是否正常工作或存在外部干扰。" },
    { warning_def_id: 1032, name: "磁干扰", device_type: 1, desc: "指示设备电子计量部分是否正常工作或存在外部干扰。" },
    { warning_def_id: 1033, name: "电池欠压", device_type: 1, desc: "指示电池是否即将耗尽，电池完全耗尽后电子部分无法同步机械部分数据，无法通讯，不能正常扣减余额和关阀。" },
    { warning_def_id: 1034, name: "通讯信号弱", device_type: 1, desc: "指示设备与采集器或服务器通讯能力减弱或无法通讯。" },
    { warning_def_id: 1035, name: "水费透支", device_type: 1, desc: "开启预付费模式的水费余额欠费超过1元或0.1m³。" },
    { warning_def_id: 1036, name: "余额不足一级报警", device_type: 1, desc: "开启预付费模式的水表余额小于设定的一级报警阈值。" },
    { warning_def_id: 1037, name: "余额不足二级报警", device_type: 1, desc: "开启预付费模式的水表余额小于设定的二级报警阈值。" },
    { warning_def_id: 1038, name: "水表连续通讯异常", device_type: 1, desc: "后台与设备连续通讯失败超过10次以上。" },
    { warning_def_id: 1039, name: "连续用水量过低", device_type: 1, desc: "系统设置一定时间段内用水量低于阈值触发报警，可用于检查用户异常行为或窃水行为。" },
    { warning_def_id: 1040, name: "连续用水量过高", device_type: 1, desc: "系统设置一定时间段内用水量高于阈值触发报警，可用于检查用户异常行为或漏水发生。" },
    { warning_def_id: 1041, name: "设备信号弱", device_type: 9, desc: "设备信号完全无法保障通讯时报警。" },
    { warning_def_id: 1042, name: "通讯设备长时间离线", device_type: 9, desc: "设备长时间离线，后台无法正常采集数据。" },
];

// 生成快速查找Map，提升表格渲染性能
const WarningDefMap = new Map<string, typeof WarningDefList[0]>();
WarningDefList.forEach(item => {
    WarningDefMap.set(item.warning_def_id.toString(), item);
});

/**
 * 根据warning_def_id 获取报警名称
 * @param id 报警编号
 * @returns 报警名称，无匹配返回"-"
 */
export const getWarningNameById = (id?: string) => {
    if (!id) return "-";
    const row = WarningDefMap.get(id);
    return row?.name ?? "-";
};

/**
 * 根据warning_def_id 获取报警说明
 */
export const getWarningDescById = (id?: string) => {
    if (!id) return "-";
    const row = WarningDefMap.get(id);
    return row?.desc ?? "-";
};