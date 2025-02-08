const petConfig = [{ name: 'idle', index: 0, split: 2 }]

const babyConfig = petConfig.concat([{ name: 'hatching', index: 13 }])

const childConfig = petConfig

const teenagerConfig1 = petConfig
const teenagerConfig2 = petConfig

const adultConfig1 = petConfig
const adultConfig2 = petConfig
const adultConfig3 = petConfig
const adultConfig4 = petConfig

const seniorConfig = petConfig

export default {
  pets: {
    babies: {
      petitchi: babyConfig,
      shiropetitchi: babyConfig,
    },
    children: {
      hitodetchi: childConfig,
      kinakomotchi: childConfig,
      kuribotchi: childConfig,
      marutchi: childConfig,
    },
    teenagers: {
      hinatchi: teenagerConfig1,
      ichigotchi: teenagerConfig1,
      nikatchi: teenagerConfig1,
      ringotchi: teenagerConfig1,
      'young-mametchi': teenagerConfig1,
      'young-mimitchi': teenagerConfig1,

      hinotamatchi: teenagerConfig2,
      oniontchi: teenagerConfig2,
      propellertchi: teenagerConfig2,
      ufotchi: teenagerConfig2,
    },
    adults: {
      gozarutchi: adultConfig1,
      hiratchi: adultConfig1,
      kiwitchi: adultConfig1,
      masktchi: adultConfig1,
      whaletchi: adultConfig1,
      zuccitchi: adultConfig1,

      butterflytchi: adultConfig2,
      dorotchi: adultConfig2,
      kabutchi: adultConfig2,
      kaerutchi: adultConfig2,
      kusatchi: adultConfig2,
      nyorotchi: adultConfig2,
      takotchi: adultConfig2,
      tarakotchi: adultConfig2,
      wooltchi: adultConfig2,

      androtchi: adultConfig3,
      flowertchi: adultConfig3,
      hanatchi: adultConfig3,

      chohimetchi: adultConfig4,
      debatchi: adultConfig4,
      ginjirotchi: adultConfig4,
      kuchipatchi: adultConfig4,
      mametchi: adultConfig4,
      marumimitchi: adultConfig4,
      memetchi: adultConfig4,
      mimitchi: adultConfig4,
      pochitchi: adultConfig4,
      pyonchitchi: adultConfig4,
      toratchi: adultConfig4,
      violetchi: adultConfig4,
    },
    seniors: {
      ojitchi: seniorConfig,
      otokitchi: seniorConfig,
      oyajitchi: seniorConfig,
    },
  },
  food: [],
  items: [],
  misc: [
    { name: 'toilets', index: 0, split: 3 },
    { name: 'egg', index: 1, split: 2 },
    { name: 'death', index: 2 },
    { name: 'meter', index: 3, split: 2 },
    { name: 'poop', index: 4, split: 2 },
    { name: 'illnesses', index: 5, split: 3 },
  ],
}
