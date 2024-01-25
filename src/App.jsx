import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Alert from "./Components/Alert";
import Footer from "./Components/Footer";
import Navbar from "./Components/Navbar";
import TaskList from "./Components/TaskList";
import StatesProvider, { UserContext } from "./store/StateProvider";
import Form from "./Components/Form";
import { useContext } from "react";
function App() {
  const { alert } = useContext(UserContext);
  return (
    <StatesProvider>
      <Router>
        {alert && <Alert />}

        <Navbar />
        <Routes>
          <Route exact path="/" Component={TaskList} />
          <Route exact path="/login" element={<Form type="Login" />} />
          <Route exact path="/signup" element={<Form type="Sign up" />} />
          <Route exact path="/edit/:id" element={<Form type="Edit Task" />} />
          <Route
            exact
            path="/createTask"
            element={<Form type="Create Task" />}
          />
        </Routes>
        <Footer />
      </Router>
    </StatesProvider>
  );
}

export default App;
