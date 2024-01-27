<script setup>
import { useBoardStore } from '../stores/boardStore'

const boardStore = useBoardStore()
const newColumnName = ref('')
const router = useRouter()
const ifModalOpen = computed(() => {
  return route.name === 'index-tasks-id' })
const route = useRoute()

function addColumn() {
  boardStore.addColumn(newColumnName.value)
  newColumnName.value = ''
}

function closeModal() {
  router.push('/')
}
</script>

<template>
  <div class="board-wrapper">
    <main class="board">
      <BoardColumn
        v-for="(column, columnIndex) in boardStore.board.columns"
        :key="column.id"
        :column="column"
        :columnIndex="columnIndex"
      />
      <UContainer class="column">
        <UInput
          v-model="newColumnName"
          type="text"
          placeholder="Create new column"
          icon="i-heroicons-plus-circle-solid"
          @keyup.enter="addColumn"
        />
      </UContainer>
    </main>
    <div v-if="ifModalOpen" class="task-bg" @click.self="closeModal">
      <NuxtPage :key="route.fullPath"/>
    </div>
  </div>
</template>