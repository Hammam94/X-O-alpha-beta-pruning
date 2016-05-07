var ctx;
var oImg;
var xImg;
var backgroundImg;
var Iterator = 0;
var objects = new Array(9);
var check = new Array(9);
var playerTurn = true;
var whoStart = true;
var rot = new Node();
var counter = 0;

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
		for(var i = 0 ; i < 9 ; i++){
			if(objects[i].havePoint(X, Y) && check[i] == 0){
				objects[i].image = oImg;
				objects[i].draw();
				check[i] = -1;
				break;
			}
		}
		var emptyIndexes = 0;
		for (var i = check.length - 1; i >= 0; i--) {
			if(check[i] == 0) ++emptyIndexes;
		}
		playerTurn = false;
		rot.value = check.slice();
		rot.level = true;
		rot.v = -1000;
		rot.roott = true;
		
		var x = dfs(rot,emptyIndexes);
		console.log("incoming x: " +x);
		console.log("counter: " + counter);
		objects[x].image = xImg;
		objects[x].draw();
		check[x] = 1;
		playerTurn = true;
		
	}
}

var counter = 0;
function dfs(node, emptyIndexes){
	for(var i = 0; i < 9 ; i++){
		if(node.v == 1 && node.level && !node.roott){
			parentVSet(node.getParent(), node.v);
			return 1;
		}else if(node.v == -1 && !node.level  && !node.roott){
			parentVSet(node.getParent(), node.v);
			return -1;
		}else if(node.v == 0 && (emptyIndexes == 0 || i + 1 >= node.value.length)  && !node.roott){
			parentVSet(node.getParent(), node.v);
			return 0;
		}
		if(node.value[i] == 0){
			var childNode = new Node();
			childNode.value = node.value.slice();
			childNode.level = !node.level;
			childNode.roott = false;
			
			if(childNode.level){
				childNode.value[i] = 1;
				childNode.v = -1000;
			}else{
				childNode.value[i] = -1;
				childNode.v = 1000;
			}
			var won = checkWon(childNode.value, i);
			if(won && !childNode.level){
				childNode.v = 1;
				parentVSet(node,childNode.v);
				if(!node.roott) parentVSet(node.getParent(), node.v);
			
			}else if(won && childNode.level){
				childNode.v = -1;
				parentVSet(node,childNode.v);
				if(!node.roott) parentVSet(node.getParent(), node.v);
			
			}else if(emptyIndexes == 0 ){
				childNode.v = 0;
				parentVSet(node,childNode.v);
				if(!node.roott) parentVSet(node.getParent(), node.v);
			}
			node.addChildern(childNode);
			dfs(childNode, emptyIndexes - 1);
			if(node.roott && node.v == 1) { console.log(" i : " + i); return i;}
			if(node.roott) console.log("IN: " + i + "  /// node v:  " + node.v);
			if(node.roott)counter++;
		}
		if(node.roott) console.log("out: " + i + "  / node v:  " + node.v);
	}
}

function parentVSet(node, vValue){
	if(node.level){
		if(node.v < vValue) node.v = vValue; 
	}else{
		if(node.v > vValue) node.v = vValue;
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
	var roott;
	var visited;
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
		console.log(childern);
		return childern;
	}
}