const ipcRenderer = require('electron').ipcRenderer;

require('./network-sites')(data => {
    require('./snmp')(data, network_sites => {
        setTimeout(() => {
            require('./content-handler')(network_sites)
        }, 1000);
    });
});

ipcRenderer.on('checking-for-update', (event, text) => {
    $('#updates').text('Checking for updates...');
});

ipcRenderer.on('download-progress', (event, text) => {
    $('#updates').text('Downloading update...');
});

ipcRenderer.on('update-not-available', (event, text) => {
    $('#updates').text('No updates available!');
});

ipcRenderer.on('update-downloaded', (event, text) => {
    $('#updates').text('Update downloaded!');
});
