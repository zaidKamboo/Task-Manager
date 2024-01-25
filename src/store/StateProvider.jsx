import { createContext, useReducer, useState } from "react";

export const UserContext = createContext({
  user: {},
  task: {},
  tasks: [],
  alert: Boolean,

  setTask: () => {},
  setTasks: () => {},
  signup: () => {},
  login: () => {},
  logout: () => {},
});

const userReducer = (user, action) => {
  let newUser = user;

  switch (action.type) {
    case "LOGOUT":
      newUser = {};
      return newUser;
    case "SET_USER":
      newUser = action.payload;
      return newUser;
    default:
      return newUser;
  }
};

const taskReducer = (task, action) => {
  let newTask = task;
  switch (action.type) {
    case "SET_TASK":
      newTask = action.payload.task;
      return newTask;
    default:
      return newTask;
  }
};

const tasksReducer = (tasks, action) => {
  let newTasks = tasks;
  switch (action.type) {
    case "SET_TASKS":
      newTasks = action.payload.tasks;
      return newTasks;
    case "RESET_TASKS":
      newTasks = [];
      return newTasks;
    default:
      return newTaaks;
  }
};

const StatesProvider = ({ children }) => {
  const [user, dispatchUser] = useReducer(userReducer, false);
  const [task, dispatchTask] = useReducer(taskReducer, []);
  const [tasks, dispatchTasks] = useReducer(tasksReducer, []);
  const [alert, setAlert] = useState(null);

  const setUser = (user) => {
    dispatchUser({ type: "SET_USER", payload: user });
  };
  const setTask = (task) => {
    dispatchTask({ type: "SET_TASK", payload: { task } });
  };

  const setTasks = (tasks) => {
    dispatchTasks({ type: "SET_TASKS", payload: { tasks } });
  };

  const logout = () => {
    dispatchUser({ type: "LOGOUT" });
    dispatchTasks({ type: "RESET_TASKS" });
  };

  const isLoggedIn = () => {
    if (user !== false) {
      return true;
    }
    return false;
  };
  return (
    <UserContext.Provider
      value={{
        user,
        task,
        alert,
        tasks,
        setTasks,
        setUser,
        isLoggedIn,
        logout,
        setTask,
        setAlert,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default StatesProvider;
