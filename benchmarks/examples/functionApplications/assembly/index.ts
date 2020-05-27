function ackermann(m: number, n: number): number {
  if (m == 0) {
    return n + 1;
  } else if (n == 0) {
    return ackermann(m - 1, 1);
  } else {
    return ackermann(m - 1, ackermann(m, n - 1));
  }
}

export function main(): number {
  let sum: number = 0;
  for (let n = 0; n < 5; n++) {
    for (let m = 0; m < 4; m++) {
      sum += ackermann(m, n);
    }
  }
  return sum;
}
