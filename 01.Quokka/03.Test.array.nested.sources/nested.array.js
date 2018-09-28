//#region NArrray

class NArrray { };

//#endregion

//#region NArrray.CaseSensitiveDataSource

NArrray.CaseSensitiveDataSource = class {
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
        if (this._values && this._values.length !== this._items.length) {
            // already create values map but seem size is difference
            // so reset the values map.
            this.refresh();
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

//#region NArrray.AutoFilterDataSource

NArrray.AutoFilterDataSource = class {
    constructor() {
        this._ds = new NArrray.CaseSensitiveDataSource();
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
                let filter = this._input;
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

//#region NArrray.NestedDataSource

NArrray.NestedDataSource = class {
    constructor() {
        this._parent = null;
        this._items = null;
    };

    itemsource(value, parent) {
        this._items = value;
        this._parent = parent;
    };
    get parent() { return this._parent; }
    get items() { return this._items; }
};

//#endregion

//#region NArrray.

//#endregion

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
    { qsetid: 'QS0001', qseq: "1", qsetdescription: 'How fast you problem solved?.' },
    { qsetid: 'QS0001', qseq: "2", qsetdescription: 'What do you think about our performance?.' },
    { qsetid: 'QS0002', qseq: "1", qsetdescription: 'What do you think aout our service?.' },
    { qsetid: 'QS0002', qseq: "2", qsetdescription: 'What do you think aout our staff?.' },
    { qsetid: 'QS0003', qseq: "1", qsetdescription: 'What do you think aout our food quality?.' },
    { qsetid: 'QS0003', qseq: "2", qsetdescription: 'What do you think aout our food teste?.' }
];


/*
// First attemp
let cmdDS = new NArrray.NestedDataSource()
cmdDS.itemsource(commands);
let qsetDS = new NArrray.NestedDataSource()
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
