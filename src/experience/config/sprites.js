const babyConfig = [
  { name: 'idle', index: 0, split: 2 },
  { name: 'happy', index: 2 },
  { name: 'eyes-closed', index: 8 },
  { name: 'upset', index: 10 },
  { name: 'eat', index: 12, split: 2 },
  { name: 'hatching', index: 13 },
  { name: 'no', index: 14 },
]

const childConfig = [
  { name: 'idle', index: 0, split: 2 },
  { name: 'happy', index: 2 },
  { name: 'eyes-closed', index: 8 },
  { name: 'upset', index: 10 },
  { name: 'eat', index: 12, split: 2 },
  { name: 'no', index: 14 },
]

const teenagerBaseConfig = [
  { name: 'idle', index: 0, split: 2 },
  { name: 'happy', index: 2 },
  { name: 'eyes-closed', index: 8 },
  { name: 'upset', index: 10 },
  { name: 'eat', index: 12, split: 2 },
  { name: 'no', index: 14 },
]
const teenagerConfig1 = teenagerBaseConfig
const teenagerConfig2 = teenagerBaseConfig

const adultBaseConfig = [
  { name: 'idle', index: 0, split: 2 },
  { name: 'happy', index: 7 },
  { name: 'eyes-closed', index: 18 },
  { name: 'upset', index: 22 },
  { name: 'eat', index: 26, split: 2 },
]
const adultConfig1 = adultBaseConfig.concat([{ name: 'no', index: 29 }])
const adultConfig2 = adultBaseConfig.concat([{ name: 'no', index: 30 }])
const adultConfig3 = adultBaseConfig.concat([{ name: 'no', index: 30 }])
const adultConfig4 = adultBaseConfig.concat([{ name: 'no', index: 30 }])

const seniorConfig = [
  { name: 'idle', index: 0, split: 2 },
  { name: 'happy', index: 7 },
  { name: 'eyes-closed', index: 18 },
  { name: 'upset', index: 22 },
  { name: 'eat', index: 25, split: 2 },
  { name: 'no', index: 28 },
]

export default {
  pets: {
    egg: { index: 0, split: 2 },
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
    death: { index: 0 },
  },
  food: [],
  items: [],
  misc: [
    { name: 'toilet', index: 0, split: 3 },
    { name: 'mess', index: 1, split: 2 },
    { name: 'happy', index: 2 },
    { name: 'illnesses', index: 3, split: 3 },
    { name: 'sleep', index: 4, split: 3 },
    { name: 'upset', index: 6, split: 3 },
    { name: 'effort', index: 8 },
  ],
  food: [
    { name: 'meal.babies', index: 66 },
    { name: 'meal.babies.partial', index: 67, split: 2 },

    { name: 'meal.children', index: 66 },
    { name: 'meal.children.partial', index: 67, split: 2 },

    { name: 'meal.teenagers', index: 74 },
    { name: 'meal.teenagers.partial', index: 75, split: 2 },

    { name: 'meal.adults', index: 82 },
    { name: 'meal.adults.partial', index: 83, split: 2 },

    { name: 'meal.seniors', index: 90 },
    { name: 'meal.seniors.partial', index: 91, split: 2 },

    { name: 'snack.babies', index: 116 },
    { name: 'snack.babies.partial', index: 117, split: 2 },

    { name: 'snack.children', index: 116 },
    { name: 'snack.children.partial', index: 117, split: 2 },

    { name: 'snack.teenagers', index: 122 },
    { name: 'snack.teenagers.partial', index: 123, split: 2 },

    { name: 'snack.adults', index: 124 },
    { name: 'snack.adults.partial', index: 125, split: 2 },

    { name: 'snack.seniors', index: 126 },
    { name: 'snack.seniors.partial', index: 127 },
  ],
}
