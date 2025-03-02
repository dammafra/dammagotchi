export default {
  stats: {
    hungryDecayRate: 200,
    happyDecayRate: 200,
    messGenerationRate: 150,
    sicknessRate: 200,
    badRate: 300,
  },
  transitions: {
    hatching: 6,
    evolution: 4,
    death: 14,
  },
  stages: {
    egg: 15,
    babies: 200,
    children: 250,
    teenagers: 300,
    adults: 350,
    seniors: 250,
    death: 0,
  },
}
