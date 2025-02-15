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
    babies: 20,
    children: 20,
    teenagers: 20,
    adults: 20,
    seniors: 20,
    death: -1,
  },
}
