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
  background: string;
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
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

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

  const handleButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    const buttonId = (event.currentTarget as HTMLButtonElement).id;

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
        background: "#CED4DA",
      };
      setBoxes((prevBoxes) => [...prevBoxes, newBox]);
      // Clear the input fields
      setTitle("");
      setState("");
      setContent("");
      setWidth(212); // Reset width
      setHeight(129); // Reset height
      setSelectedColor("#868E96"); // Reset color
      setSelectedIndex(null); // Reset selected index
    } else {
      alert("모든 필드가 필수입니다.");
    }
  };

  const handleStepClick = (index: number) => {
    setSelectedIndex(index);
    setTitle(boxes[index].title);
    setState(boxes[index].state);
    setContent(boxes[index].content);
    setWidth(boxes[index].width);
    setHeight(boxes[index].height);
    setSelectedColor(boxes[index].color);
  };

  const handleButtonCancel = (buttonId: string) => {
    setActiveButton(buttonId);

    if (title && state && content) {
      // Clear the input fields
      setTitle("");
      setState("");
      setContent("");
      setWidth(212); // Reset width
      setHeight(129); // Reset height
      setSelectedColor("#868E96"); // Reset color
      setSelectedIndex(null); // Reset selected index
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

  const getIconForState = (state: string) => {
    switch (state) {
      case "진행중":
        return "./img/ic-proceeding.svg"; // Icon for "In Progress"
      case "완료":
        return "./img/ic-complete.svg"; // Icon for "Completed"
      case "대기중":
        return "./img/ic-waiting.svg"; // Icon for "Pending"
      default:
        return ""; // Default or fallback icon if needed
    }
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
                onClick={handleButtonClick}
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
                onClick={() => handleButtonCancel("button2")}
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
              <p>제목</p>
              <input
                value={title}
                type="text"
                onChange={(e) => setTitle(e.target.value)}
                maxLength={30}
              />
            </div>
            <div className="제목">
              <p>상태</p>
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
                <option value="진행중">진행중</option>
                <option value="완료">완료</option>
                <option value="대기중">대기중</option>
              </select>
            </div>
            <div className="제목">
              <p>내용</p>
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
              <p>선 색</p>
              <button
                style={{
                  width: "30px",
                  height: "30px",
                  background: selectedColor,
                  border: "none",
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
              <p>배경색</p>
              <button
                style={{
                  width: "30px",
                  height: "30px",

                  backgroundColor: "#CED4DA",
                  border: "none",
                  marginLeft: "10px",
                }}
              ></button>
            </div>
            <div className="border"></div>
            <div className="크기">
              <p>크기</p>
              <p className="크기text">
                모든 단계에 동일한 사이즈가 적용 됩니다.
              </p>
            </div>
            <div className="크기size">
              <p>넓이</p>
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
              <p>높이</p>
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
              key={index}
              className={`content ${selectedIndex === index ? "selected" : ""}`}
              style={{
                width: `${box.width}px`,
                height: `${box.height}px`,
                boxShadow:
                  selectedIndex === index
                    ? "0 0 10px 12px #a4faff" // Red shadow for selected box
                    : "0 0 5px 1px #CED4DA",
                position: "relative",
              }}
              onClick={() => handleStepClick(index)}
            >
              {index < boxes.length - 1 && (
                <div
                  style={{
                    position: "absolute",
                    right: "-20px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    border: "solid #6200EE",
                    borderWidth: "5px 0 5px 5px",
                    borderColor: "transparent transparent transparent #6200EE",
                    width: 0,
                    height: 0,
                  }}
                ></div>
              )}
              <div
                className="title-part"
                style={{
                  background: box.background,
                  color: box.color,
                }}
              >
                <div className="title-icon">
                  <img src={getIconForState(box.state)} alt="" />
                  <h3>{box.state}</h3>
                </div>
                <div>
                  <button
                    className="icon-btn"
                    onClick={() => handleDelete(index)}
                  >
                    <p>x</p>
                  </button>
                </div>
              </div>
              <div className="title-content">
                <p
                  style={{
                    color: box.color,
                  }}
                >
                  {box.content}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;
