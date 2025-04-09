import React, { useState } from "react";
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

const StartScreen = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  height: 100%;
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
  width: 300px;

  &:hover {
    background-color: #45a049;
    transform: translateY(-2px);
  }
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 20px;
`;

const Label = styled.label`
  font-size: 1.2rem;
  color: #333;
`;

const NumberInput = styled.input`
  padding: 12px;
  font-size: 1.2rem;
  border: 2px solid #ddd;
  border-radius: 8px;
  width: 120px;
  text-align: center;
  &:focus {
    outline: none;
    border-color: #4caf50;
  }
`;

const App: React.FC = () => {
  const { state, dispatch } = useGame();
  const { isGameActive, isLoading, maxQuestions } = state;
  const [questionsLimit, setQuestionsLimit] = useState(maxQuestions);

  const handleStartGame = () => {
    // Set the max questions first
    dispatch({ type: "SET_MAX_QUESTIONS", payload: questionsLimit });
    // Then start the game
    dispatch({ type: "START_GAME" });
  };

  const handleQuestionsLimitChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      setQuestionsLimit(value);
    }
  };

  if (isLoading) {
    return (
      <AppContainer>
        <div style={{ textAlign: "center", padding: "20px" }}>
          Loading game data...
        </div>
      </AppContainer>
    );
  }

  if (!isGameActive) {
    return (
      <AppContainer>
        <StartScreen>
          <InputContainer>
            <Label>Maximum Questions:</Label>
            <NumberInput
              type="number"
              min="1"
              value={questionsLimit}
              onChange={handleQuestionsLimitChange}
            />
          </InputContainer>
          <StartButton onClick={handleStartGame}>Սկսել Խաղը</StartButton>
        </StartScreen>
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
