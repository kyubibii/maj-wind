<template>
  <div class="player-scores">
    <div class="player bottom">
      <div class="player-container">
        <div class="riichi-container">
          <span class="dealer-mark" :class="{ active: isDealer(0) }">庄</span>
          <button class="riichi-button" :class="{ active: activeButtons[0] }" @click="toggleRiichi(0)">·</button>
          <span class="start-mark" :class="{ active: isStarter(0) }">起</span>
        </div>
        <div class="player-info">
          <input class="player-name" v-model="players[0].name" @input="updatePlayerName(0, players[0].name)" />
          <div class="score">{{ scores[0] }}</div>
          <button class="dice-button" @click="rollDice">🎲</button>
        </div>
      </div>
    </div>
    <div class="player right">
      <div class="player-container">
        <div class="riichi-container">
          <span class="dealer-mark" :class="{ active: isDealer(1) }">庄</span>
          <button class="riichi-button" :class="{ active: activeButtons[1] }" @click="toggleRiichi(1)">·</button>
          <span class="start-mark" :class="{ active: isStarter(1) }">起</span>
        </div>
        <div class="player-info">
          <input class="player-name" v-model="players[1].name" @input="updatePlayerName(1, players[1].name)" />
          <div class="score">{{ scores[1] }}</div>
          <button class="dice-button" @click="rollDice">🎲</button>
        </div>
      </div>
    </div>
    <div class="player top">
      <div class="player-container">
        <div class="riichi-container">
          <span class="dealer-mark" :class="{ active: isDealer(2) }">庄</span>
          <button class="riichi-button" :class="{ active: activeButtons[2] }" @click="toggleRiichi(2)">·</button>
          <span class="start-mark" :class="{ active: isStarter(2) }">起</span>
        </div>
        <div class="player-info">
          <input class="player-name" v-model="players[2].name" @input="updatePlayerName(2, players[2].name)" />
          <div class="score">{{ scores[2] }}</div>
          <button class="dice-button" @click="rollDice">🎲</button>
        </div>
      </div>
    </div>
    <div class="player left">
      <div class="player-container">
        <div class="riichi-container">
          <span class="dealer-mark" :class="{ active: isDealer(3) }">庄</span>
          <button class="riichi-button" :class="{ active: activeButtons[3] }" @click="toggleRiichi(3)">·</button>
          <span class="start-mark" :class="{ active: isStarter(3) }">起</span>
        </div>
        <div class="player-info">
          <input class="player-name" v-model="players[3].name" @input="updatePlayerName(3, players[3].name)" />
          <div class="score">{{ scores[3] }}</div>
          <button class="dice-button" @click="rollDice">🎲</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { usePlayStore } from '@/stores/playStore'

const playStore = usePlayStore()
const players = computed(() => playStore.players)
const dealerIndex = computed(() => (playStore.gameInfo.ju + playStore.gameInfo.starter) % 4)
const starterIndex = computed(() => playStore.gameInfo.starter)
const scores = computed(() => players.value.map(player => player.score))

// 用于跟踪每个玩家的立直按钮状态
const activeButtons = computed(() => {
  return players.value.map(player => player.isRiichi)
})

// 判断是否为庄家
const isDealer = (index: number) => {
  return index === dealerIndex.value
}
// 判断是否为起家
const isStarter = (index: number) => {
  return index === starterIndex.value
}

// 切换立直按钮状态
const toggleRiichi = (index: number) => {
  const player = players.value[index]

  if (player.isRiichi) {
    // 取消立直：返还玩家 1000 点，减少场供 1000 点
    playStore.updatePlayerScore(index, player.score + 1000)
    playStore.updateChanggong(playStore.gameInfo.changgong - 1000)
  } else {
    // 激活立直：扣除玩家 1000 点，增加场供 1000 点
    playStore.updatePlayerScore(index, player.score - 1000)
    playStore.updateChanggong(playStore.gameInfo.changgong + 1000)
  }

  // 切换立直状态
  playStore.toggleRiichi(index)
}

// 骰子按钮点击事件
const rollDice = () => {
  playStore.resetDice()

  // 延迟 1000ms 执行 rollDice
  setTimeout(() => {
    playStore.rollDice()
  }, 200)
}

// 更新玩家名字
const updatePlayerName = (index: number, name: string) => {
  playStore.updatePlayerName(index, name)
}
</script>

<style lang="less" scoped>
.player-scores {
  position: relative;
  width: 100%;
  height: 100%;

  .player {
    position: absolute;
    font-size: clamp(20px, 5vmin, 50px);
    font-weight: bold;
    color: #333;
    text-align: center;
  }

  .top {
    top: 0.5em;
    left: 50%;
    transform: translateX(-50%) rotate(180deg);
    margin-top: auto;
  }

  .left {
    left: 0;
    top: 50%;
    transform: translateY(-50%) rotate(90deg);
    margin-left: -1.5em;
  }

  .right {
    right: 0;
    top: 50%;
    transform: translateY(-50%) rotate(-90deg);
    margin-right: -1.5em;
  }

  .bottom {
    bottom: 1em;
    left: 50%;
    transform: translateX(-50%);
    margin-bottom: auto;
  }

  .player-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0px;
  }

  .riichi-container {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    /* 控制“庄”、“起”和按钮之间的间距 */
  }

  .dealer-mark,
  .start-mark {
    font-size: 0.9em;
    font-weight: bold;
    color: #3333333b;
  }

  .dealer-mark.active {
    color: #ff2370;
    /* 庄家标记颜色 */
    text-shadow: 0 0 10px rgba(231, 104, 68, 0.5);
    /* 发光效果 */
  }

  .start-mark.active {
    color: #4bff14;
    /* 起家标记颜色 */
    text-shadow: 0 0 10px rgba(0, 255, 89, 0.5);
    /* 发光效果 */
  }

  .riichi-button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 3em;
    height: 0.4em;
    background-color: #f5f5f5;
    border: 2px solid #333;
    border-radius: 15px;
    font-size: 2em;
    font-weight: bold;
    color: red;
    cursor: pointer;
    transition: background-color 0.3s, color 0.3s;
  }

  .riichi-button.active {
    background-color: blue;
    color: white;
  }

  .player-info {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5em;
    text-align: center;
  }

  .player-name {
    width: 3em;
    height: 1.2em;
    text-align: center;
    font-size: 0.8em;
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 2px;
  }

  .score {
    font-size: 1.4em;
    font-weight: bold;
    color: #333;
  }

  .dice-button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1.5em;
    height: 1.5em;
    background-color: transparent;
    /* 移除背景色 */
    border: none;
    /* 移除边框 */
    font-size: 1.2em;
    /* 调整骰子图标大小 */
    cursor: pointer;
    color: #333;
    /* 骰子图标颜色 */
    transition: transform 0.2s;
  }

  .dice-button:hover {
    transform: scale(1.2);
    /* 鼠标悬停时放大效果 */
  }
}
</style>
