<template>
  <div class="gameTable">
    <div class="player-scores-wrapper">
      <PlayerScores />
    </div>
    <div>
      <CenterPanel />
    </div>
  </div>
</template>

<script setup lang="ts">
import PlayerScores from '@/components/PlayerScores.vue'
import CenterPanel from '@/components/CenterPanel.vue'
</script>

<style lang="less" scoped>
.gameTable {
  position: relative;
  /* 确保子元素可以使用绝对定位 */
  width: 100vw;
  height: 100vh;
  background-color: rgb(180, 207, 207);
}

.player-scores-wrapper {
  position: absolute;
  /* 确保 PlayerScores 可以定位 */
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
