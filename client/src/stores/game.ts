import { defineStore } from 'pinia'
import { ref } from 'vue'
import { io, Socket } from 'socket.io-client'

export interface Player {
    id: string
    name: string
    hasVoted: boolean
}

export type GameState = 'waiting' | 'voting' | 'revealed'

const STORAGE_KEY = 'scrum-poker-session'

export const useGameStore = defineStore('game', () => {
    const playerName = ref('')
    const currentRoomId = ref('')
    const players = ref<Player[]>([])
    const gameState = ref<GameState>('waiting')
    const votes = ref<Record<string, number | string>>({})
    const socket = ref<Socket | null>(null)

    function connect() {
        if (!socket.value) {
            // Use environment variable for backend URL, fallback to localhost for development
            const backendUrl = import.meta.env.VITE_API_URL || `http://${window.location.hostname}:3005`
            socket.value = io(backendUrl)

            socket.value.on('room_update', (room: any) => {
                players.value = room.players
                gameState.value = room.gameState
                votes.value = room.votes
            })
        }
    }

    function saveToLocalStorage() {
        if (playerName.value && currentRoomId.value) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify({
                playerName: playerName.value,
                currentRoomId: currentRoomId.value
            }))
        }
    }

    function loadFromLocalStorage() {
        try {
            const stored = localStorage.getItem(STORAGE_KEY)
            if (stored) {
                const data = JSON.parse(stored)
                return {
                    playerName: data.playerName,
                    currentRoomId: data.currentRoomId
                }
            }
        } catch (e) {
            console.error('Failed to load from localStorage:', e)
        }
        return null
    }

    function clearLocalStorage() {
        localStorage.removeItem(STORAGE_KEY)
    }

    function joinRoom(room: string, name: string) {
        playerName.value = name
        currentRoomId.value = room
        saveToLocalStorage()
        connect()
        socket.value?.emit('join_room', { roomCode: room, name })
    }

    function startVoting() {
        socket.value?.emit('start_voting', currentRoomId.value)
    }

    function submitVote(value: number | string) {
        socket.value?.emit('vote', { roomCode: currentRoomId.value, value })
    }

    function revealVotes() {
        socket.value?.emit('reveal_votes', currentRoomId.value)
    }

    function resetGame() {
        socket.value?.emit('reset_game', currentRoomId.value)
    }

    function leaveRoom() {
        if (currentRoomId.value) {
            socket.value?.emit('leave_room', currentRoomId.value)
            socket.value?.disconnect()
            socket.value = null
            currentRoomId.value = ''
            playerName.value = ''
            players.value = []
            gameState.value = 'waiting'
            votes.value = {}
            clearLocalStorage()
        }
    }

    return {
        playerName,
        currentRoomId,
        players,
        gameState,
        votes,
        joinRoom,
        startVoting,
        submitVote,
        revealVotes,
        resetGame,
        leaveRoom,
        loadFromLocalStorage
    }
})
