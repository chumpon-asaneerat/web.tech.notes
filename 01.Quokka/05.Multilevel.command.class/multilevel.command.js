//#region NArray and related classes

//#region NArray

class NArray {};

//#endregion

//#region NArray.DynamicDataSource

NArray.ItemSource = class {
    constructor() {};
    get items() { return null; }
    set items(value) { }
};


NArray.DynamicDataSource = class {
    constructor() {
        this._DSs = [];
    };

    datasources(id, callback) {

    };
};

//#endregion

//#region NArray.DynamicDataSource - Test

//#endregion

//#endregion

//#region Variable Check Is Null Or Empty Or Undefined - Test
/*
let val;
console.log('val is null, empty or undefined:', !val);
val = null;
console.log('val is null, empty or undefined:', !val);
val = ''
console.log('val is null, empty or undefined:', !val);
val = 0
console.log('val is null, empty or undefined:', !val);
val = {}
console.log('val is null, empty or undefined:', !val);
val = ' '
console.log('val is null, empty or undefined:', !val);
val = 'a'
console.log('val is null, empty or undefined:', !val);
*/
//#endregion

//#region Gets or sets multiple items - Test

class A {
    constructor() {
        this._dss = [];
    };

    ondatasourcechanged(id, oldValue, newValue) {
        console.log('datasource changed - id:', id, ', old:', oldValue, ', new:', newValue);
    };

    datasource(id, value) {
        if (!id) return;
        let dss = this._dss;
        let map = this._dss.map(ds => ds.id);
        let idx = map.indexOf(id);
        //console.log(idx);
        if (arguments.length === 1) {
            return (idx !== -1) ? dss[idx].value : null;
        }
        else if (arguments.length > 1) {
            if (idx !== -1) {
                //console.log('update');
                let old = dss[idx].value;
                dss[idx].value = value;
                ondatasourcechanged(id, old, value);
            }
            else {
                //console.log('add new');
                dss.push({ id: id, value: value});
                ondatasourcechanged(id, null, value);
            }
        }
    };
    remove(id) {};
    clear() {};
    get datasources() { return this._dss; }
};

let oA = new A();
let ds1 = [
    { 
        type:'cmd', id: 'qset', text:'Question Set' 
    }, { 
        type:'cmd', id: 'ques', text:'Questions' 
    }];
let ds2 = [
    { 
        type:'qset', id: 'QS0001', text:'QSet One' 
    }, { 
        type:'qset', id: 'QS0002', text:'QSet Two' 
    }];
let ds3 = [
    { 
        type:'ques', qsetid: 'QS0001', qseq: 1, text:'Our service?' 
    }, { 
        type:'ques', qsetid: 'QS0001', qseq: 2, text:'Our staff?' 
    }, { 
        type:'ques', qsetid: 'QS0002', qseq: 1, text:'Our quality?' 
    }, { 
        type:'ques', qsetid: 'QS0002', qseq: 2, text:'Our taste?' 
    }];

console.log(oA.datasources.length);
oA.datasource('commands', ds1)
console.log(oA.datasources.length);
oA.datasource('qsets', ds2)
console.log(oA.datasources.length);
oA.datasource('questions', ds3)
console.log(oA.datasources.length);

//#endregion