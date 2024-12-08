import {useState, useEffect, useRef} from 'react';
import "./Todolist.css"
interface Todo{
    id: string;
    description:string;
    isComplete: boolean;
    dueDate: string;
}

interface PartitionedTodoList{
    overdue:Todo[],
    incompleteNotOverdue: Todo[],
    completed:Todo[],
}

 // We handle "null" dates in the label element. Assumes api doesn't allow for "undefined" due dates.
 const formatDate = (date:Date)=>{
    // Forgot we can use padding for strings. Handles dates with one digit.
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // For some reason months are zero-based
    const year = String(date.getFullYear());

    return String(`${month}/${day}/${year}`)
}
const handleUpdate = (todoId:string)=>{

    const url = `https://b0f179aa-a791-47b5-a7ca-5585ba9e3642.mock.pstmn.io/patch/${todoId}`;
    const options = {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
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
    .catch((error)=>{
        console.error(error);
    });
}

const partitionTodos= (todoList: Todo[] )=>{
    const currentTime = new Date(); 
    const partitionedTodos: PartitionedTodoList = {
        overdue:[],
        incompleteNotOverdue: [],
        completed:[],
    };

    // Check todos in this order: not completed & no due date, completed, overdue, not completed
    todoList.forEach((todo:Todo)=>{
        if (!todo.isComplete && todo.dueDate === null){
            partitionedTodos.incompleteNotOverdue.push(todo);
        }
        else if(todo.isComplete){
            partitionedTodos.completed.push(todo);
        }
        // Normalizes for timezones
        else if(currentTime.getTime() > new Date(todo.dueDate).getTime()){
            partitionedTodos.overdue.push(todo);
        }
        else{
            partitionedTodos.incompleteNotOverdue.push(todo);
        }
    });

    return partitionedTodos;
};



function TodoList(){
    // TODO: Separate into 3 lists: overdue, completed, not completed
    const defaultPartitionedTodoList = {
        overdue:[],
        incompleteNotOverdue: [],
        completed:[],
    };
    const [todos, setTodos] = useState<PartitionedTodoList>(defaultPartitionedTodoList);
    const hasAttemptedFetch = useRef(false);

    const checkboxClickHandler = (todoId:string, isComplete:boolean)=>{

        // Locally update state
        setTodos((prevTodos) => {
            const updatedTodos = { ...prevTodos };
            const updateTodo = (todoList: Todo[]) => {
              return todoList.map((todo) => {
                if (todo.id === todoId) {
                  return { ...todo, isComplete: !isComplete }; 
                }
                return todo;
              });
            };
            updatedTodos.overdue = updateTodo(updatedTodos.overdue);
            updatedTodos.incompleteNotOverdue = updateTodo(updatedTodos.incompleteNotOverdue);
            updatedTodos.completed = updateTodo(updatedTodos.completed);
            console.log(updatedTodos, todos)
            return updatedTodos;
          });

        // Update server
        handleUpdate(todoId);
    }

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
        const partitionedTodoList = partitionTodos(data);
        setTodos(partitionedTodoList)
    })
    .catch((error)=>{
        console.error(error);
    })},[]);
    
    
    return (
    <div className="todo-list">
        <h1 className ="list-header">Todos</h1>
        <div className ="list-items">
        {todos.overdue.map((todo:Todo, index )=>{
            return(
                <div key={index}
                className="list-item overdue"
                onClick={() => {
                    checkboxClickHandler(todo.id, todo.isComplete);
                }}>
                    <input
                        type="checkbox"
                        id={`todo-${index}`}
                        defaultChecked={todo.isComplete}
                        name={todo.description}
                        className="list-item-checkbox"
                    />
                    <p className="list-item-description">
                        {todo.description}
                    </p>
                    <p>
                        {todo.dueDate ? formatDate(new Date(todo.dueDate)): ''}
                    </p>
                </div>
            )
            })
        }

        {todos.incompleteNotOverdue.map((todo:Todo, index )=>{
            return(
                <div key={index}
                className="list-item incomplete-not-overdue" 
                onClick={() => {
                    checkboxClickHandler(todo.id, todo.isComplete);
                }}>
                    <input
                        type="checkbox"
                        id={`todo-${index}`}
                        defaultChecked={todo.isComplete}
                        name={todo.description}
                        className="list-item-checkbox"
                    />
                    <p className="list-item-description">
                        {todo.description}
                    </p>
                    <p >
                        {todo.dueDate ? formatDate(new Date(todo.dueDate)): ''}
                    </p>
                </div>
            )
            })
        }
        {todos.completed.map((todo:Todo, index )=>{
                return(
                    <div key={index} 
                    className="list-item completed" 
                    onClick={() => {
                        checkboxClickHandler(todo.id, todo.isComplete);
                    }}>
                        <input
                            type="checkbox"
                            defaultChecked={todo.isComplete}
                            id={`todo-${index}`}
                            name={todo.description}
                            className="list-item-checkbox"
                            
                        />
                        <p className="list-item-description completed-text">
                            {todo.description}
                        </p>
                        <p>
                            {todo.dueDate ? formatDate(new Date(todo.dueDate)): ''}
                        </p>
                    </div>
                )
                })
            }
            </div>  
        </div>)
}

export default TodoList;