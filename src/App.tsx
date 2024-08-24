import React, { useState, useEffect } from "react";
import "./App.css";
import Button from "@mui/material/Button";
import { Container } from "@mui/material";
import ColorPicker from "./components/ColorPicker";

const App: React.FC = () => {
  const [inputValue, setInputValue] = useState<string>("");
  const maxLength = 100;

  const [activeButton, setActiveButton] = useState<string | null>(null);

  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [state, setState] = useState<string>("");
  const [boxes, setBoxes] = useState<Box[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  // Retrieve boxes from local storage on component mount
  useEffect(() => {
    const savedBoxes = localStorage.getItem("boxes");
    if (savedBoxes) {
      try {
        setBoxes(JSON.parse(savedBoxes)); // Parse and set boxes
        console.log("Boxes loaded from local storage:", JSON.parse(savedBoxes));
      } catch (e) {
        console.error("Failed to parse boxes from local storage", e);
      }
    }
  }, []);

  // Save boxes to local storage whenever boxes change
  useEffect(() => {
    if (boxes.length > 0) {
      localStorage.setItem("boxes", JSON.stringify(boxes));
      console.log("Boxes saved to local storage:", boxes);
    }
  }, [boxes]);

  const handleButtonClick = (buttonId: string) => {
    setActiveButton(buttonId);

    if (title && state && content) {
      // Add a new box to the list
      const newBox: Box = { title, state, content };
      setBoxes((prevBoxes) => [...prevBoxes, newBox]);
      // Clear the input fields
      setTitle("");
      setState("");
      setContent("");
    }
  };

  // State for color picker
  const [isColorPickerVisible, setIsColorPickerVisible] =
    useState<boolean>(false);
  const [colorPickerPosition, setColorPickerPosition] = useState<{
    x: number;
    y: number;
  }>({ x: 0, y: 0 });
  const [selectedColor, setSelectedColor] = useState<string>("#ffffff");
  const [bodyTextColor, setBodyTextColor] = useState<string>("#000000");

  const handleColorSquareClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    // Set the position for the ColorPicker and show it
    const rect = event.currentTarget.getBoundingClientRect();
    setColorPickerPosition({ x: rect.left, y: rect.bottom });
    setIsColorPickerVisible(true);
  };

  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
    setBodyTextColor(color);
    setIsColorPickerVisible(false); // Close the color picker after selection
  };
  const handleDelete = (index: number) => {
    setBoxes((prevBoxes) => {
      const updatedBoxes = prevBoxes.filter((_, i) => i !== index);
      localStorage.setItem("boxes", JSON.stringify(updatedBoxes));
      return updatedBoxes;
    });
  };
  interface Box {
    title: string;
    state: string;
    content: string;
  }

  return (
    <div className="container">
      <div className="top">
        <h1 className="top-text">흐름도 만들기</h1>
      </div>
      <div className="middle">
        <div className="left">
          <div className="left-content">
            <div className="buttons">
              <button
                className="추가"
                onClick={() => handleButtonClick("button1")}
                style={{
                  color: activeButton === "button1" ? "white" : "#6200EE",
                  backgroundColor:
                    activeButton === "button1" ? "#6200EE" : "white",
                }}
              >
                + 추가
              </button>

              <button
                className="취소"
                onClick={() => handleButtonClick("button2")}
                style={{
                  color: activeButton === "button2" ? "white" : "#6200EE",
                  backgroundColor:
                    activeButton === "button2" ? "#6200EE" : "white",
                }}
              >
                취소
              </button>
            </div>
            <div className="제목">
              <h1>제목</h1>
              <input
                value={title}
                type="text"
                onChange={(e) => setTitle(e.target.value)}
                maxLength={30}
              />
            </div>
            <div className="제목">
              <h1>상태</h1>
              <select
                style={{
                  width: "147px",
                  height: "25px",
                  border: "none",
                }}
                name=""
                id=""
                value={state}
                onChange={(e) => setState(e.target.value)}
              >
                <option value="진행중">진행중</option>
                <option value="완료">완료</option>
                <option value="대기중">대기중</option>
              </select>
            </div>
            <div className="제목">
              <h1>내용</h1>
              <input
                style={{
                  height: "55px",
                }}
                type="text"
                id="inputField"
                maxLength={100}
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <h1>선 색</h1>
              <button
                style={{
                  width: "30px",
                  height: "30px",
                  backgroundColor: selectedColor,
                  border: "1px solid #000",
                  marginLeft: "10px",
                }}
                onClick={handleColorSquareClick}
              ></button>
              {isColorPickerVisible && (
                <ColorPicker
                  position={colorPickerPosition}
                  handleClick={handleColorSelect}
                />
              )}
            </div>
            <div>
              <h1>배경색</h1>
            </div>
            <div className="border"></div>
            <div className="크기">
              <h1>크기</h1>
              <p className="크기text">
                모든 단계에 동일한 사이즈가 적용 됩니다.
              </p>
            </div>
            <div className="크기size">
              <h1>제목</h1>
              <input type="text" />
            </div>
            <div className="크기size">
              <h1>높이</h1>
              <input type="text" />
            </div>
          </div>
        </div>

        <div className="right-container">
          {boxes.map((box, index) => (
            <div
              className="content"
              style={{ color: bodyTextColor }}
              key={index}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <h3>{box.title}</h3>
                <button onClick={() => handleDelete(index)}>x</button>
              </div>
              <p>
                <strong>State:</strong> {box.state}
              </p>
              <p>
                <strong>Content:</strong> {box.content}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;
