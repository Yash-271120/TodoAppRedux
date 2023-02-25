import { createSelector } from 'reselect'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { StatusFilters } from '../filters/filtersSlice'
import { client } from '../../api/client'

const initialState = []

const nextTodoId = (todos) => {
  let maxId = 0
  for (let i = 0; i < todos.length; i++) {
    if (todos[i].id > maxId) {
      maxId = todos[i].id
    }
  }
  return maxId + 1
}

const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    todoAdded(state, action) {
      state.push(action.payload)
    },
    todoToggled(state, action) {
      const todoId = action.payload
      const todo = state.find((todo) => todo.id === todoId)
      todo.completed = !todo.completed
    },
    todoLoaded(state, action) {
      return action.payload
    },
    todoDeleted(state, action) {
      const todoId = action.payload
      return state.filter((todo) => todo.id !== todoId)
    },
    allTodosCompleted(state, action) {
       state.map((todo) => {
        todo.completed = true
        return todo
      })
    },
    completedTodosCleared(state, action) {
      return state.filter((todo) => todo.completed === false)
    },
    todoColorSelected: {
      reducer(state, action) {
        const { color, todoId } = action.payload
        const todo = state.find((todo) => todo.id === todoId)
        todo.color = color
      },
      prepare(todoId, color) {
        return {
          payload: { todoId, color },
        }
      },
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchTodos.fulfilled, (state, action) => {
      return action.payload
    }).addCase(saveNewTodo.fulfilled, (state, action) => {
      state.push(action.payload)
    })
  },
})

export const fetchTodos = createAsyncThunk('todos/fetchTodos', async () => {
  const response = await client.get('/fakeApi/todos');
  return response.todos;
})

export const saveNewTodo = createAsyncThunk('todos/saveNewTodo', async (text) => {
  const initialTodo = { text };
  const response = await client.post('/fakeApi/todos', { todo: initialTodo });
  return response.todo;
})


export const selectTodoIds = createSelector(
  (state) => state.todos,
  (todos) => todos.map((todo) => todo.id)
)

export const selectFilteredTodos = createSelector(
  (state) => state.todos,
  (state) => state.filters,
  (todos, filters) => {
    const { status, colors } = filters
    const showAll = status === StatusFilters.All
    if (showAll && colors.length === 0) {
      return todos
    }

    if(showAll && colors.length > 0){
      return todos.filter((todo) => colors.includes(todo.color))
    }

    const completedStatus = status === StatusFilters.Completed

    return todos.filter((todo) => {
      const statusMatches = completedStatus === todo.completed
      const colorMatches = colors.length === 0 || colors.includes(todo.color)
      return statusMatches && colorMatches
    })
  }
)

export const selectFilteredTodosIds = createSelector(
  selectFilteredTodos,
  (todos) => todos.map((todo) => todo.id)
)

export const selectTodoById = createSelector(
  selectFilteredTodosIds,
  (todoIds) => todoIds.find((todoId) => todoId.id === todoId)
)

export const {
  todoAdded,
  todoToggled,
  todoLoaded,
  todoDeleted,
  allTodosCompleted,
  completedTodosCleared,
  todoColorSelected,
} = todosSlice.actions

export default todosSlice.reducer
