<template>
  <div class="new-game">
    <div class="panel">
      <div class="input-block">
        <label for="originalPoint">原点：</label>
        <input id="originalPoint" type="number" v-model="originalPoint" placeholder="输入原点分数" />
      </div>
      <div class="input-block">
        <label for="starter">起家：</label>
        <select id="starter" v-model="starter">
          <option v-for="(player, index) in players" :key="index" :value="index">
            {{ player.name }}
          </option>
        </select>
      </div>
      <div class="input-block">
        <label for="returnPoint">返点：</label>
        <input id="returnPoint" type="number" v-model="returnPoint" placeholder="输入返点分数" />
      </div>
      <div class="input-block">
        <label>顺位马：</label>
        <div class="placement-bonus">
          <input type="number" v-model.number="placementBonus[0]" placeholder="第一名" />
          <input type="number" v-model.number="placementBonus[1]" placeholder="第二名" />
          <input type="number" v-model.number="placementBonus[2]" placeholder="第三名" />
          <input type="number" v-model.number="placementBonus[3]" placeholder="第四名" />
        </div>
      </div>
      <!-- 按钮块 -->
      <div class="button-block">
        <button class="action-button" @click="goBack">返回</button>
        <button class="action-button" @click="startGame">开始</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { usePlayStore } from '@/stores/playStore'

const emit = defineEmits(['back'])
const playStore = usePlayStore()

// 输入绑定
const originalPoint = ref(playStore.rules.originalPoint)
const starter = ref(playStore.gameInfo.starter) // 起家绑定到玩家索引
const returnPoint = ref(playStore.rules.returnPoint)
const placementBonus = ref([...playStore.rules.placementBonus]) // 顺位马数组

// 动态获取玩家列表
const players = computed(() => playStore.players)

// 返回按钮逻辑
const goBack = () => {
  emit('back')
}

// 开始按钮逻辑
const startGame = () => {
  // 重置游戏
  playStore.resetGame(originalPoint.value, starter.value, returnPoint.value, placementBonus.value)

  alert('いざ勝負！諸君の武運長久を祈る！') // 提示语
  goBack()
}
</script>

<style lang="less" scoped>
.new-game {
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
  max-width: 90vw;
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

.input-block {
  width: 100%;
  display: flex;
  align-items: center;
  /* 垂直居中对齐 */
  margin-bottom: 10px;
}

.input-block label {
  font-size: 1.6em;
  font-weight: bold;
  margin-right: 10px;
  /* 与输入框之间的间距 */
  white-space: nowrap;
  /* 防止换行 */
}

.input-block input,
.input-block select {
  flex: 1;
  /* 输入框或下拉框占据剩余空间 */
  padding: 8px;
  font-size: 1.4em;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-sizing: border-box;
}

.placement-bonus {
  display: flex;
  gap: 10px;
  /* 设置输入框之间的间距 */
  width: 100%;
}

.placement-bonus input {
  width: 1.5em;
  /* 设置更小的固定宽度 */
  padding: 8px;
  font-size: 1.4em;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-sizing: border-box;
  text-align: center;
  /* 让输入内容居中 */
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
