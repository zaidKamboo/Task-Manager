import React, { useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "../store/StateProvider";
import { Link, useNavigate } from "react-router-dom";

const Form = ({ type }) => {
  const navigate = useNavigate();
  const name = useRef();
  const email = useRef();
  const password = useRef();
  const { user, setUser, setAlert, setTasks, task } = useContext(UserContext);
  const [title, setTitle] = useState(task?.title);
  const [description, setDescription] = useState(task?.description);
  const [date, setDate] = useState(task?.dueDate);

  const handleSubmit = (e) => {
    e.preventDefault();
    let em, pa;
    if (type === "Sign up" || type === "Login") {
      em = email.current.value;
      pa = password.current.value;
    }
    try {
      if (type === "Sign up") {
        let nm = name.current.value;
        fetch("http://localhost:5000/users/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: nm, email: em, password: pa }),
        })
          .then((res) => res.json())
          .then((res) => {
            if (res.success) {
              setAlert(res?.message);
              setUser(res?.user);
              navigate("/");
            } else {
              setAlert(res?.message);
            }
          });
      } else if (type === "Login") {
        fetch("http://localhost:5000/users/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: em, password: pa }),
        })
          .then((res) => res.json())
          .then((res) => {
            if (res.success) {
              setAlert(res?.message);
              setUser(res.user);
              navigate("/");
            } else {
              setAlert(res?.message);
            }
          });
      } else if (type === "Create Task") {
        console.log(title, description, date);
        fetch("http://localhost:5000/tasks/addTask", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ title, description, date, id: user.id }),
        })
          .then((res) => res.json())
          .then((res) => {
            console.log(res);
            if (res.success) {
              setTasks(res.tasks);
              setAlert(res?.message);
              setTimeout(() => {
                navigate(`/`);
              }, 1000);
            } else {
              setAlert(res?.message);
            }
          });
      } else if (type === "Edit Task") {
        fetch(`http://localhost:5000/tasks/editTask/${task?._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ title, description, date, id: user.id }),
        })
          .then((res) => res.json())
          .then((res) => {
            console.log(res);
            if (res?.success) {
              setTasks(res?.tasks);
              navigate(`/`);
              setAlert(res?.message);
            } else {
              setAlert(res?.message);
            }
          });
      }
    } catch (error) {
      setAlert(error?.message);
    }
  };
  useEffect(() => {
    if (type === "Create Task") {
      setDate("");
      setTitle("");
      setDescription("");
    }
  }, []);
  return (
    <form
      className="formContainer"
      onSubmit={handleSubmit}
      style={{
        zIndex: `${
          type === "Create Task" || type === "Edit Task" ? "-1" : "2"
        }`,
      }}
    >
      <div className="formDiv">
        <center>
          <h2>Please {type} to continue...</h2>
        </center>
        {type === "Create Task" && (
          <>
            <label className="labels" htmlFor="name">
              Task Name
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              minLength={3}
              maxLength={7}
              required
              className="inputs"
              type="text"
              placeholder="Enter Task name "
            />
            <label className="labels" htmlFor="description">
              Description
            </label>
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="inputs"
              type="text"
              minLength={5}
              placeholder="Enter task description "
            />
            <label className="labels" htmlFor="date">
              Select the Due Date of the task :
            </label>
            <input
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="inputs"
              type="date"
              placeholder="Select task due date"
            />
            <center>
              <input className="btnSub inputs" type="submit" value={type} />
            </center>
          </>
        )}
        {type === "Edit Task" && (
          <>
            <label className="labels" htmlFor="name">
              Task Name
            </label>
            <input
              minLength={3}
              maxLength={7}
              required
              className="inputs"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter Task name "
            />
            <label className="labels" htmlFor="description">
              Description
            </label>
            <input
              required
              className="inputs"
              type="text"
              value={description}
              minLength={5}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter task description "
            />
            <label className="labels" htmlFor="date">
              Select the New Due Date of the task :
            </label>
            <input
              onChange={(e) => setDate(e.target.value)}
              required
              className="inputs"
              type="date"
              placeholder="Select task due date"
            />
            <center>
              <input
                className="btnSub inputs"
                type="submit"
                value="Save Task"
              />
            </center>
          </>
        )}
        {type === "Sign up" && (
          <>
            <label className="labels" htmlFor="name">
              Name
            </label>
            <input
              ref={name}
              minLength={3}
              required
              className="inputs"
              type="text"
              placeholder="Enter your name "
            />
            <label className="labels" htmlFor="email">
              Email
            </label>
            <input
              ref={email}
              required
              className="inputs"
              type="email"
              placeholder="Enter your email "
            />
            <label className="labels" htmlFor="passwords">
              Password
            </label>
            <input
              ref={password}
              required
              className="inputs"
              type="password"
              placeholder="Enter your password "
            />
            <center>
              <input className="btnSub inputs" type="submit" value={type} />
              <Link
                className="btnSub link"
                to={`${type === "Sign up" ? "/login" : "/signup"}`}
              >
                {type === "Sign up" ? "Login " : "Sign up"}
              </Link>
            </center>
          </>
        )}
        {type === "Login" && (
          <>
            <label className="labels" htmlFor="email">
              Email
            </label>
            <input
              ref={email}
              required
              className="inputs"
              type="email"
              placeholder="Enter your email "
            />
            <label className="labels" htmlFor="passwords">
              Password
            </label>
            <input
              ref={password}
              required
              className="inputs"
              type="password"
              placeholder="Enter your password "
            />
            <center>
              <input className="btnSub inputs" type="submit" value={type} />
              <Link
                className="btnSub link"
                to={`${type === "Sign up" ? "/login" : "/signup"}`}
              >
                {type === "Sign up" ? "Login " : "Sign up"}
              </Link>
            </center>
          </>
        )}
      </div>
    </form>
  );
};

export default Form;
