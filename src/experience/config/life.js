export default {
  transitions: {
    egg: { in: 6, out: 6 },
    babies: { in: 4, out: 4 },
    children: { in: 4, out: 4 },
    teenagers: { in: 4, out: 4 },
    adults: { in: 4, out: 4 },
    seniors: { in: 4, out: 14 },
  },
  stages: {
    egg: 10,
    babies: 100,
    children: 100,
    teenagers: 100,
    adults: 100,
    seniors: 100,
    death: -1,
  },
}
