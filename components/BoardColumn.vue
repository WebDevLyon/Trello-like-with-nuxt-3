<script setup>
import { useBoardStore } from '../stores/boardStore'

const props = defineProps({
  column: {
    type: Object,
    required: true
  },
  columnIndex: {
    type: Number,
    required: true
  }
})

const boardStore = useBoardStore()
const newTaskName = ref('')
const editNameState = ref(false)
const router = useRouter()

function deleteColumn(columnIndex) {
  boardStore.deleteColumn(columnIndex)
}

function goToTask(taskId) {
  router.push(`/tasks/${taskId}`)
}

function addTask() {
  boardStore.addTask({
    taskName: newTaskName.value,
    columnIndex: props.columnIndex
  })
  newTaskName.value = ''
}

function dropItem(event, { toColumnIndex, toTaskIndex }) {
  const type = event.dataTransfer.getData('type')
  const fromColumnIndex = event.dataTransfer.getData('from-column-index')

  if (type === 'task') {
    const fromTaskIndex = event.dataTransfer.getData('from-task-index')

    boardStore.moveTask({
      fromTaskIndex,
      toTaskIndex,
      fromColumnIndex,
      toColumnIndex
    })
  } else if (type === 'column') {
    boardStore.moveColumn({
      fromColumnIndex,
      toColumnIndex
    })
  }
}

function pickupTask(event, { fromColumnIndex, fromTaskIndex }) {
  event.dataTransfer.dropEffect = "move";
  event.dataTransfer.effectAllowed = "move"
  event.dataTransfer.setData('from-column-index', fromColumnIndex)
  event.dataTransfer.setData('from-task-index', fromTaskIndex)
  event.dataTransfer.setData('type', 'task')
}

function pickupColumnst(event, fromColumnIndex) {
  event.dataTransfer.effectAllowed = 'move'
  event.dataTransfer.dropEffect = 'move'
  event.dataTransfer.setData('type', 'column')
  event.dataTransfer.setData('from-column-index', fromColumnIndex)
}
</script>

<template>
  <UContainer class="column" @dragenter.prevent @dragover.prevent @drop.stop="dropItem($event, {toColumnIndex:columnIndex})"
    draggable="true" @dragstart.self="pickupColumnst($event, columnIndex)">
    <div class="column-header mb-4">
      <div>
        <UInput v-if="editNameState" type="text" v-model="column.name" />
        <h2 v-else>{{ column.name }}</h2>
      </div>
      <div>
        <UButton icon="i-heroicons-pencil-square" class="mr-2" @click="editNameState = !editNameState" />
        <UButton icon="i-heroicons-trash" color="red" @click="deleteColumn(columnIndex)" />
      </div>
    </div>
    <ul>
      <li v-for="(task, taskIndex) in column.tasks" :key="task.id">
        <UCard draggable='true' class="mb-4"
          @dragstart="pickupTask($event, { fromTaskIndex: taskIndex, fromColumnIndex: columnIndex })"
          @click="goToTask(task.id)" @drop.stop="dropItem($event, {toColumnIndex:columnIndex, toTaskIndex: taskIndex})">
          <strong>{{ task.name }}</strong>
          <p>{{ task.description }}</p>
        </UCard>
      </li>
    </ul>
    <UInput v-model="newTaskName" type="text" placeholder="Create new task" icon="i-heroicons-plus-circle-solid"
      @keyup.enter="addTask" />
  </UContainer>
</template>