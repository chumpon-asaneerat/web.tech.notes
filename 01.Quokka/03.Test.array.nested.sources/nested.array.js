//#region NArray

class NArray { };

//#endregion

//#region NArray.CaseSensitiveDataSource

NArray.CaseSensitiveDataSource = class {
    constructor() {
        this._ds = null; 
        this._valueMember = '';
        this._caseSensitive = false;
        this._values = null;
    };
    // reset values array.
    refresh() {
        this._values = null;
    };
    // Gets array of all item's property value that match value member.
    // Note: all value in array will convert to string.
    get values() {
        if (!this._ds) {
            this.refresh(); // make sure value is null if source is null.
            return null; // datasource is null.
        }
        if (this._values && this._items) {
            // already create values map but seem size is difference
            // so reset the values map.
            if (this._values.length !== this._items.length) {
                this.refresh();
            }
        }
        // values map is not created so created only if required.
        if (!this._values) {
            let self = this;
            let pName = (this._valueMember) ? String(this._valueMember).trim() : '';
            this._values = this._ds.map(elem => {
                let sVal = (pName !== '') ? String(elem[pName]) : String(elem);
                let result = sVal.trim();
                return (self._caseSensitive) ? result : result.toLowerCase();
            });
        }
        return this._values;
    };
    indexOf(search) {
        let map = this.values;
        if (!map || !search) return -1;
        let sSch = String(search).trim();
        let cSch = (self._caseSensitive) ? sSch : sSch.toLowerCase();
        return map.indexOf(cSch);
    };
    getitem(index) { 
        let ds = this._ds;
        return (ds && index >= 0 && index < ds.length) ? ds[index] : null;
    };
    get datasource() { return this._ds; }
    set datasource(value) {
        if (value && !(value instanceof Array)) {
            console.error('Assigned value must be array.');
            return;
        }
        this._ds = value;
        this.refresh(); // resets values map.
    }
    get valueMember() { return this._valueMember; }
    set valueMember(value) {
        if (this._valueMember != value) {
            this._valueMember = value;
            this.refresh(); // resets values map.
        }
    }
    get caseSensitive() { return this._caseSensitive; }
    set caseSensitive(value) {
        if (this._caseSensitive != value) {
            this._caseSensitive = value;
            this.refresh(); // resets values map.
        }
    }
};

//#endregion

//#region NArray.AutoFilterDataSource

NArray.AutoFilterDataSource = class {
    constructor() {
        this._ds = new NArray.CaseSensitiveDataSource();
        this._input = '';
        this._items = null;
        this._parts = null;
    };
    // reset filters array.
    refresh() { 
        this._items = null;
        this._parts = null;
    };
    get items() {
        if (!this._ds || !this._ds.datasource) {            
            this.refresh(); // make sure value is null if source is null.         
            return this._items; // no data source assigned.
        }
        if (!this._items) {
            let vals = this._ds.values;
            if (!vals) {
                // if some case cannot generate values array
                // so reset items to null;
                this.refresh();
            }
            else {
                let filter = (this.caseSensitive) ? this._input : this._input.toLowerCase();
                let matchs = vals.filter((elem) => {
                    // The elem is string and in case-sensitive or 
                    // case-insensitive that match user setting.
                    let idx = elem.indexOf(filter);
                    let result = (idx !== -1);
                    return result;
                });
                let results = [];
                let parts = [];
                let ds = this._ds;
                let pName = this._ds.valueMember;
                matchs.forEach(elem => {
                    // find index that match elem (string).
                    let idx = vals.indexOf(elem);
                    if (idx !== -1) {
                        // push active item to result.
                        let aItem = ds.getitem(idx);
                        results.push(aItem);
                        // get active value string.
                        let sVal = (pName) ? aItem[pName] : aItem;
                        // calculate each parts position.
                        let ipos = elem.indexOf(filter);
                        let pos = {
                            pos1: 0,
                            len1: ipos,
                            pos2: ipos,
                            len2: filter.length,
                            pos3: ipos + filter.length,
                            len3: elem.length - (ipos + filter.length)
                        };
                        // extract parts
                        let part = {
                            pre: sVal.substr(pos.pos1, pos.len1),
                            match: sVal.substr(pos.pos2, pos.len2),
                            post: sVal.substr(pos.pos3, pos.len3)
                        }
                        // append to output array.
                        parts.push(part);
                    }
                });
                // setup results to related variables.
                this._items = results;
                this._parts = parts;
            }
        }
        return this._items;
    }
    get parts() { return this._parts; }
    indexOf(search) {
        if (!this._ds) return null -1;
        return this._ds.indexOf(search);
    };
    getitem(index) {
        if (!this._ds) return null;
        let item = this._ds.getitem(index);
        return item;
    };
    get datasource() { return this._ds.datasource; }
    set datasource(value) {
        if (value && !(value instanceof Array)) {
            console.error('Assigned value must be array.');
            return;
        }
        this._ds.datasource = value;
        this.refresh(); // resets filter items.
    }
    get valueMember() { return this._ds.valueMember; }
    set valueMember(value) {
        if (this._ds.valueMember != value) {
            this._ds.valueMember = value;
            this.refresh(); // resets filter items.
        }
    }
    get caseSensitive() { return this._ds.caseSensitive; }
    set caseSensitive(value) {
        if (this._ds.caseSensitive != value) {
            this._ds.caseSensitive = value;
            this.refresh(); // resets filter items.
        }
    }
    get filter() { return this._input; }
    set filter(value) {
        if (this._input != value) {
            this._input = (value) ? String(value) : ''; // null not allow.
            this.refresh(); // resets filter items.
        }
    };
};

//#endregion

//#region NArray.MultiSelectDataSource

NArray.MultiSelectDataSource = class {
    constructor() {
        this._ds = null;
        this._idMember = '';
        this._valueMember = '';
        this._caseSensitive = false;
        this._selectedIds = [];
        this._selectedItems = null;
        this._currentItems = null;
    };
    // public methods.
    clearSelection() {
        if (!this._selectedIds) this._selectedIds = [];
        else this._selectedIds.splice(0);
        this._selectedItems = null;
        this._currentItems = null;
    };
    refresh() {
        // reset array for recalculate.
        this._selectedItems = null;
        this._currentItems = null;
        if (!this._ds) return;
    };
    indexOf(value) {
        let self = this;
        let ignoreCase = (this._caseSensitive) ? false : true;
        let sMember = (this._valueMember) ? this._valueMember.trim() : null;
        let isMember = (sMember && sMember.length > 0) ? true : false;
        let oValue = (value) ? String(value).trim() : null;
        let sValue = (oValue) ? oValue.toLowerCase() : null;
        if (!sValue) return -1;
        if (!this._ds) return -1;
        let getitem = (item) => {
            let oItem = (isMember) ? item[sMember] : item;
            return (ignoreCase) ? String(oItem).toLowerCase() : String(oItem);
        };
        let map = this._ds.map(item => {
            let sItem = getitem(item);
            return sItem;
        });
        return map.indexOf(sValue);
    };
    selectValue(value) {
        let idx = this.indexOf(value);
        if (idx === -1) return;
        let isIndex = (!this._idMember || this._idMember === '');
        if (isIndex)
            this.selectId(idx);
        else {
            let item = this._ds[idx];
            if (!item) return -1;
            let sId = String(item[this._idMember]);
            this.selectId(sId);
        }
    }
    selectId(id) {
        if (!this._selectedIds) this._selectedIds = [];
        let isIndex = (!this._idMember || this._idMember === '');
        let sId;        
        if (isIndex) sId = String(id); // force to string.
        else sId = (id) ? String(id).trim().toLowerCase() : null;
        if (!sId) return;
        //console.log(sId);
        let idx = this._selectedIds.indexOf(sId);
        //console.log(idx);
        if (idx === -1) {
            this._selectedIds.push(sId);
            this._selectedItems = null; // reset array for recalculate.
        }
    };
    // public properties.
    get datasource() {
        return this._ds;
    }
    set datasource(value) {
        this._ds = value;
        // Implement required: make sure the id member is same i.e. change language
        // the datasource should be changed but the id property of each item
        // should be same if not all exists selection must be clear.
        this.refresh(); // resets related items.
    }
    get idMember() { return this._idMember; }
    set idMember(value) {
        if (this._idMember != value) {
            this._idMember = value;
            this.clearSelection();
        }
    }
    get valueMember() { return this._valueMember; }
    set valueMember(value) {
        if (this._valueMember != value) {
            this._valueMember = value;
            this.refresh(); // resets related items.
        }
    }
    get caseSensitive() { return this._caseSensitive; }
    set caseSensitive(value) {
        if (this._caseSensitive != value) {
            this._caseSensitive = value;
            this.refresh(); // resets related items.
        }
    }
    get selectedIds() { return this._selectedIds; }
    get selectedItems() {
        if (!this._selectedItems) {
            let idMember = (this._idMember) ? this._idMember.trim().toLowerCase() : null;
            let hasIdMember = (idMember && idMember.length > 0);
            let ids = this._selectedIds;
            if (this._ds) {
                let getitem = (item) => {
                    let oItem = (hasIdMember) ? item[idMember] : item;
                    return String(oItem).toLowerCase();
                };
                if (hasIdMember) {
                    this._selectedItems = this._ds.filter((item) => {
                        let sItem = getitem(item);
                        let idx = ids.indexOf(String(sItem));
                        return (idx !== -1);
                    });
                }
                else {                    
                    this._selectedItems = [];
                    ids.forEach(index => {
                        let item = this._ds[index];
                        this._selectedItems.push(item);
                    });
                }
            }
        }
        return this._selectedItems;
    }
    get currentItems() {
        if (!this._currentItems) {
            let idMember = (this._idMember) ? this._idMember.trim().toLowerCase() : null;
            let hasIdMember = (idMember && idMember.length > 0);            
            let ids = this._selectedIds;
            if (this._ds) {
                let items = this._ds;
                let map = this._ds.map((item) => {
                    let sVal = (hasIdMember) ? item[idMember] : item;
                    return String(sVal);
                });
                let results = [];
                if (hasIdMember) {
                    let index = 0;
                    map.forEach(id => {
                        let idx = ids.indexOf(id.toLowerCase());
                        if (idx === -1) {
                            // not in selection.
                            let item = items[index];
                            results.push(item);
                        }
                        index++;
                    });
                }
                else {
                    let index = 0;
                    map.forEach(item => {
                        let idx = ids.indexOf(String(index));
                        if (idx === -1) {
                            results.push(item);
                        }
                        index++;
                    });
                }
                this._currentItems = results;
            }
        }
        return this._currentItems;
    }
};

//#endregion

//#region <<< TEST CASE >>> NArray.AutoFilterDataSource

let items = [
    { id: 'A1', name: 'Apple' },
    { id: 'A2', name: 'Applicot' },
    { id: 'A3', name: 'Action' },
    { id: 'A4', name: 'Bison' },
    { id: 'A5', name: 'Elephen' },
    { id: 'A6', name: 'Eleven' },
    { id: 'A7', name: 'Boston' },
    { id: 'A8', name: 'CPP' },
    { id: 'A9', name: 'Capture' },
    { id: 'A10', name: 'Tiger' },
]

let items2 = [
    'Apple',
    'Applicot',
    'Action',
    'Bison',
    'Elephen',
    'Eleven',
    'Boston',
    'CPP',
    'Capture',
    'Tiger',
]

let arr = new NArray.AutoFilterDataSource()
let iCase = 1
switch (iCase) {
    case 1: //- object array
        arr.datasource = items
        arr.valueMember = 'name'
        arr.caseSensitive = false
        arr.filter = 'TI'
        break;
    case 2: //- simple array
        arr.datasource = items2;
        arr.valueMember = '';
        arr.caseSensitive = false
        arr.filter = 'ti'
        break;
}

console.log(arr.items)
console.log(arr.parts)

//#endregion

//#region <<< TEST CASE >>> NArray.MultiSelectDataSource
/*
let items = [
    { id: 'A1', name: 'Apple' },
    { id: 'A2', name: 'Applicot' },
    { id: 'A3', name: 'Action' },
    { id: 'A4', name: 'Bison' },
    { id: 'A5', name: 'Elephen' },
    { id: 'A6', name: 'Eleven' },
    { id: 'A7', name: 'Boston' },
    { id: 'A8', name: 'CPP' },
    { id: 'A9', name: 'Capture' },
    { id: 'A10', name: 'Tiger' },
]

let items2 = [
    'Apple',
    'Applicot',
    'Action',
    'Bison',
    'Elephen',
    'Eleven',
    'Boston',
    'CPP',
    'Capture',
    'Tiger',
]

let arr = new NArray.MultiSelectDataSource()
let iCase = 1
switch (iCase) {
    case 1: //- object array
        arr.datasource = items
        arr.idMember = 'id'
        arr.valueMember = 'name'
        arr.caseSensitive = false
        //arr.filter = 'ti'
        break;
    case 2: //- simple array
        arr.datasource = items2;
        arr.idMember = ''
        arr.valueMember = '';
        arr.caseSensitive = false
        arr.filter = 'ti'
        break;
}
//console.log(arr.datasource)

switch (iCase) {
    case 1: //- object array
        arr.selectId('A2');
        arr.selectId('A3');
        arr.selectValue('elevEN');
        arr.filter = 'ti'
        break;
    case 2: //- simple array
        arr.selectId(1);
        arr.selectId(2);
        arr.selectValue('elevEN');
        break;
}
//console.log(arr.indexOf('aPPliCot'));

//console.log(arr.selectedIds)
//console.log(arr.selectedItems)
//console.log(arr.datasource.length);
//console.log(arr.selectedItems.length)
//console.log(arr.currentItems.length)
console.log(arr.currentItems)

//arr.clearSelection();
//console.log(arr.currentItems)
*/
//#endregion

//#region First attemp
/*
let cmdDS = new NArray.NestedDataSource()
cmdDS.itemsource(commands);
let qsetDS = new NArray.NestedDataSource()
qsetDS.itemsource(qsets, cmdDS);

let state = [
    { id: '1', text: 'QSets', items: [
        { qsetid: 'QS0001', qstext: '' },
        { qsetid: 'QS0001', qstext: '' },
        { qsetid: 'QS0001', qstext: '' },
    ] },
    { id: '2', text: 'Questions', items: [] },
    { id: '3', text: 'Date', items: [] },
    { id: '4', text: 'Branchs', items: [] },
    { id: '5', text: 'Orgs', items: [] },
    { id: '6', text: 'Staffs', items: [] },
]

class StateManager {
    constructor() {
        let self = this;
        this._root = new State(this);
        this._current = this._root;
        this._obj = { };
    };

    select(item, getitems) {
        if (!item) {
            // not assigned goto root state.
            this._current = this._root;
            return;
        }
        let state = new State(this);
        state.parentState = this._current;
        state.parentItem = item;
        state.getitems = getitems;

        this._current = state;
    };

    get root() { return this._root; }
    get current() { return this._current; }
    get obj() { return this._obj; }
    get items() {
        if (this._current) {
            return this._current.items;
        }
        return null;
    }
};

class State {
    constructor(sm) {
        this._sm = sm;
        this._items = null;
        this._parentState = null;
        this._parentItem = null;
        //this._children = null;
        this._getitemsCB = null;
    };
    // callback(s).
    get getitems() { return this._getitemsCB; }
    set getitems(value) {
        this._getitemsCB = value;
        this._items = null;
    }

    get manager() { return this._sm; }
    get parent() { return this._parentState; }
    set parentState(value) {
        if (this._parentState != value) {
            this._parentState = value;
        }
    }
    get parentItem() { return this._parentItem; }
    set parentItem(value) {
        if (this._parentItem != value) {
            this._parentItem = value;
        }
    }
    get items() {
        if (!this._items) {
            if (this._getitemsCB) {
                this._items = this._getitemsCB(this._parentItem);
            }
        }
        return this._items;
    }
};

let sm = new StateManager();
sm.root.getitems = () => { return commands; };
//console.log(sm.current);
//console.log(sm.current.item)
let item;

// select command 1 - QSets
let cmdSelector = (x) => {
    let items = null;
    if (Object.keys(x).indexOf('id') !== -1) {
        // command lists
        if (!sm.obj.qset) {
            // no qset selected.
            console.log('No qset select so qsets returns.');
            items = qsets;
        }
        else {
            // qset is selected.
            console.log('qset is select so returns related array.');
            if (x.id === 'cmd1') items = qsets;
            else if (x.id === 'cmd2') items = questions;
            else { 

            }
        }        
    }
    return items;
}
item = sm.items[1]; 
sm.select(item, cmdSelector);
console.log(sm.items);

// select QSet - index 2 -> QS0003 after that the command list returns.
let qsetSelector = (x) => {
    let items = null;
    if (Object.keys(x).indexOf('qsetid') !== -1) {
        sm.obj.qset = item;
    }
    return items;
}
item = sm.items[2];
console.log(item)
sm.select(item, qsetSelector);
console.log(sm.items);

sm.select(); // back to root state.
console.log(sm.items);
item = sm.items[2];
sm.select(item);
console.log(sm.items);

// select command 2 - Questions
let quesSelector = (x) => {
    let items = null;
    if (Object.keys(x).indexOf('qsseq') === -1) {
    }
    return items;
}
item = sm.items[1];
console.log(item)
sm.select(item, quesSelector);
console.log(sm.items);

*/
//#endregion

//#region Second attemp
/*
class StateManager {
    constructor() {
        this._state = {};
        this._data = {};
    };
    // public methods
    clearState() { this._state = {}; };
    clearData() { this._data = {}; };
    // public properties
    get data() { return this._data; }
    get state() { return this._state; }

    getstate(name) {
        let result = null;
        let sName = name.trim().toLowerCase();
        let states = Object.keys(this._state);
        let idx = states.indexOf(sName);
        if (idx === -1) {
            console.error('state not found.');
        }
        else {
            result = this._state[sName];
        }
        return result;
    };
};

class NState {
    constructor(manager, name) {
        this._sm = manager;
        this._name = name;
        this._items = null;
        if (this._sm) {
            let states = Object.keys(this._sm.state);
            let sName = this._name.trim().toLowerCase();
            let idx = states.indexOf(sName);
            if (idx === -1) {
                // state not exists. so attach current state.
                this._sm.state[sName] = this;
            }
            else {
                console.error('State already exists.');
            }
        }
    };
    // public properties
    get manager() { return this._sm; }
    get name() { return this._name; }
    get items() { return this._items; }
    set items(value) { this._items = value; }
};

let sm = new StateManager();
let commmandState = new NState(sm, 'commands');
commmandState.items = commands;
let qsetState = new NState(sm, 'qsets');
qsetState.items = qsets;
let questionState = new NState(sm, 'questions');
questionState.items = questions;
*/
//#endregion

//#region Third attemp
/*
//#region NArray.StateManger
NArray.NStateManager = class {
    constructor() {
        this._states = [];
        this._data = {};
        this._nav = null;
    };
    // public methods
    get states() { return this._states; }
    state(name, opts) {
        let result = undefined;
        if (!this._states) this._states = {}; // create if null or undefined.
        if (!arguments) return result
        if (arguments.length === 0) return result;
        if (arguments.length >= 1) {
            let sName = (name) ? name.trim().toLowerCase() : result;
            if (!sName) {
                console.error('name parameter not assigned.');
                return result;
            }
            let maps = this._states.map(state => state.name );
            let idx = maps.indexOf(sName);
            if (arguments.length === 1) {
                // get state by name.
                if (idx === -1) return result;
                result = this._states[idx];
            }
            else {
                // set state by name with spefificed value.
                let nObj = new NArray.NState(this, sName, opts);
                nObj.refresh(); // refresh when new state assigned.
                if (idx === -1) 
                    this._states.push(nObj);
                else this._states[idx] = nObj;
                // set result
                result = nObj;
            }
        }
        return result;
    };
    clear() {
        this._states.splice(0); // remove all.
    };
    clearData() {
        this._data = {};
    };
    refresh(bClearData) {
        this._states.forEach(state => state.refresh() );
        if (bClearData) this.clearData();
    };
    // public properties
    get data() { return this._data; }
    set data(value) {
        if (this._data != value) {
            this._data = value;
            if (!this._data) this._data = {};
        }
    }
    get nav() { return this._nav; }
    set nav(value) { 
        // required to check assigned value exists in state list.
        this._nav = value;
    }
};

//#endregion

//#region NArray.NState

NArray.NState = class {
    constructor(stateManager, name, opts) {
        if (!name || name.trim().length === 0) {
            throw new Error('Name parameter is not assigned.');
        }
        this._sm = stateManager;
        this._name = name.trim().toLowerCase();
        this._opts = opts;
        this._ds = new NArray.AutoFilterDataSource();
        this._ds.caseSensitive = false;
    };
    // public methods.
    refresh() {
        if (!this._ds) {
            console.error('Internal datasource is null.');
            return;
        }
        this._ds.datasource = null;
        if (this.binding) {
            if (this.binding.valueMember) {
                // set binding properties.
                let sMember = String(this.binding.valueMember)
                this._ds.valueMember = sMember;
            }
            else {
                //console.log('displayMember not assigned.');
            }
        }
        if (this.functions && this.functions.getDataSource) {
            this._ds.datasource = this.functions.getDataSource();
        }
    };
    getitem(value) {
        let result = null;
        if (!this.items) return result;
        if (!this._ds) return result;
        let idx = this._ds.indexOf(value);
        if (idx !== -1) result = this._ds.getitem(idx);
        return result;
    };
    selectItem(value) {
        let result = undefined;
        if (!this._sm) return result;
        let item = this.getitem(value);
        if (!item) return result;
        if (this.functions && this.functions.selectItem) {
            result = this.functions.selectItem(this._sm, this, item);
        }
        return result;
    };
    // public properties.
    get manager() { return this._sm; }
    get name() { return this._name; }

    get binding() { 
        return (this._opts && this._opts.binding) ? this._opts.binding : null;
    }
    get functions() {
        return (this._opts && this._opts.functions) ? this._opts.functions : null;
    }
    get datasource() { return this._ds.datasource; }
    get valueMember() { return this._ds.valueMember; }
    get filter() { return this._ds.filter; }
    set filter(value) { this._ds.filter = value; }
    get items() { return this._ds.items }
};
// overrides methods.
NArray.NState.prototype.toString = function() {
    return `${this.name}`;
};

//#endregion

//#region Test NArray.NStateManger

let commands = [
    { id: 'cmd1', text: '1. QSets' },
    { id: 'cmd2', text: '2. Questions' },
    { id: 'cmd3', text: '3. Date' },
    { id: 'cmd4', text: '4. Branchs' },
    { id: 'cmd5', text: '5. Orgs' },
    { id: 'cmd6', text: '6. Staffs' }
];

let qsets = [
    { qsetid: 'QS0001', qsetdescription: 'Performance QSet' },
    { qsetid: 'QS0002', qsetdescription: 'Service QSet' },
    { qsetid: 'QS0003', qsetdescription: 'Quality QSet' }
];

let questions = [
    { qsetid: 'QS0001', qseq: "1", quesText: 'How fast you problem solved?.' },
    { qsetid: 'QS0001', qseq: "2", quesText: 'What do you think about our performance?.' },
    { qsetid: 'QS0002', qseq: "1", quesText: 'What do you think aout our service?.' },
    { qsetid: 'QS0002', qseq: "2", quesText: 'What do you think aout our staff?.' },
    { qsetid: 'QS0003', qseq: "1", quesText: 'What do you think aout our food quality?.' },
    { qsetid: 'QS0003', qseq: "2", quesText: 'What do you think aout our food teste?.' }
];

let stateData = {
    // current command
    current: '',
    // select qset item
    qsets: null,
    // selected questions
    quets: [],
    // selected date
    date: {
        begin: null, end: null
    },
    branchs: [],
    orgs: [],
    members: []
}
//let state = new NArray.NState(sm) // invalid
//let state = new NArray.NState(sm, null) // invalid
//let state = new NArray.NState(sm, '') // invalid
//let state = new NArray.NState(sm, 'x') // valid.
let nav = {
    state: {
        current: null,
        commands: null,
        qsets: null,
        questions: null,
        date: null,
        branchs: null,
        orgs: null,
        members: null
    },
    getCurrent: (manager) => {
        if (!manager) return null;
        let smData = manager.data;
        let result = null;
        if (!smData.qsets) {
            result = manager.nav.state.qsets;
        }
        else {
            if (smData.current === '' || smData.current === 'commands') {
                result = manager.nav.state.commands;
            }
            else if (smData.current === 'qsets') {
                result = manager.nav.state.qsets;
            }
        }
        manager.data.current = (result) ? result.name : '';
        return result;
    }
}

let sm = new NArray.NStateManager()
sm.data = stateData;
sm.nav = nav;

nav.state.commands = sm.state('commands', {
    binding: { valueMember: 'text' },
    functions: {
        getDataSource(manager) {
            return commands;
        },
        selectItem(manager, state, item) {
            // check item
            if (!item) return state;
        }
    }
})
nav.state.qsets = sm.state('qsets', {
    binding: { valueMember: 'qsetdescription' },
    functions: {
        getDataSource(manager) {
            return qsets;
        },
        selectItem(manager, state, item) {
            // check item
            if (!item) return state;
            // qset item selected so assigned to state manager data.
            manager.data.qsets = item;
        }
    }
})
nav.state.questions = sm.state('questions', {
    binding: { valueMember: 'quesText' },
    functions: {
        getDataSource(manager) {
            return questions;
        },
        selectItem(manager, state, item) {

        }
    }
})

//console.log(sm.states)
//sm.clear();
//console.log(sm.states)

//console.log(cmdSTATE.datasource)
//console.log(cmdSTATE.items)
//cmdSTATE.filter = 'qu'
//console.log(cmdSTATE.items)

console.log(nav.state.commands.toString())

// STEP 1. Nothing.
sm.nav.state.current = nav.getCurrent(sm)
//console.log(nav.state.qsets.items);
//console.log(sm.nav.state.current.items);

//console.log(sm.nav.state.current.name)
sm.nav.state.current.selectItem('Performance QSet')
//console.log(sm.data)
sm.nav.state.current = sm.nav.state.commands
console.log(sm.nav.state.current.items);

//#endregion
*/
//#endregion

//#region Forth attemp --> current working
/*
let commands = [
    { id: 'cmd1', text: '1. QSets' },
    { id: 'cmd2', text: '2. Questions' },
    { id: 'cmd3', text: '3. Date' },
    { id: 'cmd4', text: '4. Branchs' },
    { id: 'cmd5', text: '5. Orgs' },
    { id: 'cmd6', text: '6. Staffs' }
];

let qsets = [
    { qsetid: 'QS0001', qsetdescription: 'Performance QSet' },
    { qsetid: 'QS0002', qsetdescription: 'Service QSet' },
    { qsetid: 'QS0003', qsetdescription: 'Quality QSet' }
];

let questions = [
    { qsetid: 'QS0001', qseq: "1", quesText: 'How fast you problem solved?.' },
    { qsetid: 'QS0001', qseq: "2", quesText: 'What do you think about our performance?.' },
    { qsetid: 'QS0002', qseq: "1", quesText: 'What do you think aout our service?.' },
    { qsetid: 'QS0002', qseq: "2", quesText: 'What do you think aout our staff?.' },
    { qsetid: 'QS0003', qseq: "1", quesText: 'What do you think aout our food quality?.' },
    { qsetid: 'QS0003', qseq: "2", quesText: 'What do you think aout our food teste?.' }
];
*/
//#endregion