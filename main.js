const { app, screen, BrowserWindow } = require('electron')
const path = require('path')

const authEndpoint = "https://accounts.spotify.com/authorize"
const redirectUri = "http://localhost:3000"
const clientId = "96219644ad6a4b5d807c309da4802423"
const scopes = ["user-top-read", "user-read-currently-playing", "user-read-playback-state"]

let mainWindow

function createWindow (token) {

	const display = screen.getPrimaryDisplay()
	const width = display.bounds.width
	const heigth = display.bounds.height

	mainWindow = new BrowserWindow({
		width: 320,
		height: 25,
		x: width - 325,
		y: heigth - 80,
		frame: false,
		webPreferences: {
			preload: path.join(__dirname, './preload.js'),
			nodeIntegration: true
		}
	})

	mainWindow.setResizable(false)
	mainWindow.setMenuBarVisibility(false)
	mainWindow.setAlwaysOnTop(true, "screen-saver")
	mainWindow.loadFile('app/index.html', {query: {"access_token": JSON.stringify(token)}})
}

async function createSpotifyWindow() {

    let authWindow = new BrowserWindow({
        width: 800,
        height: 600,
		webPreferences: {
			preload: path.join(__dirname, './preload.js'),
			nodeIntegration: true
		}
    })

    const authUrl = `${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join("%20")}&response_type=token&show_dialog=true`

	authWindow.setTitle('Auth Spotify')
	authWindow.setMenuBarVisibility(false)

	await authWindow.loadURL(authUrl)
	
	authWindow.show()
    authWindow.webContents.on('did-redirect-navigation', function (event, newUrl) {
		event.preventDefault()
		
        if (newUrl.includes('access_token=')) {
            const token = newUrl.split('access_token=')[1].split('&')[0]
			createWindow(token)
		}

		authWindow.destroy()
    })
}

app.whenReady().then(() => {

	createSpotifyWindow()

	app.on('activate', function () {
		if (BrowserWindow.getAllWindows().length === 0) {
			createSpotifyWindow()
		}
	})
})

app.on('window-all-closed', function () {
  	if (process.platform !== 'darwin') {
		app.quit()
	}
})
