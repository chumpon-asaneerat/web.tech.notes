class AutoFillDataSet {
    constructor(options) {
        this._opts = options || {};
        this._filter = '';
        this._items = [];
    };

    apply(filter) {
        if (this._filter !== filter) {}
    };

    get options() { return this._opts; };
    get items() { return this._items; };
};

let opts = {};
let ds = new AutoFillDataSet(opts);
console.log(ds.items);
ds.apply('');
console.log(ds.items);