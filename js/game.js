var drawPolygon = function(ctx) {
    var width = 3;
    var strokeStyle = "#757575";
    var fillStyle = "black";
    ctx.font = "20px 微软雅黑";
    ctx.beginPath();
    ctx.moveTo(verts[0].x, verts[0].y);
    for(var i = 1; i < num; i++) {
        ctx.lineTo(verts[i].x, verts[i].y);
        if(i == num - 1) {
            ctx.lineTo(verts[0].x, verts[0].y);
        }
    }
    ctx.closePath();

    //路径闭合
    if(strokeStyle) {
        ctx.strokeStyle = strokeStyle;
        ctx.lineWidth = width;
        ctx.lineJoin = "round";
        ctx.stroke();
    }
    //画多边形结束

    //画节点圆心
    for(var i = 0; i < num; i++) {
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
    for(var i = 0; i < num; i++) {
        if(i == verts.length - 1) {
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
    status = 0; //当前状态为0  
}

function game1(e) {
    var tmpvert=new Array();
    for(var i=0;i<verts.length;i++){
        var ob={}
        ob.x=verts[i].x;
        ob.y=verts[i].y;
        ob.num=verts[i].num;
        ob.edge1=verts[i].edge1;
        ob.operate=verts[i].operate;
        ob.val=verts[i].val;
        tmpvert.push(ob)
    }
    curvert.push(tmpvert);
    var width = 3;
    var strokeStyle = "#757575";

    e = e || event;
    var ex = e.clientX - canvas.offsetLeft;
    var ey = e.clientY - canvas.offsetTop;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    var nowScore = verts[0].val;
    for(var i = 1; i < verts.length; i++) {
        if(verts[i].val > nowScore) {
            nowScore = verts[i].val;
        }
    }
    ctx.font = "20px 微软雅黑";
    ctx.fillText("当前分数：" + nowScore.toString(), 20, 40);
    ctx.beginPath();
    ctx.moveTo(verts[0].x, verts[0].y);
    for(var i = 0; i < num; i++) {
        if(i == num - 1) {
            if( (((ex >= verts[i].x - 10) && (ex < verts[0].x + 10)) || ((ex < verts[i].x + 10) && (ex >= verts[0].x - 10))) && (((ey >= verts[i].y - 10) && (ey < verts[0].y + 10))  || ((ey < verts[i].y + 10) && (ey >= verts[0].y - 10))) ) {
                ctx.moveTo(verts[0].x, verts[0].y);
                verts[i].edge1 = 0;
                rightTag = i;
                leftTag = i;
                delEdge.push(verts[i].num);  //将被删除的边加入被删除边的数组中
                //continue;
            }
        } else if( (((ex >= verts[i].x - 10) && (ex < verts[i + 1].x + 10)) || ((ex < verts[i].x + 10) && (ex >= verts[i + 1].x - 10))) && (((ey >= verts[i].y - 10) && (ey < verts[i + 1].y + 10))  || ((ey < verts[i].y + 10) && (ey >= verts[i + 1].y - 10))) ) {
            ctx.moveTo(verts[i + 1].x, verts[i + 1].y);
            verts[i].edge1 = 0;
            rightTag = i;
            leftTag = i;
            delEdge.push(verts[i].num);  //将被删除的边加入被删除边的数组中
            //continue;
        }
        if(i == num - 1) {
            ctx.lineTo(verts[0].x, verts[0].y);
        } else {
            ctx.lineTo(verts[i + 1].x, verts[i + 1].y);
        }
    }
    console.log(rightTag);

    //路径闭合
    if(strokeStyle) {
        ctx.strokeStyle = strokeStyle;
        ctx.lineWidth = width;
        ctx.lineJoin = "round";
        ctx.stroke();
    }

    //画节点圆心
    for(var i = 0; i < num; i++) {
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
    for(var i = 0; i < num; i++) {
        if(i == verts.length - 1) {
            var newX = (verts[i].x + verts[0].x) / 2 + 5;
            var newY = (verts[i].y + verts[0].y) / 2 + 5;
        } else {
            var newX = (verts[i].x + verts[i + 1].x) / 2 + 5;
            var newY = (verts[i].y + verts[i + 1].y) / 2 + 5;
        }
        if(verts[i].num == rightTag) {          //该节点的前一个节点的边是否是第一次被删除的，是的话就跳过
            continue;
        }
        ctx.fillStyle = "#000";
        ctx.font = "20px Georgia";
        ctx.fillText(verts[i].operate, newX, newY);
    }
    
    status = 1; //修改状态为1

}

function game2(e) {
    var tmpvert=new Array();;
    for(var i=0;i<verts.length;i++){
        var ob={}
        ob.x=verts[i].x;
        ob.y=verts[i].y;
        ob.num=verts[i].num;
        ob.edge1=verts[i].edge1;
        ob.operate=verts[i].operate;
        ob.val=verts[i].val;
        tmpvert.push(ob)
    }
    curvert.push(tmpvert);
    var width = 3;
    var strokeStyle = "#757575";
    e = e || event;
    var ex = e.clientX - canvas.offsetLeft;
    var ey = e.clientY - canvas.offsetTop;
    /*
    if(verts.length == 1) {
        setTimeout(function() {
            background3.style.display = "block";
            var resString = "";
            resString = resString + "最终得分为：" + (parseInt(verts[0].val)).toString();
            resultText.innerHTML = resString;
        }, 1000);
        return;
    }
    */
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if(verts.length == 1) {
        background3.style.display = "block";
        resultTitle.innerHTML = "游戏结果";
        var resString = "";
        resString = resString + "最终得分为：" + (parseInt(verts[0].val)).toString();
        resString+="路径为："
        for(var i=0;i<delEdge.length;i++){
            resString+=delEdge[i]+','
        }
        resultText.innerHTML = resString;
        ctx.font = "20px 微软雅黑";
        ctx.fillText("当前分数：" + (verts[0].val).toString(), 20, 40);
        return;
    }
    
    
    for(var i = 0; i < verts.length; i++) {
        if(verts[i].num == rightTag) {
            continue;
        }
        if(i == (verts.length - 1)) {
            if( (((ex >= verts[i].x - 10) && (ex < verts[0].x + 10)) || ((ex < verts[i].x + 10) && (ex >= verts[0].x - 10))) && (((ey >= verts[i].y - 10) && (ey < verts[0].y + 10))  || ((ey < verts[i].y + 10) && (ey >= verts[0].y - 10))) ) {
                delEdge.push(verts[i].num);  //将被删除的边加入被删除边的数组中
                if(verts[i].num == rightTag) {
                    rightTag = verts[i - 1].num;
                }
                if(verts[i].operate == "+") {
                    verts[0].val += verts[i].val;
                } else {
                    verts[0].val *= verts[i].val;
                }
                if(verts[i].num - 1 == leftTag) {
                    //leftTag += 1;
                    //leftTag = verts[i + 1].num - 1;
                    leftTag = verts[i].num;
                }
                verts.splice(i, 1);
                break;
            }
        } else if( (((ex >= verts[i].x - 10) && (ex < verts[i + 1].x + 10)) || ((ex < verts[i].x + 10) && (ex >= verts[i + 1].x - 10))) && (((ey >= verts[i].y - 10) && (ey < verts[i + 1].y + 10))  || ((ey < verts[i].y + 10) && (ey >= verts[i + 1].y - 10))) ) {
            /*
            if(verts.length == 2) {

            }
            */
            delEdge.push(verts[i].num);  //将被删除的边加入被删除边的数组中
            if(verts[i].num == rightTag) {
                if(i == 0) {
                    rightTag = verts[verts.length - 1].num;
                } else {
                    rightTag = verts[i - 1].num;
                }
            }
            
            if(verts[i].num == rightTag) {
                rightTag = verts[i].num;
            }
            if(verts[i].operate == "+") {
                verts[i + 1].val += verts[i].val;
            } else {
                verts[i + 1].val *= verts[i].val;
            }
            if(verts[i].num - 1 == leftTag) {
                //leftTag += 1;
                leftTag = verts[i + 1].num - 1;
            }
            verts.splice(i, 1);
            break;
        }
    }
    //console.log(leftTag);
    ctx.beginPath();
    ctx.moveTo(verts[0].x, verts[0].y);
    var tag2 = 0;
    for(var i = 0; i < verts.length; i++) {
        if(verts[i].num - 1 == rightTag) {          //该节点的前一个节点的边是否是第一次被删除的，是的话就跳过
            ctx.moveTo(verts[i].x, verts[i].y);
            if(i == verts.length - 1) {
                ctx.lineTo(verts[0].x, verts[0].y);
            }
            continue;
        }
        if(tag2 == 1) {
            ctx.lineTo(verts[i].x, verts[i].y);
            if(i == verts.length - 1) {
                if(verts[i].num == rightTag) {
                    continue;
                } else {
                    ctx.lineTo(verts[0].x, verts[0].y);
                    continue;
                } 
            }
            continue; 
        }
        if(verts[i].num - 1 == leftTag) {
            tag2 = 1;
            ctx.moveTo(verts[i].x, verts[i].y);
            if(i == verts.length - 1) {
                if(verts[i].num == rightTag) {
                    ctx.moveTo(verts[0].x, verts[0].y);
                    ctx.lineTo(verts[i].x, verts[i].y);
                    continue;
                } else {
                    ctx.lineTo(verts[0].x, verts[0].y);
                    continue;
                }
            }
            continue;
        }
        ctx.lineTo(verts[i].x, verts[i].y);
            
        if(i == verts.length - 1) {
            if(verts[i].num == rightTag) {
                continue;
            } else {
                ctx.lineTo(verts[0].x, verts[0].y);
                continue;
            }
        }
    }
    
    string = "delEdge: ";
    for(var i = 0; i < delEdge.length; i++) {
        string = string + delEdge[i] + " ";
    }
    string = string + " " + "length: " + verts.length.toString() + " verts: ";
    for(var i = 0; i < verts.length; i++) {
        string = string + verts[i].num + " ";
    }
    string = string + " leftTag: " + leftTag.toString();
    string = string + " rightTag: " + rightTag.toString();
    console.log(string);

    //路径闭合
    if(strokeStyle) {
        ctx.strokeStyle = strokeStyle;
        ctx.lineWidth = width;
        ctx.lineJoin = "round";
        ctx.stroke();
    }
    var nowScore = verts[0].val;
    for(var i = 1; i < verts.length; i++) {
        if(verts[i].val > nowScore) {
            nowScore = verts[i].val;
        }
    }
    ctx.font = "20px 微软雅黑";
    ctx.fillText("当前分数：" + nowScore.toString(), 20, 40);
    //画节点圆心
    for(var i = 0; i < verts.length; i++) {
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
    status = 2;
    if(verts.length == 1) {
        return;
    }

    //画操作符
    for(var i = 0; i < verts.length; i++) {
        ctx.fillStyle = "#000";
        ctx.font = "20px Georgia";
        if(i == verts.length - 1) {
            var newX = (verts[i].x + verts[0].x) / 2 + 5;
            var newY = (verts[i].y + verts[0].y) / 2 + 5;
        } else {
            var newX = (verts[i].x + verts[i + 1].x) / 2 + 5;
            var newY = (verts[i].y + verts[i + 1].y) / 2 + 5;
        }
        if(verts[i].num == rightTag) {          //该节点的前一个节点的边是否是第一次被删除的，是的话就跳过
            continue;
        }
        ctx.fillText(verts[i].operate, newX, newY);
    }

    
}

//window.alert(vertX.length);

canvas.onclick = function(e) {
    if(status == 0) {
        game1(e);
    } else if(status == 1) {
        game2(e);
    } else if(status == 2) {
        game2(e);
    }
    
}
