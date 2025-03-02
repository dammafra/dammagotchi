import Shepherd from 'shepherd.js'
import Experience from './experience'

export default class Tutorial {
  constructor() {
    this.experience = Experience.instance
    this.sizes = this.experience.sizes
    this.camera = this.experience.camera
    this.device = this.experience.device
    this.screen = this.experience.screen
    this.pointer = this.experience.pointer
    this.ui = this.experience.ui

    this.overlay = document.querySelector('.tutorial-overlay')
    this.spotlight = document.querySelector('.tutorial-spotlight')
    this.completed = JSON.parse(localStorage.getItem('tutorial-completed'))

    this.setTutorialButton()

    window.controls = this.camera.controls

    this.tour = new Shepherd.Tour({
      useModalOverlay: true,
      defaultStepOptions: {
        arrow: false,
        classes: 'tutorial-step',
        attachTo: {
          element: '.webgl',
          on: 'bottom',
        },
        when: {
          show() {
            const currentStep = this.tour.getCurrentStep()
            const currentStepElement = currentStep?.getElement()
            const header = currentStepElement?.querySelector('.shepherd-header')
            if (header) {
              const progress = document.createElement('span')
              progress.innerText = `${this.tour.steps.indexOf(currentStep) + 1}/${this.tour.steps.length}`
              header.append(progress)
            }
          },
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
            action: () => (this.device.tab ? this.tour.show('tab') : this.tour.complete()),
          },
          nextButton('🤔 No,<br/>teach me'),
        ],
      },
      {
        id: 'button-a',
        title: `A Button${this.pointer.isTouchDevice ? '' : '<img src="images/keys/tab.png"/>'}`,
        text: '➡️ Press it to move between menu icons and options',
        buttons: [skipButton, backButton, nextButton('Got it!')],
      },
      {
        id: 'button-b',
        title: `B Button${this.pointer.isTouchDevice ? '' : '<div><img src="images/keys/spacebar.png"/><img class="ml-2" src="images/keys/return.png"/></div>'}`,
        text: '🚀 Press it to confirm selections, interact with your pet, and make things happen!',
        buttons: [skipButton, backButton, nextButton('Understood!')],
      },
      {
        id: 'button-c',
        title: `C Button${this.pointer.isTouchDevice ? '' : '<img src="images/keys/backspace.png"/>'}`,
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
          <li>🍔 <strong>Feed</strong> -  Feed your pet with meals when it’s hungry or choose a snack when it's unhappy</li>
          <li>💤 <strong>Light</strong> - Turn the light off when it goes to sleep and back on when it wakes up</li>
          <li>🎮 <strong>Play</strong> - Keep your pet entertained for a happy, healthy life!</li>
          <li>💉 <strong>Medicine</strong> - If your pet gets sick, use this to give it medicine and help it recover</li>
        </ul>`,
        buttons: [skipButton, backButton, nextButton()],
      },
      {
        id: 'screen-bottom',
        classes: 'small',
        text: `<ul>
          <li>🧽 <strong>Clean</strong> - If your pet leaves a mess flush it away and don’t let it pile up</li>
          <li>❤️ <strong>Meter</strong> - This is where you check how your pet is doing, keep an eye on these stats!</li>
          <li>⚖️ <strong>Discipline</strong> - Sometimes your pet misbehaves, ignoring food or calling for no reason. Teach good behavior!</li>
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
        title: `Sounds${this.pointer.isTouchDevice ? '' : '<div><img src="images/keys/m.png"/><img src="images/keys/b.png"/></div>'}`,
        text: '🎶 Turn the game sounds and music on or off whenever you like!<br/>(On mobile, the game respects your device’s silent mode)',
        classes: 'ignore',
        attachTo: {
          element: '#sounds',
          on: 'top',
        },
        buttons: [skipButton, backButton, nextButton('Sounds good!')],
      },
      {
        id: 'time-speed',
        title: `Time Speed${this.pointer.isTouchDevice ? '' : '<div><img src="images/keys/1.png"/><img src="images/keys/2.png"/><img src="images/keys/3.png"/></div>'}`,
        text: '⏱️ You can adjust how fast time passes in the game. Choose the pace that fits your style between three options',
        classes: 'ignore',
        attachTo: {
          element: '#speed-settings',
          on: 'top',
        },
        buttons: [skipButton, backButton, nextButton('Time to go')],
      },
    ])

    if (this.device.tab) {
      this.tour.addStep({
        id: 'tab',
        title: "It's all set!",
        text: '✨ Pull and remove the battery plastic strip to turn on the device and your virtual pet will come to life!',
        buttons: [nextButton('Done')],
      })
    }

    this.tour.on('complete', async () => {
      if (this.lastTransition) {
        await this.lastTransition
      }
      this.end()
    })

    this.tour.on('cancel', () =>
      this.device.tab && this.tour.currentStep.id !== 'tab'
        ? this.tour.show('tab')
        : this.tour.complete(),
    )

    this.tour.on('show', async step => {
      if (this.lastTransition) {
        await this.lastTransition
      }

      this.lastTransition = this.animateCamera(step)
    })
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

    this.camera.controls.enabled = false
    if (this.device.colorPicker.visible) this.device.colorPicker.toggle()

    this.tour.start()
    this.toggleOverlay()
  }

  end = async () => {
    this.hideSpotlight()
    setTimeout(() => this.toggleOverlay(), 1000)

    this.camera.intro()

    localStorage.setItem('tutorial-completed', 'true')
  }

  setTutorialButton() {
    this.button = document.getElementById('tutorial')
    this.button.onclick = this.start
  }

  animateCamera = async ({ step }) => {
    this.camera.controls.smoothTime = 0.5

    const iconsXStart = -0.245
    const iconsXEnd = iconsXStart + 0.17 * 3
    const iconsYTop = 0.2
    const iconsYBottom = -0.4

    const tabX = 1
    const tabY = -0.2

    switch (step.id) {
      case 'welcome':
        this.hideSpotlight()
        this.camera.intro(0.5)
        break

      case 'button-a':
        this.setSpotlight('sm')
        this.camera.controls.fitToBox(this.device.buttonSlots.at(0).mesh, true)
        break
      case 'button-b':
        this.camera.controls.fitToBox(this.device.buttonSlots.at(1).mesh, true)
        break
      case 'button-c':
        this.setSpotlight('sm')
        this.camera.controls.zoomTo(1, true)
        this.camera.controls.fitToBox(this.device.buttonSlots.at(2).mesh, true)
        break

      case 'screen':
        this.setSpotlight(this.sizes.aspectRatio < 1 ? 'md' : 'lg')
        this.camera.controls.zoomTo(this.sizes.aspectRatio < 1 ? 0.6 : 1, true)
        this.camera.controls.fitToBox(this.screen.mesh, true, { cover: true })
        break

      case 'screen-top':
        this.hideSpotlight()
        this.camera.controls.zoomTo(1.5, true)
        await this.camera.controls.moveTo(iconsXStart, iconsYTop, 0, true)
        this.camera.controls.smoothTime = 2
        this.camera.controls.moveTo(iconsXEnd, iconsYTop, 0, true)
        break
      case 'screen-bottom':
        this.hideSpotlight()
        this.camera.controls.zoomTo(1.5, true)
        this.camera.controls.rotateAzimuthTo(0, true)
        await this.camera.controls.moveTo(iconsXStart, iconsYBottom, 0, true)
        this.camera.controls.smoothTime = 2
        this.camera.controls.moveTo(iconsXEnd, iconsYBottom, 0, true)
        break

      case 'button-reset':
        this.camera.controls.zoomTo(1, true)
        this.camera.controls.rotateAzimuthTo(Math.PI, true)
        this.setSpotlight('sm')
        this.camera.controls.fitToBox(this.device.buttonSlots.at(3).mesh, true)
        break

      case 'customization':
      case 'sounds':
      case 'time-speed':
        this.hideSpotlight()
        this.camera.intro(0.5)
        break

      case 'tab':
        this.setSpotlight(this.sizes.aspectRatio < 1 ? 'md' : 'lg')
        this.camera.controls.zoomTo(1, true)
        this.camera.controls.fitToBox(this.device.tab.mesh, true)
        this.camera.controls.moveTo(tabX, tabY, 0, true)
        this.camera.controls.rotateAzimuthTo(Math.PI * 0.25, true)
        break
    }
  }
}
