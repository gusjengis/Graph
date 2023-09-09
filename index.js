//SETUP
var pixelRatio = window.devicePixelRatio;
document.body.style.zoom=1/pixelRatio;
settingsMenu = document.getElementById("settingsMenu");
settingsMenu.style = "display:none";
settingsButton = document.getElementById("settingsButton");
var settings = false;
var x;
var i = 0;
var scale = 100;
document.getElementById("scale").value = scale;
var preScale;
var XBox;
var y = 0;
var xArray = [];
var yArray = [];
var formulaArray = [];
var colorArray = ["#ff0000","#ffa500","#ffff00","#00ff00","#0000ff","#7d26cd","#d2b48c","#00ffff","#ff00ff"];
var angleButton = document.getElementById("angleMode");
var coordinateButton = document.getElementById("coordinateMode");
var gridToggle = document.getElementById("toggleGrid");
// var centerButton = document.getElementById("centerGrid");
var darkButton = document.getElementById("darkMode");
var darkMode = true;
var enter = document.getElementById("enter");
var formulaList = document.getElementById("functionList");
var currentCoordinates = document.getElementById("currentCoordinates");
var graph = document.getElementById("graph");
graph.width = pixelRatio*document.documentElement.clientWidth - 20;
graph.height = pixelRatio*document.documentElement.clientHeight - 80;
var draw = graph.getContext("2d");
draw.imageSmoothingEnabled = false;
draw.lineWidth = 1;
var grid = true;
var panning = false;
var xOff = 0;
var yOff = 0;
drawGrid();
var formula;
var currentFormula = function() { this.formula = ""; this.number = 0;}
var formulaObject = function() { this.formula = ""; this.hide = false;}
var right,left,up,down = false;
var angleMode = "radians";
var coordinateMode = "cartesian";
var loopTo = 2*pi;

window.onload = function(){
    document.getElementById("menuLabel").innerText = "\u2261";
    document.getElementById("homeLabel").innerText = "\u2295";
}

var functionArr = [];
class Function {
    constructor(formula){
        this.formula = formula;
        this.parsedFormula = parseFormula(formula)[0];
        this.parsedYFormula = parseFormula(formula)[1];
        this.type = parseFormula(formula)[2];
        this.color = setColor(functionArr.length);
        functionArr.push(this);
    }

    draw(){
        draw.strokeStyle = this.color;
        draw.beginPath();
        switch(this.type){
            case "cartesian":
                this.cartesianDraw();
                break;
            case "polar":
                this.polarDraw();
                break;
            case "parametric":
                this.parametricDraw();
                break;
        }
        draw.stroke();
    }

    cartesianDraw(){
        for(l=-xOff;l<graph.width-xOff;l++){
            x = (l-floor(graph.width/2))/scale;
            draw.lineTo(l+xOff,(graph.height/2)-eval(this.parsedFormula)*scale+yOff);
        }
    }

    polarDraw(){
        let m;
        for(l=0; l<loopTo; l=l+pi/500){
            x=l;
            m=eval(this.parsedFormula)*scale;
            polToCart(m,l);
            draw.lineTo(floor(graph.width/2)+x+xOff,graph.height/2-y+yOff);
        }
    }

    parametricDraw(){
        
        for(l=0; l<100; l=l+pi/500){
            x=l;
            draw.lineTo(scale*eval(this.parsedFormula)+graph.width/2+xOff,graph.height/2-scale*eval(this.parsedYFormula)+yOff);
            //console.log(eval(this.parsedFormula)+xOff+", "+eval(this.parsedYFormula)+yOff)
        }
    }

    createFunctionDiv(parentElement){
        let div = createElement("div", "", "functionDiv", document.getElementById("menuPopUp"));
        let input = createElement("input", "", "text functionInput", div);
        input.type="text";
        input.value=this.formula;
        input.owner = this;
        input.style.color = this.color;
        input.style.backgroundColor = "rgba(255,255,255,0)";

        input.onkeyup = function(){
            try{
                this.owner.updateFunction(this.value);
                this.classList.remove('error');
            } catch(SyntaxError){
                this.classList.add('error');
            }
        }
    }
    updateFunction(formula){
        let x = 1;
        let i = 1;
        (eval(formula));
        this.formula = formula;
        this.parsedFormula = parseFormula(formula)[0];
        this.parsedYFormula = parseFormula(formula)[1];
        this.type = parseFormula(formula)[2];
        drawGraph();
    }
}

const supportedFunctions = ["sin", "arcsin", "cos", "arccos", "tan", "arctan", "csc", "arccsc", "sec", "arcsec", "cot", "arccot", "floor", "ceiling", "abs", "log", "sqrt", "min", "max"];
const operators = ["+", "-", "*", "/", "^"];

function parseFormula(formula){

    let splitFormula = formula.split(supportedFunctions[0]);
    for(f=0; f<splitFormula.length; f++){
        if(splitFormula[f] == ''){
            splitFormula[f] = supportedFunctions[0];
        }
    }
    for(w=1; w<supportedFunctions.length; w++){

    // for(p=0; p<supportedFunctions.length; p++){
    //     formula
    }
    let temp2 = formula.replace("^", "**");
    let temp1 = temp2.split(":");
    if(temp1.length >= 2){
        
        if(temp1[0] == "parametric"){

            return [temp1[1], temp1[2], temp1[0]];
        }
        return [temp1[1], "", temp1[0]];
        
    }
    return [temp2, "", "cartesian"];
}

//DRAWING
function drawGrid(){
    draw.clearRect(-0.5, -0.5, graph.width, graph.height);
    if(grid == true){
        if(darkMode == false){
	        draw.strokeStyle = "#000000";
        } else {
            draw.strokeStyle = "#ffffff";
        }
        draw.beginPath();
        draw.moveTo(floor(graph.width/2)+xOff,0);
        draw.lineTo(floor(graph.width/2)+xOff,graph.height);
        draw.moveTo(0,graph.height/2+yOff);
        draw.lineTo(graph.width,graph.height/2+yOff);
        draw.stroke();
    }
}
function setColor(q){
        l = floor(q/colorArray.length);
        q = q - colorArray.length*l;
        draw.strokeStyle = colorArray[q];
        return colorArray[q];
}
function drawGraph(){
    drawGrid();
    for(q=0;q<functionArr.length;q++){
        functionArr[q].draw();
    }
    // if(coordinateMode == "parametric") {
    //     for(q=0;q<formulaArray.length;q++){
    //         setColor(q);
    //         var xF = document.getElementById("xFormula").value;
    //         var yF = document.getElementById("yFormula").value;
    //         draw.beginPath();
    //         for(t=-xOff;t<graph.width-xOff;t++){
    //             draw.lineTo((graph.width/2)+eval(xF)*scale+xOff,(graph.height/2)-eval(xF)*scale+yOff);
    //         }
    //         draw.stroke();
    //     }
    //     return;
    // }
    // for(q=0;q<formulaArray.length;q++){
    //     setColor(q);
    //     formula = formulaArray[q].formula;
    //     currentFormula.hide = formulaArray[q].hide;
    //     if(currentFormula.hide == false){
    //         draw.beginPath();
    //         if(coordinateMode == "polar"){
    //             for(l=0; l<loopTo; l=l+pi/500){
    //                 x=l;
    //                 m=eval(formula)*scale;
    //                 polToCart(m,l);
    //                 draw.lineTo(floor(graph.width/2)+x+xOff,graph.height/2-y+yOff);
    //             }
    //         } else if(coordinateMode == "cartesian") {
    //             for(l=-xOff;l<graph.width-xOff;l++){
    //                 x = (l-floor(graph.width/2))/scale;
    //                 draw.lineTo(l+xOff,(graph.height/2)-eval(formula)*scale+yOff);
    //             }
    //         } 
    //         draw.stroke();
    //     }
    // }
}
function drawDot(){
    XBox = eval(document.getElementById("XBox").value);
    formula = currentFormula.formula;
    if(darkMode == true){
	    draw.fillStyle = "white";
    } else {
	    draw.fillStyle = "black";
    }
    if(XBox == null){
	    if(coordinateMode == "cartesian"){
	        x=i/scale;
            currentCoordinates.innerHTML = ("(" + x + "," + eval(formula) + ")");
            draw.fillRect(i+floor(graph.width/2)-2+xOff,graph.height/2-eval(formula)*scale-2+yOff,4,4);
	    }
	    if(coordinateMode == "polar"){
	        x=(10*i)/scale*(pi/500);
	        currentCoordinates.innerHTML = ("(" + eval(formula) + "," + x + ")");
	        polToCart(eval(formula)*scale, x);
	        draw.fillRect(x+floor(graph.width/2)-2+xOff,graph.height/2-y-2+yOff,4,4);
	    }
    } else {
        if(coordinateMode == "cartesian"){    
            x=XBox;
            currentCoordinates.innerHTML = ("(" + x + "," + eval(formula) + ")");
            draw.fillRect(x*scale+floor(graph.width/2)-2+xOff,graph.height/2-eval(formula)*scale-2+yOff,4,4);
        }
        if(coordinateMode == "polar"){
            x=XBox;
            currentCoordinates.innerHTML = ("(" + eval(formula) + "," + x + ")");
            polToCart(eval(formula)*scale, x);
            draw.fillRect(x+floor(graph.width/2)-2+xOff,graph.height/2-y-2+yOff,4,4);
        }
    }
}
//BUTTONS
function toggleGrid(){
    if(grid == true){
        grid = false;
    } else {
        grid = true;
    }
    drawGrid();
    drawGraph();
}
settingsButton.onclick = function(){
    if(settings == false){
        settings = true;
        settingsMenu.style = "display:inline";
    } else {
        settings = false;
        settingsMenu.style = "display:none";
    }
    if(coordinateMode == "cartesian"){
        document.getElementById("windowLabel").style = "display:none";
        document.getElementById("window").style = "display:none";
    } else {
        document.getElementById("windowLabel").style = "display:inline";
        document.getElementById("window").style = "display:inline";
        if(darkMode == true){
            document.getElementById("windowLabel").style.color = "white";
        }
    }
}
// centerButton.onclick= function(){
//     xOff = 0;
//     yOff = 0;
//     i = 0;
//     drawGrid();
//     drawGraph();
//     drawDot();
// }
darkButton.onclick = function(){
    if(darkMode == true){
	    darkMode = false;
	    darkButton.value = "Dark Mode";
	    document.body.style.backgroundColor = "white";
	    graph.style = "background-color: white; border:1px solid #000000;";
	    document.getElementById("functionLabel").style.color = "black";
	    document.getElementById("XBoxLabel").style.color = "black";
	    document.getElementById("ScaleLabel").style.color = "black";
        document.getElementById("windowLabel").style.color = "black";
        document.getElementById("currentCoordinates").style.color = "black";    
    } else {
	    darkMode = true;
        darkButton.value = "Light Mode";
	    document.body.style.backgroundColor = "black";
        graph.style = "background-color: black; border:1px solid #ffffff;";
	    document.getElementById("functionLabel").style.color = "white";
	    document.getElementById("XBoxLabel").style.color = "white";
	    document.getElementById("ScaleLabel").style.color = "white";
        document.getElementById("windowLabel").style.color = "white";
        document.getElementById("currentCoordinates").style.color = "white";
    }
    drawGrid();
	drawGraph();
	drawDot();
}
angleButton.onclick = function(){
    if(angleMode == "radians"){
        angleMode = "degrees";
        angleButton.value = "Radians";
    } else {
        angleMode = "radians";
        angleButton.value = "Degrees";
    }
    drawGrid();
    drawGraph();
    drawDot();
}
// coordinateButton.onclick = function(){
//     if(coordinateMode == "parametric"){
//         coordinateMode = "cartesian";
//         coordinateButton.value = "Polar";
//         document.getElementById("xFunctionLabel").style = "display:none";
//         document.getElementById("xFormula").style = "display:none";
//         document.getElementById("yFunctionLabel").style = "display:none";
//         document.getElementById("yFormula").style = "display:none";
//         document.getElementById("functionLabel").style = "display:inline";
//         document.getElementById("formula").style = "display:inline";
//     } else if(coordinateMode == "cartesian"){
//         coordinateMode = "polar";
//         grid = true;
//         toggleGrid();
//         coordinateButton.value = "Parametric";
//         document.getElementById("XBoxLabel").innerHTML = "Angle:";
//         document.getElementById("windowLabel").style = "display:inline";
//         document.getElementById("window").style = "display:inline";
//         document.getElementById("xFunctionLabel").style = "display:none";
//         document.getElementById("xFormula").style = "display:none";
//         document.getElementById("yFunctionLabel").style = "display:none";
//         document.getElementById("yFormula").style = "display:none";
//         if(darkMode == false){
//             document.getElementById("windowLabel").style.color = "black";
//         } else {
//             document.getElementById("windowLabel").style.color = "white";
//         }
//     } else {
//         coordinateMode = "parametric";
//         grid = false;
//         coordinateButton.value = "Cartesian";
//         document.getElementById("XBoxLabel").innerHTML = "X-Val:";
//         document.getElementById("windowLabel").style = "display:none";
//         document.getElementById("window").style = "display:none";
//         document.getElementById("functionLabel").style = "display:none";
//         document.getElementById("formula").style = "display:none";
//         document.getElementById("xFunctionLabel").style = "display:inline";
//         document.getElementById("xFormula").style = "display:inline";
//         document.getElementById("yFunctionLabel").style = "display:inline";
//         document.getElementById("yFormula").style = "display:inline";
//         if(darkMode == false){
//             document.getElementById("xFunctionLabel").style.color = "black";
//             document.getElementById("yFunctionLabel").style.color = "black";
//         } else {
//             document.getElementById("xFunctionLabel").style.color = "white";
//             document.getElementById("yFunctionLabel").style.color = "white";
//         }
//     }
    // clickClear();
//     drawGrid();
// }
function newFunction(){
    new Function(document.getElementById("formula").value);
    updateMenu();
    // formulaArray.push(new formulaObject);
    // formulaArray[formulaArray.length-1].formula = document.getElementById("formula").value;
}
function clickEnter(){
    currentCoordinates.innerHTML = "";
    i = 0;
    yArray.length = 0;
    xArray.length = 0;
    preScale = scale;
    scale = eval(document.getElementById("scale").value);
    if(scale == null){
        scale = 1;
    }
    xOff = xOff*scale/preScale;
    yOff = yOff*scale/preScale;
    XBox = eval(document.getElementById("XBox").value);
    loopTo = eval(document.getElementById("window").value);
    if(scale == null){
        scale = 1;
    }
    if(loopTo == null){
        loopTo = 2*pi;
    }
    formulaList.innerHTML = "";
    if(coordinateMode != "parametric"){
        if(document.getElementById("formula").value != ""){
            newFunction();
            
            for(f=0;f<functionArr.length;f++){
                formulaList.innerHTML += "<span onclick='functionClick("+f+");' id='function"+f+"' style='color: "+setColor(f)+"'>y="+functionArr[f].formula+"</span>, ";
            }
        } else {
            for(f = 0;f < functionArr.length;f++){
                formulaList.innerHTML += "<span onclick='functionClick("+f+");' id='function"+f+"' style='color: "+setColor(f)+"'>y="+functionArr[f].formula+"</span>, ";
            }
        }
    } else {
        if(document.getElementById("xFormula").value != "" && document.getElementById("yFormula").value != ""){
            formulaArray.push([new formulaObject,new formulaObject]);
            formulaArray[formulaArray.length-1][0].formula = document.getElementById("xFormula").value;
            formulaArray[formulaArray.length-1][1].formula = document.getElementById("yFormula").value;
            for(f=0;f<formulaArray.length;f++){
                formulaList.innerHTML += "<span onclick='functionClick("+f+");' id='function"+f+"' style='color: "+setColor(f)+"'>y="+formulaArray[f].formula+"</span>, ";
            }
        } else {
            for(f = 0;f < formulaArray.length;f++){
                formulaList.innerHTML += "<span onclick='functionClick("+f+");' id='function"+f+"' style='color: "+setColor(f)+"'>y="+formulaArray[f].formula+"</span>, ";
            }
        }
    }

    
    updateMenu();
    
    drawGraph();
    document.getElementById("formula").value = "";
}
function functionClick(f){
    formulaList.select;
    currentFormula = functionArr[f];
    drawGraph();
    drawDot();
}
function clickClear(){   
    draw.clearRect(-0.5, -0.5, graph.width, graph.height);
    xOff = 0;
    yOff = 0;
    drawGrid();
    currentCoordinates.innerHTML = "";
    i = 0;
    x = 0;
    y = 0;
    xArray.length = 0;
    yArray.length = 0;
    functionArr.length = 0;
    formulaList.innerHTML = "";
    formula = "";
    currentFormula.formula = "";
    document.getElementById("formula").value = null;
    if(menu()){
        updateMenu();
    }
}
//KEY INPUTS
function keydown(e) {
    if (e.keyCode == 115 || e.keyCode == 83)
        down = true;
    if (e.keyCode == 119 || e.keyCode == 87)
        up = true;
    if (e.keyCode == 97 || e.keyCode == 65)
        left = true;
    if (e.keyCode == 100 || e.keyCode == 68)
        right = true;
    if (e.keyCode === 13)
        clickEnter();
    if(document.activeElement.id != "formula" && document.activeElement.id != "XBox" && document.activeElement.id != "scale" && document.activeElement.id != "window"){
        if (e.keyCode === 74){
            xOff = xOff + 5;
            drawGrid();
            drawGraph();
            drawDot();
        }
        if (e.keyCode === 76){
            xOff = xOff - 5;
            drawGrid();
            drawGraph();
            drawDot();
        }
        if (e.keyCode === 75){
            yOff = yOff - 5;
            drawGrid();
            drawGraph();
            drawDot();
        }
        if (e.keyCode === 73){
            yOff = yOff + 5;
            drawGrid();
            drawGraph();
            drawDot();
        }
    }
    //console.log(event.keyCode);
}
function keyup(e) {
    if (e.keyCode == 115 || e.keyCode == 83)
        down = false;
    if (e.keyCode == 119 || e.keyCode == 87)
        up = false;
    if (e.keyCode == 97 || e.keyCode == 65)
        left = false;
    if (e.keyCode == 100 || e.keyCode == 68)
        right = false;
}
function wasd(e) {
    if (up == true && left == true) {y = (y + 1/2);i = (i - 1/2);}
    else if (up == true) {y = (y + 1/2);}
    else if (left == true) {i = (i - 1/2);}
    
    if (up == true && right == true) {y = (y + 1/2);i = (i + 1/2);}
    else if (up == true) {y = (y + 1/2);}
    else if (right == true) {i = (i + 1/2);}

    if (down == true && left == true) {y = (y - 1/2);i = (i - 1/2);}
    else if (down == true) {y = (y - 1/2);}
    else if (left == true) {i = (i - 1/2);}

    if (down == true && right == true) {y = (y - 1/2);i = (i + 1/2);}
    else if (down == true) {y = (y - 1/2);}
    else if (right == true) {i = (i + 1/2);}
    
    drawGrid();
    if(functionArr.length == 0){
        if (e.keyCode == 32) {
            xArray.push(i+floor(graph.width/2));
            yArray.push(graph.height/2-y);
        }
        draw.beginPath();
        for(z=0;z<xArray.length;z++){
            draw.lineTo(xArray[z],yArray[z]);
	    draw.fillRect(xArray[z]-2,yArray[z]-2,4,4);
        }
        draw.stroke();
        currentCoordinates.innerHTML = "("+i+","+y+")";
	draw.fillRect(i+floor(graph.width/2)-2,graph.height/2-y-2,4,4);
    } else {
        drawGraph();
        drawDot();
    }
}
graph.onmousedown = function() {
    panning = true;
}
document.onmouseup = function(){
    panning = false;
}
document.onmousemove = function(e){
    if(panning){
        xOff+=e.movementX;
        yOff+=e.movementY;
        drawGrid();
        drawGraph();
        drawDot();
    }
}
document.onwheel = function(e){
    let wheelDel = e.wheelDelta;
    if(wheelDel == 0){
        wheelDel = 1;
    }
    scale = scale * 1.05 ** (wheelDel/abs(wheelDel));
    xOff = xOff * 1.05 ** (wheelDel/abs(wheelDel));
    yOff = yOff * 1.05 ** (wheelDel/abs(wheelDel));
    document.getElementById("scale").value = scale;
    drawGrid();
    drawGraph();
    drawDot();
}
document.onkeydown = keydown;
document.onkeyup = keyup;
document.onkeypress = function(e){
    if (e.keyCode == 119 || e.keyCode == 87 || e.keyCode == 115 || e.keyCode == 83 || e.keyCode == 97 || e.keyCode == 65 || e.keyCode == 100 || e.keyCode == 68 || e.keyCode == 32){
        wasd(e);
    }
    if (e.keyCode == 104 || e.keyCode == 72){
        if(currentFormula.formula != ""){
            if(currentFormula.hide == false){
                currentFormula.hide = true;
                drawGrid();
                drawGraph();
                drawDot();
            } else {
                currentFormula.hide = false;
                drawGrid();
                drawGraph();
                drawDot();
            }
        }
    }
}
enter.onclick = clickEnter;
clear.onclick = clickClear;
gridToggle.onclick = toggleGrid;
//Sizing
window.onresize = function(){
    pixelRatio = window.devicePixelRatio;
    document.body.style.zoom=1/pixelRatio;
    graph.width = pixelRatio*document.documentElement.clientWidth - 20;
    graph.height = pixelRatio*document.documentElement.clientHeight - 80;
	drawGraph();
}

document.getElementById("menu").onclick = function(){
    if(!menu()){
        createMenu();
    } else {
        clearMenu();
    }
}

document.getElementById("home").onclick = function(){
    scale = 100;
    xOff = 0;
    yOff = 0;
    drawGraph();
}

function menu(){
    if(document.getElementById("menuPopUp") == null){
        return false;
    } else {
        return true;
    }
}

function createMenu(){
    let menu = createElement("div", "menuPopUp", "menuPopUp", document.body);
    for(i=0; i<functionArr.length; i++){
        functionArr[i].createFunctionDiv(menu);
    }
    let addButton = createElement("div", "addFunction", "addFunction", menu);
    createTextElement("h1", "addFunctionLabel", "text", "+", addButton);
    addButton.onclick = function(){
        newFunction();
    }
}

function clearMenu(){
    document.getElementById("menuPopUp").remove();
}

function updateMenu(){
    if(menu()){
        clearMenu();
        createMenu();
    }
}

function createElement(type, id, classes, parent){
    element = document.createElement(type);
    element.setAttribute('id', id);
    element.setAttribute('class', classes);
    parent.appendChild(element);
    return element;
}

function createTextElement(type, id, classes, text, parent){
    element = document.createElement(type);
    element.setAttribute('id', id);
    element.setAttribute('class', classes);
    element.innerHTML = text;
    parent.appendChild(element);
    return element;
}