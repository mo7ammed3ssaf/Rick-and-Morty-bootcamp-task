import React, { createContext, useContext, useReducer } from 'react'


type State = {
search: string
cache: { [key: string]: any }
}


type Action =
| { type: 'setSearch'; payload: string }
| { type: 'cache'; key: string; payload: any }


const initialState: State = { search: '', cache: {} }


function reducer(state: State, action: Action): State {
switch (action.type) {
case 'setSearch':
return { ...state, search: action.payload }
case 'cache':
return { ...state, cache: { ...state.cache, [action.key]: action.payload } }
default:
return state
}
}


const AppStateContext = createContext<{
state: State
dispatch: React.Dispatch<Action>
} | null>(null)


export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
const [state, dispatch] = useReducer(reducer, initialState)
return <AppStateContext.Provider value={{ state, dispatch }}>{children}</AppStateContext.Provider>
}


export function useAppState() {
const ctx = useContext(AppStateContext)
if (!ctx) throw new Error('useAppState must be used inside AppProvider')
return ctx
}