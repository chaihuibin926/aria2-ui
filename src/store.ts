import { AnyAction, createStore, Reducer } from "redux"
import { produce } from "immer"

// action type 的类型
// type ActionTypes = 
//   'updateActiveTasks'
//   | 'updateWaitingTasks'
//   | 'updateStoppedTasks'
//   | 'updateServers'
//   | 'updateSelectedServerIndex'
//   | 'updateSelectedTasksGid'

// type MyActions = Action<ActionTypes>

// Reducer<State, AnyAction>   renducer函数的泛型类型， State是状态的类型，AnyAction是action的类型
const reducer: Reducer<State, AnyAction> = (state: State=initState, action: AnyAction): State => {

  switch (action.type) {
    case 'updateActiveTasks':
      return produce(state, draft => {
        draft.activeTasks = action.tasks
      });
    case 'updateStoppedTasks':
      return produce(state, draft => {
        draft.stoppedTasks = action.tasks
      });
    case 'updateWaitingTasks':
      return produce(state, draft => {
        draft.waitingTasks = action.tasks
      });
    case 'updateShowTasks':
      return produce(state, draft => {
        draft.showTasks = action.tasks
      })
    case 'selectTask':
      return produce(state, draft => {
        draft.selectedTasksGid = action.tasks
      });
  }

  return state
}

export interface State {
  showTasks: any[],
  activeTasks: any[],
  waitingTasks: any[],
  stoppedTasks: any[],
  servers: any[],
  selectedTasksGid: string[],
  selectedServerIndex: number,
}

const initState: State = {
  showTasks: [],
  activeTasks: [],
  waitingTasks: [],
  stoppedTasks: [],
  servers: [],
  selectedTasksGid: [],
  selectedServerIndex: 0,
}

const store = createStore(reducer, initState)

export default store