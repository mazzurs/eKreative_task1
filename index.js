let box = document.getElementById('box');
let input = document.getElementById('input');
let boxCoordinates = box.getBoundingClientRect();
let body = document.body;
let tags = document.getElementById('tags');

box.onclick = function () {
    if (input.value != '') {
        let newDiv = document.createElement("div");
        fillWithContent(newDiv);                            // fill the element with content (text and remover)
        newDiv.setAttribute('class', 'tag');
        newDiv.addEventListener('dblclick', changeState);
        newDiv.addEventListener('touchstart', changeState);
        tags.appendChild(newDiv);
        setCoordinates(newDiv);
        input.value = '';
    }
};

function setCoordinates(div) {
    let coordinates = div.getBoundingClientRect();
    let x = event.x - coordinates.left - coordinates.width / 2;
    let y = event.y - coordinates.top - coordinates.height / 2;

    if (y < boxCoordinates.top) {          // do not allow the installation of a tag outside the box
        y = 0;
    } else {
        if (y > boxCoordinates.bottom - boxCoordinates.top - coordinates.height) {
            y = boxCoordinates.bottom - boxCoordinates.top - coordinates.height;
        }
    }
    if (x < 0) {
        x = 0;
    } else {
        if (x + coordinates.width > boxCoordinates.width) {
            x = boxCoordinates.width - coordinates.width;
        }
    }

    if (x + coordinates.width > boxCoordinates.width - div.children[1].offsetWidth) { // if too close to the right edge of the box
        div.classList.toggle('reverse');
    }

    div.style.top = y + 'px';
    div.style.left = x + 'px';
}

function fillWithContent(div) {
    let text = document.createElement("span");     // span for text
    let remover = document.createElement("span");  // span for remover

    remover.setAttribute('class', 'remover');
    remover.classList.toggle('hide');              // hide remover
    remover.innerText = "X";
    if(onMobile()){
        remover.addEventListener('touchstart', remove);
    }else {
        remover.addEventListener('click', remove);
    }



    text.innerText = input.value;
    text.setAttribute('class', 'text');
    text.addEventListener('mousedown', draggAndDrop);
    text.addEventListener('touchmove', draggAndDrop);

    div.setAttribute('draggable', 'false');
    div.setAttribute('isOpen', 'false');
    div.appendChild(text);
    div.appendChild(remover);
    div.style.width = text.style.width + 'px'
}

function remove(event) {
        event.currentTarget.parentNode.remove();
}

function changeState(event) {
    let tag = event.currentTarget;
    let siblings = getSiblings(tag);

    let text = tag.getElementsByClassName('text')[0];
    let remover = tag.getElementsByClassName('remover')[0];

    if (onMobile()) {
        event.currentTarget.ontouchend = function () {
            remover.classList.toggle('hide');
            if (tag.getAttribute('draggable') == 'false') {  // if the movement is forbidden
                tag.setAttribute('draggable', 'true');
                tag.style.zIndex = 10;
                text.classList.toggle('draggable');    // cursor: move;
            }
            else {
                tag.setAttribute('draggable', 'false');
                tag.style.zIndex =5;
                text.classList.toggle('draggable');    // cursor: move;
            }
        }
    } else {
        remover.classList.toggle('hide');
        if (tag.getAttribute('draggable') == 'false') {  // if the movement is forbidden
            tag.setAttribute('draggable', 'true');
            tag.style.zIndex = 10;
            text.classList.toggle('draggable');    // cursor: move;
        }
        else {
            tag.setAttribute('draggable', 'false');
            tag.style.zIndex =5;
            text.classList.toggle('draggable');    // cursor: move;
        }
    }

    siblings.map((sibling)=>{
        sibling.getElementsByClassName('remover')[0].className = 'remover hide';
        sibling.setAttribute('draggable', 'false');
        sibling.getElementsByClassName('text')[0].className='text';
        sibling.style.zIndex =5;
    });
}

function draggAndDrop(e) {
    e.preventDefault();
    let tag = e.currentTarget.parentElement;
    let tagCoordinates = tag.getElementsByClassName('text')[0].getBoundingClientRect();
    let boxLeft = boxCoordinates.left;
    let boxTop = boxCoordinates.top;
    let boxBottom = boxCoordinates.bottom;
    let boxRight = boxCoordinates.right;
    let boxWidth = boxCoordinates.width;
    let boxHeight = boxCoordinates.height;

    let tagWidth = tagCoordinates.width;
    let tagHeight = tagCoordinates.height;

    let x;
    let y;
    let touchobj;

    if (tag.getAttribute('draggable') == 'true') {  // if the moving is allowed

        if (onMobile()) {
            tag.ontouchmove = function (event) {
                touchobj = event.changedTouches[0];
                touchX = parseInt(touchobj.clientX);
                touchY = parseInt(touchobj.clientY);

                tagCoordinates = tag.getElementsByClassName('text')[0].getBoundingClientRect();


                x = touchX - boxLeft - tagWidth / 2;
                y = touchY - boxTop - 15;

                if (touchX - tagWidth / 2 < boxLeft) {                 // if the tag crosses the left bound
                    x = 0;
                } else {
                    if (touchX + tagWidth / 2 > boxRight) {            // if the tag crosses the right bound
                        x = boxWidth - tagWidth-1;
                    }
                }
                if (touchY > boxBottom - tagHeight / 2) {              // if the tag crosses the lower bound
                    y = boxHeight - tagHeight;
                } else {
                    if (touchY < boxTop + tagHeight / 2) {             // if the tag crosses the upper bound
                        y = 0;
                    }
                }

                if (touchX + tag.getElementsByClassName('remover')[0].offsetWidth+1 + tagCoordinates.width / 2 > boxRight) {    // if too close to the right edge of the box
                    tag.className = "tag reverse";
                    x -= tag.getElementsByClassName('remover')[0].offsetWidth;
                } else {
                    tag.className = 'tag';
                }

                tag.style.left = x + 'px';
                tag.style.top = y + 'px';

                tag.ontouchend = function () {  // stop moving
                    tag.ontouchmove = null;
                }
            };
        } else {
            body.onmousemove = function (event) {
                if (tag.getAttribute('draggable') == 'true') {
                    tagCoordinates = tag.getElementsByClassName('text')[0].getBoundingClientRect();


                    x = event.pageX - boxLeft - tagWidth / 2;
                    y = event.pageY - boxTop - 15;

                    if (event.pageX - tagWidth / 2 < boxLeft) {                 // if the tag crosses the left bound
                        x = 0;
                    } else {
                        if (event.pageX  + tagWidth / 2 > boxRight) {            // if the tag crosses the right bound
                            x = boxWidth - tagWidth-1;
                        }
                    }
                    if (event.pageY > boxBottom - tagHeight / 2) {              // if the tag crosses the lower bound
                        y = boxHeight - tagHeight;
                    } else {
                        if (event.pageY < boxTop + tagHeight / 2) {             // if the tag crosses the upper bound
                            y = 0;
                        }
                    }

                    if (event.pageX + tag.getElementsByClassName('remover')[0].offsetWidth+1 + tagCoordinates.width / 2 > boxRight) {    // if too close to the right edge of the box
                        tag.className = "tag reverse";
                        x -= tag.getElementsByClassName('remover')[0].offsetWidth;
                    } else {
                        tag.className = 'tag';
                    }

                    tag.style.left = x + 'px';
                    tag.style.top = y + 'px';
                }
            };
        }

        body.onmouseup = function () {      // stop moving
            body.onmousemove = null;
        }
    }
}

function onMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}

function getSiblings(elem) {
    let siblings = [];
    let sibling = elem;
    while (sibling.previousSibling) {
        sibling = sibling.previousSibling;
        sibling.nodeType == 1 && siblings.push(sibling);
    }

    sibling = elem;
    while (sibling.nextSibling) {
        sibling = sibling.nextSibling;
        sibling.nodeType == 1 && siblings.push(sibling);
    }

    return siblings;
}