import * as THREE from 'three'
import Experience from './Experience.js'
import Baked from './Baked.js'
import GoogleLeds from './GoogleLeds.js'
import LoupedeckButtons from './LoupedeckButtons.js'
import CoffeeSteam from './CoffeeSteam.js'
import TopChair from './TopChair.js'
import ElgatoLight from './ElgatoLight.js'
import RemoteTV from './RemoteTV.js'
import ProjectBookshelf from './ProjectBookshelf.js'
import Screen from './Screen.js'

export default class World
{
    constructor(_options)
    {
        this.experience = new Experience()
        this.config = this.experience.config
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        
        this.resources.on('groupEnd', (_group) =>
        {
            if(_group.name === 'base')
            {
                this.setBaked()
                this.setGoogleLeds()
                this.setLoupedeckButtons()
                this.setCoffeeSteam()
                this.setTopChair()
                this.setElgatoLight()
                this.setRemoteTV()
                this.setProjectBookshelf()
                this.setScreens()
            }
        })
    }

    setBaked()
    {
        this.baked = new Baked()
    }

    setGoogleLeds()
    {
        this.googleLeds = new GoogleLeds()
    }

    setLoupedeckButtons()
    {
        this.loupedeckButtons = new LoupedeckButtons()
    }

    setCoffeeSteam()
    {
        this.coffeeSteam = new CoffeeSteam()
    }

    setTopChair()
    {
        this.topChair = new TopChair()
    }

    setElgatoLight()
    {
        this.elgatoLight = new ElgatoLight()
    }

    setRemoteTV()
    {
        this.remoteTV = new RemoteTV((isOn) =>
        {
            if(isOn)
            {
                const fov = THREE.MathUtils.degToRad(this.experience.camera.instance.fov)
                const aspect = this.experience.config.width / this.experience.config.height
                const tan = Math.tan(fov * 0.5)
                const heightFit = 1.74 / (2 * tan)
                const widthFit = 3.1 / (2 * tan * aspect)
                const fitRadius = (aspect >= 1.2 ? Math.min(heightFit, widthFit) : Math.max(heightFit, widthFit)) * 0.99

                this.experience.navigation.focusOn(
                    new THREE.Vector3(4.15, 2.717, 1.63),
                    fitRadius,
                    -Math.PI * 0.5,
                    Math.PI * 0.5
                )
            }
            else
            {
                this.experience.navigation.restoreFocus()
            }

            document.querySelector('.room-hint').textContent = isOn
                ? 'Space returns to the room  ·  click GitHub / LinkedIn on the screen'
                : 'Click the remote to turn on the TV  ·  click a book on the shelf'
        })
    }

    setProjectBookshelf()
    {
        this.projectBookshelf = new ProjectBookshelf()
    }

    setScreens()
    {
        this.pcScreen = new Screen(
            this.resources.items.pcScreenModel.scene.children[0],
            {
                eyebrow: 'AI / ML STUDIO',
                title: 'Ideas into applications',
                description: 'Experimenting with machine learning, language models, and tools that solve real-world problems.',
                footer: 'PYTHON  ·  FASTAPI  ·  PYTORCH  ·  REACT'
            }
        )
        this.macScreen = new Screen(
            this.resources.items.macScreenModel.scene.children[0],
            {
                eyebrow: 'WORK IN PROGRESS',
                title: 'Build · test · learn',
                description: 'Exploring useful ideas at the intersection of intelligent systems and everyday problems.',
                footer: 'EXPERIMENTS  ·  PROTOTYPES  ·  NEW IDEAS'
            }
        )
    }

    resize()
    {
    }

    update()
    {
        if(this.googleLeds)
            this.googleLeds.update()

        if(this.loupedeckButtons)
            this.loupedeckButtons.update()

        if(this.coffeeSteam)
            this.coffeeSteam.update()

        if(this.topChair)
            this.topChair.update()
    }

    destroy()
    {
    }
}