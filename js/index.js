var gameMode = 1;  //游戏还未新游戏模式为1，自定义游戏模式为2
var num = 0; //多边形的边数
var string = "";
var status = 0; //游戏有三个状态，0是用户未点击过多边形，1是用户已经去掉了多边形的一条边，2是用户正在消除边的过程中, 3为最佳方案演示的过程
var vert = function(x, y, edge1, val, operate, num) {
    this.x = x;
    this.y = y;
    this.edge1 = edge1;
    this.val = val;
    this.operate = operate;
    this.num = num;
}
var vertX = new Array(); //节点的x坐标
var vertY = new Array(); //节点的y坐标
var edge1 = new Array(); //用于判断边是否第一次时被删除
var edge2 = new Array(); //用于判断边是否为非第一次时被删除
var verts = new Array(); //节点对象数组
var vertsB = new Array(); //用于计算最佳路径的节点对象数组
var val = new Array();
var operate = new Array();
var operator = ["+", "x"];
var delEdge = new Array(); //被删除的边
var curvert = new Array();
var rightTag = 0;

var x = 350;
var y = 225;
var r = 150;


var canvas = document.getElementById("canvas");
//canvas的绘制会是画布大小为准的。canvas的默认画布大小为300×150。
canvas.width = 700;
canvas.height = 450;
canvas.onmouseover = function() {
    this.style.cursor = "pointer";
}
var ctx = canvas.getContext("2d");

var gameDesTitle = document.getElementById("game-describe-title").getElementsByTagName("li");  //新游戏和自定义游戏这两个标题
var gameDescribeDetail1 = document.getElementById("game-describe-detail1");
var gameDesign = document.getElementById("game-design");
var vValueSet = document.getElementById("vValue-set");
var eValueSet = document.getElementById("eValue-set");
var background1 = document.getElementById("background1");
var close1 = document.getElementById("background1").getElementsByTagName("span")[0];
var confirm1 = document.getElementById("background1").getElementsByTagName("li")[0];
var cancel1 = document.getElementById("background1").getElementsByTagName("li")[1];
var background2 = document.getElementById("background2");
var close2 = document.getElementById("background2").getElementsByTagName("span")[0];
var confirm2 = document.getElementById("background2").getElementsByTagName("li")[0];
var cancel2 = document.getElementById("background2").getElementsByTagName("li")[1];
var background3 = document.getElementById("background3");
var close3 = document.getElementById("background3").getElementsByTagName("span")[0];
var confirm3 = document.getElementById("background3").getElementsByTagName("li")[0];
var resultTitle = document.getElementById("background3").getElementsByTagName("h2")[0];
var resultText = document.getElementById("background3").getElementsByTagName("p")[0];
var gameStart = document.getElementById("game-start-end").getElementsByTagName("li")[0];
var gameEnd = document.getElementById("game-start-end").getElementsByTagName("li")[1];
var bestWay = document.getElementById("best-way");
var undo = document.getElementById("game-control").getElementsByTagName("li")[0];
var getNextEdge_1 = document.getElementById("game-control").getElementsByTagName("li")[1];
var string = "";
var check1 = 0;  //用户是否确定要使用自定义的顶点值
var check2 = 0;  //用户是否确定要使用自定义的边运算符值
for(var i = 0; i < gameDesTitle.length; i++) {
    string += gameDesTitle[i].innerHTML;
}
gameDesTitle[0].onclick = function() {
    gameMode = 1;
    this.style.color = "#fff";
    this.style.backgroundColor = "#757575";
    gameDesTitle[1].style.color = "#757575";
    gameDesTitle[1].style.backgroundColor = "#fff";
    gameDescribeDetail1.style.display = "block";
    gameDesign.style.display = "none";
}

gameDesTitle[1].onclick = function() {
    gameMode = 2;
    this.style.color = "#fff";
    this.style.backgroundColor = "#757575";
    gameDesTitle[0].style.color = "#757575";
    gameDesTitle[0].style.backgroundColor = "#fff";
    gameDescribeDetail1.style.display = "none";
    gameDesign.style.display = "block";
}
vValueSet.onclick = function() {
    background1.style.display = "block";
}
close1.onclick = function() {
    background1.style.display = "none";
}
confirm1.onclick = function() {
    background1.style.display = "none";
    check1 = 1;
}
cancel1.onclick = function() {
    background1.style.display = "none";
}
eValueSet.onclick = function() {
    background2.style.display = "block";
}
close2.onclick = function() {
    background2.style.display = "none";
}
confirm2.onclick = function() {
    background2.style.display = "none";
    check2 = 1;
}
cancel2.onclick = function() {
    background2.style.display = "none";
}
close3.onclick = function() {
    background3.style.display = "none";
}
confirm3.onclick = function() {
    background3.style.display = "none";
}

function clear() {
    num = 0;
    status = 0;
    vertX.splice(0, vertX.length);
    vertY.splice(0, vertY.length);
    edge1.splice(0, edge1.length);
    val.splice(0, val.length);
    operate.splice(0, operate.length);
    verts.splice(0, verts.length);
    vertsB.splice(0, vertsB.length);
    delEdge.splice(0, delEdge.length);
    curvert.splice(0,curvert.length);
    rightTag = 0;
    delList.splice(0, delList.length);
    delLeft = 0;
    delRight = 0;
}
undo.onclick=function () {
    if(delEdge.length==1) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    console.log(curvert)
    console.log(verts)
    verts=curvert.pop()
    console.log(verts)
        var width = 3;
        var strokeStyle = "#757575";
        var fillStyle = "black";
        ctx.font = "20px 微软雅黑";
        ctx.beginPath();
        ctx.moveTo(verts[0].x, verts[0].y);
        for (var i = 1; i < verts.length; i++) {
            ctx.lineTo(verts[i].x,verts[i].y);
            if (i == verts.length - 1) {
                ctx.lineTo(verts[0].x, verts[0].y);
            }
        }
        ctx.closePath();

        //路径闭合
        if (strokeStyle) {
            ctx.strokeStyle = strokeStyle;
            ctx.lineWidth = width;
            ctx.lineJoin = "round";
            ctx.stroke();
        }
        //画多边形结束

        //画节点圆心
        for (var i = 0; i < verts.length; i++) {
            ctx.beginPath();
            ctx.arc(verts[i].x, verts[i].y, 20, 0, 2 * Math.PI);
            ctx.strokeStyle = "#757575";
            ctx.fillStyle = "#fff";
            ctx.stroke();
            ctx.fill();
            ctx.closePath();
            ctx.fillStyle = "#000";
            ctx.font = "20px Georgia";
            ctx.fillText((verts[i].val).toString(), verts[i].x - 5, verts[i].y + 5);
        }

        //画操作符
        for (var i = 0; i < verts.length; i++) {
            if (i == verts.length - 1) {
                var newX = (verts[i].x + verts[0].x) / 2 + 5;
                var newY = (verts[i].y + verts[0].y) / 2 + 5;
            } else {
                var newX = (verts[i].x + verts[i + 1].x) / 2 + 5;
                var newY = (verts[i].y + verts[i + 1].y) / 2 + 5;
            }
            /*
            if(verts[i].edge1 == 0) {
                continue;
            }
            */
            ctx.fillStyle = "#000";
            ctx.font = "20px Georgia";
            ctx.fillText(verts[i].operate, newX, newY);
        }
        delEdge.pop()
        status=0;
    }
   else if(delEdge.length>1) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        console.log(curvert)
        console.log(verts)
        verts=curvert.pop();
        console.log(verts)
        var width = 3;
        var strokeStyle = "#757575";
        var fillStyle = "black";
        ctx.font = "20px 微软雅黑";
        ctx.moveTo(verts[0].x,verts[0].y);
        for(var i = 0; i < verts.length; i++) {
            if (i === verts.length - 1) {
                if(verts[i].num===delEdge[0])
                ctx.moveTo(verts[0].x, verts[0].y);
            } else {
                if(verts[i].num===delEdge[0])
                ctx.moveTo(verts[i + 1].x, verts[i + 1].y);
                //continue;
            }
            if (i === verts.length - 1&&verts[i].num!==delEdge[0]) {
                ctx.lineTo(verts[0].x, verts[0].y);
            } else if(i !== verts.length - 1&&verts[i].num!==delEdge[0]) {
                ctx.lineTo(verts[i + 1].x, verts[i + 1].y);
            }
        }
        //路径闭合
        if (strokeStyle) {
            ctx.strokeStyle = strokeStyle;
            ctx.lineWidth = width;
            ctx.lineJoin = "round";
            ctx.stroke();
        }
        //画多边形结束

        //画节点圆心
        for (var i = 0; i < verts.length; i++) {
            ctx.beginPath();
            ctx.arc(verts[i].x, verts[i].y, 20, 0, 2 * Math.PI);
            ctx.strokeStyle = "#757575";
            ctx.fillStyle = "#fff";
            ctx.stroke();
            ctx.fill();
            ctx.closePath();
            ctx.fillStyle = "#000";
            ctx.font = "20px Georgia";
            ctx.fillText((verts[i].val).toString(), verts[i].x - 5, verts[i].y + 5);
        }

        //画操作符
        for (var i = 0; i < verts.length; i++) {
         if(verts[i].num===delEdge[0])
             continue;
            if (i == verts.length - 1) {
                var newX = (verts[i].x + verts[0].x) / 2 + 5;
                var newY = (verts[i].y + verts[0].y) / 2 + 5;
            } else {
                var newX = (verts[i].x + verts[i + 1].x) / 2 + 5;
                var newY = (verts[i].y + verts[i + 1].y) / 2 + 5;
            }
            /*
            if(verts[i].edge1 == 0) {
                continue;
            }
            */
            ctx.fillStyle = "#000";
            ctx.font = "20px Georgia";
            ctx.fillText(verts[i].operate, newX, newY);
        }
        delEdge.pop()
    }
}

getNextEdge_1.onclick = function() {
  let first = delEdge[0];
  let removedEdges = delEdge.slice(1);
  let remainingEdges = [];
  let n = vertsB.length;
  let scores = [];

  // 获取所有未删除的边
  for (let i = 0; i < n - 2; i++) {
    if (!removedEdges.includes(i)) {
      remainingEdges.push(i);
    }
  }

  // 计算每一条未删除的边的得分
  for (let i = 0; i < remainingEdges.length; i++) {
    let currentScore = computeScore(first, [...removedEdges, remainingEdges[i]]);
    scores.push(currentScore);
  }

  // 找到得分最大的边的索引，返回得分最大的边
  let maxScoreIndex = scores.reduce((iMax, x, i, arr) => x > arr[iMax] ? i : iMax, 0);
  let nextEdge = remainingEdges[maxScoreIndex];

  // 清空画布
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 绘制未删除的边
  for (let i = 0; i < n - 1; i++) {
    if (!removedEdges.includes(i)) {
      ctx.beginPath();
      ctx.moveTo(vertsB[i].x, vertsB[i].y);
      ctx.lineTo(vertsB[(i + 1) % n].x, vertsB[(i + 1) % n].y);
      ctx.stroke();
    }
  }

  // 绘制红色标记线
  ctx.strokeStyle = "yellow";
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(vertsB[nextEdge].x, vertsB[nextEdge].y);
  ctx.lineTo(vertsB[(nextEdge + 1) % n].x, vertsB[(nextEdge + 1) % n].y);
  ctx.stroke();

  // 绘制节点圆心
  for (let i = 0; i < n; i++) {
    ctx.beginPath();
    ctx.arc(vertsB[i].x, vertsB[i].y, 5, 0, 2 * Math.PI);
    ctx.fillStyle = "#fff";
    ctx.fill();
    ctx.strokeStyle = "#757575";
    ctx.stroke();
    ctx.fillStyle = "#000";
    ctx.font = "20px Georgia";
    ctx.fillText((verts[i].val).toString(), verts[i].x - 5, verts[i].y + 5);
  }

  // 绘制操作符
  for (let i = 0; i < n; i++) {
    let newX = (vertsB[i].x + vertsB[(i == n - 1) ? 0 : i + 1].x) / 2 + 5;
    let newY = (vertsB[i].y + vertsB[(i == n - 1) ? 0 : i + 1].y) / 2 + 5;
    ctx.fillStyle = "#000";
    ctx.font = "20px Georgia";
    ctx.fillText(vertsB[i].operate, newX, newY);
  }
}

function computeScore(first, currentEdges) {
  let n = vertsB.length;
  let op = new Array(n + 1);
  let v = new Array(n + 1);

  // 初始化
  for (let i = 1; i <= n; i++) {
    op[(i == 1) ? n : i - 1] = vertsB[i - 2].operate;
    v[i] = vertsB[i - 1].val;
  }

  // 计算删除当前边后的分数
  let score = 0;
  let lastVertex = first;
  for (let i = 0; i < currentEdges.length; i++) {
    let edge = currentEdges[i];
    let nextVertex = (lastVertex + 1) % n;
    score += applyOperator(v[lastVertex + 1], v[nextVertex + 1], op[lastVertex + 1]);
    lastVertex = nextVertex;
  }
  score += applyOperator(v[lastVertex + 1], v[first], op[lastVertex + 1]);

  return score;
}

// 辅助函数：应用运算符计算两个数的结果
function applyOperator(a, b, operator) {
  if (operator === '+') {
    return a + b;
  } else {
    return a * b;
  }
}





function calcWeight(matrix, scores, i, j, k) {
  // 计算从 i 到 k 再到 j 的得分
  return scores[k] - matrix[i][k] - matrix[j][k];
}

function getPath(matrix, scores, dp, end) {
  // 找到经过 end 的路径
  const path = [
    { node: end, score: scores[end] }
  ];
  let curr = end;
  while (curr !== 0 && curr !== matrix.length - 1) {
    for (let i = 0; i < matrix.length - 1; i++) { // 不考虑终点
      if (matrix[curr][i] !== Infinity && dp[i] + calcWeight(matrix, scores, i, curr, end) === dp[curr]) {
        path.unshift({ node: i, score: scores[i] });
        curr = i;
        break;
      }
    }
  }
  path.unshift({ node: 0, score: scores[0] });

  return path;
}

gameStart.onclick = function() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if(gameMode == 1) {
        clear();
        num = parseInt(Math.random() * (10 - 3 + 1) + 3, 10);
        for(var i = 0; i < num; i++) {
            vertX[i] = x + r * Math.cos(2 * Math.PI * i / num);
            vertY[i] = y + r * Math.sin(2 * Math.PI * i / num);
        }
        for(var i = 0; i < num; i++) {
            edge1[i] = 1;
        }
        for(var i = 0; i < num; i++) {
            val[i] = parseInt(Math.random() * (10 - 1 + 1) + 1, 10);
        }
        for(var i = 0; i < num; i++) {
            operate[i] = operator[Math.round(Math.random())];
        }
        for(var i = 0; i < num; i++) {
            verts[i] = new vert(vertX[i], vertY[i], edge1[i], val[i], operate[i], i);
            vertsB[i] = new vert(vertX[i], vertY[i], edge1[i], val[i], operate[i], i);
        }
        drawPolygon(ctx);
    } else if(gameMode == 2) {
        clear();
        num = parseInt(document.getElementById("vert-num").getElementsByTagName("select")[0].value);
        for(var i = 0; i <= num; i++) {
            vertX[i] = x + r * Math.cos(2 * Math.PI * i / num);
            vertY[i] = y + r * Math.sin(2 * Math.PI * i / num);
        }
        for(var i = 0; i < num; i++) {
            edge1[i] = 1;
        }
        if(check1 == 1) {
            for(var i = 0; i < num; i++) {
                val[i] = parseInt(document.getElementById("vert-value").getElementsByTagName("input")[i].value);
            }
        } else {
            for(var i = 0; i < num; i++) {
                val[i] = 1;
            }
        }
        if(check2 == 1) {
            for(var i = 0; i < num; i++) {
                operate[i] = document.getElementById("edge-value").getElementsByTagName("select")[i].value;
            }
        } else {
            for(var i = 0; i < num; i++) {
                operate[i] = "+";
            }
        }
        
        for(var i = 0; i < num; i++) {
            verts[i] = new vert(vertX[i], vertY[i], edge1[i], val[i], operate[i], i);
            vertsB[i] = new vert(vertX[i], vertY[i], edge1[i], val[i], operate[i], i);
        }
        drawPolygon(ctx);
    }
}

gameEnd.onclick = function() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    clear();
}


var firstDelEdge;
var stack;
var bestScore;
var n;
var m;
var cut;
var op;
var v;
var minf;
var maxf;
function bestSolution() {
    firstDelEdge = 0;
    stack = new Array();
    bestScore = 0;
    n = vertsB.length;
    m = new Array(n + 1);
    cut = new Array(n + 1);
    op = new Array(n + 1);
    v = new Array(n + 1);
    minf = 0;
    maxf = 0;
    /*
    console.log("节点值为：")
    for(var i = 0; i < n; i++) {
        console.log(vertsB[i].val + " ");
    }
    */
    
    for(var i = 0; i < n + 1; i++) {
        m[i] = new Array(n + 1);
    }
    for(var i = 0; i < n + 1; i++) {
        for(var j = 0; j < n + 1; j++) {
            m[i][j] = new Array(2);
        }
    }
    for(var i = 0; i < n + 1; i++) {
        for(var j = 0; j < n + 1; j++) {
            for(var s = 0; s < n + 1; s++) {
                m[i][j][s] = 0;
            }
        }
    }
    for(var i = 0; i < n + 1; i++) {
        cut[i] = new Array(n + 1);
    }
    for(var i = 0; i < n + 1; i++) {
        for(var j = 0; j < n + 1; j++) {
            cut[i][j] = new Array(2);
        }
    }
    for(var i = 1; i <= n; i++) {
        if(i == 1) {
            op[i] = vertsB[n - 1].operate;
        } else {
            op[i] = vertsB[i - 2].operate;
        }
        v[i] = vertsB[i - 1].val;
    }
    
    for(var i = 1; i <= n; i++) {
        m[i][1][0] = m[i][1][1] = v[i];
    }
    for(var i = 1; i <= n; i++) {
        console.log(op[i] + " " + v[i]);
    }
    for(var j = 2; j <= n; j++) {
        for(var i = 1; i <= n; i++) {
            for(var s = 1; s < j; s++) {
                minMax(i, s, j);
				if(m[i][j][0] > minf) {
                    m[i][j][0] = minf;
                    cut[i][j][0] = s; //记录该链取得最小值的断点
                }	
				if(m[i][j][1] < maxf) {
                    m[i][j][1] = maxf;
                    cut[i][j][1] = s; //记录该链取得最大值的断点
                }
            }
        }
    }
    bestScore = m[1][n][1];
    firstDelEdge = 1;
    for(var i = 2; i <= n; i++) {
        if(bestScore < m[i][n][1]) {
            bestScore = m[i][n][1];
            firstDelEdge = i; //如果一开始删除第i边有更优的结果，则更新
        }
    }
    getBestSolution(firstDelEdge, n, true);
    drawBestWay(firstDelEdge, stack, bestScore);
}

function minMax(i, s, j) {
    var e = new Array(5);
    var a = m[i][s][0];
    var b = m[i][s][1];
    var r = (i + s - 1) % n + 1;
    var c = m[r][j - s][0];
    var d = m[r][j - s][1];
    if(op[r] == "+") {
        minf = a + c;
        maxf = b + d;
    } else {
        e[1] = a * c;
        e[2] = a * d;
        e[3] = b * c;
        e[4] = b * d;
        minf = e[1];
        maxf = e[1];
        for(var k = 2; k < 5; k++) {
            if(minf > e[k]) {
                minf = e[k];
            }
            if(maxf < e[k]) {
                maxf = e[k];
            }
        }
    }
}

function getBestSolution(i, j, needMax) {
    var s, r;
    var e = new Array(5);
    if(j == 1) return; //链中只有一个顶点，直接返回
    if(j == 2) {
        s = cut[i][j][1];
        r = (i + s - 1) % n + 1;
        stack.push(r);
        return;
    }
    s = needMax ? cut[i][j][1] : cut[i][j][0];
    r = (i + s - 1) % n + 1;
    stack.push(r);
    //链中有两个以上的顶点时，将最优的边入栈
    if(op[r] == "+") {
        if(needMax) {  //如果合并得到的父链需要取得最大值
            getBestSolution(i, s, true);
            getBestSolution(r, j - s, true);
        } else {
            getBestSolution(i, s, false);
            getBestSolution(r, j - s, false);
        }
    } else {
        var a = m[i][s][0];
        var b = m[i][s][1];
        var c = m[r][j - s][0];
        var d = m[r][j - s][1];
        e[1] = a * c;
        e[2] = a * d;
        e[3] = b * c;
        e[4] = b * d;
        var mergeMax = e[1];
        var mergeMin = e[1];
        for(var k = 2; k < 5; k++) {
            if(mergeMin > e[k]) {
                mergeMin = e[k];
            }
            if(mergeMax < e[k]) {
                mergeMax = e[k];
            }
        }
        var merge = needMax ? mergeMax : mergeMin;
        if(merge == e[1]){ //子链1和子链2都取最小
            getBestSolution(i, s, false);
            getBestSolution(r, j - s, false);
        } else if(merge == e[2]){ //子链1取最小，子链2取最大
            getBestSolution(i, s, false);
            getBestSolution(r, j - s, true);
        } else if(merge == e[3]){ //子链1取最大，子链2取最小
            getBestSolution(i, s, true);
            getBestSolution(r, j - s, false);
        } else { //子链1和子链2都取最大
            getBestSolution(i, s, true);
            getBestSolution(r, j - s, true);
        }
    }
}

bestWay.onclick = function() {
    console.log("最佳方案为：");
    status = 3;
    bestSolution();
}


var delList = new Array();  //被删除的边的队列
var delLeft = 0;
var delRight = 0;

function drawBestWay(first, way1, score) {
    var n = vertsB.length;
    var wayBest = new Array();
    var way = new Array();
    var highestScore = score;
    if(first == 1) {
        var firstE = n - 1;
    } else {
        var firstE = first - 2;
    }
    delLeft = firstE;
    for(var i = 0; i < way1.length; i++) {
        if(way1[i] == 1) {
            way[i] = n - 1;
        } else {
            way[i] = way1[i] - 2;
        }
    }

    while(way.length != 0) {
        wayBest.push(way.splice(way.length - 1, 1));
        
    }
    console.log("first edge: " + firstE);
    console.log("best way:");
    for(var i = 0; i < wayBest.length; i++) {
        console.log(wayBest[i] + " ");
    }
    for(var i = 0; i < wayBest.length + 2; i++) {
        dosetTimeout(i);
    }

    function dosetTimeout(i) {
        setTimeout(function() {
            if(i <= 1) {
                drawBest(firstE, null, highestScore, i);
            } else {
                drawBest(firstE, wayBest[i - 2], highestScore, i);
            }
        }, 1000 * i);
    }
    setTimeout(function() {
        background3.style.display = "block";
        resultTitle.innerHTML = "最佳路径";
        var resString = "";
        resString = resString + "最高分为：" + highestScore.toString() + "</br>";
        resString = resString + "删除的第一条边为：" + (firstE + 1).toString() + "</br>";
        resString = resString + "剩余边的删除顺序为：</br>";
        for(var i = 0; i < wayBest.length; i++) {
            if(i == wayBest.length - 1) {
                resString = resString + (parseInt(wayBest[i]) + 1).toString();
            } else {
                resString = resString + (parseInt(wayBest[i]) + 1).toString() + " → ";
            } 
        }
        resultText.innerHTML = resString;
    }, 1000 *(wayBest.length + 2));
}

function drawBest(firstE, wayDel, score, times) {
    //以下画图所用
    var width = 3;
    var score = score;
    var strokeStyle = "#757575";
    var fillStyle = "black";
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    //开始画多边形
    //开始路径
    ctx.font = "20px 微软雅黑";
    ctx.fillText("最高分为：" + score.toString(), 20, 40);
    var string = "";
    var tag;
    if(times > 1) {
        string = string + "times: " + times.toString() + " wayDel: " + wayDel.toString();
    } else {
        string = string + "times: " + times.toString();
    }
    if(times > 1) {
        delList.push(wayDel);
        for(var i = 0; i < vertsB.length; i++) {
            if(wayDel == vertsB[i].num) {
                if(vertsB[i].num == delRight) {
                    if(i == 0) {
                        delRight = vertsB[vertsB.length - 1].num;
                    } else {
                        delRight = vertsB[i].num - 1;
                    }
                }
                if(i == (vertsB.length - 1)) {
                    if(vertsB[i].operate == "+") {
                        vertsB[0].val += vertsB[i].val;
                    } else {
                        vertsB[0].val *= vertsB[i].val;
                    }
                } else {
                    if(vertsB[i].num != delRight) {
                        if(vertsB[i].operate == "+") {
                            vertsB[i + 1].val += vertsB[i].val;
                        } else {
                            vertsB[i + 1].val *= vertsB[i].val;
                        }
                    }
                }
                wayDel = i;
                tag = wayDel;
                break;
            }
        }
        vertsB.splice(wayDel, 1);
        if(wayDel - 1 == delLeft) {
            delLeft += 1;
        }
    }
    string = string + " delLeft: " + delLeft.toString() + " delRight: " + delRight.toString() + " leftEdge: ";
    for(var i = 0; i < vertsB.length; i++) {
        string = string + vertsB[i].num.toString() + " ";
    }
    console.log(string);
    ctx.beginPath();
    ctx.moveTo(vertsB[0].x, vertsB[0].y);
    for(var i = 0; i < vertsB.length; i++) {
        if(times == 0) {
            ctx.lineTo(vertsB[i].x, vertsB[i].y);
        } else if(times == 1) {
            delLeft = firstE;
            delRight = firstE;
            if(vertsB[i].num - 1 == firstE) {
                ctx.moveTo(vertsB[i].x, vertsB[i].y);
            } else {
                ctx.lineTo(vertsB[i].x, vertsB[i].y);
            }
            if((i == vertsB.length - 1) && (vertsB[i].num != firstE)) {
                ctx.lineTo(vertsB[0].x, vertsB[0].y);
            }
        } else {
            if(vertsB[i].num - 1 == firstE) {
                ctx.moveTo(vertsB[i].x, vertsB[i].y);
            //} else if((i != vertsB.length - 1) && (vertsB[i].num - 1 == delLeft)) {
            } else if(vertsB[i].num - 1 == delLeft) {
                ctx.moveTo(vertsB[i].x, vertsB[i].y);
            } else {
                ctx.lineTo(vertsB[i].x, vertsB[i].y);
            }
            if((i == vertsB.length - 1) && (vertsB[i].num != firstE)) {
                ctx.lineTo(vertsB[0].x, vertsB[0].y);
            }
        }
        
    }
    if(times == 0) {
        ctx.closePath();
    }
    if(strokeStyle) {
        ctx.strokeStyle = strokeStyle;
        ctx.lineWidth = width;
        ctx.lineJoin = "round";
        ctx.stroke();
    }
    //画多边形结束

    //画节点圆心
    for(var i = 0; i < vertsB.length; i++) {
        ctx.beginPath();
        ctx.arc(vertsB[i].x, vertsB[i].y, 20, 0, 2 * Math.PI);
        ctx.strokeStyle = "#757575";
        ctx.fillStyle = "#fff";
        ctx.stroke();
        ctx.fill();
        ctx.closePath();
        ctx.fillStyle = "#000";
        ctx.font = "20px Georgia";
        ctx.fillText((vertsB[i].val).toString(), vertsB[i].x - 5, vertsB[i].y + 5);
    }

    //画操作符
    for(var i = 0; i < vertsB.length; i++) {
        if(i == vertsB.length - 1) {
            var newX = (vertsB[i].x + vertsB[0].x) / 2 + 5;
            var newY = (vertsB[i].y + vertsB[0].y) / 2 + 5;
        } else {
            var newX = (vertsB[i].x + vertsB[i + 1].x) / 2 + 5;
            var newY = (vertsB[i].y + vertsB[i + 1].y) / 2 + 5;
        }
        ctx.fillStyle = "#000";
        ctx.font = "20px Georgia";
        if((times != 0) && (vertsB[i].num == delRight)) {          //该节点的前一个节点的边是否是第一次被删除的，是的话就跳过
            continue;
        }
        ctx.fillText(vertsB[i].operate, newX, newY);
    }
}