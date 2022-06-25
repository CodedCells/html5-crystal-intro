var fontColors = {};
var currentFG;
var currentBG;

function colorTiles(fore, back) {
	console.log("Creating font color:", fore, back);
	var mice = document.createElement('canvas');
	mice.width = 128;
	mice.height = 128;
	mic = mice.getContext("2d");
	
	mixe = document.getElementById("mix");
	mix = mixe.getContext("2d");
	fontmap = document.getElementById("fontmap");
	
	mix.globalCompositeOperation = "source-over";
	mic.fillStyle = fore;
	mix.fillRect(0, 0, mice.width, mice.height);
	mic.globalCompositeOperation = "source-over";
	mix.fillStyle = "#000";
	mic.fillRect(0, 0, mice.width, mice.height);
	
	mic.globalCompositeOperation = "multiply";
	mic.drawImage(fontmap, 0, 0);
	
	mix.fillStyle = "#ffffff";
	mix.fillRect(0, 0, mixe.width, mixe.heigh);
	mix.globalCompositeOperation = "difference";
	mix.drawImage(fontmap, 0, 0);
	
	mix.fillStyle = back;
	mix.globalCompositeOperation = "multiply";
	mix.fillRect(0, 0, mixe.width, mixe.heigh);
	
	mix.globalCompositeOperation = "screen";
	mix.drawImage(mice, 0, 0);
	mic.globalCompositeOperation = "source-over";
	
	fontColors[fore+back] = mice;
}

var tchars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz?!*./,'():;[]_-=";

function setFontColor(fore, back) {
	if (!(Object.keys(fontColors).includes(fore+back)))
		colorTiles(fore, back);
	
	currentFG = fore;
	currentBG = back;
}

function drawFontMap(text, x, y, align) {
	text = text.toString();
	
	var fontColor = fontColors[currentFG + currentBG];
	
	var ax = 0;
	if (align == "right") ax = text.length * -8
	if (align == "center") ax = text.length * -4
	
	for (var i = 0; i < text.length; i++) {
		if (text[i] == " ") continue;
		var c = tchars.indexOf(text[i]);
		ctx.drawImage(fontColor,
			c % 16 * 8, Math.floor(c/16) * 8, 8, 8,
			ax + x + i * 8, y, 8, 8);
	}
}