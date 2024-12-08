import {useState} from 'react';

const testTodos = ['A', 'Some other task', 'New Item here'];
function TodoList(){
    // TODO: Separate into 3 lists: overdue, completed, not completed
    const [todos, setTodos] = useState(testTodos);

    return (
    <div className="todo-list">
        <h1 className ="list-header">Todos</h1>
        <ul className ="list-items">
        {todos.map((todo, index)=>{
            return(<li key={index} className="list-item">{todo}</li>)
            })
        }
        </ul>  
    </div>)
}

export default TodoList;