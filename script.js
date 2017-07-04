function Graph(data, options) {
	this.data = data;
	this.options = options;
	this.canvas = null;
	this.ctx = null;

	this.yCoef = this.options.height / Math.max.apply(null, 
				 this.data.reduce((a, b) =>
					a.concat(b.map(item => 
						item.val)), []));

	this.dimX = this.options.width / 10;
	this.dimY = this.options.height / 10;
}

Graph.prototype.dataParse = function() {
	this.data.map((dataSet, i) => {
		var last = dataSet[dataSet.length-1].date - dataSet[0].date
		dataSet.map((cord, j, arr) => {
			cord.x = this.options.width * (cord.date - arr[0].date) / last,
			cord.y = this.options.height - cord.val * this.yCoef;
		});
	});
}

Graph.prototype.createCanvas = function() {
	this.canvas = document.createElement('canvas');
	this.ctx = this.canvas.getContext('2d');
	this.canvas.width = this.options.width;
	this.canvas.height = this.options.height;
	document.querySelector('.wrapper').appendChild(this.canvas);
}

Graph.prototype.addListeners = function() {
	this.canvas.addEventListener('mousemove', e => {
		this.render();
		this.ctx.strokeStyle = '#ccc';
		this.ctx.beginPath()
		this.ctx.moveTo(e.offsetX, 0);
		this.ctx.lineTo(e.offsetX, this.canvas.height);
		this.ctx.stroke();
		this.createPopup(this.data, e.offsetX, e.offsetY);
	})
}

Graph.prototype.createPopup = function(data, x, y) {
	dx = Math.min(x, this.canvas.width * 0.75);
	dy = Math.min(y, this.canvas.height * 0.75);
	this.ctx.fillStyle = '#fff';
	this.ctx.fillRect(dx, dy, this.canvas.width / 4, this.canvas.height / 4);

	data.forEach((item, i, arr) => {
		var prop = this.findNearest(item, x),
			tX = dx + 10,
			tY = dy + 10 * (i + 1);
		this.printText(prop, tX, tY);
	})
}

Graph.prototype.printText = function(data, x, y) {
	this.ctx.fillStyle = '#000'
	this.ctx.font = this.canvas.width / 40 + "px Arial";
	this.ctx.fillText(data.val, x, y);
}

Graph.prototype.drawGraph = function() {
	this.data.map((dataSet, i) => {
		this.ctx.strokeStyle = '#000';
		this.ctx.beginPath();
		this.ctx.moveTo(dataSet[0].x, dataSet[0].y);

		dataSet.map((cord, j, arr) => {
			this.ctx.lineTo(cord.x, cord.y);
		});

		this.ctx.stroke();
	});
}

Graph.prototype.findNearest = function(arr, val) {
	while (arr.length >= 3) {
		var index = Math.floor(arr.length/2);
		if (arr[index].x > val) {
			arr = arr.slice(0,index + 1)
		} else {
			arr = arr.slice(index);
		}
	}
	return Math.abs(arr[0].x - val) < Math.abs(arr[1].x - val) ? arr[0] : arr[1];
}

Graph.prototype.drawDimentions = function() {
	var y = 0,
		x = 0;
	while (y <= this.canvas.height) {
		this.ctx.strokeStyle = '#f1f1f1';
		this.ctx.beginPath();
		this.ctx.moveTo(0, y);
		this.ctx.lineTo(this.canvas.width, y);
		this.ctx.stroke();
		y += this.dimY;
	}
	while (x <= this.canvas.width) {
		this.ctx.strokeStyle = '#f1f1f1';
		this.ctx.beginPath();
		this.ctx.moveTo(x, 0);
		this.ctx.lineTo(x, this.canvas.height);
		this.ctx.stroke();
		x += this.dimX;
	}
}

Graph.prototype.start = function() {
	this.createCanvas();
	this.dataParse();
	this.render();
	this.addListeners();
}

Graph.prototype.render = function() {
	this.ctx.clearRect(0,0,this.canvas.width, this.canvas.height);
	this.ctx.fillStyle = '#fafafa';
	this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
	this.drawDimentions();
	this.drawGraph();
}

var cords = [[
	{
		date: 1499037174670,
		val: 45,
	},
	{
		date: 1499037184670,
		val: 20,
	},
	{
		date: 1499037374670,
		val: 400,
	},
	{
		date: 1499037474670,
		val: 424,
	},
	{
		date: 1499037574670,
		val: 1,
	},
	{
		date: 1499037674670,
		val: 55,
	},
	{
		date: 1499037774670,
		val: 79,
	},
	{
		date: 1499037874670,
		val: 13,
	},
	{
		date: 1499037974670,
		val: 42,
	},
	{
		date: 1499038174670,
		val: 68,
	},
	{
		date: 1499038274670,
		val: 70,
	},
	{
		date: 1499038374670,
		val: 20,
	},
	{
		date: 1499038474670,
		val: 23,
	},
	{
		date: 1499038574670,
		val: 80,
	},
	{
		date: 1499038674670,
		val: 60,
	},
	{
		date: 1499038774670,
		val: 40,
	},

]];
var options = {
	width: 500,
	height: 200,
}
var testGraph = new Graph(cords, options);
testGraph.start();