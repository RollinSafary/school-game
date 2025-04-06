const { app, BrowserWindow, protocol } = require("electron");
const path = require("path");
const isDev = require("electron-is-dev");
const fs = require("fs");

// Setup protocol handler to handle file requests correctly
app.whenReady().then(() => {
  // Handle local file protocol
  protocol.registerFileProtocol("file", (request, callback) => {
    const pathname = decodeURI(request.url.replace("file:///", ""));
    callback(pathname);
  });
});

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    fullscreen: !isDev, // Enable fullscreen in production
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false, // This can help with local file loading, but use with caution
    },
    icon: path.join(__dirname, "icon.png"),
  });

  // Load index.html
  const indexPath = isDev
    ? "http://localhost:3000"
    : `file://${path.join(__dirname, "../build/index.html")}`;

  // Only check files in development mode
  if (isDev) {
    // Check if file exists in production
    const filePath = path.join(__dirname, "../build/index.html");
    console.log("Index path exists:", fs.existsSync(filePath));

    // Check if audio directories exist
    const speechDir = path.join(__dirname, "../build/speech");
    const musicDir = path.join(__dirname, "../build/music");
    console.log("Speech directory exists:", fs.existsSync(speechDir));
    console.log("Music directory exists:", fs.existsSync(musicDir));

    // Debug loading issues
    mainWindow.webContents.on(
      "did-fail-load",
      (event, errorCode, errorDescription) => {
        console.error("Failed to load:", errorCode, errorDescription);
      }
    );

    // Open DevTools only in development mode
    mainWindow.webContents.openDevTools();
  } else {
    // In production mode, enter fullscreen immediately after loading
    mainWindow.once("ready-to-show", () => {
      mainWindow.setFullScreen(true);
    });
  }

  // Load the URL
  mainWindow.loadURL(indexPath);

  // Add keyboard shortcut to exit fullscreen (ESC might not work in true fullscreen)
  mainWindow.webContents.on("before-input-event", (event, input) => {
    // Allow F11 to toggle fullscreen
    if (input.key === "F11") {
      mainWindow.setFullScreen(!mainWindow.isFullScreen());
      event.preventDefault();
    }

    // Alt+F4 or Cmd+Q still work by default for app closing
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.whenReady().then(createWindow);

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
