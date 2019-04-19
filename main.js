// Modules to control application life and create native browser window
const {app, BrowserWindow, ipcMain} = require('electron')
const {autoUpdater} = require('electron-updater');
//require('electron-reload')(__dirname);

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 1000, height: 750})

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

/**
 * Send status message to window.
 * 
 * @param {String} text 
 */
function sendMessageToWindow(text) {
  mainWindow.webContents.send('message', text);
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  createWindow();
  autoUpdater.checkForUpdatesAndNotify();
});

// When the updater is checking for an update
// let the browser window know.
autoUpdater.on('checking-for-update', () => {
  sendMessageToWindow('Checking for update...');
});

// When update is available
// let the browser window know.
autoUpdater.on('update-available', (info) => {
  sendMessageToWindow('Update available!');
});

// When no update is available
// let the browser window know.
autoUpdater.on('update-not-available', () => {
  sendMessageToWindow('Up To Date!');
});

// When downloading a new update
// let the browser window know.
autoUpdater.on('download-progress', (proObj) => {
  let progress = 'Download Speed: ' + proObj.bytesPerSecond;
  progress += ' - Downloaded ' + proObj.percent + '%';
  sendMessageToWindow(progress);
});

// When the update has been downloaded and is ready to be
// installed, let the browser window know.
autoUpdater.on('update-downloaded', (info) => {
  sendMessageToWindow('Updated downloaded! Quit to install...');
});

ipcMain.on('quitAndInstall', (event, arg) => {
  autoUpdater.quitAndInstall();
});


// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
