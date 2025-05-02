function dealerRonn(fan: number, fu?: number) {
  let point: number = 0
  if (fan === 0) {
    const fuPoints: { [key: number]: number } = {
      2: 1500,
      3: 2000,
      4: 2400,
      5: 2900,
      6: 3400,
      7: 3900,
      8: 4400,
      9: 4800,
      10: 5300,
    }
    point = fuPoints[fu!]
  } else if (fan === 1) {
    const fuPoints: { [key: number]: number } = {
      1: 2400,
      2: 2900,
      3: 3900,
      4: 4800,
      5: 5800,
      6: 6800,
      7: 7700,
      8: 8700,
      9: 9600,
      10: 10600,
    }
    point = fuPoints[fu!]
  } else if (fan === 2) {
    const fuPoints: { [key: number]: number } = {
      1: 4800,
      2: 5800,
      3: 7700,
      4: 9600,
      5: 11600,
    }
    point = fuPoints[fu!]
  } else if (fan === 3) {
    const fuPoints: { [key: number]: number } = {
      1: 9600,
      2: 11600,
    }
    point = fuPoints[fu!]
  } else if (fan === 4) {
    point = 12000
  } else if (fan === 5) {
    point = 18000
  } else if (fan === 6) {
    point = 24000
  } else if (fan === 7) {
    point = 36000
  } else if (fan === 8) {
    point = 48000
  }
  return point
}

function nonDealerRonn(fan: number, fu?: number) {
  let point: number = 0
  if (fan === 0) {
    const fuPoints: { [key: number]: number } = {
      2: 1000,
      3: 1300,
      4: 1600,
      5: 2000,
      6: 2300,
      7: 2600,
      8: 2900,
      9: 3200,
      10: 3600,
    }
    point = fuPoints[fu!]
  } else if (fan === 1) {
    const fuPoints: { [key: number]: number } = {
      1: 1600,
      2: 2000,
      3: 2600,
      4: 3200,
      5: 3900,
      6: 4500,
      7: 5200,
      8: 5800,
      9: 6400,
      10: 7100,
    }
    point = fuPoints[fu!]
  } else if (fan === 2) {
    const fuPoints: { [key: number]: number } = {
      1: 3200,
      2: 3900,
      3: 5200,
      4: 6400,
      5: 7700,
    }
    point = fuPoints[fu!]
  } else if (fan === 3) {
    const fuPoints: { [key: number]: number } = {
      1: 6400,
      2: 7700,
    }
    point = fuPoints[fu!]
  } else if (fan === 4) {
    point = 8000
  } else if (fan === 5) {
    point = 12000
  } else if (fan === 6) {
    point = 16000
  } else if (fan === 7) {
    point = 24000
  } else if (fan === 8) {
    point = 32000
  }
  return point
}

export function ronnPoint(dealer: boolean, fan: number, fu?: number) {
  if (dealer) {
    return dealerRonn(fan, fu)
  } else {
    return nonDealerRonn(fan, fu)
  }
}
