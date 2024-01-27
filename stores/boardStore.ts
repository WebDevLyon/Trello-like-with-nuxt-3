import { v4 as uuidv4 } from "uuid"
import { defineStore } from "pinia"
import { useStorage } from "@vueuse/core"
import boardData from "~/data/board.json"

export const useBoardStore = defineStore("boardStore", () => {
	const board = useStorage("board", boardData)

	/*
  TASKS
  */
	const getTask = computed(() => {
		return (taskId) => {
			for (const column of board.value.columns) {
				const task = column.tasks.find((task) => task.id === taskId)
				if (task) return task
			}
		}
	})

	function addTask({ columnIndex, taskName }) {
		board.value.columns[columnIndex].tasks.push({
			id: uuidv4(),
			name: taskName,
			description: "",
		})
  }

  function deleteTask(taskId) {
    for (const column of board.value.columns) {
      const taskIndex = column.tasks.findIndex(task => task.id === taskId)

      if (taskIndex !== -1) {
        column.tasks.splice(taskIndex, 1)
        return
      }
    }
  }
  
  function moveTask({ fromTaskIndex, toTaskIndex, fromColumnIndex, toColumnIndex }) {
    const task = board.value.columns[fromColumnIndex].tasks.splice(
      fromTaskIndex,
      1
    )[0]

    board.value.columns[toColumnIndex].tasks.splice(toTaskIndex,0,task)
  }
	/*
  COLUMNS
  */
	function addColumn(columnName) {
		board.value.columns.push({
			name: columnName,
			tasks: [],
		})
	}

	function deleteColumn(columnIndex) {
		board.value.columns.splice(columnIndex, 1)
	}

	function moveColumn({fromColumnIndex, toColumnIndex}) {
		// Enregistrer la colonne dans une variable et supprimer la colonne
		const column = board.value.columns.splice(fromColumnIndex,1)[0]
		// Créer la nouvelle colonne depuis la variable avec splice
		board.value.columns.splice(toColumnIndex, 0, column)
	}

	return {
		/* State */
		board,
		/* Getters */
		getTask,
		/* Actions */
    addTask,
    deleteTask,
    moveTask,
		addColumn,
		deleteColumn,
		moveColumn
	}
})
