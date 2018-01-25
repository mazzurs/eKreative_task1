var box = document.getElementById('box');                   // дивка с картинкой
var input = document.getElementById('input');

box.onclick = function (event) {
    if (input.value != '') {                                // если инпут не пустой, то
        var newDiv = document.createElement("div");         // создаем новый элемент
        fillWithContent(newDiv);                            // наполняем элемент контентом
        newDiv.setAttribute('class', 'tag');                // присваиваем класс tag
        newDiv.addEventListener('dblclick', changeState);   // при двойном клике меняем состояние тега
        newDiv.addEventListener('touchend', changeState);   // при двойном клике меняем состояние тега
        box.appendChild(newDiv);                            // вставляем элемент в коробку
        setCoordinates(newDiv);                             // задаем координаты
        input.value = '';                                   // очищаем инпут
    }
};

function setCoordinates(div) {                                     // задаем начальные координаты нового элемента
    var coordinates = div.getBoundingClientRect();
    var x = event.x - coordinates.left - coordinates.width / 2;
    var y = event.y - coordinates.top - 10;

    if (y < 0) {          // не допускаем установку тега за пределами бокса
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
        }
    }

    if (x + coordinates.width > 512 - 23.56) { // если слишком близко к правому краю бокса, то
        div.classList.toggle('reverse')        // переносим remover влево
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
    remover.addEventListener('touchstart', remove);

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

    var tagWidth = tagCoordinates.width;
    var tagHeight = tagCoordinates.height;

    var x;
    var y;
    var touchobj;

    if (tag.attributes[0].value == 'true') {  // если состояние тега позволяет драгать, то

        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) { // для мобильного отдельная реализация drag'n drop
            tag.ontouchmove = function () {
                touchobj = e.changedTouches[0];      // первая точка прикосновения
                touchX = parseInt(touchobj.clientX); // положение точки касания по x
                touchY = parseInt(touchobj.clientY); // положение точки касания по y

                tagCoordinates = tag.children[0].getBoundingClientRect();


                x = touchX - boxLeft - tagWidth / 2;
                y = touchY - boxTop - 15;

                if (touchX - tagWidth / 2 < boxLeft) {                 // если за пределами левой границы
                    x = 0;                                                  // то отступ слева = 0
                } else {                                                    // иначе проверяем
                    if (touchX + tagWidth / 2 > boxRight) {            // если за пределами правой границы
                        x = boxWidth - tagWidth;                            // то отступ слева = ширина бокса - ширина тега
                    }
                }
                if (touchY > boxBottom - tagHeight / 2) {              // если за пределами нижней границы
                    y = boxHeight - tagHeight;                              // то отступ сверху = высота бокса - высота тега
                } else {                                                    // иначе проверяем
                    if (touchY < boxTop + tagHeight / 2) {             // если за пределами верхней границы
                        y = 0;                                              // то отступ сверху = 0
                    }
                }

                if (touchX + tag.children[1].offsetWidth + tagCoordinates.width / 2 > boxRight) {         // если слишком близко к правому краю
                    tag.attributes[2].value = 'tag reverse';                        // то меняем елементы местами
                    x -= tag.children[1].offsetWidth;                               // и от отступа слева отнимаем ширину ремувера
                } else {                                                            // иначе
                    tag.attributes[2].value = 'tag';                                // восстанавливаем обычный порядок элементов
                }

                tag.style.left = x + 'px';      // наконец-то присваиваем значения отступам
                tag.style.top = y + 'px';

                tag.ontouchend = function () {  // и прекращаем драг
                    tag.ontouchmove = null;
                }
            };
        } else {
            body.onmousemove = function (event) {
                if (tag.attributes[0].value == 'true') {
                    tagCoordinates = tag.children[0].getBoundingClientRect();


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

                    if (event.pageX + tag.children[1].offsetWidth + tagCoordinates.width / 2 > boxRight) {    // если слишком близко к правому краю
                        tag.attributes[2].value = 'tag reverse';                        // то меняем елементы местами
                        x -= tag.children[1].offsetWidth;                                                     // и от отступа слева отнимаем ширину ремувера
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
}

