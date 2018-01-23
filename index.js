var box = document.getElementById('box');
var input = document.getElementById('input');



box.onclick = function(event) {
    if(input.value != ''){                              // если инпут не пустой, то
        var newDiv = document.createElement("div");     // создаем новый елемент
        fillWithContent(newDiv);                        // наполняем елемент контентом
        newDiv.setAttribute('class', 'tag');            // присваиваем класс tag
        newDiv.addEventListener('click', stateToggle);
        box.appendChild(newDiv);                        // вставляем елемент в коробку
        setCoordinates(newDiv);                         // задаем координаты
        input.value = '';                               // очищаем инпут
        close = newDiv;
    }
};

function setCoordinates(div) {                                     // задаем начальные координаты нового елемента
    var coordinates = div.getBoundingClientRect();
    var x = event.x - coordinates.left-coordinates.width/2;
    var y = event.y-coordinates.top-10;

    if(y<0){
        y=0;
    }else {
        if(y>495){
            y=495;
        }
    }
    if(x<0){
        x=0;
    }else {
        if(x+coordinates.width>512){
            x=512-coordinates.width;
            div.children[1].classList.toggle('reverse')
            div.removeChild(div.children[1]);
            var newRemover = document.createElement("span");
            newRemover.innerText = "X";
            newRemover.setAttribute('class', 'remover');
            newRemover.classList.toggle('hide');
            newRemover.addEventListener('click', remove);
            div.prepend(newRemover);
        }
    }

    div.style.top = y +'px';         // задаем координаты по вертикали
    div.style.left = x +'px';        // задаем координаты по горизонтали
}

function fillWithContent(div) {
    var text = document.createElement("span");
    var close = document.createElement("span");
    close.setAttribute('class', 'remover');
    close.classList.toggle('hide');
    close.style.borderRadius = 3+'px';
    close.innerText = "X";
    close.addEventListener('click', remove);

    text.innerText = input.value;                    // присваиваем текст из инпута
    text.setAttribute('class', 'text');
    text.addEventListener('mousedown', draggAndDrop);

    div.setAttribute('draggable','false');
    div.appendChild(text);
    div.appendChild(close);
    div.style.width = text.style.width +'px'
}

function remove(event) {
    event.currentTarget.parentNode.remove();
}

function stateToggle(event) {
    var tag = event.currentTarget;
    if(tag.children[0].innerText == "X"){
        var text = tag.children[1];
        var close = tag.children[0];
    }else{
        var text = tag.children[0];
        var close = tag.children[1];
    }


    close.classList.toggle('hide');

    if(tag.attributes[0].value == 'false'){
        tag.setAttribute('draggable', 'true');
        text.classList.toggle('draggable');
    }
    else{
        tag.setAttribute('draggable', 'false');
        text.classList.toggle('draggable');
    }
}


function draggAndDrop(event) {

    var tag = event.currentTarget.parentElement;

        tag.onmousemove = function () {
            if(tag.attributes[0].value=='true'){
                tag.style.marginTop = 400;
                tag.style.marginLeft = 200;
            }
        };
}
