let {
	app,
	globalShortcut,
	BrowserWindow,
	ipcMain
} = require("electron")

let fs = require("fs")
let os = require("os")

/**
 * @type {BrowserWindow}
 */
let window

let notesFile = os.homedir() + "/notes"

function show ({width, height, name}) {
	window.hide()
	window.setSize(width, height)
	window.center()
	window.loadFile(`${name}.html`)
	setTimeout(() => {
		window.show()
	}, 200)
}

function showAddNote () {
	show({
		width: 800,
		height: 100,
		name: "add-note"
	})
}

function showNotes () {
	show({
		width: 800,
		height: 800,
		name: "notes"
	})
}

app.on("ready", () => {
	app.dock.hide()

	window = new BrowserWindow({
		width: 800,
		height: 100,
		resizable: false,
		show: false,
		titleBarStyle: "customButtonsOnHover",
		frame: false
	})

	window.setAlwaysOnTop(true, "floating")
	window.setVisibleOnAllWorkspaces(true)
	window.setFullScreenable(false)

	window.webContents.on("before-input-event", (event, input) => {
		if (input.key == "Enter" || input.key == "Escape") {
			window.hide()
		}
	})

	ipcMain.on("add-note", (event, note) => {
		fs.appendFileSync(notesFile, note + "\n")
		window.hide()
	})

	window.on("close", event => {
		event.preventDefault()
		window.hide()
	})

	globalShortcut.register(
		"Command+Alt+Space",
		showAddNote
	)

	globalShortcut.register(
		"Command+Control+Alt+Space",
		showNotes
	)

	app.on("will-quit", () => {
		// Unregister all shortcuts.
		globalShortcut.unregisterAll()
	})

	app.on("window-all-closed", Function.prototype)
})
