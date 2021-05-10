$(function() {

    function calibrationcompanionViewModel_firstlayer(parameters) {
        var self = this;

        self.settingsViewModel = parameters[0];
        self.calibrationcompanionViewModel = parameters[1];
        self.controlViewModel = parameters[2];

        let mainViewModel = self.calibrationcompanionViewModel;

        self.profile_selection_square = ko.observable();
        self.extra_margin = ko.observable();
        self.regular_nozzle_square = ko.observable();
        self.regular_bed_square = ko.observable();
        self.fan_speed_square = ko.observable();
        self.first_layer_speed_square = ko.observable();
        self.regular_speed_square = ko.observable();
        self.travel_speed_square = ko.observable();
        self.retraction_dist_square = ko.observable();
        self.retraction_speed_square = ko.observable();
        self.flow_square = ko.observable();
        self.abl_method_square = ko.observable();
        self.start_gcode_square = ko.observable();
        self.end_gcode_square = ko.observable();

        self.onBeforeBinding = function() {
            self.profile_selection_square(self.settingsViewModel.settings.plugins.calibrationcompanion.profile_selection_square());
            self.extra_margin(self.settingsViewModel.settings.plugins.calibrationcompanion.extra_margin());
            self.regular_nozzle_square(self.settingsViewModel.settings.plugins.calibrationcompanion.regular_nozzle_square());
            self.regular_bed_square(self.settingsViewModel.settings.plugins.calibrationcompanion.regular_bed_square());
            self.fan_speed_square(self.settingsViewModel.settings.plugins.calibrationcompanion.fan_speed_square());
            self.regular_speed_square(self.settingsViewModel.settings.plugins.calibrationcompanion.regular_speed_square());
            self.travel_speed_square(self.settingsViewModel.settings.plugins.calibrationcompanion.travel_speed_square());
            self.retraction_dist_square(self.settingsViewModel.settings.plugins.calibrationcompanion.retraction_dist_square());
            self.retraction_speed_square(self.settingsViewModel.settings.plugins.calibrationcompanion.retraction_speed_square());
            self.flow_square(self.settingsViewModel.settings.plugins.calibrationcompanion.flow_square());
            self.abl_method_square(self.settingsViewModel.settings.plugins.calibrationcompanion.abl_method_square());
            self.start_gcode_square(self.settingsViewModel.settings.plugins.calibrationcompanion.start_gcode_square());
            self.end_gcode_square(self.settingsViewModel.settings.plugins.calibrationcompanion.end_gcode_square());
        }

        self.onAfterBinding = function() {
            mainViewModel.resetProcedure();
            //console.log(mainViewModel.bed_center_x + " " + mainViewModel.bed_center_y)
        }

        let restrictedInputsSquare = ["#extra-margin", "#regular-nozzle-square", "#regular-bed-square", "#fan-speed-square",
            "#regular-speed-square", "#travel-speed-square", "#retraction-dist-square", "#retraction-speed-square", "#flow-square", "#abl-method-square", "#start-gcode-square"];
        let saveInputsSquare = ["extra_margin", "regular_nozzle_square", "regular_bed_square", "fan_speed_square",
            "regular_speed_square", "travel_speed_square", "retraction_dist_square", "retraction_speed_square", "flow_square", "abl_method_square", "start_gcode_square"];

        $(restrictedInputsSquare.join(",")).on("input", function() {
            let saveSettingsTemp = saveInputsSquare[restrictedInputsSquare.indexOf('#' + this.id)]
            OctoPrint.settings.savePluginSettings('calibrationcompanion', {
                [saveSettingsTemp]: this.value})
        });

        let restrictedInputsProfile = ["abl-method-square", "end-gcode-square", "novalue", "fan-speed-square", "novalue",
            "novalue", "flow-square", "regular-bed-square", "regular-nozzle-square", "regular-speed-square", "retraction-dist-square",
            "retraction-speed-square", "start-gcode-square", "travel-speed-square"];
        let restrictedSettingsProfile = ["abl_method", "end_gcode", "novalue", "fan_speed", "novalue",
            "novalue", "flow", "regular_bed", "regular_nozzle", "regular_speed", "retraction_dist",
            "retraction_speed", "start_gcode", "travel_speed"];
        let saveSettingsProfile, saveSettingsTextbox;

        document.getElementById("load-profile-square").onclick = function() {
            OctoPrint.settings.getPluginSettings('calibrationcompanion').done(function (response) {
                let z = 0;
                for (let x=0; x< Object.keys(response).length; x++) {
                    if (self.profile_selection_square()!=="" && restrictedSettingsProfile[z]!==undefined && Object.keys(response)[x].includes(self.profile_selection_square()) && restrictedSettingsProfile[z]!=="novalue") {
                        saveSettingsProfile = restrictedSettingsProfile[z] + "_" + self.profile_selection_square();
                        saveSettingsTextbox = restrictedSettingsProfile[z] + "_square";
                        document.getElementById(restrictedInputsProfile[z]).value = Object.values(response)[x];
                        OctoPrint.settings.savePluginSettings('calibrationcompanion', {[saveSettingsTextbox]: Object.values(response)[x]});
                        z++;
                    } else if (self.profile_selection_square()!=="" && restrictedSettingsProfile[z]!==undefined && Object.keys(response)[x].includes(self.profile_selection_square()) && restrictedSettingsProfile[z] === "novalue") {
                        saveSettingsProfile = restrictedSettingsProfile[z] + "_" + self.profile_selection_square();
                        z++;
                    }
                }
            });
        }

        let extra_margin, filename

        $('#knob, #step2').on("click", function() {
            extra_margin = document.getElementById("extra-margin").value;
            filename = "knob_levelling";
            gcode_generated =
                "; Bed leveling Ender 3 by ingenioso3D\n" +
                "; Modified by elproducts CHEP FilamentFriday.com\n" +
                "; Modified for the Octoprint Calibration Companion plugin purpose\n" +
                "G90\n" +
                "G28 ; Home all axis\n" +
                "G0 Z1 F2000\n" +
                "\n" +
                "G0 Z5 ; Lift Z axis\n" +
                "G0 X" + extra_margin + " Y" + extra_margin + " F1000; Move to Position 1\n" +
                "G0 Z0.1\n" +
                "M0 ; Pause print\n" +
                "G0 Z10 ; Lift Z axis\n" +
                "G0 X" + extra_margin + " Y" + (mainViewModel.variable.bed_size_y - extra_margin) + " ; Move to Position 2\n" +
                "G0 Z0.1\n" +
                "M0 ; Pause print\n" +
                "G0 Z5 ; Lift Z axis\n" +
                "G0 X" + (mainViewModel.variable.bed_size_y - extra_margin) + " Y" + (mainViewModel.variable.bed_size_y - extra_margin) + " ; Move to Position 3\n" +
                "G0 Z0.1\n" +
                "M0 ; Pause print\n" +
                "G0 Z5 ; Lift Z axis\n" +
                "G0 X" + (mainViewModel.variable.bed_size_y - extra_margin) + " Y" + extra_margin + " ; Move to Position 4\n" +
                "G0 Z0.1\n" +
                "M0 ; Pause print\n" +
                "G0 Z5 ; Lift Z axis\n" +
                "G0 X" + mainViewModel.bed_center_x + " Y" + mainViewModel.bed_center_y + " ; Move to Position 5\n" +
                "G0 Z0.1\n" +
                "M0 ; Pause print\n" +
                "G0 Z5 ; Lift Z axis\n" +
                "G0 X" + extra_margin + " Y" + (mainViewModel.variable.bed_size_y- extra_margin) + " ; Move to Position 2\n" +
                "G0 Z0.1\n" +
                "M0 ; Pause print\n" +
                "G0 Z5 ; Lift Z axis\n" +
                "G0 X" + (mainViewModel.variable.bed_size_y - extra_margin) + " Y" + (mainViewModel.variable.bed_size_y - extra_margin) + " ; Move to Position 3\n" +
                "G0 Z0.1\n" +
                "M0 ; Pause print\n" +
                "G0 Z5 ; Lift Z axis\n" +
                "G0 X" + (mainViewModel.variable.bed_size_y - extra_margin) + " Y" + extra_margin + " ; Move to Position 4\n" +
                "G0 Z0.1\n" +
                "M0 ; Pause print\n" +
                "G0 Z5 ; Lift Z axis\n" +
                "G0 X" + extra_margin + " Y" + extra_margin + " F1000; Move to Position 1\n" +
                "G0 Z0.1\n" +
                "M0 ; Pause print\n" +
                "\n" +
                "G28;\n" +
                "M84 ; disable motors"

            let url = OctoPrint.getBlueprintUrl('calibrationcompanion') + "echo";
            OctoPrint.post(url, {"name": filename, "generated gcode": gcode_generated})

            gcode_generated = [];
        })

        let gcode_generated = [];

        let pos_x = [];
        let pos_y = [];
        let pos_z = [];

        let first_x_absolute_pos, first_y_absolute_pos;
        let returningPosX, returningPosY;

        let startFeedRate = [];

        let squares_position_x, squares_position_y;

        document.getElementById("calibration-square").onclick = function() {

            let start_gcode, end_gcode;

            if (!mainViewModel.variable.origin_check) {
                squares_position_x = [parseFloat(self.extra_margin()) + 10, mainViewModel.variable.bed_size_x - self.extra_margin() - 30 - 10, parseFloat(self.extra_margin()) + 10, mainViewModel.variable.bed_size_x - self.extra_margin() - 30 - 10, mainViewModel.bed_center_x - 30 / 2];
                squares_position_y = [mainViewModel.variable.bed_size_y - self.extra_margin() - 10, mainViewModel.variable.bed_size_y - self.extra_margin() - 10, parseFloat(self.extra_margin()) + 30 + 10, parseFloat(self.extra_margin()) + 30 + 10, mainViewModel.bed_center_y + 30 / 2];
            } else {
                squares_position_x = [mainViewModel.bed_center_x - 30 / 2, mainViewModel.variable.bed_size_x/2 - self.extra_margin() - 30 - 10, mainViewModel.bed_center_x - 30 / 2, -mainViewModel.variable.bed_size_x/2 + parseFloat(self.extra_margin()) + 10, mainViewModel.bed_center_x - 30 / 2];
                squares_position_y = [mainViewModel.variable.bed_size_y/2 - self.extra_margin() - 10, mainViewModel.bed_center_y + 30 / 2, -mainViewModel.variable.bed_size_y/2 + parseFloat(self.extra_margin()) + 30 + 10, mainViewModel.bed_center_y + 30 / 2, mainViewModel.bed_center_y + 30 / 2];
            }

            mainViewModel.flowCube = false;
            mainViewModel.last_feed_rate = 0;
            start_gcode = document.getElementById("start-gcode-square").value;
            end_gcode = document.getElementById("end-gcode-square").value;
            mainViewModel.regular_nozzle = document.getElementById("regular-nozzle-square").value;
            mainViewModel.regular_bed = document.getElementById("regular-bed-square").value;
            mainViewModel.fan_speed = document.getElementById("fan-speed-square").value;
            mainViewModel.fan_layer = 0;
            mainViewModel.regular_speed = document.getElementById("regular-speed-square").value * 60;
            mainViewModel.first_layer_speed = mainViewModel.regular_speed;
            mainViewModel.travel_speed = document.getElementById("travel-speed-square").value * 60;
            mainViewModel.retraction_distance = document.getElementById("retraction-dist-square").value;
            mainViewModel.retraction_speed = document.getElementById("retraction-speed-square").value * 60;
            mainViewModel.flow = document.getElementById("flow-square").value;
            mainViewModel.abl_method = document.getElementById("abl-method-square").value;
            mainViewModel.filename = "calibration_squares";

            for (let sq = 1; sq <= 5; sq++) {
                let boolean = [true]
                mainViewModel.first_z_pos = String(mainViewModel.variable.nozzle_size / 2);
                first_x_absolute_pos = squares_position_x[sq - 1];
                first_y_absolute_pos = squares_position_y[sq - 1];
                if (!mainViewModel.variable.relative_positioning) {
                    mainViewModel.first_x_pos = first_x_absolute_pos;
                    mainViewModel.first_y_pos = first_y_absolute_pos;
                }
                startFeedRate[sq] = mainViewModel.feed_rate;
                firstLayerCoord(parseFloat(mainViewModel.variable.nozzle_size));
                for (let z = 0; z <= relative_pos_x.length; z++) {
                    if (mainViewModel.variable.relative_positioning) {
                        pos_x[z] = relative_pos_x[z]
                        pos_y[z] = relative_pos_y[z]
                    } else {
                        mainViewModel.getAbsoluteCoordinate(relative_pos_x[z], relative_pos_y[z], 0, boolean[z])
                        pos_x[z] = mainViewModel.xAbsolute[z]
                        pos_y[z] = mainViewModel.yAbsolute[z]
                    }
                }
                if (mainViewModel.variable.relative_positioning) {
                    returningPosX = (squares_position_x[sq] + mainViewModel.getReturningPosition(relative_pos_x) - squares_position_x[sq-1]).toFixed(3);
                    returningPosY = (squares_position_y[sq] + mainViewModel.getReturningPosition(relative_pos_y) - squares_position_y[sq-1]).toFixed(3);
                } else {
                    pos_x.splice(0, 1);
                    pos_y.splice(0, 1);
                }
                gcode_generated[sq] = [];
                for (let x = 0; x < relative_pos_x.length; x++) {
                    if (GStatus[x] !== "null") {
                        if (GStatus[x] === "G0") {
                            gcode_generated[sq][x] = GStatus[x] + " F" + mainViewModel.travel_speed + " X" + pos_x[x] + " Y" + pos_y[x] + ";\n";
                        } else {
                            mainViewModel.extruded_length_calculation_relative(relative_pos_x[x], relative_pos_y[x])
                            gcode_generated[sq][x] = GStatus[x] + " F" + mainViewModel.regular_speed + " X" + pos_x[x] + " Y" + pos_y[x] + " E" + mainViewModel.feed_rate + ";\n";
                        }
                    } else {
                        if (GStatus[x] === "G0") {
                            gcode_generated[sq][x] = GStatus[x] + " F" + mainViewModel.travel_speed + " X" + pos_x[x] + " Y" + pos_y[x] + " Z" + pos_z[x] + ";\n";
                        } else {
                            mainViewModel.extruded_length_calculation_relative(relative_pos_x[x], relative_pos_y[x])
                            gcode_generated[sq][x] = GStatus[x] + " F" + mainViewModel.regular_speed + " X" + pos_x[x] + " Y" + pos_y[x] + " Z" + pos_z[x] + " E" + mainViewModel.feed_rate + ";\n";
                        }
                    }
                }
                if (sq < 5) {
                    if (!mainViewModel.variable.relative_positioning) {
                        gcode_generated[sq].push("\nG1 F" + mainViewModel.retraction_speed + " E" + (mainViewModel.feed_rate - mainViewModel.retraction_distance) + ";\n" +
                            "GO F" + mainViewModel.regular_speed + " Z10\n" +
                            "G0 F" + mainViewModel.regular_speed + " X" + squares_position_x[sq] + " Y" + squares_position_y[sq] + ";\n" +
                            "GO F" + mainViewModel.regular_speed + " Z" + mainViewModel.variable.nozzle_size/2 + ";\n" +
                            "G1 F" + mainViewModel.retraction_speed + " E" + mainViewModel.feed_rate + ";\n\n");
                    } else {
                        gcode_generated[sq].push("\nG1 F" + mainViewModel.retraction_speed + " E-" + mainViewModel.retraction_distance + ";\n" +
                            "GO F" + mainViewModel.regular_speed + " Z10\n" +
                            "G0 F" + mainViewModel.regular_speed + " X" + returningPosX + " Y" + returningPosY + ";\n" +
                            "GO F" + mainViewModel.regular_speed + " Z-10;\n" +
                            "G1 F" + mainViewModel.retraction_speed + " E" + mainViewModel.retraction_distance + ";\n");
                    }
                }
            }
            if (mainViewModel.variable.relative_positioning) {
                gcode_generated.splice(0, 1);
                gcode_generated.unshift("G91;\n")
            }

            mainViewModel.getSettings();

            for (const [key, value] of Object.entries(mainViewModel.settingsSquare)) {
                start_gcode = start_gcode.replaceAll("[" + key + "]", value);
            }
            gcode_generated.unshift("G28;\n\n" +
                ";---------ABL METHOD---------\n" + mainViewModel.abl_method + ";\n;---------ABL METHOD---------\n\n" +
                ";---------START G-CODE---------\n" + start_gcode + ";\n;---------START G-CODE---------\n\n" +
                "G0 F" + mainViewModel.travel_speed + " X" + squares_position_x[0] + " Y" + squares_position_y[0] +
                ";\n" + "G0 F" + mainViewModel.travel_speed + " Z" + mainViewModel.variable.nozzle_size / 2 + ";\n")

            for (const [key, value] of Object.entries(mainViewModel.settingsSquare)) {
                end_gcode = end_gcode.replaceAll("[" + key + "]", value);
            }
            gcode_generated.push(end_gcode);


            let url = OctoPrint.getBlueprintUrl('calibrationcompanion') + "echo";
            OctoPrint.post(url, {
                "name": mainViewModel.getFullFilename(mainViewModel.filename),
                "generated gcode": gcode_generated.flat().join('')
            })
            gcode_generated = [];
            pos_x = [];
            pos_y = [];
            pos_z = [];
            startFeedRate = []
        }

        let GStatus, relative_pos_x, relative_pos_y;

        function firstLayerCoord(nozzle_size) {
            if (nozzle_size === 0.4) {
                GStatus = ['G1', 'G1', 'G1', 'G1', 'G0', 'G0', 'G1', 'G1', 'G1', 'G1', 'G0', 'G0', 'G0', 'G0', 'G1', 'G1', 'G1', 'G1', 'G0', 'G0', 'G1', 'G0', 'G1', 'G0', 'G1', 'G0', 'G1', 'G0', 'G1', 'G0', 'G1', 'G0', 'G1', 'G0', 'G1', 'G0', 'G1', 'G0', 'G1', 'G0', 'G1', 'G0', 'G1', 'G0', 'G1', 'G0', 'G1', 'G0', 'G1', 'G0', 'G1', 'G0', 'G1', 'G0', 'G1', 'G0', 'G1', 'G0', 'G1', 'G0', 'G1', 'G0', 'G1', 'G0', 'G1', 'G0', 'G1', 'G0', 'G1', 'G0', 'G1', 'G0', 'G1', 'G0', 'G1', 'G0', 'G1', 'G0', 'G1', 'G0', 'G1', 'G0', 'G1', 'G0', 'G1', 'G0', 'G1', 'G0', 'G1', 'G0', 'G1', 'G0', 'G1', 'G0', 'G1', 'G0', 'G1', 'G0', 'G1', 'G0', 'G1', 'G0', 'G1', 'G0', 'G1', 'G0', 'G1', 'G0', 'G1', 'G0', 'G1', 'G0', 'G1', 'G0', 'G1', 'G0', 'G1', 'G0', 'G1', 'G0', 'G1', 'G0', 'G1', 'G0', 'G1', 'G0', 'G1', 'G0', 'G1', 'G0', 'G1', 'G0', 'G1', 'G0', 'G1', 'G0', 'G1', 'G0', 'G1', 'G0', 'G1', 'G0', 'G1', 'G0', 'G1', 'G0', 'G1', 'G0', 'G1', 'G0', 'G1', 'G0', 'G1', 'G0', 'G1', 'G0', 'G1', 'G0', 'G1', 'G0', 'G1', 'G0', 'G1', 'G0', 'G1', 'G0', 'G1', 'G0', 'G1', 'G0', 'G1', 'G0', 'G1', 'G0', 'G1', 'G0', 'G1', 'G0', 'G1', 'G0', 'G1', 'G0', 'G1', 'G0', 'G1', 'G0', 'G1', 'G0', 'G1', 'G0', 'G1', 'G0', 'G1', 'G0', 'G1', 'G0', 'G1', 'G0', 'G1', 'G0', 'G1', 'G0', 'G1', 'G0', 'G1', 'G0', 'G1', 'G0', 'G1', 'G0', 'G1', 'G0', 'G1'];
                relative_pos_x =  ['0',	'28.4',	'0',	'-27.6',	'-0.8',	'-0.4',	'0',	'29.2',	'0',	'-28.4',	'-0.8',	'0',	'0.44',	'0.35',	'0',	'27.62',	'0',	'-26.82',	'-0.8',	'0.466',	'-0.467',	'0',	'1.033',	'0.566',	'-1.599',	'0',	'2.164',	'0.566',	'-2.73',	'0',	'3.296',	'0.565',	'-3.861',	'0',	'4.427',	'0.566',	'-4.993',	'0',	'5.558',	'0.566',	'-6.124',	'0',	'6.69',	'0.566',	'-7.256',	'0',	'7.821',	'0.566',	'-8.387',	'0',	'8.953',	'0.565',	'-9.518',	'0',	'10.084',	'0.566',	'-10.65',	'0',	'11.215',	'0.566',	'-11.781',	'0',	'12.347',	'0.565',	'-12.912',	'0',	'13.478',	'0.566',	'-14.044',	'0',	'14.609',	'0.566',	'-15.175',	'0',	'15.741',	'0.566',	'-16.307',	'0',	'16.872',	'0.566',	'-17.438',	'0',	'18.004',	'0.565',	'-18.569',	'0',	'19.135',	'0.566',	'-19.701',	'0',	'20.266',	'0.566',	'-20.832',	'0',	'21.398',	'0.565',	'-21.963',	'0',	'22.529',	'0.566',	'-23.095',	'0',	'23.66',	'0.566',	'-24.226',	'0',	'24.792',	'0.565',	'-25.357',	'0',	'25.923',	'0.566',	'-26.489',	'0',	'27.055',	'0.565',	'-27.62',	'0.566',	'27.054',	'0',	'-26.488',	'0.566',	'25.922',	'0',	'-25.357',	'0.566',	'24.791',	'0',	'-24.225',	'0.565',	'23.66',	'0',	'-23.094',	'0.566',	'22.528',	'0',	'-21.963',	'0.566',	'21.397',	'0',	'-20.831',	'0.566',	'20.265',	'0',	'-19.7',	'0.566',	'19.134',	'0',	'-18.568',	'0.565',	'18.003',	'0',	'-17.437',	'0.566',	'16.871',	'0',	'-16.306',	'0.566',	'15.74',	'0',	'-15.174',	'0.565',	'14.609',	'0',	'-14.043',	'0.566',	'13.477',	'0',	'-12.912',	'0.566',	'12.346',	'0',	'-11.78',	'0.566',	'11.214',	'0',	'-10.649',	'0.566',	'10.083',	'0',	'-9.517',	'0.565',	'8.952',	'0',	'-8.386',	'0.566',	'7.82',	'0',	'-7.255',	'0.566',	'6.689',	'0',	'-6.123',	'0.565',	'5.558',	'0',	'-4.992',	'0.566',	'4.426',	'0',	'-3.861',	'0.566',	'3.295',	'0',	'-2.729',	'0.565',	'2.164',	'0',	'-1.598',	'0.566',	'1.032',	'0',	'-0.466'];
                relative_pos_y =  ['-28.4',	'0',	'28.4',	'0',	'0',	'0.4',	'-29.2',	'0',	'29.2',	'0',	'0',	'-0.4',	'-0.04',	'-0.35',	'-27.62',	'0',	'27.62',	'0',	'0',	'-0.001',	'-0.467',	'-0.566',	'1.033',	'0',	'-1.599',	'-0.565',	'2.164',	'0',	'-2.73',	'-0.566',	'3.296',	'0',	'-3.861',	'-0.566',	'4.427',	'0',	'-4.993',	'-0.565',	'5.558',	'0',	'-6.124',	'-0.566',	'6.69',	'0',	'-7.255',	'-0.566',	'7.821',	'0',	'-8.387',	'-0.565',	'8.952',	'0',	'-9.518',	'-0.566',	'10.084',	'0',	'-10.65',	'-0.565',	'11.215',	'0',	'-11.781',	'-0.566',	'12.347',	'0',	'-12.912',	'-0.566',	'13.478',	'0',	'-14.044',	'-0.565',	'14.609',	'0',	'-15.175',	'-0.566',	'15.741',	'0',	'-16.306',	'-0.566',	'16.872',	'0',	'-17.438',	'-0.565',	'18.003',	'0',	'-18.569',	'-0.566',	'19.135',	'0',	'-19.7',	'-0.566',	'20.266',	'0',	'-20.832',	'-0.566',	'21.398',	'0',	'-21.963',	'-0.566',	'22.529',	'0',	'-23.095',	'-0.565',	'23.66',	'0',	'-24.226',	'-0.566',	'24.792',	'0',	'-25.357',	'-0.566',	'25.923',	'0',	'-26.489',	'-0.565',	'27.054',	'0',	'-27.62',	'0.001',	'27.054',	'-0.566',	'-26.488',	'0',	'25.922',	'-0.566',	'-25.356',	'0',	'24.791',	'-0.566',	'-24.225',	'0',	'23.659',	'-0.565',	'-23.094',	'0',	'22.528',	'-0.566',	'-21.962',	'0',	'21.397',	'-0.566',	'-20.831',	'0',	'20.265',	'-0.565',	'-19.7',	'0',	'19.134',	'-0.566',	'-18.568',	'0',	'18.003',	'-0.566',	'-17.437',	'0',	'16.871',	'-0.565',	'-16.306',	'0',	'15.74',	'-0.566',	'-15.174',	'0',	'14.608',	'-0.565',	'-14.043',	'0',	'13.477',	'-0.566',	'-12.911',	'0',	'12.346',	'-0.566',	'-11.78',	'0',	'11.214',	'-0.565',	'-10.649',	'0',	'10.083',	'-0.566',	'-9.517',	'0',	'8.952',	'-0.566',	'-8.386',	'0',	'7.82',	'-0.565',	'-7.255',	'0',	'6.689',	'-0.566',	'-6.123',	'0',	'5.557',	'-0.565',	'-4.992',	'0',	'4.426',	'-0.566',	'-3.86',	'0',	'3.295',	'-0.566',	'-2.729',	'0',	'2.163',	'-0.565',	'-1.598',	'0',	'1.032',	'-0.566',	'-0.466'];
            }
            if (nozzle_size === 0.6) {
                GStatus = ['G1',	'G1',	'G1',	'G1',	'G0',	'G1',	'G1',	'G1',	'G1',	'G0',	'G1',	'G1',	'G1',	'G1',	'G0',	'G1',	'G0',	'G1',	'G0',	'G1',	'G0',	'G1',	'G0',	'G1',	'G0',	'G1',	'G0',	'G1',	'G0',	'G1',	'G0',	'G1',	'G0',	'G1',	'G0',	'G1',	'G0',	'G1',	'G0',	'G1',	'G0',	'G1',	'G0',	'G1',	'G0',	'G1',	'G0',	'G1',	'G0',	'G1',	'G0',	'G1',	'G0',	'G1',	'G0',	'G1',	'G0',	'G1',	'G0',	'G1',	'G0',	'G1',	'G0',	'G1',	'G0',	'G1',	'G0',	'G1',	'G0',	'G1',	'G0',	'G1',	'G0',	'G1',	'G0',	'G1',	'G0',	'G1',	'G0',	'G1',	'G0',	'G1',	'G0',	'G1',	'G0',	'G1',	'G0',	'G1',	'G0',	'G1',	'G0',	'G1',	'G0',	'G1',	'G0',	'G1',	'G0',	'G1',	'G0',	'G1',	'G0',	'G1',	'G0',	'G1',	'G0',	'G1',	'G0',	'G1',	'G0',	'G1',	'G0',	'G1',	'G0',	'G1',	'G0',	'G1',	'G0',	'G1',	'G0',	'G1',	'G0',	'G1',	'G0',	'G1',	'G0',	'G1',	'G0',	'G1',	'G0',	'G1',	'G0',	'G1',	'G0',	'G1',	'G0',	'G1',	'G0',	'G1',	'G0',	'G1'];
                relative_pos_x = ['0',	'28.2',	'0',	'-28.2',	'-0.6',	'0',	'29.4',	'0',	'-29.4',	'1.19',	'0',	'27.02',	'0',	'-27.02',	'0.475',	'-0.236',	'0',	'1.084',	'0.849',	'-1.933',	'0',	'2.781',	'0.849',	'-3.63',	'0',	'4.478',	'0.849',	'-5.327',	'0',	'6.175',	'0.849',	'-7.024',	'0',	'7.872',	'0.849',	'-8.721',	'0',	'9.569',	'0.849',	'-10.418',	'0',	'11.266',	'0.849',	'-12.115',	'0',	'12.964',	'0.848',	'-13.812',	'0',	'14.661',	'0.848',	'-15.509',	'0',	'16.358',	'0.848',	'-17.206',	'0',	'18.055',	'0.848',	'-18.903',	'0',	'19.752',	'0.848',	'-20.6',	'0',	'21.449',	'0.848',	'-22.297',	'0',	'23.146',	'0.848',	'-23.994',	'0',	'24.843',	'0.848',	'-25.691',	'0',	'26.54',	'0',	'-25.691',	'0.849',	'24.842',	'0',	'-23.994',	'0.849',	'23.145',	'0',	'-22.297',	'0.849',	'21.448',	'0',	'-20.599',	'0.848',	'19.751',	'0',	'-18.902',	'0.848',	'18.054',	'0',	'-17.205',	'0.848',	'16.357',	'0',	'-15.508',	'0.848',	'14.66',	'0',	'-13.811',	'0.848',	'12.963',	'0',	'-12.114',	'0.848',	'11.266',	'0',	'-10.417',	'0.848',	'9.569',	'0',	'-8.72',	'0.848',	'7.872',	'0',	'-7.023',	'0.849',	'6.174',	'0',	'-5.326',	'0.849',	'4.477',	'0',	'-3.629',	'0.849',	'2.78',	'0',	'-1.932',	'0.849',	'1.083',	'0',	'-0.235'];
                relative_pos_y = ['-28.2',	'0',	'28.2',	'0',	'0.6',	'-29.4',	'0',	'29.4',	'0',	'-1.19',	'-27.02',	'0',	'27.02',	'0',	'-0.241',	'-0.235',	'-0.849',	'1.084',	'0',	'-1.933',	'-0.848',	'2.781',	'0',	'-3.63',	'-0.848',	'4.478',	'0',	'-5.327',	'-0.848',	'6.175',	'0',	'-7.024',	'-0.848',	'7.872',	'0',	'-8.721',	'-0.848',	'9.569',	'0',	'-10.418',	'-0.848',	'11.266',	'0',	'-12.115',	'-0.848',	'12.963',	'0',	'-13.812',	'-0.848',	'14.66',	'0',	'-15.509',	'-0.849',	'16.358',	'0',	'-17.206',	'-0.849',	'18.055',	'0',	'-18.903',	'-0.849',	'19.752',	'0',	'-20.6',	'-0.849',	'21.449',	'0',	'-22.297',	'-0.849',	'23.146',	'0',	'-23.994',	'-0.849',	'24.843',	'0',	'-25.691',	'-0.849',	'26.54',	'-0.849',	'-25.69',	'0',	'24.842',	'-0.849',	'-23.993',	'0',	'23.145',	'-0.849',	'-22.296',	'0',	'21.448',	'-0.849',	'-20.599',	'0',	'19.751',	'-0.849',	'-18.902',	'0',	'18.054',	'-0.849',	'-17.205',	'0',	'16.357',	'-0.849',	'-15.508',	'0',	'14.66',	'-0.849',	'-13.811',	'0',	'12.963',	'-0.849',	'-12.114',	'0',	'11.265',	'-0.848',	'-10.417',	'0',	'9.568',	'-0.848',	'-8.72',	'0',	'7.871',	'-0.848',	'-7.023',	'0',	'6.174',	'-0.848',	'-5.326',	'0',	'4.477',	'-0.848',	'-3.629',	'0',	'2.78',	'-0.848',	'-1.932',	'0',	'1.083',	'-0.848',	'-0.235'];
            }
            if (nozzle_size === 0.8) {
                GStatus = ['G1',	'G1',	'G1',	'G1',	'G0',	'G1',	'G1',	'G1',	'G1',	'G0',	'G1',	'G1',	'G1',	'G1',	'G0',	'G1',	'G0',	'G1',	'G0',	'G1',	'G0',	'G1',	'G0',	'G1',	'G0',	'G1',	'G0',	'G1',	'G0',	'G1',	'G0',	'G1',	'G0',	'G1',	'G0',	'G1',	'G0',	'G1',	'G0',	'G1',	'G0',	'G1',	'G0',	'G1',	'G0',	'G1',	'G0',	'G1',	'G0',	'G1',	'G0',	'G1',	'G0',	'G1',	'G0',	'G1',	'G0',	'G1',	'G0',	'G1',	'G0',	'G1',	'G0',	'G1',	'G0',	'G1',	'G0',	'G1',	'G0',	'G1',	'G0',	'G1',	'G0',	'G1',	'G0',	'G1',	'G0',	'G1',	'G0',	'G1',	'G0',	'G1',	'G0',	'G1',	'G0',	'G1',	'G0',	'G1',	'G0',	'G1',	'G0',	'G1',	'G0',	'G1',	'G0',	'G1',	'G0',	'G1',	'G0',	'G1',	'G0',	'G1',	'G0',	'G1'];
                relative_pos_x = ['0',	'27.6',	'0',	'-27.6',	'-0.8',	'0',	'29.2',	'0',	'-29.2',	'1.59',	'0',	'26.02',	'0',	'-26.02',	'0.809',	'-0.49',	'0',	'1.621',	'1.132',	'-2.753',	'0',	'3.884',	'1.131',	'-5.015',	'0',	'6.147',	'1.131',	'-7.278',	'0',	'8.41',	'1.131',	'-9.541',	'0',	'10.672',	'1.132',	'-11.804',	'0',	'12.935',	'1.131',	'-14.066',	'0',	'15.198',	'1.131',	'-16.329',	'0',	'17.461',	'1.131',	'-18.592',	'0',	'19.723',	'1.132',	'-20.855',	'0',	'21.986',	'1.131',	'-23.117',	'0',	'24.249',	'1.131',	'-25.38',	'1.132',	'24.248',	'0',	'-23.117',	'1.132',	'21.985',	'0',	'-20.854',	'1.132',	'19.722',	'0',	'-18.591',	'1.131',	'17.46',	'0',	'-16.328',	'1.131',	'15.197',	'0',	'-14.066',	'1.132',	'12.934',	'0',	'-11.803',	'1.132',	'10.671',	'0',	'-9.54',	'1.131',	'8.409',	'0',	'-7.277',	'1.131',	'6.146',	'0',	'-5.015',	'1.132',	'3.883',	'0',	'-2.752',	'1.131',	'1.621',	'0',	'-0.489'];
                relative_pos_y = ['-27.6',	'0',	'27.6',	'0',	'0.8',	'-29.2',	'0',	'29.2',	'0',	'-1.59',	'-26.02',	'0',	'26.02',	'0',	'-0.321',	'-0.49',	'-1.131',	'1.621',	'0',	'-2.753',	'-1.131',	'3.884',	'0',	'-5.015',	'-1.132',	'6.147',	'0',	'-7.278',	'-1.131',	'8.409',	'0',	'-9.541',	'-1.131',	'10.672',	'0',	'-11.804',	'-1.131',	'12.935',	'0',	'-14.066',	'-1.132',	'15.198',	'0',	'-16.329',	'-1.131',	'17.46',	'0',	'-18.592',	'-1.131',	'19.723',	'0',	'-20.855',	'-1.131',	'21.986',	'0',	'-23.117',	'-1.132',	'24.249',	'0',	'-25.38',	'0.001',	'24.248',	'-1.132',	'-23.116',	'0',	'21.985',	'-1.131',	'-20.854',	'0',	'19.722',	'-1.131',	'-18.591',	'0',	'17.46',	'-1.132',	'-16.328',	'0',	'15.197',	'-1.132',	'-14.065',	'0',	'12.934',	'-1.131',	'-11.803',	'0',	'10.671',	'-1.131',	'-9.54',	'0',	'8.409',	'-1.132',	'-7.277',	'0',	'6.146',	'-1.132',	'-5.014',	'0',	'3.883',	'-1.131',	'-2.752',	'0',	'1.62',	'-1.131',	'-0.489'];
            }
        }

        let z_offset = 0.1;

        document.getElementById("resetProcedure").onclick = function() {
            mainViewModel.resetProcedure()
        }

        document.getElementById("step1").addEventListener("click", function(){
            z_offset = 0;
            OctoPrint.control.sendGcode(['M851', 'M851 Z0', 'G28', 'M500', 'G90', 'G0 X' + mainViewModel.bed_center_x + ' Y' + mainViewModel.bed_center_y + ' F2000', 'G0 Z0.1', 'M211 S0'])
            document.getElementById("step1").disabled = true
            document.getElementById("step2").disabled = false
            document.getElementById("step3").disabled = true
            document.getElementById("step4").disabled = true
            document.getElementById("plusz0.1").disabled = false
            document.getElementById("minusz0.1").disabled = false
            document.getElementById("plusz1").disabled = false
            document.getElementById("minusz1").disabled = false
            self.notify = new PNotify({
                    title: 'Calibration Companion Step 1',
                    text: 'Put a sheet of paper under the nozzle. Then use the interface to lower the head.\n'+
                        'The head should very lightly touch the sheet of paper. When finished, click on step 2.',
                    type: 'info',
                    hide: false,
                    buttons: {
                        closer: true,
                        sticker: false
                    },
                });
        }, false);

        document.getElementById("step2").addEventListener("click", function(){
            OctoPrint.control.sendGcode(['M851 Z' + z_offset, 'M211 S1', 'M500', 'M117 zOffset = ' + z_offset])
            document.getElementById("step1").disabled = true
            document.getElementById("step2").disabled = true
            document.getElementById("step3").disabled = false
            document.getElementById("step4").disabled = true
            document.getElementById("plusz0.1").disabled = true
            document.getElementById("minusz0.1").disabled = true
            document.getElementById("plusz1").disabled = true
            document.getElementById("minusz1").disabled = true
            self.notify.update({hide: true});
            self.notify = new PNotify({
                title: 'Calibration Companion Step 2',
                text: 'Print the generated file in the manager. This file will bring the head 0.1mm from the bed.\n' +
                    'The head must lightly touch the sheet of paper.\n' +
                    'When the head reaches the middle, do not touch anything. Repeat this .gcode at least 3 times in a row.\n' +
                    'At the end the 5 positions should give the same feeling of very light touch. After you finish, go to step 3.',
                type: 'info',
                hide: false,
                buttons: {
                    closer: true,
                    sticker: false
                },
            });
        }, false);

        document.getElementById("step3").addEventListener("click", function(){
            OctoPrint.control.sendGcode(['M851', 'G28', 'G29', 'M500', 'M851 Z0', 'G28', 'G0 Z10 F2000', 'G0 X' + mainViewModel.bed_center_x + ' Y' + mainViewModel.bed_center_y + ' F2000', 'G0 Z0.1', 'M211 S0'])
            z_offset = 0.1;
            document.getElementById("step1").disabled = true
            document.getElementById("step2").disabled = true
            document.getElementById("step3").disabled = true
            document.getElementById("step4").disabled = false
            document.getElementById("plusz0.1").disabled = false
            document.getElementById("minusz0.1").disabled = false
            document.getElementById("plusz1").disabled = false
            document.getElementById("minusz1").disabled = false
            self.notify.update({hide: true});
                self.notify = new PNotify({
                    title: 'Calibration Companion Step 3',
                    text: 'Put a sheet of paper under the nozzle. Then use the interface to lower the head.\n'+
                        'The head should very lightly touch the sheet of paper. When finished, click on step 4.',
                    type: 'info',
                    hide: false,
                    buttons: {
                        closer: true,
                        sticker: false
                    },
                });
        }, false);

        document.getElementById("step4").addEventListener("click", function(){
            OctoPrint.control.sendGcode(['M851 Z' + z_offset, 'M211 S1', 'M500', 'M117 zOffset = ' + z_offset, 'G28'])
            document.getElementById("step1").disabled = true
            document.getElementById("step2").disabled = true
            document.getElementById("step3").disabled = true
            document.getElementById("step4").disabled = true
            document.getElementById("plusz0.1").disabled = true
            document.getElementById("minusz0.1").disabled = true
            document.getElementById("plusz1").disabled = true
            document.getElementById("minusz1").disabled = true
            self.notify.update({hide: true});
                self.notify = new PNotify({
                    title: 'Calibration Companion Step 4',
                    text: 'Well done ! Now you can print the final squares to have a perfectly levelled bed',
                    type: 'info',
                    hide: true,
                    buttons: {
                        closer: true,
                        sticker: false
                    },
                });
                mainViewModel.resetProcedure()
        }, false);

        document.getElementById("minusz0.1").addEventListener("click", function(){
            z_offset-=0.1
            z_offset= Math.round(z_offset*1e12)/1e12
            OctoPrint.control.sendGcode(['G91', 'G1 Z-0.1'])
        }, false);
        document.getElementById("plusz0.1").addEventListener("click", function(){
            z_offset+=0.1
            z_offset = Math.round(z_offset*1e12)/1e12
            OctoPrint.control.sendGcode(['G91', 'G1 Z0.1'])
        }, false);
        document.getElementById("minusz1").addEventListener("click", function(){
            z_offset-=1
            z_offset= Math.round(z_offset*1e12)/1e12
            OctoPrint.control.sendGcode(['G91', 'G1 Z-1'])
        }, false);
        document.getElementById("plusz1").addEventListener("click", function(){
            z_offset+=1
            z_offset = Math.round(z_offset*1e12)/1e12
            OctoPrint.control.sendGcode(['G91', 'G1 Z1'])
        }, false);

        self.onEventPrinterStateChanged = function(e) {
            if (e.state_string === "Offline") {
                mainViewModel.resetProcedure();
            }
        }

        mainViewModel.resetProcedure = function() {
            //OctoPrint.control.sendGcode("M851")
            document.getElementById("step1").disabled = false
            document.getElementById("step2").disabled = true
            document.getElementById("step3").disabled = true
            document.getElementById("step4").disabled = true
            document.getElementById("minusz1").disabled = true
            document.getElementById("minusz0.1").disabled = true
            document.getElementById("plusz0.1").disabled = true
            document.getElementById("plusz1").disabled = true
            OctoPrint.settings.getPluginSettings('calibrationcompanion').done(function (response) {
                if (response["procedureStarted"] === true) {
                    if (typeof response["current_z_offset"] !== "undefined") {
                        OctoPrint.control.sendGcode(["M851 Z" + response["current_z_offset"], "M500"])
                        self.notify = new PNotify({
                            title: 'Calibration Companion',
                            text: 'The procedure was reset and your z offset value was restored to Z' + response["current_z_offset"],
                            type: 'info',
                            hide: true,
                            buttons: {
                                closer: true,
                                sticker: false
                            },
                        });
                    } else {
                        self.notify = new PNotify({
                            title: 'Calibration Companion',
                            text: 'The procedure was reset',
                            type: 'info',
                            hide: true,
                            buttons: {
                                closer: true,
                                sticker: false
                            },
                        });
                    }
                    OctoPrint.settings.savePluginSettings('calibrationcompanion', {'procedureStarted' : false})
                }
            })
        }

    }

    OCTOPRINT_VIEWMODELS.push({
        construct: calibrationcompanionViewModel_firstlayer,
        dependencies: [  "settingsViewModel", "calibrationcompanionViewModel", "controlViewModel"  ],
        elements: [ "#settings_plugin_calibrationcompanion", "#layer" ]
    });
});
