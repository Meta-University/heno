import { useState, useEffect } from "react";

function AddTeamMembers(props) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);

  useEffect(() => {
    if (query) {
      fetch(`http://localhost:3000/users/search?query=${query}`)
        .then((response) => response.json())
        .then((data) => setSuggestions(data));
    } else {
      setSuggestions([]);
    }
  }, [query]);

  function handleAddMember(user) {
    setSelectedMembers([...selectedMembers, user]);
    props.onTeamMemberAdded(user);
    setQuery("");
    setSuggestions([]);
  }

  return (
    <div className="add-team-members">
      <input
        type="text"
        placeholder="Add Team mates"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <ul>
        {suggestions.map((user) => (
          <li key={user.id} onClick={() => handleAddMember(user)}>
            {user.name} ({user.email})
          </li>
        ))}
      </ul>
      <div>
        <ul>
          {selectedMembers.map((member) => (
            <li key={member.id}>{member.name}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default AddTeamMembers;
