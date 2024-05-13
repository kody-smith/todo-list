import React, { useEffect, useState } from "react";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase.js"
import { useNavigate } from "react-router-dom";
import { uid } from "uid";
import { set,ref, onValue, remove, update } from "firebase/database";
import './homepage.css';
import logo from '../images/checklist.png';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';
import LogoutIcon from '@mui/icons-material/Logout';

export default function Homepage() {
    const [todoList, setTodoList] = useState([]);
    const [editingItemId, setEditingItemId] = useState(null);
    const [newTodo, setNewTodo] = useState("");
    const [editingTodo, setEditingTodo] = useState("");
    const nav = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                onValue(ref(db, `/${auth.currentUser.uid}`), (snapshot) => {
                    const data = snapshot.val();
                    if (data !== null) {
                        const todoItems = Object.values(data);
                        setTodoList(todoItems);
                    } else {
                        setTodoList([]);
                    }
                });
            } else {
                nav("/");
            }
        });
        return () => unsubscribe();
    }, [nav]);

    const handleSignOut = () => {
        signOut(auth)
            .then(() => {
                nav("/");
            })
            .catch(err => {
                alert(err.message);
            });
    };

    const startEditing = (itemId, todoText) => {
        setEditingItemId(itemId);
        setEditingTodo(todoText);
    };

    const confirmEdit = () => {
        update(ref(db, `/${auth.currentUser.uid}/${editingItemId}`), {
            todo: editingTodo
        }).then(() => {
            setEditingItemId(null);
            setEditingTodo("");
        }).catch((error) => {
            console.error("Error updating document: ", error);
        });
    };

    const cancelEdit = () => {
        setEditingItemId(null);
        setEditingTodo("");
    };

    const deleteListItem = (uid) => {
        remove(ref(db, `/${auth.currentUser.uid}/${uid}`)).catch((error) => {
            console.error("Error removing document: ", error);
        });
    };

    const handleAdd = () => {
        const userId = uid();
        set(ref(db, `/${auth.currentUser.uid}/${userId}`), {
            todo: newTodo,
            userId: userId
        }).then(() => {
            setNewTodo("");
        }).catch((error) => {
            console.error("Error adding document: ", error);
        });
    };

    return (
        <div className="homepage">
            <h1 className="add-heading"><img id="logoImg" src={logo} alt="Logo" />Todo List</h1>
            <div className="add-todo-container">
                <input
                    className="add-todo-input"
                    type="text"
                    value={newTodo}
                    onChange={(e) => setNewTodo(e.target.value)}
                />
                <AddIcon onClick={handleAdd} className="add-icon"></AddIcon>
            </div>
            {todoList.map((todo) => (
                <div className="todo-items" key={todo.userId}>
                    {editingItemId === todo.userId ? (
                        <>
                            <input
                                className="edit-todo-input"
                                type="text"
                                value={editingTodo}
                                onChange={(e) => setEditingTodo(e.target.value)}
                            />
                            <CheckIcon className="check-btn" onClick={confirmEdit}>Confirm</CheckIcon>
                            <DeleteIcon className="trash-btn" onClick={() => deleteListItem(todo.userId)}>Delete</DeleteIcon>
                        </>
                    ) : (
                        <>
                            <p className="items">{todo.todo}</p>
                            <EditIcon className="edit-btn" onClick={() => startEditing(todo.userId, todo.todo)}>Edit</EditIcon>
                            <DeleteIcon className="trash-btn" onClick={() => deleteListItem(todo.userId)}>Delete</DeleteIcon>
                        </>
                    )}
                </div>
            ))}
            <LogoutIcon className="logout-icon" onClick={handleSignOut}>Sign Out</LogoutIcon>
        </div>
    );
}
