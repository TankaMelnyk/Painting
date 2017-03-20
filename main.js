if(window.addEventListener) {
    window.addEventListener("load", init, false);
}
else if(window.attachEvent) {
  window.attachEvent("onload", init);
}

function init() {
	var app = new App();
    app.start();
}

function App() {
	this.drawingField = new DrawingField();
	this.cursor = new Cursor(this.drawingField);		
	this.toolBar = new ToolBar(this.cursor);
}
App.prototype.start = function() {
	this.cursor.start();
}

function DrawingField() {
	this.canvas = document.querySelector("canvas");
	this.context = this.canvas.getContext("2d");
	this.canvas.width = 760;
    this.canvas.height = 500;  
	this.startX = 0;
	this.startY = 0;
}
DrawingField.prototype.draw = function(cursor) {
	this.context.beginPath();
	this.context.strokeStyle = cursor.color;
	this.context.lineWidth = cursor.size;
	this.context.globalAlpha = cursor.opacity;
	this.context.moveTo(this.startX, this.startY);
	this.context.lineTo(cursor.x, cursor.y);	
	this.context.stroke();
	this.context.fillStyle = cursor.color;
	this.context.globalAlpha = cursor.opacity;
	this.context.arc(cursor.x, cursor.y, cursor.size / 2, 0, Math.PI * 2);
	this.context.fill();
	this.context.closePath();
	console.info("draw = cursor.x = " + cursor.x + ", cursor.y = " + cursor.y);
	this.startX = cursor.x;
	this.startY = cursor.y;
}
DrawingField.prototype.clinerField = function(cursor) {
	console.log("DrawingField.prototype.clinerField -----------------");
	this.context.save();
	this.context.globalCompositeOperation = 'destination-out';
	this.context.beginPath();
	this.context.arc(cursor.x, cursor.y, cursor.size / 2, 0, Math.PI * 2);
	this.context.fill();
	this.context.restore();
}
DrawingField.prototype.drawCircle = function(cursor) {
	this.context.beginPath();
	this.context.fillStyle = cursor.color;
	this.context.globalAlpha = cursor.opacity;
	this.context.arc(cursor.x, cursor.y, cursor.size / 2, 0, Math.PI * 2);
	this.context.fill();	
	this.context.closePath();
}
DrawingField.prototype.clearField = function() {
	this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
}
DrawingField.prototype.saveCoorditates = function(event) {
	this.startX = (event.cleintX || event.pageX) - this.canvas.offsetLeft;
	this.startY = (event.clientY || event.pageY) - this.canvas.offsetTop;
	console.info("this.startX = " + this.startX + ", this.startY = " + this.startY);
}
DrawingField.prototype.setFillStyle = function(color) {
	console.log(" DrawingField.prototype.setFillStyle ");
	this.context.globalAlpha = 0.3;
	this.context.fillStyle = color;
	this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
}

function Cursor(drawingField) {
	this.x = 0;
	this.y = 0;
	this.color = "rgb(0, 0, 0)";
	this.opacity = 1;
	this.size = 20;
	this.drawingField = drawingField;
	this.tool = "pen";
	this.fillColor = "#b7b7b7";
	var drawHandler = null;
}
Cursor.prototype.changeCoordinates = function(event) {
	this.x  = (event.cleintX || event.pageX) - this.drawingField.canvas.offsetLeft;
	this.y = (event.clientY || event.pageY) - this.drawingField.canvas.offsetTop;
}

Cursor.prototype.start = function() {
	console.log(">>> Cursor.prototype.start");
	this.drawingField.canvas.addEventListener("mousedown", this.startDraw.bind(this), false);
 	this.drawingField.canvas.addEventListener("mouseup", this.finishDraw.bind(this), false);
 	this.drawingField.canvas.addEventListener("mouseout", this.finishDraw.bind(this), false);
}
Cursor.prototype.startDraw = function(event) {
	if(this.tool === "pen") {
		drawHandler = this.draw.bind(this);
		this.changeCoordinates(event);
		this.drawingField.drawCircle(this);
	}
	else {
		drawHandler = this.cliner.bind(this);
	}
	console.log(">>> Cursor.prototype.startDraw");
	this.drawingField.saveCoorditates(event);
 	this.drawingField.canvas.addEventListener("mousemove", drawHandler, false);
}
Cursor.prototype.finishDraw = function() {
	console.log(">>> Cursor.prototype.finishDraw");
	this.drawingField.canvas.removeEventListener("mousemove", drawHandler, false);
	this.drawingField.canvas.removeEventListener("mouseout", this.finishDraw.bind(this), false);
}
Cursor.prototype.draw = function(event) {
	this.changeCoordinates(event);
	this.drawingField.draw(this);
}
Cursor.prototype.cliner = function(event) {
	this.changeCoordinates(event);
	this.drawingField.clinerField(this);
}
Cursor.prototype.setColor = function(color) {	
	this.drawingField.setFillStyle(color);
}

function ToolBar(cursor) {
	this.cursor = cursor;

	this.clear = document.querySelector("#clear");	
	this.save = document.querySelector("#save");
	this.cliner = document.querySelector("#cliner");
	this.pen = document.querySelector("#pen");
	this.color = document.querySelector("#color");
	this.fillColor = document.querySelector("#fill-color");	
	this.opacity = document.querySelector("#opacity");
	this.size = document.querySelector("#size");

	var clear = function() { this.cursor.drawingField.clearField() };
	var save = function() {
		var mycanvas = document.getElementById("canvas");
		window.open(mycanvas.toDataURL("image/png"),'_blank');
	}
	var cliner = function(event) { this.cursor.tool = "cliner"; }
	var pen = function(event) { this.cursor.tool = "pen"; }		
	var color = function(event){ this.cursor.color = event.currentTarget.value; }
	var fillColor = function(event) { this.cursor.setColor(event.currentTarget.value); }
	var opacity = function(event) {	this.cursor.opacity = event.currentTarget.value; }
	var size = function(event) { this.cursor.size = event.currentTarget.value; }

	this.clear.addEventListener("click", clear.bind(this));
	this.save.addEventListener("click", save);
	this.cliner.addEventListener("click", cliner.bind(this));
	this.pen.addEventListener("click", pen.bind(this) );
	this.color.addEventListener("input", color.bind(this));
	this.fillColor.addEventListener("input", fillColor.bind(this));
	this.opacity.addEventListener("input", opacity.bind(this));
	this.size.addEventListener("input", size.bind(this));
}





