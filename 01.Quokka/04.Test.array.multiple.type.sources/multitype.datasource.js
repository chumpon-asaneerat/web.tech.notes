//#region NLib Event Classes

/**
 * NDelegate class. The .NET like delegate.
 */
class NDelegate {
    constructor() {
        this._locked = false;
        this._events = [];
    };
    //-- public methods.
    indexOf(value) {
        if (value && value instanceof Function)
            return this._events.indexOf(value);
        else return -1;
    };
    add(value) {
        if (value && value instanceof Function) {
            let index = this.indexOf(value);
            if (index === -1)
                this._events.push(value); // append.
            else this._events[index] = value; // replace.
        }
    };
    remove(value) {
        if (value && value instanceof Function) {
            let index = this.indexOf(value);
            if (index >= 0 && index < this._events.length) {
                this._events.splice(index, 1); // delete.
            }
        }
    };
    locked() { this._locked = true; };
    unlocked() { this._locked = false; };
    get isLocked() { return this._locked; };
    invoke(...args) {
        if (this._locked) return;
        let evtDataObj = this.createEventData(args);
        this._events.forEach((evt) => { this.raiseEvent(evt, evtDataObj); });
    };
    createEventData(...args) { return args; };
    raiseEvent(evt, evtDataObj) { evt(evtDataObj) };
};
/**
 * EventHandler class. The .NET like EventHandler.
 */
class EventHandler extends NDelegate {
    //-- overrides
    createEventData(...args) {
        let sender = null;
        let evtData = null;

        if (args && args.length >= 1 && args[0]) {
            var a0 = args[0];
            if (a0.length >= 1) sender = a0[0];
            if (a0.length >= 2) evtData = a0[1];

            if (!evtData) { evtData = { sender: null, handled: false }; }
        }
        return { "sender": sender, "evtData": evtData }
    };

    raiseEvent(evt, evtDataObj) {
        let evtData = (!evtDataObj) ? { sender: null, handled: false } : evtDataObj.evtData;

        if (!evtData) { evtData = { handled: false }; }

        if (typeof evtData.handled === 'undefined' || evtData.handled === null)
            evtData.handled = false;

        if (!evtData.handled) { evt(evtDataObj.sender, evtData); }
    };
};
/**
 * The Event Args class. The .NET like EventArgs.
 */
class EventArgs { static get Empty() { return null; } };
/**
 * The DataSource class.
 */
class DataSource {
    //-- constructor.
    constructor() {
        this._datasource = null;
        this._selectedIndex = -1;
        this._datasourceChanged = new EventHandler();
        this._selectedIndexChanged = new EventHandler();
    };
    //-- protected methods.
    onDatasourceChange() { };
    onSelectedIndexChange() { };
    //-- public properties.
    get datasource() { return this._datasource; };
    set datasource(value) {
        let oVal = this._datasource;
        let nVal = value;

        if (value && (value instanceof Array)) {
            this._datasource = value;

            this._datasourceChanged.invoke(this, { "oldValue": oVal, "newValue": nVal });

            if (this._datasource && this._datasource.length > 0)
                this.selectedIndex = 0;
            else this.selectedIndex = -1;
            // call protected method.
            this.onDatasourceChange();
        }
    };

    get selectedIndex() { return this._selectedIndex; };
    set selectedIndex(value) {        
        let oVal = this._selectedIndex;
        let nVal = -1;

        if (!this._datasource ||
            value < 0 || value >= this._datasource.length) {
            nVal = -1;
            this._selectedIndex = -1;
        }
        else {
            nVal = value;
            this._selectedIndex = value;
        }
        // call protected method.
        this.onSelectedIndexChange();
        // raise event
        this._selectedIndexChanged.invoke(self, { "oldValue": oVal, "newValue": nVal })
    };

    get selectedObject() {
        if (!this.datasource ||
            this.selectedIndex < 0 || this.selectedIndex >= this.datasource.length)
            return null;
        else return this.datasource[this.selectedIndex];
    };
    //-- event handlers.
    get datasourceChanged() { return this._datasourceChanged; };
    get selectedIndexChanged() { return this._selectedIndexChanged; };
};

//#endregion

//#region NArray and related classes

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
    unselectValue(value) {
        let idx = this.indexOf(value);
        if (idx === -1) return;
        let isIndex = (!this._idMember || this._idMember === '');
        if (isIndex)
            this.unselectId(idx);
        else {
            let item = this._ds[idx];
            if (!item) return -1;
            let sId = String(item[this._idMember]);
            this.unselectId(sId);
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
            // reset array for recalculate.
            this._selectedItems = null;
            this._currentItems = null;
        }
    };
    unselectId(id) {
        if (!this._selectedIds) this._selectedIds = [];
        let isIndex = (!this._idMember || this._idMember === '');
        let sId;        
        if (isIndex) sId = String(id); // force to string.
        else sId = (id) ? String(id).trim().toLowerCase() : null;
        if (!sId) return;
        //console.log(sId);
        let idx = this._selectedIds.indexOf(sId);
        //console.log(idx);
        if (idx !== -1) {
            this._selectedIds.splice(idx, 1);
            // reset array for recalculate.
            this._selectedItems = null;
            this._currentItems = null;
        }
    };
    selectAll() {
        if (!this._selectedIds) this._selectedIds = [];
        let isIndex = (!this._idMember || this._idMember === '');
        let items = this.currentItems;
        if (!items || items.length <= 0) return;
        let pName = this._idMember;
        let sId;
        let self = this;
        items.forEach(item => {
            if (isIndex) sId = String(item)
            else sId = String(item[pName]);
            this.selectId(sId);
        });
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
                this._selectedItems = [];
                let oItems;
                ids.forEach(sId => {
                    if (hasIdMember) {
                        oItems = this._ds.filter((item) => {
                            let sItem = getitem(item);
                            return (sId === sItem);
                        });
                        if (oItems && oItems.length > 0) this._selectedItems.push(oItems[0]);
                    }
                    else {
                        let oItem = this._ds[sId];
                        this._selectedItems.push(oItem);
                    }
                });
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

//#endregion
