export function split(str) {
  return str
    .trim()
    .split(/\n+/)
    .filter((x) => x);
}

export function* getCombinations({ foregrounds, backgrounds, groupBy }) {
  if (groupBy === "foreground") {
    for (const fg of foregrounds) {
      for (const bg of backgrounds) {
        yield { fg, bg };
      }
    }
  } else {
    for (const bg of backgrounds) {
      for (const fg of foregrounds) {
        yield { fg, bg };
      }
    }
  }
}
