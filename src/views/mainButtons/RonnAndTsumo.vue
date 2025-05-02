<template>
  <div class="main-bg">
    <div class="panel">
      <!-- Tabs 切换 -->
      <div class="tabs">
        <button class="tab-button" :class="{ active: activeTab === 'ronn' }" @click="switchTab('ronn')">
          荣
        </button>
        <button class="tab-button" :class="{ active: activeTab === 'tsumo' }" @click="switchTab('tsumo')">
          自摸
        </button>
      </div>
      <!-- 内容显示 -->
      <div class="tab-content">
        <div v-if="activeTab === 'ronn'">
          <div v-for="(player, index) in players" :key="index" class="player-row">
            <div class="player-info">
              <span class="players-name">
                <p>{{ player.name }}</p>
              </span>
              <button class="fold-button" :class="{ active: foldPlayer === index }" @click="setFoldPlayer(index)">
                铳
              </button>
              <button class="ronn-button" :class="{ active: activeRonnButtons.includes(index) }"
                :disabled="foldPlayer === index" @click="toggleRonnButton(index)">
                荣
              </button>
              <!-- 番选择 -->
              <select class="ronn-select" v-model="ronnSelectedFan[index]" @change="onRonnFanChange(index)"
                :disabled="!activeRonnButtons.includes(index)">
                <option v-for="(label, value) in tsumoFanOptions" :key="value" :value="value">
                  {{ label }}
                </option>
              </select>
              <!-- 符选择 -->
              <select class="ronn-select" v-model="ronnSelectedFu[index]" @change="onRonnFuChange(index)"
                :disabled="!activeRonnButtons.includes(index) || ronnSelectedFan[index] > 3">
                <option v-for="(label, value) in ronnFilteredFuOptions[index]" :key="value" :value="value">
                  {{ label }}
                </option>
              </select>
              <div class="ronn-reward-display">
                <div class="reward-item" :style="{
                  color: listRonnRewards[index] > 0 ? 'yellowgreen' : listRonnRewards[index] < 0 ? 'red' : 'gray',
                  opacity: listRonnRewards[index] === 0 ? 0.5 : 1,
                }">
                  {{ listRonnRewards[index] > 0 ? `+${listRonnRewards[index]}` : listRonnRewards[index] }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-if="activeTab === 'tsumo'">
          <div class="player-select">
            <label for="winner-select">自摸：</label>
            <select id="winner-select" v-model="tsumoSelectedPlayer" @change="onTmChange">
              <option v-for="(name, value) in tsumoWinnerOptions" :key="value" :value="value">
                {{ name }}
              </option>
            </select>
          </div>
          <div>
            <select id="winner-select" v-model="tsumoSelectedFan" @change="ontsumoFanChange">
              <option v-for="(label, value) in tsumoFanOptions" :key="value" :value="value">
                {{ label }}
              </option>
            </select>
            <select id="winner-select" v-if="tsumoShowFuSelect" v-model="tsumoSelectedFu" @change="onTmChange">
              <option v-for="(label, value) in tsumoFilteredFuOptions" :key="value" :value="value">
                {{ label }}
              </option>
            </select>
          </div>
          <div class="tsumo-reward-display">{{ tsumoPrintReward }}</div>
        </div>
      </div>
      <div class="button-block">
        <button class="action-button" @click="goBack">返回</button>
        <button class="action-button" @click="handleRAT">结算</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { usePlayStore } from '@/stores/playStore'
import { progressTsumo, tsumoRewardString } from '@/utils/tsumoLogic'
import { proceedToNextRound } from '@/utils/nextRoundLogic'
import { ronnPoint } from '@/utils/ronnLogic'

const router = useRouter()
const playStore = usePlayStore() // 引入游戏状态管理
const players = computed(() => playStore.players) // 获取玩家列表

const tsumoWinnerOptions = {
  0: players.value[0]?.name,
  1: players.value[1]?.name,
  2: players.value[2]?.name,
  3: players.value[3]?.name,
}
const tsumoSelectedPlayer = ref(0) // 默认选择第一个玩家

// 当前激活的 tab
const activeTab = ref('ronn')

// 切换 tab
const switchTab = (tab: string) => {
  activeTab.value = tab
}
// 番数选项
const tsumoFanOptions = {
  0: '一番',
  1: '二番',
  2: '三番',
  3: '四番',
  4: '满贯',
  5: '跳满',
  6: '倍满',
  7: '三倍满',
  8: '役满',
}
// 符选项
const fuOptions = {
  0: '20符',
  1: '25符',
  2: '30符',
  3: '40符',
  4: '50符',
  5: '60符',
  6: '70符',
  7: '80符',
  8: '90符',
  9: '100符',
  10: '110符',
}
//荣！
const foldPlayer = ref<number>(0) // 当前激活的放铳按钮的玩家索引

const setFoldPlayer = (index: number) => {
  foldPlayer.value = index
  if (activeRonnButtons.value.includes(index)) {
    activeRonnButtons.value = activeRonnButtons.value.filter((i) => i !== index)
  }
  if (activeRonnButtons.value.length === 0) {
    activeRonnButtons.value = [(index + 1) % 4]
  }
  ronnReward()
}

const activeRonnButtons = ref<number[]>([1]) // 当前激活的荣按钮的玩家索引数组

const toggleRonnButton = (index: number) => {
  if (activeRonnButtons.value.includes(index)) {
    activeRonnButtons.value = activeRonnButtons.value.filter((i) => i !== index)
  } else {
    activeRonnButtons.value.push(index)
  }
  ronnReward()
}

// 荣！每个玩家的番数和符数
const ronnSelectedFan = ref<number[]>([0, 0, 0, 0]); // 每个玩家的番数，默认“一番”
const ronnSelectedFu = ref<number[]>([2, 2, 2, 2]); // 每个玩家的符数，默认“30符”

// 符选项过滤
const ronnFilteredFuOptions = ref<{ [key: number]: typeof fuOptions }>({
  0: {
    0: '20符',
    1: '25符',
    2: '30符',
    3: '40符',
    4: '50符',
    5: '60符',
    6: '70符',
    7: '80符',
    8: '90符',
    9: '100符',
    10: '110符',
  },
  1: {
    0: '20符',
    1: '25符',
    2: '30符',
    3: '40符',
    4: '50符',
    5: '60符',
    6: '70符',
    7: '80符',
    8: '90符',
    9: '100符',
    10: '110符',
  },
  2: {
    0: '20符',
    1: '25符',
    2: '30符',
    3: '40符',
    4: '50符',
    5: '60符',
    6: '70符',
    7: '80符',
    8: '90符',
    9: '100符',
    10: '110符',
  },
  3: {
    0: '20符',
    1: '25符',
    2: '30符',
    3: '40符',
    4: '50符',
    5: '60符',
    6: '70符',
    7: '80符',
    8: '90符',
    9: '100符',
    10: '110符',
  },
});

const onRonnFanChange = (index: number) => {
  console.log(`Player ${index} Selected Fan:`, ronnSelectedFan.value[index]);
  const ronnFan = parseInt(ronnSelectedFan.value[index].toString());
  ronnSelectedFu.value[index] = 2; // 恢复符数为默认值“30符”
  if (ronnFan > 3) {
    ronnFilteredFuOptions.value[index] = {} as typeof fuOptions;
  } else if (ronnFan === 3) {
    ronnFilteredFuOptions.value[index] = {
      1: '25符',
      2: '30符',
    } as typeof fuOptions;
  } else if (ronnFan === 2) {
    ronnFilteredFuOptions.value[index] = {
      1: '25符',
      2: '30符',
      3: '40符',
      4: '50符',
      5: '60符',
    } as typeof fuOptions;
  } else if (ronnFan === 1) {
    ronnFilteredFuOptions.value[index] = {
      1: '25符',
      2: '30符',
      3: '40符',
      4: '50符',
      5: '60符',
      6: '70符',
      7: '80符',
      8: '90符',
      9: '100符',
      10: '110符',
    } as typeof fuOptions;
  } else {
    ronnFilteredFuOptions.value[index] = {
      2: '30符',
      3: '40符',
      4: '50符',
      5: '60符',
      6: '70符',
      7: '80符',
      8: '90符',
      9: '100符',
      10: '110符',
    } as typeof fuOptions;
  }
  ronnReward() // 更新奖励信息
};

const onRonnFuChange = (index: number) => {
  console.log(`Player ${index} Selected Fu:`, ronnSelectedFu.value[index]);
  // 可以在这里添加与符选择相关的逻辑
  ronnReward() // 更新奖励信息
}
const listRonnRewards = ref<number[]>([0, 0, 0, 0])
// 结算奖励的逻辑
const ronnReward = () => {
  // 初始化一个空的奖励数组
  const listRonn = [0, 0, 0, 0]
  const dealer = (playStore.gameInfo.ju + playStore.gameInfo.starter) % 4
  const folder = foldPlayer.value
  const ronners = activeRonnButtons.value
  for (const i of ronners) {
    const ronnFan = parseInt(ronnSelectedFan.value[i].toString())
    const ronnFu = parseInt(ronnSelectedFu.value[i].toString())
    const isDealer = i === dealer
    const p = ronnPoint(isDealer, ronnFan, ronnFu)
    listRonn[i] = p
    listRonn[folder] -= p
  }
  listRonn[folder] -= playStore.gameInfo.benchang * 300
  const closestRonn = () => {
    for (let i = 1; i < 4; i++) {
      if (ronners.includes((folder + i) % 4)) {
        return (folder + i) % 4
      }
    }
  }
  const closest = closestRonn()
  if (closest !== undefined) {
    listRonn[closest] += playStore.gameInfo.changgong + playStore.gameInfo.benchang * 300
  }
  listRonnRewards.value = listRonn
}

// -----------------------------------------------------------------------------------------------------------------------
//自摸！
// 默认选择的番数
const tsumoSelectedFan = ref(0) // 默认选择“一番”
// 默认选择的符
const tsumoSelectedFu = ref(2) // 默认选择“30符”

const tsumoFilteredFuOptions = ref({ ...fuOptions }) // 初始化为所有符选项
const tsumoPrintReward = ref('reward!') // 初始化奖励信息

const ontsumoFanChange = () => {
  const tsumoFan = parseInt(tsumoSelectedFan.value.toString())
  if (tsumoFan > 3) {
    tsumoFilteredFuOptions.value = {} as typeof fuOptions
  } else if (tsumoFan === 3) {
    tsumoFilteredFuOptions.value = {
      0: '20符',
      1: '25符',
      2: '30符',
    } as typeof fuOptions
  } else if (tsumoFan === 2) {
    tsumoFilteredFuOptions.value = {
      0: '20符',
      1: '25符',
      2: '30符',
      3: '40符',
      4: '50符',
      5: '60符',
    } as typeof fuOptions
  } else if (tsumoFan === 1) {
    tsumoFilteredFuOptions.value = {
      0: '20符',
      2: '30符',
      3: '40符',
      4: '50符',
      5: '60符',
      6: '70符',
      7: '80符',
      8: '90符',
      9: '100符',
      10: '110符',
    } as typeof fuOptions
  } else {
    tsumoFilteredFuOptions.value = {
      2: '30符',
      3: '40符',
      4: '50符',
      5: '60符',
      6: '70符',
      7: '80符',
      8: '90符',
      9: '100符',
    } as typeof fuOptions
  }
  updateReward() // 更新奖励信息
}

// 处理玩家或符修改的逻辑
const onTmChange = () => {
  console.log('Players:', players.value[0]?.name, players.value[1]?.name, players.value[2]?.name, players.value[3]?.name)
  console.log('Selected Player:', tsumoSelectedPlayer.value)
  updateReward() // 更新奖励信息
}

// 是否显示符下拉选择框
const tsumoShowFuSelect = computed(() => {
  return tsumoSelectedFan.value <= 3 // 番数大于 3 时隐藏符选择框
})

// 结算奖励的逻辑
const tsumoReward = () => {
  const tsumoFan = parseInt(tsumoSelectedFan.value.toString())
  const tsumoFu = parseInt(tsumoSelectedFu.value.toString())
  const tsumoWinner = parseInt(tsumoSelectedPlayer.value.toString())
  const dealer = (playStore.gameInfo.ju + playStore.gameInfo.starter) % 4
  return tsumoRewardString(tsumoWinner, dealer, playStore.gameInfo.benchang, tsumoFan, tsumoFu)
}

// 更新自摸奖励信息
const updateReward = () => {
  tsumoPrintReward.value = tsumoReward()
}

// 在组件加载时初始化符选项
onMounted(() => {
  if (!players.value || players.value.length === 0) {
    playStore.loadState() // 从 localStorage 或 API 加载状态
  }
  ontsumoFanChange() // 初始化符选项为一番对应的选项
  onRonnFanChange(0)
  ronnReward() // 初始化奖励信息
})

const goBack = () => {
  router.push('/maj-winds') // 返回主页面
}
const handleRAT = () => {
  console.log('处理 Ronn 和 Tsumo')
  if (activeTab.value === 'tsumo') {
    const tsumoFan = parseInt(tsumoSelectedFan.value.toString())
    const tsumoFu = parseInt(tsumoSelectedFu.value.toString())
    const tsumoWinner = parseInt(tsumoSelectedPlayer.value.toString())
    const dealer = (playStore.gameInfo.ju + playStore.gameInfo.starter) % 4
    let listTsumo = progressTsumo(tsumoWinner, dealer, tsumoFan, tsumoFu)
    listTsumo = listTsumo.map((item) => item - 100 * playStore.gameInfo.benchang)
    listTsumo[tsumoWinner] += playStore.gameInfo.changgong + playStore.gameInfo.benchang * 400

    playStore.updateChanggong(0)
    playStore.updateAllPlayerScores(listTsumo)
    playStore.resetRiichi()
    playStore.resetDice()
    if (tsumoWinner === dealer) {
      playStore.updateBenchang(playStore.gameInfo.benchang + 1)
    } else {
      const nextState = proceedToNextRound(playStore.gameInfo.round, playStore.gameInfo.ju)
      playStore.updateRound(nextState.round)
      playStore.updateJu(nextState.ju)
      playStore.updateBenchang(0)
    }
  } else {
    const listRonn = listRonnRewards.value
    playStore.gameInfo.changgong = 0
    playStore.updateAllPlayerScores(listRonn)
    playStore.resetRiichi()
    playStore.resetDice()
    const dealer = (playStore.gameInfo.ju + playStore.gameInfo.starter) % 4
    if (activeRonnButtons.value.includes(dealer)) {
      playStore.updateBenchang(playStore.gameInfo.benchang + 1)
    } else {
      const nextState = proceedToNextRound(playStore.gameInfo.round, playStore.gameInfo.ju)
      playStore.updateRound(nextState.round)
      playStore.updateJu(nextState.ju)
      playStore.updateBenchang(0)
    }
  }
  router.push('/maj-winds') // 返回主页面
}
</script>

<style lang="less" scoped>
.main-bg {
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

.tabs {
  width: 80%;
  display: flex;
  justify-content: center;
  margin-bottom: 2em;
}

.tab-button {
  width: 45%;
  /* 与 action-button 的宽度一致 */
  padding: 10px;
  /* 与 action-button 的内边距一致 */
  font-size: 18px;
  /* 与 action-button 的字体大小一致 */
  font-weight: bold;
  color: #007bff;
  background-color: transparent;
  border: 2px solid #007bff;
  border-radius: 5px;
  cursor: pointer;
  margin: 0 10px;
  text-align: center;
  transition: all 0.3s;
}

.tab-button.active {
  background-color: #007bff;
  color: #fff;
}

.tab-button:hover {
  background-color: #0056b3;
  color: #fff;
}

.tab-content {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  // font-size: 18px;
  color: #333;
}

.player-info {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.players-name {
  flex: 1;
  text-align: left;
  font-size: 1.8em;
  width: 6em;
  color: #576d97;
  font-weight: bold;
}

.fold-button,
.ronn-button {
  width: 2em;
  height: 2em;
  border: 2px solid gray;
  border-radius: 5px;
  background-color: transparent;
  color: gray;
  font-size: 1.4em;
  font-weight: bold;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s;
  text-align: center;
}

.fold-button.active {
  background-color: red;
  color: white;
  border-color: red;
}

.ronn-button.active {
  background-color: greenyellow;
  color: white;
  border-color: greenyellow;
}

.ronn-select {
  width: 4.5em;
  height: 2em;
  border: 2px solid #007bff;
  border-radius: 5px;
  background-color: #fff;
  color: #333;
  font-size: 1.4em;
  cursor: pointer;
  transition: border-color 0.3s;
}

.ronn-reward-display {
  font-size: 1.8em;
  /* 增大字体以突出显示 */
  font-weight: bold;
  color: #f83737;
  /* 红色文字 */
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  /* 添加文字阴影效果 */
  text-align: right;
  /* 右对齐 */
  flex: 1;
  /* 占据剩余空间 */
  margin: 0;
  /* 移除 margin-top */
  padding: 0;
  /* 移除 padding */
  width: 0.8em;
  /* 自动调整宽度 */
  display: flex;
  /* 确保内容在 flex 布局中对齐 */
  align-items: center;
  /* 垂直居中对齐 */
}

.player-select {
  margin: 20px 0;
  font-size: 1em;
  display: flex;
  align-items: center;
  justify-content: center;
  /* 添加居中对齐 */
  gap: 10px;
}

.player-select label {
  font-size: 3em;
  font-weight: bold;
  color: #576d97;
  margin-right: 0px;
}

#winner-select {
  padding: 5px 10px;
  font-size: 2.4em;
  border: 2px solid #007bff;
  border-radius: 5px;
  background-color: #fff;
  color: #333;
  cursor: pointer;
  transition: border-color 0.3s;
}

#winner-select:hover {
  border-color: #0056b3;
}

.tsumo-reward-display {
  font-size: 5em;
  /* 增大字体以突出显示 */
  font-weight: bold;
  color: #f83737;
  /* 红色文字 */
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  /* 添加文字阴影效果 */
  text-align: center;
  /* 居中对齐 */
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
</style>
