var bWidth = 960;// fallback
var bHeight = 540;// fallback
var aspectf = 1;
var pWidth = 0;
var pHeight = 0;
var loopstate = false;
var border = false;
var paused = false;

var dev = false;
var started = false;
var scene_imode = "numeric";
var scene_input = "";
var scene_idx = 0;
var frame = 0;
var stateframe = 0;
var stateat = 0;
var state;

var musicfile;
var framerate;

var canvas;
var ctx;
var assets;
var sandbox;
var music;
var started;

let language = "en";

function getLanguage() {
	// Get all user-preferred languages (most preferred first)
	const userLanguages = navigator.languages || [navigator.language || "en"];

	for (let lang of userLanguages) {
		lang = lang.toLowerCase();

		// Try exact match (e.g. "en", "fr")
		if (supported_languages[lang]) {
			return lang;
		}

		// Try base language (e.g. "en-US" → "en")
		const base = lang.split("-")[0];
		if (supported_languages[base]) {
			return base;
		}
	}
}

let darkmode = window.matchMedia("(prefers-color-scheme: dark)").matches;

// Optional: react to changes in theme preference
window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (event) => {
	darkmode = event.matches;
});

function play() {
	console.log("would play");
	setFontColor("#F8F8F8", "#000000");
	
	music = new Audio();
	music.src = musicfile;
	
	requestAnimationFrame(draw);
	var frameTimer = setInterval(function() {frameTick()}, 1000/framerate);
}

function draw() {
	ctx.globalAlpha = 1;
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	
	if (frame == -1)
		drawSceneSelect();
	
	for (var i in objects) {
		drawObject(i);
	}
	
	if (border) {
		// borders
		ctx.globalAlpha = 0.25;
		ctx.fillStyle = "#000";
		ctx.fillRect(0, 0, pWidth, bHeight);
		ctx.fillRect(bWidth+pWidth, 0, pWidth, bHeight);
		ctx.fillRect(0, 0, bWidth, pHeight);
		ctx.fillRect(0, bHeight+pHeight, bWidth, pHeight);
	}
	
	if (dev) {
		// debug
		ctx.globalAlpha = 1;
		setFontColor("#777777", "#000000");
		drawFontMap(state, 2, canvas.height-10);
		
		if (paused)
			drawFontMap("=", 2, 2);
		
		drawFontMap(stateframe, canvas.width-2, canvas.height-10, "right");
		drawFontMap(frame, canvas.width-2, 2, "right");
	}
	
	requestAnimationFrame(draw);
}

function getDisplay() {
	canvas = document.getElementById("display");
	ctx = canvas.getContext("2d");
	
	// turn off image aliasing
	ctx.msImageSmoothingEnabled = false;
	ctx.mozImageSmoothingEnabled = false;
	ctx.webkitImageSmoothingEnabled = false;
	ctx.imageSmoothingEnabled = false;
	
	assets = document.getElementById("assets");
}

function stateAdvance() {
	if (loopstate) {
		frame = stateat;
		syncMusic();
		return
	}
	
	stateat = frame;
	state = states[frame];
}

window.addEventListener('resize', function(event) {resize();}, true);

function resize() {
	getDisplay();
	
	var w = window.innerWidth;
	var h = window.innerHeight;
	console.log("would resize");
	
	aspectf = w/h;
	if (aspectf >= 1) {// landscape
		pWidth = Math.round((aspectf * bHeight - bWidth) / 2);
		pHeight = 0;
	}
	else {// portrait
		pWidth = 0;
		pHeight = Math.round((h/w * bWidth - bHeight) / 2);
	}
	canvas.width = pWidth*2 + bWidth;
	canvas.height = pHeight*2 + bHeight;
}

function spriteChange(obj, mode, val, max) {
	var cur = objects[obj]["sprite"];
	var sframe = parseInt(cur.substr(cur.length-1));
	var cur = cur.substr(0, cur.length-1)
	
	if (mode == "add")
		val = sframe + val;
	
	else if (mode == "sub")
		val = sframe - val;
	
	if (val < 0) val = 0;
	if (max != undefined)
		if (val >= max)
			val %= max;
	
	objects[obj]["sprite"] = cur + val;
}

function drawImgXYWH(si, sx, sy, dx, dy, w, h, m) {
	if (m == undefined)
		ctx.drawImage(si, sx, sy, w, h, dx, dy, w, h);
	else if (m[0] == "phase") {
		for (var y = 0; y < h; y++) {
			drawImgXYWH(si, sx, sy + y,
				dx + m[1], dy + y,
				w, 1);
			m[1] *= -1;
		}
	}
}

function drawSpriteClones(src, spr, ax, ay, rep, mode) {
	var rx = 0;
	if (rep.includes("x+"))
		while (ax + rx <= canvas.width) {// draw right
			drawImgXYWH(src, spr["x"], spr["y"], ax + rx, ay, spr["w"], spr["h"], mode);
			rx += spr["w"];
		}
	
	rx = 0;
	if (rep.includes("x-"))
		while (-spr["w"] <= ax + rx) {// draw left
			drawImgXYWH(src, spr["x"], spr["y"], ax + rx, ay, spr["w"], spr["h"], mode);
			rx -= spr["w"];
		}
}

function boxgen(color, x, y, w, h, flags) {
		var out = {
		"color": color,
		"x": x,
		"y": y,
		"w": w,
		"h": h,
		"flags": {}
	}
	
	if (flags !== undefined)
		out["flags"] = flags;
	
	return out;
}

function sprgen(spr, x, y, flags) {
	var out = {
		"sprite": spr,
		"x": x,
		"y": y,
		"flags": {}
	}
	
	if (flags !== undefined)
		out["flags"] = flags;
	
	return out;
}

function drawSprite(spriteName, dx, dy, flags) {
	var src = assets;
	var spr = spriteDef[spriteName];
	
	var ax = dx + pWidth;
	var ay = dy + pHeight;
	var ox = 0;
	var oy = 0;
	
	var mode = undefined;
	
	if (flags !== undefined) {
		if (flags.opacity !== undefined)
			ctx.globalAlpha = flags.opacity;
		
		if (flags.align !== undefined) {
			var align = flags.align;
			if (align == "centered") {
				ox = -Math.floor(spr["w"] / 2);
				oy = -Math.floor(spr["h"] / 2);
			}
			if (align == "end") {
				ox = -Math.floor(spr["w"]);
				oy = -Math.floor(spr["h"]);
			}
		}
		
		if (flags.phase !== undefined)// special scanline phaser
			if (flags.phase != 0)
				mode = ["phase", flags.phase];
		
		if (flags.repeat !== undefined) {
			ax += ox;
			ay += oy;
			
			var rep = flags.repeat;
			drawSpriteClones(src, spr, ax, ay, rep, mode);
			
			var ry = 0;
			if (rep.includes("y+"))
				while (ay + ry <= canvas.height) {// draw down
					drawImgXYWH(src, spr["x"], spr["y"], ax, ay + ry, spr["w"], spr["h"], mode);
					ry += spr["h"]
					drawSpriteClones(src, spr, ax, ay, rep);
				}
			
			ry = 0;
			if (rep.includes("y-"))
				while (-spr["h"] <= ay + ry) {// draw up
					drawImgXYWH(src, spr["x"], spr["y"], ax, ay + ry, spr["w"], spr["h"], mode);
					ry -= spr["h"];
					drawSpriteClones(src, spr, ax, ay, rep, mode);
				}
		}
	}
	
	drawImgXYWH(src, spr["x"], spr["y"],
				ox + dx + pWidth, oy + dy + pHeight,
				spr["w"], spr["h"], mode);
	
	ctx.globalAlpha = 1;
}

function spriteFadeIO(obj, instart, inend, outstart, outend, mode) {
	if (stateframe >= outstart)
		spriteFade(obj, "out", outstart, outend, mode);
	
	else if (stateframe >= instart)
		spriteFade(obj, "in", instart, inend, mode);
}

function spriteFade(obj, dir, start, end, mode) {
	var perc = (stateframe - start) / (end - start);
	
	if (dir == "out") perc = 1 - perc;
	perc = Math.max(0, Math.min(1, perc));
	
	if (mode == "phasefade") {
		objects[obj]["flags"]["phase"] = Math.round((1-perc) * 6);
		objects[obj]["flags"]["opacity"] = Math.min(1, perc * 2);
	} else
		objects[obj]["flags"]["opacity"] = perc;
}

function moveObject(objID, x, y, wrap) {
	objects[objID]["x"] += x;
	objects[objID]["y"] += y;
	
	if (!(wrap)) return;
	var spr = spriteDef[objects[objID]["sprite"]];
	
	if (wrap.includes("x"))
		objects[objID]["x"] %= spr["w"];
	
	if (wrap.includes("y"))
		objects[objID]["y"] %= spr["h"];
}

function syncMusic() {
	music.currentTime = (frame + audoff) / 60;
}

function jumpTo(dest) {
	scene_input = "";
	console.log("jumpting to", dest);
	
	if (dest == -1 || frame == -1) {
		if (frame > dest) {
			bWidth *= 2;
			bHeight *= 2;
		} else {
			bWidth /= 2;
			bHeight /= 2;
		}
	}
	
	resize();
	
	frame = dest;
	music.pause();
	music.onended = tryStart;
	
	syncMusic();
	music.play();
}

function tryStart() {
	if (music.paused && !started) {
		console.log("start")
		replay();
	}
}

function replay() {
	started = true;
	if (frame >= 0)
		jumpTo(replayframe)
}

document.onclick = tryStart;

function drawColor(info) {
	ctx.fillStyle = info.color;
	x = pWidth + info["x"];
	y = pHeight + info["y"];
	w = info["w"];
	h = info["h"];
	if (w < 0) {
		w = canvas.width;
		if (info["x"] == 0) x = 0;
	}
	if (h < 0) {
		h = canvas.height;
		if (info["y"] == 0) y = 0;
	}
	
	ctx.fillRect(x, y, w, h);
}

function drawObject(objID) {
	info = objects[objID];
	if (info.color != null)
		return drawColor(info);
	
	drawSprite(info["sprite"], info["x"], info["y"], info["flags"]);
}

function regularInput(e) {
	const code = e.code;
	
	if (code == "Escape") {
		if (!dev) border = true;
		dev = !dev;
		jumpTo(-1);
	}
	
	if (code == "KeyB")// Toggle original screen size border
		border = !border;
		
	if (code == "KeyL")// Toggle looping current scene
		loopstate = !loopstate;
	
	if (code == "KeyM")// Toggle muting sound
		music.muted = !music.muted;
	
	if (code == "KeyP") {// Toggle playback, pause/play
		paused = !paused;
		if (paused) {
			music.pause();
		}
		else {
			syncMusic()
			music.play();
		}
	}
	
	var statelist = Object.keys(states);
	var curpos = statelist.indexOf(stateat.toString());
	
	if (code =="ArrowLeft") {// Go back to last scene
		if (curpos - 1 >= 0) {
			jumpTo(statelist[curpos-1]);
		}
	}
	
	if (code == "ArrowRight") {// Advance to next scene
		if (curpos+1 < statelist.length && statelist[curpos+1] != "-1") {
			jumpTo(statelist[curpos+1]);
		}
	}
}

function selectInput(e) {
	const code = e.code;
	
	if (code == "Escape") {
		dev = !dev;
	}
	
	if (code == "Backspace") {// backspace
		scene_input = "";
		scene_imode = "numeric";
	}
	
	if (47 < e.keyCode && e.keyCode < 58) {// numbers
		if (scene_imode == "arrow") {
			scene_input = "";
		}
		scene_imode = "numeric";
		scene_input += e.key;
	}
	
	if (36 < e.keyCode && e.keyCode < 41) {// arriow keys
		scene_imode = "arrow";
	}
	
	if (code =="ArrowLeft")// left
		scene_idx -= 15;
	
	if (code =="ArrowUp")// up
		scene_idx -= 1;
	
	if (code =="ArrowRight")// right
		scene_idx += 15;
	
	if (code =="ArrowDown")// down
		scene_idx += 1;
	
	if (code =="Enter") {// enter
		for (var scn in states) {
			if (scn.startsWith(scene_input))
				return jumpTo(parseInt(scn));
		}
	}
}

document.onkeydown = function (e) {
	
    e = e || window.event;
	
    if (state == "scene_select") selectInput(e);
	else regularInput(e);
};

function drawSceneSelect() {
	ctx.fillStyle = "#000000";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	
	inp = scene_input;
	if (!inp) inp = "...";
	
	var cen = Math.floor(canvas.width / 2);
	setFontColor("#F8F8F8", "#000000");
	drawFontMap("Select a Scene: ", cen, 8, "right");
	setFontColor("#F8F800", "#000000");
	drawFontMap(inp, cen, 8);
	
	scene_idx %= Object.keys(states).length - 1;
	if (scene_idx < 0)
		scene_idx += Object.keys(states).length - 1;
	
	idxsel = Object.keys(states)[scene_idx];
	
	if (scene_imode == "numeric") {
		for (var scn in states) {
			if (scn.startsWith(inp)) {
				scene_idx = scn;
				idxsel = scn;
				break;
			}
		}
	}
		
	x = 0;
	y = 32;
	for (var scn in states) {
		if (scn < 0) continue;
		
		setFontColor("#F8F8F8", "#000000");
		if (scn.startsWith(inp) && scene_imode == "numeric") 
			setFontColor("#F8F800", "#000000");
		
		if (scn == idxsel) {
			setFontColor("#00F8F8", "#000000");
			if (scene_imode == "arrow")
				scene_input = scn;
		}
		
		drawFontMap(" " + scn + ":" + states[scn], x, pHeight + y);
		
		y += 16;
		if (y > 260) {
			y = 32;
			x += Math.floor(bWidth / 2) + pWidth - 8;
		}
	}
}