var cur_input = document.getElementById('display');
var cur_cursor = 0;

function insertAtCaret(txtarea, text) {
    if (!txtarea) {
	return;
    }
    let strPos = cur_cursor
    let front = (txtarea.value).substring(0, strPos);
    let back = (txtarea.value).substring(strPos, txtarea.value.length);
    txtarea.value = front + text + back;
    strPos = strPos + text.length;
    txtarea.selectionStart = strPos;
    txtarea.selectionEnd = strPos;
    cur_cursor = strPos;
}

function addChar(character) {
    if (!cur_input)
	cur_input = document.getElementById('display');
    let input = cur_input
    if(input.value == null || input.value == "0") {
	input.value = character
	cur_cursor = character.length
    } else
	insertAtCaret(input, character)
}

function deleteChar() {
    let input = cur_input
    strPos = cur_cursor
    str = input.value
    input.value = str.substring(0, strPos-1)+str.substring(strPos,str.length)
    cur_cursor = strPos-1
}

function Cpress() {
    cur_input = document.getElementById('display')
    cur_input.value=''
    cur_cursor=0
}

// var val = 0.0;
// function percent(input) {
//   val = input.value;
//   input.value = input.value + "%";
// }

function dimval(v, un=0, ud=1) {
    return { v: v, u: math.fraction(un,ud) }
}

const c =  2.99792458e10
const h =  1.054571596e-34
const hc = 1.973269602e-14
const e2 = 7.2973525e-3

var units = {
    i:   dimval(math.complex(0,1)),
    pi:  dimval(math.pi),
    GeV: dimval(1, 1),
    MeV: dimval(1e-3, 1),
    keV: dimval(1e-6, 1),
    eV:  dimval(1e-9, 1),
    cm:  dimval( 1./hc, -1,1),
    km:  dimval( 1.e5/hc, -1,1),
    pc:  dimval( 3.0856775807e18/hc, -1,1),
    Mpc: dimval( 3.0856775807e24/hc, -1,1),
    s:   dimval( c/hc, -1,1),
    yr:  dimval( 3600*24*365.*c/hc, -1,1),
    Mpl: dimval( 1.221e19, 1,1),
    g:   dimval( 1./1.782661731e-24, 1,1),
    kg:  dimval( 1./1.782661731e-27, 1,1),
    Msun: dimval( 1.9889e57/1.782661731, 1,1),
    K:   dimval( 1.e-9/(300*38.681686), 1,1),
    G:   dimval( math.sqrt(137.03599976)*2*0.510998902e-3*5.788381749e-18, 2,1),
    m:   dimval( 100./hc, -1,1),
    m_e: dimval( 0.510998902e-3, 1,1),
    m_p: dimval( 0.938271998, 1,1),
    Hz:  dimval( 2*math.pi*hc/c, 1,1),
    kHz: dimval( 2*math.pi*1.e3*hc/c, 1,1),
    MHz: dimval( 2*math.pi*1.e6*hc/c, 1,1),
    GHz: dimval( 2*math.pi*1.e9*hc/c, 1,1),
    barn: dimval( 1.e-24/(hc*hc), -2,1),
    e:   dimval( 1./math.sqrt(137.03599976), 0,1),
    sigmat: dimval( 0.665245854e-24/(hc*hc), -2,1),
    Jy : dimval( 2.4303146457e-48, 3,1),
    erg: dimval(  6.2415097419e+2, 1,1),
    J:   dimval( 6.2415097419e+9, 1,1),
    W:   dimval( 4.1082359198e-15, 2,1),
    T:   dimval( math.sqrt(137.03599976)*2*0.510998902e-3*5.788381749e-14, 2,1),
    kpc: dimval( 3.0856775807e21/hc, -1,1),
    m_w: dimval( 80.419, 1,1),
    m_z: dimval( 91.1882, 1,1),
    AU:  dimval( 1.4959787066e13/hc, -1,1),
    sigmaB: dimval( 0.164493406684823, 0,1),
    Rsun: dimval( 3.5245840699e+24, -1,1),
    Lsun: dimval( 1.5771517696e+12, 2,1)
}

function unit_plus(a, b) {
    if (math.equal(a.u,b.u))
	return { v: math.add(a.v,b.v), u: a.u }
    else
	throw "Addition unit mismatch"
}

function unit_minus(a, b) {
    if (math.equal(a.u,b.u))
	return { v: math.subtract(a.v,b.v), u: a.u }
    else
	throw "Subtraction unit mismatch"
}

function unit_negate(a) {
    return { v: math.unaryMinus(a.v), u: a.u }
}

function unit_mul(a, b) {
    return { v: math.multiply(a.v,b.v), u: math.add(a.u,b.u) }
}

function unit_div(a, b) {
    return { v: math.divide(a.v,b.v), u: math.subtract(a.u,b.u) }
}

function unit_pow(a, b) {
    if (math.equal(b.u,0))
	return { v: math.pow(a.v,b.v), u: math.multiply(a.u,b.v) }
    else
	throw "Dimensionful exponent"
}

function eval_tree(node) {
    switch (node.type) {
    case 'ConstantNode':
	return dimval(node.value, 0);
    case 'SymbolNode':
	return units[node.name];
    case 'ParenthesisNode':
	return eval_tree(node.content);
    case 'OperatorNode':
	switch (node.fn) {
	case 'add': return unit_plus(eval_tree(node.args[0]), eval_tree(node.args[1]))
	case 'subtract': return unit_minus(eval_tree(node.args[0]), eval_tree(node.args[1]))
	case 'multiply': return unit_mul(eval_tree(node.args[0]), eval_tree(node.args[1]))
	case 'divide': return unit_div(eval_tree(node.args[0]), eval_tree(node.args[1]))
	case 'pow': return unit_pow(eval_tree(node.args[0]), eval_tree(node.args[1]))
	case 'unaryPlus': return eval_tree(node.args[0])
	case 'unaryMinus': return unit_negate(eval_tree(node.args[0]))
	}
    case 'FunctionNode':
	let arg = eval_tree(node.args[0])
	if (node.name=="sqrt")
	    return { v: math.sqrt(arg.v), u: math.divide(arg.u, 2) }
	else if (math.unequal(arg.u,0))
	    throw "Dimensional function arg"
	else {
	    node.args[0] = new math.expression.node.ConstantNode(arg.v)
	    return dimval(node.eval(), 0)
	}
    }
}

function gev_to_units(v, t) {
    let dim
    if (t.u!=0)
	dim = math.divide(v.u, t.u)
    else if (v.u==0) // Both are dimensionless -- still convert!
	dim = math.fraction(1)
    else
	throw "Can not convert to dimensionless"
    let val = math.divide(v.v,math.pow(t.v, Number(dim)))
    return dimval(val, dim.s*dim.n, dim.d)
}

function print_units(uv, uname="GeV") {
    if (math.parse(uname).type!="SymbolNode")
	uname="("+uname+")"
    if (uv.u==0)
	return String(uv.v)
    else if (uv.u==1)
	return String(uv.v)+"*"+uname
    else if (uv.u.d==1)
	return String(uv.v)+"*"+uname+"^"+uv.u.toFraction()
    else
	return String(uv.v)+"*"+uname+"^("+uv.u.toFraction()+")"
}

function compute() {
    let valuedisplay = document.getElementById("display")
    let unitdisplay = document.getElementById("unitdisplay")
    let resultdisplay = document.getElementById("resultdisplay")
    try {
	let val = eval_tree(math.parse(valuedisplay.value))
	let uname = unitdisplay.value
	let u = eval_tree(math.parse(uname))
	resultdisplay.value = print_units(gev_to_units(val,u),uname)
    } catch(err) {
	resultdisplay.value = "Error: "+err
    }
}

function inputPressed(event) {
    cur_input = event.target
    cur_cursor = event.target.selectionStart
    // document.getElementById('resultdisplay').value = "in"+String(cur_cursor)
}

function focusPressed(event) {
    cur_input = event.target
    cur_cursor = event.target.selectionStart
    // document.getElementById('resultdisplay').value = "focus"+String(cur_cursor)
}

function clickPressed(event) {
    cur_input = event.target
    cur_cursor = event.target.selectionStart
    // document.getElementById('resultdisplay').value = "click"+String(cur_cursor)
}

function blurHandler(event) {
    cur_input = event.target
    cur_cursor = event.target.selectionStart
    console.log('blur')
    // document.getElementById('resultdisplay').value = "click"+String(cur_cursor)
}

function keyPressed(event) {
    cur_input = event.target
    cur_cursor = event.target.selectionStart+1
    // document.getElementById('resultdisplay').value = cur_cursor
    let x = event.charCode || event.keyCode;  // Get the Unicode value
    // document.getElementById('resultdisplay').value = x
    switch (x) {
    case 13: // Enter
    case 9: // Tab
    	compute()
    }
}

function unitdropdownFunc() {
    document.getElementById("unitDropdown").classList.toggle("show");
}


function toggleSelDropdown() {
    let v = document.getElementById('unitSelDropdown').style.display
    document.getElementById('unitSelDropdown').style.display =
	(v=='block') ? 'none' : 'block';
}
function hideSelDropdown() {
    document.getElementById('unitSelDropdown').style.display = 'none';
}

function addUnit() {
    hideSelDropdown()
    addChar(document.getElementById('curUnit').innerText)
}

function selUnit(el) {
    document.getElementById('curUnit').innerText = el.innerText
    addUnit()
}


// Fill the unit menu
{
    let el = document.getElementById("unitSelDropdown")
    function genevent(el) { return function() { selUnit(el) } }
    for ( x in units ) {
	if (x=="i" || x=="pi") continue
	let div = document.createElement('div')
	div.innerText = x
	div.addEventListener("click", genevent(div))
	el.appendChild(div)
    }
}
