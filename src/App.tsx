import React, { useState, useEffect } from "react";
import "./App.css";
import Button from "@mui/material/Button";
import { Container } from "@mui/material";
import ColorPicker from "./components/ColorPicker";

interface Box {
  title: string;
  state: string;
  content: string;
  width: number;
  height: number;
  color: string;
}

const App: React.FC = () => {
  const [inputValue, setInputValue] = useState<string>("");
  const maxLength = 100;

  const [activeButton, setActiveButton] = useState<string | null>(null);

  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [state, setState] = useState<string>("");
  const [boxes, setBoxes] = useState<Box[]>([]);
  const [width, setWidth] = useState<number>(212); // Default width
  const [height, setHeight] = useState<number>(129); // Default height

  // State for color picker
  const [isColorPickerVisible, setIsColorPickerVisible] =
    useState<boolean>(false);
  const [colorPickerPosition, setColorPickerPosition] = useState<{
    x: number;
    y: number;
  }>({ x: 0, y: 0 });
  const [selectedColor, setSelectedColor] = useState<string>("#868E96"); // Color for new boxes

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
    // Load the saved color
    const savedColor = localStorage.getItem("selectedColor");
    if (savedColor) {
      setSelectedColor(savedColor);
    }
  }, []);

  // Save boxes to local storage whenever boxes change
  useEffect(() => {
    if (boxes.length > 0) {
      localStorage.setItem("boxes", JSON.stringify(boxes));
      console.log("Boxes saved to local storage:", boxes);
    }
  }, [boxes]);

  // Save selected color to local storage when it changes
  useEffect(() => {
    localStorage.setItem("selectedColor", selectedColor);
  }, [selectedColor]);

  const handleButtonClick = (buttonId: string) => {
    setActiveButton(buttonId);

    if (title && state && content) {
      // Add a new box to the list
      const newBox: Box = {
        title,
        state,
        content,
        width,
        height,
        color: selectedColor,
      };
      setBoxes((prevBoxes) => [...prevBoxes, newBox]);
      // Clear the input fields
      setTitle(title);
      setState(state);
      setContent(content);
      setWidth(width); // Reset width
      setHeight(height); // Reset height
      setSelectedColor("#868E96"); //Reset color
    } else {
      alert("All fields are required.");
    }
  };

  const handleButtonCancel = (buttonId: string) => {
    setActiveButton(buttonId);

    if (title && state && content) {
      // Add a new box to the list
      // Clear the input fields
      setTitle("");
      setState("");
      setContent("");
    }
  };

  const handleColorSquareClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setColorPickerPosition({ x: rect.left, y: rect.bottom });
    setIsColorPickerVisible(true);
  };

  const handleColorSelect = (color: string) => {
    setSelectedColor(color); // Set the selected color for new boxes
    setIsColorPickerVisible(false);
  };

  const handleDelete = (index: number) => {
    setBoxes((prevBoxes) => {
      const updatedBoxes = prevBoxes.filter((_, i) => i !== index);
      localStorage.setItem("boxes", JSON.stringify(updatedBoxes));
      return updatedBoxes;
    });
  };

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
                + add
              </button>

              <button
                className="취소"
                onClick={() => handleButtonCancel("button2")}
                style={{
                  color: activeButton === "button2" ? "white" : "#6200EE",
                  backgroundColor:
                    activeButton === "button2" ? "#6200EE" : "white",
                }}
              >
                cancel{" "}
              </button>
            </div>
            <div className="제목">
              <h1>title</h1>
              <input
                value={title}
                type="text"
                onChange={(e) => setTitle(e.target.value)}
                maxLength={30}
              />
            </div>
            <div className="제목">
              <h1>action</h1>
              <select
                style={{
                  width: "172px",
                  height: "32px",
                  border: "none",
                }}
                name=""
                id=""
                value={state}
                onChange={(e) => setState(e.target.value)}
              >
                <option value=""></option>
                <option value="진행중">proceeding</option>
                <option value="완료">done</option>
                <option value="대기중">waiting</option>
              </select>
            </div>
            <div className="제목">
              <h1>content</h1>
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
              <h1>color</h1>
              <button
                style={{
                  width: "30px",
                  height: "30px",
                  background: selectedColor,
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
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <h1>backgroundColor</h1>
              <button
                style={{
                  width: "30px",
                  height: "30px",
                  backgroundColor: "#CED4DA",
                  border: "1px solid #000",
                  marginLeft: "10px",
                }}
                // onClick={handleColorSquareClick}
              ></button>
              {/* {isColorPickerVisible && (
                <ColorPicker
                  position={colorPickerPosition}
                  handleClick={handleColorSelect}
                />
              )} */}
            </div>
            <div className="border"></div>
            <div className="크기">
              <h1>size</h1>
              <p className="크기text">
                모든 단계에 동일한 사이즈가 적용 됩니다.
              </p>
            </div>
            <div className="크기size">
              <h1>width</h1>
              <input
                type="number"
                placeholder="Width (max 1000)"
                value={width}
                onChange={(e) => {
                  const value = parseInt(e.target.value, 10);
                  setWidth(value > 1000 ? 1000 : value);
                }}
                max={1000}
              />
            </div>
            <div className="크기size">
              <h1>height</h1>
              <input
                type="number"
                placeholder="Height (max 1000)"
                value={height}
                onChange={(e) => {
                  const value = parseInt(e.target.value, 10);
                  setHeight(value > 1000 ? 1000 : value);
                }}
                max={1000}
              />
            </div>
          </div>
        </div>

        <div className="right-container">
          {boxes.map((box, index) => (
            <div
              className="content"
              style={{
                width: `${box.width}px`,
                height: `${box.height}px`,
                color: box.color,
                // background: "#CED4DA",
              }}
              key={index}
            >
              <div
                style={{
                  background: box.color,
                }}
                className="bodytitle"
              >
                {box.state === "대기중" ? (
                  <img src="./img/ic-waiting.svg" alt="" />
                ) : (
                  <img src="./img/ic-proceeding.svg" alt="" />
                )}
                <h3>{box.state}</h3>
                <button onClick={() => handleDelete(index)}>x</button>
              </div>
              <p>
                <strong>State:</strong> {box.state}
              </p>
              <p>{box.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;
