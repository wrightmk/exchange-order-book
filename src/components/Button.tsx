import React from "react";
import { ButtonWrapper } from "./styles";

interface Props {
  onClick: () => void;
  text: string;
  toggleFeed?: boolean;
}

export default function Button({ onClick, text, toggleFeed }: Props) {
  return (
    <ButtonWrapper toggleFeed={toggleFeed} onClick={onClick}>
      {text}
    </ButtonWrapper>
  );
}
