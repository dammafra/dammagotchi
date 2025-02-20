import Shepherd from 'shepherd.js'
import Experience from './experience'
import Icons from './ui/icons'

export default class Tutorial {
  constructor() {
    this.experience = Experience.instance
    this.camera = this.experience.camera
    this.device = this.experience.device
    this.screen = this.experience.screen
    this.ui = this.experience.ui
    this.pointer = this.experience.pointer

    this.overlay = document.querySelector('.tutorial-overlay')
    this.spotlight = document.querySelector('.tutorial-spotlight')
    this.completed = JSON.parse(localStorage.getItem('tutorial-completed'))

    document.getElementById('tutorial').onclick = this.start

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
        classes: 'welcome',
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
        title: 'Button A',
        text: '➡️ Press it to move between menu icons and options',
        buttons: [skipButton, backButton, nextButton('Got it!')],
      },
      {
        id: 'button-b',
        title: 'Button B',
        text: '🚀 Press it to confirm selections, interact with your pet, and make things happen!',
        buttons: [skipButton, backButton, nextButton('Understood!')],
      },
      {
        id: 'button-c',
        title: 'Button C',
        text: '❌ Press it to go back, cancel selection, or close menus',
        buttons: [skipButton, backButton, nextButton('Okay!')],
      },
      {
        id: 'screen',
        title: 'Screen',
        text: '📺 This is where your pet lives, eats, sleeps, and plays!<br/>Ready to learn about the actions?',
        buttons: [skipButton, backButton, nextButton("I'm Ready!")],
      },
      ...[
        {
          id: 'screen-meter',
          title: 'Meter',
          text: '❤️ This is where you check how your pet is doing! Keep an eye on these stats to keep your pet happy and healthy!',
        },
        {
          id: 'screen-feed',
          title: 'Feed',
          text: '🍔 Time to Eat! Feed your pet with meals when it’s hungry or choose a snack for a little treat<br/>(but don’t overdo it!)',
        },
        {
          id: 'screen-duck',
          title: 'Clean',
          text: '🧽 If your pet leaves a mess, it’s time to clean up! Flush away dirt and don’t let the mess pile up',
        },
        {
          id: 'screen-play',
          title: 'Play',
          text: '🎮 Keep your pet entertained for a happy, healthy life! Have Some Fun!',
        },
        {
          id: 'screen-discipline',
          title: 'Discipline',
          text: '⚖️ Sometimes, your pet misbehaves, ignoring food or calling for no reason. Teach good behavior!',
        },
        {
          id: 'screen-medicine',
          title: 'Medicine',
          text: '💉 If your pet gets sick, use this to give it medicine and help it recover!',
        },
        {
          id: 'screen-light',
          title: 'Light',
          text: '💤 Your pet needs rest! Turn the light off when it goes to sleep and back on when it wakes up',
        },
      ].map(config => ({
        ...config,
        buttons: [skipButton, backButton, nextButton()],
      })),
      {
        id: 'screen-attention',
        title: 'Attention',
        text: '📢 When this icon lights up, your pet is calling for help! Take care of it!',
        buttons: [skipButton, backButton, nextButton("Let\'s go!")],
      },
      {
        id: 'button-reset',
        title: 'Reset',
        text: '🔄 Everything comes to an end… whether it’s when your pet passes away, or if you ever want a fresh start, just hit the reset button',
        buttons: [skipButton, backButton, nextButton('All set!')],
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
    this.pointer.enabled = false
    this.camera.controls.enabled = false

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

  animateCamera = async ({ step }) => {
    this.camera.controls.smoothTime = 0.5

    const iconsX = -0.245
    const iconsXIncrement = 0.17
    const iconsY = 0.29

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
        this.setSpotlight('lg')
        this.ui.icons.reset()
        this.camera.controls.zoomTo(1, true)
        await this.camera.controls.fitToBox(this.screen.mesh, true)
        break

      case 'screen-meter':
        this.setSpotlight('sm')
        this.ui.icons.setSelected(Icons.METER)
        this.camera.controls.zoomTo(1.5, true)
        await this.camera.controls.moveTo(iconsX, iconsY, 0, true)
        break
      case 'screen-feed':
        this.ui.icons.setSelected(Icons.FEED)
        await this.camera.controls.moveTo(iconsX + iconsXIncrement, iconsY, 0, true)
        break
      case 'screen-duck':
        this.ui.icons.setSelected(Icons.DUCK)
        await this.camera.controls.moveTo(iconsX + iconsXIncrement * 2, iconsY, 0, true)
        break
      case 'screen-play':
        this.ui.icons.setSelected(Icons.PLAY)
        await this.camera.controls.moveTo(iconsX + iconsXIncrement * 3, iconsY, 0, true)
        break
      case 'screen-discipline':
        this.ui.icons.setSelected(Icons.DISCIPLINE)
        await this.camera.controls.moveTo(iconsX, -iconsY, 0, true)
        break
      case 'screen-medicine':
        this.ui.icons.setSelected(Icons.MEDICINE)
        await this.camera.controls.moveTo(iconsX + iconsXIncrement, -iconsY, 0, true)
        break
      case 'screen-light':
        this.ui.icons.setSelected(Icons.LIGHT)
        await this.camera.controls.moveTo(iconsX + iconsXIncrement * 2, -iconsY, 0, true)
        break
      case 'screen-attention':
        this.ui.icons.reset()
        this.ui.icons.notifyAttention()
        this.camera.controls.rotateAzimuthTo(0, true)
        await this.camera.controls.moveTo(iconsX + iconsXIncrement * 3, -iconsY, 0, true)
        break

      case 'button-reset':
        this.hideSpotlight()
        this.ui.icons.resolveAttention()
        this.camera.controls.zoomTo(1, true)
        this.camera.controls.rotateAzimuthTo(Math.PI, true)
        await this.camera.controls.fitToBox(this.device.buttonSlots.at(3).mesh, true)
        this.setSpotlight('sm')
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
