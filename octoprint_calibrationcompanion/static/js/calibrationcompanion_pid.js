$(function() {
    function calibrationcompanionViewModel_pid(parameters) {
        var self = this;

        self.settingsViewModel = parameters[0];
        self.calibrationcompanionViewModel = parameters[1];

        self.nozzle_pid_temp = ko.observable();
        self.bed_pid_temp = ko.observable();
        self.cycles_amount = ko.observable();

        self.variable = {};

        let mainViewModel = self.calibrationcompanionViewModel;

        self.onBeforeBinding = function() {
            self.nozzle_pid_temp(self.settingsViewModel.settings.plugins.calibrationcompanion.nozzle_pid_temp());
            self.bed_pid_temp(self.settingsViewModel.settings.plugins.calibrationcompanion.bed_pid_temp());
            self.cycles_amount(self.settingsViewModel.settings.plugins.calibrationcompanion.cycles_amount());
        }

        document.getElementById("bedPidTemp").onmouseover = function() {
            $('#aboutBedPid').tooltip('show');
        }

        document.getElementById("bedPidTemp").onmouseleave = function() {
            $('#aboutBedPid').tooltip('hide');
        }

        self.pid_autotune_routine = function() {
            if (self.nozzle_pid_temp().split(" ").join("").length !== 0 || self.bed_pid_temp().split(" ").join("").length !== 0 && self.cycles_amount().split(" ").join("").length !== 0) {
                //setProgressBarPercentage(0);
                pidAlert();
                if (self.nozzle_pid_temp().split(" ").join("").length !== 0) { //Works even if the user write empty spaces
                    OctoPrint.control.sendGcode(["M303 E0 C" + self.cycles_amount() + " S" + self.nozzle_pid_temp(), 'M500']); //Sends the autotune PID regarding the user nozzle temperature
                    OctoPrint.control.sendGcode(["M106 S0"]) //Turns off the fans if activated
                }
                if (self.bed_pid_temp().split(" ").join("").length !== 0) {
                    OctoPrint.control.sendGcode(["M303 E-1 C" + self.cycles_amount() + " S" + self.bed_pid_temp(), 'M500']) //Sends the autotune PID regarding the user bed temperature
                }
            }
        }

        function pidAlert() {
            self.notify = new PNotify({
                title: 'Calibration Companion',
                text: "PID Autotune running. Please don't perform any action during the PID Autotune process as they are going to be queued after it is finished.",
                type: 'alert',
                hide: false,
                buttons: {
                    closer: true,
                    sticker: false
                },
            });
        }
        
        self.onDataUpdaterPluginMessage = function(plugin, message) {
            if (plugin !== "calibrationcompanion" || typeof message.cycleIteration !== "number"){
                return
            }
            console.log((100*message.cycleIteration)/self.cycles_amount())
            //setProgressBarPercentage((100*message.cycleIteration)/self.cycles_amount());
        }

        function setProgressBarPercentage(value) {
            if (typeof value === "number") {
                if (value > 100) {
                    value = 100
                } else if (value < 0) {
                    value = 0
                }
            document.getElementById("pid-progress-bar").style.width = value + "%";
            } else {
                    console.log(value + " is not valid for PID progress bar.");
                }
        }

        self.fan_trigger_on = function() {
            OctoPrint.control.sendGcode(['M106 S255'])
        }
        self.fan_trigger_off = function() {
            OctoPrint.control.sendGcode(['M106 S0'])
        }
    }

    OCTOPRINT_VIEWMODELS.push({
        construct: calibrationcompanionViewModel_pid,
        dependencies: [  "settingsViewModel", "calibrationcompanionViewModel"  ],
        elements: [ "#pid-calibrationcompanion" ]
    });
});
