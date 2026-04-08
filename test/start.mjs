import testimonialsSetup from "../initialize-webhandle-component.mjs"

export default async function start(webhandle) {
	webhandle.development = true
	webhandle.routers.preStatic.use((req, res, next) => {
		req.user = {
			name: "administrator"
			, groups: ["administrators"]
		}
		
		next()
	})
	let userManagementManager = await testimonialsSetup(webhandle)
	// userManagementManager.config.authorization = (req, res, next) => {
	// 	next()
	// }

	webhandle.routers.preStatic.use(async (req, res, next) => {
		await res.track()
		next()
	})
	
}