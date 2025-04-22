import { useEffect, useState } from "react";

export const Todo = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [todos, setTodos] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editId, setEditId] = useState(-1);

  //Edit todo item
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const apiUrl = "http://localhost:8000/";

  const handleSubmit = async () => {
    // console.log("Form Submitted");
    setError("");
    setSuccess("");
    if (title.trim() !== "" && description.trim() !== "") {
      try {
        await fetch(apiUrl + "todos", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ title, description }),
        })
          .then((res) => {
            if (res.ok) {
              setTodos([...todos, { title, description }]);
              setTitle("");
              setDescription("");
              setSuccess("Item added successfully");
            }
          })
          .catch((error) => {
            setError("Something went wrong" + error);
          });
      } catch (error) {
        setError("Something went wrong" + error);
      }
    } else {
      setError("Please fill all fields");
    }
  };

  useEffect(() => {
    setError("");
    setSuccess("");
    getTodos();
  }, []);

  const getTodos = async () => {
    try {
      await fetch(apiUrl + "todos")
        .then((res) => res.json())
        .then((data) => {
          setTodos(data);
        });
    } catch (error) {
      setError("Something went wrong" + error);
    }
  };

  const handleEdit = (todo) => {
    debugger;
    setEditId(todo._id);
    setEditTitle(todo.title);
    setEditDescription(todo.description);
  };

  const handleEditCancel = () => {
    setEditId(-1);
  };

  const handleUpdate = async (id) => {
    debugger;
    try {
      await fetch(apiUrl + "todos/" + editId, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: editTitle,
          description: editDescription,
        }),
      })
        .then((res) => {
          if (res.ok) {
            setTodos(
              todos.map((todo) => {
                if (todo._id === editId) {
                  return {
                    ...todo,
                    title: editTitle,
                    description: editDescription,
                  };
                }
                return todo;
              })
            );
            setEditId(-1);
            setEditTitle("");
            setEditDescription("");
            setSuccess("Item updated successfully");
          } else {
            setError("Something went wrong");
          }
        })
        .catch((error) => {
          setError("Something went wrong" + error);
        });
    } catch (error) {
      setError("Something went wrong" + error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        await fetch(apiUrl + "todos/" + id, {
          method: "DELETE",
        })
          .then((res) => {
            if (res.ok) {
              setTodos(todos.filter((todo) => todo._id !== id));
              setSuccess("Item deleted successfully");
            } else {
              setError("Something went wrong");
            }
          })
          .catch((error) => {
            setError("Something went wrong" + error);
          });
      } catch (error) {
        setError("Something went wrong" + error);
      }
    }
  };

  return (
    <div class="row g-3">
      <div className="col-12">
        <h1>Todo Project with MERN</h1>
        <div class="col">
          {error && <p className="text-danger">{error}</p>}
          {success && <p className="text-success">{success}</p>}
          <h3>Add Item</h3>
          <div className="form-group d-flex  justify-content-between gap-2 align-items-center my-2">
            <input
              type="text"
              placeholder="Title"
              onChange={(e) => setTitle(e.target.value)}
              value={title}
              className="form-control"
            />
          </div>
          <div class="col">
            <input
              type="text"
              placeholder="Description"
              onChange={(e) => setDescription(e.target.value)}
              value={description}
              className="form-control"
            />
          </div>
          <div class="col-12 mt-5">
            <button className="btn btn-primary" onClick={handleSubmit}>
              Add Item
            </button>
          </div>
        </div>
      </div>
      <div className="col-12 mt-5">
        <h3>Todo List</h3>
        <ul className="list-group">
          {todos.map((todo, index) => (
            <li key={index} className="list-group-item">
              <div className="d-flex flex-column gap-2">
                {editId === -1 || editId !== todo._id ? (
                  <>
                    <span className="fw-bold">{todo.title}</span>
                    <span> {todo.description}</span>
                  </>
                ) : (
                  <>
                    <div className="form-group d-flex  justify-content-between gap-2 align-items-center my-2">
                      <input
                        type="text"
                        placeholder="Title"
                        onChange={(e) => setEditTitle(e.target.value)}
                        value={editTitle}
                        className="form-control"
                      />
                      <input
                        type="text"
                        placeholder="Description"
                        onChange={(e) => setEditDescription(e.target.value)}
                        value={editDescription}
                        className="form-control"
                      />
                    </div>
                  </>
                )}
              </div>
              <div className="float-end d-flex gap-2">
                {editId === -1 || editId !== todo._id ? (
                  <>
                    <button
                      className="btn btn-primary btn-sm float-end"
                      onClick={() => handleEdit(todo)}
                    >
                      Edit
                    </button>
                  </>
                ) : (
                  <button
                    className="btn btn-primary btn-sm float-end"
                    onClick={() => handleUpdate(todo._id)}
                  >
                    Update
                  </button>
                )}

                {editId === -1 || editId !== todo._id ? (
                  <>
                    <button
                      className="btn btn-danger btn-sm float-end"
                      onClick={() => handleDelete(todo._id)}
                    >
                      Delete
                    </button>
                  </>
                ) : (
                  <button
                    className="btn btn-danger btn-sm float-end"
                    onClick={() => handleEditCancel(todo)}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
