import React from "react";
import Button from "./Button";
import { FooterBarWrapper, FooterBarWrapperButtonWrapper } from "./styles";

interface Props {
  handleToggle: () => void;
  handleKill: () => void;
}

export default function FooterBar({ handleToggle, handleKill }: Props) {
  return (
    <FooterBarWrapper>
      <FooterBarWrapperButtonWrapper right>
        <Button toggleFeed onClick={handleToggle} text={"Toggle Feed"} />
      </FooterBarWrapperButtonWrapper>
      <FooterBarWrapperButtonWrapper>
        <Button onClick={handleKill} text={"Kill Stream"} />
      </FooterBarWrapperButtonWrapper>
    </FooterBarWrapper>
  );
}
