const { app, BrowserWindow } = require("electron");

const DEFAULT_APP_URL = "http://localhost:3000";
const ELECTRON_SHELL_RADIUS = 46;
const titleBarStyle =
  process.platform === "darwin" ? "customButtonsOnHover" : "hidden";

function createWindow() {
  const win = new BrowserWindow({
    width: 402,
    height: 874,
    frame: false,
    titleBarStyle,
    transparent: true,
    backgroundColor: "#00000000",
    roundedCorners: true,
    hasShadow: true,
    resizable: true,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  const appUrl = process.env.ELECTRON_APP_URL || DEFAULT_APP_URL;

  win.loadURL(appUrl);
  win.webContents.on("dom-ready", () => {
    win.webContents.insertCSS(`
      html,
      body {
        width: 100%;
        height: 100%;
        background: transparent !important;
        overflow: hidden;
      }

      body {
        margin: 0 !important;
      }

      body > main {
        height: 100vh;
        min-height: 100vh !important;
        background: var(--color-app-background, #fc483d);
        border-radius: ${ELECTRON_SHELL_RADIUS}px;
        clip-path: inset(0 round ${ELECTRON_SHELL_RADIUS}px);
        overflow: hidden;
        -webkit-mask-image: -webkit-radial-gradient(white, black);
      }
    `);
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
