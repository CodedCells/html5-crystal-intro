var bWidth = 160;
var bHeight = 144;
var framerate = 60;

var audoff = 42;
var musicfile = "mus.ogg";

const end_frame = 7880;
var states = {
	229: "dittogf",
	601: "blank_black",
	684: "unown_a",
	856: "outdoors_running",
	986: "blank_black",
	1053: "unown_i",
	1283: "outdoors_running",
	1347: "outdoors_discovered",
	1580: "blank_black",
	1630: "unown_more",
	1904: "outdoors_suicune_solo",
	2035: "blank_black",
	2101: "battle_versus",
	2251: "blank_black",
	2316: "battle_anime",
	2414: "blank_black",
	2484: "battle_attack",
	2681: "blank_white",
	2814: "crystal",
	3030: "blank_white",
	3086: "title_in",
	3115: "title",
	
	"-1": "scene_select"
}

var frame = 43;
var state = "blank_white";
var replayframe = 601;
var objects = {"fill": boxgen("#000000", 0, 0, -1, -1)};

function frameSpawn() {// runs only with state change
	if (frame in states)
		stateAdvance();
	else
		return
	
	stateframe = 0;
	if (state == "blank_white")
		objects = {"fill": boxgen("#F8F8F8", 0, 0, -1, -1)}
	
	if (state == "blank_black")
		objects = {"fill": boxgen("#000000", 0, 0, -1, -1)}
	
	if (state.startsWith("title"))
		if (!(Object.keys(objects).includes("the_crystal")))
			objects = {
				"fill": boxgen("#000000", 0, 0, -1, -1),
				"the_crystal": sprgen("the_crystal", 56, -50),
				"gamelogo": sprgen("gamelogo_world", 8, 16, {"phase": 108}),
				"gameversion": sprgen("gameversion_world", 36, 64, {"phase": 108}),
				"suicune_run": sprgen("suicune_run_title0", 48, 88),
				}
	
	if (state == "dittogf")
		objects = {
			"fill": boxgen("#000000", 0, 0, -1, -1),
			"dittogf": sprgen("dittobl0", 68, -22)
			}
	
	if (state == "crystal")
		objects = {
			"fill": boxgen("#f8f8f8", 0, 0, -1, -1),
			"letter_0": sprgen("crystal_c", 24, 64, {"opacity": 0}),
			"letter_1": sprgen("crystal_r", 44, 64, {"opacity": 0}),
			"letter_2": sprgen("crystal_y", 61, 64, {"opacity": 0}),
			"letter_3": sprgen("crystal_s", 79, 64, {"opacity": 0}),
			"letter_4": sprgen("crystal_t", 95, 64, {"opacity": 0}),
			"letter_5": sprgen("crystal_a", 111, 64, {"opacity": 0}),
			"letter_6": sprgen("crystal_l", 128, 64, {"opacity": 0})
			}
	
	if (state.startsWith("battle")) {
		objects = {"fill": boxgen("#C06048", 0, 0, -1, -1)}
		
		if (state == "battle_anime") {
			objects = {"fill": boxgen("#C06048", 0, 24, -1, 96)}
			objects["suicune_anime"] = sprgen("suicune_anime", 120, 24);
		}
		else {
			objects["battlebg"] = sprgen("battlebg", 0, 80, {"repeat": "x+x-y+y-"});
		}
		
		if (state == "battle_versus") {
			objects["suicune_battle"] = sprgen("suicune_versus", 80, 160);
			objects["unown"] = sprgen("unowntp0", 32, 48, {"opacity": 0, "align": "centered"});
		}
		
		if (state == "battle_attack") {
			objects["suicune_battle"] = sprgen("suicune_attack", 48, 80);
			objects["unown_0"] = sprgen("unown_bs", 24, 112, {"opacity": 0});
			objects["unown_1"] = sprgen("unown_b1", 8, 64, {"opacity": 0});
			objects["unown_2"] = sprgen("unown_b2", 120, 40, {"opacity": 0});
			objects["unown_3"] = sprgen("unown_b3", 16, 24, {"opacity": 0});
			objects["unown_4"] = sprgen("unown_b4", 96, 16, {"opacity": 0});
			objects["unown_5"] = sprgen("unown_b5", 48, 8, {"opacity": 0});
			objects["unown_6"] = sprgen("unown_b6", 128, 64, {"opacity": 0});
			objects["unown_7"] = sprgen("unown_b7", 88, 104, {"opacity": 0});
		}
	}
	
	if (state.startsWith("unown"))
		objects = {"fill": boxgen("#000000", 0, 0, -1, -1)}
	
	if (state == "unown_a")
		objects["unown"] = sprgen("unown_a", 64, 48, {"opacity": 0});
		objects["pulse0"] = sprgen("pulse_tl0", 63, 55, {"opacity": 0});
		objects["pulse1"] = sprgen("pulse_tr0", 65, 55, {"opacity": 0});
		objects["pulse2"] = sprgen("pulse_bl0", 63, 57, {"opacity": 0});
		objects["pulse3"] = sprgen("pulse_br0", 65, 57, {"opacity": 0});
	
	if (state == "unown_i") {
		objects["unown_i"] = sprgen("unown_i", 104, 24, {"opacity": 0});
		objects["pulse0"] = sprgen("pulse_tl0", 95, 23, {"opacity": 0});
		objects["pulse1"] = sprgen("pulse_tr0", 97, 23, {"opacity": 0});
		objects["pulse2"] = sprgen("pulse_bl0", 95, 25, {"opacity": 0});
		objects["pulse3"] = sprgen("pulse_br0", 97, 25, {"opacity": 0});
		
		objects["unown_s"] = sprgen("unown_s", 24, 88, {"opacity": 0});
		objects["pulse4"] = sprgen("pulse_tl0", 23, 79, {"opacity": 0});
		objects["pulse5"] = sprgen("pulse_tr0", 25, 79, {"opacity": 0});
		objects["pulse6"] = sprgen("pulse_bl0", 23, 81, {"opacity": 0});
		objects["pulse7"] = sprgen("pulse_br0", 25, 81, {"opacity": 0});
	}
	
	if (state == "unown_more") {
		objects["unown_1"] = sprgen("unown_1", 56, 56, {"opacity": 0});
		objects["unown_2"] = sprgen("unown_2", 112, 8, {"opacity": 0});
		objects["unown_3"] = sprgen("unown_3", 8, 48, {"opacity": 0});
		objects["unown_4"] = sprgen("unown_4", 80, 120, {"opacity": 0});
		objects["unown_5"] = sprgen("unown_5", 64, 16, {"opacity": 0});
		objects["unown_6"] = sprgen("unown_6", 112, 56, {"opacity": 0});
		objects["unown_7"] = sprgen("unown_7", 16, 112, {"opacity": 0});
		objects["unown_8"] = sprgen("unown_8", 80, 80, {"opacity": 0});
		
		objects["pulse0"] = sprgen("pulse_tl0", 23, 79, {"opacity": 0});
		objects["pulse1"] = sprgen("pulse_tr0", 25, 79, {"opacity": 0});
		objects["pulse2"] = sprgen("pulse_bl0", 23, 81, {"opacity": 0});
		objects["pulse3"] = sprgen("pulse_br0", 25, 81, {"opacity": 0});
	}
	
	if (state.startsWith("outdoors")) {
		if (!(Object.keys(objects).includes("treetopbg")))
			objects = {
				"skyfill": boxgen("#C06048", 0, 0, -1, -1),
				"treetopbg": sprgen("treetopbg", -32, 32, {"repeat": "x+x-"}),
				"forestfill": boxgen("#002028", 0, 64, -1, -1),
				"dirtfill": boxgen("#684048", 0, 144, -1, -1),
				"treebasebg": sprgen("treebasebg", -32, 64, {"repeat": "x+x-"}),
				"suicune_run": sprgen("suicune_run2", 158, 68, {"opacity": 0}),
				"grassfg": sprgen("grass_still", -32, 96, {"repeat": "x+x-"}),
				"groundbg": sprgen("groundbg", -32, 112, {"repeat": "x+x-"})
			};
		
		if (state == "outdoors_suicune" || state == "outdoors_discovered")
			objects["suicune_run"]["flags"]["opacity"] = 1;
		
		if (state == "outdoors_suicune_solo")
			objects["suicune_run"] = sprgen("suicune_run0", 48, 68);
		
		if (state == "outdoors_discovered") {
			objects["wooper"] = sprgen("wooper", 20, 144);
			objects["pichu"] = sprgen("pichu_front", 100, 146);
		}
	}
	
	if (state == "scene_select")
		objects = {}
}

function unownPulseTick(start, end, p) {
	var opacity = objects["pulse0"].flags.opacity;
	if (stateframe == start) opacity = 1;
	if (stateframe > end) opacity -= 0.2;
	
	var mathxy = [[-2, -2], [2, -2], [-2, 2], [2, 2]];
	
	if (p == undefined) p = 0;
	
	for (var i = 0; i < 4; i++) {
		objects["pulse"+(i+p)].flags.opacity = opacity;
		moveObject("pulse"+(i+p), mathxy[i][0], mathxy[i][1]);
		if (stateframe == start+4 || stateframe == start+8)
			spriteChange("pulse"+(i+p), "add", 1);
	}
}

function frameTick() {// called each tick
	if (paused) return; // paused
	
	if (frame > -1 && music.paused) {
		syncMusic();
		music.play();
		
		if (frame > end_frame) replay();
	}
	
	frameSpawn();
	
	if (frame == 1391 || frame == 1399)
		objects["grassfg"].sprite = "grass_wave1";
	
	if (frame == 1395)
		objects["grassfg"].sprite = "grass_wave2";
	
	if (state == "outdoors_running") {
		moveObject("treetopbg", -1, 0, "x");
		moveObject("treebasebg", -1, 0, "x");
		moveObject("groundbg", -2, 0, "x");
		moveObject("grassfg", -2, 0, "x");
	}
	
	if (state.startsWith("title")) {
		if (objects["the_crystal"].y < 6)
			moveObject("the_crystal", 0, 2);
		
		if (objects["gamelogo"].flags.phase > 0) {
			objects["gamelogo"].flags.phase -= 4;
			objects["gameversion"].flags.phase -= 4;
		}
		
		if (stateframe > 1 && (stateframe - 1) % 8 == 0)
			spriteChange("suicune_run", "add", 1, 4);
	}
	
	if (state == "unown_a") {
		if (63 < stateframe)
			spriteFadeIO("unown", 64, 95, 98, 130);
		else
			spriteFadeIO("unown", -5, 31, 32, 63);
		
		if (stateframe > 94)
			unownPulseTick(95, 111);
	}
	
	if (state == "unown_i") {
		spriteFadeIO("unown_i", -5, 31, 32, 63);
		if (stateframe > 30)
			unownPulseTick(31, 42);
		
		spriteFadeIO("unown_s", 63, 95, 96, 127);
		if (stateframe > 94)
			unownPulseTick(95, 111, 4);
	}
	
	if (state == "unown_more") {
		spriteFadeIO("unown_1", -5, 15, 15, 31);
		spriteFadeIO("unown_2", 31, 47, 47, 63);
		spriteFadeIO("unown_3", 63, 79, 79, 95);
		spriteFadeIO("unown_4", 95, 111, 111, 127);
		spriteFadeIO("unown_5", 127, 135, 135, 143);
		spriteFadeIO("unown_6", 143, 151, 151, 159);
		spriteFadeIO("unown_7", 159, 167, 167, 175);
		spriteFadeIO("unown_8", 175, 183, 183, 191);
	}
	
	if (state == "dittogf") {
		if (stateframe == 14)
			objects["dittogf"].sprite = "dittobl0";
		
		if (stateframe == 5 || stateframe == 9 || stateframe == 27)
			objects["dittogf"].sprite = "dittobl1";
		
		if (stateframe == 7 || stateframe == 40)
			objects["dittogf"].sprite = "dittobl2";
		
		if (stateframe == 45) {
			objects["dittogf"].x = 68;
			objects["dittogf"].y = 28;
			objects["dittogf"].sprite = "dittogf0";
		}
		
		if (stateframe == 173)
			objects["freaky"] = sprgen("freaky", 40, 80);
		
		if (stateframe == 239)
			objects["presents"] = sprgen("presents", 56, 87);
		
		if ([78, 82, 86, 91, 96, 101, 112].includes(stateframe))
			spriteChange("dittogf", "add", 1)
		
		adjy = [
			0, 7, 7, 7, 8, 9, 9, 9, 9, 9,
			-5, -5, -5, -5, -4, -4, -4, -3, -3, -3, -3, -2, -1, -2, 0, 0, -1,
			1, 0, 2, 1, 2, 2, 2, 4, 3, 4, 4, 4, 5, 4, 5, 4
		][stateframe];
		
		if (adjy != undefined)
			moveObject("dittogf", 0, adjy);
	}
	
	if (state == "outdoors_suicune_solo") {
		moveObject("treetopbg", 1, 0, "x");
		moveObject("treebasebg", 1, 0, "x");
		moveObject("groundbg", 2, 0, "x");
		moveObject("grassfg", 2, 0, "x");
		
		if ((stateframe - 5) % 4 == 0)
			spriteChange("suicune_run", "add", 1, 4);
		
		if (stateframe > 65)
			moveObject("suicune_run", -3, 0);
	}
		
	
	if (state == "outdoors_discovered") {
		moveObject("suicune_run", -8, 0);
		if (stateframe > 1418-1347 && objects["wooper"].y > 115)
			moveObject("wooper", 0, -6);
		
		if (stateframe > 1448-1347 && objects["pichu"].y > 104)
			moveObject("pichu", 0, -6);
		
		if (stateframe > 1448-1336)
			objects["pichu"].sprite = "pichu_turn";
		
		if (stateframe > 1448-1330)
			objects["pichu"].sprite = "pichu_side";
	}
	
	if (state == "battle_anime") {
		if (objects["suicune_anime"].x > 24)
			moveObject("suicune_anime", -8, 0);
	}
	
	if (state == "crystal") {
		var which = Math.floor(stateframe / 16);
		if (which < 7)
			spriteFade("letter_"+which, "in", which*16, ((which+1)*16-1));
	}
	
	if (state == "battle_versus") {
		spriteFade("unown", "in", 68, 68);
		if ([72, 77, 82, 92].includes(stateframe))
			spriteChange("unown", "add", 1);
		
		moveObject("battlebg", 0, 8, "xy");
		if (objects["suicune_battle"]["y"] > 40 )
			moveObject("suicune_battle", 0, -8);
	}
	
	if (state == "battle_attack") {
		moveObject("battlebg", 0, 8, "xy");
		
		if (stateframe > 69 && stateframe < 102) {
			var offset = Math.floor((stateframe - 70) / 4);
			spriteFade("unown_" + offset, "in", (offset * 4) + 70, (offset * 4) + 73);
		}
		
		if (stateframe > 1 && objects["suicune_battle"].y > 40 )
			moveObject("suicune_battle", 0, -1);
	}
	
	if (frame > -1) {
		frame++;
		stateframe++;
	}
}