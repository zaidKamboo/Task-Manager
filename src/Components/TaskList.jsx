import React, { useContext, useEffect } from "react";
import { UserContext } from "../store/StateProvider";
import { Link, useNavigate } from "react-router-dom";

const TaskList = () => {
  const { setTask, setAlert, user, tasks, setTasks, isLoggedIn } =
    useContext(UserContext);
  const navigate = useNavigate();
  const handleDelete = (id) => {
    try {
      fetch(`http://localhost:5000/tasks/deleteTask/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: user?.id,
        }),
      })
        .then((res) => res.json())
        .then((res) => {
          if (res?.success) {
            setAlert(res?.message);
            navigate("/");
            setTasks(res?.tasks);
          } else {
            setAlert(res?.message);
          }
        });
    } catch (error) {
      setAlert(error.message);
    }
  };
  useEffect(() => {
    if (!isLoggedIn()) {
      navigate("/login");
    } else {
      try {
        fetch(`http://localhost:5000/tasks/getTasks/${user.id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((res) => res.json())
          .then((res) => {
            console.log(res);
            if (res?.success) {
              setTasks(res?.tasks);
            }else{
              setTasks([])
            }
            setAlert(res?.message);
          });
      } catch (error) {
        setAlert(error.message);
      }
    }
  }, []);
  return (
    <div className="documentsContainer">
      {tasks.length === 0 ? (
        <>
          <div className="DCheader">
            <h1 className="">
              No tasks created.Create tasks to view them here.
            </h1>
          </div>
        </>
      ) : (
        <>
          {tasks.map((task) => (
            <div className="card" key={task?._id}>
              <h1 className="cardTitle">{task?.title}</h1>
              <hr />
              <p className="cardContent">{task?.description}</p>
              <p className="dueDate">Due date : {task?.dueDate}</p>
              <div className="btnCons">
                <Link
                  className="edit"
                  to={`/edit/${task?._id}`}
                  onClick={() => setTask(task)}
                  style={{ textDecoration: "none" }}
                >
                  Edit
                </Link>
                <button
                  className="dlt"
                  onClick={() => {
                    handleDelete(task?._id);
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default TaskList;
