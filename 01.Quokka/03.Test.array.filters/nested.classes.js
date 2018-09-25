//#region Sample 1 - use class as namespace
/*
class Car {
    constructor(name, engine) {
        this._name = name;
        this._engine = new Car.Engine();
        this._engine.name = engine;
    };
    toString() {
        // sample how to used string template.

        // ** below code not work due to used ' or " is
        // ** make template look like normal string.
        //return '${this._name} ${this._engine}';

        return `${this._name} ${this._engine.name}`;
    };
};

class Local { 
    constructor() { this._name = ''; };
    get name() { return this._name; }
    set name(value) { this._name = value; }
}

Car.Engine = class extends Local { };

let car = new Car('toyota', 'v6');
console.log(car.toString());
*/
//#endregion

//#region Sample 2 - subclass

/*
class Plus { add(a, b) { return a + b} }
class Minus extends Plus { sub(a, b) { return a - b } }
class SimpleCalc extends Minus { }

let calc = new SimpleCalc();
console.log(calc.add(1, 1));
console.log(calc.sub(1, 1));
*/
//#endregion

//#region Sample 3 - class that extends array (may has problem when actual used)
/*
class ObjectArray extends Array {
    constructor(...args) { 
        super(...args); // required.
        this._valueMember = '';
        this._caseSensitive = false;
    };

    indexOf(searchElement, fromIndex) {
        if (!this._valueMember || this._valueMember.trim().length <= 0) {
            return super.indexOf(searchElement, fromIndex);
        }
        else {
            let self = this;
            //console.log(self._caseSensitive);
            let map = super.map(elem => {
                let result = elem[this._valueMember];
                return (self._caseSensitive) ? result : result.toLowerCase();
            });
            //console.log(map);
            let sch = (self._caseSensitive) ? searchElement : searchElement.toLowerCase();
            return map.indexOf(sch, fromIndex);
        }
    };

    get valueMember() { return this._valueMember; }
    set valueMember(value) {
        if (this._valueMember != value) {
            this._valueMember = value;
        }
    }

    get caseSensitive() { return this._caseSensitive; }
    set caseSensitive(value) {
        if (this._caseSensitive != value) {
            this._caseSensitive = value;
        }
    }
}

class FilterArray extends ObjectArray {
    constructor(...args) {
        super(...args); // required.
    };

    search(value) {
        let searchFor = (this.caseSensitive) ? value : value.toLowerCase();
        let fn = (elem) => { 
            let item = elem[this.valueMember];
            let str = (this.caseSensitive) ? item : item.toLowerCase();             
            return (str.indexOf(searchFor) !== -1);
        }
        return super.filter(fn);
    };
}

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
]

//let arr = new ObjectArray(...items);
let arr = new FilterArray(...items);
//console.log(arr);
arr.valueMember = 'name'
arr.caseSensitive = false
let idx = arr.indexOf('cpp')
console.log(idx);

let searchFor = 'pp'
let results = arr.search(searchFor)
console.log(results)
console.log(results.length)
*/
//#endregion

//#region Sample 4 - Inline function for check variable type.
/*
let items = [];
let isArray = (value) => { return (value && value instanceof Array) };
let isString = (value) => { return (value && value instanceof String) };
let isNumber = (value) => { return (value && value instanceof Number) };
console.log(isArray(items));
console.log(String(null));
*/
//#endregion

//#region Sample 5 - classes that work with array (NArray)

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

//#region Test NArray classes
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

let arr = new NArrray.AutoFilterDataSource()
//arr.datasource = items
//arr.valueMember = 'name'
arr.datasource = items2;
arr.caseSensitive = false
arr.filter = 'ti'
console.log(arr.items)
console.log(arr.parts)
*/
//#endregion

//#endregion

//#region Sample 6 - HTML in Quokka

/*
let body = document.getElementsByTagName('body')
body.innerHTML = '<h1>Hello</h1>'
console.log(body[0].childNodes)
*/

//#endregion

//#region Sample 7 - Nested Collection for auto-fill.
/*
class AutoFill {
    constructor() {};
};
*/
//#endregion