import React, { useEffect, useState } from "react";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase.js"
import { useNavigate } from "react-router-dom";
import { uid } from "uid";
import { set,ref, onValue, remove, update } from "firebase/database";

export default function Homepage() {
    const [todo, setTodo] = useState("");
    const [todoList, setTodoList] = useState([]);
    const [isEdit, setEdit] = useState(false);
    const [tempUid, setTempUid] = useState("");
    const nav = useNavigate();

    useEffect(() => {
        auth.onAuthStateChanged((user) => {
          if (user) {
            // read
            onValue(ref(db, `/${auth.currentUser.uid}`), (snapshot) => {
              setTodoList([]);
              const data = snapshot.val();
              if (data !== null) {
                Object.values(data).map((todo) => {
                  setTodoList((oldArray) => [...oldArray, todo]);
                });
              }
            });
          } else if (!user) {
            nav("/");
          }
        });
      }, []);

    const handleSignOut = () => {
        signOut(auth)
            .then(() => {
                nav("/");
            })
            .catch(err => {
                    alert(err.message);
                }
            );
    }

    // Create
    const addToDb = () => {
        const userId = uid();
        set(ref(db,`/${auth.currentUser.uid}/${userId}`), {
            todo: todo,
            userId: userId,
        });
        setTodo("");
    };
    // Read

    // Update
    const editListItem = (todo) => {
        setEdit(true);
        setTodo(todo.todo);
        setTempUid(todo.userId);
    };

    const handleConfirm = () => {
        update(ref(db,`/${auth.currentUser.uid}/${tempUid}`), {
            todo: todo, 
            tempUid: tempUid
        });

        setTodo("");
        setEdit(false);
    };
    // Delete
    const deleteListItem = (uid) => {
        remove(ref(db,`/${auth.currentUser.uid}/${uid}`));
    };

    return (
        <div>
            <input type="text" placeholder="Add Todo Item" value={todo} onChange={(e) => setTodo(e.target.value)}></input>
        {todoList.map((todo) => (
            <div>
                <h1>{todo.todo}</h1>
                <button onClick={() => editListItem(todo)}>Edit</button>
                <button onClick={() => deleteListItem(todo.userId)}>Delete</button>
            </div>
        ))}
            {isEdit ? (
                <div>
                    <button onClick={ handleConfirm }>Confirm</button>
                </div>
            ) : (
                <div>
                    <button onClick={ addToDb }>Add</button>
                </div>
            )}
            <button onClick={ handleSignOut }>Sign Out</button>
        </div>
    )
}