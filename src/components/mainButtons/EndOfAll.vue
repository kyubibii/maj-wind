<template>
  <div class="ryukyoku">
    <div class="panel">
      <!-- 玩家排名信息 -->
      <div v-for="(player, index) in adjustedRankedPlayers" :key="index" class="player-row" :class="['rank-' + index]">
        <span class="player-rank">{{ ['一', '二', '三', '四'][index] }}</span>
        <span class="player-name">{{ player.name }}</span>
        <span class="player-score">{{ player.score }}</span>
        <span class="player-pt">{{ calculatePT(player.score, index) }}</span>
      </div>

      <!-- 操作按钮 -->
      <div class="button-block">
        <button class="action-button" @click="goBack">返回</button>
        <button class="action-button" @click="restartGame">再开</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed, ref } from 'vue'
import { usePlayStore } from '@/stores/playStore'

const playStore = usePlayStore()
const emit = defineEmits(['back', 'restart'])

// 计算玩家排名
const rankedPlayers = computed(() => {
  const players = playStore.players
  const starter = playStore.gameInfo.starter

  return players
    .map((player, index) => ({
      name: player.name,
      score: player.score,
      rankKey: player.score * 1000 - (index + 4 - starter) % 4
    }))
    .sort((a, b) => b.rankKey - a.rankKey)
    .map(({ name, score }) => ({ name, score }))
})

// 调整第一名玩家的分数
const adjustTopPlayerScore = (rankedPlayersList: Array<{ name: string, score: number }>) => {
  if (rankedPlayersList.length > 0) {
    rankedPlayersList[0].score += playStore.gameInfo.changgong
  }
  return rankedPlayersList
}

// 计算头名赏
const calculateTopBonus = (): number => {
  const rules = playStore.rules
  return rules.returnPoint * 4 - rules.originalPoint * 4
}

// 计算pt
const calculatePT = (score: number, index: number): string => {
  const rules = playStore.rules
  const topBonus = calculateTopBonus()
  const isFirstPlace = index === 0 // 只有第一名玩家获得头名赏
  const pt =
    (score -
      rules.returnPoint +
      rules.placementBonus[index] * 1000 +
      (isFirstPlace ? topBonus : 0)) /
    1000
  return pt.toFixed(2) // 精确到两位小数
}

// 调整后的玩家排名
const adjustedRankedPlayers = ref<Array<{ name: string; score: number }>>([])

// 在页面加载时计算排名
onMounted(() => {
  const rankedPlayersList = rankedPlayers.value
  adjustedRankedPlayers.value = adjustTopPlayerScore(rankedPlayersList)
})

// 返回主页面
const goBack = () => {
  emit('back')
}

// 再开游戏
const restartGame = () => {
  emit('restart')
}
</script>

<style lang="less" scoped>
/* 复用背景和面板样式 */
.ryukyoku {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  backdrop-filter: blur(8px);
  background: rgba(220, 241, 241, 0.1);
}

.panel {
  width: 80vw;
  max-height: 90vh;
  min-width: 320px;
  background-color: #dcf1f1;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  text-align: center;
  font-size: clamp(10px, 2.5vmin, 100px);
}

.player-row {
  display: flex;
  justify-content: space-between;
  /* 子元素水平分布 */
  align-items: center;
  /* 子元素垂直居中 */
  width: 90%;
  margin: 10px 0;
  font-size: 1.8em;
  padding: 10px;
  border-radius: 10px;
  color: #fff;
  font-weight: bold;
  text-align: center;
}

.player-rank {
  flex: 0 0 10%;
  /* 固定宽度为 10% */
  text-align: center;
  /* 内容居中 */
}

.player-name {
  flex: 0 0 40%;
  /* 固定宽度为 40% */
  text-align: left;
  /* 左对齐 */
}

.player-score {
  flex: 0 0 20%;
  /* 固定宽度为 20% */
  text-align: right;
  /* 右对齐 */
}

.player-pt {
  flex: 0 0 20%;
  /* 固定宽度为 20% */
  text-align: right;
  /* 右对齐 */
}

/* 金色金属质感 */
.rank-0 {
  background: linear-gradient(135deg, #ffdf27, #ffcc00);
  box-shadow: 0 4px 8px rgba(255, 215, 0, 0.5);
}

/* 银色金属质感 */
.rank-1 {
  background: linear-gradient(135deg, #c0c0c0, #eaeaea);
  box-shadow: 0 4px 8px rgba(192, 192, 192, 0.5);
}

/* 铜色金属质感 */
.rank-2 {
  background: linear-gradient(135deg, #df8b37, #b87333);
  box-shadow: 0 4px 8px rgba(205, 127, 50, 0.5);
}

/* 黑色金属质感 */
.rank-3 {
  background: linear-gradient(135deg, #a7a7a7, #2c2c2c);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
}

.button-block {
  width: 100%;
  display: flex;
  justify-content: space-between;
}

.action-button {
  width: 45%;
  padding: 10px;
  font-size: 16px;
  font-weight: bold;
  color: #fff;
  background-color: #409cff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  text-align: center;
  transition: background-color 0.3s;
}

.action-button:hover {
  background-color: #0056b3;
}
</style>
