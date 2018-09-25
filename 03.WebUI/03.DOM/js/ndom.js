//#region NDOM and related classes

//#region NDOM

class NDOM {
    constructor(elem) {
        this._elem = elem;
        this._class = new NDOM.DOMClass(this);
        this._event = new NDOM.DOMEvent(this);
        this._style = new NDOM.Style(this);
        this._attr = new NDOM.Attribute(this);
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
    // fluent
    fluent() { return new NDOM.Fluent(this); };
    get elem() { return this._elem; }
};

//#endregion

//#region NDOM.DOMClass

NDOM.DOMClass = class {
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

//#region NDOM.DOMEvent

NDOM.DOMEvent = class {
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
        if (!this._dom || !this._dom.element) return null;
        return this._dom.element;
    }
};

//#endregion

//#region NDOM.Style

NDOM.Style = class {
    constructor(dom) { this._dom = dom; };

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
    get dom() { return this._dom; }
    get elem() {
        if (!this._dom || !this._dom.element) return null;
        return this._dom.element;
    }
};

//#endregion

//#region NDOM.Fluent - not implements.

NDOM.Fluent = class {
    constructor(dom) { this._dom = dom; };

    get dom() { return this._dom; }
    get elem() {
        if (!this._dom || !this._dom.element) return null;
        return this._dom.element;
    }
};

//#endregion

//#endregion
