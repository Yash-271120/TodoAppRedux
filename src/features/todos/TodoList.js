import React from 'react'
import { useSelector} from 'react-redux'
import TodoListItem from './TodoListItem'
import { selectFilteredTodosIds } from './todosSlice'


const TodoList = () => {
  const todoIds = useSelector(selectFilteredTodosIds);

  const renderedListItems = todoIds.map((todoId) => {
    return <TodoListItem key={todoId} id={todoId} />
  })

  return <ul className="todo-list">{renderedListItems}</ul>
}

export default TodoList
