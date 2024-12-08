import './App.css'
import React, { Suspense } from 'react'

function Loading() {
  return <h2>⏳ Loading...</h2>;
}

// Simulates a delay in the component. Not the actual todo list api call, just the component's code loading.
const LazyTodoList = React.lazy(() => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(import("./TodoList")), 1000);
  });
});
function App() {
  return (
    <Suspense fallback={<Loading />}>
    <LazyTodoList/>
    </Suspense>
  )
}

export default App
