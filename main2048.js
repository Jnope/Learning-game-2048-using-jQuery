var board = []; //每格数字置于数组中
var score = 0; //游戏积分
var hasConficted = []; //判断每个格子是否以经发生过叠加，默认false
var startx =0 , starty =0, endx =0, endy =0;

$(document).ready(function(){//进入文档
    prepareForMobile();//用于适应移动端
    newgame();
});//加载文档后启动新游戏
function prepareForMobile(){//设备适应性设计
    if(documentWidth > 500){//如果大于一定尺寸，不再适应性设计
        gridContainerWidth = 500;
        cellSpace = 20;
        cellSideLength = 100;
    }
    $("#grid-container").css("width", gridContainerWidth);
    $("#grid-container").css("height", gridContainerWidth);
    $("#grid-container").css("padding", cellSpace);
    $("#grid-container").css("border-radius", 0.012*gridContainerWidth);

    $(".grid-cell").css("width", cellSideLength);
    $(".grid-cell").css("height", cellSideLength);
    $(".grid-cell").css("border-rdaius", 0.012*cellSideLength);
}
function newgame(){//新游戏
    //初始化棋盘格
    init();
    //随机两个格子生成数字
    generateOneNumber();
    generateOneNumber();
}
function init(){//初始化
    for( var i = 0; i<4; i++){
        board[i] = [];
        hasConficted[i] = [];
        for(var j = 0; j<4; j++){
            board[i][j] = 0; //初始每个格子值为0
            hasConficted[i][j] = false;
            var gridCell = $("#grid-cell-"+i+"-"+j); //通过id取得格子元素
            gridCell.css('top', getPosTop(i, j));//获取格子相对于大框上沿的距离
            gridCell.css('left', getPosLeft(i, j));//获取格子相对于大框左边的距离
        }
        
    }
    updateBoardView();
    score =0;
    updateScore(score);
}
function updateBoardView(){//更新格子
    $(".number-cell").remove();//先删除之前的数字格
    for (var i = 0; i<4; i++){//生成数字格
        for (var j = 0; j<4; j++){
            $("#grid-container").append("<div class='number-cell' id='number-cell-"+ i+ "-"+ j+"'></div>")
            var theNumberCell =  $('#number-cell-'+i+'-'+j);

            if(board[i][j] == 0){
                theNumberCell.css('width', '0px');
                theNumberCell.css('height', '0px'); //设置0的文本大小为0-不显示
                theNumberCell.css('top', getPosTop(i, j)+cellSideLength/2); //文本位置为格子位置中间，格子一半高为50px
                theNumberCell.css('left', getPosLeft(i, j)+cellSideLength/2);
            }else {
                theNumberCell.css("width", cellSideLength); //设置其他文本大小=格子大小
                theNumberCell.css("height", cellSideLength);
                theNumberCell.css("top", getPosTop(i,j));
                theNumberCell.css("left", getPosLeft(i,j));
                theNumberCell.css('background-color', getNumberBackgroundColor(board[i][j]));
                theNumberCell.css('color', getNumberColor(board[i][j]));
                theNumberCell.text(board[i][j]);
            }
            hasConficted[i][j] = false;
        }
    }
    $(".number-cell").css("line-height", cellSideLength+"px");
    $(".number-cell").css("font-size", 0.6*cellSideLength+"px");
}
function generateOneNumber(){//随机一个格子产生一个2或4
    if(nospace(board)) {
        return false; //如果格子满了，不再生成数字
    }
    var randx, randy;
    //随机位置
    while(true){
        randx = parseInt(Math.floor(Math.random() * 4));
        randy = parseInt(Math.floor(Math.random() * 4));
        if (board[randx][randy] == 0){
            break;
        }
    }
    //随机数字
    var randNumber = Math.random()<0.5 ? 2 : 4; //随机生成2/4
    board[randx][randy] = randNumber;
    showNumberWithAnimation(randx, randy, randNumber);
    return true;
}

$(document).keydown(function(event) {//响应用户键盘操作
    event.preventDefault();
    switch (event.keyCode){
        case 37: //left
            event.preventDefault();//屏幕出现滚动条时，滚动条不响应按键
            if(moveLeft()){
                setTimeout(generateOneNumber,110);
                setTimeout(isGameover, 300);
            }
            break;
        case 38: //up
            event.preventDefault();//屏幕出现滚动条时，不响应按键
            if(moveUp()){
                setTimeout(generateOneNumber, 110);
                setTimeout(isGameover, 300);
            }
            break; 
        case 39: //right
            event.preventDefault();//屏幕出现滚动条时，不响应按键
            if(moveRight()){
                setTimeout(generateOneNumber,110);
                setTimeout(isGameover, 300);
            }
            break;
        case 40: //down
            event.preventDefault();//屏幕出现滚动条时，不响应按键
            if(moveDown()){
                setTimeout(generateOneNumber,110);
                setTimeout(isGameover, 300);
            }
            break;
        default:
            break;
    }
});
document.addEventListener("touchstart", function(event){//获取用户起始坐标
    startx = event.touches[0].pageX;
    starty = event.touches[0].pageY;
});
document.addEventListener("touchmove", function(event){//防止触屏时页面滑动
    event.preventDefault();
}, {passive: false}
);
document.addEventListener("touchend",function(event){//获取手指终止坐标并实现移动
    endx = event.changedTouches[0].pageX;
    endy = event.changedTouches[0].pageY;
    var deltax = endx-startx;
    var deltay = endy-starty;
    if(Math.abs(deltax) < 0.8*cellSideLength && Math.abs(deltay) < 0.8*cellSideLength){
        return;
    }
    if(Math.abs(deltax) >= Math.abs(deltay)){//判断滑动方向
        if (deltax > 0 && moveRight()){
            setTimeout(generateOneNumber,110);
            setTimeout(isGameover, 300);
        }else if(deltax < 0 && moveLeft()){
            setTimeout(generateOneNumber,110);
            setTimeout(isGameover, 300);
        }
    }else{
        if(deltay > 0 && moveDown()){
            setTimeout(generateOneNumber,110);
            setTimeout(isGameover, 300);
        }else if(deltay <0 && moveUp()){
            setTimeout(generateOneNumber,110);
            setTimeout(isGameover, 300);
        }
    }
});
function isGameover(){//游戏结束
    if (nospace(board) && noMove(board)){
        alert("gameover !\n your score: "+score);
    }
}
