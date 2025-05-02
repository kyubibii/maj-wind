import { proceedToNextRound } from './nextRoundLogic'
import { usePlayStore } from '@/stores/playStore'

// 定义玩家数据结构
interface PlayerData {
  id: number
  name: string
  score: number
  tenpaiStatus: boolean
  nagashiManganStatus: boolean
}

// 定义输入数据结构
interface EndByDrawData {
  isAbortiveDraw: boolean
  gameInfo: {
    round: number
    ju: number
    benchang: number
    starter: number
  }
  players: PlayerData[]
}

// 获取 playStore 实例
const playStore = usePlayStore()

export function processEndByDraw(data: EndByDrawData) {
  console.log('Processing End By Draw:', data)

  const { isAbortiveDraw, gameInfo, players } = data
  if (!isAbortiveDraw) {
    const tenpaiPlayers = players.filter((player) => player.tenpaiStatus)
    const notenPlayers = players.filter((player) => !player.tenpaiStatus)
    console.log('Tenpai Players:', tenpaiPlayers)
    console.log('Noten Players:', notenPlayers)

    const tenpaiList = [0, 0, 0, 0]
    if (tenpaiPlayers.length !== 0 && notenPlayers.length !== 0) {
      const penalty = Math.floor(3000 / notenPlayers.length)
      console.log('Penalty:', penalty)
      const reward = Math.floor(3000 / tenpaiPlayers.length)
      console.log('Reward:', reward)
      // 未听牌玩家扣点
      notenPlayers.forEach((player) => {
        tenpaiList[player.id] -= penalty
      })

      // 听牌玩家加点
      tenpaiPlayers.forEach((player) => {
        tenpaiList[player.id] += reward
      })
    }

    // 流满逻辑
    const nagashiManganList = [0, 0, 0, 0]
    players.forEach((player, index) => {
      const dealerIndex = (gameInfo.starter + gameInfo.ju) % 4
      if (player.nagashiManganStatus) {
        if (player.id === dealerIndex) {
          nagashiManganList[index] += 12000
          nagashiManganList.forEach((_, i) => {
            if (i !== index) {
              nagashiManganList[i] -= 4000
            }
          })
        } else {
          nagashiManganList[index] += 8000
          nagashiManganList.forEach((_, i) => {
            if (i !== index) {
              nagashiManganList[i] -= 2000
            }
          })
          nagashiManganList[dealerIndex] -= 2000
        }
      }
    })
    players.forEach((player, index) => {
      playStore.updatePlayerScore(
        player.id,
        player.score + nagashiManganList[index] + tenpaiList[index],
      )
    })

    // 判断庄家是否听牌
    const dealer = players[(gameInfo.starter + gameInfo.ju) % 4]
    if (!dealer.tenpaiStatus) {
      const nextState = proceedToNextRound(gameInfo.round, gameInfo.ju)
      playStore.updateRound(nextState.round)
      playStore.updateJu(nextState.ju)
    }
  }
  playStore.updateBenchang(gameInfo.benchang + 1)
  playStore.resetRiichi()
}
