$(function() {
    function calibrationcompanionViewModel_pid(parameters) {
        var self = this;

        self.settingsViewModel = parameters[0];
        self.controlViewModel = parameters[1];
        self.calibrationcompanionViewModel = parameters[2];

        self.nozzle_pid_temp = ko.observable();
        self.bed_pid_temp = ko.observable();
        self.cycles_amount = ko.observable();
        self.auto_apply = ko.observable();
        self.extruderIndex = ko.observable();

        self.variable = {};

        let mainViewModel = self.calibrationcompanionViewModel;

        self.onBeforeBinding = function() {
            self.nozzle_pid_temp(self.settingsViewModel.settings.plugins.calibrationcompanion.nozzle_pid_temp());
            self.bed_pid_temp(self.settingsViewModel.settings.plugins.calibrationcompanion.bed_pid_temp());
            self.cycles_amount(self.settingsViewModel.settings.plugins.calibrationcompanion.cycles_amount());
            self.auto_apply(self.settingsViewModel.settings.plugins.calibrationcompanion.auto_apply());
            self.extruderIndex(self.settingsViewModel.settings.plugins.calibrationcompanion.extruderIndex());
        }
        
        self.onAfterBinding = function() {
            $('#autoApply').prop('checked', self.auto_apply())
        }
        
        $('#autoApply').on("input", () => {
            mainViewModel.firstTime = Date.now();
            mainViewModel.startLoading()
            mainViewModel.saveOneSettingLoading("auto_apply", $('#autoApply')[0].checked, "saved")
        })
        
        const nozzlePidTemp = $('#nozzlePidTemp');
        const bedPidTemp = $('#bedPidTemp');
        
        nozzlePidTemp.on("input", () => {
            if (nozzlePidTemp.val().length > 0) {
                bedPidTemp.val("");
                bedPidTemp.prop("disabled", true);
            } else {
                bedPidTemp.prop("disabled", false);
            }
        })
        
        bedPidTemp.on("input", () => {
            if (bedPidTemp.val().length > 0) {
                nozzlePidTemp.val("");
                nozzlePidTemp.prop("disabled", true);
            } else {
                nozzlePidTemp.prop("disabled", false);
            }
        })
        
        let cycles;
        
        let pidProcedureStarted = false;

        self.pid_autotune_routine = async function() {
            if (parseInt(self.cycles_amount()) > 0) {
                cycles = self.cycles_amount()
                if (self.nozzle_pid_temp().split(" ").join("").length !== 0 || self.bed_pid_temp().split(" ").join("").length !== 0) {
                    pidProcedureStarted = true
                    setProgressBarPercentage(0);
                    let message = "PID Autotune running. Please don't perform any action during the PID Autotune process as they are going to be queued after it is finished."
                    PNotifyShowMessage(message, false, 'alert');
                    if (self.nozzle_pid_temp().split(" ").join("").length !== 0) { //Works even if the user write empty spaces
                        OctoPrint.control.sendGcode(["M303 E0 C" + cycles + " S" + self.nozzle_pid_temp(), "M500", "M106 S0", "M104 S0"]); //Sends the autotune PID regarding the user nozzle temperature
                        //OctoPrint.settings.savePluginSettings('calibrationcompanion', {'extruderIndex': 0})
                        self.extruderIndex(0)
                        console.log("extruder")
                    } else if (self.bed_pid_temp().split(" ").join("").length !== 0) {
                        OctoPrint.control.sendGcode(["M303 E-1 C" + cycles + " S" + self.bed_pid_temp(), 'M500', "M140 S0"]) //Sends the autotune PID regarding the user bed temperature
                        //OctoPrint.settings.savePluginSettings('calibrationcompanion', {'extruderIndex': -1})
                        self.extruderIndex(-1)
                    }
                    console.log(self.extruderIndex())
                }
            } else {
                let message = "cycles_amount should be equal or over 3. got " + self.cycles_amount() + " instead."
                PNotifyShowMessage(message, true, 'error')
            }
        }
        
        function PNotifyShowMessage(message, hideBoolean, typeOfMessage) {
            self.notify = new PNotify({
                title: 'Calibration Companion',
                text: message,
                type: typeOfMessage,
                hide: hideBoolean,
                buttons: {
                    closer: true,
                    sticker: false
                },
            });
        }
        
        let lastPidPConstant, lastPidIConstant, lastPidDConstant, lastPidConstants;

        self.onDataUpdaterPluginMessage = function(plugin, message) { // Cycles >= 3
            if (plugin !== "calibrationcompanion") {
                return
            }
            if (typeof message.cycleIteration === "number") {
                setProgressBarPercentage((100 * message.cycleIteration) / cycles);
            } else if (message.pidPConstant !== undefined) {
                if (message.pidPConstant.length === 1) {
                    lastPidPConstant = message.pidPConstant
                }
            } else if (message.pidIConstant !== undefined) {
                if (message.pidIConstant.length === 1) {
                    lastPidIConstant = message.pidIConstant
                }
            } else if (message.pidDConstant !== undefined) {
                if (message.pidDConstant.length === 1) {
                    lastPidDConstant = message.pidDConstant
                }
            } else if (message.pidConstants !== undefined) {
                if (message.pidConstants.length === 3) {
                    lastPidConstants = message.pidConstants
                }
            } else if (message.status !== undefined) {
                if (message.status === "finished" && pidProcedureStarted) {
                    pidProcedureStarted = false
                    if (lastPidConstants === undefined) {
                        lastPidConstants = [lastPidPConstant, lastPidIConstant, lastPidDConstant];
                    }
                    setPidValues(lastPidConstants);
                }
            }
        }
        
        function setPidValues(pidConstants) {
            setProgressBarPercentage(0); // Set progress bar back to 0
            const [P, I, D] = [pidConstants[0], pidConstants[1], pidConstants[2]];
            if (self.auto_apply()) {
                if (self.extruderIndex() === -1) {
                    OctoPrint.control.sendGcode(["M304 P" + P + " I" + I + " D" + D, "M500"]);
                } else if (self.extruderIndex() === 0) {
                    OctoPrint.control.sendGcode(["M301 E" + self.extruderIndex() + " P" + P + " I" + I + " D" + D, "M500"]);
                } else {
                    OctoPrint.control.sendGcode(["M301 E" + self.extruderIndex() + " P" + P + " I" + I + " D" + D, "M500"]);
                }
            }
            let message = "New PID constants set!\nP:" + P + " I:" + I + " D:" + D + " for extruder: " + self.extruderIndex();
            PNotifyShowMessage(message, false, 'info');
            lastPidConstants = undefined;
            [lastPidPConstant, lastPidIConstant, lastPidDConstant] = [undefined, undefined, undefined];
        }

        function setProgressBarPercentage(value) {
            if (typeof value === "number") {
                if (value > 100) {
                    value = 100
                    document.getElementById("pid-progress-bar").parentNode.className = "progress progress-striped";
                } else if (value < 0) {
                    value = 0
                } else {
                    document.getElementById("pid-progress-bar").parentNode.className = "progress progress-striped active";
                }
                document.getElementById("pid-progress-bar").style.width = value + "%";
            } else {
                console.error(value + " is not valid for PID progress bar.");
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
        dependencies: [  "settingsViewModel", "controlViewModel", "calibrationcompanionViewModel"  ],
        elements: [ "#pid-calibrationcompanion" ]
    });
});
