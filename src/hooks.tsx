import React from "react"
import { useCallback, useEffect, useRef, useState } from "react"
import Aria2Client from "./aria2-client"


export function useInput(val?: any) {
  let [value, setValue] = useState(val)
  
  function onChange(e:any) {
    if (e.target) {
      // @ts-ignore
      setValue(e.target.value)
    } else {
      setValue(e)
    }
  }

  function clear() {
    setValue('')
  }

  return {
    clear,
    bind: {
      onChange,
      value,
    }
  }
}

export function useTasks2(client: Aria2Client, interval: number, state: 'Active' | 'Waiting' | 'Stopped') {
  let [tasks, setTasks] = useState([])
  useEffect(() => {
    client.ready().then(client => {
      // @ts-ignore
      client['tell' + state]().then(tasks => {
        setTasks(tasks)
      })
    })

    let id = setInterval(() => {
      // @ts-ignore
      client.tellActive().then(tasks => {
        setTasks(tasks)
      })
    }, 1000)

    return () => {
      clearInterval(id)
    }
  }, [client, state])

  return tasks
}

export function useTasks(getTasks: () => Promise<any>, interval: number, client: Aria2Client) {
  let [tasks, setTasks] = useState<any[]>([])
  let ref = useRef<typeof getTasks>(getTasks)
  ref.current = getTasks

  useEffect(() => {
    setTasks([])
  }, [client])

  useEffect(() => {
    ref.current().then(tasks => {
      setTasks(tasks)
    })
    let id = setInterval(() => {
      ref.current().then(tasks => {
        setTasks(tasks)
      })
    }, interval)
    return () => {
      clearInterval(id)
    }
  }, [interval])

  return tasks
}


export function useAsync(asyncFunc: () => Promise<any>, immediate=true) {
  const [pending, setPending] = useState(false)
  const [value, setValue] = useState(null)
  const [error, setError] = useState(null)

  const execute = useCallback(() => {
    setError(null)
    setPending(true)
    setValue(null)

    return asyncFunc()
      .then((response) => setValue(response))
      .catch((err) => setError(err))
      .finally(() => setPending(false))
  }, [asyncFunc])

  useEffect(() => {
    if (immediate) {
      execute()
    }
  }, [execute, immediate])
  return {
    error,
    execute,
    pending,
    value,
  }
}

export const CurrentTasksContext = React.createContext<{
  currentTasks: any[],
  setCurrentTasks: Function,
  tasksType: any,
  setTasksType: Function,
  isSetting: Boolean
  setIsSetting: Function
  addUriOption: Object
  setAddUriOption: Function
  taskOrder: Boolean
  setTaskOrder: Function
}>({
  currentTasks: [],
  setCurrentTasks: (tasks: any[]) => {},
  tasksType: '',
  setTasksType: (type: any) => {},
  isSetting: true,
  setIsSetting: () => {},
  addUriOption: {},
  setAddUriOption: () => {},
  taskOrder: true,
  setTaskOrder: () => {}
})
CurrentTasksContext.displayName = 'CurrentTasksContext'