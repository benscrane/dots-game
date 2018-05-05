var level = [];

var moveCount = 0;

function randomCell() {
    var typeNum = Math.ceil(Math.random() * 4);
    switch(typeNum) {
        case 1:
            return "red";
        case 2:
            return "green";
        case 3:
            return "blue";
        case 4:
            return "yellow";
                
    }
}

for (var i = 0; i < 20; i++) {
    level.push([]);
    for (var j = 0; j < 20; j++) {
        level[i].push({});
        level[i][j].type=randomCell();
        level[i][j].controlled=false;
    }
}

setupBoard();

function setupBoard() {
    var contentContainer = $("#contentContainer");
    for (var i = 0; i < 20; i++) {
        for (var j = 0; j < 20; j++) {
            $(`#contentContainer .row:nth-of-type(${i+1}) .dot:nth-of-type(${j+1})`).addClass("circle");
            $(`#contentContainer .row:nth-of-type(${i+1}) .dot:nth-of-type(${j+1})`).css("background-color", level[i][j].type);
        }
    }
    
    level[0][0].controlled = true;
    $(".redBtn").on("click", function() {
        moveCount += 1;
        changeControlled("red");
    });
    $(".greenBtn").on("click", function() {
        moveCount += 1;
        changeControlled("green"); 
    });
    $(".blueBtn").on("click", function() {
        moveCount += 1;
        changeControlled("blue");
    });
    $(".yellowBtn").on("click", function() {
        moveCount += 1;
        changeControlled("yellow");
    });

    changeControlled(level[0][0].type);
}

function drawBoard() {
    var contentContainer = $("#contentContainer");
    for (var i = 0; i < 20; i++) {
        for (var j = 0; j < 20; j++) {
            $(`#contentContainer .row:nth-of-type(${i+1}) .dot:nth-of-type(${j+1})`).addClass("circle");
            $(`#contentContainer .row:nth-of-type(${i+1}) .dot:nth-of-type(${j+1})`).css("background-color", level[i][j].type);
        }
    }
}

function changeControlled(color) {
    for (var i = 0; i < 20; i++) {
        for (var j = 0; j < 20; j++) {
            var dot = $(`#contentContainer .row:nth-of-type(${i+1}) .dot:nth-of-type(${j+1})`);
            if (level[i][j].controlled == true) {
                level[i][j].type = color;
                dot.css("background-color", color);
            } else {
                //not controlled, check if next to any controlled and color matches color picked
                if(checkAdjacent(i,j,color)) {
                    level[i][j].controlled = true;
                }
            }
        }
    }
    $("#moveCountDisplay").text(moveCount);
    drawBoard();
}

function checkAdjacent(i, j, color) {
    var convert = false;
    //above
    if (i !== 0) {
        if (level[i-1][j].controlled == true && level[i][j].type == color) {
            return true;
        }
    }
    //right
    if (j !== 19) {
        if (level[i][j+1].controlled == true && level[i][j].type == color) {
            return true;
        }
    }
    //below
    if (i !== 19) {
        if (level[i+1][j].controlled == true && level[i][j].type == color) {
            return true;
        }
    }
    //left
    if (j !== 0) {
        if (level[i][j-1].controlled == true && level[i][j].type == color) {
            return true;
        }
    }
}