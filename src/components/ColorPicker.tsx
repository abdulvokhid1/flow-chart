import * as React from "react";
import styled from "@emotion/styled";

const Ul = styled.ul<{ x: number; y: number }>`
  padding: 10px;
  display: flex;
  width: 190px;
  flex-wrap: wrap;
  gap: 10px;
  border: 1px solid #000;
  position: fixed;
  background-color: #fff;
  top: ${(props) => props.y}px;
  left: ${(props) => props.x}px;
  z-index: 10;
`;
const ColorButton = styled.button<{ color: string; type: "button" }>`
  width: 30px;
  height: 30px;
  background-color: ${(props) => props.color};
  border: 0;
`;
type colorPickerType = {
  position: { x: number; y: number };
  handleClick: (color: string) => void;
};
export default function ColorPicker({
  position,
  handleClick,
}: colorPickerType) {
  const colors = [
    "#CED4DA",
    "#868E96",
    "#FA5252",
    "#BE4BDB",
    "#4C6EF5",
    "#228BE6",
    "#22B8CF",
    "#12B886",
    "#82C91E",
    "#FCC419",
  ];

  return (
    <Ul x={position.x} y={position.y}>
      {colors.map((color) => (
        <li key={color}>
          <ColorButton
            type={"button"}
            color={color}
            onClick={() => {
              handleClick(color);
            }}
          ></ColorButton>
        </li>
      ))}
    </Ul>
  );
}
