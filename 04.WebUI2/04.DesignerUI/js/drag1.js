var getEL = function(el) {
    return document.getElementById(el);
};

var acceptsTouch = function() {
    return 'ontouchstart' in document.documentElement;
};

function getStyle(oElm, strCssRule){
    var strValue = "";
    if(document.defaultView && document.defaultView.getComputedStyle){
        strValue = document.defaultView.getComputedStyle(oElm, "").getPropertyValue(strCssRule);
    }
    else if(oElm.currentStyle){
        strCssRule = strCssRule.replace(/\-(\w)/g, function (strMatch, p1){
            return p1.toUpperCase();
        });
        strValue = oElm.currentStyle[strCssRule];
    }
    return strValue;
}

var drag = function() {
    return {
        move: function(div, xpos, ypos) {
            div.style.left = xpos + "px";
            //div.style.top = ypos + "px"; //not moving y axis in this case

        },
        startMoving: function(div, container, evt) {
            evt = evt || window.event;
            var posX = ((acceptsTouch()) ? evt.touches[0].clientX : evt.clientX),
                posY = ((acceptsTouch()) ? evt.touches[0].clientY : evt.clientY),
                divTop = div.style.top.replace('px', ''),
                divLeft = div.style.left.replace('px', ''),
                offsetX = posX - divLeft,
                offsetY = posY - divTop;
            if (acceptsTouch()) {
                document.ontouchmove = function(evt) {
                    evt.preventDefault();
                    evt = evt || window.event;
                    var posX = evt.touches[0].clientX,
                        posY = evt.touches[0].clientY,
                        cWidth = getStyle(getEL('container'),'width').replace('px',''),
                        dWidth = getStyle(getEL('slider'),'width').replace('px',''),
                        finalX = posX - offsetX,
                        finalY = posY - offsetY;
                    if (finalX < 0) {finalX = 0;}
                    if (finalY < 0) {finalY = 0;}
                    if(finalX <= cWidth - dWidth - 8){
                        drag.move(div, finalX, finalY);
                    }
                };
            } else {
                document.onmousemove = function(evt) {
                    evt.preventDefault();
                    evt = evt || window.event;
                    var posX = evt.clientX,
                        posY = evt.clientY,
                        cWidth = getStyle(getEL('container'),'width').replace('px',''), //container width
                        dWidth = getStyle(getEL('slider'),'width').replace('px',''), //slider width
                        finalX = posX - offsetX,
                        finalY = posY - offsetY;
                    if (finalX < 0) {finalX = 0;}
                    if (finalY < 0) {finalY = 0;}
                    if(finalX <= cWidth - dWidth - 8){
                        drag.move(div, finalX, finalY);
                    }
                };
            }

        },
        stopMoving: function(div, container, evt) {
            if (acceptsTouch()) {
                //evt.changedTouches[0].clientX
                    div.style.left = "3px";
            } else {
                document.getElementById(container).style.cursor = 'default';
                document.onmousemove = function() {};
                //evt.clientX
                   div.style.left="3px";
            }
        },

    };
}();

/*
(function(){
var el = getEL("slider");
if (acceptsTouch()) {
    el.addEventListener('touchstart', function(e) {
        drag.startMoving(this, 'container', event);
    }, false);

    el.addEventListener('touchend', function(e) {
        drag.stopMoving(this, 'container', event);
    }, false);
} else {
    el.addEventListener('mousedown', function(e) {
        drag.startMoving(this, 'container', event);
    }, false);

    el.addEventListener('mouseup', function(e) {
        drag.stopMoving(this, 'container', event);
    }, false);
}
})();
*/