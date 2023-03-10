import React from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { availableColors, capitalize } from '../filters/colors'
import { colorFilterChanged, statusFilterChanged, StatusFilters } from '../filters/filtersSlice'
import { allTodosCompleted,completedTodosCleared } from '../todos/todosSlice'



const RemainingTodos = ({ count }) => {
  const suffix = count === 1 ? '' : 's'

  return (
    <div className="todo-count">
      <h5>Remaining Todos</h5>
      <strong>{count}</strong> item{suffix} left
    </div>
  )
}

const StatusFilter = ({ value: status, onChange }) => {
  const dispatch = useDispatch();
  const renderedFilters = Object.keys(StatusFilters).map((key) => {
    const value = StatusFilters[key]
    const handleClick = () => {
      dispatch(statusFilterChanged(value));
      onChange(value)
    }
    const className = value === status ? 'selected' : ''

    return (
      <li key={value}>
        <button className={className} onClick={handleClick}>
          {key}
        </button>
      </li>
    )
  })

  return (
    <div className="filters statusFilters">
      <h5>Filter by Status</h5>
      <ul>{renderedFilters}</ul>
    </div>
  )
}

const ColorFilters = ({ value: colors, onChange }) => {
  const dispatch = useDispatch();
  const renderedColors = availableColors.map((color) => {
    const checked = colors.includes(color)
    const handleChange = () => {
      const changeType = checked ? 'removed' : 'added'
      onChange(color, changeType)
      dispatch(colorFilterChanged(color,changeType))
    }

    return (
      <label key={color}>
        <input
          type="checkbox"
          name={color}
          checked={checked}
          onChange={handleChange}
        />
        <span
          className="color-block"
          style={{
            backgroundColor: color,
          }}
        ></span>
        {capitalize(color)}
      </label>
    )
  })

  return (
    <div className="filters colorFilters">
      <h5>Filter by Color</h5>
      <form className="colorSelection">{renderedColors}</form>
    </div>
  )
}

const Footer = () => {
  const dispatch = useDispatch();
  const todosRemaining = useSelector((state)=>{
    const uncompletedTodos = state.todos.filter((todo) => !todo.completed)
    return uncompletedTodos.length
  })


  const { status, colors } = useSelector((state) => {
    return {
      status: state.filters.status,
      colors: state.filters.colors,
    }
  })

  const onColorChange = (color, changeType) =>
    console.log('Color change: ', { color, changeType })
  const onStatusChange = (status) => console.log('Status change: ', status)
  const onMarkAllCompleted = () => {
    dispatch(allTodosCompleted())
  }
  const onClearCompleted = () => {
    dispatch(completedTodosCleared())
  }

  return (
    <footer className="footer">
      <div className="actions">
        <h5>Actions</h5>
        <button className="button" onClick={onMarkAllCompleted}>Mark All Completed</button>
        <button className="button" onClick={onClearCompleted}>Clear Completed</button>
      </div>

      <RemainingTodos count={todosRemaining} />
      <StatusFilter value={status} onChange={onStatusChange} />
      <ColorFilters value={colors} onChange={onColorChange} />
    </footer>
  )
}

export default Footer
