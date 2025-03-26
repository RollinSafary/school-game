import React from "react";
import styled from "styled-components";
import { useGame } from "../context/GameContext";

const TimerContainer = styled.div`
  text-align: center;
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const TimerDisplay = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== "isLow",
})<{ isLow?: boolean }>`
  font-size: 3rem;
  font-weight: bold;
  color: ${(props) => (props.isLow ? "#f44336" : "#2196f3")};
  transition: color 0.3s ease;
`;

const TimerLabel = styled.div`
  font-size: 1.2rem;
  color: #666;
  margin-top: 10px;
`;

const Timer: React.FC = () => {
  const { state } = useGame();
  const { timer, currentQuestion } = state;

  if (!currentQuestion) return null;

  return (
    <TimerContainer>
      <TimerDisplay isLow={timer <= 10}>{timer}</TimerDisplay>
      <TimerLabel>Վայրկյան</TimerLabel>
    </TimerContainer>
  );
};

export default Timer;
