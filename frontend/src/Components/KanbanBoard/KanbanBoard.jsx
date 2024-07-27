import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import "./KanbanBoard.css";
import { useParams } from "react-router-dom";

function categorizeTasks(tasks) {
  return {
    TODO: tasks.filter((task) => task.status === "TODO"),
    IN_PROGRESS: tasks.filter((task) => task.status === "IN_PROGRESS"),
    COMPLETED: tasks.filter((task) => task.status === "COMPLETED"),
  };
}

const onDragEnd = (result, columns, setColumns) => {
  if (!result.destination) return;
  const { source, destination } = result;

  if (source.droppableId !== destination.droppableId) {
    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];
    const sourceItems = [...sourceColumn.items];
    const destItems = [...destColumn.items];
    const [removed] = sourceItems.splice(source.index, 1);
    destItems.splice(destination.index, 0, removed);
    setColumns({
      ...columns,
      [source.droppableId]: {
        ...sourceColumn,
        items: sourceItems,
      },
      [destination.droppableId]: {
        ...destColumn,
        items: destItems,
      },
    });
  } else {
    const column = columns[source.droppableId];
    const copiedItems = [...column.items];
    const [removed] = copiedItems.splice(source.index, 1);
    copiedItems.splice(destination.index, 0, removed);
    setColumns({
      ...columns,
      [source.droppableId]: {
        ...column,
        items: copiedItems,
      },
    });
  }
};

function KanbanBoard() {
  const [columns, setColumns] = useState({
    TODO: { name: "To Do", items: [] },
    IN_PROGRESS: { name: "In Progress", items: [] },
    COMPLETED: { name: "Completed", items: [] },
  });
  const [tasks, setTasks] = useState([]);
  const { id } = useParams();

  async function fetchProject() {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/projects/${id}`
      );
      const data = await response.json();
      setTasks(data.project.tasks || []);
    } catch (error) {
      console.error("Error fetching projects", error);
    }
  }

  fetchProject();
  useEffect(() => {
    const categorizedTasks = categorizeTasks(tasks);
    setColumns({
      TODO: { name: "To Do", items: categorizedTasks.TODO },
      IN_PROGRESS: { name: "In Progress", items: categorizedTasks.IN_PROGRESS },
      COMPLETED: { name: "Completed", items: categorizedTasks.COMPLETED },
    });
  }, [tasks]);

  return (
    <div className="kanban-board">
      <DragDropContext
        onDragEnd={(result) => onDragEnd(result, columns, setColumns)}
      >
        {Object.entries(columns).map(([columnId, column], index) => {
          return (
            <div className="column" key={columnId}>
              <h2>{column.name}</h2>
              <Droppable droppableId={columnId} key={columnId}>
                {(provided, snapshot) => (
                  <div
                    className="task-list"
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    style={{
                      background: snapshot.isDraggingOver
                        ? "lightblue"
                        : "lightgrey",
                      padding: 4,
                      width: 250,
                      minHeight: 500,
                    }}
                  >
                    {column.items.map((item, index) => (
                      <Draggable
                        key={item.id}
                        draggableId={item.id.toString()}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="task-item"
                            style={{
                              userSelect: "none",
                              padding: 16,
                              margin: "0 0 8px 0",
                              minHeight: "50px",
                              backgroundColor: snapshot.isDragging
                                ? "#263B4A"
                                : "#456C86",
                              color: "white",
                              ...provided.draggableProps.style,
                            }}
                          >
                            {item.title}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          );
        })}
      </DragDropContext>
    </div>
  );
}

export default KanbanBoard;
