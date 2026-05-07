import editorSetup from "../initialize-webhandle-component.mjs"

export default async function start(webhandle) {
	webhandle.development = true
	webhandle.routers.preStatic.use((req, res, next) => {
		req.user = {
			name: "administrator"
			, groups: ["administrators"]
		}
		
		next()
	})
	let editorManger = await editorSetup(webhandle)
	editorManger.config.authorization = (req, res, next) => {
		next()
	}

	webhandle.routers.preStatic.use(async (req, res, next) => {
		await res.track()
		next()
	})
	
}