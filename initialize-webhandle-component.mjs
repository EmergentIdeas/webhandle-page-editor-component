import createInitializeWebhandleComponent from "@webhandle/initialize-webhandle-component/create-initialize-webhandle-component.mjs"
import ComponentManager from "@webhandle/initialize-webhandle-component/component-manager.mjs"
import path from "node:path"
import setupImageInput from "@webhandle/image-input/initialize-webhandle-component.mjs"
import siteEditorBridgeSetup from "@webhandle/site-editor-bridge/initialize-webhandle-component.mjs"
import createRequireGroupMembership from "@webhandle/users-data/middleware/create-require-group-membership.mjs"
import setupCKEditor from "@webhandle/ckeditor-4/initialize-webhandle-component.mjs";




const initializeWebhandleComponent = createInitializeWebhandleComponent()

initializeWebhandleComponent.componentName = '@webhandle/page-editor'
initializeWebhandleComponent.componentDir = import.meta.dirname
initializeWebhandleComponent.defaultConfig = {
	"publicFilesPrefix": '/' + initializeWebhandleComponent.componentName + "/files"
	, authorization: createRequireGroupMembership("administrators")
}
initializeWebhandleComponent.staticFilePath = 'public'
initializeWebhandleComponent.templatePath = 'views'


initializeWebhandleComponent.setup = async function (webhandle, config) {
	let manager = new ComponentManager()
	manager.config = config

	let siteEditorBridgeSetupManager = await siteEditorBridgeSetup(webhandle)
	let managerImageInput = await setupImageInput(webhandle)
	let ckManager = await setupCKEditor(webhandle)

	webhandle.routers.preDynamic.use((req, res, next) => {
		if(!req.user) {
			return next()
		}
		config.authorization(req, res, (err) => {
			if(!err) {
				manager.addExternalResources(res.locals.externalResourceManager)
			}
			next()
		})
	})
	
	manager.addExternalResources = (externalResourceManager, options) => {
		siteEditorBridgeSetupManager.addExternalResources(externalResourceManager)
		managerImageInput.addExternalResources(externalResourceManager)
		ckManager.addExternalResources(externalResourceManager)
		externalResourceManager.includeResource({
			mimeType: 'text/css'
			, url: config.publicFilesPrefix + '/css/styles.css'
		})

	}

	webhandle.addTemplate(initializeWebhandleComponent.componentName + '/addExternalResources', (data) => {
		let externalResourceManager = initializeWebhandleComponent.getExternalResourceManager(data)
		manager.addExternalResources(externalResourceManager)
		externalResourceManager.includeResource({
			url: config.publicFilesPrefix + '/js/site-editor.mjs'
			, mimeType: 'application/javascript'
			, resourceType: 'module'
			, name: initializeWebhandleComponent.componentName
		})
		return externalResourceManager.render()
	})

	// Allow access to the component and style code
	let filePath = path.join(initializeWebhandleComponent.componentDir, initializeWebhandleComponent.staticFilePath)
	manager.staticPaths.push(
		webhandle.addStaticDir(
			filePath,
			{
				urlPrefix: config.publicFilesPrefix
				, fixedSetOfFiles: true
			}
		)
	)
	
	webhandle.pageServer.preRun.push((req, res, next) => {
		next()
	})

	return manager
}

export default initializeWebhandleComponent
