imports.gi.versions.Gtk = '4.0'
const Gtk = imports.gi.Gtk
const Gdk = imports.gi.Gdk
const GLib = imports.gi.GLib
const ByteArray = imports.byteArray
const ROW_SPACING = 6
const LABEL_SETTING_SPACING = 0
const COLLUMN_WHITESPACE = 12
const COLLUMN_SPACING = 12
const GLOBAL_WHITESPACE = 20
const GLOBAL_SPACING = 12

function generateDefaultConfig(keybindOffset) {
	return {enabled: true, mouseButton: 0, clickType: 0, keybindType: 0, 
		keybindValue: 65476+keybindOffset, miliseconds: 100, seconds: 0, minutes: 0, hours: 0}
}

const defaultConfigs = [generateDefaultConfig(0)]
let configs = defaultConfigs
let configFilePath = GLib.build_filenamev([GLib.get_home_dir(), ".config", "shaweelClicker", "config.json"])

try {
	let [success, contents] = GLib.file_get_contents(configFilePath)
	if (success) {
		configs = JSON.parse(ByteArray.toString(contents))
	} else {
		configs = defaultConfigs
	}
} catch (error) {
	let folderPath = GLib.build_filenamev([GLib.get_home_dir(), ".config", "shaweelClicker"])
	GLib.mkdir_with_parents(folderPath, 0o755)
	GLib.file_set_contents(configFilePath, ByteArray.fromString(JSON.stringify(defaultConfigs)))
}

let application = new Gtk.Application({ application_id: 'me.shaweel.shaweelclicker' })

function saveConfigsToFile() {
	GLib.file_set_contents(configFilePath, ByteArray.fromString(JSON.stringify(configs)))
}

function addOption(text, option, parent, homogeneous=true) {
	const row = new Gtk.Box({orientation: Gtk.Orientation.HORIZONTAL, spacing: LABEL_SETTING_SPACING,
		 margin_start: COLLUMN_WHITESPACE, margin_end: COLLUMN_WHITESPACE, homogeneous})
	const label = new Gtk.Label({ label: text })
	label.set_hexpand(true)
	label.set_halign(Gtk.Align.START)
	row.append(label)
	row.append(option)
	parent.append(row)
}

function showMaxConfigsError(window) {
	const dialog = new Gtk.MessageDialog({transient_for: window, modal: true, message_type: Gtk.MessageType.ERROR,
		 buttons: Gtk.ButtonsType.OK, text: "Maximum amount of configurations reached."})
	dialog.connect("response", () => {
		dialog.destroy()
	})
	dialog.show()
}

function showConflictingKeybindError(window) {
	const dialog = new Gtk.MessageDialog({transient_for: window, modal: true, message_type: Gtk.MessageType.ERROR,
		 buttons: Gtk.ButtonsType.OK, text: "Another configuration with the same keybind is already enabled, please resolve this first."})
	dialog.connect("response", () => {
		dialog.destroy()
	})
	dialog.show()
}

let configAmount = 0
let maxConfigs = 6
function createConfig(window, notebook, enabledValue=true, mouseButtonValue=0, clickTypeValue=0, keybindTypeValue=0,
	 keybindValue=65476, miliseconds=100, seconds=0, minutes=0, hours=0) {
	let thisConfig = configAmount
	const mainBox = new Gtk.Box({
		orientation: Gtk.Orientation.VERTICAL,
		spacing: GLOBAL_SPACING,
		margin_top: GLOBAL_WHITESPACE,
		margin_start: GLOBAL_WHITESPACE,
		margin_end: GLOBAL_WHITESPACE,
		margin_bottom: GLOBAL_WHITESPACE,
	})
	const enabled = new Gtk.Switch({active: enabledValue})
	addOption("Enabled", enabled, mainBox, false)
	
	const settingsRow = new Gtk.Box({
		orientation: Gtk.Orientation.HORIZONTAL,
		spacing: COLLUMN_SPACING,
		homogeneous: true
	})


	const optionsFrame = new Gtk.Frame({label: "Options"})
	const optionsColumn = new Gtk.Box({orientation: Gtk.Orientation.VERTICAL, spacing: ROW_SPACING, margin_bottom: COLLUMN_WHITESPACE})
	optionsFrame.set_child(optionsColumn)
	
	const intervalFrame = new Gtk.Frame({label: "Time interval"})
	const intervalColumn = new Gtk.Box({orientation: Gtk.Orientation.VERTICAL, spacing: ROW_SPACING, margin_bottom: COLLUMN_WHITESPACE})
	intervalFrame.set_child(intervalColumn)

	const mouseButton = new Gtk.DropDown({model: Gtk.StringList.new(["Left", "Right", "Middle"]), selected: mouseButtonValue})
	const clickType = new Gtk.DropDown({model: Gtk.StringList.new(["Click", "Hold"]), selected: clickTypeValue})
	const keybindType = new Gtk.DropDown({model: Gtk.StringList.new(["Click", "Hold"]), selected: keybindTypeValue})
	let keybind = keybindValue
	const keybindButton = new Gtk.Button({label: Gdk.keyval_name(keybind)})
	const milisecondsSpinButton = new Gtk.SpinButton({adjustment: new Gtk.Adjustment({lower: 0, upper: 1000, step_increment: 1}), value: miliseconds})
	const secondsSpinButton = new Gtk.SpinButton({adjustment: new Gtk.Adjustment({lower: 0, upper: 60, step_increment: 1}), value: seconds})
	const minutesSpinButtons = new Gtk.SpinButton({adjustment: new Gtk.Adjustment({lower: 0, upper: 60, step_increment: 1}), value: minutes})
	const hoursSpinButton = new Gtk.SpinButton({adjustment: new Gtk.Adjustment({lower: 0, upper: 24, step_increment: 1}), value: hours})
	const startButton = new Gtk.Button({label: `Start (${Gdk.keyval_name(keybind)})`})

	addOption("Mouse Button", mouseButton, optionsColumn)
	addOption("Click Type", clickType, optionsColumn)
	addOption("Keybind Type", keybindType, optionsColumn)
	addOption("Keybind", keybindButton, optionsColumn)
	addOption("Miliseconds", milisecondsSpinButton, intervalColumn)
	addOption("Seconds", secondsSpinButton, intervalColumn)
	addOption("Minutes", minutesSpinButtons, intervalColumn)
	addOption("Hours", hoursSpinButton, intervalColumn)


	mouseButton.connect("notify::selected", () => {
		configs[thisConfig].mouseButton = mouseButton.get_selected()
		saveConfigsToFile()
	})

	keybindType.connect("notify::selected", () => {
		configs[thisConfig].keybindType = keybindType.get_selected()
		saveConfigsToFile()
	})

	milisecondsSpinButton.connect("value-changed", () => {
		configs[thisConfig].miliseconds = milisecondsSpinButton.get_value()
		saveConfigsToFile()
	})

	secondsSpinButton.connect("value-changed", () => {
		configs[thisConfig].seconds = secondsSpinButton.get_value()
		saveConfigsToFile()
	})

	minutesSpinButtons.connect("value-changed", () => {
		configs[thisConfig].minutes = minutesSpinButtons.get_value()
		saveConfigsToFile()
	})

	hoursSpinButton.connect("value-changed", () => {
		configs[thisConfig].hours = hoursSpinButton.get_value()
		saveConfigsToFile()
	})

	clickType.connect("notify::selected", () => {
		const value = clickType.get_selected()
		configs[thisConfig].clickType = value
		saveConfigsToFile()
		milisecondsSpinButton.set_sensitive(value !== 1)
		secondsSpinButton.set_sensitive(value !== 1)
		minutesSpinButtons.set_sensitive(value !== 1)
		hoursSpinButton.set_sensitive(value !== 1)
	})
	enabled.connect("notify::active", () => {
		let used = false
		for (let config of configs) {
			if (!config.enabled || config.keybindValue != keybind) continue
			used = true
			break
		}
		if (used && enabled.active === true) {
			showConflictingKeybindError(window)
			listening = false
			enabled.active = false
			return
		}

		startButton.set_sensitive(enabled.active)
		configs[thisConfig].enabled = enabled.active
		saveConfigsToFile()
	})

	keybindButton.connect("clicked", () => {
		listening = true
		keybindButton.set_label("Listening...")
	})
	const keyboardListener = new Gtk.EventControllerKey()
	mainBox.add_controller(keyboardListener)
	keyboardListener.connect("key-released", (controller, keyval) => {
		if (!listening) return
		let used = false
		for (let config of configs) {
			if (!config.enabled || config.keybindValue != keyval) continue
			used = true
			break
		}
		if (used) {
			showConflictingKeybindError(window)
			listening = false
			keybindButton.set_label(Gdk.keyval_name(keybind))
			return
		}
		listening = false
		keybind = keyval
		keybindButton.set_label(Gdk.keyval_name(keyval))
		configs[thisConfig].keybindValue = keyval
		saveConfigsToFile()
		startButton.set_label(`Start (${Gdk.keyval_name(keyval)})`)
	})
	settingsRow.append(optionsFrame)
	settingsRow.append(intervalFrame)
	mainBox.append(settingsRow)
	mainBox.append(startButton)
	configAmount++
	notebook.append_page(mainBox, new Gtk.Label({ label: `Config ${configAmount}` }))
}

let listening = false
application.connect('activate', () => {
	const window = new Gtk.ApplicationWindow({application: application, title: 'shaweelClicker', default_width: 0, default_height: 0, resizable: false})
	const notebook = new Gtk.Notebook()
	for (let config of configs) {
		createConfig(window, notebook, config.enabled, config.mouseButton, config.clickType, config.keybindType,
			 config.keybindValue, config.miliseconds, config.seconds, config.minutes, config.hours)
	}
	const titlebar = new Gtk.HeaderBar({show_title_buttons: true})
	const newTabButton = new Gtk.Button({label: "New Config"})
	newTabButton.connect("clicked", () => {
		const config = generateDefaultConfig(configAmount)
		if (configAmount >= maxConfigs) {
			showMaxConfigsError(window)
			return
		}
		createConfig(window, notebook, config.enabled, config.mouseButton, config.clickType, config.keybindType,
			 config.keybindValue, config.miliseconds, config.seconds, config.minutes, config.hours)
		configs.push(config)
		saveConfigsToFile()
	})
	titlebar.pack_start(newTabButton)
	window.set_titlebar(titlebar)
	window.set_child(notebook)
	window.present()
})

application.run([])