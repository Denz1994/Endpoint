import './App.css'
import TodoList from './TodoList'
import { Suspense } from 'react'

function Loading() {
  return <h2> ⏳ Loading...</h2>;
}
function App() {
  return (
    <Suspense fallback={<Loading />}>
    <TodoList/>
    </Suspense>
  )
}

export default App
