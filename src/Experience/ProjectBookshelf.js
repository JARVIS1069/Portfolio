import * as THREE from 'three'
import Experience from './Experience.js'
import { projects } from './Portfolio.js'

export default class ProjectBookshelf
{
    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.targetElement = this.experience.targetElement
        this.books = []
        this.raycaster = new THREE.Raycaster()
        this.pointer = new THREE.Vector2()
        this.setBooks()
        this.setDetailDialog()
        this.setInteraction()
    }

    setBooks()
    {
        this.hitSpots = [
            { x: -4.32, y: 2.55, z: -4.25, w: 0.17, h: 0.8 },
            { x: -3.66, y: 2.5, z: -4.25, w: 0.17, h: 0.7 },
            { x: -3.38, y: 2.45, z: -4.25, w: 0.2, h: 0.58 }
        ]
        const debug = window.location.hash.includes('books')
        const material = new THREE.MeshBasicMaterial({
            color: '#ff0000',
            transparent: true,
            opacity: debug ? 0.45 : 0,
            depthWrite: false,
            colorWrite: debug
        })

        projects.forEach((project, index) =>
        {
            const spot = this.hitSpots[index]
            const book = new THREE.Mesh(new THREE.BoxGeometry(spot.w, spot.h, 0.12), material)
            book.position.set(spot.x, spot.y, spot.z)
            book.userData.projectIndex = index
            this.scene.add(book)
            this.books.push(book)
        })
    }
    setDetailDialog()
    {
        this.dialog = document.querySelector('.project-detail')
        this.title = this.dialog.querySelector('#project-detail-title')
        this.pageElement = this.dialog.querySelector('.project-detail-page')
        this.count = this.dialog.querySelector('.project-detail-count')
        this.link = this.dialog.querySelector('.project-detail-link')
        this.navButtons = this.dialog.querySelectorAll('.project-detail-nav')
        this.project = null
        this.pageIndex = 0

        this.navButtons.forEach((button) =>
        {
            button.addEventListener('click', () => this.showPage(this.pageIndex + Number(button.dataset.dir)))
        })

        this.dialog.addEventListener('keydown', (_event) =>
        {
            if(_event.key === 'ArrowRight')
                this.showPage(this.pageIndex + 1)
            else if(_event.key === 'ArrowLeft')
                this.showPage(this.pageIndex - 1)
        })

        this.dialog.querySelector('.project-detail-close').addEventListener('click', () =>
        {
            this.dialog.close()
        })

        this.dialog.addEventListener('click', (_event) =>
        {
            if(_event.target === this.dialog)
                this.dialog.close()
        })
    }

    setInteraction()
    {
        this.onClick = (_event) =>
        {
            const bounds = this.targetElement.getBoundingClientRect()
            this.pointer.x = ((_event.clientX - bounds.left) / bounds.width) * 2 - 1
            this.pointer.y = -((_event.clientY - bounds.top) / bounds.height) * 2 + 1
            this.raycaster.setFromCamera(this.pointer, this.experience.camera.instance)

            const hit = this.raycaster.intersectObjects(this.books, false)[0]
            if(hit)
                this.openProject(hit.object.userData.projectIndex)
        }

        this.onPointerMove = (_event) =>
        {
            const bounds = this.targetElement.getBoundingClientRect()
            this.pointer.x = ((_event.clientX - bounds.left) / bounds.width) * 2 - 1
            this.pointer.y = -((_event.clientY - bounds.top) / bounds.height) * 2 + 1
            this.raycaster.setFromCamera(this.pointer, this.experience.camera.instance)
            this.targetElement.style.cursor = this.raycaster.intersectObjects(this.books, false).length
                ? 'pointer'
                : ''
        }

        this.targetElement.addEventListener('click', this.onClick)
        this.targetElement.addEventListener('pointermove', this.onPointerMove)
    }

    openProject(_index)
    {
        const project = projects[_index]
        if(!project)
            return

        this.project = project
        this.title.textContent = project.name
        this.link.href = project.url
        this.showPage(0)

        if(!this.dialog.open)
            this.dialog.showModal()
    }

    showPage(_index)
    {
        // Page 0 is the cover; the rest come from the project's README
        const total = this.project.pages.length + 1
        if(_index < 0 || _index >= total)
            return

        this.pageIndex = _index
        this.pageElement.replaceChildren()

        const add = (_tag, _text, _className) =>
        {
            const element = document.createElement(_tag)
            element.textContent = _text
            if(_className)
                element.className = _className
            this.pageElement.appendChild(element)
            return element
        }

        if(_index === 0)
        {
            add('p', this.project.description, 'project-detail-text')
            add('h2', 'Tech stack')
            const stack = add('ul', '', 'project-detail-chips')
            this.project.stack.forEach((item) =>
            {
                const chip = document.createElement('li')
                chip.textContent = item
                stack.appendChild(chip)
            })
        }
        else
        {
            const page = this.project.pages[_index - 1]
            add('h2', page.title)
            if(page.text)
                add('p', page.text, 'project-detail-text')
            if(page.steps)
            {
                const steps = add('ol', '', 'project-detail-steps')
                page.steps.forEach((item) =>
                {
                    const step = document.createElement('li')
                    step.textContent = item
                    steps.appendChild(step)
                })
            }
            if(page.list)
            {
                const list = add('ul', '', 'project-detail-list')
                page.list.forEach((item) =>
                {
                    const entry = document.createElement('li')
                    entry.textContent = item
                    list.appendChild(entry)
                })
            }
        }

        this.count.textContent = `Page ${_index + 1} of ${total}`
        this.navButtons[0].disabled = _index === 0
        this.navButtons[1].disabled = _index === total - 1
    }
}
