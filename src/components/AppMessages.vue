<script setup>
import { useUserStore } from '@/stores'
import { storeToRefs } from 'pinia'

const store = useUserStore()
const { messages } = storeToRefs(store)
const { removeMessage } = store
</script>

<template>
    <div class="toast-container position-fixed bottom-0 end-0 p-3" style="z-index: 1055;">
        <div v-for="msg in messages" :key="msg.id" class="toast show align-items-center text-white" :class="{
            'bg-success': msg.type === 'success',
            'bg-danger': msg.type === 'error',
            'bg-warning': msg.type === 'warning'
        }" role="alert">
            <div class="d-flex">
                <div class="toast-body">
                    {{ msg.text }}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto"
                    @click="removeMessage(msg.id)"></button>
            </div>
        </div>
    </div>
</template>