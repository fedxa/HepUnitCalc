"use strict";

//----------------------------------------------------------------------
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
// const h =  1.054571596e-34;
const hc = 1.973269602e-14;
// const e2 = 7.2973525e-3;

// "Bootstrap" units
var units = {
    i:   dimval(math.complex(0,1)),
    pi:  dimval(math.pi),
    e:   dimval(math.e),
    GeV: dimval(1, 1)
}
// "Derived" units
units["MeV"] = dim_eval("1e-3 GeV");
units["keV"] = dimval(1e-6, 1);
units["eV"] =  dimval(1e-9, 1);
units["cm"] =  dimval( 1./hc, -1);
units["km"] =  dimval( 1.e5/hc, -1);
units["pc"] =  dimval( 3.0856775807e18/hc, -1);
units["Mpc"] = dimval( 3.0856775807e24/hc, -1);
units["s"] =   dimval( c/hc, -1);
units["yr"] =  dimval( 3600*24*365.*c/hc, -1);
units["Mpl"] = dimval( 1.221e19, 1);
units["g"] =   dimval( 1./1.782661731e-24, 1);
units["kg"] =  dimval( 1./1.782661731e-27, 1);
units["Msun"] = dimval( 1.9889e57/1.782661731, 1);
units["K"] =   dimval( 1.e-9/(300*38.681686), 1);
units["G"] =   dimval( math.sqrt(137.03599976)*2*0.510998902e-3*5.788381749e-18, 2);
units["m"] =   dimval( 100./hc, -1);
units["m_e"] = dimval( 0.510998902e-3, 1);
units["m_p"] = dimval( 0.938271998, 1);
units["Hz"] =  dimval( 2*math.pi*hc/c, 1);
units["kHz"] = dimval( 2*math.pi*1.e3*hc/c, 1);
units["MHz"] = dimval( 2*math.pi*1.e6*hc/c, 1);
units["GHz"] = dimval( 2*math.pi*1.e9*hc/c, 1);
units["barn"] = dimval( 1.e-24/(hc*hc), -2);
units["sigmat"] = dimval( 0.665245854e-24/(hc*hc), -2);
units["Jy"] = dimval( 2.4303146457e-48, 3);
units["erg"] = dimval(  6.2415097419e+2, 1);
units["J"] =   dimval( 6.2415097419e+9, 1);
units["W"] =   dimval( 4.1082359198e-15, 2);
units["T"] =   dimval( math.sqrt(137.03599976)*2*0.510998902e-3*5.788381749e-14, 2);
units["kpc"] = dimval( 3.0856775807e21/hc, -1);
units["m_w"] = dimval( 80.419, 1);
units["m_z"] = dimval( 91.1882, 1);
units["AU"] =  dimval( 1.4959787066e13/hc, -1);
units["sigmaB"] = dimval( 0.164493406684823, 0);
units["Rsun"] = dimval( 3.5245840699e+24, -1);
units["Lsun"] = dimval( 1.5771517696e+12, 2);


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


//----------------------------------------------------------------------
// Keyboard behavior

// Select browser of mobile version
var displayId = "display";
var unitdisplayId = "unitdisplay";
var cur_input = document.getElementById('display');
var cur_caret = document.getElementById('caret');
var cur_cursor = 0;
var shift_state = false;
// var csevent;



function $(elid) {
  return document.getElementById(elid);
}

// function writeit(from, e) {
//   e = e || window.event;
//     let w = cur_caret.parentElement;
//     let tw = from.value;
//     Cpress();
//     insertTextAtCaret(tw);
// }

function moveIt(count, e) {
  e = e || window.event;
  let keycode = e.keyCode || e.which;
    //				alert(count);
    let p = cur_caret.parentElement;
    if (keycode == 37) {
	p.insertBefore(cur_caret, cur_caret.previousElementSibling);
  } else if (keycode == 39) {
	p.insertBefore(cur_caret, cur_caret.nextElementSibling);
  }

}

function alert(txt) {
  console.log(txt);
}




function moveCaret(event) {
    let t = event.target;
    let p = t.parentElement;
    p.insertBefore(cur_caret, t);
    // $('setter').focus();
    cur_input = p;
    event.stopPropagation();
}

function moveCaretDiv(event) {
    let t = event.target;
    if (event.clientX>t.clientWidth-10)
	t.appendChild(cur_caret);
    else
	t.insertBefore(cur_caret, t.firstElementChild)
    //    csevent = event;
    // $('setter').focus();
}

// Working with div text input
function insertCharAtCaret(char) {
    let n = document.createElement('span');
    n.addEventListener('click', moveCaret);
    n.innerText = char;
    cur_caret.parentElement.insertBefore(n, cur_caret);
}

function insertTextAtCaret(text) {
    if (cur_input.nodeName=="INPUT") {
	let strPos = cur_cursor;
	let front = (cur_input.value).substring(0, strPos);
	let back = (cur_input.value).substring(strPos, cur_input.value.length);
	cur_input.value = front + text + back;
	strPos = strPos + text.length;
	cur_input.selectionStart = strPos;
	cur_input.selectionEnd = strPos;
	cur_cursor = strPos;
    } else {
	for (let i=0; i<text.length; i++)
	    insertCharAtCaret(text[i]);
    }
}

function deleteAtCaret() {
    let prev = cur_caret.previousElementSibling;
    if (prev)
	prev.remove();
}

function getValue(div) {
    if (div.nodeName=="INPUT")
	return div.value
    else
	return div.innerText;
}

// Dangerous - can kill caret
function setValue(div, text) {
    div.innerText = text;
}

function addChar(characters) {
    insertTextAtCaret(characters);
    shiftOff();
}

function deleteChar() {
    deleteAtCaret();
}

function Cpress() {
    if (cur_input.nodeName=="INPUT") {
	cur_input.value = "";
	cur_cursor = 0;
    } else {
	let parent = cur_caret.parentElement;
	parent.innerHTML = "";
	parent.appendChild(cur_caret);
    }
}

function compute() {
    let valuedisplay = document.getElementById(displayId);
    let unitdisplay = document.getElementById(unitdisplayId);
    let resultdisplay = document.getElementById("resultdisplay");
    try {
	let val = dim_eval(getValue(valuedisplay));
	let uname = getValue(unitdisplay);
	let u = dim_eval(uname);
	setValue(resultdisplay, dim_format(gev_to_units(val, u), uname) );
    } catch(err) {
	setValue(resultdisplay, "Error: "+err);
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
    if (typeof(device)!="undefined" && device.platform=="Android")
	cur_input.blur();
    // document.getElementById('resultdisplay').value = "platform "+device.platform;
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
    default:
	insertCharAtCaret(x);
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

function shiftOn() {
    for (let de of document.getElementsByClassName("shift0")) de.style.display="none";
    for (let de of document.getElementsByClassName("shift1")) de.style.display="inherit";
    shift_state = true;
}
function shiftOff() {
    for (let de of document.getElementsByClassName("shift0")) de.style.display="inherit";
    for (let de of document.getElementsByClassName("shift1")) de.style.display="none";
    shift_state = false;
}
function toggleShift() {
    if (shift_state)
        shiftOff();
    else
        shiftOn();
}


// This is executed at start
// Fill the unit menu
{
    if (cordova.platformId == "browser") {
	$(displayId).classList.add("hidden");
	$(unitdisplayId).classList.add("hidden");
	displayId = "displayBrowser";
	unitdisplayId = "unitdisplayBrowser";
	$(displayId).classList.remove("hidden");
	$(unitdisplayId).classList.remove("hidden");
	cur_input = displayId;
    }
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
