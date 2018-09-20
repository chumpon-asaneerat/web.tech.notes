class AutoFill {
    constructor(elem) {
        this._root = elem;
    }

    get root() { return this._root; };
};

//#region DOM Management functions

class FluentDOM {
    constructor(dom) {
        this._dom = dom;
    };

    //#region Class manupulation functions

    addClass(...classNames) {
        if (this._dom && this._dom.element) {
            this._dom.element.classList.add(...classNames);
        }
        return this;
    };

    removeClass(...classNames) {
        if (this._dom && this._dom.element) {
            this._dom.element.classList.remove(...classNames);
        }
        return this;
    };

    toggleClass(className, force) {
        if (this._dom) {
            this._dom.toggleClass(className, force);
        }
        return this;
    };

    replaceClass(oldClassName, newClassName) {
        if (this._dom) {
            this._dom.replaceClass(oldClassName, newClassName);
        }
        return this;
    };

    //#endregion

    //#region Style (general) function.

    style(name, value) {
        console.log('style called.');
        if (this._dom && this._dom.element) {
            this._dom.element.style[name] = value;
        }
        return this;
    };

    //#endregion

    //#region margin related functions.

    margin(value) {
        if (this._dom) {
            this._dom.margin = value;
        }
        return this;
    };

    marginLeft(value) {
        if (this._dom) {
            this._dom.marginLeft = value;
        }
        return this;
    };

    marginTop(value) {
        if (this._dom) {
            this._dom.marginTop = value;
        }
        return this;
    };

    marginRight(value) {
        if (this._dom) {
            this._dom.marginRight = value;
        }
        return this;
    };

    marginBottom(value) {
        if (this._dom) {
            this._dom.marginBottom = value;
        }
        return this;
    };

    //#endregion

    //#region padding related functions.

    padding(value) {
        if (this._dom) {
            this._dom.padding = value;
        }
        return this;
    };

    paddingLeft(value) {
        if (this._dom) {
            this._dom.paddingLeft = value;
        }
        return this;
    };

    paddingTop(value) {
        if (this._dom) {
            this._dom.paddingTop = value;
        }
        return this;
    };

    paddingRight(value) {
        if (this._dom) {
            this._dom.paddingRight = value;
        }
        return this;
    };

    paddingBottom(value) {
        if (this._dom) {
            this._dom.paddingBottom = value;
        }
        return this;
    };

    //#endregion

    //#region color related functions.

    color(value) {
        if (this._dom) {
            this._dom.color = value;
        }
        return this;
    };

    //#endregion

    //#region background related functions.

    background(value) {
        if (this._dom) {
            this._dom.background = value;
        }
        return this;
    };

    backgroundColor(value) {
        if (this._dom) {
            this._dom.backgroundColor = value;
        }
        return this;
    };

    backgroundImage(value) {
        if (this._dom) {
            this._dom.backgroundImage = value;
        }
        return this;
    };

    backgroundPositionX(value) {
        if (this._dom) {
            this._dom.backgroundPositionX = value;
        }
        return this;
    };

    backgroundPositionY(value) {
        if (this._dom) {
            this._dom.backgroundPositionY = value;
        }
        return this;
    };

    //#endregion

    get element() { return (this._dom) ? this._dom.element : null; }
}

class NDOM {
    constructor(elem) {
        this._elem = elem;
    };

    fluent() {
        return new FluentDOM(this);
    };
    
    //#region Class manipulation functions.

    addClass(...classNames) {
        if (!this._elem) return;
        this._elem.classList.add(...classNames);
    };

    removeClass(...classNames) {
        if (!this._elem) return;
        this._elem.classList.remove(...classNames);
    };

    hasClass(className) {
        if (!this._elem) return;
        return this._elem.classList.contains(className);
    };

    toggleClass(className, force) {
        if (!this._elem) return;
        return this._elem.classList.toggle(className, force);
    };

    replaceClass(oldClassName, newClassName) {
        if (!this._elem) return;
        this._elem.classList.replace(oldClassName, newClassName);
    };

    //#endregion

    //#region Style (general) function.

    style(name, value) {
        if (!this._elem) return;
        this.element.style[name] = value;
    };

    //#endregion

    //#region margin (with margin-left, margin-top, , margin-right, , margin-bottom)

    get margin() {
        if (!this._elem) return null;
        var style = window.getComputedStyle(this._elem, null);
        return style.margin;
    };
    set margin(value) {
        if (!this._elem) return;
        this._elem.style.margin = value;
    };

    get marginLeft() {
        if (!this._elem) return null;
        var style = window.getComputedStyle(this._elem, null);
        return style.marginLeft;
    };
    set marginLeft(value) {
        if (!this._elem) return;
        this._elem.style.marginLeft = value;
    };

    get marginTop() {
        if (!this._elem) return null;
        var style = window.getComputedStyle(this._elem, null);
        return style.marginTop;
    };
    set marginTop(value) {
        if (!this._elem) return;
        this._elem.style.marginTop = value;
    };

    get marginRight() {
        if (!this._elem) return null;
        var style = window.getComputedStyle(this._elem, null);
        return style.marginRight;
    };
    set marginRight(value) {
        if (!this._elem) return;
        this._elem.style.marginRight = value;
    };

    get marginBottom() {
        if (!this._elem) return null;
        var style = window.getComputedStyle(this._elem, null);
        return style.marginBottom;
    };
    set marginBottom(value) {
        if (!this._elem) return;
        this._elem.style.marginBottom = value;
    };

    //#endregion

    //#region padding (with padding-left, padding-top, , padding-right, , padding-bottom)

    get padding() {
        if (!this._elem) return null;
        var style = window.getComputedStyle(this._elem, null);
        return style.padding;
    };
    set padding(value) {
        if (!this._elem) return;
        this._elem.style.padding = value;
    };

    get paddingLeft() {
        if (!this._elem) return null;
        var style = window.getComputedStyle(this._elem, null);
        return style.paddingLeft;
    };
    set paddingLeft(value) {
        if (!this._elem) return;
        this._elem.style.paddingLeft = value;
    };

    get paddingTop() {
        if (!this._elem) return null;
        var style = window.getComputedStyle(this._elem, null);
        return style.paddingTop;
    };
    set paddingTop(value) {
        if (!this._elem) return;
        this._elem.style.paddingTop = value;
    };

    get paddingRight() {
        if (!this._elem) return null;
        var style = window.getComputedStyle(this._elem, null);
        return style.paddingRight;
    };
    set paddingRight(value) {
        if (!this._elem) return;
        this._elem.style.paddingRight = value;
    };

    get paddingBottom() {
        if (!this._elem) return null;
        var style = window.getComputedStyle(this._elem, null);
        return style.paddingBottom;
    };
    set paddingBottom(value) {
        if (!this._elem) return;
        this._elem.style.paddingBottom = value;
    };

    //#endregion

    //#region border (with border-left, border-top, , border-right, , border-bottom)

    get border() {
        if (!this._elem) return null;
        var style = window.getComputedStyle(this._elem, null);
        return style.border;
    };
    set border(value) {
        if (!this._elem) return;
        this._elem.style.border = value;
    };

    get borderLeft() {
        if (!this._elem) return null;
        var style = window.getComputedStyle(this._elem, null);
        return style.borderLeft;
    };
    set borderLeft(value) {
        if (!this._elem) return;
        this._elem.style.borderLeft = value;
    };

    get borderTop() {
        if (!this._elem) return null;
        var style = window.getComputedStyle(this._elem, null);
        return style.borderTop;
    };
    set borderTop(value) {
        if (!this._elem) return;
        this._elem.style.borderTop = value;
    };

    get borderRight() {
        if (!this._elem) return null;
        var style = window.getComputedStyle(this._elem, null);
        return style.borderRight;
    };
    set borderRight(value) {
        if (!this._elem) return;
        this._elem.style.borderRight = value;
    };

    get borderBottom() {
        if (!this._elem) return null;
        var style = window.getComputedStyle(this._elem, null);
        return style.borderBottom;
    };
    set borderBottom(value) {
        if (!this._elem) return;
        this._elem.style.borderBottom = value;
    };

    //#endregion

    //#region color

    get color() {
        if (!this._elem) return null;
        var style = window.getComputedStyle(this._elem, null);
        return style.color;
    };
    set color(value) {
        if (!this._elem) return;
        this._elem.style.color = value;
    };

    //#endregion

    //#region background (background, backgroundColor, backgroundImage, positionX, positionY)

    get background() {
        if (!this._elem) return null;
        var style = window.getComputedStyle(this._elem, null);
        return style.background;
    };
    set background(value) {
        if (!this._elem) return;
        this._elem.style.background = value;
    };

    get backgroundColor() {
        if (!this._elem) return null;
        var style = window.getComputedStyle(this._elem, null);
        return style.backgroundColor;
    };
    set backgroundColor(value) {
        if (!this._elem) return;
        this._elem.style.backgroundColor = value;
    };

    get backgroundImage() {
        if (!this._elem) return null;
        var style = window.getComputedStyle(this._elem, null);
        return style.backgroundImage;
    };
    set backgroundImage(value) {
        if (!this._elem) return;
        this._elem.style.backgroundImage = value;
    };

    get backgroundPositionX() {
        if (!this._elem) return null;
        var style = window.getComputedStyle(this._elem, null);
        return style.backgroundPositionX;
    };
    set backgroundPositionX(value) {
        if (!this._elem) return;
        this._elem.style.backgroundPositionX = value;
    };

    get backgroundPositionY() {
        if (!this._elem) return null;
        var style = window.getComputedStyle(this._elem, null);
        return style.backgroundPositionY;
    };
    set backgroundPositionY(value) {
        if (!this._elem) return;
        this._elem.style.backgroundPositionY = value;
    };

    //#endregion

    get element() { return this._elem; }
}

//#endregion