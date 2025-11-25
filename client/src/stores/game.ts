import { defineStore } from 'pinia'
import { ref } from 'vue'
import { io, Socket } from 'socket.io-client'

export interface Player {
    id: string
    name: string
    hasVoted: boolean
}

export type GameState = 'waiting' | 'voting' | 'revealed'

export const useGameStore = defineStore('game', () => {
    const playerName = ref('')
    const currentRoomId = ref('')
    const players = ref<Player[]>([])
    const gameState = ref<GameState>('waiting')
    const votes = ref<Record<string, number | string>>({})
    const socket = ref<Socket | null>(null)

    function connect() {
        if (!socket.value) {
            // Assuming backend is on localhost:3001
            socket.value = io(`http://${window.location.hostname}:3005`)

            socket.value.on('room_update', (room: any) => {
                players.value = room.players
                gameState.value = room.gameState
                votes.value = room.votes
            })
        }
    }

    function joinRoom(room: string, name: string) {
        playerName.value = name
        currentRoomId.value = room
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
            players.value = []
            gameState.value = 'waiting'
            votes.value = {}
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
        leaveRoom
    }
})
