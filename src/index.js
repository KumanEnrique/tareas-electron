const { app, BrowserWindow,Menu ,MenuItem,ipcMain} = require('electron');
const url = require('url')
const path = require('path')

if(process.env.NODE_ENV !== 'production'){
	require('electron-reload')(__dirname,{
		electron: path.join(__dirname, '../node_modules', '.bin', 'electron')
	})
}

let mainWindow;
let newProductWindow;
const template = [
	new MenuItem({
		label: "New product",
		click() {
			createNewProductWindow()
		}
	}),
	new MenuItem({
		label: "Remove all",
		click(){
			mainWindow.webContents.send("products:remove-all")
		}
	}),
	new MenuItem({
		label: "menu3",
		submenu: [
			new MenuItem({
				label: "submenu"
			})
		]
	})
]
/* aplicacion */
app.on('ready', () => {
	mainWindow = new BrowserWindow({
		titleBarStyle: 'hidden-inset',
		webPreferences:{
			nodeIntegration:true
		}
	});
    mainWindow.loadURL(url.format({
		pathname:path.join(__dirname,'views/index.html'),
		protocol:"file",
		slashes:true
	}));
	mainWindow.on("closed",()=>{
		app.quit()
	})
	
	const menu = Menu.buildFromTemplate(template)
	Menu.setApplicationMenu(menu)

})
/* fin aplicacion */
function createNewProductWindow(){
	newProductWindow = new BrowserWindow({
		parent:mainWindow,
		title:'Add a new product',
		width:370,
		height:370,
		titleBarStyle: 'hidden-inset',
		webPreferences:{
			nodeIntegration:true
		}
	});
	newProductWindow.loadURL(url.format({
		pathname:path.join(__dirname,'views/secu.html'),
		protocol:"file",
		slashes:true
	}));
	// newProductWindow.setMenu(null)
	newProductWindow.on("closed",()=>{
		newProductWindow = null
	})
}/* recibir datos de otra ventana */
ipcMain.on("product:new",(e,newProduct)=>{
	mainWindow.webContents.send("product:new",newProduct)
	newProductWindow.close()
})/* fin de recibir datos de otra ventana */
if(process.env.NODE_ENV !== "production"){
	template.push(
		new MenuItem({
			label:"DevTools",
			submenu:[
				new MenuItem({
					label:"Show/Hide DevTools",
					click(item,focusedWindow){
						focusedWindow.toggleDevTools()
					}
				}),
				new MenuItem({
					role:"reload"
				})
			]
		})
	)
}