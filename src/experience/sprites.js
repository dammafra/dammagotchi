const babyConfig = [
  { name: 'idle', index: 0, split: 2 },
  { name: 'hatching', index: 15 },
]

export default {
  pets: {
    babies: {
      petitchi: babyConfig,
      shiropetitchi: babyConfig,
    },
    children: [],
    teenagers: [],
    adults: [],
    seniors: [],
  },
  food: {},
  items: {},
  others: [
    { name: 'toilets', index: 0, split: 3 },
    { name: 'egg', index: 1, split: 2 },
    { name: 'death', index: 2 },
    { name: 'meter', index: 3, split: 2 },
    { name: 'poop', index: 4, split: 2 },
    { name: 'illnesses', index: 5, split: 3 },
  ],
}
