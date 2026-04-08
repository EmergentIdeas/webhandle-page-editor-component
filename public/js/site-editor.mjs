import { convertEditContentInline } from "ckeditor4-edit-content-inline"
import {siteEditorBridge} from "@webhandle/site-editor-bridge"
import pageSpec from "@webhandle/site-editor-bridge/page-render-spec"

let pageService = siteEditorBridge.services.pages

let controls = `
<div class="webhandle-page-editor-controls">
	<a href="#" title="Edit Page" class="start-editing">E</a>
	<a href="#" title="Properties" class="property-button">P</a>
	<a href="#" title="Save" class="save-button">S</a>
	<a href="/menu" title="Menu Page" class="go-to-menu">M</a></div>
</div>
`

document.body.insertAdjacentHTML('beforeEnd', controls)

let edit = document.querySelector('.webhandle-page-editor-controls .start-editing')
let properties = document.querySelector('.webhandle-page-editor-controls .property-button')
let save = document.querySelector('.webhandle-page-editor-controls .save-button')
let cnt = document.querySelector('.webhandle-page-editor-controls')

edit.addEventListener('click', (evt) => {
	evt.preventDefault()
	cnt.classList.add('editing')
	document.body.classList.add('editing')
	convertEditContentInline()

})
properties.addEventListener('click', (evt) => {
	evt.preventDefault()
	let path = pageSpec.template
	let parts = path.split('.')
	parts.pop()
	path = parts.join('.')
	window.location = '/admin/page-manager#' + path
})
save.addEventListener('click', async (evt) => {
	evt.preventDefault()
	let sections = []
	let sectionEls = document.querySelectorAll('.edit-content-inline')
	for(let sEl of sectionEls) {
		sections.push(sEl.value || sEl.innerHTML)
	}
	await pageService.updateSections(pageSpec.template, sections)
})