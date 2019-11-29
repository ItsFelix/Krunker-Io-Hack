cripple_window(window.parent);
function cripple_window(_window) {
    if (!_window) {
        return;
    }

    // me, inputs, world, consts, math are objects the rest are key strings
    if (!shared_state.get('hrt')) {
        shared_state.set('hrt', function(me, inputs, world, consts, math) {
            /******************************************************/
            /* re implements code that we overwrote to place hook */
       
            // silent aim
            inputs[xDr] = +(tx % PI2).toFixed(3);
            inputs[yDr] = +(ty % PI2).toFixed(3);

            // auto reload
            controls.keys[controls.reloadKey] = !haveAmmo() * 1;

            // bhop
            inputs[JUMP] = (controls.keys[controls.jumpKey] && !me.didJump) * 1;

            // runs once
            if (!shared_state.get('init')) {
                shared_state.set('init', true);

                drawVisuals = function(c) {
                    let scalingFactor = arguments.callee.caller.caller.arguments[0];
                    let perspective = arguments.callee.caller.caller.arguments[2];
                    let scaledWidth = c.canvas.width / scalingFactor;
                    let scaledHeight = c.canvas.height / scalingFactor;
                    let worldPosition = perspective.camera.getWorldPosition();
                    for (var i = 0; i < world.players.list.length; i++) {
                        let player = world.players.list[i];
                        let e = players[i];
                        if (e[isYou] || !e.active || !e[objInstances] || !isEnemy(e)) {
                            continue;
                        }

                        // the below variables correspond to the 2d box esps corners
                        // note: we can already tell what ymin ymax is
                        let xmin = Infinity;
                        let xmax = -Infinity;
                        let ymin = Infinity;
                        let ymax = -Infinity;
                        let br = false;
                        for (var j = -1; !br && j < 2; j+=2) {
                            for (var k = -1; !br && k < 2; k+=2) {
                                for (var l = 0; !br && l < 2; l++) {
                                    let position = e[objInstances].position.clone();
                                    position.x += j * playerScale;
                                    position.z += k * playerScale;
                                    position.y += l * (playerHeight - e.crouchVal * crouchDst);
                                    if (!perspective.frustum.containsPoint(position)) {
                                        br = true;
                                        break;
                                    }
                                    position.project(perspective.camera);
                                    xmin = Math.min(xmin, position.x);
                                    xmax = Math.max(xmax, position.x);
                                    ymin = Math.min(ymin, position.y);
                                    ymax = Math.max(ymax, position.y);
                                }
                            }
                        }

                        if (br) {
                            continue;
                        }

                        xmin = (xmin + 1) / 2;
                        ymin = (ymin + 1) / 2;
                        xmax = (xmax + 1) / 2;
                        ymax = (ymax + 1) / 2;


                        c.save();
                        // save and restore these variables later so they got nothing on us
                        const original_strokeStyle = c.strokeStyle;
                        const original_lineWidth = c.lineWidth;
                        const original_font = c.font;
                        const original_fillStyle = c.fillStyle;

                        // perfect box esp
                        c.lineWidth = 5;
                        c.strokeStyle = 'rgba(255,50,50,1)';

                        let distanceScale = Math.max(.3, 1 - getD3D(worldPosition.x, worldPosition.y, worldPosition.z, e.x, e.y, e.z) / 600);
                        c.scale(distanceScale, distanceScale);
                        let xScale = scaledWidth / distanceScale;
                        let yScale = scaledHeight / distanceScale;

                        c.beginPath();
                        ymin = yScale * (1 - ymin);
                        ymax = yScale * (1 - ymax);
                        xmin = xScale * xmin;
                        xmax = xScale * xmax;
                        c.moveTo(xmin, ymin);
                        c.lineTo(xmin, ymax);
                        c.lineTo(xmax, ymax);
                        c.lineTo(xmax, ymin);
                        c.lineTo(xmin, ymin);
                        c.stroke();

                        // health bar
                        c.fillStyle = "rgba(255,50,50,1)";
                        let barMaxHeight = ymax - ymin;
                        c.fillRect(xmin - 7, ymin, -10, barMaxHeight);
                        c.fillStyle = "#00FFFF";
                        c.fillRect(xmin - 7, ymin, -10, barMaxHeight * (e.health / e.maxHealth));

                        // info
                        c.font = "60px Sans-serif";
                        c.fillStyle = "white";
                        c.strokeStyle='black';
                        c.lineWidth = 1;
                        let x = xmax + 7;
                        let y = ymax;
                        c.fillText(e.name, x, y);
                        c.strokeText(e.name, x, y);
                        c.font = "30px Sans-serif";
                        y += 35;
                        c.fillText(e.weapon.name, x, y);
                        c.strokeText(e.weapon.name, x, y);
                        y += 35;
                        c.fillText(e.health + ' HP', x, y);
                        c.strokeText(e.health + ' HP', x, y);

                        c.strokeStyle = original_strokeStyle;
                        c.lineWidth = original_lineWidth;
                        c.font = original_font;
                        c.fillStyle = original_fillStyle;
                        c.restore();

                        // skelly chams
                        // note: this can be done better
                        if (e.legMeshes[0]) {
                            let material = e.legMeshes[0].material;
                            material.alphaTest = 1;
                            material.depthTest = false;
                            material.fog = false;
                            material.emissive.g = 1;
                            material.wireframe = true;
                        }

                    }
                };
            };
        })
    }

    const handler = {
        apply: function(target, _this, _arguments) {
            try {
                var original_fn = Function.prototype.apply.apply(target, [_this, _arguments]);
            } catch (e) {
                // modify stack trace to hide proxy
                e.stack = e.stack.replace(/\n.*Object\.apply \(<.*/, '');
                throw e;
            }

            if (_arguments.length == 2 && _arguments[1].length > parseInt("1337 ttap#4547")) {
                let script = _arguments[1];

                // anti anti chet & anti skid
                const version = script.match(/\w+\['exports'\]=(0[xX][0-9a-fA-F]+);/)[1];
                if (version !== "0x17e87") {
                    _window[atob('ZG9jdW1lbnQ=')][atob('d3JpdGU=')](atob('VmVyc2lvbiBtaXNzbWF0Y2gg') + version);
                    _window[atob('bG9jYX'+'Rpb24'+'=')][atob('aHJ'+'lZg='+'=')] = atob('aHR0cHM6'+'Ly9naXRodWIuY2'+'9tL2hydC93aGVlb'+'GNoYWly');
                }

                // note: this window is not the main window
                window['canSee'] = script.match(/,this\['(\w+)'\]=function\(\w+,\w+,\w+,\w+,\w+\){if\(!\w+\)return!\w+;/)[1];
                window['pchObjc'] = script.match(/\(\w+,\w+,\w+\),this\['(\w+)'\]=new \w+\['\w+'\]\(\)/)[1];
                window['objInstances'] = script.match(/\[\w+\]\['\w+'\]=!\w+,this\['\w+'\]\[\w+\]\['\w+'\]&&\(this\['\w+'\]\[\w+\]\['(\w+)'\]\['\w+'\]=!\w+/)[1];
                window['isYou'] = script.match(/,this\['\w+'\]=!\w+,this\['\w+'\]=!\w+,this\['(\w+)'\]=\w+,this\['\w+'\]\['length'\]=\w+,this\[/)[1];
                window['recoilAnimY'] = script.match(/\w*1,this\['\w+'\]=\w*0,this\['\w+'\]=\w*0,this\['\w+'\]=\w*1,this\['\w+'\]=\w*1,this\['\w+'\]=\w*0,this\['\w+'\]=\w*0,this\['(\w+)'\]=\w*0,this\['\w+'\]=\w*0,this\['\w+'\]=\w*0,this\['\w+'\]=\w*0,/)[1];
                window['mouseDownL'] = script.match(/this\['\w+'\]=function\(\){this\['(\w+)'\]=\w*0,this\['(\w+)'\]=\w*0,this\['\w+'\]={}/)[1];
                window['mouseDownR'] = script.match(/this\['\w+'\]=function\(\){this\['(\w+)'\]=\w*0,this\['(\w+)'\]=\w*0,this\['\w+'\]={}/)[2];

                const inputs = script.match(/\(\w+,\w*1\)\),\w+\['\w+'\]=\w*0,\w+\['\w+'\]=\w*0,!(\w+)\['\w+'\]&&\w+\['\w+'\]\['push'\]\((\w+)\),(\w+)\['\w+'\]/)[2];
                const world = script.match(/\(\w+,\w*1\)\),\w+\['\w+'\]=\w*0,\w+\['\w+'\]=\w*0,!(\w+)\['\w+'\]&&\w+\['\w+'\]\['push'\]\((\w+)\),(\w+)\['\w+'\]/)[1];
                const consts = script.match(/\w+\['\w+'\]\),\w+\['\w+'\]\(\w+\['\w+'\],\w+\['\w+'\]\+\w+\['\w+'\]\*(\w+)/)[1];
                const me = script.match(/\(\w+,\w*1\)\),\w+\['\w+'\]=\w*0,\w+\['\w+'\]=\w*0,!(\w+)\['\w+'\]&&\w+\['\w+'\]\['push'\]\((\w+)\),(\w+)\['\w+'\]/)[3];
                const math = script.match(/\\x20\-50\%\)\\x20rotate\('\+\((\w+)\['\w+'\]\(\w+\[\w+\]\['\w+'\]/)[1];


                const code_to_overwrite = script.match(/(\w+\['\w+'\]&&\(\w+\['\w+'\]=\w+\['\w+'\],!\w+\['\w+'\]&&\w+\['\w+'\]\(\w+,\w*1\)\),\w+\['\w+'\]=\w*0,\w+\['\w+'\]=\w*0),!\w+\['\w+'\]&&\w+\['\w+'\]\['push'\]\(\w+\),\w+\['\w+'\]\(\w+,\w+,!\w*1,\w+\['\w+'\]\)/)[1];
                const ttapParams = [me, inputs, world, consts, math].toString();
                let call_hrt = `top['` + master_key + `'].get('hrt')(` + ttapParams + `)`;

                /*
                    pad to avoid stack trace line:column number detection
                    the script will have the same length as it originally had
                */
                if (call_hrt.length + 4 > code_to_overwrite.length) {
                    throw 'WHEELCHAIR: target function too small ' + [call_hrt.length, code_to_overwrite.length];
                }
                let whitespaces = code_to_overwrite.match(/\s/g);
                for (var i = 0; i < whitespaces && whitespaces.length; i++) {
                    call_hrt += whitespaces[i];
                }
                // call_hrt += '/*';
                call_hrt += '  ';
                while (call_hrt.length < code_to_overwrite.length - 2) {
                    // call_hrt += '*';
                    call_hrt += ' ';
                }
                // call_hrt += '*/';
                call_hrt += '  ';

                script = script.replace(code_to_overwrite, call_hrt);
                conceal_string(code_to_overwrite, call_hrt);

                /***********************************************************************************************************/
                /* Below are some misc features which I wouldn't consider bannable                                         */
                // all weapons trails on
                // script = script.replace(/\w+\['weapon'\]&&\w+\['weapon'\]\['trail'\]/g, "true")

                // color blind mode
                // script = script.replace(/#9eeb56/g, '#00FFFF');

                // no zoom
                // script = script.replace(/,'zoom':.+?(?=,)/g, ",'zoom':1");
                /***********************************************************************************************************/
                // bypass modification check of returned function
                const original_script = _arguments[1];
                _arguments[1] = script;
                let mod_fn = Function.prototype.apply.apply(target, [_this, _arguments]);
                _arguments[1] = original_script;
                conceal_function(original_fn, mod_fn);

                return mod_fn;
            }
            return original_fn;
        }
    };

    // we intercept game.js at the `Function` generation level
    const original_Function = _window.Function;
    let hook_Function = new Proxy(original_Function, handler);
    _window.Function = hook_Function;

    conceal_function(original_open, hook_open);
    conceal_function(original_clearRect, hook_clearRect);
    conceal_function(original_getOwnPropertyDescriptors, hook_getOwnPropertyDescriptors);
    conceal_function(original_toString, hook_toString);
    conceal_function(original_Function, hook_Function);
}
