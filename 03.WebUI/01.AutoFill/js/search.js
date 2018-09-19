class AutoFill {
    constructor(elem) {
        this._dom = new AutoFillDOM(this);
        this._ds = new AutoFillDataSet(this);
        this._dom.init(elem);
    };

    get dom() { return this._dom; };
    get dataSet() { return this._ds; };
};

class AutoFillDOM {
    constructor(owner) {
        this._owner = owner;
    };

    __createRootElement() {
        if (!this._root) return;
        // append class
        this._root.classList.add('auto-fill');
        let self = this;
        // setup listeners.
        let onclick = (evt) => { 
            //console.log('Click: ', evt);
            // find range to setup cursor at last character's position.
            self.setEndOfContenteditable(self._input);
            // move focus to input element.
            setTimeout(function () {
                self._input.focus();
            }, 0);
            /*
            evt.preventDefault();
            evt.stopPropagation();
            return false;
            */
        };
        this._root.addEventListener('click', onclick);
    };

    __createInputElement() {
        if (!this._root) return;
        // input element.
        this._input = document.createElement('span');
        this._input.classList.add('input-text');
        this._input.setAttribute('contenteditable', 'true');
        this._input.textContent = '';
        this._root.appendChild(this._input);
        // setup listeners.
        let self = this;
        let ongetfocus = (evt) => {
            //console.log('GotFocus: ', evt);
            /*
            evt.preventDefault();
            evt.stopPropagation();
            return false;
            */
        };
        let oninput = (evt) => {
            //let ipt = self._input.textContent.replace(/\u00A0/g, " ");
            let ipt = self._input.textContent;
            let text = self.owner.dataSet.text;

            //freakin NO-BREAK SPACE needs extra care
            if (text.indexOf(ipt) === 0) {
                let suggestText = text.substr(ipt.length, text.length);
                self._suggest.textContent = suggestText;
            } 
            else {
                self._suggest.textContent = '';
            }
        };
        let onlostfocus = (evt) => {
            //console.log('LostFocus: ', evt);
            /*
            evt.preventDefault();
            evt.stopPropagation();
            return false;
            */
        };
        this._input.addEventListener('focus', ongetfocus);
        this._input.addEventListener('input', oninput);
        this._input.addEventListener('blur', onlostfocus);
    };

    __createSuggestElement() {
        if (!this._root) return;
        // suggest element.
        this._suggest = document.createElement('span');
        this._suggest.classList.add('suggest-text');
        this._suggest.textContent = '';
        this._root.appendChild(this._suggest);
        // setup listener.
        this._suggest.textContent = this.owner.dataSet.text;
    };

    setEndOfContenteditable(contentEditableElem) {
        var range, sel;
        if (document.createRange) {
            range = document.createRange();
            range.selectNodeContents(contentEditableElem);
            range.collapse(false);
            sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
        } else if (document.selection) {
            range = document.body.createTextRange();
            range.moveToElementText(contentEditableElem);
            range.collapse(false);
            range.select();
        }
    };

    init(elem) {
        // set root reference.
        this._root = elem;
        // create related elements.
        this.__createRootElement();
        this.__createInputElement();
        this.__createSuggestElement();
    };

    get inputText() { 
        return (this._input) ? this._input.textContent : null;
    };
    set inputText(value) {
        if (this._input && this._input.textContent != value) {
            this._input.textContent = value;
        }
    };

    get suggestText() { 
        return (this._suggest) ? this._suggest.textContent : null;
    };
    set suggestText(value) {
        if (this._suggest && this._suggest.textContent != value) {
            this._suggest.textContent = value;
        }
    };

    get owner() { return this._owner; };
};

class AutoFillDataSet {
    constructor(owner) {
        this._owner = owner;
        this._items = [];
    };

    get text() {
        return 'The sample data input';
    };

    get items() {
        return this._items;
    };

    get owner() { return this._owner; };
};

class AutoFillItem {
    constructor(text) {
        this._text = text;
        this._inputText = '';
        this._suggestText = '';
    };

    get inputText() { return this._inputText; };
    set inputText(value) {
        if (value != this._inputText) {
            this._inputText = value;
        }
    };

    get suggestText() { return this._suggestText; };
    set suggestText(value) {
        if (value != this._suggestText) {
            this._suggestText = value;
        }
    };

    get text() { return this._text; };
};