import React from "react";
import styled from "styled-components";
import { useGame } from "./context/GameContext";
import QuestionList from "./components/QuestionList";
import ScoreBoard from "./components/ScoreBoard";
import Timer from "./components/Timer";

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  height: 100vh;
  background-color: #f0f0f0;
`;

const GameArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  flex: 1;
`;

const StartButton = styled.button`
  padding: 20px;
  font-size: 1.5rem;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: #45a049;
    transform: translateY(-2px);
  }
`;

const App: React.FC = () => {
  const { state, dispatch } = useGame();
  const { isGameActive } = state;

  const handleStartGame = () => {
    dispatch({ type: "START_GAME" });
  };

  if (!isGameActive) {
    return (
      <AppContainer>
        <StartButton onClick={handleStartGame}>Սկսել Խաղը</StartButton>
      </AppContainer>
    );
  }

  return (
    <AppContainer>
      <ScoreBoard />
      <GameArea>
        <Timer />
        <QuestionList />
      </GameArea>
    </AppContainer>
  );
};

export default App;
