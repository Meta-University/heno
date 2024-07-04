import { UserContext } from "../../UserContext";
import { useContext, useState } from "react";
import "./HomePage.css";
import HomeTasks from "../HomeTasks/HomeTasks";
import HomeProjects from "../HomeProjects/HomeProjects";

function HomePage() {
  const { user, updateUser } = useContext(UserContext);

  return (
    <div className="homepage">
      <h1>Welcome back, {user.name}!</h1>
      <HomeTasks />
      <HomeProjects />
    </div>
  );
}

export default HomePage;
