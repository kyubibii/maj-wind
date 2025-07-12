<template>
  <template v-if="menuPage === 0">
    <div class="center-panel-wrapper">
      <div class="CenterPanel">
        <div class="dice-display">
          <DiceDisplay />
        </div>
        <div class="game-stage">
          <!-- 绑定场风和局数 -->
          <div class="round-display">{{ round }}{{ ju }}局</div>
          <div class="more-display">
            <!-- 绑定本场数 -->
            <span>{{ benchang }}本场</span>
            <!-- 绑定场供数量 -->
            <span>场供：{{ changgong }}</span>
          </div>
        </div>
        <div class="main-button">
          <!-- 五个按钮 -->
          <button class="action-button" @click="clickMainButton(1)">和了</button>
          <button class="action-button" @click="clickMainButton(2)">流局</button>
          <button class="action-button" @click="clickMainButton(3)">终了</button>
          <button class="action-button" @click="clickMainButton(4)">再开</button>
          <button class="action-button" @click="clickMainButton(5)">修正</button>
        </div>
      </div>
    </div>
  </template>
  <CorrectionOfInfo class="button-page" v-if="menuPage === 5" @back="handleBack" />
  <EndByDraw class="button-page" v-if="menuPage === 2" @back="handleBack" />
  <EndOfAll class="button-page" v-if="menuPage === 3" @back="handleBack" @restart="handleRestart" />
  <NewGame class="button-page" v-if="menuPage === 4" @back="handleBack" />
  <RonnAndTsumo class="button-page" v-if="menuPage === 1" @back="handleBack" />
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { usePlayStore } from '@/stores/playStore'
import DiceDisplay from './DiceDisplay.vue'
import CorrectionOfInfo from './mainButtons/CorrectionOfInfo.vue'
import EndByDraw from './mainButtons/EndByDraw.vue'
import EndOfAll from './mainButtons/EndOfAll.vue'
import NewGame from './mainButtons/NewGame.vue'
import RonnAndTsumo from './mainButtons/RonnAndTsumo.vue'

const menuPage = ref(0)

const playStore = usePlayStore()

const round = computed(() => {
  const rounds = ['东', '南', '西', '北']
  return rounds[playStore.gameInfo.round]
})

const ju = computed(() => {
  const nums = ['一', '二', '三', '四']
  return nums[playStore.gameInfo.ju]
})

const benchang = computed(() => {
  const nums = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十']
  return nums[playStore.gameInfo.benchang]
})

const changgong = computed(() => playStore.gameInfo.changgong)

const clickMainButton = (index: number) => {
  menuPage.value = index
}
const handleRestart = () => {
  menuPage.value = 4
}
const handleBack = () => {
  menuPage.value = 0
}
</script>

<style lang="less" scoped>
.button-page {
  z-index: 10;
}

.center-panel-wrapper {
  width: 50vmin;
  height: 50vmin;
  position: absolute;
  /* 让 CenterPanel 上浮 */
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;
  /* 上浮一层 */
  overflow: hidden;
}

.CenterPanel {
  position: absolute;
  /* 使其可以相对于父容器定位 */
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  /* 完全居中 */
  width: calc(100%);
  /* 动态宽度 */
  height: calc(100%);
  /* 动态高度 */
  max-width: calc(100vh);
  /* 确保宽度不超过视口高度的 45% */
  max-height: calc(100vw);
  /* 确保高度不超过视口宽度的 45% */
  min-width: 100px;
  /* 最小宽度 */
  min-height: 100px;
  /* 最小高度 */
  background-color: #ede0e0;
  z-index: 10;
  /* 上浮一层 */
  display: flex;
  flex-direction: column;
  align-items: center;
  /* 垂直居中 */
  justify-content: center;
  /* 水平居中 */
  border-radius: 10px;
  /* 可选：增加圆角 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  /* 可选：增加阴影效果 */
}

.dice-display {
  position: absolute;
  top: 10%;
  left: 50%;
  transform: translateX(-50%);
  font-size: clamp(36px, 9vmin, 100px);
}

.game-stage {
  position: absolute;
  top: 50%;
  /* 垂直居中 */
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: clamp(12px, 3vmin, 100px);
  font-weight: bold;
  text-align: center;
  width: 80%;
}

.round-display {
  font-size: 3em;
  font-weight: bold;
  color: #333;
  text-align: center;
}

.more-display {
  display: flex;
  justify-content: space-between;
  /* 左右均匀分布 */
  width: 100%;
  /* 占满父容器宽度 */
  margin-top: 0px;
  /* 可选：增加与上方的间距 */
}

.more-display span {
  font-size: 1.5em;
  font-weight: bold;
  color: #555;
}

.main-button {
  position: absolute;
  bottom: 10%;
  display: flex;
  justify-content: space-between;
  width: 90%;
  font-size: clamp(10px, 2.5vmin, 100px);
}

.action-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 2em;
  height: 4.3em;
  font-size: 1em;
  font-weight: bold;
  color: #333;
  background-color: #deb887;
  /* 木纹底色 */
  border: 2px solid #8b4513;
  /* 深色边框 */
  border-radius: 0.5em;
  /* 圆角 */
  cursor: pointer;
  text-align: center;
  -webkit-writing-mode: vertical-rl;
  /* Safari 前缀 */
  writing-mode: vertical-rl;
  -webkit-text-orientation: upright;
  /* Safari 前缀 */
  font-family: "PingFang SC", "Microsoft YaHei", sans-serif;
  /* 确保字体支持 */
  text-orientation: upright;
  box-shadow: 0 0.2em 0.4em rgba(0, 0, 0, 0.5);
  transition: transform 0.2s, background-color 0.2s;
}

.action-button:hover {
  background-color: #d2a679;
  /* 鼠标悬停时的颜色 */
  transform: scale(1.1);
  /* 放大效果 */
}

.action-button:active {
  transform: scale(0.95);
  /* 点击时缩小效果 */
}
</style>
