import React, { useState } from 'react';
import { useEffect } from 'react';
const Todo = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [todo, setTodo] = useState([]);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const apiUrl = "http://localhost:8000";

    const handleSubmit = () => {
        if (title.trim() !== "" && description.trim() !== ""){
            fetch(`${apiUrl}/todos`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ title, description })
            })
                .then((res) => {
                    if (res.ok) {
                        setTodo([...todo, { title, description }]);
                        setSuccess(true);
                        setError("");
                        // Clear input fields after adding the item
                        setTitle("");
                        setDescription("");
                        // Clear success message after 3 seconds
                        setTimeout(() => {
                            setSuccess(false);
                        }, 3000);
                    } else {
                        throw new Error("Error adding item");
                    }
                })
                .catch((error) => {
                    setError("Error adding item");
                    setSuccess(false);

                    // Clear error message after 3 seconds
                    setTimeout(() => {
                        setError("");
                    }, 3000);
                });
        } else {
            setError("Please enter title and description");
            setSuccess(false);

            // Clear error message after 3 seconds
            setTimeout(() => {
                setError("");
            }, 3000);
        }
    };
    useEffect(() => {
        getItems();
    }, []);


    const getItems = () => {
        fetch(`${apiUrl}/todos`)
            .then((res) => res.json())
            .then((data) => {
                setTodo(data);
             })
            .catch((error) => console.log(error));
    };
    //delete
    const deleteItem = (id) => {
        if(window.confirm("Are you sure you want to delete this item?")) {
            // deleteItemApi(id);
        fetch(`${apiUrl}/todos/${id}`, {
            method: "DELETE"
        })
            .then((res) => {
                if (res.ok) {
                    setTodo(todo.filter((item) => item._id !== id));
                    setSuccess(true);
                    setError("");
                    // Clear success message after 3 seconds
                    setTimeout(() => {
                        setSuccess(false);
                    }, 3000);
                } else {
                    throw new Error("Error deleting item");
                }
            })
            .catch((error) => {
                setError("Error deleting item");
                setSuccess(false);

                // Clear error message after 3 seconds
                setTimeout(() => {
                    setError("");
                }, 3000);
            });
        }
    };
    return (
        <div className='bg-gray-50 p-6'>
            <div>
                <h1 className='font-semibold text-center text-3xl p-4 mb-6 bg-green-500 text-white rounded-md shadow-md'>
                    To Do List
                </h1>
            </div>

            <div className='bg-white shadow-md rounded-lg p-6 max-w-lg mx-auto'>
                <h3 className='text-xl font-medium text-gray-800 mb-4 text-center'>Add Item</h3>
                {success && (
                    <p className='text-green-600 text-center mb-4'>
                        Item added successfully
                    </p>
                )}
                {error && (
                    <p className='text-red-600 text-center mb-4'>
                        {error}
                    </p>
                )}
                <div className='space-y-4'>
                    <input
                        type='text'
                        placeholder='Enter title'
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className='border border-gray-300 rounded-md px-4 py-2 w-full focus:outline-none focus:border-blue-500'
                    />
                    <input
                        type='text'
                        placeholder='Enter Description'
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className='border border-gray-300 rounded-md px-4 py-2 w-full focus:outline-none focus:border-blue-500'
                    />
                    <div className='flex justify-center'>
                        <button
                            onClick={handleSubmit}
                            className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-md shadow-md transition-colors duration-200'>
                            Add
                        </button>
                    </div>
                </div>
            </div>

            <div className='mt-8'>
    <h3 className='text-center text-3xl font-semibold mb-6'>Tasks</h3>
    <div className='flex justify-center'>
        <ul className='w-full max-w-xl'>
            {todo.map((item) =><li className='bg-white shadow-lg rounded-lg p-6 mb-6'>
                <div className='mb-4'>
                    <h4 className='text-xl font-bold text-gray-800 mb-1'>{item.title}</h4>
                    <p className='text-gray-600'>{item.description}</p>
                </div>
                <div className='flex justify-end gap-3'>
                    <button onClick={() => deleteItem(item._id)} className='bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-md transition-colors duration-200'>
                        Delete
                    </button>
                </div>
            </li>)}
        </ul>
    </div>
</div>
        </div>
    );
};

export default Todo;