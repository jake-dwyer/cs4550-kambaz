import { ListGroup } from 'react-bootstrap';
import { useDispatch } from "react-redux";
import { deleteTodo, setTodo } from "./todosReducer";
export default function TodoItem({ todo }) {
    const dispatch = useDispatch();
    return (
        <ListGroup.Item key={todo.id}>
            <button onClick={() => dispatch(deleteTodo(todo.id))}>
                Delete </button>
            <button onClick={() => dispatch(setTodo(todo))}>
                Edit </button>
            {todo.title}
        </ListGroup.Item>);
}
