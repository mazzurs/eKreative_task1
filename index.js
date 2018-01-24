var box = document.getElementById('box');                   // дивка с картинкой
var input = document.getElementById('input');

box.onclick = function (event) {
    if (input.value != '') {                                // если инпут не пустой, то
        var newDiv = document.createElement("div");         // создаем новый элемент
        fillWithContent(newDiv);                            // наполняем элемент контентом
        newDiv.setAttribute('class', 'tag');                // присваиваем класс tag
        newDiv.addEventListener('dblclick', stateToggle);   // при двойном клике меняем состояние тега
        box.appendChild(newDiv);                            // вставляем элемент в коробку
        setCoordinates(newDiv);                             // задаем координаты
        input.value = '';                                   // очищаем инпут
        newDiv.touchAction
    }
};

function setCoordinates(div) {                                     // задаем начальные координаты нового элемента
    var coordinates = div.getBoundingClientRect();
    var x = event.x - coordinates.left - coordinates.width / 2;
    var y = event.y - coordinates.top - 10;

    if (y < 0) {
        y = -1;
    } else {
        if (y > 483) {
            y = 483;
        }
    }
    if (x < 0) {
        x = 0;
    } else {
        if (x + coordinates.width > 512) {
            x = 512 - coordinates.width;
            // div.classList.toggle('reverse')
        }
    }

    if (x + coordinates.width > 512 - 23.56) {
        div.classList.toggle('reverse')
    }

    div.style.top = y + 'px';         // задаем координаты по вертикали
    div.style.left = x + 'px';        // задаем координаты по горизонтали
}

function fillWithContent(div) {
    var text = document.createElement("span");     // span для текста
    var remover = document.createElement("span");  // span для remover

    remover.setAttribute('class', 'remover');
    remover.classList.toggle('hide');              // по умолчанию прячем remover
    remover.innerText = "X";
    remover.addEventListener('click', remove);

    text.innerText = input.value;
    text.setAttribute('class', 'text');
    text.addEventListener('mousedown', draggAndDrop);

    div.setAttribute('draggable', 'false');
    div.setAttribute('isOpen', 'false');
    div.appendChild(text);
    div.appendChild(remover);
    div.style.width = text.style.width + 'px'
}

function remove(event) {
    event.currentTarget.parentNode.remove();
}

function stateToggle(event) {
    var tag = event.currentTarget;
    var text = tag.children[0];
    var remover = tag.children[1];

    remover.classList.toggle('hide');

    if (tag.attributes[0].value == 'false') {  // если перемещение запрещено
        tag.setAttribute('draggable', 'true'); // то разрешить перемещение
        text.classList.toggle('draggable');    // cursor: move;
    }
    else {
        tag.setAttribute('draggable', 'false');// запретить перемещение
        text.classList.toggle('draggable');    // cursor: move;
    }
}


function draggAndDrop(e) {
    e.preventDefault();
    var tag = e.currentTarget.parentElement;
    var body = document.body;

    var tagCoordinates = tag.children[0].getBoundingClientRect();
    var boxCoordinates = tag.parentElement.getBoundingClientRect();

    var boxLeft = boxCoordinates.left;
    var boxTop = boxCoordinates.top;
    var boxBottom = boxCoordinates.bottom;
    var boxRight = boxCoordinates.right;
    var boxWidth = boxCoordinates.width;
    var boxHeight = boxCoordinates.height;

    var tagX = tagCoordinates.left;
    var tagY = tagCoordinates.top;
    var tagWidth = tagCoordinates.width;
    var tagHeight = tagCoordinates.height;

    var x;
    var y;


    if (tag.attributes[0].value == 'true') {

        body.onmousemove = function (event) {
            if (tag.attributes[0].value == 'true') {
                tagCoordinates = tag.children[0].getBoundingClientRect();
                tagX = tagCoordinates.left;
                tagY = tagCoordinates.top;

                x = event.pageX - boxLeft - tagWidth / 2;
                y = event.pageY - boxTop - 15;

                if (event.pageX - tagWidth / 2 < boxLeft) {                 // если за пределами левой границы
                    x = 0;                                                  // то отступ слева = 0
                } else {                                                    // иначе проверяем
                    if (event.pageX + tagWidth / 2 > boxRight) {            // если за пределами правой границы
                        x = boxWidth - tagWidth;                            // то отступ слева = ширина бокса - ширина тега
                    }
                }
                if (event.pageY > boxBottom - tagHeight / 2) {              // если за пределами нижней границы
                    y = boxHeight - tagHeight;                              // то отступ сверху = высота бокса - высота тега
                } else {                                                    // иначе проверяем
                    if (event.pageY < boxTop + tagHeight / 2) {             // если за пределами верхней границы
                        y = 0;                                              // то отступ сверху = 0
                    }
                }

                if (event.pageX + 23.56 + tagCoordinates.width / 2 > boxRight) {    // если слишком близко к правому краю
                    tag.attributes[2].value = 'tag reverse';                        // то меняем елементы местами
                    x -= 23.56;                                                     // и от отступа слева отнимаем ширину ремувера
                } else {                                                            // иначе
                    tag.attributes[2].value = 'tag';                                // восстанавливаем обычный порядок элементов
                }

                tag.style.left = x + 'px';      // наконец-то присваиваем значения отступам
                tag.style.top = y + 'px';

            }

            body.onmouseup = function () {      // и прекращаем драг когда отпускаем ЛКМ
                body.onmousemove = null;
            }
        }
    }
}

