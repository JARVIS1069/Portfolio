import * as THREE from 'three'
import Experience from './Experience.js'
import { links, profile } from './Portfolio.js'

export default class RemoteTV
{
    constructor(_onStateChange)
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.camera = this.experience.camera.instance
        this.targetElement = this.experience.targetElement
        this.onStateChange = _onStateChange
        this.isOn = false
        this.page = 0
        this.pages = [
            {
                eyebrow: `${profile.role}  /  ${profile.location}`,
                title: profile.name,
                description: profile.bio,
                footer: ''
            }
        ]

        this.setScreen()
        this.setRemote()
        this.setInteraction()
    }

    setScreen()
    {
        this.screen = {}
        this.screen.canvas = document.createElement('canvas')
        this.screen.canvas.width = 1280
        this.screen.canvas.height = 720
        this.screen.context = this.screen.canvas.getContext('2d')
        this.screen.texture = new THREE.CanvasTexture(this.screen.canvas)
        this.screen.texture.encoding = THREE.sRGBEncoding
        this.screen.material = new THREE.MeshBasicMaterial({
            map: this.screen.texture,
            side: THREE.DoubleSide
        })
        this.screen.mesh = new THREE.Mesh(
            new THREE.PlaneGeometry(3.1, 1.74),
            this.screen.material
        )
        this.screen.mesh.position.set(4.15, 2.717, 1.63)
        this.screen.mesh.rotation.y = -Math.PI * 0.5
        this.screen.mesh.userData.action = 'screen'
        this.scene.add(this.screen.mesh)

        this.renderScreen()
    }

    setRemote()
    {
        this.remote = new THREE.Group()
        this.remote.position.set(0, 1.2, 1)
        this.remote.rotation.y = -0.12
        this.scene.add(this.remote)

        const bodyMaterial = new THREE.MeshStandardMaterial({
            color: '#202831',
            roughness: 0.38,
            metalness: 0.18
        })
        const buttonMaterial = new THREE.MeshStandardMaterial({
            color: '#b9eb7a',
            roughness: 0.35,
            metalness: 0.08,
            emissive: '#29351e',
            emissiveIntensity: 0.35
        })
        const powerMaterial = new THREE.MeshStandardMaterial({
            color: '#eb776f',
            roughness: 0.35,
            emissive: '#571c18',
            emissiveIntensity: 0.35
        })

        this.addRemotePart(
            new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.075, 0.56), bodyMaterial),
            'power'
        )

        const powerButton = new THREE.Mesh(
            new THREE.CylinderGeometry(0.04, 0.04, 0.03, 18),
            powerMaterial
        )
        powerButton.position.set(0, 0.052, -0.19)
        this.addRemotePart(powerButton, 'power')

        const selectButton = new THREE.Mesh(
            new THREE.CylinderGeometry(0.03, 0.03, 0.03, 16),
            buttonMaterial
        )
        selectButton.position.set(0, 0.05, 0.08)
        this.addRemotePart(selectButton, 'power')
    }

    addRemotePart(_mesh, _action)
    {
        _mesh.userData.action = _action
        this.remote.add(_mesh)
    }

    setInteraction()
    {
        this.raycaster = new THREE.Raycaster()
        this.pointer = new THREE.Vector2()
        this.interactiveObjects = [this.screen.mesh, this.remote]
        this.targetElement.tabIndex = 0
        this.targetElement.setAttribute('role', 'application')
        this.performActionAt = (_x, _y) =>
        {
            const bounds = this.targetElement.getBoundingClientRect()
            this.pointer.x = ((_x - bounds.left) / bounds.width) * 2 - 1
            this.pointer.y = -((_y - bounds.top) / bounds.height) * 2 + 1
            this.raycaster.setFromCamera(this.pointer, this.camera)

            const hits = this.raycaster.intersectObjects(this.interactiveObjects, true)
            if(hits.length === 0)
                return

            let object = hits[0].object
            while(object && !object.userData.action)
                object = object.parent

            if(!object)
                return

            if(object.userData.action === 'power')
                this.togglePower()
            else if(object.userData.action === 'screen')
                this.handleScreenClick(hits[0])
        }

        this.onClick = (_event) =>
        {
            this.performActionAt(_event.clientX, _event.clientY)
        }

        this.touchStart = (_event) =>
        {
            const touch = _event.touches[0]
            this.touchOrigin = { x: touch.clientX, y: touch.clientY }
        }

        this.touchEnd = (_event) =>
        {
            if(!this.touchOrigin)
                return

            const touch = _event.changedTouches[0]
            const distance = Math.hypot(
                touch.clientX - this.touchOrigin.x,
                touch.clientY - this.touchOrigin.y
            )
            this.touchOrigin = null

            if(distance < 12)
                this.performActionAt(touch.clientX, touch.clientY)
        }

        this.onPointerMove = (_event) =>
        {
            const bounds = this.targetElement.getBoundingClientRect()
            this.pointer.x = ((_event.clientX - bounds.left) / bounds.width) * 2 - 1
            this.pointer.y = -((_event.clientY - bounds.top) / bounds.height) * 2 + 1
            this.raycaster.setFromCamera(this.pointer, this.camera)
            const hits = this.raycaster.intersectObjects(this.interactiveObjects, true)
            this.targetElement.style.cursor = hits.length > 0 ? 'pointer' : ''
        }

        this.onKeyDown = (_event) =>
        {
            if(document.querySelector('.project-detail').open)
                return

            if(_event.key === ' ' || _event.key === 'Enter')
            {
                _event.preventDefault()
                this.togglePower()
            }
        }

        this.targetElement.addEventListener('click', this.onClick)
        this.targetElement.addEventListener('pointermove', this.onPointerMove)
        this.targetElement.addEventListener('touchstart', this.touchStart, { passive: true })
        this.targetElement.addEventListener('touchend', this.touchEnd)
        window.addEventListener('keydown', this.onKeyDown)
    }

    togglePower()
    {
        this.isOn = !this.isOn
        this.renderScreen()
        this.onStateChange(this.isOn)
    }

    handleScreenClick(_hit)
    {
        if(!this.isOn)
            return

        const canvasX = _hit.uv ? _hit.uv.x * this.screen.canvas.width : 0
        const canvasY = _hit.uv ? (1 - _hit.uv.y) * this.screen.canvas.height : 0

        if(canvasY > 615 && canvasY < 700)
        {
            const url = canvasX < 450
                ? links.github
                : links.linkedin
            window.open(url, '_blank', 'noopener,noreferrer')
        }
    }

    renderScreen()
    {
        const context = this.screen.context
        const canvas = this.screen.canvas
        this.targetElement.setAttribute(
            'aria-label',
            this.isOn
                ? `TV on. ${this.pages[this.page].title}.`
                : 'TV off. Click the remote or press Space to turn it on.'
        )

        context.fillStyle = '#111923'
        context.fillRect(0, 0, canvas.width, canvas.height)

        if(!this.isOn)
        {
            context.fillStyle = '#eb776f'
            context.beginPath()
            context.arc(86, 88, 8, 0, Math.PI * 2)
            context.fill()
            context.fillStyle = '#bac7b2'
            context.font = '500 22px Arial, sans-serif'
            context.fillText('TV STANDBY', 112, 96)
            context.fillStyle = '#f3f4ee'
            context.font = '700 58px Arial, sans-serif'
            context.fillText('Pick up the remote', 80, 360)
            context.fillStyle = '#bac7b2'
            context.font = '32px Arial, sans-serif'
            context.fillText('Press the red power button to meet me.', 80, 418)
        }
        else
        {
            const content = this.pages[this.page]
            context.fillStyle = '#b9eb7a'
            context.fillRect(80, 68, 46, 5)

            context.fillStyle = '#9eacb9'
            context.font = '600 23px Arial, sans-serif'
            context.fillText(content.eyebrow.toUpperCase(), 80, 120)

            context.fillStyle = '#f3f4ee'
            context.font = '700 58px Arial, sans-serif'
            let titleY = 222
            this.wrapText(content.title, 1120, 58).slice(0, 2).forEach((line) =>
            {
                context.fillText(line, 80, titleY)
                titleY += 70
            })

            context.fillStyle = '#c1cad1'
            this.wrapText(content.description, 1120, 31).slice(0, 3).forEach((line, index) =>
            {
                context.font = '31px Arial, sans-serif'
                context.fillText(line, 80, titleY + 35 + index * 47)
            })

            context.fillStyle = '#f3f4ee'
            context.font = '500 20px Arial, sans-serif'
            context.textAlign = 'right'
            context.fillText('ABOUT', 1200, 96)
            context.textAlign = 'left'

            context.fillStyle = '#c1cad1'
            context.font = '600 26px Arial, sans-serif'
            context.fillText('SKILLS', 80, 480)
            this.wrapText(profile.skills.join('  \u00b7  '), 1120, 26).slice(0, 3).forEach((line, index) =>
            {
                context.font = '26px Arial, sans-serif'
                context.fillText(line, 80, 528 + index * 36)
            })

            context.fillStyle = '#b9eb7a'
            context.font = '600 23px Arial, sans-serif'
            context.fillText(`GITHUB  ${links.github.replace('https://', '')}`, 80, 660)
            context.fillText(`LINKEDIN  ${links.linkedin.replace('https://', '')}`, 560, 660)
        }
        this.screen.texture.needsUpdate = true
    }

    wrapText(_text, _maxWidth, _fontSize)
    {
        const context = this.screen.context
        context.font = `${_fontSize}px Arial, sans-serif`
        const lines = []
        let line = ''

        for(const word of _text.split(' '))
        {
            const next = line ? `${line} ${word}` : word
            if(context.measureText(next).width > _maxWidth && line)
            {
                lines.push(line)
                line = word
            }
            else
            {
                line = next
            }
        }

        if(line)
            lines.push(line)

        return lines
    }
}
