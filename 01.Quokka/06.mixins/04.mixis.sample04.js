class Hello {} // ES6 class declaration

function Hello2() {} // Plain js class declaration

let x = new Hello();
let y = new Hello2();

// Dictionary class.
const classes = {
    Hello: Hello,
    Hello2: Hello2,
}

// Find constructor name. Not reliable.
console.log(typeof Hello);
console.log(Hello.toString());
console.log(x.constructor.name);

console.log(typeof Hello2);
console.log(Hello2.toString());
console.log(y.constructor.name);

let str = 'a';
let strI = str.constructor.name;
console.log(strI);

// Create class from string (dictionary class required).
let z = classes['Hello'];
console.log(z);
console.log(new z());
