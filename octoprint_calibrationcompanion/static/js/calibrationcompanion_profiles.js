$(function() {
    function calibrationcompanionViewModel_profiles(parameters) {
        var self = this;

        self.settingsViewModel = parameters[0];
        self.calibrationcompanionViewModel = parameters[1];

        self.profile_selection = ko.observable();

        self.first_layer_nozzle_profile1 = ko.observable();
        self.regular_nozzle_profile1 = ko.observable();
        self.regular_bed_profile1 = ko.observable();
        self.fan_speed_profile1 = ko.observable();
        self.fan_layer_profile1 = ko.observable();
        self.first_layer_speed_profile1 = ko.observable();
        self.regular_speed_profile1 = ko.observable();
        self.travel_speed_profile1 = ko.observable();
        self.retraction_dist_profile1 = ko.observable();
        self.retraction_speed_profile1 = ko.observable();
        self.flow_profile1 = ko.observable();
        self.abl_method_profile1 = ko.observable();
        self.start_gcode_profile1 = ko.observable();
        self.end_gcode_profile1 = ko.observable();

        self.first_layer_nozzle_profile2 = ko.observable();
        self.regular_nozzle_profile2 = ko.observable();
        self.regular_bed_profile2 = ko.observable();
        self.fan_speed_profile2 = ko.observable();
        self.fan_layer_profile2 = ko.observable();
        self.first_layer_speed_profile2 = ko.observable();
        self.regular_speed_profile2 = ko.observable();
        self.travel_speed_profile2 = ko.observable();
        self.retraction_dist_profile2 = ko.observable();
        self.retraction_speed_profile2 = ko.observable();
        self.flow_profile2 = ko.observable();
        self.abl_method_profile2 = ko.observable();
        self.start_gcode_profile2 = ko.observable();
        self.end_gcode_profile2 = ko.observable();

        self.first_layer_nozzle_profile3 = ko.observable();
        self.regular_nozzle_profile3 = ko.observable();
        self.regular_bed_profile3 = ko.observable();
        self.fan_speed_profile3 = ko.observable();
        self.fan_layer_profile3 = ko.observable();
        self.first_layer_speed_profile3 = ko.observable();
        self.regular_speed_profile3 = ko.observable();
        self.travel_speed_profile3 = ko.observable();
        self.retraction_dist_profile3 = ko.observable();
        self.retraction_speed_profile3 = ko.observable();
        self.flow_profile3 = ko.observable();
        self.abl_method_profile3 = ko.observable();
        self.start_gcode_profile3 = ko.observable();
        self.end_gcode_profile3 = ko.observable();

        self.variable = {};

        let mainViewModel = self.calibrationcompanionViewModel;

        let pluginSettings;

        self.onBeforeBinding = function () {
            pluginSettings = self.settingsViewModel.settings.plugins.calibrationcompanion;
            self.profile_selection(pluginSettings.profile_selection());
            self.first_layer_nozzle_profile1(pluginSettings.first_layer_nozzle_profile1());
            self.regular_nozzle_profile1(pluginSettings.regular_nozzle_profile1());
            self.regular_bed_profile1(pluginSettings.regular_bed_profile1());
            self.fan_speed_profile1(pluginSettings.fan_speed_profile1());
            self.fan_layer_profile1(pluginSettings.fan_layer_profile1());
            self.regular_speed_profile1(pluginSettings.regular_speed_profile1());
            self.travel_speed_profile1(pluginSettings.travel_speed_profile1());
            self.retraction_dist_profile1(pluginSettings.retraction_dist_profile1());
            self.retraction_speed_profile1(pluginSettings.retraction_speed_profile1());
            self.flow_profile1(pluginSettings.flow_profile1());
            self.abl_method_profile1(pluginSettings.abl_method_profile1());
            self.start_gcode_profile1(pluginSettings.start_gcode_profile1());
            self.end_gcode_profile1(pluginSettings.end_gcode_profile1());

            self.first_layer_nozzle_profile2(pluginSettings.first_layer_nozzle_profile2());
            self.regular_nozzle_profile2(pluginSettings.regular_nozzle_profile2());
            self.regular_bed_profile2(pluginSettings.regular_bed_profile2());
            self.fan_speed_profile2(pluginSettings.fan_speed_profile2());
            self.fan_layer_profile2(pluginSettings.fan_layer_profile2());
            self.regular_speed_profile2(pluginSettings.regular_speed_profile2());
            self.travel_speed_profile2(pluginSettings.travel_speed_profile2());
            self.retraction_dist_profile2(pluginSettings.retraction_dist_profile2());
            self.retraction_speed_profile2(pluginSettings.retraction_speed_profile2());
            self.flow_profile2(pluginSettings.flow_profile2());
            self.abl_method_profile2(pluginSettings.abl_method_profile2());
            self.start_gcode_profile2(pluginSettings.start_gcode_profile2());
            self.end_gcode_profile2(pluginSettings.end_gcode_profile2());

            self.first_layer_nozzle_profile3(pluginSettings.first_layer_nozzle_profile3());
            self.regular_nozzle_profile3(pluginSettings.regular_nozzle_profile3());
            self.regular_bed_profile3(pluginSettings.regular_bed_profile3());
            self.fan_speed_profile3(pluginSettings.fan_speed_profile3());
            self.fan_layer_profile3(pluginSettings.fan_layer_profile3());
            self.regular_speed_profile3(pluginSettings.regular_speed_profile3());
            self.travel_speed_profile3(pluginSettings.travel_speed_profile3());
            self.retraction_dist_profile3(pluginSettings.retraction_dist_profile3());
            self.retraction_speed_profile3(pluginSettings.retraction_speed_profile3());
            self.flow_profile3(pluginSettings.flow_profile3());
            self.abl_method_profile3(pluginSettings.abl_method_profile3());
            self.start_gcode_profile3(pluginSettings.start_gcode_profile3());
            self.end_gcode_profile3(pluginSettings.end_gcode_profile3());
        }

        let restrictedInputsProfile = ["abl-method-profile", "end-gcode-profile", "fan-layer-profile", "fan-speed-profile", "first-layer-nozzle-profile",
            "first-layer-speed-profile", "flow-profile", "regular-bed-profile", "regular-nozzle-profile", "regular-speed-profile", "retraction-dist-profile",
            "retraction-speed-profile", "start-gcode-profile", "travel-speed-profile"];
        let restrictedSettingsProfile = ["abl_method", "end_gcode", "fan_layer", "fan_speed", "first_layer_nozzle",
            "first_layer_speed", "flow", "regular_bed", "regular_nozzle", "regular_speed", "retraction_dist",
            "retraction_speed", "start_gcode", "travel_speed"];
        let restrictedInputsProfileClassic = ["first-layer-nozzle-profile", "regular-nozzle-profile", "regular-bed-profile", "fan-speed-profile",
            "fan-layer-profile", "first-layer-speed-profile", "regular-speed-profile", "travel-speed-profile"];
        let restrictedInputsProfileComma = ["retraction-dist-profile", "retraction-speed-profile", "flow-profile"];
        let saveSettingsProfile

        document.getElementById("load-profile").onclick = function () {
            if (self.profile_selection() !== "") {
                mainViewModel.startLoading();
                for (let x = 0; x < restrictedSettingsProfile.length; x++) {
                    saveSettingsProfile = restrictedSettingsProfile[x] + "_" + self.profile_selection();
                    if (pluginSettings[saveSettingsProfile]() !== undefined) {
                        document.getElementById(restrictedInputsProfile[x]).value = pluginSettings[saveSettingsProfile]();
                    }
                    let element = document.getElementById(restrictedInputsProfile[x])
                    let div = element.parentNode.parentNode.parentNode;
                    if (restrictedInputsProfileClassic.includes(element.id)) {
                        mainViewModel.checkValue(element, div, mainViewModel.allowedArrayClassic);
                    } else if (restrictedInputsProfileComma.includes(element.id)) {
                        mainViewModel.checkValue(element, div, mainViewModel.allowedArrayComma);
                    }
                }
                mainViewModel.stopLoading();
            } else {
                self.PNotify = new PNotify(mainViewModel.PNotifyData.noProfileMessage)
            }
        }

        document.getElementById("save-profile").onclick = function () {
            let el = document.getElementById("profiles-calibrationcompanion").getElementsByClassName("control-group");
            let array = [];
            let boolError = false;
            for (let x = 0; x < el.length; x++) {
                array[x] = el[x].attributes[0].nodeValue;
                if (array[x].includes("error")) {
                    boolError = true;
                }
            }
            if (!boolError) {
                if (self.profile_selection() !== "") {
                    for (let x = 0; x < restrictedSettingsProfile.length; x++) {
                        saveSettingsProfile = restrictedSettingsProfile[x] + "_" + self.profile_selection();
                        pluginSettings[saveSettingsProfile](document.getElementById(restrictedInputsProfile[x]).value);
                    }
                } else {
                    self.PNotify = new PNotify(mainViewModel.PNotifyData.noProfileMessage)
                }
            } else {
                self.PNotify = new PNotify(mainViewModel.PNotifyData.errorMessage)
            }
        }

        document.getElementById("reset-profile").onclick = function() {
            for (let x=0; x < restrictedInputsProfile.length; x++) {
                let element = document.getElementById(restrictedInputsProfile[x])
                let div = element.parentNode.parentNode.parentNode;
                element.value = "";
                mainViewModel.removeWarning(div);
            }
        }
    }

    OCTOPRINT_VIEWMODELS.push({
        construct: calibrationcompanionViewModel_profiles,
        dependencies: [  "settingsViewModel", "calibrationcompanionViewModel"  ],
        elements: [ "#profiles-calibrationcompanion" ]
    });
});
