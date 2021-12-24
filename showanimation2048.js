function showNumberWithAnimation(i,j,randNumber){//动画形式显示数字
    var numberCell = $("#number-cell-"+i+"-"+j);
    numberCell.css("background-color", getNumberBackgroundColor(randNumber));
    numberCell.css("color", getNumberColor(randNumber));
    numberCell.text(randNumber);
    numberCell.animate({//显示动画
        width: cellSideLength,
        height: cellSideLength,
        top: getPosTop(i,j),
        left: getPosLeft(i,j)
    },50)
}

function showMoveAnimation(fromx,fromy,tox,toy){//移动格子时的动画
    var numberCell = $("#number-cell-"+fromx+"-"+fromy);
    numberCell.animate({
        top: getPosTop(tox, toy),
        left: getPosLeft(tox,toy)
    },100);
}

function updateScore(score){
    $("#score").text(score);
}