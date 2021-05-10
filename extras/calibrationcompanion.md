---
layout: plugin

id: CalibrationCompanion
title: Calibration Companion
description: This plugin was created to calibrate 3D printer settings easily.
author: iFrostizz
license: AGPLv3

# TODO
date: 2021-05-10

homepage: https://github.com/iFrostizz/OctoPrint-CalibrationCompanion
source: https://github.com/iFrostizz/OctoPrint-CalibrationCompanion
archive: https://github.com/iFrostizz/OctoPrint-CalibrationCompanion/archive/master.zip

#follow_dependency_links: false

tags:
calibration
- a list
- of tags
- that apply
- to your plugin
- (take a look at the existing plugins for what makes sense here)

# TODO
screenshots:
- url: url of a screenshot, /assets/img/...
  alt: alt-text of a screenshot
  caption: caption of a screenshot
- url: url of another screenshot, /assets/img/...
  alt: alt-text of another screenshot
  caption: caption of another screenshot
- ...

# TODO
featuredimage: url of a featured image for your plugin, /assets/img/...

# TODO
# You only need the following if your plugin requires specific OctoPrint versions or
# specific operating systems to function - you can safely remove the whole
# "compatibility" block if this is not the case.

compatibility:

  # List of compatible versions
  #
  # A single version number will be interpretated as a minimum version requirement,
  # e.g. "1.3.1" will show the plugin as compatible to OctoPrint versions 1.3.1 and up.
  # More sophisticated version requirements can be modelled too by using PEP440
  # compatible version specifiers.
  #
  # You can also remove the whole "octoprint" block. Removing it will default to all
  # OctoPrint versions being supported.

  octoprint:
  - 1.2.0

  # List of compatible operating systems
  #
  # Valid values:
  #
  # - windows
  # - linux
  # - macos
  # - freebsd
  #
  # There are also two OS groups defined that get expanded on usage:
  #
  # - posix: linux, macos and freebsd
  # - nix: linux and freebsd
  #
  # You can also remove the whole "os" block. Removing it will default to all
  # operating systems being supported.

  os:
  - linux
  - windows
  - macos
  - freebsd
  
  # Compatible Python version
  #
  # Plugins should aim for compatibility for Python 2 and 3 for now, in which case the value should be ">=2.7,<4".
  #
  # Plugins that only wish to support Python 3 should set it to ">=3,<4". 
  #
  # If your plugin only supports Python 2 (worst case, not recommended for newly developed plugins since Python 2
  # is EOL), leave at ">=2.7,<3"
  
  python: ">=2.7,<4"

---

# Calibration Companion

This plugin was created to calibrate your 3D printer settings easily.
It comes really handy when you want to try a new filament for example.
Let me explain all the tabs a bit more precisely before throwing yourself in the process.

### Setup
This is the first tab you want to go to. Choose the values that fits your printer.
Please do it before attempting any operation.


![Calibration Companion Setup](setup.png)

### Profiles
In this tab, you can load/save/reset profiles. This is really great to not have to type again all the values when you get to a new tab.
I already prepared a profile for you stored in "Profile 1". Please adapt it to your needs, more precisely the start and end gcode.

##### Buttons
- Profile dropdown

Choose your profile between the 3 available. This number may change regarding your needs, please post an "issue" if you need more.
- Load button

This button will load the selected profile in the dropdown and all of its stored values.
- Save button

Using this one, you will save all the entered values that are in the input boxes to the selected profile.
- Reset button

Pressing the "reset" button will delete all the data in the input boxes, but it is not going to be saved automatically. If you want to empty the selected profile, press "save".

##### Variables
Some variable that you can use were introduced for the start and end gcode. The start gcode will be inserted just after the "ABL method" and before the nozzle placement to start the print. So make sure that the nozzle is hot! The end gcode will be inserted at the end of the print, you may want to turn off the heaters here. The variables syntax is [variable_name]. Now let's take a look to all the variables:

- printer_name
- filament_used
- filament_diameter
- nozzle_size
- bed_size_x
- bed_size_y
- bed_size_z
- first_layer_nozzle
- regular_nozzle
- regular_bed
- fan_speed
- fan_layer
- first_layer_speed
- regular_speed
- travel_speed
- retraction_distance
- retraction_speed
- flow
- abl_method

Some of them are already used in the start gcode, so maybe you can use it if you need help.

### PID Autotune
Enter the temperature for the nozzle and the bed that fits the most your need before running the PID autotune.
You can either enter just the nozzle, just the bed, or both.
You can also turn on the fans before running the PID by clicking on the radio buttons.

### First Layer
First, you may need to modify the "Extra margin from edges" values. This value will be taken in account in both the "knob_levelling.gcode" file and the "calibration.squares.gcode" file. It is used to prevent printing on anything that is on the sides of your bed, like clips.
- No ABL
If you don't have any ABL system, the button "Start Bed Levelling Routine" button will add a file to the file manager to bring the nozzle to the four corners. Then you should adjust the knobs by using a 0.1mm sheet of paper. You need to have a very light touch on all of them, and do not touch the knobs when the nozzle is on the middle of the bed.
- ABL
If you have an ABL equipment, the "ABL" part might be interesting. You will need to click on the steps and a message box will guide you. When starting the procedure, your z-offset value will be stored using the gcode command `M851` and can be restored at any moment when the procedure is reset (either clicking on the button to reset the procedure, or refresh/disconnect) the printer/server.
Step 1: The printer will home and place the nozzle at the center of the bed. Here, you will need to use the buttons placed on the right to lower or upper the nozzle and a sheet of paper to feel a very light touch on the paper. When done, click on the step 2.
Step 2: Storing the z-offset and preparing for you the "knob_levelling.gcode". The file will be placed on the file manager.
Step 3: Plot the bed and repeat the step 1.
Step 4: Storing the z-offset.
Now, you can print the final squares by exploring the bottom of the page.
Here, you can load your profile to see your settings.
The squares are made to finetune your z-offset as well as the knobs.
Don't hesitate to repeat the file until having a perfectly levelled bed.

Thanks to Critters for providing me this procedure.


### E-steps
To guide yourself in the process, please check this video:
https://www.youtube.com/watch?v=axBlXVRwt_s
Filament Path Distance corresponds to the distance that will be travelled by the filament in the extruder.
In the video, a mark is made at 120mm, minus 20mm for the measurement which gives us 100mm.
You can change this value for your convenience.
The "Get Estep Value" button will get your current steps/mm for the extruder. You can also enter a custom value.
If you want to make the filament go backwards instead, you can check the box.
The Final Estep Value will be computed and displayed in the disabled input box, and you can apply it using the Apply Final Esteps button.

### Flow
Printing a hollow cube to adjust the flow. Measure all the sides precisely several times on the middle using a caliper and average the values. Compare the average with your nozzle diameter and do this calculation:
finalFlow = (100*nozzleDiameter)/averagedMeasurement

### Retraction, Temperature, Acceleration Tuning
In this section, you can find your ideal settings per stages by creating a retraction/temperature/acceleration tower.

![Calibration Companion Retraction](retraction.png)


## Plugin Setup
Install via the bundled [Plugin Manager](https://docs.octoprint.org/en/master/bundledplugins/pluginmanager.html)
or manually using this URL:

    https://github.com/iFrostizz/OctoPrint-CalibrationCompanion/archive/master.zip

## DISCLAIMER

This plugin has been tested but could contains bugs. If you spot any of them, open an issue describing it and what happened to lead to this bug.
Please always handle it with care, import the GCodes in Cura before printing, and inspect them carefully. I will not be responsible for any physical injury.
