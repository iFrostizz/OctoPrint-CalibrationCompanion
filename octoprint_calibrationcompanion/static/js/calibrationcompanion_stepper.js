$(function() {
    function calibrationcompanionViewModel_stepper(parameters) {
        var self = this;

        self.settingsViewModel = parameters[0];
        self.calibrationcompanionViewModel = parameters[1];

        self.stepper_imax = ko.observable()
        self.driver_select = ko.observable()
        self.rsense = ko.observable()

        let mainViewModel = self.calibrationcompanionViewModel;

        self.onBeforeBinding = function() {
            self.stepper_imax(self.settingsViewModel.settings.plugins.calibrationcompanion.stepper_imax())
            self.driver_select(self.settingsViewModel.settings.plugins.calibrationcompanion.driver_select())
            self.rsense(self.settingsViewModel.settings.plugins.calibrationcompanion.rsense())
        }

        let myParent;
        let myBase = [];
        let selectList = [];
        let inputListImax = [];
        let inputListInom = [];
        let inputListRsense = [];
        let inputListVref = [];
        const axis = ["X", "Y", "Z", "E"]
        let actualId;
        let option;
        let calculatedVref;
        const array = ["A4988", "DRV8825", "TMC2208", "TMC2209", "TMC2130", "TMC2100"];

        let d=0;

        self.addDriver = function() {
            d++;
            myParent = document.getElementById("driverUsed");

            myBase[d] = document.createElement("div")
            myBase[d].id = "myBase" + d;

            if (d <= 4) {
                myBase[d].append("Driver " + axis[d - 1])
            }
            else {
                myBase[d].append("Driver " + d)
            }

            myParent.appendChild(myBase[d]);

            myBase[d].appendChild(mainViewModel.whitespace.cloneNode())

            selectList[d] = document.createElement("select");
            selectList[d].value = self.driver_select();
            selectList[d].id = "mySelect" + d;
            selectList[d].className = "midsizeTextbox"
            myBase[d].appendChild(selectList[d]);

            for (let i = 0; i < array.length; i++) {
                option = document.createElement("option");
                option.value = array[i];
                option.text = array[i];
                selectList[d].appendChild(option);
            }

            myBase[d].appendChild(mainViewModel.whitespace2.cloneNode())

            inputListImax[d] = document.createElement("input");
            inputListImax[d].type = "text";
            inputListImax[d].id = "inputListImax" + d;
            inputListImax[d].value = self.stepper_imax();
            inputListImax[d].className = "midsizeTextbox"
            myBase[d].appendChild(inputListImax[d])

            myBase[d].appendChild(mainViewModel.whitespace2.cloneNode())

            inputListInom[d] = document.createElement("input");
            inputListInom[d].type = "text";
            inputListInom[d].id = "inputListInom" + d;
            inputListInom[d].value = Math.round(inputListImax[d].value/Math.sqrt(2)*1000)/1000;
            inputListInom[d].className = "midsizeTextbox"
            myBase[d].appendChild(inputListInom[d])

            myBase[d].appendChild(mainViewModel.whitespace2.cloneNode())

            inputListRsense[d] = document.createElement("input");
            inputListRsense[d].type = "text";
            inputListRsense[d].id = "inputListRsense" + d;
            inputListRsense[d].value = self.rsense();
            inputListRsense[d].className = "midsizeTextbox"
            myBase[d].appendChild(inputListRsense[d])

            myBase[d].appendChild(mainViewModel.whitespace2.cloneNode())

            inputListVref[d] = document.createElement("input");
            inputListVref[d].type = "text";
            inputListVref[d].id = "inputListVref" + d;
            self.vrefCalculation(selectList[d].value, inputListInom[d].value, inputListRsense[d].value)
            inputListVref[d].value = calculatedVref;
            inputListVref[d].className = "midsizeTextbox";
            myBase[d].appendChild(inputListVref[d]);
            document.getElementById(inputListVref[d].id).disabled = true;
        }
        self.removeDriver = function() {
            if (Math.sign(d) === 1) {
                myBase[d].remove();
                d = d - 1;
            } else {
                d = 0;
            }
        }

        self.vrefCalculation = function(Driver, Inom, Rsense) {
            switch (Driver) {
                case "A4988":
                    calculatedVref = Inom * 8 * Rsense
                    break
                case "DRV8825":
                    calculatedVref = Inom * 5 * Rsense
                    break
                case "TMC2208":
                    calculatedVref = Math.round((Inom*2.5*(parseFloat(Rsense)+0.02)*1000)/(0.325))/1000;
                    break
                case "TMC2209":
                    calculatedVref = Math.round((Inom*2.5*(parseFloat(Rsense)+0.02)*1000)/(0.325))/1000;
                    break
                case "TMC2130":
                    calculatedVref = Math.round((Inom*2.5*(parseFloat(Rsense)+0.02)*1000)/(0.325))/1000;
                    break
                case "TMC2100":
                    calculatedVref = Math.round((Inom*2.5*(parseFloat(Rsense)+0.02)*1000)/(0.325))/1000;
                    break
            }
            return calculatedVref.toFixed(4)
        }


        document.addEventListener('input', function(e) {
            let readStr = e.target.id;
            if (readStr.startsWith("inputListImax")) {
                actualId = readStr.replace( /^\D+/g, '');
                if (inputListImax[actualId].value >= 2 && selectList[actualId].value === "A4988") {
                document.getElementById(inputListImax[actualId].id).style.backgroundColor = "red";
            }
            else if (inputListImax[actualId].value >= 2.5 && selectList[actualId].value === "DRV8825") {
                document.getElementById(inputListImax[actualId].id).style.backgroundColor = "red";
            }
            else {
                document.getElementById(inputListImax[actualId].id).style.backgroundColor = null;
                }
                inputListInom[actualId].value = Math.round(inputListImax[actualId].value/Math.sqrt(2)*1000)/1000;
            } else if (readStr.startsWith("mySelect")) {
                triggered(readStr)
            }
        }, false);

        document.addEventListener('input', function(e) {
            let readStr = e.target.id;
            if (readStr.startsWith("inputListImax") || readStr.startsWith("inputListRsense")) {
                triggered(readStr);
            }
            if (readStr.startsWith("inputListInom")) {
                actualId = readStr.replace( /^\D+/g, '');
                inputListImax[actualId].value = Math.round(inputListInom[actualId].value*Math.sqrt(2)*1000)/1000;
                triggered(readStr);
            }
        }, false);

        function triggered(readStr) {
            actualId = readStr.replace( /^\D+/g, '');
            self.vrefCalculation(selectList[actualId].value, inputListInom[actualId].value, inputListRsense[actualId].value)
            inputListVref[actualId].value = calculatedVref;
        }
    }

    OCTOPRINT_VIEWMODELS.push({
        construct: calibrationcompanionViewModel_stepper,
        dependencies: [  "settingsViewModel", "calibrationcompanionViewModel"  ],
        elements: [ "#current-calibrationcompanion" ]
    });
});
