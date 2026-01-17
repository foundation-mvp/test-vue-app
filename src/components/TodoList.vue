<template>
  <div class="todo-list">
    <div class="header">
      <h3>My Todos</h3>
      <button class="primary" @click="loadTodos" :disabled="loading">
        {{ loading ? 'Loading...' : 'Refresh' }}
      </button>
    </div>

    <!-- Add new todo -->
    <form class="add-form" @submit.prevent="addTodo">
      <input
        v-model="newTitle"
        placeholder="What needs to be done?"
        class="input"
        :disabled="adding"
      />
      <button type="submit" class="success" :disabled="!newTitle.trim() || adding">
        {{ adding ? 'Adding...' : 'Add' }}
      </button>
    </form>

    <!-- Todo items -->
    <div class="items">
      <div v-if="loading && !todos.length" class="empty">
        Loading todos...
      </div>

      <div v-else-if="!todos.length" class="empty">
        No todos yet. Add one above!
      </div>

      <div
        v-for="todo in todos"
        :key="todo.id"
        class="todo-item"
        :class="{ done: todo.done }"
      >
        <label class="checkbox-label">
          <input
            type="checkbox"
            :checked="todo.done"
            @change="toggleTodo(todo)"
          />
          <span class="title">{{ todo.title }}</span>
        </label>

        <button class="ghost delete-btn" @click="deleteTodo(todo)">×</button>
      </div>
    </div>

    <!-- Error display -->
    <div v-if="error" class="error">
      {{ error }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useFoundation } from 'foundation-sdk/vue'

const { stuff, ui, log } = useFoundation()

// Simple nanoid-like generator
function nanoid(size = 21) {
  const alphabet = 'useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict'
  let id = ''
  const bytes = crypto.getRandomValues(new Uint8Array(size))
  for (let i = 0; i < size; i++) {
    id += alphabet[bytes[i] & 63]
  }
  return id
}

const TODO_KEY = 'todos'

const todos = ref([])
const newTitle = ref('')
const loading = ref(false)
const adding = ref(false)
const error = ref(null)

async function loadTodos() {
  loading.value = true
  error.value = null

  try {
    const result = await stuff.list(TODO_KEY)
    // Handle both array and object formats (API may return { items: [] })
    const items = Array.isArray(result) ? result : (result?.items || [])
    todos.value = items.map(item => ({
      id: item.namespace,
      title: item.value?.title || '',
      done: item.value?.completed || false
    }))
  } catch (e) {
    error.value = `Failed to load todos: ${e.message}`
    log.error('Failed to load todos', { error: e.message })
  } finally {
    loading.value = false
  }
}

async function addTodo() {
  if (!newTitle.value.trim()) return

  adding.value = true
  error.value = null

  const namespace = nanoid()
  const todoValue = {
    title: newTitle.value.trim(),
    completed: false
  }

  try {
    await stuff.set(TODO_KEY, namespace, todoValue)
    todos.value.unshift({
      id: namespace,
      title: todoValue.title,
      done: todoValue.completed
    })
    newTitle.value = ''

    ui.toast('Todo added!', 'success')
    log.event('todo_created', { title: todoValue.title })
  } catch (e) {
    error.value = `Failed to add todo: ${e.message}`
    ui.toast('Failed to add todo', 'error')
  } finally {
    adding.value = false
  }
}

async function toggleTodo(todo) {
  const newDone = !todo.done
  todo.done = newDone // Optimistic update

  try {
    await stuff.set(TODO_KEY, todo.id, {
      title: todo.title,
      completed: newDone
    })

    log.event('todo_toggled', { id: todo.id, done: newDone })
  } catch (e) {
    todo.done = !newDone // Revert
    ui.toast('Failed to update todo', 'error')
  }
}

async function deleteTodo(todo) {
  const confirmed = await ui.confirm(`Delete "${todo.title}"?`)
  if (!confirmed?.confirmed) return

  const idx = todos.value.indexOf(todo)
  todos.value.splice(idx, 1) // Optimistic

  try {
    await stuff.delete(TODO_KEY, todo.id)
    ui.toast('Todo deleted', 'success')
    log.event('todo_deleted', { id: todo.id })
  } catch (e) {
    todos.value.splice(idx, 0, todo) // Revert
    ui.toast('Failed to delete todo', 'error')
  }
}

onMounted(() => {
  loadTodos()
})
</script>

<style scoped>
.todo-list {
  margin-top: 1rem;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.header h3 {
  font-size: 1rem;
  font-weight: 600;
}

.add-form {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.input {
  flex: 1;
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--border);
  border-radius: 6px;
  background: var(--bg);
  color: var(--text);
  font-size: 0.875rem;
}

.input:focus {
  outline: none;
  border-color: var(--primary);
}

.items {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.todo-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: var(--bg);
  border-radius: 6px;
  border: 1px solid var(--border);
}

.todo-item.done {
  opacity: 0.6;
}

.todo-item.done .title {
  text-decoration: line-through;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  flex: 1;
}

.checkbox-label input {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.title {
  font-size: 0.875rem;
}

.delete-btn {
  font-size: 1.25rem;
  padding: 0.25rem 0.5rem;
  color: var(--text-muted);
}

.delete-btn:hover {
  color: var(--danger);
}

.empty {
  text-align: center;
  padding: 2rem;
  color: var(--text-muted);
  font-size: 0.875rem;
}

.error {
  margin-top: 1rem;
  padding: 0.75rem;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 6px;
  color: #dc2626;
  font-size: 0.875rem;
}

.dark .error {
  background: #450a0a;
  border-color: #7f1d1d;
  color: #fca5a5;
}
</style>
