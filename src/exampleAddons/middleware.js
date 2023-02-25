export const print1 = (storeAPI) => (next) => (action) => {
  let resp = next(action)
  console.log('1')
}

export const print2 = (storeAPI) => (next) => (action) => {
  let resp =  next(action)
  console.log('2')
}

export const print3 = (storeAPI) => (next) => (action) => {
  let resp= next(action)
  console.log('3')
}

const loggerMiddleware = (storeAPI)=>(next)=>(action)=>{
  console.log('dispatching',action);
  let result = next(action);
  console.log('next state',storeAPI.getState());
  return result;
}

const delayedMessageMiddleware = storeAPI => next => action => {
  if (action.type === 'todos/todoAdded') {
    setTimeout(() => {
      console.log('Added a new todo: ', action.payload)
    }, 1000)
  }

  return next(action)
}

export {loggerMiddleware,delayedMessageMiddleware};