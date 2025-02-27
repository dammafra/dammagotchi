export default {
  stats: {
    hungryDecayRate: 200,
    happyDecayRate: 200,
    messGenerationRate: 100,
    sicknessRate: 150,
    badRate: 200,
  },
  transitions: {
    hatching: 6,
    evolution: 4,
    death: 14,
  },
  stages: {
    egg: 15,
    babies: 100,
    children: 150,
    teenagers: 200,
    adults: 250,
    seniors: 200,
    death: 0,
  },
}
