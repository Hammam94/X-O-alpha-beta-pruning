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
			if(objects[i].havePoint(X, Y)){
				objects[i].image = oImg;
				objects[i].draw();
				check[i] = -1;
				break;
			}
		}
		playerTurn = false;
		rot.value = check;
		rot.level = true;
		rot.v = -1000;
		rot.alpha = -1000;
		rot.beta = 1000;
		AIposition(rot);
	}
}

function dfs(node){
};

function AIposition(parent){
};

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
	var alpha, beta, v, level;

	this.setParent = function(node){
		this.parent = node;
	}
	this.getParent = function(){
		return this.parent;
	}
	this.addChildern = function(node){
		//console.log(node);
		node.setParent(this);
		childern.push(node);
	}
	this.getChildern = function(){
		return this.childern;
	}
}