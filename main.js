imports.gi.versions.Gtk = '4.0'
const Gtk = imports.gi.Gtk

let application = new Gtk.Application({ application_id: 'me.shaweel.shaweelclicker' })

application.connect('activate', () => {
	const window = new Gtk.ApplicationWindow({ application: application, title: 'shaweelClicker', default_width: 500, default_height: 350 })
	const settingsRow = new Gtk.Box({
		orientation: Gtk.Orientation.HORIZONTAL,
		spacing: 12,
		margin_top: 20,
		margin_start: 20,
		margin_end: 20,
		margin_bottom: 20
	})

	const optionsFrame = new Gtk.Frame({label: "Options"})
	const optionsColumn = new Gtk.Box({orientation: Gtk.Orientation.VERTICAL, spacing: 8})
	optionsFrame.set_child(optionsColumn)
	
	const intervalFrame = new Gtk.Frame({label: "Time interval"})
	const intervalColumn = new Gtk.Box({orientation: Gtk.Orientation.VERTICAL, spacing: 8})
	intervalFrame.set_child(intervalColumn)

	function addOption(text, option, parent) {
		const row = new Gtk.Box({orientation: Gtk.Orientation.HORIZONTAL, spacing: 12, margin_start: 10, margin_end: 10})
		const label = new Gtk.Label({ label: text, xalign: 0 })
		label.set_hexpand(true)
		label.set_halign(Gtk.Align.START)
		row.append(label)
		row.append(option)
		parent.append(row)
	}
	addOption("Mouse Button", new Gtk.DropDown({model: Gtk.StringList.new(["Left", "Right", "Middle"])}), optionsColumn)
	addOption("Seconds", new Gtk.DropDown({model: Gtk.StringList.new(["Left", "Right", "Middle"])}), intervalColumn)

	settingsRow.append(optionsFrame)
	settingsRow.append(intervalFrame)
	window.set_child(settingsRow)
	window.present()
})

application.run([])