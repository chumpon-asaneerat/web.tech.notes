class NHotspot {
    constructor(elem) {
        this._elem = elem;

        this._state = { 
            onDrag: false,
            start: { x: -1, y : -1 },
            dx: 0,
            dy: 0
        };

        let self = this;
        this._elem.addEventListener('mousedown', self.mdown.bind(this));
        this._elem.addEventListener('mousemove', self.mmove.bind(this));
        this._elem.addEventListener('mouseup', self.mup.bind(this));
    }

    getEventElement(e) {
        let el, evt = e ? e:event;
        if (evt.srcElement)  el = evt.srcElement;
        else if (evt.target) el = evt.target;
        return el;
    }

    mdown(e) {
        let el = this.getEventElement(e);
        if (!el) return;
        this._state.onDrag = true;

        let x = event.clientX;
        let y = event.clientY;
        let clientRect = this._elem.getBoundingClientRect();

        this._state.start.x = x - clientRect.left;
        this._state.start.y = y - clientRect.top;
        this._state.dx = 0;
        this._state.dy = 0;

        e.preventDefault();
        e.stopPropagation();
        return false;
    }
    mmove(e) {
        let el = this.getEventElement(e);
        if (!el) return;
        if (this._state.onDrag) {
            //let x = el.clientX;
            //let y = el.clientY;
            let x = event.clientX;
            let y = event.clientY;

            this._state.dx = x - this._state.start.x;
            this._state.dy = y - this._state.start.y;

            this.moveTo(this._state.dx, this._state.dy);

            e.preventDefault();
            e.stopPropagation();
            return false;
        }
    }
    mup(e) {
        let el = this.getEventElement(e);
        if (!el) return;
        //let x = el.clientX;
        //let y = el.clientY;
        let x = event.clientX;
        let y = event.clientY;
        this._state.onDrag = false;

        this._state.dx = x - this._state.start.x;
        this._state.dy = y - this._state.start.y;

        this.moveTo(this._state.dx, this._state.dy);

        e.preventDefault();
        e.stopPropagation();
        return false;
    }

    moveTo(x, y) {
        //let rect = this._elem.getBoundingClientRect();
        //console.log('Rect:', rect);
        //this._elem.style.left = rect.left + dx + 'px';
        //this._elem.style.top = rect.top + dy + 'px';
        this._elem.style.left = x + 'px';
        this._elem.style.top = y + 'px';
    }
    
    release() {        
        this._elem.removeEventListener('mousedown', self.mdown );
        this._elem.removeEventListener('mousemove', self.mmove );
        this._elem.removeEventListener('mouseup', self.mup );
    }
};

class NDesigner {
    constructor(elem) {
        this._elem = elem;
        this._objs = [];

        this._selectedObj = null;

        let self = this;
        this._elem.addEventListener('mousedown', (e) => {
            self.onMouseDown(e);
        })
        this._elem.addEventListener('mousemove', (e) => {
            self.onMouseMove(e);
        })
        this._elem.addEventListener('mouseup', (e) => {
            self.onMouseUp(e);
        })
    };
    get element() { return this._elem; }
    get objects() { return this._objs; }

    onMouseDown(e) {
        let el, evt = e ? e:event;
        if (evt.srcElement)  el = evt.srcElement;
        else if (evt.target) el = evt.target;

        //console.log(`designer mouse down:`, el);
        // The design-object mouse down event already handle mouse event if mouse is in 
        // its region. So if designer received event that mean no object selected.
        this.selectedObj = null;
    };
    onMouseMove(e) {
        //console.log(`mouse move:`);
    };
    onMouseUp(e) {
        let el, evt = e ? e:event;
        if (evt.srcElement)  el = evt.srcElement;
        else if (evt.target) el = evt.target;

        console.log(`designer mouse up:`, el);
    };

    add(dsgnObj) {
        if (!dsgnObj) return;
        dsgnObj.designer = this;
        this._elem.appendChild(dsgnObj.element);
        this._objs.push(dsgnObj);
    };
    remove(dsgnObj) {
        if (!dsgnObj) return;
        dsgnObj.designer = null;
    }

    indexOf(dsgnObj) {
        if (!dsgnObj) return -1;
        return -1;
    }

    get selectedObj() { return this._selectedObj; }
    set selectedObj(value) {
        if (this._selectedObj !== value) {
            /*
            if (value) {
                console.log('new object selelected. id:', value.element.id);
            }
            else {
                console.log('no object selelected.');
            }
            */

            this._objs.forEach(obj => {
                if (obj !== value) obj.deselect();
            });

            this._selectedObj = value;
        }
    }
}

class NDesignObject {
    constructor() {
        this._designer = null;
        this._elem = document.createElement('div');
        this._elem.classList.add('design-object');
        let self = this;
        this._elem.addEventListener('mousedown', (e) => {
            self.onMouseDown(e);
        })
        this._elem.addEventListener('mousemove', (e) => {
            self.onMouseMove(e);
        })
        this._elem.addEventListener('mouseup', (e) => {
            self.onMouseUp(e);
        })
    };

    onMouseDown(e) {
        if (!this.selected) {
            console.log(`mouse down:`);
            this.select();
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
    };
    onMouseMove(e) {
        if (!this.selected) return;
        //console.log(`mouse move:`);
    };
    onMouseUp(e) {
        if (!this.selected) return;
        console.log(`mouse up:`);
        e.preventDefault();
        e.stopPropagation();
        return false;
    };

    createHotspot(type, direction) {
        let hotspot = document.createElement('div');
        hotspot.classList.add('hotspot')
        hotspot.setAttribute('type', type);
        hotspot.setAttribute('direction', direction);
        return hotspot;
    };

    get designer() { return this._designer; }
    set designer(value) { this._designer = value; }

    get element() { return this._elem; }
    get selected() { return this._elem.hasAttribute('selected'); }

    select() {
        if (!this._elem.hasAttribute('selected')) {
            // object is not selected so add selected attribute.
            this._elem.setAttribute('selected', '');
            // add hot spot child node.
            this._elem.appendChild(this.createHotspot('resize', 'n'));
            this._elem.appendChild(this.createHotspot('resize', 'e'));
            this._elem.appendChild(this.createHotspot('resize', 'ne'));
            this._elem.appendChild(this.createHotspot('resize', 'w'));
            this._elem.appendChild(this.createHotspot('resize', 'nw'));
            this._elem.appendChild(this.createHotspot('resize', 's'));
            this._elem.appendChild(this.createHotspot('resize', 'se'));
            this._elem.appendChild(this.createHotspot('resize', 'sw'));
            this._elem.appendChild(this.createHotspot('resize', 'mv'));
            // set selected object.
            if (!this.designer) return;
            this.designer.selectedObj = this;
        }
    };
    deselect() {
        if (this._elem.hasAttribute('selected')) {
            // object is selected so remove selected attribute.
            this._elem.removeAttribute('selected');
            // remove hot spot child node.
            let hotspots = this._elem.getElementsByClassName('hotspot');
            for (let i = hotspots.length - 1; i >= 0; --i) {
                let hotspot = hotspots[i];
                hotspot.remove();
            }
        }
    };
}

;(function() {
    console.log('designer init...');
    
    let dsgner = new NDesigner(document.getElementById('dsgn1'));
    console.log(dsgner);

    let obj1 = new NDesignObject();
    obj1.element.id = 'obj1';
    dsgner.add(obj1);

    let obj2 = new NDesignObject();
    obj2.element.id = 'obj2';
    dsgner.add(obj2);

    let obj3 = new NDesignObject();
    obj3.element.id = 'obj3';
    dsgner.add(obj3);

    obj1.select();

    let obj4 = document.getElementById('obj4');
    let hs4 = new NHotspot(obj4);
})();