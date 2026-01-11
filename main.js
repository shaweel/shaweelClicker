imports.gi.versions.Gtk = '4.0'
const Gtk = imports.gi.Gtk

let application = new Gtk.Application({ application_id: 'me.shaweel.shaweelclicker' })

application.connect('activate', () => {
	let window = new Gtk.ApplicationWindow({ application: application, title: 'shaweelClicker' })
	window.show()
})

application.run([])