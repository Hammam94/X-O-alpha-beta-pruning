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
		if(checkWon(check) == 0){
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
		}
		playerTurn = false;	
		if(emptyIndexes != 0 && checkWon(check) == 0){	
			rot = new Node();
			rot.value = check.slice();
			rot.level = true;
			rot.v = -1000;
			rot.alpha = -1000;
			rot.beta = 1000;
			rot.roott = true;
			rot.index = index;
			minmax(rot, emptyIndexes);
			playerTurn = true;		
			check[rot.index] = -1;
			objects[rot.index].image = oImg;
			objects[rot.index].draw();	
		}	
	}
}

function minmax(parent, emptyIndexes){
	var won = checkWon(parent.value);
	if(won != 0){
		if(won == 1)parent.v = -1;
		else parent.v = 1;
		return parent.v;
	}else if(won == 0 && emptyIndexes == 0){
		parent.v = 0;
		return parent.v;
	}else {
		for( var i = 0 ; i < 9 ; i++){
			if(parent.value[i] == 0){
				var child = createChild(parent,i);
				var value = minmax(child, emptyIndexes -1);
				if((parent.level && parent.v < value) || (!parent.level && parent.v > value)){
					parent.v = value;
					if(parent.roott) parent.index = child.index;
				}
			}
		}
		return parent.v;
	}
}

function createChild(parent, i){
	var child = new Node();
	child.value = parent.value.slice();
	child.level = !parent.level;
	child.roott = false;
	child.index = i;

	if(child.level) {
		child.v = -1000;
		child.value[i] = 1;
	}else{
		child.v = 1000;
		child.value[i] = -1;
	}
	return child;
}

function checkWon(value){
	if(value[0] == value[1] && value[1] == value[2] && value[0] != 0) return value[0];
	if(value[3] == value[4] && value[4] == value[5] && value[3] != 0) return value[3];
	if(value[6] == value[7] && value[7] == value[8] && value[6] != 0) return value[6];
	if(value[0] == value[3] && value[3] == value[6] && value[0] != 0) return value[0];
	if(value[1] == value[4] && value[4] == value[7] && value[1] != 0) return value[1];
	if(value[2] == value[5] && value[5] == value[8] && value[2] != 0) return value[2];
	if(value[0] == value[4] && value[4] == value[8] && value[0] != 0) return value[0];
	if(value[2] == value[4] && value[4] == value[6] && value[2] != 0) return value[2];
	return 0;
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
	var parent = null;
	var v, level;
	var alpha, beta;
	var roott;
	var index;
}