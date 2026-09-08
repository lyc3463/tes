import { getData } from '@/network/http';

export function add(vals:any) {
    return getData(1812, [
        vals.reviewer1,vals.reviewer2,vals.reviewer3,
        vals.reviewer4,vals.reviewer5,vals.reviewer6,
        vals.reviewer7,vals.reviewer8,vals.reviewer9,
        vals.reviewer10,vals.reviewer11,vals.rpName1,
        vals.rpName2,vals.rpName3,vals.rpName4,vals.rpName5,
        vals.rpName6,vals.rpName7,vals.rpName8,vals.rpName9,
        vals.rpName10,vals.carbonCopy,
        vals.amount1,vals.amount2,vals.amount3,vals.amount4,vals.amount5,
        vals.amount6,vals.amount7,vals.amount8,vals.amount9,vals.amount10
    ]);
}
export function edit(vals:any) {
    return getData(1813, [
        vals.reviewer1,vals.reviewer2,vals.reviewer3,
        vals.reviewer4,vals.reviewer5,vals.reviewer6,
        vals.reviewer7,vals.reviewer8,vals.reviewer9,
        vals.reviewer10,vals.reviewer11,vals.rpName1,
        vals.rpName2,vals.rpName3,vals.rpName4,vals.rpName5,
        vals.rpName6,vals.rpName7,vals.rpName8,vals.rpName9,
        vals.rpName10,vals.carbonCopy,
        vals.amount1,vals.amount2,vals.amount3,vals.amount4,vals.amount5,
        vals.amount6,vals.amount7,vals.amount8,vals.amount9,vals.amount10
    ]);
}

export function one() {
    return getData(1814, []);
}
