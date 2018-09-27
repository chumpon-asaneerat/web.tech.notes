//#region NDOM and related classes

//#region nlib.dom

NDOM = class {
    constructor(elem) {
        this._elem = elem;
        this._class = new NDOM.Class(this);
        this._event = new NDOM.Event(this);
        this._style = new NDOM.Style(this);
        this._attr = new NDOM.Attribute(this);
        this._selector = new NDOM.Selector(this);
        this._fluent = new NDOM.Fluent(this);
    };
    // class
    get class() { return this._class; }
    // event
    get event() { return this._event; }
    // attributes
    get attrs() { return this._attr; }
    // attribute
    attr(name, value) {
        if (!this._elem || !arguments) return undefined;
        if (arguments.length === 0) {
            return this._attr;
        }
        else if (arguments.length === 1) {
            return this._attr.get(name);
        }
        else if (arguments.length === 2) {
            this._attr.set(name, value);
        }
    };
    // styles
    get styles() { return this._style; }
    // style
    style(name, value) {
        if (!this._elem || !arguments) return undefined;
        if (arguments.length === 0) {
            return this._style;
        }
        else if (arguments.length === 1) {
            return this._style.get(name);
        }
        else if (arguments.length === 2) {
            this._style.set(name, value);
        }
    };
    // query selector
    query(selector) { 
        if (!this._elem || !arguments) return null;
        if (arguments.length === 0) {
            return this._selector;
        }
        else {
            return this._selector.gets(selector);
        }        
    };
    // element information.
    get tagName() {
        if (!this._elem) return '';
        return this._elem.tagName;
    }
    get text() {
        if (!this._elem) return '';
        return this._elem.textContent;
    }
    set text(value) {
        if (!this._elem) return;
        if (this._elem.textContent != value) {
            this._elem.textContent = value;
        }
    }
    get html() {
        if (!this._elem) return '';
        return this._elem.innerHTML;
    }
    set html(value) {
        if (!this._elem) return;
        if (this._elem.innerHTML != value) {
            this._elem.innerHTML = value;
        }
    }
    // parent/child access.
    get parent() {
        if (!this._elem) return null;
        if (!this._elem.parentElement) return null;
        return new NDOM(this._elem.parentElement);
    }
    get children() {
        let results = [];
        if (!this._elem) return results;
        let el = this._elem;
        let celems = el.children;
        if (celems && celems.length > 0) {
            let iMax = celems.length;
            for (let i = 0; i < iMax; i++) {
                let celem = celems[i];
                results.push(new NDOM(celem));
            }
        }
        return results;
    }
    // child node management.
    appendChild(dom) {
        if (!this._elem || !dom || !dom.elem) return;
        this._elem.appendChild(dom.elem);
    };
    removeChild(value) {
        if (!this._elem || !dom || !dom.elem) return;
        this._elem.removeChild(dom.elem);
    };
    clearChildren() {
        if (!this._elem) return;
        while (this._elem.firstChild) {
            this._elem.removeChild(this._elem.firstChild);
        }
    };
    // fluent
    fluent() { return this._fluent; };
    get elem() { return this._elem; }
    // static
    static create(tagName, options) {
        return new NDOM(document.createElement(tagName, options));
    };
};

//#endregion

//#region NDOM.Class

NDOM.Class = class {
    constructor(dom) { this._dom = dom; };

    add(...classNames) {
        if (!this._dom || !this._dom.elem) return;
        let el = this._dom.elem;
        el.classList.add(...classNames);
    };
    remove(...classNames) {
        if (!this._dom || !this._dom.elem) return;
        let el = this._dom.elem;
        el.classList.remove(...classNames);
    };
    toggle(className, force) {
        if (!this._dom || !this._dom.elem) return;
        if (!className || className.trim() === '') return;
        let el = this._dom.elem;
        return el.classList.toggle(className, force);
    };
    has(className) {
        if (!this._dom || !this._dom.elem) return;
        if (!className || className.trim() === '') return;
        let el = this._dom.elem;
        return el.classList.contains(className);
    };
    replace(oldClassName, newClassName) {
        if (!this._dom || !this._dom.elem) return;
        if (!oldClassName || oldClassName.trim() === '') return;
        let el = this._dom.elem;
        el.classList.replace(oldClassName, newClassName);
    };

    get dom() { return this._dom; }
    get elem() {
        if (!this._dom || !this._dom.elem) return null;
        return this._dom.elem;
    }
};

//#endregion

//#region NDOM.Event

NDOM.Event = class {
    constructor(dom) { this._dom = dom; };

    // event
    add(eventName, handler, options) {
        if (!this._dom || !this._dom.elem) return;
        if (!eventName || eventName.trim() === '') return;
        if (!handler) return;
        let el = this._dom.elem;
        el.addEventListener(eventName, handler, options);
    };
    remove(eventName, handler, options) {
        if (!this._dom || !this._dom.elem) return;
        if (!eventName || eventName.trim() === '') return;
        let el = this._dom.elem;
        el.removeEventListener(eventName, handler, options);
    };

    get dom() { return this._dom; }
    get elem() {
        if (!this._dom || !this._dom.elem) return null;
        return this._dom.elem;
    }
};

//#endregion

//#region NDOM.Attribute

NDOM.Attribute = class {
    constructor(dom) { this._dom = dom; };

    get(name) {
        if (!this._dom || !this._dom.elem) return undefined;
        if (!name || name.trim() === '') return undefined;
        let el = this._dom.elem;
        return el.getAttribute(name);
    };
    set(name, value) {
        if (!this._dom || !this._dom.elem) return;
        if (!name || name.trim() === '') return;
        let el = this._dom.elem;
        el.setAttribute(name, value);
    };
    remove(name) {
        if (!this._dom || !this._dom.elem) return undefined;
        if (!name || name.trim() === '') return undefined;
        let el = this._dom.elem;
        el.removeAttribute(name);
    };
    has(name) {
        if (!this._dom || !this._dom.elem) return false;
        if (!name || name.trim() === '') return false;
        let el = this._dom.elem;
        return el.hasAttribute(name);
    };
    toggle(name, value) {
        if (!this._dom || !this._dom.elem) return;
        if (!name || name.trim() === '') return;
        if (this.has(name)) this.remove(name);
        else {
            let val = (value) ? value : '';
            this.set(name, val);
        }
    };
    get dom() { return this._dom; }
    get elem() {
        if (!this._dom || !this._dom.elem) return null;
        return this._dom.elem;
    }
};

//#endregion

//#region NDOM.Style

NDOM.Style = class {
    constructor(dom) {
        this._dom = dom;
        this._margin = new NDOM.Margin(dom);
        this._padding = new NDOM.Padding(dom);
    };

    get(name) {
        if (!this._dom || !this._dom.elem) return undefined;
        if (!name || name.trim() === '') return undefined;
        let el = this._dom.elem;
        return el.style[name];
    };
    set(name, value) {
        if (!this._dom || !this._dom.elem) return;
        if (!name || name.trim() === '') return;
        let el = this._dom.elem;
        el.style[name] = value;
    };
    remove(name) {
        if (!this._dom || !this._dom.elem) return undefined;
        if (!name || name.trim() === '') return undefined;
        let el = this._dom.elem;
        el.style[name] = undefined;
    };
    has(name) {
        if (!this._dom || !this._dom.elem) return false;
        if (!name || name.trim() === '') return false;
        let el = this._dom.elem;
        return (el.style[name] !== undefined && el.style[name] !== '');
    };

    // margin
    get margins() { return this._margin; }
    margin() {
        if (!this._margin) return undefined;
        if (!arguments || arguments.length === 0) {
            return this._margin.val();
        }
        else this._margin.val(...arguments);
    };
    // padding
    get paddings() { return this._padding; }
    padding() {
        if (!this._padding) return undefined;
        if (!arguments || arguments.length === 0)
            return this._padding.val();
        else this._padding.val(...arguments);
    };

    get dom() { return this._dom; }
    get elem() {
        if (!this._dom || !this._dom.elem) return null;
        return this._dom.elem;
    }
};

//#endregion

//#region NDOM.Style (wrapper)

//#region BlockStyle (common style)

NDOM.BlockStyle = class {
    constructor(dom) {
        this._dom = dom;
        this._prefix = '';
    };

    get prefix() { return this._prefix; }
    set prefix(value) { this._prefix = value; }

    get hasStyle() { return (this._dom && this._dom.elem); }

    val() {        
        if (!this.hasStyle) return undefined; 
        if (!arguments) return this.style(this._prefix);
        if (arguments.length === 1) {
            let value = arguments[0];
            this._dom.style(this._prefix, value);
        }
        else if (arguments.length === 2) {
            let value = 
                arguments[0] + // top-bottom
                ' ' +
                arguments[1];  // right-left
            this._dom.style(this._prefix, value);
        }
        else if (arguments.length === 3) {
            let value = 
                arguments[0] + // top
                ' ' + 
                arguments[1] + // right-left
                ' ' +
                arguments[2];  // bottom
            this._dom.style(this._prefix, value);
        }
        else if (arguments.length === 4) {
            let value = 
                arguments[0] + // top
                ' ' + 
                arguments[1] + // right-left
                ' ' +
                arguments[2] + // bottom
                ' ' + 
                arguments[3];  // left
            this._dom.style(this._prefix, value);
        }
        else {
            return this._dom.style(this._prefix);
        }
    }
    get left() {
        if (!this.hasStyle) return undefined;
        return this._dom.style(this._prefix + '-left');
    }
    set left(value) {
        if (!this.hasStyle) return;
        this._dom.style(this._prefix + '-left', value);
    }
    get right() {
        if (!this.hasStyle) return undefined;
        return this._dom.style(this._prefix + '-right');
    }
    set right(value) {
        if (!this.hasStyle) return;
        this._dom.style(this._prefix + '-right', value);
    }
    get top() {
        if (!this.hasStyle) return undefined;
        return this._dom.style(this._prefix + '-top');
    }
    set top(value) {
        if (!this.hasStyle) return;
        this._dom.style(this._prefix + '-top', value);
    }
    get bottom() {
        if (!this.hasStyle) return undefined;
        return this._dom.style(this._prefix + '-bottom');
    }
    set bottom(value) {
        if (!this.hasStyle) return;
        this._dom.style(this._prefix + '-bottom', value);
    }

    get dom() { return this._dom; }
    get elem() {
        if (!this._dom || !this._dom.elem) return null;
        return this._dom.elem;
    }    
};

//#endregion

//#region Margin

NDOM.Margin = class extends NDOM.BlockStyle {
    constructor(dom) {
        super(dom);
        this.prefix = 'margin';
    };
};

//#endregion

//#region Padding

NDOM.Padding = class extends NDOM.BlockStyle {
    constructor(dom) {
        super(dom);
        this.prefix = 'padding';
    };
};

//#endregion

//#endregion

//#region NDOM.Selector

NDOM.Selector = class {
    constructor(dom) { this._dom = dom; };
    // returns the first child element that matches a specified CSS selector(s).
    // of an element. If not found null returns.
    get(selector) {
        if (!this._dom || !this._dom.elem) return null;
        if (!selector || selector.trim() === '') return null;
        let el = this._dom.elem;
        let element = el.querySelector(selector);
        return (element) ? element : null;
    };
    // returns a collection of an element's child elements that match a specified 
    // CSS selector(s), as a static NodeList object. If not found empty array returns.
    gets(selector) {
        let results = [];
        if (!this._dom || !this._dom.elem) return results;
        if (!selector || selector.trim() === '') return results;
        let el = this._dom.elem;
        let elements = el.querySelectorAll(selector);
        if (elements && elements.length > 0) {
            elements.forEach(element => {
                let edom = new NDOM(element);
                results.push(edom);
            })
        }
        return results;
    };

    get dom() { return this._dom; }
    get elem() {
        if (!this._dom || !this._dom.elem) return null;
        return this._dom.elem;
    }
};

//#endregion

//#region NDOM.Fluent - not implements.

NDOM.Fluent = class {
    constructor(dom) { this._dom = dom; };

    get dom() { return this._dom; }
    get elem() {
        if (!this._dom || !this._dom.elem) return null;
        return this._dom.elem;
    }
};

//#endregion

//#endregion
