var ctx;
var oImg;
var xImg;
var backgroundImg;
var Iterator = 0;
var objects = new Array(9);
var check = new Array(9);
var playerTurn = true;
var whoStart = true;
var rot;
var counter = 0;
var loseIndex, winIndex, drawIndex;

var Context = {
	canvas : null,
	create : function(canvas_tag_id) {
		this.canvas = document.getElementById(canvas_tag_id);
		return this.canvas.getContext("2d");
	}
};

function loadObjects(){
	oImg = new Image();
	oImg.src = 'images/O.jpg';
	xImg = new Image();
	xImg.src = 'images/X.png';
	backgroundImg = new Image();
	backgroundImg.src = 'images/background.png';
	ctx = Context.create('canvas');

	Context.canvas.addEventListener("mousedown", doMouseDown, false);
};

function doMouseDown(){
	if(playerTurn){
		var X = event.pageX;
		var Y = event.pageY;
		var index;
		for(var i = 0 ; i < 9 ; i++){
			if(objects[i].havePoint(X, Y) && check[i] == 0){
				objects[i].image = xImg;
				objects[i].draw();
				check[i] = 1;
				index = i;
				break;
			}
		}
		var emptyIndexes = 0;
		for (var i = check.length - 1; i >= 0; i--) {
			if(check[i] == 0) ++emptyIndexes;
		}
		playerTurn = false;
		rot = new Node();
		rot.value = check.slice();
		rot.level = true;
		rot.v = -1000;
		rot.alpha = 1000;
		rot.beta = -1000;
		rot.roott = true;
		rot.index = index;
		//console.log(rot);
		minmax(rot, emptyIndexes);
		var c = rot.getChildern();
		console.log(c.length);
		for(var i = 0 ; i < c.length; i++){
			console.log(c[i]);
		}
		console.log("counter: " + counter);

		playerTurn = true;
		
		// check[x] = 1;
		// console.log(check);
		// objects[x].image = xImg;
		// objects[x].draw();		
		
	}
}

var counter = 0;
function minmax(parent, emptyIndexes){
	counter++;
	var won = checkWon(parent.value, parent.index);
	if(won && parent.level){
		parent.v = 1;
		parent.alpha = 1;
		parent.beta = 1;
		return parent.v;
	}else if(won && !parent.level){
		parent.v = -1;
		parent.alpha = -1;
		parent.beta = -1;
		return parent.v;
	}else if(emptyIndexes == 0){
		parent.v = 0;
		parent.alpha = 0;
		parent.beta = 0;
		return parent.v;
	}else {
		var childern = createChildern(parent);
		for( var i = 0 ; i < childern.length ; i++){
			var value = minmax(childern[i], emptyIndexes -1);
			parentVSet(childern[i], value);
			parentVSet(parent,value);
		}
	}

	return parent.v;
}

function createChildern(parent){
	for(var i = 0; i < 9 ; i++){
		if(parent.value[i] == 0){
			var child = new Node();
			child.value = parent.value.slice();
			child.level = !parent.level;
			child.roott = false;
			child.index = i;

			if(child.level) {
				child.v = -1000;
				child.alpha = parent.alpha;
				child.beta = parent.beta;
				child.value[i] = 1;
			}else{
				child.v = 1000;
				child.alpha = parent.alpha;
				child.beta = parent.beta;
				child.value[i] = -1;
			}
			parent.addChildern(child);
		}
	}
	return parent.getChildern();
}
function parentVSet(node, vValue){
	if(node.level){
		if(node.v < vValue) {
			node.beta = node.v;
			node.v = vValue;
			node.alpha = vValue;
		}
		else {
			node.alpha = node.v;
			if(vValue < node.beta) node.beta = vValue;
		} 
	}else{
		if(node.v > vValue){ 
			node.alpha = node.v;
			node.v = vValue;
			node.beta = vValue;
		}
		else{
			node.beta = node.v;
			if(vValue > node.alpha) node.alpha = vValue;
		}
	}
}

function checkWon(value, index){
	var row = Math.floor(index / 3);
	var column = index % 3;

	if(row == 0){
		if(column == 0){
			return (value[0] == value [1] && value[0] == value[2])||(value[0] == value [4] && value[0] == value[8])||(value[0] == value [3] && value[0] == value[6]);
		}else if(column == 1) {
			return (value[0] == value [1] && value[0] == value[2])||(value[1] == value [4] && value[1] == value[7]);
		}else{
			return (value[0] == value [1] && value[0] == value[2])||(value[2] == value [5] && value[2] == value[8])||(value[2] == value [4] && value[2] == value[6]);
		}
	}else if(row == 1){
		if(column == 0){
			return (value[3] == value [4] && value[3] == value[5])||(value[3] == value [0] && value[0] == value[6]);
		}else if(column == 1) {
			return (value[4] == value [1] && value[4] == value[7])||(value[4] == value [3] && value[4] == value[5]);
		}else{
			return (value[5] == value [4] && value[5] == value[3])||(value[5] == value [2] && value[5] == value[8]);
			
		}
	}else{
		if(column == 0){
			return (value[6] == value [0] && value[6] == value[3])||(value[6] == value [4] && value[6] == value[2])||(value[6] == value [7] && value[6] == value[8]);
		}else if(column == 1) {
			return (value[7] == value [6] && value[7] == value[8])||(value[7] == value [4] && value[7] == value[1]);
		}else{
			return (value[8] == value [7] && value[8] == value[6])||(value[8] == value [4] && value[8] == value[0])||(value[8] == value [5] && value[8] == value[2]);
		}
	}
	return false;
}


var object = function() {
	var x;
	var y;
	var arrIndex;
	var image;
	var player;
	this.draw = function (){
		ctx.drawImage(this.image, this.x, this.y, 166, 166);	
	}

	this.havePoint = function(x, y){
		return this.x <= x && this.x + 166 >= x && this.y <= y && this.y + 166 >= y; 
	}
};

function createStartObjects(){
	var Yindex = 0;
	var arrayIndex = 0;
	var Iterator = 0;
	for (var Xindex = 0 ; Xindex < 3 ; Xindex++) {
		objects[Iterator] = new object();
		objects[Iterator].x = Xindex * 166;
		objects[Iterator].y = Yindex * 166;
		objects[Iterator].arrIndex = arrayIndex;
		objects[Iterator].image = backgroundImg;
		objects[Iterator].player = whoStart;
		++arrayIndex;
		++Iterator;
		if( Xindex == 2 && Yindex <2) {
			++Yindex; Xindex = -1;
		}
	}
	objects[Iterator - 1].image.onload = function(){
		for (var i = 0 ; i < 9 ; i++) {
			objects[i].draw();
		}
	}

	for (var i = check.length - 1; i >= 0; i--) {
		check[i] = 0;
	}
};

loadObjects();
createStartObjects();

function Node(){
	var value;
	var childern = new Array();
	var parent = null;
	var v, level;
	var alpha, beta;
	var roott;
	var index;

	this.setParent = function(node){
		this.parent = node;
	}
	this.getParent = function(){
		return this.parent;
	}
	this.addChildern = function(node){
		node.setParent(this);
		childern.push(node);
	}
	this.getChildern = function(){
		return childern;
	}
}