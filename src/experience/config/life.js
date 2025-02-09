export default {
  transitions: {
    egg: { in: 6, out: 6 },
    babies: { in: 4, out: 4 },
    children: { in: 4, out: 4 },
    teenagers: { in: 4, out: 4 },
    adults: { in: 4, out: 4 },
    seniors: { in: 4, out: 12 },
  },
  stages: {
    egg: 10,
    babies: 10,
    children: 10,
    teenagers: 10,
    adults: 10,
    seniors: 10,
    death: Number.POSITIVE_INFINITY,
  },
}
