<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useGameStore } from '../stores/game'
import PlayerList from '../components/PlayerList.vue'
import VotingControls from '../components/VotingControls.vue'

const route = useRoute()
const router = useRouter()
const gameStore = useGameStore()

const roomId = route.params.id as string

onMounted(() => {
  // If playerName is not set, try to restore from localStorage
  if (!gameStore.playerName) {
    const stored = gameStore.loadFromLocalStorage()
    
    // If we have stored data and the roomId matches the current URL, reconnect
    if (stored && stored.currentRoomId === roomId) {
      gameStore.joinRoom(roomId, stored.playerName)
    } else {
      // No valid session found, redirect to home
      router.push('/')
      return
    }
  }
})

const allPlayersVoted = computed(() => {
  return gameStore.players.length > 0 && gameStore.players.every(p => p.hasVoted)
})

const showStartButton = computed(() => gameStore.gameState === 'waiting')
const showVotingControls = computed(() => gameStore.gameState === 'voting')
const showRevealButton = computed(() => gameStore.gameState === 'voting' && gameStore.players.length > 0)
const showResetButton = computed(() => gameStore.gameState === 'revealed')

const copyLink = () => {
  navigator.clipboard.writeText(window.location.href)
  // Could add a toast notification here
}

const handleExit = () => {
  gameStore.leaveRoom()
  router.push('/')
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <!-- Header -->
    <header class="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
      <div class="flex items-center gap-4">
        <h1 class="text-lg font-semibold text-gray-900">Room: <span class="font-mono bg-gray-100 px-2 py-1 rounded">{{ roomId }}</span></h1>
        <button @click="copyLink" class="text-sm text-gray-500 hover:text-gray-900 transition-colors">
          Copy Link
        </button>
      </div>
      <div class="flex items-center gap-4">
        <div class="text-sm text-gray-600">
          <span class="text-gray-400">Playing as</span> <span class="font-medium text-gray-900">{{ gameStore.playerName }}</span>
        </div>
        <button 
          @click="handleExit"
          class="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors cursor-pointer"
        >
          Home
        </button>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-1 p-6 flex flex-col items-center gap-10 max-w-5xl mx-auto w-full mt-8">
      
      <!-- Status Message -->
      <div class="text-center">
        <h2 class="text-xl font-medium text-gray-500">
          <span v-if="gameStore.gameState === 'waiting'">Waiting for players...</span>
          <span v-else-if="gameStore.gameState === 'voting'" class="text-blue-600">Voting in progress</span>
          <span v-else class="text-gray-900">Results</span>
        </h2>
      </div>

      <!-- Player List / Table -->
      <PlayerList />

      <!-- Controls -->
      <div class="w-full max-w-3xl flex flex-col items-center gap-8 mt-auto mb-12">
        
        <!-- Waiting State Actions -->
        <button 
          v-if="showStartButton"
          @click="gameStore.startVoting()"
          class="bg-gray-900 hover:bg-black text-white text-base font-medium py-2.5 px-8 rounded-lg shadow-sm transition-all"
        >
          Start Voting
        </button>

        <!-- Voting State Actions -->
        <VotingControls v-if="showVotingControls" />
        
        <div v-if="showRevealButton" class="flex gap-4">
          <button 
            @click="gameStore.revealVotes()"
            :disabled="!allPlayersVoted"
            :class="[
              'font-medium py-2.5 px-8 rounded-lg shadow-sm transition-all',
              allPlayersVoted 
                ? 'bg-gray-900 hover:bg-black text-white cursor-pointer' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            ]"
          >
            Reveal Votes
          </button>
          <button 
            @click="gameStore.resetGame()"
            class="bg-white hover:bg-gray-50 text-gray-700 text-base font-medium py-2.5 px-8 rounded-lg border border-gray-300 transition-all cursor-pointer"
          >
            Reset Game
          </button>
        </div>

        <!-- Revealed State Actions -->
        <div v-if="showResetButton" class="flex gap-4">
          <button 
            @click="gameStore.resetGame()"
            class="bg-gray-900 hover:bg-black text-white text-base font-medium py-2.5 px-8 rounded-lg shadow-sm transition-all cursor-pointer"
          >
            Play Again
          </button>
          <button 
            @click="handleExit"
            class="bg-white hover:bg-gray-50 text-gray-700 text-base font-medium py-2.5 px-8 rounded-lg border border-gray-300 transition-all cursor-pointer"
          >
            Exit
          </button>
        </div>

      </div>
    </main>
  </div>
</template>
