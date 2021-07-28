import React from "react";
import Button from "./Button";

interface Props {
  handleToggle: () => void;
  handleKill: () => void;
}

export default function FooterBar({ handleToggle, handleKill }: Props) {
  return (
    <div>
      <Button toggleFeed onClick={handleToggle} text={"Toggle Feed"} />
      <Button onClick={handleKill} text={"Kill Stream"} />
    </div>
  );
}
