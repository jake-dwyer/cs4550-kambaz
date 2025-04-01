import React, { useState, useEffect } from "react";
import { ListGroup, FormControl } from "react-bootstrap";
import { FaTrash, FaPlusCircle } from "react-icons/fa";
import { FaPencil } from "react-icons/fa6";
import { TiDelete } from "react-icons/ti";
import * as client from "./client";

export default function WorkingWithArraysAsynchronously() {
    const [todos, setTodos] = useState<any[]>([]);
    const [errorMessage, setErrorMessage] = useState(null);

    const fetchTodos = async () => {
        const todos = await client.fetchTodos();
        setTodos(todos);
    };

    const createTodo = async () => {
        const todos = await client.createTodo();
        setTodos(todos);
    };

    const postTodo = async () => {
        const newTodo = await client.postTodo({
            title: "New Posted Todo",
            completed: false,
            description: ""
        });
        setTodos([...todos, newTodo]);
    };

    const removeTodo = async (todo: any) => {
        const updatedTodos = await client.removeTodo(todo);
        setTodos(updatedTodos);
    };

    const deleteTodo = async (todo: any) => {
        try {
            await client.deleteTodo(todo);
            const newTodos = todos.filter((t) => t.id !== todo.id);
            setTodos(newTodos);
        } catch (error: any) {
            setErrorMessage(error.response.data.message);
        }
    };

    const editTodo = (todo: any) => {
        const updatedTodos = todos.map(t =>
            t.id === todo.id ? { ...todo, editing: true } : t
        );
        setTodos(updatedTodos);
    };

    const updateTodo = async (todo: any) => {
        try {
            await client.updateTodo(todo);
            setTodos(todos.map((t) => (t.id === todo.id ? todo : t)));
        } catch (error: any) {
            setErrorMessage(error.response.data.message);
        }
    };

    useEffect(() => { fetchTodos(); }, []);

    return (
        <div id="wd-asynchronous-arrays">
            <h3>Working with Arrays Asynchronously</h3>
            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
            <h4>
                Todos
                <FaPlusCircle onClick={createTodo} className="text-success float-end fs-3" />
                <FaPlusCircle onClick={postTodo} className="text-primary float-end fs-3 me-3" />
            </h4>
            <ListGroup>
                {todos.map((todo) => (
                    <ListGroup.Item key={todo.id}>
                        <FaTrash onClick={() => removeTodo(todo)} className="text-danger float-end mt-1" />
                        <TiDelete onClick={() => deleteTodo(todo)} className="text-danger float-end me-2 fs-3" />
                        <FaPencil onClick={() => editTodo(todo)} className="text-primary float-end me-2 mt-1" />
                        <input type="checkbox" defaultChecked={todo.completed} className="form-check-input me-2 float-start"
                            onChange={(e) => updateTodo({ ...todo, completed: e.target.checked })} />
                        {!todo.editing ? (
                            <span>{todo.title}</span>
                        ) : (
                            <FormControl className="w-50 float-start" defaultValue={todo.title}
                                onKeyDown={(e) => e.key === "Enter" && updateTodo({ ...todo, editing: false })}
                                onChange={(e) => updateTodo({ ...todo, title: e.target.value })} />
                        )}
                    </ListGroup.Item>
                ))}
            </ListGroup>
        </div>
    );
}
