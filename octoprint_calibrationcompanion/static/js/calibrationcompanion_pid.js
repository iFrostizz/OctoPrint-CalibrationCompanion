$(function() {
    function calibrationcompanionViewModel_pid(parameters) {
        var self = this;

        self.settingsViewModel = parameters[0];
        self.calibrationcompanionViewModel = parameters[1];

        self.nozzle_pid_temp = ko.observable();
        self.bed_pid_temp = ko.observable();

        self.variable = {};

        let mainViewModel = self.calibrationcompanionViewModel;

        self.onBeforeBinding = function() {
            self.nozzle_pid_temp(self.settingsViewModel.settings.plugins.calibrationcompanion.nozzle_pid_temp());
            self.bed_pid_temp(self.settingsViewModel.settings.plugins.calibrationcompanion.bed_pid_temp());
        }

        document.getElementById("bedPidTemp").onmouseover = function() {
            $('#aboutBedPid').tooltip('show');
        }

        document.getElementById("bedPidTemp").onmouseleave = function() {
            $('#aboutBedPid').tooltip('hide');
        }


        self.pid_autotune_routine = function() {
            OctoPrint.control.sendGcode(['M303 E0 S' + self.nozzle_pid_temp() + ' U1', 'M500']); //Sends the autotune PID regarding the user nozzle temperature
            OctoPrint.control.sendGcode(['M106 S0']) //Turns off the fans if activated
            if (self.bed_pid_temp().split(" ").join("").length !== 0) { //Works even if the user write empty spaces
                OctoPrint.control.sendGcode(['M303 E-1 S' + self.bed_pid_temp() + ' U1', 'M500']) //Sends the autotune PID regarding the user bed temperature
            }
        }

        self.fan_trigger_on = function() {
            OctoPrint.control.sendGcode(['M106 S255'])
        }
        self.fan_trigger_off = function() {
            OctoPrint.control.sendGcode(['M106 S0'])
            //OctoPrint.printer.getFullState().then(console.log(readyState));
        }
    }

    OCTOPRINT_VIEWMODELS.push({
        construct: calibrationcompanionViewModel_pid,
        dependencies: [  "settingsViewModel", "calibrationcompanionViewModel"  ],
        elements: [ "#settings_plugin_calibrationcompanion", "#pid" ]
    });
});
