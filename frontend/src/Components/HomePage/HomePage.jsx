import { UserContext } from "../../UserContext";
import { useContext } from "react";
import ProjectList from "../ProjectList/ProjectList";

function HomePage() {
  const { user, updateUser } = useContext(UserContext);
  return (
    <div>
      <h1>Welcome back, {user.name}!</h1>

      <div>
        <h3>Projects</h3>
        {/* <ProjectList /> */}
      </div>

      <div>
        <h3>Upcoming tasks</h3>
      </div>
    </div>
  );
}

export default HomePage;
