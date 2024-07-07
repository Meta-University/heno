import { UserContext } from "../../UserContext";
import { useContext, useState } from "react";
import "./HomePage.css";
import HomeTasks from "../HomeTasks/HomeTasks";
import HomeProjects from "../HomeProjects/HomeProjects";

function HomePage() {
  const { user, updateUser } = useContext(UserContext);
  const nameParts = user.name.split(" ");
  const firstName = nameParts[0];
  const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : "";
  const fullName = `${firstName.charAt(0).toUpperCase()}${firstName.slice(
    1
  )} ${lastName.charAt(0).toUpperCase()}${lastName.slice(1)}`;

  return (
    <div className="homepage">
      <h1>Welcome back, {fullName}!</h1>
      <HomeTasks />
      <HomeProjects />
    </div>
  );
}

export default HomePage;
