import React from "react";
//import component
import Todo from "./AccountFilter";

const TodoList = ({ todos, setTodos, filteredTodos }) => {
  // console.log(todos);
  return (
    <div className="todo-container">
      <ul className="todo-list">
        {filteredTodos.map((todo) => (
          <Todo
            setTodos={setTodos}
            todos={todos}
            key={todo.id}
            id={todo.id}
            lines={todo.lines}
            text={todo.text}
            todo={todo}
          />
        ))}
      </ul>
    </div>
  );
};

export default TodoList;
