//#region NArray and related classes

//#region NArray

class NArray {
    /**
     * Create value map for spefificed array.
     * 
     * @param {Array} items The source array to create map.
     * @param {String} member The element property's name to get value.
     * @param {Boolean} lowerCase true for convert value to lowercase.
     */
    static map(items, member, lowerCase = true) {
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
     * Create multiple value maps for spefificed array.
     * 
     * @param {Array} items The source items.
     * @param {Array} members The member name array to gernate map array.
     * @param {Boolean} lowerCase True for convert value to string lowercase.
     */
    static maps(items, members, lowerCase = true) {
        let result = null;
        let isArray = value => (value instanceof Array);
        let isString = value => (typeof value === 'string');
        if (!items || items.length <= 0) return result;
        let omembers;
        let bValue = isString(members);
        if (bValue) omembers = [ members ];
        let bArray = isArray(members);
        if (bArray) omembers = members;
        if (!omembers) return result; // cannot create member array.
        // create lookup object
        result = {};
        items.forEach(item => {
            omembers.forEach(omember => {
                let smem = String(omember);
                if (!result[smem]) result[smem] = [];
                let oVal = String(item[smem]);
                let sVal = (lowerCase) ? oVal.toLowerCase() : oVal;
                result[smem].push(sVal);
            })
        });
        return result;
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
    /**
     * Gets array which all items in source array that has all members's value match in lookup array.
     * The source array is acts like child table in database.
     * The lookup array is acts like master table in database.
     * 
     * @param {Array} items The source (or child) array.
     * @param {Array} members The source Mambers
     * @param {Array} lookupItems The lookup (or master) array.
     * @param {Array} lookupMembers The lookup Members
     * @param {Boolean} ignoreCase true for ignore case with compare.
     */
    static inArray(items, members, lookupItems, lookupMembers, ignoreCase = true) {
        let results = null;
        let isArray = value => (value instanceof Array);
        let isString = value => (typeof value === 'string');

        if (!isArray(items)) return results;
        if (!isArray(lookupItems)) return results;

        if (!items || items.length <= 0) return results;
        if (!lookupItems || lookupItems.length <= 0) return results;

        let smembers, lmembers;

        let bothIsValue = (isString(members) && isString(lookupMembers));
        if (bothIsValue) {
            // make an local array.
            smembers = [ members ];
            lmembers = [ lookupMembers ];
        }

        let bothIsArray = (isArray(members) && isArray(lookupMembers));
        if (bothIsArray) {
            if (members && lookupMembers && members.length !== lookupMembers.length) {
                console.error('Number of members not match');
                return results;
            }
            // set to local array.
            smembers = members;
            lmembers = lookupMembers;
        }

        if (!smembers || !lmembers) return results; // cannot create both member array.
        // create lookup object
        let lookup = NArray.maps(lookupItems, lookupMembers, ignoreCase);

        results = items.filter(item => {
            let matchCnt = 0;
            for (let i = 0; i < smembers.length; ++i) {
                let smember = String(smembers[i]);
                let dmember = String(lmembers[i]);
                let oVal = String(item[smember]);
                let sVal = (ignoreCase) ? oVal.toLowerCase() : oVal;
                // find is current src item's value is in desc value lookup array.
                let idx = lookup[dmember].indexOf(sVal)
                if (idx !== -1) matchCnt++; // found so increase match count.
            }
            return (matchCnt === smembers.length);
        });

        return results;
    };
};

//#endregion

//#region NArray.Date (helper for generate date related array)

NArray.Date = class {
    /**
     * Gets Current Year.
     */
    static get currentYear() { return Number(new Date().getFullYear()); };
    /**
     * Create array of past years from current year with specificed parameter.
     * i.e. if delta is 2 and current year is 2012 the result is 2010, 2011, 2012.
     * 
     * @param {Number} delta The number of past years to generate.
     * @param {Boolean} asObj True to returns object instead of single value. Default is true.
     */
    static getYears(delta, asObj = true) {
        let currYr = Number(new Date().getFullYear());
        let idalta = (delta) ? delta : 5;
        let stYr = currYr - idalta;
        let edYr = currYr;
        let years = [];
        for (let i = stYr; i <= edYr; i++) {
            if (asObj)
                years.push({ id:i, text: String(i) });
            else years.push(i);
        }
        return years;
    };
    /**
     * Gets Month array.
     * 
     * @param {Boolean} asObj True to returns object instead of single value. Default is true.
     */
    static getMonths(asObj = true) {
        let results = [];
        for(var i = 1; i <= 12; i++) {
            if (asObj)
                results.push({ id:i, text: String(i) });
            else results.push(i);
        }
        return results;
    };
    /**
     * Gets days array by specificed year and month.
     * 
     * @param {Number} year The target year.
     * @param {Number} month The target month.
     * @param {Boolean} asObj True to returns object instead of single value. Default is true.
     */
    static getDays(year, month, asObj = true) {
        let results = [];
        if (!year) return results;
        if (!month) return results;
        let maxDays = new Date(year, month, 0).getDate();
        for(var i = 1; i <= maxDays; i++) {
            if (asObj)
                results.push({ id:i, text: String(i) });
            else results.push(i);
        }
        return results;
    };
};

//#endregion

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
console.log(NArray.map(ds2, 'text', false))
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

//#region NArray.maps - Test
/*
let choices = [
    // QSet 1 - Quest 1 (3 choices)
    { qsetId: 'QS001', qSeq: 1, qSSeq: 1, 'c-Text': 'C11' },
    { qsetId: 'QS001', qSeq: 1, qSSeq: 2, 'c-Text': 'C12' },
    { qsetId: 'qs001', qSeq: 1, qSSeq: 3, 'c-Text': 'C13' }, // make misspell case sensitive
    // QSet 1 - Quest 2 (2 choices)
    { qsetId: 'QS001', qSeq: 2, qSSeq: 1, 'c-Text': 'C21' },
    { qsetId: 'QS001', qSeq: 2, qSSeq: 2, 'c-Text': 'C22' },
    // QSet 2 - Quest 1 (4 choices)
    { qsetId: 'QS002', qSeq: 1, qSSeq: 1, 'c-Text': 'C31' },
    { qsetId: 'QS002', qSeq: 1, qSSeq: 2, 'c-Text': 'C32' },
    { qsetId: 'qS002', qSeq: 1, qSSeq: 3, 'c-Text': 'C33' }, // make misspell case sensitive
    { qsetId: 'Qs002', qSeq: 1, qSSeq: 4, 'c-Text': 'C34' }, // make misspell case sensitive
    // QSet 2 - Quest 2 (3 choices)
    { qsetId: 'QS002', qSeq: 2, qSSeq: 1, 'c-Text': 'C41' },
    { qsetId: 'QS002', qSeq: 2, qSSeq: 2, 'c-Text': 'C42' },
    { qsetId: 'QS002', qSeq: 2, qSSeq: 3, 'c-Text': 'C43' }
]
let lookup = NArray.maps(choices, ['qsetId', 'qSeq', 'qSSeq', 'c-Text'], false);
console.log(lookup);
*/
//#endregion

//#region NArray.inArray - Tests

//#region NArray.inArray - Test Case single member
/*
let branchs = [
    { branchId: 'B0001', branchName: 'BKK' },
    { branchId: 'B0002', branchName: 'Nontaburi' },
    { branchId: 'B0003', branchName: 'Tak' }
]

let orgs = [
    // Branch 1
    { branchId: 'B0001', orgId: 'O0001', orgName: 'HQ' },
    { branchId: 'B0001', orgId: 'O0002', orgName: 'Financial' },
    { branchId: 'B0001', orgId: 'O0003', orgName: 'Accounting' },
    { branchId: 'B0001', orgId: 'O0010', orgName: 'Service 1' }, // assume add later
    { branchId: 'B0001', orgId: 'O0011', orgName: 'PR 1' }, // assume add later
    // Branch 2
    { branchId: 'B0002', orgId: 'O0004', orgName: 'Marketting 2' },
    { branchId: 'B0002', orgId: 'O0005', orgName: 'Service 2' },
    { branchId: 'B0002', orgId: 'O0006', orgName: 'PR 2' },
    { branchId: 'B0002', orgId: 'O0012', orgName: 'Supports 2' }, // assume add later
    // Branch 3
    { branchId: 'B0003', orgId: 'O0004', orgName: 'Marketting 3' },
    { branchId: 'B0003', orgId: 'O0008', orgName: 'Service 3' },
    { branchId: 'B0003', orgId: 'O0009', orgName: 'PR 3' }
]

let selectBranchs = [branchs[1]]; // only branch 2
//let members = lookupMembers = 'branchId'; // string
let members = lookupMembers = ['branchId']; // array
let results
//##-> use single member
//results = NArray.inArray(orgs, members, selectBranchs, lookupMembers);
//##-> use multiple members (array required).
results = NArray.inArray(orgs, members, selectBranchs, lookupMembers);
console.log(results);
*/
//#endregion

//#region NArray.inArray - Test Case multiple member
/*
let qsets = [
    { qsetId: "QS001", qsetText: "Question Set 1" },
    { qsetId: "QS002", qsetText: "Question Set 2" }
]

let questions = [
    // QSet 1
    { qsetId: 'QS001', qSeq: 1, qText: 'Q1' },
    { qsetId: 'QS001', qSeq: 2, qText: 'Q2' },
    // QSet 2
    { qsetId: 'qs002', qSeq: 1, qText: 'Q3' }, // make misspell case sensitive
    { qsetId: 'QS002', qSeq: 2, qText: 'Q4' }
]

let choices = [
    // QSet 1 - Quest 1 (3 choices)
    { qsetId: 'QS001', qSeq: 1, qSSeq: 1, cText: 'C11' },
    { qsetId: 'QS001', qSeq: 1, qSSeq: 2, cText: 'C12' },
    { qsetId: 'qs001', qSeq: 1, qSSeq: 3, cText: 'C13' }, // make misspell case sensitive
    // QSet 1 - Quest 2 (2 choices)
    { qsetId: 'QS001', qSeq: 2, qSSeq: 1, qText: 'C21' },
    { qsetId: 'QS001', qSeq: 2, qSSeq: 2, cText: 'C22' },
    // QSet 2 - Quest 1 (4 choices)
    { qsetId: 'QS002', qSeq: 1, qSSeq: 1, qText: 'C31' },
    { qsetId: 'QS002', qSeq: 1, qSSeq: 2, qText: 'C32' },
    { qsetId: 'qS002', qSeq: 1, qSSeq: 3, qText: 'C33' }, // make misspell case sensitive
    { qsetId: 'Qs002', qSeq: 1, qSSeq: 4, qText: 'C34' }, // make misspell case sensitive
    // QSet 2 - Quest 2 (3 choices)
    { qsetId: 'QS002', qSeq: 2, qSSeq: 1, qText: 'C41' },
    { qsetId: 'QS002', qSeq: 2, qSSeq: 2, qText: 'C42' },
    { qsetId: 'QS002', qSeq: 2, qSSeq: 3, qText: 'C43' }
]

let selQSets;
let filterQues;
let selQues;
let results

selQSets = [ qsets[1] ] // select qset 2
filterQues = NArray.inArray(questions, ['qsetId'], selQSets, ['qsetId']); // ignore case
//filterQues = NArray.inArray(questions, ['qsetId'], selQSets, ['qsetId'], false); // case-sensitive
//console.log(filterQues);

let members = lookupMembers = ['qsetId', 'qSeq']
//selQues = [ filterQues[0] ] // select qset 2, question 1
selQues = [ filterQues[0], filterQues[1] ] // select qset 2, question 1 and 2
//selQues = [ questions[2] ]
//results = NArray.inArray(choices, members, selQues, lookupMembers); // ignore case
results = NArray.inArray(choices, members, selQues, lookupMembers, false); // case-sensitive
console.log(results);
*/
//#endregion

//#endregion

//#region NArray.Date - Test

console.log(NArray.Date.currentYear);
let years = NArray.Date.getYears(2);
console.log(years);
let months = NArray.Date.getMonths();
console.log(months);
let days = NArray.Date.getDays(2000, 4);
console.log(days);

//#endregion
