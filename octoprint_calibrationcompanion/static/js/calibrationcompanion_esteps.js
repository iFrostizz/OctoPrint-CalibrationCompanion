$(function() {

    function calibrationcompanionViewModel_esteps(parameters) {
        var self = this;

        self.settingsViewModel = parameters[0];
        self.calibrationcompanionViewModel = parameters[1];

        self.actual_estep_value = ko.observable();
        self.final_estep_value = ko.observable();
        self.measured_distance = ko.observable();
        self.filament_path_distance = ko.observable();

        self.variable = {};

        let mainViewModel = self.calibrationcompanionViewModel;

        self.onBeforeBinding = function() {
            self.actual_estep_value(self.settingsViewModel.settings.plugins.calibrationcompanion.actual_estep_value())
            self.final_estep_value(self.settingsViewModel.settings.plugins.calibrationcompanion.final_estep_value())
            self.measured_distance(self.settingsViewModel.settings.plugins.calibrationcompanion.measured_distance())
            self.filament_path_distance(self.settingsViewModel.settings.plugins.calibrationcompanion.filament_path_distance())
        }

        self.onAfterBinding = function() {
            self.final_estep_calculation();
            //self.final_estep_value(final_estep_value)
        }

        self.get_esteps = function() {
            OctoPrint.control.sendGcode(["M92"])
            OctoPrint.settings.getPluginSettings('calibrationcompanion').done(function (response) {
                document.getElementById("actual-estep").value = response["current_e_steps"]
                self.actual_estep_value(response["current_e_steps"])
                //console.log(self.actual_estep_value())
                self.final_estep_calculation();
            })
        }

        self.feed_filament = function() {
            if (!document.getElementById("reverse-extruder").checked) {
                OctoPrint.control.sendGcode(["M117 Feeding " + self.filament_path_distance() +  "mm"])
                OctoPrint.control.sendGcode(["M83", "G1 E" + self.filament_path_distance() + " F50", "G90"])
                OctoPrint.control.sendGcode(["M117 Feeding finished!"])
            } else {
                OctoPrint.control.sendGcode(["M117 Retracting " + self.filament_path_distance() +  "mm"])
                OctoPrint.control.sendGcode(["M83", "G1 E-" + self.filament_path_distance() + " F50", "G90"])
                OctoPrint.control.sendGcode(["M117 Retracting finished!"])
            }
        }

        let restrictedInputsEsteps = ["#filament-path-distance", "#measured-distance", "#actual-estep"];
        let saveInputsEsteps = ["filament_path_distance", "measured_distance", "actual_estep_value"];

        $(restrictedInputsEsteps.join(",")).on("input", function() {
            let saveSettingsEsteps = saveInputsEsteps[restrictedInputsEsteps.indexOf('#' + this.id)]
            OctoPrint.settings.savePluginSettings('calibrationcompanion', {
                [saveSettingsEsteps]: this.value}).done(function () {
                self.final_estep_calculation()
            })
        });

        let final_estep_value;
        /*$("#actual-estep").on("input", function() {
            self.actual_estep_value($(this).val())
            self.final_estep_calculation();
        });
        $("#measured-distance").on("input", function() {
            self.measured_distance($(this).val())
            self.final_estep_calculation();
        });*/

        let actual_estep_value, filament_path_distance, measured_distance;
        self.final_estep_calculation = function() {
            OctoPrint.settings.getPluginSettings('calibrationcompanion').done(function (response) {
                actual_estep_value = response["actual_estep_value"];
                filament_path_distance = response["filament_path_distance"];
                measured_distance = response["measured_distance"];
                final_estep_value = (actual_estep_value * (filament_path_distance/(parseFloat(filament_path_distance)+20-measured_distance))).toFixed(2)
                self.final_estep_value(final_estep_value)
            })
        }

        self.apply_final_estep = function() {
            OctoPrint.control.sendGcode(["M92 E" + self.final_estep_value(), "M500"])
        }
    }

    OCTOPRINT_VIEWMODELS.push({
        construct: calibrationcompanionViewModel_esteps,
        dependencies: [  "settingsViewModel", "calibrationcompanionViewModel"  ],
        elements: [ "#settings_plugin_calibrationcompanion", "#extruder" ]
    });
});