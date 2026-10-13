import * as THREE from 'three'
import Experience from './Experience.js'

export default class Screen
{
    constructor(_mesh, _content)
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.mesh = _mesh
        this.content = _content

        this.setModel()
    }

    setModel()
    {
        this.model = {}

        this.model.canvas = document.createElement('canvas')
        this.model.canvas.width = 1280
        this.model.canvas.height = 720
        this.model.context = this.model.canvas.getContext('2d')

        // Texture
        this.model.texture = new THREE.CanvasTexture(this.model.canvas)
        this.model.texture.encoding = THREE.sRGBEncoding

        this.model.material = new THREE.MeshBasicMaterial({
            map: this.model.texture
        })

        this.model.mesh = this.mesh
        this.model.mesh.material = this.model.material
        this.scene.add(this.model.mesh)

        this.setContent(this.content)
    }

    setContent(_content)
    {
        const context = this.model.context
        const canvas = this.model.canvas

        context.fillStyle = '#111923'
        context.fillRect(0, 0, canvas.width, canvas.height)

        context.fillStyle = '#b9eb7a'
        context.fillRect(72, 68, 46, 5)

        context.fillStyle = '#9eacb9'
        context.font = '600 24px Arial, sans-serif'
        context.fillText(_content.eyebrow.toUpperCase(), 72, 124)

        context.fillStyle = '#f3f4ee'
        context.font = '700 58px Arial, sans-serif'

        const words = _content.title.split(' ')
        const lines = []
        let line = ''

        for(const word of words)
        {
            const next = line ? `${line} ${word}` : word

            if(context.measureText(next).width > 1110 && line)
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

        let titleY = 236
        for(const titleLine of lines.slice(0, 2))
        {
            context.fillText(titleLine, 72, titleY)
            titleY += 70
        }

        context.fillStyle = '#c1cad1'
        context.font = '32px Arial, sans-serif'
        const descriptionLines = this.wrapText(_content.description, 1110)
        let descriptionY = titleY + 32
        for(const descriptionLine of descriptionLines.slice(0, 4))
        {
            context.fillText(descriptionLine, 72, descriptionY)
            descriptionY += 48
        }

        if(_content.detail)
        {
            context.fillStyle = '#c1cad1'
            context.font = '25px Arial, sans-serif'
            const detailLines = this.wrapText(_content.detail, 1110)
            let detailY = Math.max(descriptionY + 8, 542)
            for(const detailLine of detailLines.slice(0, 2))
            {
                context.fillText(detailLine, 72, detailY)
                detailY += 38
            }
        }

        context.fillStyle = '#b9eb7a'
        context.font = '600 21px Arial, sans-serif'
        const footerLines = this.wrapText(_content.footer.toUpperCase(), 1110)
        let footerY = 638
        for(const footerLine of footerLines.slice(0, 2))
        {
            context.fillText(footerLine, 72, footerY)
            footerY += 32
        }

        this.model.texture.needsUpdate = true
    }

    wrapText(_text, _maxWidth)
    {
        const context = this.model.context
        const words = _text.split(' ')
        const lines = []
        let line = ''

        for(const word of words)
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

    update()
    {
    }
}