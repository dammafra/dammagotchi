import Shepherd from 'shepherd.js'
import Experience from './experience'

export default class Tutorial {
  constructor() {
    this.experience = Experience.instance
    this.camera = this.experience.camera
    this.device = this.experience.device
    this.screen = this.experience.screen
    this.pointer = this.experience.pointer
    this.picker = this.experience.picker

    this.overlay = document.querySelector('.tutorial-overlay')
    this.spotlight = document.querySelector('.tutorial-spotlight')
    this.completed = JSON.parse(localStorage.getItem('tutorial-completed'))

    this.setTutorialButton()

    this.tour = new Shepherd.Tour({
      useModalOverlay: true,
      defaultStepOptions: {
        arrow: false,
        classes: 'tutorial-step',
        attachTo: {
          element: '.webgl',
          on: 'bottom',
        },
      },
    })

    const skipButton = {
      text: 'Skip',
      secondary: true,
      action: this.tour.cancel,
    }

    const backButton = {
      text: 'Back',
      secondary: true,
      action: this.tour.back,
    }

    const nextButton = (text = 'Next') => ({
      text,
      action: this.tour.next,
    })

    this.tour.addSteps([
      {
        id: 'welcome',
        classes: 'ignore',
        title: 'Hey there!',
        text: 'Ever had a virtual pet before?',
        attachTo: undefined,
        buttons: [
          {
            text: '😎 Yes,<br/>I’m a pro!',
            secondary: true,
            action: () => (!this.device.tab.pulled ? this.tour.show('tab') : this.tour.complete()),
          },
          nextButton('🤔 No,<br/>teach me'),
        ],
      },
      {
        id: 'button-a',
        title: 'A Button [spacebar]',
        text: '➡️ Press it to move between menu icons and options',
        buttons: [skipButton, backButton, nextButton('Got it!')],
      },
      {
        id: 'button-b',
        title: 'B Button [enter]',
        text: '🚀 Press it to confirm selections, interact with your pet, and make things happen!',
        buttons: [skipButton, backButton, nextButton('Understood!')],
      },
      {
        id: 'button-c',
        title: 'C Button [esc]',
        text: '❌ Press it to go back, cancel selection, or close menus',
        buttons: [skipButton, backButton, nextButton('Okay!')],
      },
      {
        id: 'screen',
        title: 'Screen',
        text: '📺 This is where your pet lives, eats, sleeps, and plays!<br/>Ready to learn about the actions?',
        buttons: [skipButton, backButton, nextButton("I'm Ready!")],
      },

      {
        id: 'screen-top',
        classes: 'small',
        text: `<ul>
          <li>❤️ <strong>Meter</strong> - This is where you check how your pet is doing, keep an eye on these stats!</li>
          <li>🍔 <strong>Feed</strong> -  Feed your pet with meals when it’s hungry or choose a snack for a little treat</li>
          <li>🧽 <strong>Clean</strong> - If your pet leaves a mess flush it away and don’t let it pile up</li>
          <li>🎮 <strong>Play</strong> - Keep your pet entertained for a happy, healthy life!</li>
          </ul>`,
        buttons: [skipButton, backButton, nextButton()],
      },
      {
        id: 'screen-bottom',
        classes: 'small',
        text: `<ul>
        <li>⚖️ <strong>Discipline</strong> - Sometimes your pet misbehaves, ignoring food or calling for no reason. Teach good behavior!</li>
        <li>💉 <strong>Medicine</strong> - If your pet gets sick, use this to give it medicine and help it recover</li>
        <li>💤 <strong>Light</strong> - Turn the light off when it goes to sleep and back on when it wakes up</li>
        <li>📢 <strong>Attention</strong> - When this icon lights up, your pet needs something</li>
        </ul>`,
        buttons: [skipButton, backButton, nextButton('Continue')],
      },
      {
        id: 'button-reset',
        title: 'Reset',
        text: '🔄 Everything comes to an end… whether it’s when your pet passes away, or if you ever want a fresh start, just hit the reset button',
        buttons: [skipButton, backButton, nextButton('What’s next?')],
      },
      {
        id: 'customization',
        title: 'Customization',
        text: ' 🌈 Change the frame and shell colors to make it truly yours!',
        classes: 'ignore',
        attachTo: {
          element: '#colors',
          on: 'top',
        },
        buttons: [skipButton, backButton, nextButton("It's clear")],
      },
      {
        id: 'sounds',
        title: 'Sounds [M]',
        text: '🎶 Turn the game sound on or off whenever you like!',
        classes: 'ignore',
        attachTo: {
          element: '#muted',
          on: 'top',
        },
        buttons: [skipButton, backButton, nextButton('Sounds good!')],
      },
      {
        id: 'time-speed',
        title: 'Time Speed [1][2][3]',
        text: '⏱️ You can adjust how fast time passes in the game.<br/>Choose the pace that fits your style between three options',
        classes: 'ignore',
        attachTo: {
          element: '#speed-settings',
          on: 'top',
        },
        buttons: [skipButton, backButton, nextButton('Time to go')],
      },
    ])

    if (!this.device.tab.pulled) {
      this.tour.addStep({
        id: 'tab',
        title: "It's all set!",
        text: '✨ Pull out the battery tab to turn on the device and your virtual pet will come to life!',
        buttons: [nextButton('Done')],
      })
    }

    this.tour.on('complete', this.end)
    this.tour.on('cancel', () =>
      !this.device.tab.pulled ? this.tour.show('tab') : this.tour.complete(),
    )
    this.tour.on('show', this.animateCamera)
  }

  toggleOverlay() {
    this.overlay.classList.toggle('flex')
    this.overlay.classList.toggle('hidden')
  }

  hideSpotlight() {
    this.spotlight.style.borderWidth = '1000px'
  }

  setSpotlight(dimension) {
    this.spotlight.style.borderWidth =
      dimension === 'lg' ? `4650px` : dimension === 'md' ? '4800px' : '4900px'
  }

  start = () => {
    if (this.tour.isActive()) return

    this.pointer.enabled = false
    this.camera.controls.enabled = false
    this.picker.hide()

    this.tour.start()
    this.toggleOverlay()
  }

  end = async () => {
    this.hideSpotlight()
    setTimeout(() => this.toggleOverlay(), 1000)

    this.pointer.enabled = true
    this.camera.controls.enabled = true

    if (this.device.tab.pulled) this.camera.intro()

    localStorage.setItem('tutorial-completed', 'true')
  }

  setTutorialButton() {
    this.button = document.getElementById('tutorial')
    this.button.onclick = () => {
      this.start()
      this.button.blur()
    }
  }

  animateCamera = async ({ step }) => {
    this.camera.controls.smoothTime = 0.5

    const iconsXStart = -0.245
    const iconsXEnd = iconsXStart + 0.17 * 3
    const iconsYTop = 0.2
    const iconsYBottom = -0.4

    const tabX = 0.9
    const tabY = -0.3

    switch (step.id) {
      case 'welcome':
        this.hideSpotlight()
        await this.camera.controls.setLookAt(0, 0, 3, 0, 0, 0, true)
        break

      case 'button-a':
        this.setSpotlight('sm')
        await this.camera.controls.fitToBox(this.device.buttonSlots.at(0).mesh, true)
        break
      case 'button-b':
        await this.camera.controls.fitToBox(this.device.buttonSlots.at(1).mesh, true)
        break
      case 'button-c':
        this.setSpotlight('sm')
        await this.camera.controls.fitToBox(this.device.buttonSlots.at(2).mesh, true)
        break

      case 'screen':
        this.camera.controls.smoothTime = 0.5
        this.setSpotlight('lg')
        this.camera.controls.zoomTo(1, true)
        await this.camera.controls.fitToBox(this.screen.mesh, true)
        break

      case 'screen-top':
        this.hideSpotlight()
        this.camera.controls.zoomTo(1.5, true)
        await this.camera.controls.moveTo(iconsXStart, iconsYTop, 0, true)
        this.camera.controls.smoothTime = 2
        await this.camera.controls.moveTo(iconsXEnd, iconsYTop, 0, true)
        break
      case 'screen-bottom':
        this.hideSpotlight()
        this.camera.controls.zoomTo(1.5, true)
        this.camera.controls.rotateAzimuthTo(0, true)
        await this.camera.controls.moveTo(iconsXStart, iconsYBottom, 0, true)
        this.camera.controls.smoothTime = 2
        await this.camera.controls.moveTo(iconsXEnd, iconsYBottom, 0, true)
        break

      case 'button-reset':
        this.camera.controls.smoothTime = 0.5
        this.camera.controls.zoomTo(1, true)
        this.camera.controls.rotateAzimuthTo(Math.PI, true)
        this.setSpotlight('sm')
        await this.camera.controls.fitToBox(this.device.buttonSlots.at(3).mesh, true)
        break

      case 'customization':
      case 'sounds':
      case 'time-speed':
        this.hideSpotlight()
        this.camera.controls.setLookAt(0, 0, 3, 0, 0, 0, true)
        break

      case 'tab':
        this.setSpotlight('md')
        this.camera.controls.zoomTo(1, true)
        this.camera.controls.fitToBox(this.device.tab.mesh, true)
        this.camera.controls.moveTo(tabX, tabY, 0, true)
        await this.camera.controls.rotateAzimuthTo(Math.PI * 0.25, true)
        this.camera.lockRotation()
        break
    }
  }
}
