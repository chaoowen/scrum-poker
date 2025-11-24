<script setup lang="ts">
import { useGameStore } from '../stores/game'

const gameStore = useGameStore()
</script>

<template>
  <div class="w-full max-w-3xl">
    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      <div 
        v-for="player in gameStore.players" 
        :key="player.id"
        class="bg-white rounded-lg border p-4 flex flex-col items-center justify-center gap-3 transition-all duration-300"
        :class="[
          player.hasVoted && gameStore.gameState === 'voting' ? 'border-gray-400 shadow-sm' : 'border-gray-200',
          gameStore.gameState === 'revealed' && gameStore.votes[player.id] ? 'border-gray-900' : ''
        ]"
      >
        <!-- Avatar / Icon -->
        <div class="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-medium text-sm">
          {{ player.name.charAt(0).toUpperCase() }}
        </div>

        <!-- Name -->
        <div class="font-medium text-gray-900 text-center truncate w-full px-2">
          {{ player.name }}
        </div>

        <!-- Status / Vote -->
        <div class="h-8 flex items-center justify-center">
          <template v-if="gameStore.gameState === 'voting'">
            <div v-if="player.hasVoted" class="text-green-600 flex items-center gap-1 text-sm font-medium">
              <span class="w-2 h-2 rounded-full bg-green-500"></span>
              Voted
            </div>
            <div v-else class="text-gray-400 text-sm">Thinking...</div>
          </template>
          
          <template v-else-if="gameStore.gameState === 'revealed'">
            <div v-if="gameStore.votes[player.id]" class="text-2xl font-bold text-gray-900">
              {{ gameStore.votes[player.id] }}
            </div>
            <div v-else class="text-gray-400 text-sm">-</div>
          </template>
          
          <template v-else>
            <div class="text-gray-400 text-sm">Ready</div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
