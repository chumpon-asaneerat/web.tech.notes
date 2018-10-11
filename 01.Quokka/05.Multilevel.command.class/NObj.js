//#region NObj

class NObj {
    // check types.
    static isString(value) { return typeof value === 'string' };
    static isBool(value) { return typeof value === 'boolean' };
    static isNumber(value) { return typeof value === 'number' };
    // access item's member.
    static get(item, member) { return (!item) ? item : (member) ? item[member] : item; };
};

//#endregion

//#region NObj - Test get object property
/*
// simple array
let ds1 = [1, 2, 3, 4, 5]
console.log(NObj.get(ds1[1]))
// object array
let ds2 = [{ id: 1, text: 'one'}, { id: 2, text: 'two'}]
console.log(NObj.get(ds2[1]))
console.log(NObj.get(ds2[1], 'text'))
*/
//#endregion
