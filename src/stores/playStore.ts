import { defineStore } from 'pinia'
// import { reactive } from 'vue'

export const usePlayStore = defineStore('play', {
  state: () => ({
    // 游戏规则
    rules: {
      originalPoint: 25000, // 原点
      returnPoint: 30000, // 返点
      placementBonus: [20, 10, -10, -20], // 顺位马
    },
    // 玩家信息
    players: [
      { id: 0, name: '东位', score: 25000, isRiichi: false },
      { id: 1, name: '南位', score: 25000, isRiichi: false },
      { id: 2, name: '西位', score: 25000, isRiichi: false },
      { id: 3, name: '北位', score: 25000, isRiichi: false },
    ],
    // 对局信息
    gameInfo: {
      round: 0,
      ju: 0,
      benchang: 0,
      changgong: 0,
      starter: 0,
      dice: [0, 0],
    },
  }),

  actions: {
    // // 更新玩家排名
    // updatePlayerRanks() {
    //   const starter = this.gameInfo.starter

    //   // 根据分数和 {index + 4 - starter} 排序
    //   const sortedPlayers = [...this.players].sort((a, b) => {
    //     if (a.score !== b.score) {
    //       return b.score - a.score // 分数高的排前面
    //     }
    //     // 分数相同时，比较 {index + 4 - starter} 的大小
    //     const aPriority = (a.id + 4 - starter) % 4
    //     const bPriority = (b.id + 4 - starter) % 4
    //     return aPriority - bPriority // 数值小的排前面
    //   })

    //   // 更新排名
    //   sortedPlayers.forEach((player, index) => {
    //     this.players[player.id].rank = index
    //   })

    //   this.saveState() // 保存状态
    // },
    // 更新玩家分数
    updatePlayerScore(playerIndex: number, score: number) {
      this.players[playerIndex].score = score
      this.saveState() // 保存状态
    },
    // 切换玩家立直状态
    toggleRiichi(index: number) {
      this.players[index].isRiichi = !this.players[index].isRiichi
      this.saveState() // 保存状态
    },
    // 更新场供
    updateChanggong(changgong: number) {
      this.gameInfo.changgong = changgong
      this.saveState() // 保存状态
    },
    // 更新场风
    updateRound(round: number) {
      this.gameInfo.round = round
      this.saveState() // 保存状态
    },
    // 更新局数
    updateJu(ju: number) {
      this.gameInfo.ju = ju
      this.saveState() // 保存状态
    },
    // 更新起始玩家
    updateStarter(starter: number) {
      this.gameInfo.starter = starter
      this.saveState() // 保存状态
    },
    // 更新本场
    updateBenchang(benchang: number) {
      this.gameInfo.benchang = benchang
      this.saveState() // 保存状态
    },

    rollDice() {
      const randomDice = () => Math.floor(Math.random() * 6) + 1
      this.gameInfo.dice = [randomDice(), randomDice()]
      this.saveState() // 保存状态
    },

    // 重置游戏
    resetGame(
      originalPoint: number = 25000,
      starter: number = 0,
      returnPoint: number = 30000,
      placementBonus: Array<number> = [20, 10, -10, -20],
    ) {
      this.players.forEach((player) => {
        player.score = originalPoint
        player.isRiichi = false
      })
      this.rules.originalPoint = originalPoint
      this.rules.returnPoint = returnPoint
      this.rules.placementBonus = placementBonus
      this.gameInfo.starter = starter
      this.gameInfo.round = 0
      this.gameInfo.ju = 0
      this.gameInfo.benchang = 0
      this.gameInfo.changgong = 0
      this.gameInfo.dice = [0, 0]
      this.saveState() // 保存状态
    },

    updateGameInfo(newGameInfo: Partial<typeof this.gameInfo>) {
      this.gameInfo = { ...this.gameInfo, ...newGameInfo }
      this.saveState() // 保存状态
    },

    updatePlayerName(playerIndex: number, name: string) {
      this.players[playerIndex].name = name
      this.saveState() // 保存状态
    },

    // 保存状态到 localStorage
    saveState() {
      const state = {
        rules: this.rules,
        players: this.players,
        gameInfo: this.gameInfo,
      }
      localStorage.setItem('playStore', JSON.stringify(state))
    },

    // 从 localStorage 加载状态
    loadState() {
      const savedState = localStorage.getItem('playStore')
      if (savedState) {
        const parsedState = JSON.parse(savedState)
        this.rules = parsedState.rules
        this.players = parsedState.players
        this.gameInfo = parsedState.gameInfo
      }
    },

    // 重置骰子
    resetDice() {
      this.gameInfo.dice = [0, 0]
      this.saveState() // 保存状态
    },

    // 重置玩家立直状态
    resetRiichi() {
      this.players.forEach((player) => {
        player.isRiichi = false
      })
      this.saveState() // 保存状态
    },

    // 按列表修改玩家分数
    updateAllPlayerScores(scores: Array<number>) {
      this.players.forEach((player, index) => {
        player.score += scores[index]
      })
      this.saveState() // 保存状态
    },
  },
})
