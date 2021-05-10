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

        self.onBeforeBinding = function () {
            self.profile_selection(self.settingsViewModel.settings.plugins.calibrationcompanion.profile_selection());
            self.first_layer_nozzle_profile1(self.settingsViewModel.settings.plugins.calibrationcompanion.first_layer_nozzle_profile1());
            self.regular_nozzle_profile1(self.settingsViewModel.settings.plugins.calibrationcompanion.regular_nozzle_profile1());
            self.regular_bed_profile1(self.settingsViewModel.settings.plugins.calibrationcompanion.regular_bed_profile1());
            self.fan_speed_profile1(self.settingsViewModel.settings.plugins.calibrationcompanion.fan_speed_profile1());
            self.fan_layer_profile1(self.settingsViewModel.settings.plugins.calibrationcompanion.fan_layer_profile1());
            self.regular_speed_profile1(self.settingsViewModel.settings.plugins.calibrationcompanion.regular_speed_profile1());
            self.travel_speed_profile1(self.settingsViewModel.settings.plugins.calibrationcompanion.travel_speed_profile1());
            self.retraction_dist_profile1(self.settingsViewModel.settings.plugins.calibrationcompanion.retraction_dist_profile1());
            self.retraction_speed_profile1(self.settingsViewModel.settings.plugins.calibrationcompanion.retraction_speed_profile1());
            self.flow_profile1(self.settingsViewModel.settings.plugins.calibrationcompanion.flow_profile1());
            self.abl_method_profile1(self.settingsViewModel.settings.plugins.calibrationcompanion.abl_method_profile1());
            self.start_gcode_profile1(self.settingsViewModel.settings.plugins.calibrationcompanion.start_gcode_profile1());
            self.end_gcode_profile1(self.settingsViewModel.settings.plugins.calibrationcompanion.end_gcode_profile1());

            self.first_layer_nozzle_profile2(self.settingsViewModel.settings.plugins.calibrationcompanion.first_layer_nozzle_profile2());
            self.regular_nozzle_profile2(self.settingsViewModel.settings.plugins.calibrationcompanion.regular_nozzle_profile2());
            self.regular_bed_profile2(self.settingsViewModel.settings.plugins.calibrationcompanion.regular_bed_profile2());
            self.fan_speed_profile2(self.settingsViewModel.settings.plugins.calibrationcompanion.fan_speed_profile2());
            self.fan_layer_profile2(self.settingsViewModel.settings.plugins.calibrationcompanion.fan_layer_profile2());
            self.regular_speed_profile2(self.settingsViewModel.settings.plugins.calibrationcompanion.regular_speed_profile2());
            self.travel_speed_profile2(self.settingsViewModel.settings.plugins.calibrationcompanion.travel_speed_profile2());
            self.retraction_dist_profile2(self.settingsViewModel.settings.plugins.calibrationcompanion.retraction_dist_profile2());
            self.retraction_speed_profile2(self.settingsViewModel.settings.plugins.calibrationcompanion.retraction_speed_profile2());
            self.flow_profile2(self.settingsViewModel.settings.plugins.calibrationcompanion.flow_profile2());
            self.abl_method_profile2(self.settingsViewModel.settings.plugins.calibrationcompanion.abl_method_profile2());
            self.start_gcode_profile2(self.settingsViewModel.settings.plugins.calibrationcompanion.start_gcode_profile2());
            self.end_gcode_profile2(self.settingsViewModel.settings.plugins.calibrationcompanion.end_gcode_profile2());

            self.first_layer_nozzle_profile3(self.settingsViewModel.settings.plugins.calibrationcompanion.first_layer_nozzle_profile3());
            self.regular_nozzle_profile3(self.settingsViewModel.settings.plugins.calibrationcompanion.regular_nozzle_profile3());
            self.regular_bed_profile3(self.settingsViewModel.settings.plugins.calibrationcompanion.regular_bed_profile3());
            self.fan_speed_profile3(self.settingsViewModel.settings.plugins.calibrationcompanion.fan_speed_profile3());
            self.fan_layer_profile3(self.settingsViewModel.settings.plugins.calibrationcompanion.fan_layer_profile3());
            self.regular_speed_profile3(self.settingsViewModel.settings.plugins.calibrationcompanion.regular_speed_profile3());
            self.travel_speed_profile3(self.settingsViewModel.settings.plugins.calibrationcompanion.travel_speed_profile3());
            self.retraction_dist_profile3(self.settingsViewModel.settings.plugins.calibrationcompanion.retraction_dist_profile3());
            self.retraction_speed_profile3(self.settingsViewModel.settings.plugins.calibrationcompanion.retraction_speed_profile3());
            self.flow_profile3(self.settingsViewModel.settings.plugins.calibrationcompanion.flow_profile3());
            self.abl_method_profile3(self.settingsViewModel.settings.plugins.calibrationcompanion.abl_method_profile3());
            self.start_gcode_profile3(self.settingsViewModel.settings.plugins.calibrationcompanion.start_gcode_profile3());
            self.end_gcode_profile3(self.settingsViewModel.settings.plugins.calibrationcompanion.end_gcode_profile3());
        }

        let restrictedInputsProfile = ["abl-method-profile", "end-gcode-profile", "fan-layer-profile", "fan-speed-profile", "first-layer-nozzle-profile",
            "first-layer-speed-profile", "flow-profile", "regular-bed-profile", "regular-nozzle-profile", "regular-speed-profile", "retraction-dist-profile",
            "retraction-speed-profile", "start-gcode-profile", "travel-speed-profile"];
        let restrictedSettingsProfile = ["abl_method", "end_gcode", "fan_layer", "fan_speed", "first_layer_nozzle",
            "first_layer_speed", "flow", "regular_bed", "regular_nozzle", "regular_speed", "retraction_dist",
            "retraction_speed", "start_gcode", "travel_speed"];
        let saveSettingsProfile

        let restrictedInputsProfileClassic = ["first-layer-nozzle-profile", "regular-nozzle-profile", "regular-bed-profile", "fan-speed-profile",
            "fan-layer-profile", "first-layer-speed-profile", "regular-speed-profile", "travel-speed-profile"];
        let restrictedInputsProfileComma = ["retraction-dist-profile", "retraction-speed-profile", "flow-profile"];

        document.getElementById("load-profile").onclick = function () {
            let div;
            OctoPrint.settings.getPluginSettings('calibrationcompanion').done(function (response) {
                let z = 0;
                for (let x = 0; x < Object.keys(response).length; x++) {
                    if (self.profile_selection() !== "" && restrictedSettingsProfile[z] !== undefined && Object.keys(response)[x].includes(self.profile_selection())) {
                        saveSettingsProfile = restrictedInputsProfile[z] + "_" + self.profile_selection();
                        document.getElementById(restrictedInputsProfile[z]).value = Object.values(response)[x];
                        z++
                    }
                }
            }).then(function () {
                for (let x = 0; x < restrictedInputsProfile.length; x++) {
                    div = document.getElementById(restrictedInputsProfile[x])
                    let element = div.parentNode.parentNode.parentNode;
                    if (restrictedInputsProfileClassic.includes(div.id)) {
                        mainViewModel.checkValue(div, element, mainViewModel.allowedArrayClassic);
                    } else if (restrictedInputsProfileComma.includes(div.id)) {
                        mainViewModel.checkValue(div, element, mainViewModel.allowedArrayComma);
                    }
                }
            });

        }

        document.getElementById("save-profile").onclick = function () {
            let el = document.getElementById("profiles-calibrationcompanion").getElementsByClassName("control-group");
            let array = [];
            let boolEror = false
            for (let x = 0; x < el.length; x++) {
                array[x] = el[x].attributes[0].nodeValue;
                if (array[x].includes("error")) {
                    boolEror = true
                }
            }
            if (!boolEror) {
                OctoPrint.settings.getPluginSettings('calibrationcompanion').done(function (response) {
                    let z = 0;
                    for (let x = 0; x < Object.keys(response).length; x++) {
                        if (self.profile_selection() !== "" && restrictedSettingsProfile[z] !== undefined && Object.keys(response)[x].includes(self.profile_selection())) {
                            saveSettingsProfile = restrictedSettingsProfile[z] + "_" + self.profile_selection();
                            OctoPrint.settings.savePluginSettings('calibrationcompanion', {
                                [saveSettingsProfile]: document.getElementById(restrictedInputsProfile[z]).value
                            })
                            z++;
                        }
                    }
                });
            } else {
                mainViewModel.errorMessage()
            }
        }

        document.getElementById("reset-profile").onclick = function() {
            for (let x=0; x < restrictedInputsProfile.length; x++) {
                document.getElementById(restrictedInputsProfile[x]).value = "";
            }
        }
    }

    OCTOPRINT_VIEWMODELS.push({
        construct: calibrationcompanionViewModel_profiles,
        dependencies: [  "settingsViewModel", "calibrationcompanionViewModel"  ],
        elements: [ "#profiles-calibrationcompanion" ]
    });
});
