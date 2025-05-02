function dealerTsumo(fan: number, fu?: number) {
  let point: number = 0
  if (fan === 0) {
    switch (fu) {
      case 2:
        point = 500
        break
      case 3:
        point = 700
        break
      case 4:
        point = 800
        break
      case 5:
        point = 1000
        break
      case 6:
        point = 1200
        break
      case 7:
        point = 1300
        break
      case 8:
        point = 1500
        break
      case 9:
        point = 1600
        break
    }
  } else if (fan === 1) {
    switch (fu) {
      case 0:
        point = 700
        break
      case 2:
        point = 1000
        break
      case 3:
        point = 1300
        break
      case 4:
        point = 1600
        break
      case 5:
        point = 2000
        break
      case 6:
        point = 2300
        break
      case 7:
        point = 2600
        break
      case 8:
        point = 2900
        break
      case 9:
        point = 3200
        break
      case 10:
        point = 3600
        break
    }
  } else if (fan === 2) {
    switch (fu) {
      case 0:
        point = 1300
        break
      case 1:
        point = 1600
        break
      case 2:
        point = 2000
        break
      case 3:
        point = 2600
        break
      case 4:
        point = 3200
        break
      case 5:
        point = 3900
        break
    }
  } else if (fan === 3) {
    switch (fu) {
      case 0:
        point = 2600
        break
      case 1:
        point = 3200
        break
      case 2:
        point = 3900
        break
    }
  } else if (fan === 4) {
    point = 4000
  } else if (fan === 5) {
    point = 6000
  } else if (fan === 6) {
    point = 8000
  } else if (fan === 7) {
    point = 12000
  } else if (fan === 8) {
    point = 16000
  }
  return point
} // 输出庄家自摸点数

function nonDealerTsumo(fan: number, fu?: number) {
  let point: Array<number> = [0, 0]
  if (fan === 0) {
    switch (fu) {
      case 2:
        point = [300, 500]
        break
      case 3:
        point = [400, 700]
        break
      case 4:
        point = [400, 800]
        break
      case 5:
        point = [500, 1000]
        break
      case 6:
        point = [600, 1200]
        break
      case 7:
        point = [700, 1300]
        break
      case 8:
        point = [800, 1500]
        break
      case 9:
        point = [800, 1600]
        break
    }
  } else if (fan === 1) {
    switch (fu) {
      case 0:
        point = [400, 700]
        break
      case 2:
        point = [500, 1000]
        break
      case 3:
        point = [700, 1300]
        break
      case 4:
        point = [800, 1600]
        break
      case 5:
        point = [1000, 2000]
        break
      case 6:
        point = [1200, 2300]
        break
      case 7:
        point = [1300, 2600]
        break
      case 8:
        point = [1500, 2900]
        break
      case 9:
        point = [1600, 3200]
        break
      case 10:
        point = [1800, 3600]
        break
    }
  } else if (fan === 2) {
    switch (fu) {
      case 0:
        point = [700, 1300]
        break
      case 1:
        point = [800, 1600]
        break
      case 2:
        point = [1000, 2000]
        break
      case 3:
        point = [1300, 2600]
        break
      case 4:
        point = [1600, 3200]
        break
      case 5:
        point = [2000, 3900]
        break
    }
  } else if (fan === 3) {
    switch (fu) {
      case 0:
        point = [1300, 2600]
        break
      case 1:
        point = [1600, 3200]
        break
      case 2:
        point = [2000, 3900]
        break
    }
  } else if (fan === 4) {
    point = [2000, 4000]
  } else if (fan === 5) {
    point = [3000, 6000]
  } else if (fan === 6) {
    point = [4000, 8000]
  } else if (fan === 7) {
    point = [6000, 12000]
  } else if (fan === 8) {
    point = [8000, 16000]
  }
  return point
} // 输出自家自摸点数

export function progressTsumo(winnerIndex: number, dealerIndex: number, fan: number, fu?: number) {
  let res: Array<number> = [0, 0, 0, 0]
  if (winnerIndex === dealerIndex) {
    const p = dealerTsumo(fan, fu)
    res = [-p, -p, -p, -p]
    res[winnerIndex] = 3 * p
    return res
  } else {
    const p = nonDealerTsumo(fan, fu)
    res = [-p[0], -p[0], -p[0], -p[0]]
    res[winnerIndex] = 2 * p[0] + p[1]
    res[dealerIndex] = -p[1]
    return res
  }
} // 输出结算列表

export function tsumoRewardString(
  winner: number,
  dealer: number,
  benchang: number,
  fan: number,
  fu?: number,
) {
  console.log(winner, dealer, fan, fu)
  if (winner === dealer) {
    return `${dealerTsumo(fan, fu) + benchang * 100} All!`
  } else {
    const r = nonDealerTsumo(fan, fu)
    return `${r[0] + benchang * 100}, ${r[1] + benchang * 100}!`
  }
}
