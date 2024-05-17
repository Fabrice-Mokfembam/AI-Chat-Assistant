import { useState } from "react";
import { AiOutlineRobot } from "react-icons/ai";
import { BiBrain } from "react-icons/bi";
import { FaBook } from "react-icons/fa";
import { IoSchoolOutline } from "react-icons/io5";
import { GiBrain } from "react-icons/gi";
import "./index.scss";
import axios from "axios";

const icon1 = <BiBrain className="icon" />;
const icon2 = <AiOutlineRobot className="icon" />;
const icon3 = <FaBook className="icon" />;
const icon4 = <IoSchoolOutline className="icon" />;

function QuestionBox({ setQuestion, question, icon }) {
  return (
    <div
      className="question-box"
      onClick={() => {
        setQuestion(question);
      }}
    >
      <p>{question}</p>
      <div className="question-icon-container">{icon}</div>
    </div>
  );
}

function App() {
  const [showbox, setShowBox] = useState(false);
  const [question, setQuestion] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [error, setError] = useState("");

  async function submit(e) {
    e.preventDefault();
    if (!question || question === " ") {
      alert("empty input");
      return;
    }
    setShowBox(true);

    try {
      const body = {
        history: chatHistory,
        message: question,
      };

      const { data } = await axios.post("http://localhost:5000/ThiagoAI", body);
      console.log(data);

      setChatHistory((prevChatHistory) => [
        ...prevChatHistory,
        {
          role: "user",
          parts: [{ text: question }], 
        },
        {
          role: "model",
          parts: [{ text: data.message }], 
        },
      ]);

      setQuestion("");
    } catch (error) {
      console.log("error");
      alert("something went wrong");
    }
  }

  return (
    <div className="main-container">
      <div className="section-head">
        <div className="head-icon">
          <GiBrain className="icon" />
        </div>
        ThiagoAI
      </div>
      <div className={`section-intro  ${showbox ? " notActive" : ""}`}>
        <h1>Hello There</h1>
        <div>Welcome to the wonderful world of ThiagoAI!</div>
        <div className="questions-box-section">
          <h4>
            How can I assist you today?{question}
            <div className="question-boxes">
              <QuestionBox
                setQuestion={setQuestion}
                question="What is the largest state in America?"
                icon={icon4}
              />
              <QuestionBox
                setQuestion={setQuestion}
                question="What is the capital of France?"
                icon={icon2}
              />
              <QuestionBox
                setQuestion={setQuestion}
                question="Who is the most prominent figure?"
                icon={icon1}
              />
              <QuestionBox
                setQuestion={setQuestion}
                question="Who painted the Mona Lisa?"
                icon={icon3}
              />
            </div>
          </h4>
        </div>
      </div>

      <div className={`answers-box ${showbox ? " active" : ""}`}>
        {chatHistory.map((item, index) => {
          return (
            <div key={index}>
              {item.role === "user" ? "user" : "ThiagoAI"}
              <p>{item.parts.map(part => part.text).join(" ")}</p>
            </div>
          );
        })}
      </div>

      <form onSubmit={submit}>
        <div>
          <input
            type="text"
            placeholder="Enter a prompt here"
            value={question}
            onChange={(e) => {
              setQuestion(e.target.value);
            }}
            className={`${error ? "error" : ""}`}
          />
          <button type="submit">send</button>
        </div>
      </form>
    </div>
  );
}

export default App;
