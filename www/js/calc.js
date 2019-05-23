"use strict";

// Algebra engine

// Create a "dimensional value" object DV
// representing the quantity DV.u*(baseunit)^dv.u
// dv.u is stored as math.fraction
function dimval(v, u=0) {
    return { v: v, u: math.fraction(u) };
}

// Basic operations on dimensional quantities
function dim_add(a, b) {
    if (math.unequal(a.u, b.u)) {
	throw "add: unit mismatch";
    }
    return dimval(math.add(a.v, b.v), a.u);
}

function dim_subtract(a, b) {
    if (math.unequal(a.u, b.u)) {
	throw "subtract: unit mismatch";
    }
    return dimval(math.subtract(a.v, b.v), a.u);
}

function dim_unaryMinus(a) {
    return dimval(math.unaryMinus(a.v), a.u);
}

function dim_multiply(a, b) {
    return dimval(math.multiply(a.v, b.v), math.add(a.u, b.u));
}

function dim_divide(a, b) {
    return dimval(math.divide(a.v, b.v), math.subtract(a.u,b.u));
}

function dim_pow(a, b) {
    if (math.unequal(b.u, 0)) {
	throw "Dimensionful exponent";
    }
    return dimval(math.pow(a.v, b.v), math.multiply(a.u,b.v));
}

// Takes the expression parsed by math.parse and evaluates it as
// dimensional value
function eval_tree(node) {
    switch (node.type) {
    case 'ConstantNode':
	return dimval(node.value);
    case 'SymbolNode':
	if (node.name in units)
	    return units[node.name];
	else
	    throw "Unknown unit: "+node,name;
    case 'ParenthesisNode':
	return eval_tree(node.content);
    case 'OperatorNode':
	switch (node.fn) {
	case 'add':
	    return dim_add(eval_tree(node.args[0]), eval_tree(node.args[1]));
	case 'subtract':
	    return dim_subtract(eval_tree(node.args[0]), eval_tree(node.args[1]));
	case 'multiply':
	    return dim_multiply(eval_tree(node.args[0]), eval_tree(node.args[1]));
	case 'divide':
	    return dim_divide(eval_tree(node.args[0]), eval_tree(node.args[1]));
	case 'pow':
	    return dim_pow(eval_tree(node.args[0]), eval_tree(node.args[1]));
	case 'unaryPlus':
	    return eval_tree(node.args[0]);
	case 'unaryMinus':
	    return dim_unaryMinus(eval_tree(node.args[0]));
	default:
	    throw "operator "+node.fn+" not implemented";
	}
    case 'FunctionNode':
	if (node.name=="sqrt") {
	    let arg = eval_tree(node.args[0]);
	    return dimval(math.sqrt(arg.v), math.divide(arg.u, 2));
	} else {
	    for (let i=0; i<node.args.length; i++) {
		let arg = eval_tree(node.args[i]);
		if (math.unequal(arg.u, 0))
		    throw "Dimensional function arg";
		node.args[i] = new math.expression.node.ConstantNode(arg.v);
	    }
	    return dimval(node.eval(), 0);
	}
    default:
	throw "eval: "+node.type+" not implemented";
    }
}

function dim_eval(expr) {
    return eval_tree(math.parse(expr));
}


// Constant definition
const c =  2.99792458e10;
const h =  1.054571596e-34;
const hc = 1.973269602e-14;
const e2 = 7.2973525e-3;

// "Bootstrap"
var units = {
    i:   dimval(math.complex(0,1)),
    pi:  dimval(math.pi),
    e:   dimval(math.e),
    GeV: dimval(1, 1)
}

// Derived values
units = {
    i:   dimval(math.complex(0,1)),
    pi:  dimval(math.pi),
    e:   dimval(math.e),
//    e:   dimval( 1./math.sqrt(137.03599976), 0),
    GeV: dimval(1, 1),
    MeV: dim_eval("1e-3 GeV"),
    keV: dimval(1e-6, 1),
    eV:  dimval(1e-9, 1),
    cm:  dimval( 1./hc, -1),
    km:  dimval( 1.e5/hc, -1),
    pc:  dimval( 3.0856775807e18/hc, -1),
    Mpc: dimval( 3.0856775807e24/hc, -1),
    s:   dimval( c/hc, -1),
    yr:  dimval( 3600*24*365.*c/hc, -1),
    Mpl: dimval( 1.221e19, 1),
    g:   dimval( 1./1.782661731e-24, 1),
    kg:  dimval( 1./1.782661731e-27, 1),
    Msun: dimval( 1.9889e57/1.782661731, 1),
    K:   dimval( 1.e-9/(300*38.681686), 1),
    G:   dimval( math.sqrt(137.03599976)*2*0.510998902e-3*5.788381749e-18, 2),
    m:   dimval( 100./hc, -1),
    m_e: dimval( 0.510998902e-3, 1),
    m_p: dimval( 0.938271998, 1),
    Hz:  dimval( 2*math.pi*hc/c, 1),
    kHz: dimval( 2*math.pi*1.e3*hc/c, 1),
    MHz: dimval( 2*math.pi*1.e6*hc/c, 1),
    GHz: dimval( 2*math.pi*1.e9*hc/c, 1),
    barn: dimval( 1.e-24/(hc*hc), -2),
    sigmat: dimval( 0.665245854e-24/(hc*hc), -2),
    Jy : dimval( 2.4303146457e-48, 3),
    erg: dimval(  6.2415097419e+2, 1),
    J:   dimval( 6.2415097419e+9, 1),
    W:   dimval( 4.1082359198e-15, 2),
    T:   dimval( math.sqrt(137.03599976)*2*0.510998902e-3*5.788381749e-14, 2),
    kpc: dimval( 3.0856775807e21/hc, -1),
    m_w: dimval( 80.419, 1),
    m_z: dimval( 91.1882, 1),
    AU:  dimval( 1.4959787066e13/hc, -1),
    sigmaB: dimval( 0.164493406684823, 0),
    Rsun: dimval( 3.5245840699e+24, -1),
    Lsun: dimval( 1.5771517696e+12, 2)
};


// Unit conversion!  Returns a dimensionful quantity for V using
// dimensional quantity T as a new base unit
function gev_to_units(v, t) {
    let dim;
    if (t.u!=0) {
	dim = math.divide(v.u, t.u);
    } else if (v.u==0) { // Both are dimensionless -- still convert!
	dim = math.fraction(1);
    } else {
	throw "Can not convert to dimensionless";
    }
    let val = math.divide(v.v, math.pow(t.v, Number(dim)));
    return dimval(val, dim);
}

// Pretty format dimensional value
function dim_format(uv, uname="GeV") {
    let val = math.format(uv.v, {precision: 10});
    if (uv.u==0) {
	return val;
    } else if (uv.u==1) {
	return val+" "+uname;
    } else {
	if (math.parse(uname).type!="SymbolNode") {
	    uname="("+uname+")";
	}
	if (uv.u.d==1) {
	    return val+" "+uname+"^"+uv.u.toFraction();
	} else {
	    return val+" "+uname+"^("+uv.u.toFraction()+")";
	}
    }
}


// Keyboard behavior

var cur_input = document.getElementById('display');
var cur_cursor = 0;

function insertAtCaret(txtarea, text) {
    if (!txtarea) {
	return;
    }
    let strPos = cur_cursor;
    let front = (txtarea.value).substring(0, strPos);
    let back = (txtarea.value).substring(strPos, txtarea.value.length);
    txtarea.value = front + text + back;
    strPos = strPos + text.length;
    txtarea.selectionStart = strPos;
    txtarea.selectionEnd = strPos;
    cur_cursor = strPos;
}

function addChar(character) {
    if (!cur_input) {
	cur_input = document.getElementById('display');
    }
    let input = cur_input;
    if(input.value == null || input.value == "0") {
	input.value = character;
	cur_cursor = character.length;
    } else {
	insertAtCaret(input, character);
    }
}

function deleteChar() {
    let input = cur_input;
    strPos = cur_cursor;
    str = input.value;
    input.value = str.substring(0, strPos-1)+str.substring(strPos,str.length);
    cur_cursor = strPos-1;
}

function Cpress() {
    cur_input = document.getElementById('display');
    cur_input.value='';
    cur_cursor=0;
}

function compute() {
    let valuedisplay = document.getElementById("display");
    let unitdisplay = document.getElementById("unitdisplay");
    let resultdisplay = document.getElementById("resultdisplay");
    try {
	let val = dim_eval(valuedisplay.value);
	let uname = unitdisplay.value;
	let u = dim_eval(uname);
	resultdisplay.value = dim_format(gev_to_units(val,u),uname);
    } catch(err) {
	resultdisplay.value = "Error: "+err;
    }
}

function inputPressed(event) {
    cur_input = event.target;
    cur_cursor = event.target.selectionStart;
    // document.getElementById('resultdisplay').value = "in"+String(cur_cursor);
}

function focusPressed(event) {
    cur_input = event.target;
    cur_cursor = event.target.selectionStart;
    // document.getElementById('resultdisplay').value = "focus"+String(cur_cursor);
}

function clickPressed(event) {
    cur_input = event.target;
    cur_cursor = event.target.selectionStart;
    // document.getElementById('resultdisplay').value = "click"+String(cur_cursor);
}

function blurHandler(event) {
    cur_input = event.target;
    cur_cursor = event.target.selectionStart;
    console.log('blur');
    // document.getElementById('resultdisplay').value = "click"+String(cur_cursor);
}

function keyPressed(event) {
    cur_input = event.target;
    cur_cursor = event.target.selectionStart+1;
    // document.getElementById('resultdisplay').value = cur_cursor;
    let x = event.charCode || event.keyCode;  // Get the Unicode value
    // document.getElementById('resultdisplay').value = x;
    switch (x) {
    case 13: // Enter
    case 9: // Tab
    	compute();
    }
}

function unitdropdownFunc() {
    document.getElementById("unitDropdown").classList.toggle("show");
}


function toggleSelDropdown() {
    let v = document.getElementById('unitSelDropdown').style.display;
    document.getElementById('unitSelDropdown').style.display =
	(v=='block') ? 'none' : 'block';
}
function hideSelDropdown() {
    document.getElementById('unitSelDropdown').style.display = 'none';
}

function addUnit() {
    hideSelDropdown();
    addChar(document.getElementById('curUnit').innerText);
}

function selUnit(el) {
    document.getElementById('curUnit').innerText = el.innerText;
    addUnit();
}


// Fill the unit menu
{
    function genevent(el) {
	return function() { selUnit(el); };
    }
    let el = document.getElementById("unitSelDropdown");
    for ( let x in units ) {
	if (x=="i" || x=="pi" || x=="e") continue;
	let div = document.createElement('div');
	div.innerText = x;
	div.addEventListener("click", genevent(div));
	el.appendChild(div);
    }
}
