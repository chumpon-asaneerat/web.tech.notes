class NList {
    constructor() {
        this._datasource = null;
        this._displayMember = '';
        this._map = null;
        this._items = null;
        this._input = '';
        this._caseSensitive = false;
    };

    __filter(elem) {
        if (!this._input || this._input.length < 0) {
            //console.log('input is null or empty.');
            return elem;
        }        
        else {
            let sIdx = elem.indexOf(this._input);
            if (sIdx !== -1) {
                return elem;
            }
        }
    };

    __builditems() { 
        this._map = null;
        this._items = null;
        if (!this._datasource) {
            //console.log('datasource not assigned.');
            return;
        }
        if (!(this._datasource instanceof Array)) {
            //console.log('datasource is not array.');
            return;
        }
        if (!this._displayMember) {
            //console.log('display member not assigned.');
            return;
        }
        let ds = this._datasource;
        let member = String(this._displayMember); 

        this._map = ds.map(elem => 
            (this._caseSensitive) ? elem[member] : elem[member].toLowerCase()
        );
        this.__applyFilter();
    };

    __applyFilter() {
        this._items = null;
        if (!this._map) return;
        let self = this;
        let map = this._map;
        this._items = map.filter(elem => self.__filter(elem));
    };

    // find index in source array.
    indexOf(value) {
        if (!this._map) return null;
        let val = (this._caseSensitive) ? value : val.toLowerCase();
        return this._map.indexOf(val);
    };

    // find item in source array.
    findItem(value) {
        if (!this._datasource) return null;
        if (!this._map) return null;
        let val = (this._caseSensitive) ? value : val.toLowerCase();
        let idx = this._map.indexOf(val);
        if (idx === -1) return null;
        return this.datasource[idx];
    };

    get datasource() { return this._datasource; }
    set datasource(value) {
        if (!this._datasource && value) {
            // assigned value to null datasource.
            this._datasource = value;
            this.__builditems();
        }
        else if (this._datasource && !value) {
            // assigned null to exist datasource.
            this._datasource = value;
            this.__builditems();
        }
        else if (this._datasource && value) {
            // both has value.
            this._datasource = value;
            if (this._displayMember && this._displayMember !== '') {
                this.__builditems();
            }
        }
        else {
            // both is null.
            this._datasource = value;
            // clear related arrays.
            this._map = null;
            this._items = null;
        }
    };

    get displayMember() { return this._displayMember; };
    set displayMember(value) {
        if (this._displayMember !== value) {
            this._displayMember = value;
            this.__builditems();
        }
    };

    get caseSensitive() { return this._caseSensitive; };
    set caseSensitive(value) {
        if (this._caseSensitive != value) {
            this._caseSensitive = value;
            this.__builditems();
        }
    };

    get input() { return this._input; };
    set input(value) {
        if (this._input !== value) {
            this._input = value;
            this.__applyFilter();
        }
    };

    get items() { return this._items; };

    get selectedText() {
        if (!this._items || this._items.length <= 0) return null;
        //if (!this._input || this._input.length <= 0) return null;
        return this._items[0];
    };
};

let cmdEN = [
    { cmdId: '@org', cmdText: 'organization' },
    { cmdId: '@date', cmdText: 'date' }
];

let cmdTH = [
    { cmdId: '@org', cmdText: 'หน่วยงาน' },
    { cmdId: '@date', cmdText: 'วันที่' }
];

let orgENs = [
    { orgId: 'O00001', orgName: 'Softbase Co., Ltd.' },
    { orgId: 'O00002', orgName: 'Accounting' },
    { orgId: 'O00003', orgName: 'Assembly' },
    { orgId: 'O00004', orgName: 'Financial' },
    { orgId: 'O00005', orgName: 'Margetting' },
    { orgId: 'O00006', orgName: 'Engineering' },
    { orgId: 'O00007', orgName: 'Supports' },
    { orgId: 'O00008', orgName: 'Purchasing' },
    { orgId: 'O00009', orgName: 'Production' }
];

let orgTHs = [
    { orgId: 'O00001', orgName: 'บริษัท ซอฟต์เบส จำกัด.' },
    { orgId: 'O00002', orgName: 'ฝ่ายบัญชี' },
    { orgId: 'O00003', orgName: 'ฝ่ายผลิต (โรงงาน)' },
    { orgId: 'O00004', orgName: 'ฝ่ายการเงิน' },
    { orgId: 'O00005', orgName: 'ฝ่ายการตลาด' },
    { orgId: 'O00006', orgName: 'ฝ่ายวิศวะกรรม' },
    { orgId: 'O00007', orgName: 'ฝ่ายบริการ' },
    { orgId: 'O00008', orgName: 'ฝ่ายจัดซื้อ' },
    { orgId: 'O00009', orgName: 'ฝ่ายผลิต (จัดการ)' }
];

let words = [
    { wordText: 'aAaBBcc' },
    { wordText: 'aaaBacc' },
    { wordText: 'aaBcaab' },
    { wordText: 'abababa' },
    { wordText: 'accbaac' },
    { wordText: 'accabAc' },
    { wordText: 'abbCCab' },
    { wordText: 'abaabbc' },
    { wordText: 'bbabcaa' },
    { wordText: 'bbabccc' },
    { wordText: 'bbaabba' }
];


let ds = new NList();
/*
ds.datasource = cmdEN;
ds.displayMember = 'cmdText';
console.log(ds.items);
*/
/*
ds.datasource = orgENs;
ds.displayMember = 'orgName';
ds.input = 'na'
console.log(ds.items);
*/
ds.datasource = words;
ds.displayMember = 'wordText';
//ds.input = 'aabb'
ds.caseSensitive = true;
console.log(ds.items);
console.log(ds.selectedText);
console.log(ds.indexOf(ds.selectedText));
console.log(ds.findItem(ds.selectedText));

