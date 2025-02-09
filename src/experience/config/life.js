export default {
  transitions: {
    egg: { in: 6, out: 4 },
    babies: { in: 4, out: 6 },
    children: { in: 4, out: 6 },
    teenagers: { in: 4, out: 6 },
    adults: { in: 4, out: 6 },
    seniors: { in: 4, out: 10 },
  },
  stages: {
    egg: 6,
    babies: 16,
    children: 16,
    teenagers: 16,
    adults: 16,
    seniors: 16,
    death: Number.POSITIVE_INFINITY,
  },
}
