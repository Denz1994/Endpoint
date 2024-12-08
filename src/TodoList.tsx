import {useState, useEffect, useRef} from 'react';

interface Todo{
id: string;
description:string;
isComplete: boolean;
dueDate: string;
}

function TodoList(){
    // TODO: Separate into 3 lists: overdue, completed, not completed
    const [todos, setTodos] = useState([]);
    const hasAttemptedFetch = useRef(false);
    useEffect(()=>{
    // Prevents duplicate call to API. Strict mode does this in dev-mode intentionally to detect side effects. 
    // Docs here: https://legacy.reactjs.org/docs/strict-mode.html#detecting-unexpected-side-effects
    if (hasAttemptedFetch.current){
        return;
    }
    hasAttemptedFetch.current = true;
    const url = "https://b0f179aa-a791-47b5-a7ca-5585ba9e3642.mock.pstmn.io/get";
    const options = {
        method: "GET",
        headers: {
            "X-Api-Key": "PMAK-65a6d95a73d7f315b0b3ae13-28f9a3fada28cc91e0990b112478319641"
        }
    }
    fetch(url,options)
    .then((response)=>{
        if (!response.ok){
            throw new Error(`HTTP error: ${response.status}`);
        }
        return response.json();
    })
    .then((data)=>{
        console.log(data);
        setTodos(data)
    })
    .catch((error)=>{
        console.error(error);
    })},[]);
    debugger
    return (
    <div className="todo-list">
        <h1 className ="list-header">Todos</h1>
        <div className ="list-items">
        {todos.map((todo:Todo, index )=>{
            return(
                <div className="list-item">
                    <input
                        type="checkbox"
                        id={`todo-${index}`}
                        name={todo.description}
                        className="list-item-checkbox"
                        onClick={() => {
                            console.log('clicked');
                        }}
                    />
                    <label htmlFor={`todo-${index}`} className="list-item-description">
                        {todo.description}
                    </label>
                    <label htmlFor={`todo-${index}`} className="list-item-date">
                        {todo.dueDate}
                    </label>
                </div>
            )
            })
        }
        </div>  
    </div>)
}

export default TodoList;