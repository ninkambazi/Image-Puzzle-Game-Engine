
	/**
	 * Image Puzzle Game Engine 1.0
	 * Written by Heri Kaniugu
	 */

(function(window) {
	window.Engine = function(width, height) {
		var engine = new Object();
		engine.width = width;
		engine.height = height;
		engine.canvas = document.createElement("canvas");
		engine.canvas.width = engine.width;
		engine.canvas.height = engine.height;
		engine.context = engine.canvas.getContext("2d");
		engine.into = function(a) {
			if (a) a.appendChild(engine.canvas); return this;
		};
		engine.resource = function(a) {
			engine.images = a; return this;
		};
		engine.open = function() {
			var loop = function() {
				engine.id = window.requestAnimationFrame(loop, engine.canvas);
				if (engine.input) engine.input(); if (engine.update) engine.update(); if (engine.render) engine.render(); 
			};
			for (var index = engine.image.length - 1; index > 0; index--) {
				var k = Math.floor(Math.random() * (index + 1));
				var data = engine.image[index]; engine.image[index] = engine.image[k]; engine.image[k] = data;
			}
			if (engine.id) window.cancelAnimationFrame(engine.id); engine.id = undefined;
			if (engine.create) engine.create(); engine.id = window.requestAnimationFrame(loop);
		};
		engine.launch = function() {
			var images = new Array(engine.images.length), count = 1;
				engine.gamepad().enable(); engine.touch().down(); engine.key().down();
			for (var index = 0; index < images.length; index++) {
				images[index] = new Image(); images[index].src = engine.images[index];
				images[index].onload = function(image) {
					return function() {
						engine.image.push(engine.resize(image)); if (count / images.length * 100 == 100) engine.open(); count++;
					};
				} (images[index]);
			}
		};
		engine.resize = function(image) {
			var canvas = document.createElement("canvas"), context = canvas.getContext("2d");
				canvas.width = engine.width; canvas.height = engine.height;
					context.drawImage(image, 0, 0, image.width, image.height, 0, 0, engine.width, engine.height); return canvas;
		};
		engine.touch = function() {
			var touch = new Object();
			touch.down = function() {
				touch.on("mousedown touchstart", function(event) {
					var touches = event.changedTouches, offset = event.target.getBoundingClientRect(); event.preventDefault();
					for (var index = 0; index < (touches ? touches.length : 1); index++) {
						engine.touches.push({ x: (touches ? touches[index].pageX - offset.left : event.offsetX), 
							y: (touches ? touches[index].pageY - offset.top : event.offsetY) });
					}
				});
			};
			touch.on = function(text, callback) {
				var array = text.split(engine.value(0x20));
				for (var index = 0; index < array.length; index++) engine.canvas[engine.value(0x6F) + 
					engine.value(0x6E) + array[index]] = callback;
			};
			return touch;
		};
		engine.gamepad = function() {
			var gamepad = new Object();
			gamepad.enable = function() {
				var interval = null, controller = function(index) {
					var each = navigator.getGamepads() [index ? index : 0];
					if (each) {
						var axes = each.axes, buttons = each.buttons, axe = Math.round(axes[9] * 10) / 10;
						engine.pads = engine.pads || new Array(); engine.pads[index] = engine.pads[index] || new Object();
						engine.pads[index][0] = axes[0] == 1 ? 0 : undefined; engine.pads[index][1] = axes[1] == 1 ? 1 : undefined;
						engine.pads[index][2] = axes[0] == -1 ? 2 : undefined; engine.pads[index][3] = axes[1] == -1 ? 3 : undefined;
						engine.pads[index][4] = axes[5] == 1 ? 4 : undefined; engine.pads[index][5] = axes[2] == 1 ? 5 : undefined;
						engine.pads[index][6] = axes[5] == -1 ? 6 : undefined; engine.pads[index][7] = axes[2] == -1 ? 7 : undefined;
						engine.pads[index][8] = buttons[0].pressed ? 8 : undefined; engine.pads[index][9] = buttons[1].pressed ? 9 : undefined;
						engine.pads[index][10] = buttons[2].pressed ? 10 : undefined; engine.pads[index][11] = buttons[3].pressed ? 11 : undefined;
						engine.pads[index][12] = axe == -0.4 ? 12 : undefined; engine.pads[index][13] = axe == 0.1 ? 13 : undefined;
						engine.pads[index][14] = axe == 0.7 ? 14 : undefined; engine.pads[index][15] = axe == -1 ? 15 : undefined;
						engine.pads[index][16] = buttons[8].pressed ? 16 : undefined; engine.pads[index][17] = buttons[9].pressed ? 17 : undefined;
						engine.pads[index].axes = axes; engine.pads[index].buttons = buttons;
					}
				};
				window.addEventListener("gamepadconnected", function(event) {
					var index = event.gamepad.index, id = event.gamepad.id;
						engine.pads = engine.pads || new Array(); engine.pads[index] = engine.pads[index] || new Object();
							engine.pads[index].index = index; engine.pads[index].id = id;
								interval = window.setInterval(function() { controller(index); }, 100);
				});
				window.addEventListener("gamepaddisconnected", function(event) {
					window.clearInterval(interval); interval = undefined;
				});
			};
			gamepad.get = function(index, value) {
				return engine.pads[index] ? engine.pads[index][value] : undefined;
			};
			return gamepad;
		};
		engine.key = function() {
			var key = new Object();
			key.down = function() {
				window.addEventListener("keydown", function (event) {
					event.preventDefault(); engine.keys[event.keyCode] = event.keyCode;
				});
			};
			key.get = function(a) {
				return engine.keys[a];
			};
			return key;
		};
		engine.clicked = function(tile) {
			var left = tile.x, right = tile.x + tile.width, top = tile.y, bottom = tile.y + tile.height;
			for (var index = 0; index < engine.touches.length; index++)
				if (bottom < engine.touches[index].y || top > engine.touches[index].y || 
					right < engine.touches[index].x || left > engine.touches[index].x ? false : true ) return true;
		};
		engine.text = function(text) {
			engine.context.font = "14px Verdana";
			engine.context.fillStyle = "#AAAAAA";
			engine.context.strokeStyle = "#000000";
			engine.context.strokeText(text, 10, 20);
			engine.context.fillText(text, 10, 20);
		};
		engine.create = function() {
			var cols = engine.size.cols;
			var rows = engine.size.rows;
			var width = engine.size.width;
			var height = engine.size.height;
			if (engine.puzzle == engine.images.length) engine.puzzle = 0;
			engine.tiles = new Array();
			for (var x = 0; x < cols; x++)
				for (var y = 0; y < rows; y++)
					engine.tiles.push({ visible: true, image: engine.image[engine.puzzle], id: x * cols + y, 
						x: x * width, y: y * height, left: x * width, top: y * height, width: width, height: height });
			engine.tiles[engine.tiles.length - 1].visible = false; engine.shuffle(engine.tiles);
		};
		engine.input = function() {
			var key = engine.key(), gamepad = engine.gamepad();
			engine.pressed = key.get(37) || key.get(38) || key.get(39) || key.get(40) ||
				gamepad.get(0, 12) || gamepad.get(0, 13) || gamepad.get(0, 14) || gamepad.get(0, 15) ||
					gamepad.get(0, 3) || gamepad.get(0, 2) || gamepad.get(0, 1) || gamepad.get(0, 0);
			if (key.get(32) || gamepad.get(0, 17) || engine.touches.length > 0)
				if (engine.status.value == engine.status.complete) engine.status.value = engine.status.continue;
			if (engine.pressed != undefined) {
				engine.tiles.forEach(function(tile, index) {
					if ((tile || new Object()).visible === false && engine.pressed != undefined) {
						var left = index - engine.size.cols, top = index - 1;
						var right = index + engine.size.cols, bottom = index + 1;
						if ((engine.pressed == 40 || engine.pressed == 13 || 
								engine.pressed == 1) && engine.tiles[top]) engine.move(top);
							else if ((engine.pressed == 39 || engine.pressed == 12 || engine.pressed == 0) && 
								engine.tiles[left]) engine.move(left);
							else if ((engine.pressed == 38 || engine.pressed == 15 || engine.pressed == 3) && 
								engine.tiles[bottom]) engine.move(bottom);
							else if ((engine.pressed == 37 || engine.pressed == 14 || engine.pressed == 2) && 
								engine.tiles[right]) engine.move(right);
						engine.pressed = undefined;
					}
				});
			}
			engine.tiles.forEach(function(tile, index) {
				if (engine.clicked(tile)) engine.move(index);
			});
			engine.touches = new Array();
			engine.pads = new Array();
			engine.keys = new Object();
		};
		engine.update = function() {
			engine.complete = 0;
			engine.tiles.forEach(function(value, index) {
				if (value.id == index) engine.complete++;
			});
			if (engine.tiles.length == engine.complete && engine.images.length - 1 > engine.puzzle) 
				engine.status.value = engine.status.complete;
			if (engine.status.value == engine.status.continue) {
				var experience = engine.puzzle > 0 && engine.puzzle % engine.gain.range == 0 ? engine.gain.value : 0;
					engine.status.value = 0; engine.moves = 0; engine.puzzle++;
						engine.tile(engine.size.cols + experience, engine.size.rows + experience).create();
			}
		};
		engine.render = function() {
			engine.context.clearRect(0, 0, engine.width, engine.height);
			engine.tiles.forEach(function(value) {
				if (value.visible) engine.context.drawImage(value.image, value.left, value.top, 
					value.width, value.height, value.x, value.y, value.width, value.height);
			});
			engine.text((engine.puzzle < 10 ? new String(0) + engine.puzzle : engine.puzzle) + engine.value(0x20) + 
				engine.value(0x3A) + engine.value(0x20) + (engine.moves < 10 ? new String(0) + engine.moves : engine.moves));
		};
		engine.move = function(index) {
			var get = function() {
				var left = index - engine.size.cols, top = index - 1;
				var right = index + engine.size.cols, bottom = index + 1;
				var array = [left, top, right, bottom];
				for (var k = 0; k < array.length; k++) {
					if ((engine.tiles[array[k]] || new Object()).visible === false) return array[k];
				}
			};
			var update = function(id) {
				var item = engine.tiles[index]; engine.tiles[index] = engine.tiles[id]; engine.tiles[id] = item; engine.moves++;
				var x = engine.tiles[index].x; engine.tiles[index].x = engine.tiles[id].x; engine.tiles[id].x = x;
				var y = engine.tiles[index].y; engine.tiles[index].y = engine.tiles[id].y; engine.tiles[id].y = y;
			};
			var id = get();
			if (id >= 0) {
				var up = (index - 1 == id && index % engine.size.rows < 1) ? false : true;
				var down = (index + 1 == id && (index + 1) % engine.size.rows < 1) ? false : true;
				if (up && down) update(id);
			}
		};
		engine.shuffle = function(array) {
			for (var index = array.length - 2; index > 0; index--) {
				var k = Math.floor(Math.random() * (index + 1));
				var id = array[index].id; array[index].id = array[k].id; array[k].id = id;
				var left = array[index].left; array[index].left = array[k].left; array[k].left = left;
				var top = array[index].top; array[index].top = array[k].top; array[k].top = top;
			}
		};
		engine.tile = function(cols, rows) {
			engine.size = { cols: cols, rows: rows, width: engine.width / cols, height: engine.height / rows }; return this;
		};
		engine.experience = function(gain) { engine.gain = gain; return this; };
		engine.value = function(value) { return String.fromCharCode(value); };
		engine.go = function(value) { engine.puzzle = value; return this; };
		engine.status = { value: 0, complete: 1, continue: 2 };
		engine.gain = { value: 0, range: 0 };
		engine.touches = new Array();
		engine.keys = new Object();
		engine.pads = new Array();
		engine.image = new Array();
		engine.puzzle = 0;
		engine.moves = 0;
		return engine;
	};
}) (window);