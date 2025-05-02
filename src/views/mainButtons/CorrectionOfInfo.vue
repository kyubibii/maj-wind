<template>
  <div class="correction">
    <div class="panel">
      <!-- 第1个div：局数和本场 -->
      <div class="input-block">
        <select id="round" v-model="round">
          <option v-for="(r, index) in rounds" :key="index" :value="index">
            {{ r }}
          </option>
        </select>
        <select id="ju" v-model="ju">
          <option v-for="(j, index) in jus" :key="index" :value="index">
            {{ j }}
          </option>
        </select>
        <label for="ju">局</label>

        <select id="benchang" v-model="benchang">
          <option v-for="(n, index) in benchangOptions" :key="index" :value="index">
            {{ n }}
          </option>
        </select>
        <label for="benchang">本场</label>
      </div>

      <!-- 新增的div：起家和场供 -->
      <div class="input-block">
        <label for="starterIndex">东起：</label>
        <select id="starterIndex" v-model="starterIndex">
          <option v-for="(player, index) in players" :key="index" :value="index">
            {{ player.name }}
          </option>
        </select>
        <label for="changgong">场供：</label>
        <input id="changgong" type="number" v-model.number="changgong" />
      </div>

      <!-- 第2到5个div：玩家信息 -->
      <div class="player-info" v-for="(player, index) in players" :key="index">
        <span class="player-name">{{ player.name }}</span>
        <input class="player-score" type="number" v-model.number="playerScores[index]" />
        <button class="riichi-button" :class="{ active: playerRiichi[index] }" @click="toggleRiichi(index)">
          ·
        </button>
      </div>

      <!-- 第6个div：按钮 -->
      <div class="button-block">
        <button class="action-button" @click="goBack">返回</button>
        <button class="action-button" @click="saveAndGoBack">保存</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { usePlayStore } from '@/stores/playStore'

const router = useRouter()
const playStore = usePlayStore()

// 场风、局数、本场绑定
const round = ref(playStore.gameInfo.round)
const ju = ref(playStore.gameInfo.ju)
const benchang = ref(playStore.gameInfo.benchang)
const starterIndex = ref(playStore.gameInfo.starter) // 起家绑定
const changgong = ref(playStore.gameInfo.changgong) // 场供绑定

// 本场选项（汉字表示）
const benchangOptions = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十']

// 玩家信息绑定
const players = computed(() => playStore.players)
const playerScores = ref(players.value.map((player) => player.score))
const playerRiichi = ref(players.value.map((player) => player.isRiichi))

// 场风和局数选项
const rounds = ['东', '南', '西', '北']
const jus = ['一', '二', '三', '四']

// 切换立直状态
const toggleRiichi = (index: number) => {
  playerRiichi.value[index] = !playerRiichi.value[index]
}

// 返回按钮逻辑
const goBack = () => {
  router.push('/maj-winds') // 返回主页面
}

// 保存按钮逻辑
const saveAndGoBack = () => {
  // 保存局数、本场、起家和场供
  playStore.updateRound(round.value)
  playStore.updateJu(ju.value)
  playStore.updateBenchang(benchang.value)
  playStore.updateStarter(starterIndex.value)
  playStore.updateChanggong(changgong.value)

  // 保存玩家信息
  playerScores.value.forEach((score, index) => {
    playStore.updatePlayerScore(index, score)
  })
  playerRiichi.value.forEach((isRiichi, index) => {
    playStore.players[index].isRiichi = isRiichi // 直接更新 isRiichi 值
  })

  alert('信息已保存！')
  router.push('/maj-winds') // 返回主页面
}
</script>

<style lang="less" scoped>
.correction {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgb(180, 207, 207);
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: clamp(10px, 2.5vmin, 100px);
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
}

.input-block {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.input-block label {
  font-size: 1.6em;
  font-weight: bold;
  margin-right: 10px;
}

.input-block select,
.input-block input {
  width: 6em;
  padding: 8px;
  font-size: 1.4em;
  border: 1px solid #ccc;
  border-radius: 5px;
  text-align: center;
}

.input-block select#benchang {
  width: 4em;
}

.player-info {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.player-name {
  flex: 1;
  text-align: left;
  font-size: 1.6em;
  font-weight: bold;
}

.player-score {
  width: 8em;
  padding: 0.8em;
  font-size: 1em;
  border: 1px solid #ccc;
  border-radius: 5px;
  text-align: center;
}

.riichi-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 4em;
  height: 0.5em;
  background-color: #f5f5f5;
  border: 2px solid #333;
  border-radius: 1.5em;
  font-size: 4em;
  font-weight: bold;
  color: red;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;
}

.riichi-button.active {
  background-color: blue;
  color: white;
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
</style>
