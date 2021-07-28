import React from "react";
import { DropdownSelect } from "./styles";

interface Props {
  onChange: (arg0: number) => void;
  value: number;
  options: number[];
}

export default function Dropdown({ onChange, value, options }: Props) {
  return (
    <div>
      <DropdownSelect
        name="dropdown"
        id="dropdown"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      >
        {options.map((val) => {
          return (
            <option key={val} value={val}>
              Group: {val}
            </option>
          );
        })}
      </DropdownSelect>
    </div>
  );
}
