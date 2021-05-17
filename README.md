# Calibration Companion

This plugin was created to calibrate your 3D printer settings easily.
It comes really handy when you want to try a new filament for instance.
Let me explain all the tabs a bit more precisely before throwing yourself in the process.

### Setup
This is the first tab you want to go to. Choose the values that fits your printer.
Please do it before attempting any operation.


![Calibration Companion Setup](setup.png)
*Setup tab*

### Profiles
In this tab, you can load/save/reset profiles. This is really great so that you do not have to type again all the values when you get to a new tab.
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
Some variables that you can use were introduced for the start and end gcode. The start gcode will be inserted just after the "ABL method" and before the nozzle placement to start the print. So make sure that the nozzle is hot! The end gcode will be inserted at the end of the print, you may want to turn off the heaters here. The variables syntax is [variable_name]. Now let's take a look to all the variables:

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

Some of them are already used in the start and end gcode, so maybe you can use it if you need help.

### PID Autotune
Enter the temperature for the nozzle and the bed that fits the most your need before running the PID autotune.
You can either enter just the nozzle, just the bed, or both.
You can also turn on the fans before running the PID by clicking on the radio buttons.

### First Layer
First, you may need to modify the "Extra margin from edges" values. This value will be taken in account in both the "knob_levelling.gcode" file and the "calibration_squares.gcode" file. It is used to prevent printing on anything that is on the sides of your bed, like clips.
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
*Retraction tower example*


## Plugin Setup
Install via the bundled [Plugin Manager](https://docs.octoprint.org/en/master/bundledplugins/pluginmanager.html)
or manually using this URL:

    https://github.com/iFrostizz/OctoPrint-CalibrationCompanion/archive/master.zip

### Credits

Huge thanks to Teaching Tech for his tutorials that helped me a lot to write this plugin.
I borrowed him some images, like the retraction and temperature towers ones.
You can find his great work here: https://teachingtechyt.github.io/index.html

I used the acceleration tower file from Teaching Tech as well: https://www.thingiverse.com/thing:4169896

This is the temperature tower file I used for the temperature tab: https://www.thingiverse.com/thing:261420

Thanks to Critters for providing me his bed levelling procedure.

And of course, thanks to the Cura software, that sliced my models perfectly. Github here: https://github.com/Ultimaker/Cura

### Known issues

- The page will sometimes refresh after generating a .gcode file
- Some "Steps" from the calibration tabs are getting activated when they shouldn't
- The procedure is reset after clicking on the step 4, losing your zOffset

## DISCLAIMER

This plugin has been tested but could contains bugs. If you spot any of them, open an issue describing it and what happened to lead to this bug.
Please always handle it with care, import the GCodes in Cura before printing, and inspect them carefully. I will not be responsible for any physical injury.

Enjoy!
