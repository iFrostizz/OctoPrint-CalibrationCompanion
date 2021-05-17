# coding=utf-8

from __future__ import absolute_import
import octoprint.plugin
import octoprint.filemanager.util
import flask
import re


class calibrationcompanion(octoprint.plugin.SettingsPlugin,
						   octoprint.plugin.AssetPlugin,
						   octoprint.plugin.TemplatePlugin,
						   octoprint.plugin.StartupPlugin,
						   octoprint.plugin.BlueprintPlugin):

	##~~ SettingsPlugin mixin

	def __init__(self):
		self.origin_check = False
		self.relative_positioning = False
		self.iteration = 0

	def get_settings_defaults(self):
		return dict(
			nozzle_pid_temp="",
			bed_pid_temp="",
			cycles_amount="5",
			bed_size_x="",
			bed_size_y="",
			bed_size_z="",
			extra_margin="20",
			origin_check=False,
			filament_used="PLA",
			printer_name="",
			relative_positioning=False,
			nozzle_size="0.4",
			filament_diameter="1.75",
			movement_speed="",
			first_layer_speed="",
			printing_speed="",

			profile_selection="",
			profile_selection_square="",
			profile_selection_flow="",
			profile_selection_retra="",
			profile_selection_temp="",
			profile_selection_accel="",

			first_layer_nozzle_profile1="205",
			regular_nozzle_profile1="200",
			regular_bed_profile1="60",
			fan_speed_profile1="50",
			fan_layer_profile1="5",
			first_layer_speed_profile1="20",
			regular_speed_profile1="50",
			travel_speed_profile1="150",
			retraction_dist_profile1="2",
			retraction_speed_profile1="30",
			flow_profile1="100",
			abl_method_profile1="M420 S1",
			start_gcode_profile1="G90;absolute mode\nG0 F[travel_speed] X100 Y100 Z10;place the nozzle for heating\n"
								 "M140 S[regular_bed];set bed to [regular_bed]C\nM190 S[regular_bed];wait for bed to [regular_bed]C\n"
								 "M104 S[regular_nozzle];set hotend to [regular_nozzle]C\nM109 S[regular_nozzle];wait hotend to [regular_nozzle]C\n"
								 "G92 E0;reset extruder",
			end_gcode_profile1="G91;relative mode\nG92 E0;reset extruder\nG1 F[retraction_speed] E-[retraction_distance];retract a bit to avoid oozing\n"
							   "G0 Z10 F[travel_speed];move up\nM140 S0;set bed to 0C\nM104 S0;set hotend to 0C\nM107;turn off fans\nG90;absolute mode\n"
							   "G0 F[travel_speed] Y[bed_size_y];show the print\nG1 F[retraction_speed] E0;set the filament at the end of the nozzle again",

			first_layer_nozzle_profile2="",
			regular_nozzle_profile2="",
			regular_bed_profile2="",
			fan_speed_profile2="",
			fan_layer_profile2="",
			first_layer_speed_profile2="",
			regular_speed_profile2="",
			travel_speed_profile2="",
			retraction_dist_profile2="",
			retraction_speed_profile2="",
			flow_profile2="",
			abl_method_profile2="",
			start_gcode_profile2="",
			end_gcode_profile2="",

			first_layer_nozzle_profile3="",
			regular_nozzle_profile3="",
			regular_bed_profile3="",
			fan_speed_profile3="",
			fan_layer_profile3="",
			first_layer_speed_profile3="",
			regular_speed_profile3="",
			travel_speed_profile3="",
			retraction_dist_profile3="",
			retraction_speed_profile3="",
			flow_profile3="",
			abl_method_profile3="",
			start_gcode_profile3="",
			end_gcode_profile3="",

			first_layer_nozzle_accel="",
			regular_nozzle_accel="",
			regular_bed_accel="",
			fan_speed_accel="",
			fan_layer_accel="",
			first_layer_speed_accel="",
			regular_speed_accel="",
			travel_speed_accel="",
			retraction_dist_accel="",
			retraction_speed_accel="",
			flow_accel="",
			abl_method_accel="",
			start_gcode_accel="",
			end_gcode_accel="",

			current_e_steps="",
			actual_estep_value="",
			final_estep_value="",
			measured_distance="",
			filament_path_distance="100",

			current_z_offset="0.0",
			procedureStarted="false",

			regular_nozzle_square="",
			regular_bed_square="",
			fan_speed_square="",
			fan_layer_square="",
			regular_speed_square="",
			travel_speed_square="",
			retraction_dist_square="",
			retraction_speed_square="",
			flow_square="",
			abl_method_square="",
			start_gcode_square="",
			end_gcode_square="",

			first_layer_nozzle_retra="",
			regular_nozzle_retra="",
			regular_bed_retra="",
			fan_speed_retra="",
			fan_layer_retra="",
			first_layer_speed_retra="",
			regular_speed_retra="",
			travel_speed_retra="",
			flow_retra="",
			abl_method_retra="",
			start_gcode_retra="",
			end_gcode_retra="",

			stepper_imax="1.00",
			driver_select="A4988",
			rsense="0.1",

			first_layer_nozzle_temp="",
			regular_bed_temp="",
			fan_speed_temp="",
			fan_layer_temp="",
			first_layer_speed_temp="",
			regular_speed_temp="",
			travel_speed_temp="",
			retraction_dist_temp="",
			retraction_speed_temp="",
			flow_temp="",
			abl_method_temp="",
			start_gcode_temp="",
			end_gcode_temp="",

			first_layer_nozzle_flow="",
			regular_nozzle_flow="",
			regular_bed_flow="",
			fan_speed_flow="",
			fan_layer_flow="",
			first_layer_speed_flow="",
			regular_speed_flow="",
			travel_speed_flow="",
			retraction_dist_flow="",
			retraction_speed_flow="",
			abl_method_flow="",
			start_gcode_flow="",
			end_gcode_flow=""
		)

	def on_after_startup(self):
		self._logger.info("Initializing Calibration Companion Plugin!")
		self._plugin_manager.send_plugin_message("calibrationcompanion", {"cycleIteration": self.iteration})

	def get_received_gcode(self, comm, line, *args, **kwargs):
		if "Probe Offset X" in line:
			currentZOffset = re.findall(r"[-+]?\d*\.\d+|\d+", line)[2]
			self._settings.set(["current_z_offset"], currentZOffset)
			self._settings.save()
		elif "M92 X" in line:
			currentEsteps = re.findall(r"[-+]?\d*\.\d+|\d+", line)[4]
			self._settings.set(["current_e_steps"], currentEsteps)
			self._settings.save()
		else:
			return line  # Avoid blocking the communication
		"""elif "PID Autotune start" in line:
			self.iteration = 0
			self._plugin_manager.send_plugin_message("calibrationcompanion", {"cycleIteration": self.iteration})
		elif "Kp: " in line:
			self.iteration += 1
			self._plugin_manager.send_plugin_message("calibrationcompanion", {"cycleIteration": self.iteration})"""


	@octoprint.plugin.BlueprintPlugin.route("/downloadFile", methods=["POST"])
	def myEcho(self):
		#self._logger.info("Here is the output {}".format(flask.request.values))
		gcode = flask.request.values["generated gcode"]
		filename = flask.request.values["name"]
		test_file = open(self._settings.global_get_basefolder("watched") + "/" + filename + ".gcode", "w")
		test_file.write(gcode)
		test_file.close()
		return gcode

	def bodysize_hook(self, current_max_body_sizes, *args, **kwargs):
		#self._logger.info("current_max_body_sizes {}".format(current_max_body_sizes))
		return [("POST", r"/downloadFile", 1024 * 1024 * 32)]  # 32MB should be enough

	##~~ AssetPlugin mixin

	def get_assets(self):
		# Define your plugin's asset files to automatically include in the
		# core UI here.
		return dict(
			js=["js/calibrationcompanion.js",
				"js/calibrationcompanion_acceleration.js",
				"js/calibrationcompanion_esteps.js",
				"js/calibrationcompanion_firstlayer.js",
				"js/calibrationcompanion_flow.js",
				"js/calibrationcompanion_pid.js",
				"js/calibrationcompanion_profiles.js",
				"js/calibrationcompanion_retra.js",
				"js/calibrationcompanion_stepper.js",
				"js/calibrationcompanion_temp.js"],
			css=["css/calibrationcompanion.css"]
		)

	def get_template_config(self):
		return dict(type="tab", custom_bindings=True)

	##~~ Softwareupdate hook

	def get_update_information(self):
		# Define the configuration for your plugin to use with the Software Update
		# Plugin here. See https://docs.octoprint.org/en/master/bundledplugins/softwareupdate.html
		# for details.
		return dict(
			calibrationcompanion=dict(
				displayName="Calibration Companion",
				displayVersion=self._plugin_version,

				# version check: github repository
				type="github_release",
				user="iFrostizz",
				repo="OctoPrint-CalibrationCompanion",
				current=self._plugin_version,

				# update method: pip
				pip="https://github.com/iFrostizz/OctoPrint-CalibrationCompanion/archive/{target_version}.zip"
			)
		)


__plugin_pythoncompat__ = ">=2.7,<4"


def __plugin_load__():
	global __plugin_implementation__
	__plugin_implementation__ = calibrationcompanion()

	global __plugin_hooks__
	__plugin_hooks__ = {
		"octoprint.plugin.softwareupdate.check_config": __plugin_implementation__.get_update_information,
		"octoprint.server.http.bodysize": __plugin_implementation__.bodysize_hook,
		"octoprint.comm.protocol.gcode.received": __plugin_implementation__.get_received_gcode
	}
