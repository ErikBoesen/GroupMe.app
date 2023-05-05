const { app, BrowserWindow } = require('electron')
const path = require('path')

function createWindow () {
  const win = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      icon: path.join(__dirname, 'images/logo/logo.png'),
      partition: 'persist:infragistics',
    },
  })

  // Persist cookies
  let cookies = win.webContents.session.cookies;
  cookies.on('changed', function(event, cookie, cause, removed) {
    if (cookie.session && !removed) {
      let url = util.format('%s://%s%s', (!cookie.httpOnly && cookie.secure) ? 'https' : 'http', cookie.domain, cookie.path);
      console.log('url', url);
      cookies.set({
        url: url,
        name: cookie.name,
        value: cookie.value,
        domain: cookie.domain,
        path: cookie.path,
        secure: cookie.secure,
        httpOnly: cookie.httpOnly,
        expirationDate: new Date().setDate(new Date().getDate() + 14)
      }, function(err) {
        if (err) {
          log.error('Error trying to persist cookie', err, cookie);
        }
      });
    }
  });

  // Load webpage
  win.loadURL(
      'https://web.groupme.com',
      {
          userAgent: 'Chrome',
      },
  );
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
