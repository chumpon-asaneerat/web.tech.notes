let moveObj = null;
let zIndex = null;
/*
let moveTo = (el, x, y) => {
    let target = el;
    let rect = target.getBoundingClientRect();
    let wd = rect.width;
    let ht = rect.height;
    target.style.left = x - (wd / 2) + 'px';
    target.style.top = y - (ht / 2) + 'px';
    // target.style.zIndex = -10000;
};
*/

let getDiffPos = (el, x, y) => {
    let rect = el.getBoundingClientRect();
    let result = {
        dx: x - rect.left,
        dy : y - rect.top
    }
    return result;
};

let getOffset = el => {
    var _x = 0;
    var _y = 0;
    while (el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
        _x += el.offsetLeft - el.scrollLeft;
        _y += el.offsetTop - el.scrollTop;
        el = el.offsetParent;
    }
    let result = { top: _y, left: _x };
    return result;
};

let moveParentBy = (el, dx, dy) => {
    let target = el.parentElement;
    let offset = getOffset(target);
    let left = offset.left + dx;
    let top = offset.top + dy;
    target.style.left = left + 'px';
    target.style.top = top + 'px';    
};

let md = e => {
    moveObj = e.target;
    zIndex = moveObj.parentElement.style.zIndex;
    moveObj.parentElement.style.zIndex = moveObj.parentElement.children.length + 1;
    
    document.addEventListener('mousemove', mm);
    document.addEventListener('mouseup', mu);
    
    e.preventDefault();
    e.stopPropagation();
};

let mm = e => {
    if (moveObj) {
        let x = e.clientX;
        let y = e.clientY;
        
        let diff = getDiffPos(moveObj, x, y);
        moveParentBy(moveObj, diff.dx, diff.dy);
    }
    e.preventDefault();
    e.stopPropagation();
};

let mu = e => {
    if (moveObj) moveObj.parentElement.style.zIndex = zIndex;
    moveObj = null;
    
    document.removeEventListener('mousemove', mm);
    document.removeEventListener('mouseup', mu);
    
    e.preventDefault();
    e.stopPropagation();
};

let ts = e => {
    moveObj = e.target;
    zIndex = moveObj.parentElement.style.zIndex;
    moveObj.parentElement.style.zIndex = moveObj.parentElement.children.length + 1;
    
    document.addEventListener('touchmove', tm);
    document.addEventListener('touchend', te);
    
    e.preventDefault();
    e.stopPropagation();
};

let tm = e => {        
    if (moveObj) {
        let touch = e.touches[0];
        let x = touch.clientX;
        let y = touch.clientY;
        
        let diff = getDiffPos(moveObj, x, y);
        let dx = diff.dx;
        let dy = diff.dy;
        moveParentBy(moveObj, dx, dy);
    }
    e.preventDefault();
    e.stopPropagation();
};

let te = e => {
    if (moveObj) moveObj.parentElement.style.zIndex = zIndex;
    moveObj = null;
    
    document.removeEventListener('touchmove', tm);
    document.removeEventListener('touchend', te);
    
    e.preventDefault();
    e.stopPropagation();
};

;(function(){
    console.log('designer.js loaded.');

    let obj6 = document.getElementById('obj6');
    obj6.addEventListener('mousedown', md);
    obj6.addEventListener('touchstart', ts);

    let obj5 = document.getElementById('obj5');
    obj5.addEventListener('mousedown', md);
    obj5.addEventListener('touchstart', ts);
})();