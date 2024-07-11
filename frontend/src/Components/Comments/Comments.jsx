import { useState, useEffect } from "react";
import "./Comments.css";

function Comments({ taskId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [displayCount, setDisplayCount] = useState(2);
  const [loading, setLoading] = useState(false);

  async function fetchComments() {
    try {
      const response = await fetch(
        `http://localhost:3000/tasks/${taskId}/comments`,
        {
          credentials: "include",
        }
      );
      const data = await response.json();
      setComments(data || []);
    } catch (error) {
      console.error("Error fetching comments", error);
      setComments(p);
    }
  }

  useEffect(() => {
    fetchComments();
  }, [taskId]);

  async function handleAddComment(event) {
    event.preventDefault();
    if (newComment.trim() === "") {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3000/tasks/${taskId}/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ content: newComment }),
          credentials: "include",
        }
      );
      const data = await response.json();
      //   setComments([...comments, data]);

      setNewComment("");
      fetchComments();
    } catch (error) {
      console.error("Error adding comment: ", error);
    }
  }

  function loadMoreComments() {
    setLoading(true);
    setTimeout(() => {
      setDisplayCount(displayCount + 2);
      setLoading(false);
    }, 500);
  }

  function showLessComments() {
    setDisplayCount(2);
  }

  function getCommenterInitials(user) {
    const nameParts = user.split(" ");
    const firstName = nameParts[0];
    const lastName =
      nameParts.length > 1 ? nameParts[nameParts.length - 1] : "";
    const initials = `${firstName.charAt(0).toUpperCase()}${lastName
      .charAt(0)
      .toUpperCase()}`;
    return initials;
  }

  async function handleDeleteComment(commentId) {
    try {
      const response = await fetch(
        `http://localhost:3000/comments/${commentId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (response.ok) {
        setComments(comments.filter((comment) => comment.id !== commentId));
      } else {
        console.error("Error deleting comments:", await response.json());
      }
    } catch (err) {
      console.error("Error dleting comment:", err);
    }
  }

  return (
    <div className="comments-section">
      <h3>Comments</h3>
      <form onSubmit={handleAddComment}>
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment"
        />
        <button type="submit">Add Comment</button>
      </form>
      <div className="comments-list">
        {comments.slice(0, displayCount).map((comment, index) => (
          <div key={index} className="comment">
            <div className="comment-icon">
              <p className="commenter-initials">
                {getCommenterInitials(comment.user ? comment.user.name : "")}
              </p>
              <p>{comment.content}</p>
            </div>

            <i
              onClick={() => handleDeleteComment(comment.id)}
              className="fa-regular fa-trash-can"
            ></i>
          </div>
        ))}
      </div>
      {comments.length > displayCount && (
        <button onClick={loadMoreComments} disabled={loading}>
          {loading ? "Loading..." : "Load More"}
        </button>
      )}
      {displayCount > 2 && (
        <button onClick={showLessComments}>Show Less</button>
      )}
    </div>
  );
}

export default Comments;
