/*
 * View model for OctoPrint-calibrationcompanion
 *
 * Author: Francois Guyot
 * License: AGPLv3
 */
$(function () {
    function calibrationcompanionViewModel(parameters) {
        var self = this;

        self.settingsViewModel = parameters[0];

        self.bed_size_x = ko.observable();
        self.bed_size_y = ko.observable();
        self.bed_size_z = ko.observable();
        self.origin_check = ko.observable();
        self.filament_used = ko.observable();
        self.printer_name = ko.observable();
        self.relative_positioning = ko.observable();
        self.abl_method_retra = ko.observable();
        self.abl_method_temp = ko.observable();
        self.nozzle_size = ko.observable();
        self.filament_diameter = ko.observable();

        self.variable = {};

        let restrictedIdClassic = ["#bedSizeX", "#bedSizeY", "#bedSizeZ"];
        self.allowedArrayClassic = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
        let restrictedIdComma = ["#filamentDiameter"];
        self.allowedArrayComma = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.'];
        let restrictedIdText = ["#printerName"];
        self.allowedArrayText = ['a', 'A', 'b', 'B', 'd', 'D', 'e', 'E', 'f', 'F', 'g', 'G', 'h', 'H',
                                'i', 'I', 'j', 'J', 'k', 'K', 'l', 'L', 'm', 'M', 'n', 'N', 'o', 'O',
                                'p', 'P', 'q', 'Q', 'r', 'R', 's', 'S', 't', 'T', 'u', 'U', 'v', 'V',
                                'w', 'W', 'x', 'X', 'y', 'Y', 'z', 'Z'];


        let restrictedInputs = ["#printerName", "#filamentUsed", "#filamentDiameter", "#bedSizeX", "#bedSizeY", "#bedSizeZ", "#nozzleSize"];
        let restrictedNoVerifInputs = ["null", "#filamentUsed", "null", "null", "null", "null", "#nozzleSize"]
        let saveInputs = ["printer_name", "filament_used", "filament_diameter", "bed_size_x", "bed_size_y", "bed_size_z", "nozzle_size"];

        let restrictedCheckbox = ["#relativePositioning", "#originCheck"];
        let saveCheckbox = ["relative_positioning", "origin_check"];

        self.appendedArrayComma = [];

        self.onBeforeBinding = function() {
            self.bed_size_x(self.settingsViewModel.settings.plugins.calibrationcompanion.bed_size_x());
            self.bed_size_y(self.settingsViewModel.settings.plugins.calibrationcompanion.bed_size_y());
            self.bed_size_z(self.settingsViewModel.settings.plugins.calibrationcompanion.bed_size_z());
            self.origin_check(self.settingsViewModel.settings.plugins.calibrationcompanion.origin_check());
            self.filament_used(self.settingsViewModel.settings.plugins.calibrationcompanion.filament_used());
            self.printer_name(self.settingsViewModel.settings.plugins.calibrationcompanion.printer_name());
            self.relative_positioning(self.settingsViewModel.settings.plugins.calibrationcompanion.relative_positioning());
            self.nozzle_size(self.settingsViewModel.settings.plugins.calibrationcompanion.nozzle_size());
            self.filament_diameter(self.settingsViewModel.settings.plugins.calibrationcompanion.filament_diameter());

            document.getElementById("plusz").disabled = true
            document.getElementById("minusz").disabled = true
            document.getElementById("step2").disabled = true
            document.getElementById("step3").disabled = true
            document.getElementById("step4").disabled = true
        }

        self.onAfterBinding = function() {
            $(restrictedNoVerifInputs.join(",")).each(function () {
                saveSettingsSetup(this);
            });
            $(restrictedIdClassic.join(",")).each(function() {
                self.checkValue(this, this.parentNode.parentNode.parentNode, self.allowedArrayClassic);
            });
            $(restrictedIdComma.join(",")).each(function() {
                self.checkValue(this, this.parentNode.parentNode.parentNode, self.allowedArrayComma);
            });
            $(restrictedIdText.join(",")).each(function() {
                self.checkValue(this, this.parentNode.parentNode, self.allowedArrayText);
            });
            $(restrictedCheckbox.join(",")).each(function() {
                saveSettingsSetupCheckbox(this);
            });
            self.flow = 100;
            self.resetProcedure();
        }

        self.zHeightWarning = function() {
            self.notify = new PNotify({
                title: 'Calibration Plugin',
                text: 'Maximum height was reached, please check your Printer Height Z',
                type: 'alert',
                hide: true,
                buttons: {
                    closer: true,
                    sticker: false
                },
            });
        }

        let readyState;
        OctoPrint.printer.getFullState().done(function(response) {
            readyState = response.sd.ready;
        });

        $("#bedSizeX").on("input", function () {
            if (self.variable.origin_check) {
                document.getElementById("bedSizeY").value = this.value;
            }
        });

        $(restrictedIdClassic.join(",")).on("input", function() {
            self.checkValue(this, this.parentNode.parentNode.parentNode, self.allowedArrayClassic);
        });

        $(restrictedIdComma.join(",")).on("input", function() {
            self.checkValue(this, this.parentNode.parentNode.parentNode, self.allowedArrayComma);
        });

        $(restrictedIdText.join(",")).on("input", function() {
            self.checkValue(this, this.parentNode.parentNode, self.allowedArrayText);
        });

        self.checkValue = function(element, div, array) {
            let id = element.id;
            let value = element.value;
            let booleanArray = [];
            value.split('').forEach(elementLoop => booleanArray.push(array.includes(elementLoop)));
            let finalBoolean = !booleanArray.some((elementLoop) => elementLoop === false)
            if (finalBoolean) {
                removeError(div)
                saveSettingsSetup(element)
                if (id === "bedSizeX" || id === "bedSizeY") {
                    if (value < 100) {
                        checkWarning(div);
                    } else {
                        removeWarning(div);
                    }
                } else if (id === "bedSizeZ") {
                    if (value < 50) {
                        checkWarning(div);
                    } else {
                        removeWarning(div);
                    }
                } else if (id.includes("inputListRetraSpeed")) {
                    if (value > 100) {
                        checkWarning(div);
                    } else {
                        removeWarning(div);
                    }
                } else if (id.includes("inputListRetraDist")) {
                    if (value > 10) {
                        checkWarning(div);
                    } else {
                        removeWarning(div);
                    }
                } else if (id.includes("inputListTemp")) {
                    if (value < 180 || value > 280) {
                        checkWarning(div);
                    } else {
                        removeWarning(div);
                    }
                } else if (id.includes("inputListAcceleration")) {
                    if (value > 3000) {
                        checkWarning(div);
                    } else {
                        removeWarning(div);
                    }
                } else if (id.includes("inputListJerk")) {
                    if (value > 30) {
                        checkWarning(div);
                    } else {
                        removeWarning(div);
                    }
                } else if (id.includes("inputListJunction")) {
                    if (value > 1) {
                        checkWarning(div);
                    } else {
                        removeWarning(div);
                    }
                }
            } else {
                checkError(div);
            }
        }

        function checkWarning(div) {
            div.className = "control-group warning";
        }
        function removeWarning(div) {
            div.className = "control-group";
        }
        function checkError(div) {
            div.className = "control-group error";
        }
        function removeError(div) {
            div.className = "control-group";
        }

        document.getElementById("nozzleSize").onchange = function() {
            self.resetAccel();
            self.resetRetra();
            self.resetTemp();
        }

        $(restrictedNoVerifInputs.join(",")).on("input", function() {
            saveSettingsSetup(this);
        });

        function saveSettingsSetup(element) {
            let saveSettings = saveInputs[restrictedInputs.indexOf('#' + element.id)];
            self.variable[saveSettings] = element.value;
            OctoPrint.settings.savePluginSettings('calibrationcompanion', {
                [saveSettings]: element.value})
        }

        $(restrictedCheckbox.join(",")).on("click", function() {
            saveSettingsSetupCheckbox(this);
        });

        function saveSettingsSetupCheckbox(element) {
            let saveSettingsCheckbox = saveCheckbox[restrictedCheckbox.indexOf('#' + element.id)];
            OctoPrint.settings.savePluginSettings('calibrationcompanion', {
                [saveSettingsCheckbox]: element.checked})
            self.variable[saveSettingsCheckbox] = element.checked;
            if (saveSettingsCheckbox === "origin_check") {
                if (element.checked) {
                    document.getElementById("bedSizeY").disabled = true;
                    self.bed_center_x = 0;
                    self.bed_center_y = 0;
                } else {
                    document.getElementById("bedSizeY").disabled = false;
                    self.bed_center_x = Math.round(self.variable.bed_size_x / 2);
                    self.bed_center_y = Math.round(self.variable.bed_size_y / 2);
                }
            }
        }

        self.whitespace = document.createElement("span");
        self.whitespace.className = "whitespace"
        self.whitespace2 = document.createElement("span");
        self.whitespace2.className = "whitespace2"

        self.getReturningPosition = function(array) {
            let valueReturn = 0;
            for (let i=0; i<array.length; i++) {
                if (array[i] !== 'null') {
                    valueReturn = valueReturn + parseFloat(array[i]);
                }
            }
            return -valueReturn.toFixed(3);
        }

        self.getFullFilename = function(filename) {
            return self.variable.printer_name + "_" + self.variable.filament_used + "_" + self.variable.nozzle_size + "_" + filename;
        }

        self.noStageMessage = function() {
            self.notify = new PNotify({
                title: 'Calibration Companion',
                text: 'Please add at least one stage first!',
                type: 'alert',
                hide: true,
                buttons: {
                    closer: true,
                    sticker: false
                },
            });
        }

        self.errorMessage = function() {
            self.notify = new PNotify({
                title: 'Calibration Companion',
                text: 'It seems like some parameters are off.',
                type: 'alert',
                hide: true,
                buttons: {
                    closer: true,
                    sticker: false
                },
            });
        }

        let procedureStarted = false

        document.getElementById("step1").onclick = function() {
            procedureStarted = true
            OctoPrint.settings.savePluginSettings('calibrationcompanion', {'procedureStarted' : true})
            //OctoPrint.settings.savePluginSettings('calibrationcompanion', {'current_z_offset' : "undefined"})
        }

        /*self.onServerDisconnect = function() {
            if (procedureStarted) {
                OctoPrint.settings.savePluginSettings('calibrationcompanion', {'procedureStarted' : true})
            } else {
                OctoPrint.settings.savePluginSettings('calibrationcompanion', {'procedureStarted' : false})
            }
        }*/

        self.resetProcedure = function() {
            //OctoPrint.control.sendGcode("M851")
            document.getElementById("step1").disabled = false
            document.getElementById("step2").disabled = true
            document.getElementById("step3").disabled = true
            document.getElementById("step4").disabled = true
            document.getElementById("plusz").disabled = true
            document.getElementById("minusz").disabled = true
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

        /*function extruded_length_calculation(number_part, old_number_part) {
            if (number_part.includes("X") && number_part.includes("Y") && number_part.includes("Z")) {
                new_x_length = (number_part.substring(number_part.lastIndexOf("X") + 1, number_part.lastIndexOf(" "))) - (old_number_part.substring(old_number_part.lastIndexOf("X") + 1, old_number_part.lastIndexOf(" ")));
                new_y_length = (number_part.substring(number_part.lastIndexOf("Y") + 1, number_part.lastIndexOf(" "))) - (old_number_part.substring(old_number_part.lastIndexOf("Y") + 1, old_number_part.lastIndexOf(" ")));
                new_z_length = (number_part.substring(number_part.lastIndexOf("Z") + 1, number_part.length)) - (old_number_part.substring(old_number_part.lastIndexOf("Z") + 1, old_number_part.length));
            }
            else if (number_part.includes("X") && number_part.includes("Y") && !number_part.includes("Z")) {
                new_x_length = (number_part.substring(number_part.lastIndexOf("X") + 1, number_part.lastIndexOf(" "))) - (old_number_part.substring(old_number_part.lastIndexOf("X") + 1, old_number_part.lastIndexOf(" ")));
                new_y_length = (number_part.substring(number_part.lastIndexOf("Y") + 1, old_number_part.length)) - (old_number_part.substring(old_number_part.lastIndexOf("Y") + 1, old_number_part.length));
                new_z_length = 0;
            }
            else if (number_part.includes("X") && !number_part.includes("Y") && !number_part.includes("Z")) {
                new_x_length = (number_part.substring(number_part.lastIndexOf("X") + 1, old_number_part.length)) - (old_number_part.substring(old_number_part.lastIndexOf("X") + 1, old_number_part.length));
                new_y_length = 0;
                new_z_length = 0;
            }
            else if (!number_part.includes("X") && number_part.includes("Y") && !number_part.includes("Z")) {
                new_x_length = 0;
                new_y_length = (number_part.substring(number_part.lastIndexOf("Y") + 1, old_number_part.length)) - (old_number_part.substring(old_number_part.lastIndexOf("Y") + 1, old_number_part.length));
                new_z_length = 0;
            }
            else if (!number_part.includes("X") && !number_part.includes("Y") && number_part.includes("Z")) {
                new_x_length = 0;
                new_y_length = 0;
                new_z_length = (number_part.substring(number_part.lastIndexOf("Z") + 1, old_number_part.length)) - (old_number_part.substring(old_number_part.lastIndexOf("Z") + 1, old_number_part.length));
            }
                extruded_length = Math.pow(Math.pow(new_x_length,2) + Math.pow(new_y_length,2),1/2)
                feed_rate_calculation(extruded_length)
                return extruded_length
            }*/

        let extruded_length;

        self.extruded_length_calculation_relative = function(xMovement, yMovement) {
            extruded_length = Math.pow(Math.pow(xMovement,2) + Math.pow(yMovement,2),1/2)
            if (self.flowCube) {
                feed_rate_calculation_flow_cube(extruded_length)
            } else {
                feed_rate_calculation_diagonal(extruded_length)
            }
        }

        function extruded_length_calculation_relative_withz(xMovement, yMovement, zMovement) {
            extruded_length = Math.pow(Math.pow(xMovement,2) + Math.pow(yMovement,2) + Math.pow(zMovement,2),1/2)
            feed_rate_calculation_diagonal(extruded_length)
        }

        let feed_rate_relative = 0;

        function feed_rate_calculation_diagonal(extruded_length) {
            let layer_height = self.variable.nozzle_size / 2;
            let layer_width = self.variable.nozzle_size;
            if (self.variable.relative_positioning) {
                feed_rate_relative = Math.round((self.flow/100) * 100000 * (layer_height * layer_width * extruded_length) / ((Math.PI / 4) * Math.pow(self.variable.filament_diameter, 2))) / 100000;
            } else {
                feed_rate_relative = Math.round((self.flow/100) * 100000 * (layer_height * layer_width * extruded_length) / ((Math.PI / 4) * Math.pow(self.variable.filament_diameter, 2))) / 100000 + self.last_feed_rate;
                self.last_feed_rate = feed_rate_relative
            }
            self.feed_rate = feed_rate_relative.toFixed(5)
            return self.feed_rate
        }
        function feed_rate_calculation_flow_cube(extruded_length) {
            let layer_height = self.variable.nozzle_size / 2;
            let layer_width = self.variable.nozzle_size;
            if (self.variable.relative_positioning) {
                feed_rate_relative = Math.round((self.flow/100) * 100000 * (((layer_width - layer_height) * layer_height + (Math.PI * Math.pow(layer_height / 2, 2))) * extruded_length) / ((Math.PI / 4) * Math.pow(self.variable.filament_diameter, 2))) / 100000;
            } else {
                feed_rate_relative = Math.round((self.flow/100) * 100000 * (((layer_width - layer_height) * layer_height + (Math.PI * Math.pow(layer_height / 2, 2))) * extruded_length) / ((Math.PI / 4) * Math.pow(self.variable.filament_diameter, 2))) / 100000 + self.last_feed_rate;
                self.last_feed_rate = feed_rate_relative
            }
            self.feed_rate = feed_rate_relative.toFixed(5)
            return self.feed_rate
        }



        let z=0;
        let xAbsolute = [];
        let yAbsolute = [];
        let zAbsolute = [];
        let xLastAbsolute;
        let yLastAbsolute;
        let zLastAbsolute;

        self.getAbsoluteCoordinate = function(xRelative, yRelative, zRelative, boolean) {
            if (boolean) {
                z=0;
                xAbsolute = []
                yAbsolute = [];
                zAbsolute = [];
                xLastAbsolute = xAbsolute[0] = self.first_x_pos;
                yLastAbsolute = yAbsolute[0] = self.first_y_pos;
                zLastAbsolute = zAbsolute[0] = parseFloat(self.first_z_pos) + parseFloat(self.variable.nozzle_size)/2;
            }
                if (xRelative === "null") {
                    xAbsolute[z + 1] = "null";
                } else {
                    xAbsolute[z + 1] = (parseFloat(xLastAbsolute)+parseFloat(xRelative)).toFixed(3)
                    xLastAbsolute = xAbsolute[z + 1]
                }
                if (yRelative === "null") {
                    yAbsolute[z + 1] = "null";
                } else {
                    yAbsolute[z + 1] = (parseFloat(yLastAbsolute)+parseFloat(yRelative)).toFixed(3)
                    yLastAbsolute = yAbsolute[z + 1]
                }
                if (zRelative === "null") {
                    zAbsolute[z + 1] = "null";
                } else {
                    if (zRelative !== undefined) {
                        zAbsolute[z + 1] = (parseFloat(zLastAbsolute) + parseFloat(zRelative)).toFixed(2)
                        self.zLastAbsolute = zLastAbsolute
                        zLastAbsolute = zAbsolute[z + 1]
                    }
                }
                z++

            return [(self.xAbsolute = xAbsolute), (self.yAbsolute = yAbsolute), (self.zAbsolute = zAbsolute)]
        }

        self.getSettings = function() {
            self.settingsSquare = {
                "printer_name": self.variable.printer_name,
                "filament_used": self.variable.filament_used,
                "filament_diameter": self.variable.filament_diameter,
                "nozzle_size": self.variable.nozzle_size,
                "bed_size_x": self.variable.bed_size_x,
                "bed_size_y": self.variable.bed_size_y,
                "bed_size_z": self.variable.bed_size_z,

                "first_layer_nozzle": self.regular_nozzle,
                "regular_nozzle": self.regular_nozzle,
                "regular_bed": self.regular_bed,
                "fan_speed": self.fan_speed,
                "fan_layer": self.fan_layer,
                "first_layer_speed": self.first_layer_speed,
                "regular_speed": self.regular_speed,
                "travel_speed": self.travel_speed,
                "retraction_distance": self.retraction_distance,
                "retraction_speed": self.retraction_speed,
                "flow": self.flow,
                "abl_method": self.abl_method
            };
        }
    }

    $('#myTab a').click(function (e) {
        e.preventDefault();
        $('#myTab a[href="#setup"]').tab('show');
        $('#myTab a[href="#profiles"]').tab('show');
        $('#myTab a[href="#pid"]').tab('show');
        $('#myTab a[href="#layer"]').tab('show');
        $('#myTab a[href="#baseline"]').tab('show');
        $('#myTab a[href="#extruder"]').tab('show');
        $('#myTab a[href="#flow"]').tab('show');
        $('#myTab a[href="#current"]').tab('show');
        $('#myTab a[href="#retraction"]').tab('show');
        $('#myTab a[href="#temperature"]').tab('show');
        $('#myTab a[href="#acceleration"]').tab('show');
        $('#myTab a[href="#linear"]').tab('show');
    });

    $(document).ready(function(){
        $('[data-toggle="tooltip"]').tooltip();
    });

    $('.nav-tabs').button()

    OCTOPRINT_VIEWMODELS.push({
        construct: calibrationcompanionViewModel,
        dependencies: [  "settingsViewModel"  ],
        elements: [ "#settings_plugin_calibrationcompanion", "#setup", "#modalFooter" ]
    });
});
