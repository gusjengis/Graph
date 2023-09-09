//Setup
var angleMode = "degrees"

//Constants
var e = Math.E;
var pi = Math.PI;
var phi = (1 + 5**(1/2))/2;
 
//Functions
function polToCart(m,d){
    if(angleMode == "degrees"){
        d=pi*d/180;
    }
    x = m*cos(d);
    y = m*sin(d);
}
function sin(n){
    if(angleMode == "degrees"){
        n = pi*n/180;
    }
    return Math.sin(n);
}
function arcsin(n){
    if(angleMode == "degrees"){
        n = pi*n/180;
    }
    return Math.asin(n);
}
function cos(n){
    if(angleMode == "degrees"){
        n = pi*n/180;
    }
    return Math.cos(n);
}
function arccos(n){
    if(angleMode == "degrees"){
        n = pi*n/180;
    }
    return Math.acos(n);
}
function tan(n){
    if(angleMode == "degrees"){
        n = pi*n/180;
    }
    return Math.tan(n);
}
function arctan(n){
    if(angleMode == "degrees"){
        n = pi*n/180;
    }
    return Math.atan(n);
}
function csc(n){
    if(angleMode == "degrees"){
        n = pi*n/180;
    }
    return 1/Math.sin(n);
}
function arccsc(n){
    if(angleMode == "degrees"){
        n = pi*n/180;
    }
    return 1/Math.asin(n);
}
function sec(n){
    if(angleMode == "degrees"){
        n = pi*n/180;
    }
    return 1/Math.cos(n);
}
function arcsec(n){
    if(angleMode == "degrees"){
        n = pi*n/180;
    }
    return 1/Math.acos(n);
}
function cot(n){
    if(angleMode == "degrees"){
        n = pi*n/180;
    }
    return 1/Math.tan(n);
}
function arccot(n){
    if(angleMode == "degrees"){
        n = pi*n/180;
    }
    return 1/Math.atan(n);
}
function floor(n){
    return Math.floor(n);
}
function ceiling(n){
    return Math.ceil(n);
}
function abs(n){
    return Math.abs(n);
}
function log(b,n){
    return Math.log(n)/Math.log(b);
}
function equal(a,b){
    if(abs(a-b) <= 0.00001){
        return true;
    } else {
        return false;
    }
}

function sqrt(n){
    return (n)**(1/2);
}

function max(a, b){
    return Math.max(a,b);
}

function min(a, b){
    return Math.min(a,b);
}