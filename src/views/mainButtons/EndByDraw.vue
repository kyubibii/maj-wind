<template>
  <div class="ryukyoku">
    <div class="panel">
      <!-- 第1个div：途中流局 -->
      <div class="input-block">
        <button class="toggle-button full-width-button" :class="{ active: abortiveDraw }" @click="toggleAbortiveDraw">
          途中流局
        </button>
      </div>

      <!-- 第2~5个div：玩家信息框 -->
      <div class="player-info-container">
        <div class="player-info" v-for="(player, index) in players" :key="index">
          <span class="player-name">{{ player.name }}</span>
          <button class="toggle-button" :class="{ active: tenpai[index] }" @click="toggleTenpai(index)">
            听牌
          </button>
          <button class="toggle-button" :class="{ active: nagashiMangan[index] }" @click="toggleNagashiMangan(index)"
            :disabled="abortiveDraw || nagashiMangan.filter(Boolean).length >= 2 && !nagashiMangan[index]">
            流局满贯
          </button>
        </div>
      </div>

      <!-- 第6个div：按钮 -->
      <div class="button-block">
        <button class="action-button" @click="goBack">返回</button>
        <button class="action-button" @click="handleEndByDraw">结算</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { usePlayStore } from '@/stores/playStore'
import { processEndByDraw } from '@/utils/endByDrawLogic' // 引入结算逻辑

const router = useRouter()
const playStore = usePlayStore()

// 途中流局绑定
const abortiveDraw = ref(false)

// 玩家信息绑定
const players = computed(() => playStore.players)
const playerRiichi = ref(players.value.map((player) => player.isRiichi))
const tenpai = ref(players.value.map((_, index) => playerRiichi.value[index])) // 根据立直状态初始化
const nagashiMangan = ref(players.value.map(() => false))

// 返回按钮逻辑
const goBack = () => {
  router.push('/maj-winds') // 返回主页面
}

// 结算按钮逻辑
const handleEndByDraw = () => {
  // 构造数据结构
  const data = {
    isAbortiveDraw: abortiveDraw.value,
    gameInfo: playStore.gameInfo,
    players: players.value.map((player, index) => ({
      id: index,
      name: player.name,
      score: player.score,
      tenpaiStatus: tenpai.value[index],
      nagashiManganStatus: nagashiMangan.value[index],
    })),
  }

  // 调用结算逻辑
  processEndByDraw(data)
  playStore.resetDice() // 重置骰子
  // 返回主页面
  router.push('/maj-winds')
}

// 切换途中流局状态
const toggleAbortiveDraw = () => {
  abortiveDraw.value = !abortiveDraw.value
}

// 切换听牌状态
const toggleTenpai = (index: number) => {
  tenpai.value[index] = !tenpai.value[index]
}

// 切换流局满贯状态
const toggleNagashiMangan = (index: number) => {
  nagashiMangan.value[index] = !nagashiMangan.value[index]
}
</script>

<style lang="less" scoped>
.ryukyoku {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgb(180, 207, 207);
  display: flex;
  justify-content: center;
  align-items: center;
}

.panel {
  width: 80%;
  height: 80%;
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

.input-block {
  width: 80%;
  /* 父级容器宽度保持不变 */
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px;
}

.full-width-button {
  width: 100%;
  /* 占满父级宽度 */
  height: 100%;
  /* 占满父级高度 */
  font-size: 2.8em;
  /* 增大字体 */
  font-weight: bold;

  color: #8e8e8e;
  background-color: #ffffff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  text-align: center;
  transition: background-color 0.3s;
}

.full-width-button.active {
  background-color: #52aeff;
  /* 激活状态颜色 */
  color: #ffffff;
}

.full-width-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.player-info-container {
  width: 80%;
  background-color: #f5f5f5;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 10px;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 15px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  /* 均匀分布的间距 */
}

.player-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1em;
  /* 均匀分布的间距 */
}

.player-name {
  flex: 1;
  text-align: left;
  font-size: 2.4em;
  font-weight: bold;
}

.button-block {
  width: 100%;
  display: flex;
  justify-content: space-between;
}

.action-button {
  width: 45%;
  padding: 10px;
  font-size: 14px;
  font-weight: bold;
  color: #fff;
  background-color: #007bff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  text-align: center;
  transition: background-color 0.3s;
}

.action-button:hover {
  background-color: #0056b3;
}

.toggle-button {
  padding: 5px 10px;
  font-weight: bold;
  color: #8f8f8f;
  background-color: #ffffff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  text-align: center;
  transition: background-color 0.3s;
  font-size: 1.4em;
}

.toggle-button.active {
  color: white;
  background-color: #0083f5;
}

.toggle-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style>
