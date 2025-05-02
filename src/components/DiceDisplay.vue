<template>
  <div class="dice-display">
    <!-- 显示第一个骰子 -->
    <span class="dice red">{{ diceEmojis[dice[0]] }}</span>
    <!-- 显示第二个骰子 -->
    <span class="dice blue">{{ diceEmojis[dice[1]] }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { usePlayStore } from '@/stores/playStore'

const playStore = usePlayStore()

// 绑定骰子数据
const dice = computed(() => playStore.gameInfo.dice)

// 骰子对应的 emoji 映射
const diceEmojis = ['🎲', '⚀', '⚁', '⚂', '⚃', '⚄', '⚅']
</script>

<style scoped>
.dice-display {
  display: flex;
  gap: 10px;
  justify-content: center;
  align-items: center;
}

.dice {
  font-size: 1em;
  font-weight: bold;
}

.dice.red {
  color: rgb(255, 51, 0);
}

.dice.blue {
  color: rgb(0, 98, 255);
}
</style>
