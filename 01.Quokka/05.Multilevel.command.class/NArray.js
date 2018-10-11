//#region NArray

class NArray {
    /**
     * Create value map for spefificed array.
     * 
     * @param {Array} items The source array to create map.
     * @param {String} member The element property's name to get value.
     * @param {Boolean} lowerCase true for convert value to lowercase.
     */
    static map(items, member, lowerCase) {
        let results = null;
        if (!items) return results;
        // inline helper function.
        let isString = value => (typeof value === 'string');
        let hasMember = (item, name) => (Object.keys(item).indexOf(name) !== -1);
        // local variables
        results = items.map(item => {
            let val = (member && hasMember(item, member)) ? item[member] : item;
            return (isString(val) && lowerCase) ? String(val).toLowerCase() : val;
        });
        return results;
    };
    /**
     * Create new array from source array with exclude items or values in exclude array.
     * 
     * @param {Array} items The source array.
     * @param {Array} excludes The Array that contains items or values to exclude.
     * The exclude array must be same structure as source array or can be simple array
     * that contains only values (must be same data type as item's member) to exclude.
     * @param {String} member The element property's name to get value.
     * @param {Boolean} ignoreCase true for ignore case with compare.
     * @param {Boolean} compareAsString true for convert value to string for compare.
     */
    static exclude(items, excludes, member, ignoreCase, compareAsString = true) {
        let results = null;
        if (!items) return results;
        if (!excludes) return items;
        // inline helper function.
        let isString = value => (typeof value === 'string');
        // local vars.
        let idx, val, oVal, exmaps;
        // init exclude maps.
        exmaps = NArray.map(excludes, member, ignoreCase);
        exmaps = (compareAsString) ? exmaps.map(elem => String(elem)) : exmaps;

        results = items.filter(item => {
            val = (member) ? item[member] : item;
            oVal = (isString(val) && ignoreCase) ? val.toLowerCase() : val;
            idx = (compareAsString) ? exmaps.indexOf(String(oVal)) : exmaps.indexOf(oVal);
            return (idx === -1); // returns results if not found in exclude map.
        });
        return results;
    };
    /**
     * Gets filter items from specificed source array and filter string.
     * Returns object that contains 
     * items array (the filter items),
     * values array (the value of item's member that match filter),
     * indexes array (the index of item in source array) and
     * parts array that contains match information on each item.
     * 
     * @param {Array} items The source array.
     * @param {String} filter The filter string.
     * @param {String} member The element property's name to filter value.
     * @param {Boolean} ignoreCase true for ignore case with compare.
     */
    static filter(items, filter, member, ignoreCase = true) {
        // prepare results.
        let result = { items: null, values: null, indexes: null, parts: null };
        if (!items) return result;

        let sFilter = (ignoreCase) ? filter.toLowerCase() : filter;
        // get maps of all items
        let srcs = NArray.map(items, member, false); // with case sensitive.        
        let maps = NArray.map(items, member, ignoreCase); // with ignoreCase option.
        // filter
        let values = [], indexes = [];
        let matchs = maps.filter((elem, index) => {
            let val = (ignoreCase) ? String(elem).toLowerCase() : String(elem);
            let found = val.indexOf(sFilter) !== -1;
            if (found) {
                values.push(srcs[index]); // keep value of source item (case sensitive).
                indexes.push(index); // keep index of source item.
            }
            return found;
        });
        // build results.
        let outs = [], vals = [], idxs = [], parts = [];
        matchs.forEach((elem, index) => {
            let sVal = (ignoreCase) ? String(elem).toLowerCase() : String(elem);
            let ipos = sVal.indexOf(sFilter);
            if (ipos === -1) return; // item not match filter.

            let aVal = String(values[index]); // get source value from values array.
            // extract parts.
            let part = {
                pre: aVal.substr(0, ipos),
                match: aVal.substr(ipos, sFilter.length),
                post: aVal.substr(ipos + sFilter.length, elem.length - (ipos + sFilter.length))
            }
            outs.push(items[indexes[index]]); // append to items array.
            vals.push(values[index]) // append to values array.
            idxs.push(indexes[index]) // append to indexes array.
            parts.push(part); // append to parts array.
        });
        // set result arrays and returns.
        result.items = outs;
        result.values = vals;
        result.indexes = idxs;
        result.parts = parts;
        return result;
    };
};

//#endregion

//#region NArray.map - Test
/*
// simple array
let ds1 = [1, 2, 3, 4, 5]
console.log(NArray.map(ds1))
// object array
let ds2 = [{ id: 1, text: 'One'}, { id: 2, text: 'Two'}]
console.log(NArray.map(ds2))
console.log(NArray.map(ds2, 'text'))
console.log(NArray.map(ds2, 'text', true))
*/
//#endregion

//#region NArray.exclude - Test
/*
// object array
let ds1 = [
    { id: 1, text: 'One'}, 
    { id: 2, text: 'Two'},
    { id: 3, text: 'Three'},
    { id: 4, text: 'Four'},
    { id: 5, text: 'Five'}
]
let results;
let ds2 = ['1', 3, 5]
results = NArray.exclude(ds1, ds2, 'id', true) // compare as string (default)
console.log(results)
results = NArray.exclude(ds1, ds2, 'id', true, false) // compare as value
console.log(results)

let ds3 = ['FIVE', 'TWO', 'FOUR']
results = NArray.exclude(ds1, ds3, 'text', true) // compare as string (default)
console.log(results)

let ds4 = [
    { id: 2, text: 'Two'},
    { id: '3', text: 'Three'},
    { id: 4, text: 'Four'},
]
results = NArray.exclude(ds1, ds4, 'id', true) // compare as string (default)
console.log(results)
results = NArray.exclude(ds1, ds4, 'id', true, false) // compare as value
console.log(results)
*/
//#endregion

//#region NArray.filter - Test
/*
let ds1 = [
    { id: 1, text: 'Apple'}, 
    { id: 2, text: 'Banana'},
    { id: 3, text: 'Bean'},
    { id: 4, text: 'Cantalop'},
    { id: 5, text: 'Camara'},
    { id: 6, text: 'Plane'},
    { id: 7, text: 'Tiger'},
    { id: 8, text: 'Zebra'},
    { id: 9, text: 'Rat'},
    { id: 10, text: 'Cat'},
    { id: 11, text: 'Lion'},
    { id: 12, text: 'Option'},
    { id: 13, text: 'Operation'},
    { id: 14, text: 'Application'},
    { id: 15, text: 'Elephen'},
    { id: 16, text: 'Eleven'},
    { id: 17, text: 'Organic'},
    { id: 18, text: 'Rambutan'},
    { id: 19, text: 'Question'},
    { id: 20, text: 'Horse'},
    { id: 21, text: 'House'},
    { id: 22, text: 'Home'},
    { id: 23, text: 'Organization'},
    { id: 24, text: 'My Computer'},
    { id: 25, text: 'Your customer'},
    { id: 26, text: 'Our partners'}
]
let result;

result = NArray.filter(ds1, 'oR', 'text')
console.log(result.items);
console.log(result.values);
console.log(result.indexes);
console.log(result.parts);

result = NArray.filter(ds1, 'or', 'text', false)
console.log(result.items);
console.log(result.values);
console.log(result.indexes);
console.log(result.parts);

result = NArray.filter(ds1, ' c', 'text')
console.log(result.items);
console.log(result.values);
console.log(result.indexes);
console.log(result.parts);
*/
//#endregion
