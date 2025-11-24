<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useGameStore } from '../stores/game'

const router = useRouter()
const gameStore = useGameStore()

const name = ref('')
const roomId = ref('')

const joinRoom = () => {
  if (name.value && roomId.value) {
    gameStore.joinRoom(roomId.value, name.value)
    router.push(`/game/${roomId.value}`)
  }
}

const createRoom = () => {
  if (name.value) {
    const newRoomId = Math.random().toString(36).substring(2, 8).toUpperCase()
    gameStore.joinRoom(newRoomId, name.value)
    router.push(`/game/${newRoomId}`)
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center p-4">
    <div class="w-full max-w-md bg-white rounded-xl border border-gray-200 p-8">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Scrum Poker</h1>
        <p class="text-gray-500">Simple, minimalist estimation tool.</p>
      </div>

      <div class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
          <input 
            v-model="name"
            type="text"
            placeholder="Enter your name"
            class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-gray-900 focus:ring-0 bg-gray-50"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Room ID</label>
          <input 
            v-model="roomId"
            type="text"
            placeholder="Enter room ID (optional)"
            class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-gray-900 focus:ring-0 bg-gray-50"
          />
        </div>

        <div class="flex flex-col gap-3 pt-2">
          <button 
            @click="joinRoom"
            :disabled="!name || !roomId"
            class="w-full bg-gray-900 hover:bg-black text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Join Room
          </button>
          
          <div class="relative flex items-center py-2">
            <div class="flex-grow border-t border-gray-200"></div>
            <span class="flex-shrink-0 mx-4 text-gray-400 text-sm">or</span>
            <div class="flex-grow border-t border-gray-200"></div>
          </div>

          <button 
            @click="createRoom"
            :disabled="!name"
            class="w-full bg-white hover:bg-gray-50 text-gray-900 font-semibold py-3 px-6 rounded-lg border border-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Create New Room
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
