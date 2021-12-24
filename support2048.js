//获取设备大小
documentWidth = window.screen.availWidth < window.screen.availHeight ? window.screen.availWidth : window.screen.availHeight;
gridContainerWidth = 0.92*documentWidth;
cellSideLength = 0.18*documentWidth;
cellSpace = 0.04*documentWidth;

function getPosTop(i, j){ //返回离父元素顶部的距离
    return cellSpace + i * (cellSpace + cellSideLength);
}
function getPosLeft(i, j){ //返回离父元素左边距离
    return cellSpace + j * (cellSpace + cellSideLength);
}
function getNumberBackgroundColor(number){ //数字格背景色
    switch(number){
        case 2:
            return "#eee4da"; break;
        case 4:
            return "#ede0c8"; break;
        case 8:
            return "#f2b179"; break;
        case 16:
            return "#f59563"; break;
        case 32:
            return "#f67c5f"; break;
        case 64:
            return "#f65e3b"; break;
        case 128:
            return "#edcf72"; break;
        case 256:
            return "edcc61"; break;
        case 512:
            return "#9c0"; break;
        case 1024:
            return "#33b5e5"; break;
        case 2048:
            return "#09c"; break;
        case 4096:
            return "#a6c"; break;
        case 8192:
            return "#93c"; break;
    }
    return "black";
}
function getNumberColor(number){ //数字颜色
    if(number <= 4){
        return "#776e65";
    }
    return "white";
}
function nospace(board){//判断是否还有空格
    for (var i = 0; i<4; i++){
        for(var j = 0; j<4; j++){
            if (board[i][j] == 0){
                return false;
            }
        }
    }
    return true; //所有格子都不为0
}

function moveLeft(){//左移
    if(!canMoveLeft(board)){
        return false;
    }
    for(var i = 0; i<4; i++){
        for(var j=1; j<4; j++){
            if(board[i][j] != 0){
                for (var k =0; k<j; k++){
                    if(board[i][k] == 0 && noBlockHorizontal(i,k,j,board)){
                        //move
                        showMoveAnimation(i,j,i,k);
                        board[i][k] = board[i][j];
                        board[i][j] = 0;
                        break;
                    }else if(board[i][k] == board[i][j] && noBlockHorizontal(i,k,j,board) && !hasConficted[i][k]){
                        //move
                        showMoveAnimation(i,j,i,k);
                        //叠加
                        board[i][k] += board[i][j];
                        hasConficted[i][k] = true;
                        score += board[i][k];
                        updateScore(score);
                        board[i][j] = 0;
                        break;
                    }
                }
            }
        }
    }
    setTimeout(updateBoardView,100);//延迟显示更新，以便显示动画
    return true;
}
function canMoveLeft(board) {//邻值不等，右侧全为空或满时不能移动-不产生新数
    var adding = 0;
    var t;
    for(var i =0; i<4; i++){
        for( var j = 0; j<3; j++){
            if(board[i][j] == 0 || board[i][j+1] == board[i][j]){
                for(t=j+1; t<4; t++){
                    adding += board[i][t];
                }
                if(adding != 0){
                    return true;
                }
            }
        }
    }
    return false;
}

function moveRight(){//右移
    if(!canMoveRight(board)){
        return false;
    }
    for(var i = 0; i<4; i++){
        for(var j=2; j>=0; j--){
            if(board[i][j] != 0){
                for (var k =3; k>j; k--){
                    if(board[i][k] == 0 && noBlockHorizontal(i,j,k,board)){
                        //move
                        showMoveAnimation(i,j,i,k);
                        board[i][k] = board[i][j];
                        board[i][j] = 0;
                        break;
                    }else if(board[i][k] == board[i][j] && noBlockHorizontal(i,j,k,board) && !hasConficted[i][k]){
                        //move
                        showMoveAnimation(i,j,i,k);
                        //叠加
                        board[i][k] += board[i][j];
                        hasConficted[i][k] = true;
                        score += board[i][k];
                        updateScore(score);
                        board[i][j] = 0;
                        break;
                    }
                }
            }
        }
    }
    setTimeout(updateBoardView,200);//延迟显示更新，以便显示动画
    return true;
}
function canMoveRight(board){//判断总体能否右移
    var adding = 0;
    var t;
    for(var i =0; i<4; i++){
        for(var j = 3; j>0; j--){
            if(board[i][j] ==0 || board[i][j-1] == board[i][j]){
                for(t=0; t<j; t++){
                    adding += board[i][t];
                }
                if(adding != 0){
                    return true;
                }
            }
        }
    }
    return false;
}

function moveUp(){
    if(!canMoveUp(board)){
        return false;
    }
    for(var j = 0; j<4; j++){
        for(var i=1; i<4; i++){
            if(board[i][j] != 0){
                for (var k =0; k<i; k++){
                    if(board[k][j] == 0 && noBlockVertical(k,i,j,board)){
                        //move
                        showMoveAnimation(i,j,k,j);
                        board[k][j] = board[i][j];
                        board[i][j] = 0;
                        break;
                    }else if(board[k][j] == board[i][j] && noBlockVertical(k,i,j,board) && !hasConficted[k][j]){
                        //move
                        showMoveAnimation(i,j,k,j);
                        //叠加
                        board[k][j] += board[i][j];
                        hasConficted[k][j] = true;
                        score += board[k][j];
                        updateScore(score);
                        board[i][j] = 0;
                        break;
                    }
                }
            }
        }
    }
    setTimeout(updateBoardView,200);//延迟显示更新，以便显示动画
    return true;
}
function canMoveUp(board){
    var adding = 0;
    var t;
    for(var j=0; j<4; j++){
        for(var i=0; i<3; i++){
            if(board[i][j] == 0 || board[i+1][j] == board[i][j]){
                for (t=i+1; t<4; t++){
                    adding += board[t][j];
                }
                if(adding != 0){
                    return true;
                }
            }
        }
    }
    return false;
}

function moveDown(){
    if(!canMoveDown(board)){
        return false;
    }
    for(var j = 0; j<4; j++){
        for(var i=2; i>=0; i--){
            if(board[i][j] != 0){
                for (var k =3; k>i; k--){
                    if(board[k][j] == 0 && noBlockVertical(i,k,j,board)){
                        //move
                        showMoveAnimation(i,j,k,j);
                        board[k][j] = board[i][j];
                        board[i][j] = 0;
                        break;
                    }else if(board[k][j] == board[i][j] && noBlockVertical(i,k,j,board) && !hasConficted[k][j]){
                        //move
                        showMoveAnimation(i,j,k,j);
                        //叠加
                        board[k][j] += board[i][j];
                        hasConficted[k][j] = true;
                        score += board[k][j];
                        updateScore(score);
                        board[i][j] = 0;
                        break;
                    }
                }
            }
        }
    }
    setTimeout(updateBoardView,200);//延迟显示更新，以便显示动画
    return true;
}
function canMoveDown(board){
    var adding = 0;
    var t;
    for(var j=0; j<4; j++){
        for(var i=3; i>0; i--){
            if(board[i][j] == 0 || board[i-1][j] == board[i][j]){
                for (t=0; t<i; t++){
                    adding += board[t][j];
                }
                if(adding != 0){
                    return true;
                }
            }
        }
    }
    return false;
}

function noBlockHorizontal(row,col1,col2,board){//水平方向没有障碍
    for(var i =col1+1; i<col2; i++ ){
        if(board[row][i] !=0){
            return false;
        }
    }
    return true;
}
function noBlockVertical(row1,row2,col,board){
    for(var i = row1+1; i< row2; i++){
        if (board[i][col] != 0){
            return false;
        }
    }
    return true;
}
function noMove(board){
    if (canMoveDown(board) || canMoveLeft(board) || canMoveRight(board) || canMoveUp(board)){
        return false;
    }else{
        return true;
    }
}
