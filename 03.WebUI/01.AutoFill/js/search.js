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
    constructor(owner, options) {
        this._owner = owner;
        this._opts = options || {
            keymaps: {
                command: '@'
            },
            commands: [
                { 
                    'text': 'Question Set',
                    'items': function () { return []; }
                },
                { 
                    'text': 'Question',
                    'items': function () { return []; }
                },
                { 
                    'text': 'Branch',
                    'items': function () { return []; }
                },
                { 
                    'text': 'Organization',
                    'items': function () { return []; }
                },
                { 
                    'text': 'Staff', 
                    'items' : function() { return []; }
                }
            ]
        };
        this._root = null;
        this._input = null;
        this._suggest = null;
        this._droppanel = null;
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
           self.dropdown();
        };
        let onlostfocus = (evt) => {
            //console.log('LostFocus: ', evt);
            /*
            evt.preventDefault();
            evt.stopPropagation();
            return false;
            */
            self.close();
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

            self.refresh(); // refresh drop items.
        };
        this._input.addEventListener('focus', ongetfocus);
        this._input.addEventListener('blur', onlostfocus);
        this._input.addEventListener('input', oninput);
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

    __createDropPanelElement() {
        if (!this._root) return;
        // drop panel element.
        this._droppanel = document.createElement('div');
        this._droppanel.classList.add('drop-panel');
        this._droppanel.classList.add('hide');        
        this._root.appendChild(this._droppanel);
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
        this.__createDropPanelElement();
    };

    dropdown() {
        if (!this._droppanel) return;
        this._droppanel.classList.remove('hide');
        // recalc position.
        let top = this._root.offsetTop + this._root.offsetHeight + 1;
        let left = this._root.offsetLeft;
        let right = this._root.offsetLeft; // same as left.

        this._droppanel.style.left = left + 'px';
        this._droppanel.style.right = right + 'px';
        this._droppanel.style.top = top + 'px';

        this.refresh();
    };

    refresh() {
        // refresh items
        if (this._owner && this._owner.dataSet && this._owner.dataSet.items.length > 0) {
            let self = this;
            //console.clear();
            let sinput = this._input.textContent;
            //console.log('input:', sinput);
            self._droppanel.innerHTML = ''; // clear exist items.
            this._owner.dataSet.items.forEach(item => {
                //console.log('item:', item);
                let htmlText;
                let iMatch = item.indexOf(sinput);
                if (iMatch !== -1) {
                    // match.
                    //console.log('index of:', iMatch);
                    // append item container.
                    let itemdiv = document.createElement('div');
                    itemdiv.classList.add('auto-fill-item');
                    self._droppanel.appendChild(itemdiv);
                    let pretext = item.substr(0, iMatch);
                    let posttext = item.substr(iMatch + sinput.length, item.length);
                    //console.log('pre:', pretext);
                    //console.log('post:', posttext);
                    htmlText = pretext + '<b>' + sinput + '</b>' + posttext;
                    // add item text content.
                    let textspan = document.createElement('span');
                    textspan.innerHTML = htmlText;
                    itemdiv.appendChild(textspan);
                }
                else {
                    // not match no items add.
                }
            });

            let existitems = this._droppanel.getElementsByClassName('auto-fill-item');
            //console.log(existitems);
            if (existitems && existitems.length > 0) {
                existitems[0].classList.add('selected');
            }
            else {
                this.close();
            }
        }
    };

    close() {
        if (!this._droppanel) return;
        this._droppanel.classList.add('hide');
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
        this._filter = '';
        this._items = ["Amnat Charoen", "Ang Thong", "Buriram", "Chachoengsao", "Chai Nat", "Chaiyaphum", "Chanthaburi", "Chiang Mai", "Chiang Rai", "Chon Buri", "Chumphon", "Kalasin", "Kamphaeng Phet", "Kanchanaburi", "Khon Kaen", "Krabi", "Krung Thep Mahanakhon", "Lampang", "Lamphun", "Loei", "Lop Buri", "Mae Hong Son", "Maha Sarakham", "Mukdahan", "Nakhon Nayok", "Nakhon Pathom", "Nakhon Phanom", "Nakhon Ratchasima", "Nakhon Sawan", "Nakhon Si Thammarat", "Nan", "Narathiwat", "Nong Bua Lamphu", "Nong Khai", "Nonthaburi", "Pathum Thani", "Pattani", "Phangnga", "Phatthalung", "Phayao", "Phetchabun", "Phetchaburi", "Phichit", "Phitsanulok", "Phra Nakhon Si Ayutthaya", "Phrae", "Phuket", "Prachin Buri", "Prachuap Khiri Khan", "Ranong", "Ratchaburi", "Rayong", "Roi Et", "Sa Kaeo", "Sakon Nakhon", "Samut Prakan", "Samut Sakhon", "Samut Songkhram", "Sara Buri", "Satun", "Sing Buri", "Sisaket", "Songkhla", "Sukhothai", "Suphan Buri", "Surat Thani", "Surin", "Tak", "Trang", "Trat", "Ubon Ratchathani", "Udon Thani", "Uthai Thani", "Uttaradit", "Yala", "Yasothon"];
    };

    applyFilter(filter) {
        if (this._filter !== filter) {
            this._filter = filter;
        }
    };

    get filter() {
        return this._filter;
    };

    get text() {
        if (!this._filter || this._filter.trim() === '')
            return 'press @ for command.';
        return this._items[0];
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
        if (value !== this._inputText) {
            this._inputText = value;
        }
    };

    get suggestText() { return this._suggestText; };
    set suggestText(value) {
        if (value !== this._suggestText) {
            this._suggestText = value;
        }
    };

    get text() { return this._text; };
};