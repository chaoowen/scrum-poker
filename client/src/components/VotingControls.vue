<script setup lang="ts">
import { ref } from 'vue'
import { useGameStore } from '../stores/game'

const gameStore = useGameStore()
const cards = [1, 2, 3, 5, 8, 13]
const selected = ref<number | string | null>(null)

const selectCard = (card: number | string) => {
  selected.value = card
}

const confirmVote = () => {
  if (selected.value !== null) {
    gameStore.submitVote(selected.value)
  }
}
</script>

<template>
  <div class="flex flex-col items-center gap-8">
    <div class="flex flex-wrap justify-center gap-4">
      <button
        v-for="card in cards"
        :key="card"
        @click="selectCard(card)"
        class="w-20 h-28 rounded-xl border flex items-center justify-center text-2xl font-medium transition-all duration-200"
        :class="selected === card 
          ? 'bg-gray-900 text-white border-gray-900 shadow-md -translate-y-1' 
          : 'bg-white text-gray-900 border-gray-200 hover:border-gray-400 hover:-translate-y-1'"
      >
        {{ card }}
      </button>
    </div>
    
    <button 
      @click="confirmVote"
      :disabled="selected === null"
      class="bg-gray-900 hover:bg-black disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-2.5 px-10 rounded-lg shadow-sm transition-all"
    >
      Confirm Vote
    </button>
  </div>
</template>
