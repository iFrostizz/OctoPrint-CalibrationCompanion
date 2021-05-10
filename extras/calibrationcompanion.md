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

## Pictures 

![Calibration Companion Setup](/assets/img/plugins/EasyServo/setup.png)

![Calibration Companion Retraction](/assets/img/plugins/EasyServo/retraction.png)


If you need more informations, please head on: https://github.com/iFrostizz/OctoPrint-CalibrationCompanion

## DISCLAIMER

This plugin has been tested but could contains bugs. If you spot any of them, open an issue describing it and what happened to lead to this bug.
Please always handle it with care, import the GCodes in Cura before printing, and inspect them carefully. I will not be responsible for any physical injury.

