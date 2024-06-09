import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

const API_URL = 'http://localhost:4000/tasks'

const Body = () => {
    const [data, setData] = useState(null)
    const [edit, setEdit] = useState(false)
    const [reload, setReload] = useState(false)
    const [currentTask, setCurrentTask] = useState(null)
    const [currentTaskTitle, setCurrentTaskTitle] = useState('')

    useEffect(() => {
        fetch(API_URL)
            .then(res => res.json())
            .then(res => setData(res))
    }, [reload])

    const handleDelete = id => {
        if (window.confirm("Are you sure?")) {
            fetch(`${API_URL}/${id}`, {
                method: "DELETE"
            })
                .then(() => setReload(p => !p))
        }
    }

    const handleEdit = task => {
        setEdit(p => !p)
        setCurrentTask(task)
        setCurrentTaskTitle(task.title)
    }

    const handleSave = id => {
        if (currentTaskTitle.trim()) {
            fetch(`${API_URL}/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ title: currentTaskTitle, time: currentTask.time })
            })
                .then(() => {
                    setReload(p => !p);
                    setEdit(false);
                    setCurrentTask(null);
                });
        } else {
            toast.warn("Task title cannot be empty");
            setEdit(false);
        }
    }

    const handleCreateTask = e => {
        e.preventDefault()
        let formData = new FormData(e.target)
        let title = formData.get('title')

        const now = new Date();
        let task = {
            title,
            time: `${now.getHours() < 10 ? "0" + now.getHours() : now.getHours()} : ${now.getMinutes() < 10 ? "0" + now.getMinutes() : now.getMinutes()}`
        }

        if (task.title.trim()) {
            fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(task)
            })
                .then(() => {
                    setReload(p => !p);
                    e.target.reset();
                });
        } else {
            toast.warn("Task title cannot be empty");
        }

    }

    let tasks = data?.map(task => (
        <div key={task.id} className={`todo__task ${edit && currentTask?.id === task.id ? 'edit' : ''}`}>
            {edit && currentTask?.id === task.id ?
                <input type="text" value={currentTaskTitle.trimStart()} onChange={e => setCurrentTaskTitle(e.target.value)} />
                :
                <p title={task.title}>{task.title}</p>
            }
            <div>
                <h5>{task.time}</h5>
                {edit && currentTask?.id === task.id ? (
                    <>
                        <button onClick={() => handleSave(task.id)}><svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 24 24"><path d="M5 21h14a2 2 0 0 0 2-2V8a1 1 0 0 0-.29-.71l-4-4A1 1 0 0 0 16 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2zm10-2H9v-5h6zM13 7h-2V5h2zM5 5h2v4h8V5h.59L19 8.41V19h-2v-5a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v5H5z"></path></svg></button>
                        <button onClick={() => handleEdit(p => !p)}><svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 24 24"><path d="m16.192 6.344-4.243 4.242-4.242-4.242-1.414 1.414L10.535 12l-4.242 4.242 1.414 1.414 4.242-4.242 4.243 4.242 1.414-1.414L13.364 12l4.242-4.242z"></path></svg></button>
                    </>
                ) : (
                    <>
                        <button onClick={() => handleEdit(task)}>
                            <svg stroke="currentColor" fill="currentColor" strokeWidth="0.5" viewBox="0 0 24 24" height="1.2em" width="1.2em" xmlns="http://www.w3.org/2000/svg">
                                <g id="Edit">
                                    <g>
                                        <path d="M3.548,20.938h16.9a.5.5,0,0,0,0-1H3.548a.5.5,0,0,0,0,1Z"></path>
                                        <path d="M9.71,17.18a2.587,2.587,0,0,0,1.12-.65l9.54-9.54a1.75,1.75,0,0,0,0-2.47l-.94-.93a1.788,1.788,0,0,0-2.47,0L7.42,13.12a2.473,2.473,0,0,0-.64,1.12L6.04,17a.737.737,0,0,0,.19.72.767.767,0,0,0,.53.22Zm.41-1.36a1.468,1.468,0,0,1-.67.39l-.97.26-1-1,.26-.97a1.521,1.521,0,0,1,.39-.67l.38-.37,1.99,1.99Zm1.09-1.08L9.22,12.75l6.73-6.73,1.99,1.99Zm8.45-8.45L18.65,7.3,16.66,5.31l1.01-1.02a.748.748,0,0,1,1.06,0l.93.94A.754.754,0,0,1,19.66,6.29Z"></path>
                                    </g>
                                </g>
                            </svg>
                        </button>
                        <button onClick={() => handleDelete(task.id)}>
                            <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1.2em" width="1.2em" xmlns="http://www.w3.org/2000/svg">
                                <path d="M7 4V2H17V4H22V6H20V21C20 21.5523 19.5523 22 19 22H5C4.44772 22 4 21.5523 4 21V6H2V4H7ZM6 6V20H18V6H6ZM9 9H11V17H9V9ZM13 9H15V17H13V9Z"></path>
                            </svg>
                        </button>
                    </>
                )}
            </div>
        </div>
    ))
    return (
        <section className='todo-section'>
            <div onClick={() => setEdit(p => !p)} className={`overlay ${edit ? 'show' : ''}`}></div>
            <div className="container">
                <div className="todo-section__content">
                    <form onSubmit={handleCreateTask}>
                        <div>
                            <input required type="text" name='title' placeholder='Enter your task!' />
                        </div>
                        <button>Add</button>
                    </form>
                    <div className="todo__tasks">
                        {tasks}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Body
