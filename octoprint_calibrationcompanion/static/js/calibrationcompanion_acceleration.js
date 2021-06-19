$(function() {
    function calibrationcompanionViewModel_acceleration(parameters) {
        var self = this;

        self.settingsViewModel = parameters[0];
        self.calibrationcompanionViewModel = parameters[1];

        let mainViewModel = self.calibrationcompanionViewModel;

        self.profile_selection_accel = ko.observable();
        self.first_layer_nozzle_accel = ko.observable();
        self.regular_nozzle_accel = ko.observable();
        self.regular_bed_accel = ko.observable();
        self.fan_speed_accel = ko.observable();
        self.fan_layer_accel = ko.observable();
        self.first_layer_speed_accel = ko.observable();
        self.regular_speed_accel = ko.observable();
        self.travel_speed_accel = ko.observable();
        self.retraction_dist_accel = ko.observable();
        self.retraction_speed_accel = ko.observable();
        self.flow_accel = ko.observable();
        self.abl_method_accel = ko.observable();
        self.start_gcode_accel = ko.observable();
        self.end_gcode_accel = ko.observable();

        let pluginSettings;

        self.onBeforeBinding = function() {
            pluginSettings = self.settingsViewModel.settings.plugins.calibrationcompanion;
            self.profile_selection_accel(pluginSettings.profile_selection_accel());
            self.first_layer_nozzle_accel(pluginSettings.first_layer_nozzle_accel())
            self.regular_nozzle_accel(pluginSettings.regular_nozzle_accel())
            self.regular_bed_accel(pluginSettings.regular_bed_accel())
            self.fan_speed_accel(pluginSettings.fan_speed_accel())
            self.fan_layer_accel(pluginSettings.fan_layer_accel())
            self.first_layer_speed_accel(pluginSettings.first_layer_speed_accel())
            self.regular_speed_accel(pluginSettings.regular_speed_accel())
            self.travel_speed_accel(pluginSettings.travel_speed_accel())
            self.retraction_dist_accel(pluginSettings.retraction_dist_accel())
            self.retraction_speed_accel(pluginSettings.retraction_speed_accel())
            self.flow_accel(pluginSettings.flow_accel())
            self.abl_method_accel(pluginSettings.abl_method_accel())
            self.start_gcode_accel(pluginSettings.start_gcode_accel())
            self.end_gcode_accel(pluginSettings.end_gcode_accel())
        }

        let stageHeightAccel;
        
        let restrictedInputsAccel = ["#first-layer-nozzle-accel", "#regular-nozzle-accel", "#regular-bed-accel", "#fan-speed-accel", "#fan-layer-accel", "#first-layer-speed-accel",
            "#regular-speed-accel", "#travel-speed-accel", "#retraction-speed-accel", "#retraction-dist-accel", "#flow-accel", "#abl-method-accel", "#start-gcode-accel", "#end-gcode-accel"];
        let saveInputsAccel = ["first_layer_nozzle_accel", "regular_nozzle_accel", "regular_bed_accel", "fan_speed_accel", "fan_layer_accel", "first_layer_speed_accel",
            "regular_speed_accel", "travel_speed_accel", "retraction_speed_accel", "retraction_dist_accel", "flow_accel", "abl_method_accel", "start_gcode_accel", "end_gcode_accel"];
        let restrictedInputsProfile = ["abl-method-accel", "end-gcode-accel", "fan-layer-accel", "fan-speed-accel", "first-layer-nozzle-accel",
            "first-layer-speed-accel", "flow-accel", "regular-bed-accel", "regular-nozzle-accel", "regular-speed-accel", "retraction-dist-accel",
            "retraction-speed-accel", "start-gcode-accel", "travel-speed-accel"];
        let restrictedSettingsProfile = ["abl_method", "end_gcode", "fan_layer", "fan_speed", "first_layer_nozzle",
            "first_layer_speed", "flow", "regular_bed", "regular_nozzle", "regular_speed", "retraction_dist",
            "retraction_speed", "start_gcode", "travel_speed"];
        let saveSettingsProfile, saveSettingsAccel, saveSettingsProfileAccel;

        self.onAfterBinding = function() {
            $(restrictedInputsAccel.join(",")).each(function() {
                let element = this
                let div = this.parentNode.parentNode.parentNode;
                let id = element.id
                saveSettingsAccel = saveInputsAccel[restrictedInputsAccel.indexOf('#' + this.id)]
                saveSettingsProfileAccel = element.value;
                if (restrictedInputsAccel.indexOf('#' + id) <= 8) {
                    mainViewModel.checkValue(element, div, mainViewModel.allowedArrayClassic)
                } else if (restrictedInputsAccel.indexOf('#' + id) <= 10 && restrictedInputsAccel.indexOf('#' + id) >= 9) {
                    mainViewModel.checkValue(element, div, mainViewModel.allowedArrayComma)
                }
            });
            mainViewModel.spanValAccel = 0;
            if (mainViewModel.nozzle_size() === "0.6") {
                stageHeightAccel = 4.8;
            } else {
                stageHeightAccel = 5;
            }
        }

        let settingName;
        let settingValue;
        
        document.getElementById("load-profile-accel").onclick = function() {
            settingName = [];
            settingValue = [];
            if (self.profile_selection_accel() !== "") {
                mainViewModel.firstTime = Date.now();
                mainViewModel.startLoading()
                for (let x = 0; x < restrictedSettingsProfile.length; x++) {
                    if (restrictedSettingsProfile[x] !== "novalue") {
                        let element = document.getElementById(restrictedInputsProfile[x]);
                        saveSettingsProfile = restrictedSettingsProfile[x] + "_" + self.profile_selection_accel();
                        saveSettingsAccel = restrictedSettingsProfile[x] + "_accel";
                        saveSettingsProfileAccel = pluginSettings[saveSettingsProfile]()
                        element.value = saveSettingsProfileAccel; // loading setting
                        settingName.push(saveSettingsAccel);
                        settingValue.push(saveSettingsProfileAccel);
                        mainViewModel.sortToCheck(element, "loaded");
                    }
                }
                mainViewModel.saveSettingsLoading(settingName, settingValue, "loaded and saved")
            } else {
                self.PNotify = new PNotify(mainViewModel.PNotifyData.noProfileMessage)
            }
        }

        let myParent;
        let myBase = [];
        let inputListAcceleration = [];
        let inputListJerkX = [];
        let inputListJerkY = [];
        let inputListJunction = [];
        let stageImageAccel = [];
        let layerHeightAccel = [];
        let spanControlGroup1 = [];
        let spanControlGroup2 = [];
        let spanControlGroup3 = [];
        let spanControlGroup4 = [];
        let spanControlGroupBox = [];
        let spanControl1 = [];
        let spanControl2 = [];
        let spanControl3 = [];
        let spanControl4 = [];
        let spanInputAppend = [];
        let spanAddon = [];

        let a=0;
        let olda;
        //let booleanCheck = true;

        self.addAccel = function() {
            if (mainViewModel.nozzle_size() === "0.6") {
                stageHeightAccel = 4.8;
            } else {
                stageHeightAccel = 4.8;
            }
            if (mainViewModel.bed_size_z() > mainViewModel.spanValAccel * (mainViewModel.nozzle_size()/2)) {
                //mainViewModel.stageAvailable()
                olda = a;
                a++;
                myParent = document.getElementById("accelStage");

                myBase[a] = document.createElement("div");
                myBase[a].id = "myBase" + a;
                myBase[a].className = "baseText"

                myParent.appendChild(myBase[a]);
                myBase[a].append("Stage " + a)

                myBase[a].appendChild(mainViewModel.whitespace.cloneNode())

                spanControlGroupBox[a] = document.createElement("span");
                spanControlGroupBox[a].className = "control-box-accel"

                myBase[a].appendChild(spanControlGroupBox[a])

                spanControlGroup1[a] = document.createElement("span");
                spanControlGroup1[a].className = "control-group";
                spanControlGroupBox[a].appendChild(spanControlGroup1[a])

                spanControl1[a] = document.createElement("span");
                spanControl1[a].className = "controls";
                spanControlGroup1[a].appendChild(spanControl1[a])

                spanInputAppend[a] = document.createElement("span");
                spanInputAppend[a].className = "input-append";
                spanControl1[a].appendChild(spanInputAppend[a])

                inputListAcceleration[a] = document.createElement("input");
                inputListAcceleration[a].type = "text";
                inputListAcceleration[a].id = "inputListAcceleration" + a;
                inputListAcceleration.push("#" + inputListAcceleration[a].id);
                inputListAcceleration[a].value = 400 + parseFloat(a) * 100;
                inputListAcceleration[a].className = "smallSizeTextbox";
                spanInputAppend[a].appendChild(inputListAcceleration[a]);

                spanAddon[a] = document.createElement("span");
                spanAddon[a].className = "add-on";
                spanAddon[a].textContent = "mm/s";

                spanInputAppend[a].appendChild(spanAddon[a]);

                spanControlGroupBox[a].appendChild(mainViewModel.whitespace.cloneNode())

                spanControlGroup2[a] = document.createElement("span");
                spanControlGroup2[a].className = "control-group";
                spanControlGroupBox[a].appendChild(spanControlGroup2[a])

                spanControl2[a] = document.createElement("span");
                spanControl2[a].className = "controls";
                spanControlGroup2[a].appendChild(spanControl2[a])

                inputListJerkX[a] = document.createElement("input");
                inputListJerkX[a].type = "text";
                inputListJerkX[a].id = "inputListJerkX" + a;
                inputListJerkX[a].value = 5 + parseFloat(a);
                inputListJerkX[a].className = "smallSizeTextbox";
                spanControl2[a].appendChild(inputListJerkX[a]);

                spanControlGroup3[a] = document.createElement("span");
                spanControlGroup3[a].className = "control-group";
                spanControlGroupBox[a].appendChild(spanControlGroup3[a])

                spanControl3[a] = document.createElement("span");
                spanControl3[a].className = "controls";
                spanControlGroup3[a].appendChild(spanControl3[a])

                inputListJerkY[a] = document.createElement("input");
                inputListJerkY[a].type = "text";
                inputListJerkY[a].id = "inputListJerkY" + a;
                inputListJerkY[a].value = 5 + parseFloat(a);
                inputListJerkY[a].className = "smallSizeTextbox";
                spanControl3[a].appendChild(inputListJerkY[a]);

                spanControlGroupBox[a].appendChild(mainViewModel.whitespace2.cloneNode())

                spanControlGroup4[a] = document.createElement("span");
                spanControlGroup4[a].className = "control-group";
                spanControlGroupBox[a].appendChild(spanControlGroup4[a])

                spanControl4[a] = document.createElement("span");
                spanControl4[a].className = "controls";
                spanControlGroup4[a].appendChild(spanControl4[a])

                inputListJunction[a] = document.createElement("input");
                inputListJunction[a].type = "text";
                inputListJunction[a].id = "inputListJunction" + a;
                inputListJunction.push("#" + inputListJunction[a].id);
                inputListJunction[a].value = (0.03 + parseFloat(a) / 100).toFixed(3);
                inputListJunction[a].className = "smallSizeTextbox";
                spanControl4[a].appendChild(inputListJunction[a]);

                myBase[a].appendChild(mainViewModel.whitespace2.cloneNode())

                stageImageAccel[a] = document.createElement("img");
                stageImageAccel[a].src = "/plugin/calibrationcompanion/static/images/accelStage.jpg";
                stageImageAccel[a].style.width = "30%";
                stageImageAccel[a].alt = "Acceleration tower stage";
                myBase[a].appendChild(stageImageAccel[a]);

                layerHeightAccel[a] = document.createElement("span");
                layerHeightAccel[a].className = "layerHeightRetra"
                layerHeightAccel[a].textContent = mainViewModel.spanValAccel + 1;
                myBase[a].appendChild(layerHeightAccel[a])
                mainViewModel.spanValAccel = Math.ceil(mainViewModel.spanValAccel + stageHeightAccel / ((mainViewModel.nozzle_size() / 2)));

                if (document.getElementById("parameter-select").value === "jerk") {
                    for (let x = 1; x <= a; x++) {
                        document.getElementById("inputListJunction" + x).disabled = true;
                        document.getElementById("inputListJerkX" + x).disabled = false;
                        document.getElementById("inputListJerkY" + x).disabled = false;
                    }
                } else {
                    for (let x = 1; x <= a; x++) {
                        document.getElementById("inputListJunction" + x).disabled = false;
                        document.getElementById("inputListJerkX" + x).disabled = true;
                        document.getElementById("inputListJerkY" + x).disabled = true;
                    }
                }

                if (a >= 1) {
                    myParent.insertBefore(myBase[a], myBase[a - 1]);
                }
            }
            else {
                mainViewModel.zHeightWarning();
            }
        }
        self.removeAccel = function() {
            olda = a;
            if (Math.sign(a) === 1) {
                myBase[a].remove();
                mainViewModel.spanValAccel = Math.ceil(mainViewModel.spanValAccel - stageHeightAccel / ((mainViewModel.nozzle_size() / 2)));
                a--;
            } else {
                a = 0;
            }
            if (a === 0 && olda === 1) {
                mainViewModel.spanValAccel = 0;
            }
        }

        mainViewModel.resetAccel = function() {
            while(a>0) {
                self.removeAccel()
            }
            mainViewModel.spanValAccel = 0;
        }

        $(document).on("input", function(e) {
            let id = e.target.id;
            let element = e.target;
            if (id.includes("inputListAcceleration")) {
                mainViewModel.checkValue(element, element.parentNode.parentNode, mainViewModel.allowedArrayClassic);
            } else if (id.includes("inputListJerk")) {
                mainViewModel.checkValue(element, element.parentNode.parentNode, mainViewModel.allowedArrayClassic);
            } else if (id.includes("inputListJunction")) {
                mainViewModel.checkValue(element, element.parentNode.parentNode, mainViewModel.allowedArrayComma);
            }
        });

        document.getElementById("parameter-select").onchange = function(e) {
            if (this.value === "jerk") {
                for (let x=1; x<=a; x++) {
                    document.getElementById("inputListJunction" + x).disabled = true;
                    document.getElementById("inputListJerkX" + x).disabled = false;
                    document.getElementById("inputListJerkY" + x).disabled = false;
                }
             }
            else {
                for (let x=1; x<=a; x++) {
                    document.getElementById("inputListJunction" + x).disabled = false;
                    document.getElementById("inputListJerkX" + x).disabled = true;
                    document.getElementById("inputListJerkY" + x).disabled = true;
                }
            }
        }
        let GStatus, EStatus, layerStatus, relative_pos_x, relative_pos_y, relative_pos_z,
            gcode_generated = [], pos_x = [], pos_y = [], pos_z = [],
            returningPosX, returningPosY, first_x_absolute_pos, first_y_absolute_pos, startFeedRate = [],
            startZHeight = [], printing_speed, l, start_gcode, end_gcode;

        document.getElementById("accel-tower").onclick = function() {
            if (a === 0) {
                mainViewModel.noStageMessage()
                return;
            }
            let array = [];
            let el = document.getElementById("acceleration-calibrationcompanion").getElementsByClassName("control-group");
            for (let x=0; x<el.length; x++) {
                array[x] = el[x].attributes[0].nodeValue;
                if (array[x].includes("error")) {
                    mainViewModel.errorMessage()
                    return
                }
            }
            $('#accel-tower').button('loading');
            mainViewModel.flowCube = false
            l = 0;
            mainViewModel.zLastAbsolute = mainViewModel.nozzle_size()/2;
            mainViewModel.last_feed_rate = 0;
            start_gcode = document.getElementById("start-gcode-accel").value;
            end_gcode = document.getElementById("end-gcode-accel").value;
            mainViewModel.variable.first_layer_nozzle = document.getElementById("first-layer-nozzle-accel").value;
            mainViewModel.variable.regular_nozzle = document.getElementById("regular-nozzle-accel").value;
            mainViewModel.variable.regular_bed = document.getElementById("regular-bed-accel").value;
            mainViewModel.variable.fan_speed = document.getElementById("fan-speed-accel").value;
            mainViewModel.variable.fan_layer = document.getElementById("fan-layer-accel").value;
            mainViewModel.variable.first_layer_speed = document.getElementById("first-layer-speed-accel").value * 60;
            mainViewModel.variable.regular_speed = document.getElementById("regular-speed-accel").value * 60;
            mainViewModel.variable.travel_speed = document.getElementById("travel-speed-accel").value * 60;
            mainViewModel.variable.retraction_distance = document.getElementById("retraction-dist-accel").value;
            mainViewModel.variable.retraction_speed = document.getElementById("retraction-speed-accel").value * 60;
            mainViewModel.variable.flow = document.getElementById("flow-accel").value;
            mainViewModel.variable.abl_method = document.getElementById("abl-method-accel").value;
            mainViewModel.variable.filename = "acceltower";

            for (let s=1; s<=a; s++) {
                let boolean = [true]
                mainViewModel.first_x_pos = String(mainViewModel.bed_center_x + 100 / 2 - 30);
                if (mainViewModel.nozzle_size() === "1.0") {
                    mainViewModel.first_y_pos = String(mainViewModel.bed_center_y + 100 / 2 - 15);
                } else {
                    mainViewModel.first_y_pos = String(mainViewModel.bed_center_y + 100 / 2);
                }

                mainViewModel.first_z_pos = String((mainViewModel.nozzle_size() / 2) * l);
                first_x_absolute_pos = mainViewModel.first_x_pos;
                first_y_absolute_pos = mainViewModel.first_y_pos;
                startZHeight[s] = parseFloat(mainViewModel.zLastAbsolute) + parseFloat(mainViewModel.nozzle_size()) / 2;
                startFeedRate[s] = mainViewModel.feed_rate
                accelTowerCoord(parseFloat(mainViewModel.nozzle_size()));
                for (let z = 0; z <= relative_pos_x.length; z++) {
                    if (mainViewModel.relative_positioning()) {
                        pos_x[z] = relative_pos_x[z]
                        pos_y[z] = relative_pos_y[z]
                        pos_z[z] = relative_pos_z[z]
                    } else {
                        mainViewModel.getAbsoluteCoordinate(relative_pos_x[z], relative_pos_y[z], relative_pos_z[z], boolean[z])
                        pos_x[z] = mainViewModel.xAbsolute[z]
                        pos_y[z] = mainViewModel.yAbsolute[z]
                        pos_z[z] = mainViewModel.zAbsolute[z]
                    }
                }
                if (mainViewModel.relative_positioning()) {
                    returningPosX = mainViewModel.getReturningPosition(relative_pos_x);
                    returningPosY = mainViewModel.getReturningPosition(relative_pos_y);
                } else {
                    pos_x.splice(0, 1);
                    pos_y.splice(0, 1);
                    pos_z.splice(0, 1);
                    returningPosX = parseFloat(pos_x[pos_x.length - 1]) + mainViewModel.getReturningPosition(relative_pos_x);
                    returningPosY = parseFloat(pos_y[pos_y.length - 1]) + mainViewModel.getReturningPosition(relative_pos_y);
                    mainViewModel.first_x_pos = returningPosX
                    mainViewModel.first_y_pos = returningPosY
                    mainViewModel.first_z_pos = (mainViewModel.nozzle_size() / 2) * l
                }
                gcode_generated[s] = [];
                for (let x = 0; x < relative_pos_x.length; x++) {
                    if (l <= 1) {
                        printing_speed = mainViewModel.variable.first_layer_speed;
                    } else {
                        printing_speed = mainViewModel.variable.regular_speed;
                    }
                    if (GStatus[x] !== "null") {
                        if (relative_pos_z[x] === "null") {
                            if (GStatus[x] === "G0") {
                                gcode_generated[s][x] = GStatus[x] + " F" + mainViewModel.travel_speed + " X" + pos_x[x] + " Y" + pos_y[x] + ";\n";
                            } else {
                                if (EStatus[x] !== "null") {
                                    if (mainViewModel.relative_positioning()) {
                                        if (EStatus[x] === "retract") {
                                            gcode_generated[s][x] = "G1 F" + mainViewModel.variable.retraction_speed + " E-" + mainViewModel.variable.retraction_distance + ";\n";
                                        } else if (EStatus[x] === "extrude") {
                                            gcode_generated[s][x] = "G1 F" + mainViewModel.variable.retraction_speed + "E" + mainViewModel.variable.retraction_distance + ";\n";
                                        }
                                    } else {
                                        if (EStatus[x] === "retract") {
                                            gcode_generated[s][x] = "G1 F" + mainViewModel.variable.retraction_speed + " E" + (mainViewModel.feed_rate - mainViewModel.variable.retraction_distance).toFixed(5) + ";\n";
                                        } else if (EStatus[x] === "extrude") {
                                            gcode_generated[s][x] = "G1 F" + mainViewModel.variable.retraction_speed + " E" + mainViewModel.feed_rate + ";\n";
                                        }
                                    }
                                } else {
                                    mainViewModel.extruded_length_calculation_relative(relative_pos_x[x], relative_pos_y[x])
                                    gcode_generated[s][x] = GStatus[x] + " F" + printing_speed + " X" + pos_x[x] + " Y" + pos_y[x] + " E" + mainViewModel.feed_rate + ";\n";
                                }
                            }
                        } else {
                            if (GStatus[x] === "G0") {
                                gcode_generated[s][x] = GStatus[x] + " F" + mainViewModel.variable.travel_speed + " X" + pos_x[x] + " Y" + pos_y[x] + " Z" + pos_z[x] + ";\n";
                            } else {
                                mainViewModel.extruded_length_calculation_relative(relative_pos_x[x], relative_pos_y[x])
                                gcode_generated[s][x] = GStatus[x] + " F" + printing_speed + " X" + pos_x[x] + " Y" + pos_y[x] + " Z" + pos_z[x] + " E" + mainViewModel.feed_rate + ";\n";
                            }
                        }
                    } else if (layerStatus[x] === "LAYER") {
                        if (l >= 1 && l <= mainViewModel.variable.fan_layer) {
                            gcode_generated[s][x] = ";LAYER:" + l + "\n" +
                                "M106 S" + Math.round(l * (mainViewModel.variable.fan_speed * (255 / 100) * 10) / mainViewModel.variable.fan_layer) / 10 + ";\n";
                        } else {
                            gcode_generated[s][x] = ";LAYER:" + l + "\n"
                        }
                        if (s >= 1) {
                            l++;
                        }
                    }
                }
                if (mainViewModel.relative_positioning()) {
                    if (document.getElementById("parameter-select").value === "jerk") {
                        if (s > 1) {
                            gcode_generated[s].unshift("M204 P" + document.getElementById("inputListAcceleration" + s).value + ";\n" +
                                "M205 X" + document.getElementById("inputListJerkX" + s).value + " Y" + document.getElementById("inputListJerkY" + s).value + ";\n" +
                                "M117 St" + s + "/" + a + " Acc" + document.getElementById("inputListAcceleration" + s).value +
                                " Jx" + document.getElementById("inputListJerkX" + s).value + "Jy" + document.getElementById("inputListJerkY" + s).value + ";\n" +
                                "G0 F" + mainViewModel.variable.travel_speed + " Z" + mainViewModel.nozzle_size() / 2 + "\n" +
                                "G0 F" + mainViewModel.variable.travel_speed + " X" + returningPosX + " Y" + returningPosY + ";\n");
                        } else {
                            gcode_generated[s].unshift("M204 P" + document.getElementById("inputListAcceleration" + s).value + ";\n" +
                                "M205 X" + document.getElementById("inputListJerkX" + s).value + " Y" + document.getElementById("inputListJerkY" + s).value + ";\n" +
                                "M117 St" + s + "/" + a + " Acc" + document.getElementById("inputListAcceleration" + s).value +
                                " Jx" + document.getElementById("inputListJerkX" + s).value + "Jy" + document.getElementById("inputListJerkY" + s).value + ";\n");
                        }
                    } else {
                        if (s > 1) {
                            gcode_generated[s].unshift("M204 P" + document.getElementById("inputListAcceleration" + s).value + ";\n" +
                                "M205 J" + document.getElementById("inputListJunction" + s).value + ";\n" +
                                "M117 St" + s + "/" + a + " Acc" + document.getElementById("inputListAcceleration" + s).value +
                                " Junc" + document.getElementById("inputListJunction" + s).value + ";\n" +
                                "G0 F" + mainViewModel.variable.travel_speed + " Z" + mainViewModel.nozzle_size() / 2 + "\n" +
                                "G0 F" + mainViewModel.variable.travel_speed + " X" + returningPosX + " Y" + returningPosY + ";\n");
                        } else {
                            gcode_generated[s].unshift("M204 P" + document.getElementById("inputListAcceleration" + s).value + ";\n" +
                                "M205 J" + document.getElementById("inputListJunction" + s).value + ";\n" +
                                "M117 St" + s + "/" + a + " Acc" + document.getElementById("inputListAcceleration" + s).value +
                                " Junc" + document.getElementById("inputListJunction" + s).value + ";\n");
                        }
                    }
                } else {
                    if (document.getElementById("parameter-select").value === "jerk") {
                        if (s > 1) {
                            gcode_generated[s].unshift("M204 P" + document.getElementById("inputListAcceleration" + s).value + ";\n" +
                                "M205 X" + document.getElementById("inputListJerkX" + s).value + " Y" + document.getElementById("inputListJerkY" + s).value + ";\n" +
                                "M117 St" + s + "/" + a + " Acc" + document.getElementById("inputListAcceleration" + s).value +
                                " Jx" + document.getElementById("inputListJerkX" + s).value + "Jy" + document.getElementById("inputListJerkY" + s).value + ";\n" +
                                "G0 F" + mainViewModel.variable.travel_speed + " X" + returningPosX + " Y" + returningPosY +
                                " Z" + (startZHeight[s] + parseFloat(mainViewModel.nozzle_size()) / 2) + ";\n");
                        } else {
                            gcode_generated[s].unshift("M204 P" + document.getElementById("inputListAcceleration" + s).value + ";\n" +
                                "M205 X" + document.getElementById("inputListJerkX" + s).value + " Y" + document.getElementById("inputListJerkY" + s).value + ";\n" +
                                "M117 St" + s + "/" + a + " Acc" + document.getElementById("inputListAcceleration" + s).value +
                                " Jx" + document.getElementById("inputListJerkX" + s).value + "Jy" + document.getElementById("inputListJerkY" + s).value + ";\n");
                        }
                    } else {
                        if (s > 1) {
                            gcode_generated[s].unshift("M204 P" + document.getElementById("inputListAcceleration" + s).value + ";\n" +
                                "M205 J" + document.getElementById("inputListJunction" + s).value + ";\n" +
                                "M117 St" + s + "/" + a + " Acc" + document.getElementById("inputListAcceleration" + s).value +
                                " Junc" + document.getElementById("inputListJunction" + s).value + ";\n" +
                                "G0 F" + mainViewModel.variable.travel_speed + " X" + returningPosX + " Y" + returningPosY +
                                " Z" + (startZHeight[s] + parseFloat(mainViewModel.nozzle_size()) / 2) + ";\n");
                        } else {
                            gcode_generated[s].unshift("M204 P" + document.getElementById("inputListAcceleration" + s).value + ";\n" +
                                "M205 J" + document.getElementById("inputListJunction" + s).value + ";\n" +
                                "M117 St" + s + "/" + a + " Acc" + document.getElementById("inputListAcceleration" + s).value +
                                " Junc" + document.getElementById("inputListJunction" + s).value + ";\n");
                        }
                    }
                }
            }
            if (mainViewModel.relative_positioning()) {
                gcode_generated.unshift("G91;\n")
            }

            mainViewModel.callSettings();

            for (const [key, value] of Object.entries(mainViewModel.settingsCallable)) {
                start_gcode = start_gcode.replaceAll("[" + key + "]", value);
            }
            gcode_generated.unshift("G28;\n\n" +
                ";---------ABL METHOD---------\n" + mainViewModel.variable.abl_method + ";\n;---------ABL METHOD---------\n\n" +
                ";---------START G-CODE---------\n" + start_gcode + ";\n;---------START G-CODE---------\n\n" +
                "G92 E0;\nG0 F" + mainViewModel.variable.travel_speed + " X" + first_x_absolute_pos + " Y" + first_y_absolute_pos +
                ";\n" + "G0 F" + mainViewModel.variable.travel_speed + " Z" + mainViewModel.nozzle_size() / 2 + ";\n")

            for (const [key, value] of Object.entries(mainViewModel.settingsCallable)) {
                end_gcode = end_gcode.replaceAll("[" + key + "]", value);
            }
            gcode_generated.push(end_gcode);

            let url = OctoPrint.getBlueprintUrl('calibrationcompanion') + "downloadFile";
            OctoPrint.post(url, {"name": mainViewModel.getFullFilename(mainViewModel.variable.filename), "generated gcode": gcode_generated.flat().join('')})

            gcode_generated = [];
            pos_x = [];
            pos_y = [];
            pos_z = [];
            startZHeight = [];
            startFeedRate = [];
        }
    
    function accelTowerCoord(nozzle_size) {
            if (nozzle_size === 0.4) {
                GStatus = ['null',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'null',	'G1',	'G0',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'null',	'G1',	'G0',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'null',	'G1',	'G0',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'null',	'G1',	'G0',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'null',	'G1',	'G0',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'null',	'G1',	'G0',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'null',	'G1',	'G0',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'null',	'G1',	'G0',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'null',	'G1',	'G0',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'null',	'G1',	'G0',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'null',	'G1',	'G0',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'null',	'G1',	'G0',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'null',	'G1',	'G0',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'null',	'G1',	'G0',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'null',	'G1',	'G0',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'null',	'G1',	'G0',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'null',	'G1',	'G0',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'null',	'G1',	'G0',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'null',	'G1',	'G0',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'null',	'G1',	'G0',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'null',	'G1',	'G0',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'null',	'G1',	'G0',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'null',	'G1',	'G0',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'null',	'G1',	'G0',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1'];
                EStatus = ['null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'retract',	'null',	'extrude',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'retract',	'null',	'extrude',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'retract',	'null',	'extrude',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'retract',	'null',	'extrude',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'retract',	'null',	'extrude',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'retract',	'null',	'extrude',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'retract',	'null',	'extrude',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'retract',	'null',	'extrude',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'retract',	'null',	'extrude',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'retract',	'null',	'extrude',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'retract',	'null',	'extrude',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'retract',	'null',	'extrude',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'retract',	'null',	'extrude',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'retract',	'null',	'extrude',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'retract',	'null',	'extrude',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'retract',	'null',	'extrude',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'retract',	'null',	'extrude',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'retract',	'null',	'extrude',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'retract',	'null',	'extrude',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'retract',	'null',	'extrude',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'retract',	'null',	'extrude',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'retract',	'null',	'extrude',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'retract',	'null',	'extrude',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'retract',	'null',	'extrude',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null'];
                layerStatus = ['LAYER',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'LAYER',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'LAYER',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'LAYER',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'LAYER',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'LAYER',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'LAYER',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'LAYER',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'LAYER',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'LAYER',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'LAYER',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'LAYER',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'LAYER',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'LAYER',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'LAYER',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'LAYER',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'LAYER',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'LAYER',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'LAYER',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'LAYER',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'LAYER',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'LAYER',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'LAYER',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'LAYER',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'LAYER',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null'];
                relative_pos_x = ['null',	'-32.6',	'0',	'-4.118',	'-32.6',	'14.718',	'0',	'84.6',	'0',	'-30',	'0',	'null',	'null',	'null',	'null',	'-32.6',	'0',	'-4.118',	'-32.6',	'14.718',	'0',	'84.6',	'0',	'-30',	'0',	'null',	'null',	'null',	'null',	'-32.6',	'0',	'-4.118',	'-32.6',	'14.718',	'0',	'84.6',	'0',	'-30',	'0',	'null',	'null',	'null',	'null',	'-32.6',	'0',	'-4.118',	'-32.6',	'14.718',	'0',	'84.6',	'0',	'-30',	'0',	'null',	'null',	'null',	'null',	'-32.6',	'0',	'-4.118',	'-32.6',	'14.718',	'0',	'69.853',	'0.001',	'0.762',	'0.001',	'1.328',	'0',	'0.763',	'-0.001',	'11.893',	'0',	'-0.5',	'0',	'0.5',	'0',	'-30',	'0',	'null',	'null',	'null',	'null',	'-32.6',	'0',	'-4.118',	'-32.6',	'14.718',	'0',	'69.981',	'0.001',	'0.762',	'0.001',	'1.072',	'0',	'0.763',	'-0.001',	'12.021',	'0',	'-0.5',	'0',	'0.5',	'0',	'-30',	'0',	'null',	'null',	'null',	'null',	'-32.6',	'0',	'-4.118',	'-32.6',	'14.718',	'0',	'70.109',	'0.001',	'0.762',	'0.001',	'0.816',	'0',	'0.763',	'-0.001',	'12.149',	'0',	'-0.5',	'0',	'0.5',	'0',	'-30',	'0',	'null',	'null',	'null',	'null',	'-32.6',	'0',	'-4.118',	'-32.6',	'14.718',	'0',	'70.237',	'0.001',	'0.762',	'0.001',	'0.56',	'0',	'0.763',	'-0.001',	'12.277',	'0',	'-0.5',	'0',	'0.5',	'0',	'-30',	'0',	'null',	'null',	'null',	'null',	'-32.6',	'0',	'-4.118',	'-32.6',	'14.718',	'0',	'70.365',	'0.001',	'0.762',	'0.001',	'0.304',	'0',	'0.763',	'-0.001',	'12.405',	'0',	'-0.5',	'0',	'0.5',	'0',	'-30',	'0',	'null',	'null',	'null',	'null',	'-32.6',	'0',	'-4.118',	'-32.6',	'14.718',	'0',	'70.493',	'0.001',	'0.762',	'0.001',	'0.048',	'0',	'0.764',	'-0.001',	'12.532',	'0',	'-0.5',	'0',	'0.5',	'0',	'-30',	'0',	'null',	'null',	'null',	'null',	'-32.6',	'0',	'-4.118',	'-32.6',	'14.718',	'0',	'70.621',	'0.001',	'1.319',	'-0.001',	'12.66',	'0',	'-0.5',	'0',	'0.5',	'0',	'-30',	'0',	'null',	'null',	'null',	'null',	'-32.6',	'0',	'-4.118',	'-32.6',	'14.718',	'0',	'70.749',	'0.001',	'1.062',	'0',	'12.788',	'0',	'-0.5',	'0',	'0.5',	'0',	'-30',	'0',	'null',	'null',	'null',	'null',	'-32.6',	'0',	'-4.118',	'-32.6',	'14.718',	'0',	'70.877',	'0.001',	'0.806',	'0',	'12.916',	'0',	'-0.5',	'0',	'0.5',	'0',	'-30',	'0',	'null',	'null',	'null',	'null',	'-32.6',	'0',	'-4.118',	'-32.6',	'14.718',	'0',	'70.794',	'0',	'0.973',	'0.001',	'12.832',	'0',	'-0.5',	'0',	'0.5',	'0',	'-30',	'0',	'null',	'null',	'null',	'null',	'-32.6',	'0',	'-4.118',	'-32.6',	'14.718',	'0',	'70.666',	'0',	'1.229',	'0.001',	'12.704',	'0',	'-0.5',	'0',	'0.5',	'0',	'-30',	'0',	'null',	'null',	'null',	'null',	'-32.6',	'0',	'-4.118',	'-32.6',	'14.718',	'0',	'70.538',	'0',	'1.485',	'0.001',	'12.576',	'0',	'-0.5',	'0',	'0.5',	'0',	'-0.5',	'0',	'0.5',	'0',	'-30',	'0',	'null',	'null',	'null',	'null',	'-32.6',	'0',	'-4.118',	'-32.6',	'14.718',	'0',	'70.409',	'0',	'0.764',	'-0.001',	'0.217',	'0.001',	'0.762',	'0.001',	'12.447',	'0',	'-0.5',	'0',	'0.5',	'0',	'-0.5',	'0',	'0.5',	'0',	'-30',	'0',	'null',	'null',	'null',	'null',	'-32.6',	'0',	'-4.118',	'-32.6',	'14.718',	'0',	'70.281',	'0',	'0.764',	'-0.001',	'0.473',	'0.001',	'0.762',	'0.001',	'12.319',	'0',	'-0.5',	'0',	'0.5',	'0',	'-0.5',	'0',	'0.5',	'0',	'-30',	'0',	'null',	'null',	'null',	'null',	'-32.6',	'0',	'-4.118',	'-32.6',	'14.718',	'0',	'70.153',	'0',	'0.763',	'-0.001',	'0.73',	'0.001',	'0.762',	'0.001',	'12.191',	'0',	'-0.5',	'0',	'0.5',	'0',	'-0.5',	'0',	'0.5',	'0',	'-30',	'0',	'null',	'null',	'null',	'null',	'-32.6',	'0',	'-4.118',	'-32.6',	'14.718',	'0',	'70.025',	'0',	'0.763',	'-0.001',	'0.986',	'0.001',	'0.762',	'0.001',	'12.063',	'0',	'-0.5',	'0',	'0.5',	'0',	'-0.5',	'0',	'0.5',	'0',	'-30',	'0',	'null',	'null',	'null',	'null',	'-32.6',	'0',	'-4.118',	'-32.6',	'14.718',	'0',	'69.897',	'0',	'0.763',	'-0.001',	'1.242',	'0.001',	'0.762',	'0.001',	'11.935',	'0',	'-0.5',	'0',	'0.5',	'0',	'-0.5',	'0',	'0.5',	'0',	'-30',	'0',	'null',	'null',	'null',	'null',	'-32.6',	'0',	'-4.118',	'-32.6',	'14.718',	'0',	'84.6',	'0',	'-30',	'0',	'null',	'null',	'null',	'null',	'-32.6',	'0',	'-4.118',	'-32.6',	'14.718',	'0',	'84.6',	'0',	'-30',	'0',	'null',	'null',	'null',	'null',	'-32.6',	'0',	'-4.118',	'-32.6',	'14.718',	'0',	'84.6',	'0',	'-30',	'0',	'null',	'null',	'null',	'null',	'-32.6',	'0',	'-4.118',	'-32.6',	'14.718',	'0',	'84.6',	'0',	'-30',	'0'];
                relative_pos_y = ['null',	'-32.6',	'-4.118',	'0',	'-32.6',	'0',	'-30',	'0',	'84.6',	'0',	'14.718',	'null',	'null',	'null',	'null',	'-32.6',	'-4.118',	'0',	'-32.6',	'0',	'-30',	'0',	'84.6',	'0',	'14.718',	'null',	'null',	'null',	'null',	'-32.6',	'-4.118',	'0',	'-32.6',	'0',	'-30',	'0',	'84.6',	'0',	'14.718',	'null',	'null',	'null',	'null',	'-32.6',	'-4.118',	'0',	'-32.6',	'0',	'-30',	'0',	'84.6',	'0',	'14.718',	'null',	'null',	'null',	'null',	'-32.6',	'-4.118',	'0',	'-32.6',	'0',	'-30',	'0',	'0.5',	'0',	'-0.5',	'0',	'0.5',	'0',	'-0.5',	'0',	'12.985',	'0',	'0.714',	'0',	'70.901',	'0',	'14.718',	'null',	'null',	'null',	'null',	'-32.6',	'-4.118',	'0',	'-32.6',	'0',	'-30',	'0',	'0.5',	'0',	'-0.5',	'0',	'0.5',	'0',	'-0.5',	'0',	'12.985',	'0',	'0.714',	'0',	'70.901',	'0',	'14.718',	'null',	'null',	'null',	'null',	'-32.6',	'-4.118',	'0',	'-32.6',	'0',	'-30',	'0',	'0.5',	'0',	'-0.5',	'0',	'0.5',	'0',	'-0.5',	'0',	'12.985',	'0',	'0.714',	'0',	'70.901',	'0',	'14.718',	'null',	'null',	'null',	'null',	'-32.6',	'-4.118',	'0',	'-32.6',	'0',	'-30',	'0',	'0.5',	'0',	'-0.5',	'0',	'0.5',	'0',	'-0.5',	'0',	'12.985',	'0',	'0.714',	'0',	'70.901',	'0',	'14.718',	'null',	'null',	'null',	'null',	'-32.6',	'-4.118',	'0',	'-32.6',	'0',	'-30',	'0',	'0.5',	'0',	'-0.5',	'0',	'0.5',	'0',	'-0.5',	'0',	'12.985',	'0',	'0.714',	'0',	'70.901',	'0',	'14.718',	'null',	'null',	'null',	'null',	'-32.6',	'-4.118',	'0',	'-32.6',	'0',	'-30',	'0',	'0.5',	'0',	'-0.5',	'0',	'0.5',	'0',	'-0.5',	'0',	'12.985',	'0',	'0.714',	'0',	'70.901',	'0',	'14.718',	'null',	'null',	'null',	'null',	'-32.6',	'-4.118',	'0',	'-32.6',	'0',	'-30',	'0',	'0.5',	'0',	'-0.5',	'0',	'12.985',	'0',	'0.714',	'0',	'70.901',	'0',	'14.718',	'null',	'null',	'null',	'null',	'-32.6',	'-4.118',	'0',	'-32.6',	'0',	'-30',	'0',	'0.5',	'0',	'-0.5',	'0',	'12.985',	'0',	'0.714',	'0',	'70.901',	'0',	'14.718',	'null',	'null',	'null',	'null',	'-32.6',	'-4.118',	'0',	'-32.6',	'0',	'-30',	'0',	'0.5',	'0',	'-0.5',	'0',	'12.933',	'-0.001',	'0.819',	'0.001',	'70.848',	'0',	'14.718',	'null',	'null',	'null',	'null',	'-32.6',	'-4.118',	'0',	'-32.6',	'0',	'-30',	'0',	'0.5',	'0',	'-0.5',	'0',	'12.81',	'-0.001',	'1.065',	'0.001',	'70.725',	'0',	'14.718',	'null',	'null',	'null',	'null',	'-32.6',	'-4.118',	'0',	'-32.6',	'0',	'-30',	'0',	'0.5',	'0',	'-0.5',	'0',	'12.688',	'-0.001',	'1.309',	'0.001',	'70.603',	'0',	'14.718',	'null',	'null',	'null',	'null',	'-32.6',	'-4.118',	'0',	'-32.6',	'0',	'-30',	'0',	'0.5',	'0',	'-0.5',	'0',	'12.566',	'-0.001',	'0.76',	'-0.001',	'0.033',	'0.001',	'0.76',	'0.001',	'70.481',	'0',	'14.718',	'null',	'null',	'null',	'null',	'-32.6',	'-4.118',	'0',	'-32.6',	'0',	'-30',	'0',	'0.5',	'0',	'-0.5',	'0',	'0.5',	'0',	'-0.5',	'0',	'12.444',	'-0.001',	'0.76',	'-0.001',	'0.278',	'0.001',	'0.759',	'0.001',	'70.359',	'0',	'14.718',	'null',	'null',	'null',	'null',	'-32.6',	'-4.118',	'0',	'-32.6',	'0',	'-30',	'0',	'0.5',	'0',	'-0.5',	'0',	'0.5',	'0',	'-0.5',	'0',	'12.322',	'-0.001',	'0.76',	'-0.001',	'0.522',	'0.001',	'0.759',	'0.001',	'70.237',	'0',	'14.718',	'null',	'null',	'null',	'null',	'-32.6',	'-4.118',	'0',	'-32.6',	'0',	'-30',	'0',	'0.5',	'0',	'-0.5',	'0',	'0.5',	'0',	'-0.5',	'0',	'12.199',	'-0.001',	'0.76',	'-0.001',	'0.767',	'0.001',	'0.76',	'0.001',	'70.114',	'0',	'14.718',	'null',	'null',	'null',	'null',	'-32.6',	'-4.118',	'0',	'-32.6',	'0',	'-30',	'0',	'0.5',	'0',	'-0.5',	'0',	'0.5',	'0',	'-0.5',	'0',	'12.077',	'-0.001',	'0.76',	'-0.001',	'1.012',	'0.001',	'0.759',	'0.001',	'69.992',	'0',	'14.718',	'null',	'null',	'null',	'null',	'-32.6',	'-4.118',	'0',	'-32.6',	'0',	'-30',	'0',	'0.5',	'0',	'-0.5',	'0',	'0.5',	'0',	'-0.5',	'0',	'11.955',	'-0.001',	'0.76',	'-0.001',	'1.256',	'0.001',	'0.759',	'0.001',	'69.87',	'0',	'14.718',	'null',	'null',	'null',	'null',	'-32.6',	'-4.118',	'0',	'-32.6',	'0',	'-30',	'0',	'84.6',	'0',	'14.718',	'null',	'null',	'null',	'null',	'-32.6',	'-4.118',	'0',	'-32.6',	'0',	'-30',	'0',	'84.6',	'0',	'14.718',	'null',	'null',	'null',	'null',	'-32.6',	'-4.118',	'0',	'-32.6',	'0',	'-30',	'0',	'84.6',	'0',	'14.718',	'null',	'null',	'null',	'null',	'-32.6',	'-4.118',	'0',	'-32.6',	'0',	'-30',	'0',	'84.6',	'0',	'14.718'];
                relative_pos_z = ['null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'0.2',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'0.2',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'0.2',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'0.2',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'0.2',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'0.2',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'0.2',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'0.2',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'0.2',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'0.2',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'0.2',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'0.2',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'0.2',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'0.2',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'0.2',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'0.2',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'0.2',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'0.2',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'0.2',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'0.2',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'0.2',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'0.2',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'0.2',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'0.2',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null'];
            }
            if (nozzle_size === 0.6) {
                GStatus = ['null',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'null',	'G1',	'G0',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'null',	'G1',	'G0',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'null',	'G1',	'G0',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'null',	'G1',	'G0',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'null',	'G1',	'G0',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'null',	'G1',	'G0',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'null',	'G1',	'G0',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'null',	'G1',	'G0',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'null',	'G1',	'G0',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'null',	'G1',	'G0',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'null',	'G1',	'G0',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'null',	'G1',	'G0',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'null',	'G1',	'G0',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'null',	'G1',	'G0',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'null',	'G1',	'G0',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1'];
                EStatus = ['null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'retract',	'null',	'extrude',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'retract',	'null',	'extrude',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'retract',	'null',	'extrude',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'retract',	'null',	'extrude',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'retract',	'null',	'extrude',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'retract',	'null',	'extrude',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'retract',	'null',	'extrude',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'retract',	'null',	'extrude',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'retract',	'null',	'extrude',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'retract',	'null',	'extrude',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'retract',	'null',	'extrude',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'retract',	'null',	'extrude',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'retract',	'null',	'extrude',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'retract',	'null',	'extrude',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'retract',	'null',	'extrude',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null'];
                layerStatus = ['LAYER',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'LAYER',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'LAYER',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'LAYER',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'LAYER',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'LAYER',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'LAYER',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'LAYER',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'LAYER',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'LAYER',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'LAYER',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'LAYER',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'LAYER',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'LAYER',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'LAYER',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'LAYER',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null'];
                relative_pos_x = ['null',	'-32.4',	'0',	'-4.176',	'-32.4',	'14.576',	'0',	'84.4',	'0',	'-30',	'0',	'null',	'null',	'null',	'null',	'-32.4',	'0',	'-4.176',	'-32.4',	'14.576',	'0',	'84.4',	'0',	'-30',	'0',	'null',	'null',	'null',	'null',	'-32.4',	'0',	'-4.176',	'-32.4',	'14.576',	'0',	'69.557',	'0.002',	'0.962',	'0',	'1.32',	'0',	'0.962',	'0',	'11.597',	'0',	'-0.5',	'0',	'0.5',	'0',	'-30',	'0',	'null',	'null',	'null',	'null',	'-32.4',	'0',	'-4.176',	'-32.4',	'14.576',	'0',	'69.75',	'0.001',	'0.96',	'0.001',	'0.937',	'0',	'0.964',	'-0.001',	'11.788',	'0',	'-0.5',	'0',	'0.5',	'0',	'-30',	'0',	'null',	'null',	'null',	'null',	'-32.4',	'0',	'-4.176',	'-32.4',	'14.576',	'0',	'69.942',	'0.001',	'0.96',	'0.001',	'0.553',	'0',	'0.964',	'-0.001',	'11.98',	'0',	'-0.5',	'0',	'0.5',	'0',	'-30',	'0',	'null',	'null',	'null',	'null',	'-32.4',	'0',	'-4.176',	'-32.4',	'14.576',	'0',	'70.134',	'0.001',	'0.96',	'0.001',	'0.169',	'0',	'0.964',	'-0.001',	'12.172',	'0',	'-0.5',	'0',	'0.5',	'0',	'-30',	'0',	'null',	'null',	'null',	'null',	'-32.4',	'0',	'-4.176',	'-32.4',	'14.576',	'0',	'70.326',	'0.001',	'1.711',	'-0.001',	'12.363',	'0',	'-0.5',	'0',	'0.5',	'0',	'-30',	'0',	'null',	'null',	'null',	'null',	'-32.4',	'0',	'-4.176',	'-32.4',	'14.576',	'0',	'70.518',	'0.001',	'1.327',	'-0.001',	'12.555',	'0',	'-0.5',	'0',	'0.5',	'0',	'-30',	'0',	'null',	'null',	'null',	'null',	'-32.4',	'0',	'-4.176',	'-32.4',	'14.576',	'0',	'70.69',	'0',	'0.98',	'0.001',	'12.729',	'0',	'-0.5',	'0',	'0.5',	'0',	'-30',	'0',	'null',	'null',	'null',	'null',	'-32.4',	'0',	'-4.176',	'-32.4',	'14.576',	'0',	'70.498',	'0',	'1.364',	'0.001',	'12.537',	'0',	'-0.5',	'0',	'0.5',	'0',	'-30',	'0',	'null',	'null',	'null',	'null',	'-32.4',	'0',	'-4.176',	'-32.4',	'14.576',	'0',	'70.306',	'0',	'1.748',	'0.001',	'12.345',	'0',	'-0.5',	'0',	'0.5',	'0',	'-30',	'0',	'null',	'null',	'null',	'null',	'-32.4',	'0',	'-4.176',	'-32.4',	'14.576',	'0',	'70.113',	'0',	'0.965',	'-0.001',	'0.209',	'0.001',	'0.96',	'0.001',	'12.152',	'0',	'-0.5',	'0',	'0.5',	'0',	'-0.5',	'0',	'0.5',	'0',	'-30',	'0',	'null',	'null',	'null',	'null',	'-32.4',	'0',	'-4.176',	'-32.4',	'14.576',	'0',	'69.921',	'0',	'0.964',	'-0.001',	'0.594',	'0.001',	'0.96',	'0.001',	'11.96',	'0',	'-0.5',	'0',	'0.5',	'0',	'-0.5',	'0',	'0.5',	'0',	'-30',	'0',	'null',	'null',	'null',	'null',	'-32.4',	'0',	'-4.176',	'-32.4',	'14.576',	'0',	'69.729',	'0',	'0.964',	'-0.001',	'0.978',	'0.001',	'0.96',	'0.001',	'11.768',	'0',	'-0.5',	'0',	'0.5',	'0',	'-0.5',	'0',	'0.5',	'0',	'-30',	'0',	'null',	'null',	'null',	'null',	'-32.4',	'0',	'-4.176',	'-32.4',	'14.576',	'0',	'84.4',	'0',	'-30',	'0',	'null',	'null',	'null',	'null',	'-32.4',	'0',	'-4.176',	'-32.4',	'14.576',	'0',	'84.4',	'0',	'-30',	'0'];
                relative_pos_y = ['null',	'-32.4',	'-4.176',	'0',	'-32.4',	'0',	'-30',	'0',	'84.4',	'0',	'14.576',	'null',	'null',	'null',	'null',	'-32.4',	'-4.176',	'0',	'-32.4',	'0',	'-30',	'0',	'84.4',	'0',	'14.576',	'null',	'null',	'null',	'null',	'-32.4',	'-4.176',	'0',	'-32.4',	'0',	'-30',	'0',	'0.5',	'0',	'-0.5',	'0',	'0.5',	'0',	'-0.5',	'0',	'12.785',	'0',	'0.912',	'0.001',	'70.702',	'0',	'14.576',	'null',	'null',	'null',	'null',	'-32.4',	'-4.176',	'0',	'-32.4',	'0',	'-30',	'0',	'0.5',	'0',	'-0.5',	'0',	'0.5',	'0',	'-0.5',	'0',	'12.785',	'0',	'0.914',	'0',	'70.701',	'0',	'14.576',	'null',	'null',	'null',	'null',	'-32.4',	'-4.176',	'0',	'-32.4',	'0',	'-30',	'0',	'0.5',	'0',	'-0.5',	'0',	'0.5',	'0',	'-0.5',	'0',	'12.785',	'0',	'0.914',	'0',	'70.701',	'0',	'14.576',	'null',	'null',	'null',	'null',	'-32.4',	'-4.176',	'0',	'-32.4',	'0',	'-30',	'0',	'0.5',	'0',	'-0.5',	'0',	'0.5',	'0',	'-0.5',	'0',	'12.785',	'0',	'0.914',	'0',	'70.701',	'0',	'14.576',	'null',	'null',	'null',	'null',	'-32.4',	'-4.176',	'0',	'-32.4',	'0',	'-30',	'0',	'0.5',	'0',	'-0.5',	'0',	'12.785',	'0',	'0.914',	'0',	'70.701',	'0',	'14.576',	'null',	'null',	'null',	'null',	'-32.4',	'-4.176',	'0',	'-32.4',	'0',	'-30',	'0',	'0.5',	'0.001',	'-0.501',	'0',	'12.785',	'0',	'0.914',	'0',	'70.701',	'0',	'14.576',	'null',	'null',	'null',	'null',	'-32.4',	'-4.176',	'0',	'-32.4',	'0',	'-30',	'0',	'0.5',	'0',	'-0.5',	'0',	'12.701',	'-0.001',	'1.081',	'0.001',	'70.618',	'0',	'14.576',	'null',	'null',	'null',	'null',	'-32.4',	'-4.176',	'0',	'-32.4',	'0',	'-30',	'0',	'0.5',	'0',	'-0.5',	'0',	'12.518',	'-0.001',	'1.447',	'0.001',	'70.435',	'0',	'14.576',	'null',	'null',	'null',	'null',	'-32.4',	'-4.176',	'0',	'-32.4',	'0',	'-30',	'0',	'0.5',	'0',	'-0.5',	'0',	'12.334',	'-0.001',	'1.815',	'0.001',	'70.251',	'0',	'14.576',	'null',	'null',	'null',	'null',	'-32.4',	'-4.176',	'0',	'-32.4',	'0',	'-30',	'0',	'0.5',	'0',	'-0.5',	'0',	'0.5',	'0',	'-0.5',	'0',	'12.151',	'-0.001',	'0.962',	'-0.001',	'0.261',	'0.001',	'0.958',	'0.001',	'70.068',	'0',	'14.576',	'null',	'null',	'null',	'null',	'-32.4',	'-4.176',	'0',	'-32.4',	'0',	'-30',	'0',	'0.5',	'0',	'-0.5',	'0',	'0.5',	'0',	'-0.5',	'0',	'11.968',	'-0.001',	'0.962',	'-0.001',	'0.628',	'0.001',	'0.957',	'0.001',	'69.885',	'0',	'14.576',	'null',	'null',	'null',	'null',	'-32.4',	'-4.176',	'0',	'-32.4',	'0',	'-30',	'0',	'0.5',	'0',	'-0.5',	'0',	'0.5',	'0',	'-0.5',	'0',	'11.784',	'-0.001',	'0.962',	'-0.001',	'0.995',	'0.001',	'0.958',	'0.001',	'69.701',	'0',	'14.576',	'null',	'null',	'null',	'null',	'-32.4',	'-4.176',	'0',	'-32.4',	'0',	'-30',	'0',	'84.4',	'0',	'14.576',	'null',	'null',	'null',	'null',	'-32.4',	'-4.176',	'0',	'-32.4',	'0',	'-30',	'0',	'84.4',	'0',	'14.576'];
                relative_pos_z = ['null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'0.3',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'0.3',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'0.3',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'0.3',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'0.3',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'0.3',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'0.3',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'0.3',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'0.3',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'0.3',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'0.3',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'0.3',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'0.3',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'0.3',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'0.3',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null'];
            }
            if (nozzle_size === 0.8) {
                GStatus = ['null',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'null',	'G1',	'G0',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'null',	'G1',	'G0',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'null',	'G1',	'G0',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'null',	'G1',	'G0',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'null',	'G1',	'G0',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'null',	'G1',	'G0',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'null',	'G1',	'G0',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'null',	'G1',	'G0',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'null',	'G1',	'G0',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'null',	'G1',	'G0',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'null',	'G1',	'G0',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1'];
                EStatus = ['null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'retract',	'null',	'extrude',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'retract',	'null',	'extrude',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'retract',	'null',	'extrude',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'retract',	'null',	'extrude',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'retract',	'null',	'extrude',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'retract',	'null',	'extrude',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'retract',	'null',	'extrude',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'retract',	'null',	'extrude',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'retract',	'null',	'extrude',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'retract',	'null',	'extrude',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'retract',	'null',	'extrude',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null'];
                layerStatus = ['LAYER',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'LAYER',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'LAYER',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'LAYER',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'LAYER',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'LAYER',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'LAYER',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'LAYER',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'LAYER',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'LAYER',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'LAYER',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'LAYER',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null'];
                relative_pos_x = ['null',	'-32.2',	'0',	'-4.234',	'-32.2',	'14.434',	'0',	'84.2',	'0',	'-30',	'0',	'null',	'null',	'null',	'null',	'-32.2',	'0',	'-4.234',	'-32.2',	'14.434',	'0',	'84.2',	'0',	'-30',	'0',	'null',	'null',	'null',	'null',	'-32.2',	'0',	'-4.234',	'-32.2',	'14.434',	'0',	'69.518',	'0.001',	'1.16',	'0.001',	'0.801',	'0',	'1.164',	'-0.001',	'11.556',	'0',	'-0.5',	'0',	'0.5',	'0',	'-30',	'0',	'null',	'null',	'null',	'null',	'-32.2',	'0',	'-4.234',	'-32.2',	'14.434',	'0',	'69.774',	'0.001',	'1.16',	'0.001',	'0.289',	'0',	'1.164',	'-0.001',	'11.812',	'0',	'-0.5',	'0',	'0.5',	'0',	'-30',	'0',	'null',	'null',	'null',	'null',	'-32.2',	'0',	'-4.234',	'-32.2',	'14.434',	'0',	'70.03',	'0.001',	'2.102',	'-0.001',	'12.068',	'0',	'-0.5',	'0',	'0.5',	'0',	'-30',	'0',	'null',	'null',	'null',	'null',	'-32.2',	'0',	'-4.234',	'-32.2',	'14.434',	'0',	'70.286',	'0.001',	'1.591',	'-0.001',	'12.323',	'0',	'-0.5',	'0',	'0.5',	'0',	'-30',	'0',	'null',	'null',	'null',	'null',	'-32.2',	'0',	'-4.234',	'-32.2',	'14.434',	'0',	'70.458',	'0',	'1.244',	'0.001',	'12.497',	'0',	'-0.5',	'0',	'0.5',	'0',	'-30',	'0',	'null',	'null',	'null',	'null',	'-32.2',	'0',	'-4.234',	'-32.2',	'14.434',	'0',	'70.202',	'0',	'1.756',	'0.001',	'12.241',	'0',	'-0.5',	'0',	'0.5',	'0',	'-30',	'0',	'null',	'null',	'null',	'null',	'-32.2',	'0',	'-4.234',	'-32.2',	'14.434',	'0',	'69.945',	'0',	'2.27',	'0.001',	'11.984',	'0',	'-0.5',	'0',	'0.5',	'0',	'-30',	'0',	'null',	'null',	'null',	'null',	'-32.2',	'0',	'-4.234',	'-32.2',	'14.434',	'0',	'69.689',	'0',	'1.164',	'-0.001',	'0.458',	'0.001',	'1.16',	'0.001',	'11.728',	'0',	'-0.5',	'0',	'0.5',	'0',	'-0.5',	'0',	'0.5',	'0',	'-30',	'0',	'null',	'null',	'null',	'null',	'-32.2',	'0',	'-4.234',	'-32.2',	'14.434',	'0',	'69.433',	'0',	'1.164',	'-0.001',	'0.97',	'0.001',	'1.16',	'0.001',	'11.472',	'0',	'-0.5',	'0',	'0.5',	'0',	'-0.5',	'0',	'0.5',	'0',	'-30',	'0',	'null',	'null',	'null',	'null',	'-32.2',	'0',	'-4.234',	'-32.2',	'14.434',	'0',	'84.2',	'0',	'-30',	'0'];
                relative_pos_y = ['null',	'-32.2',	'-4.234',	'0',	'-32.2',	'0',	'-30',	'0',	'84.2',	'0',	'14.434',	'null',	'null',	'null',	'null',	'-32.2',	'-4.234',	'0',	'-32.2',	'0',	'-30',	'0',	'84.2',	'0',	'14.434',	'null',	'null',	'null',	'null',	'-32.2',	'-4.234',	'0',	'-32.2',	'0',	'-30',	'0',	'0.5',	'0',	'-0.5',	'0',	'0.5',	'0',	'-0.5',	'0',	'12.585',	'0',	'1.114',	'0',	'70.501',	'0',	'14.434',	'null',	'null',	'null',	'null',	'-32.2',	'-4.234',	'0',	'-32.2',	'0',	'-30',	'0',	'0.5',	'0',	'-0.5',	'0',	'0.5',	'0',	'-0.5',	'0',	'12.585',	'0',	'1.114',	'0',	'70.501',	'0',	'14.434',	'null',	'null',	'null',	'null',	'-32.2',	'-4.234',	'0',	'-32.2',	'0',	'-30',	'0',	'0.5',	'0',	'-0.5',	'0',	'12.585',	'0',	'1.114',	'0',	'70.501',	'0',	'14.434',	'null',	'null',	'null',	'null',	'-32.2',	'-4.234',	'0',	'-32.2',	'0',	'-30',	'0',	'0.5',	'0',	'-0.5',	'0',	'12.585',	'0',	'1.114',	'0',	'70.501',	'0',	'14.434',	'null',	'null',	'null',	'null',	'-32.2',	'-4.234',	'0',	'-32.2',	'0',	'-30',	'0',	'0.5',	'0',	'-0.5',	'0',	'12.471',	'-0.001',	'1.341',	'0.001',	'70.388',	'0',	'14.434',	'null',	'null',	'null',	'null',	'-32.2',	'-4.234',	'0',	'-32.2',	'0',	'-30',	'0',	'0.5',	'0',	'-0.5',	'0',	'12.226',	'-0.001',	'1.831',	'0.001',	'70.143',	'0',	'14.434',	'null',	'null',	'null',	'null',	'-32.2',	'-4.234',	'0',	'-32.2',	'0',	'-30',	'0',	'0.5',	'0',	'-0.5',	'0',	'11.982',	'-0.001',	'2.319',	'0.001',	'69.899',	'0',	'14.434',	'null',	'null',	'null',	'null',	'-32.2',	'-4.234',	'0',	'-32.2',	'0',	'-30',	'0',	'0.5',	'0',	'-0.5',	'0',	'0.5',	'0',	'-0.5',	'0',	'11.737',	'-0.001',	'1.162',	'-0.001',	'0.489',	'0.001',	'1.158',	'0.001',	'69.654',	'0',	'14.434',	'null',	'null',	'null',	'null',	'-32.2',	'-4.234',	'0',	'-32.2',	'0',	'-30',	'0',	'0.5',	'0',	'-0.5',	'0',	'0.5',	'0',	'-0.5',	'0',	'11.493',	'-0.001',	'1.162',	'-0.001',	'0.978',	'0.001',	'1.157',	'0.001',	'69.41',	'0',	'14.434',	'null',	'null',	'null',	'null',	'-32.2',	'-4.234',	'0',	'-32.2',	'0',	'-30',	'0',	'84.2',	'0',	'14.434'];
                relative_pos_z = ['null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'0.4',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'0.4',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'0.4',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'0.4',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'0.4',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'0.4',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'0.4',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'0.4',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'0.4',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'0.4',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'0.4',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null'];
            }
            if (nozzle_size === 1.0) {
                GStatus = ['null',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'null',	'G0',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'null',	'G0',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'null',	'G0',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'null',	'G0',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'null',	'G0',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'null',	'G0',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'null',	'G0',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'null',	'G0',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'null',	'G0',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1'];
                EStatus = ['null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null'];
                layerStatus = ['LAYER',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'LAYER',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'LAYER',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'LAYER',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'LAYER',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'LAYER',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'LAYER',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'LAYER',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'LAYER',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'LAYER',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null'];
                relative_pos_x = ['null',	'0',	'0',	'0',	'-0.853',	'-31.147',	'0',	'-4.292',	'-31.147',	'-0.853',	'1.206',	'0.001',	'13.085',	'0',	'84',	'0',	'-30',	'null',	'0',	'0',	'0',	'0',	'-0.853',	'-31.147',	'0',	'-4.292',	'-31.147',	'-0.853',	'1.206',	'0.001',	'13.085',	'0',	'69.158',	'0.002',	'1.361',	'0',	'0.92',	'0',	'1.362',	'0',	'11.197',	'0',	'-0.5',	'0',	'0.5',	'0',	'-30',	'null',	'0',	'0',	'0',	'0',	'-0.853',	'-31.147',	'0',	'-4.292',	'-31.147',	'-0.853',	'1.206',	'0.001',	'13.085',	'0',	'69.478',	'0.001',	'1.36',	'0.001',	'0.281',	'0',	'1.364',	'-0.001',	'11.516',	'0',	'-0.5',	'0',	'0.5',	'0',	'-30',	'null',	'0',	'0',	'0',	'0',	'-0.853',	'-31.147',	'0',	'-4.292',	'-31.147',	'-0.853',	'1.206',	'0.001',	'13.085',	'0',	'69.798',	'0.001',	'2.366',	'-0.001',	'11.836',	'0',	'-0.5',	'0',	'0.5',	'0',	'-30',	'null',	'0',	'0',	'0',	'0',	'-0.853',	'-31.147',	'0',	'-4.292',	'-31.147',	'-0.853',	'1.206',	'0.001',	'13.085',	'0',	'70.118',	'0.001',	'1.727',	'-0.001',	'12.155',	'0',	'-0.5',	'0',	'0.5',	'0',	'-30',	'null',	'0',	'0',	'0',	'0',	'-0.853',	'-31.147',	'0',	'-4.292',	'-31.147',	'-0.853',	'1.206',	'0.001',	'13.085',	'0',	'70.162',	'0',	'1.636',	'0.001',	'12.201',	'0',	'-0.501',	'0.001',	'0.5',	'0',	'-30',	'null',	'0',	'0',	'0',	'0',	'-0.853',	'-31.147',	'0',	'-4.292',	'-31.147',	'-0.853',	'1.206',	'0.001',	'13.085',	'0',	'69.841',	'0',	'2.278',	'0.001',	'11.88',	'0',	'-0.5',	'0',	'0.5',	'0',	'-30',	'null',	'0',	'0',	'0',	'0',	'-0.853',	'-31.147',	'0',	'-4.292',	'-31.147',	'-0.853',	'1.206',	'0.001',	'13.085',	'0',	'69.521',	'0',	'1.364',	'-0.001',	'0.194',	'0.001',	'1.36',	'0.001',	'11.56',	'0',	'-0.5',	'0',	'0.5',	'0',	'-0.5',	'0',	'0.5',	'0',	'-30',	'null',	'0',	'0',	'0',	'0',	'-0.853',	'-31.147',	'0',	'-4.292',	'-31.147',	'-0.853',	'1.206',	'0.001',	'13.085',	'0',	'84',	'0',	'-30',	'null',	'0',	'0',	'0',	'0',	'-0.853',	'-31.147',	'0',	'-4.292',	'-31.147',	'-0.853',	'1.206',	'0.001',	'13.085',	'0',	'84',	'0',	'-30'];
                relative_pos_y = ['null',	'13.085',	'0.001',	'1.206',	'-0.853',	'-31.147',	'-4.292',	'0',	'-31.147',	'-0.853',	'0',	'0',	'0',	'-30',	'0',	'84',	'0',	'null',	'0',	'13.085',	'0.001',	'1.206',	'-0.853',	'-31.147',	'-4.292',	'0',	'-31.147',	'-0.853',	'0',	'0',	'0',	'-30',	'0',	'0.5',	'0',	'-0.5',	'0',	'0.5',	'0',	'-0.5',	'0',	'12.385',	'0',	'1.312',	'0.001',	'70.302',	'0',	'null',	'0',	'13.085',	'0.001',	'1.206',	'-0.853',	'-31.147',	'-4.292',	'0',	'-31.147',	'-0.853',	'0',	'0',	'0',	'-30',	'0',	'0.5',	'0',	'-0.5',	'0',	'0.5',	'0',	'-0.5',	'0',	'12.385',	'0',	'1.314',	'0',	'70.301',	'0',	'null',	'0',	'13.085',	'0.001',	'1.206',	'-0.853',	'-31.147',	'-4.292',	'0',	'-31.147',	'-0.853',	'0',	'0',	'0',	'-30',	'0',	'0.5',	'0',	'-0.5',	'0',	'12.385',	'0',	'1.314',	'0',	'70.301',	'0',	'null',	'0',	'13.085',	'0.001',	'1.206',	'-0.853',	'-31.147',	'-4.292',	'0',	'-31.147',	'-0.853',	'0',	'0',	'0',	'-30',	'0',	'0.5',	'0.001',	'-0.501',	'0',	'12.385',	'0',	'1.314',	'0',	'70.301',	'0',	'null',	'0',	'13.085',	'0.001',	'1.206',	'-0.853',	'-31.147',	'-4.292',	'0',	'-31.147',	'-0.853',	'0',	'0',	'0',	'-30',	'0',	'0.5',	'0',	'-0.5',	'0',	'12.179',	'-0.001',	'1.725',	'0.001',	'70.096',	'0',	'null',	'0',	'13.085',	'0.001',	'1.206',	'-0.853',	'-31.147',	'-4.292',	'0',	'-31.147',	'-0.853',	'0',	'0',	'0',	'-30',	'0',	'0.5',	'0',	'-0.5',	'0',	'11.873',	'-0.001',	'2.337',	'0.001',	'69.79',	'0',	'null',	'0',	'13.085',	'0.001',	'1.206',	'-0.853',	'-31.147',	'-4.292',	'0',	'-31.147',	'-0.853',	'0',	'0',	'0',	'-30',	'0',	'0.5',	'0',	'-0.5',	'0',	'0.5',	'0',	'-0.5',	'0',	'11.568',	'-0.001',	'1.362',	'-0.001',	'0.228',	'0.001',	'1.357',	'0.001',	'69.485',	'0',	'null',	'0',	'13.085',	'0.001',	'1.206',	'-0.853',	'-31.147',	'-4.292',	'0',	'-31.147',	'-0.853',	'0',	'0',	'0',	'-30',	'0',	'84',	'0',	'null',	'0',	'13.085',	'0.001',	'1.206',	'-0.853',	'-31.147',	'-4.292',	'0',	'-31.147',	'-0.853',	'0',	'0',	'0',	'-30',	'0',	'84',	'0'];
                relative_pos_z = ['null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'0.5',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'0.5',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'0.5',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'0.5',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'0.5',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'0.5',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'0.5',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'0.5',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'0.5',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null'];
            }
            if (nozzle_size === 1.2) {
                GStatus = ['null',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G0',	'G1',	'G0',	'G0',	'null',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G0',	'G1',	'G0',	'G0',	'null',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G0',	'G1',	'G0',	'G0',	'null',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G0',	'G1',	'G0',	'G0',	'null',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G0',	'G1',	'G0',	'G0',	'null',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G0',	'G1',	'G0',	'G0',	'null',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G0',	'G1',	'G0',	'G0',	'null',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1',	'G1'];
                EStatus = ['null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'retract',	'null',	'null',	'null',	'extrude',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'retract',	'null',	'null',	'null',	'extrude',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'retract',	'null',	'null',	'null',	'extrude',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'retract',	'null',	'null',	'null',	'extrude',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'retract',	'null',	'null',	'null',	'extrude',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'retract',	'null',	'null',	'null',	'extrude',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'retract',	'null',	'null',	'null',	'extrude',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null'];
                layerStatus = ['LAYER',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'LAYER',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'LAYER',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'LAYER',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'LAYER',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'LAYER',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'LAYER',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'LAYER',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null'];
                relative_pos_x = ['null',	'0',	'0',	'0',	'-1.023',	'-30.777',	'0',	'-4.352',	'-30.777',	'-1.023',	'1.446',	'0.002',	'12.704',	'0',	'83.8',	'0',	'-30',	'0',	'null',	'0',	'0',	'null',	'null',	'null',	'0',	'0',	'-1.023',	'-30.777',	'0',	'-4.352',	'-30.777',	'-1.023',	'1.446',	'0.002',	'12.704',	'0',	'69.054',	'0.001',	'1.56',	'0.001',	'0.529',	'0',	'1.564',	'-0.001',	'11.092',	'0',	'-0.5',	'0',	'0.5',	'0',	'-30',	'0',	'null',	'0',	'0',	'null',	'null',	'null',	'0',	'0',	'-1.023',	'-30.777',	'0',	'-4.352',	'-30.777',	'-1.023',	'1.446',	'0.002',	'12.704',	'0',	'69.438',	'0.001',	'2.886',	'-0.001',	'11.476',	'0',	'-0.5',	'0',	'0.5',	'0',	'-30',	'0',	'null',	'0',	'0',	'null',	'null',	'null',	'0',	'0',	'-1.023',	'-30.777',	'0',	'-4.352',	'-30.777',	'-1.023',	'1.446',	'0.002',	'12.704',	'0',	'69.822',	'0.001',	'2.119',	'-0.001',	'11.859',	'0',	'-0.5',	'0',	'0.5',	'0',	'-30',	'0',	'null',	'0',	'0',	'null',	'null',	'null',	'0',	'0',	'-1.023',	'-30.777',	'0',	'-4.352',	'-30.777',	'-1.023',	'1.446',	'0.002',	'12.704',	'0',	'69.994',	'0',	'1.772',	'0.001',	'12.033',	'0',	'-0.5',	'0',	'0.5',	'0',	'-30',	'0',	'null',	'0',	'0',	'null',	'null',	'null',	'0',	'0',	'-1.023',	'-30.777',	'0',	'-4.352',	'-30.777',	'-1.023',	'1.446',	'0.002',	'12.704',	'0',	'69.609',	'0',	'2.542',	'0.001',	'11.648',	'0',	'-0.5',	'0',	'0.5',	'0',	'-30',	'0',	'null',	'0',	'0',	'null',	'null',	'null',	'0',	'0',	'-1.023',	'-30.777',	'0',	'-4.352',	'-30.777',	'-1.023',	'1.446',	'0.002',	'12.704',	'0',	'69.225',	'0',	'1.564',	'-0.001',	'0.186',	'0.001',	'1.56',	'0.001',	'11.264',	'0',	'-0.5',	'0',	'0.5',	'0',	'-0.5',	'0',	'0.5',	'0',	'-30',	'0',	'null',	'0',	'0',	'null',	'null',	'null',	'0',	'0',	'-1.023',	'-30.777',	'0',	'-4.352',	'-30.777',	'-1.023',	'1.446',	'0.002',	'12.704',	'0',	'83.8',	'0',	'-30'];
                relative_pos_y = ['null',	'12.704',	'0.002',	'1.446',	'-1.023',	'-30.777',	'-4.352',	'0',	'-30.777',	'-1.023',	'0',	'0',	'0',	'-30',	'0',	'83.8',	'0',	'0.6',	'null',	'0',	'-0.6',	'null',	'null',	'null',	'0.002',	'1.446',	'-1.023',	'-30.777',	'-4.352',	'0',	'-30.777',	'-1.023',	'0',	'0',	'0',	'-30',	'0',	'0.5',	'0',	'-0.5',	'0',	'0.5',	'0',	'-0.5',	'0',	'12.185',	'0',	'1.514',	'0',	'70.101',	'0',	'0.6',	'null',	'0',	'-0.6',	'null',	'null',	'null',	'0.002',	'1.446',	'-1.023',	'-30.777',	'-4.352',	'0',	'-30.777',	'-1.023',	'0',	'0',	'0',	'-30',	'0',	'0.5',	'0',	'-0.5',	'0',	'12.185',	'0',	'1.514',	'0',	'70.101',	'0',	'0.6',	'null',	'0',	'-0.6',	'null',	'null',	'null',	'0.002',	'1.446',	'-1.023',	'-30.777',	'-4.352',	'0',	'-30.777',	'-1.023',	'0',	'0',	'0',	'-30',	'0',	'0.5',	'0',	'-0.5',	'0',	'12.185',	'0',	'1.514',	'0',	'70.101',	'0',	'0.6',	'null',	'0',	'-0.6',	'null',	'null',	'null',	'0.002',	'1.446',	'-1.023',	'-30.777',	'-4.352',	'0',	'-30.777',	'-1.023',	'0',	'0',	'0',	'-30',	'0',	'0.5',	'0',	'-0.5',	'0',	'12.009',	'-0.001',	'1.865',	'0.001',	'69.926',	'0',	'0.6',	'null',	'0',	'-0.6',	'null',	'null',	'null',	'0.002',	'1.446',	'-1.023',	'-30.777',	'-4.352',	'0',	'-30.777',	'-1.023',	'0',	'0',	'0',	'-30',	'0',	'0.5',	'0',	'-0.5',	'0',	'11.643',	'-0.001',	'2.597',	'0.001',	'69.56',	'0',	'0.6',	'null',	'0',	'-0.6',	'null',	'null',	'null',	'0.002',	'1.446',	'-1.023',	'-30.777',	'-4.352',	'0',	'-30.777',	'-1.023',	'0',	'0',	'0',	'-30',	'0',	'0.5',	'0',	'-0.5',	'0',	'0.5',	'0',	'-0.5',	'0',	'11.276',	'-0.001',	'1.562',	'-0.001',	'0.212',	'0.001',	'1.557',	'0.001',	'69.193',	'0',	'0.6',	'null',	'0',	'-0.6',	'null',	'null',	'null',	'0.002',	'1.446',	'-1.023',	'-30.777',	'-4.352',	'0',	'-30.777',	'-1.023',	'0',	'0',	'0',	'-30',	'0',	'83.8',	'0'];
                relative_pos_z = ['null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'0.6',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'0.6',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'0.6',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'0.6',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'0.6',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'0.6',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'0.6',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null',	'null'];
            }
        }
    }

    OCTOPRINT_VIEWMODELS.push({
        construct: calibrationcompanionViewModel_acceleration,
        dependencies: [  "settingsViewModel", "calibrationcompanionViewModel"  ],
        elements: [ "#acceleration-calibrationcompanion" ]
    });
});
