import React from "react";
import styled from "styled-components";
import { useGame } from "../context/GameContext";

const ScoreContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const TeamsContainer = styled.div`
  display: flex;
  gap: 20px;
`;

const TeamScore = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== "teamColor",
})<{ teamColor?: string }>`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background-color: ${(props) => props.teamColor || "#ddd"};
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  color: white;
`;

const TeamTitle = styled.h3`
  margin: 0;
  font-size: 1.5rem;
  font-weight: bold;
`;

const Score = styled.div`
  font-size: 4rem;
  font-weight: bold;
  line-height: 1;
`;

const GameStatusBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #fff;
  padding: 10px 15px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const QuestionCounter = styled.div`
  font-size: 1.1rem;
  font-weight: bold;
  color: #555;
`;

const ProgressBarContainer = styled.div`
  flex: 1;
  height: 10px;
  background-color: #eee;
  border-radius: 5px;
  margin: 0 15px;
  overflow: hidden;
`;

const ProgressBarFill = styled.div<{ percentage: number }>`
  height: 100%;
  width: ${(props) => `${props.percentage}%`};
  background-color: ${(props) =>
    props.percentage >= 100 ? "#4CAF50" : "#2196F3"};
  border-radius: 5px;
  transition: width 0.3s ease;
`;

const BonusQuestionsIndicator = styled.div`
  background-color: #ff9800;
  color: white;
  font-weight: bold;
  font-size: 0.9rem;
  padding: 5px 10px;
  border-radius: 4px;
  animation: pulse 1.5s infinite;
  margin-left: 10px;

  @keyframes pulse {
    0% {
      opacity: 0.7;
    }
    50% {
      opacity: 1;
    }
    100% {
      opacity: 0.7;
    }
  }
`;

const ScoreBoard: React.FC = () => {
  const { state } = useGame();
  const { team1Score, team2Score, usedQuestions, maxQuestions } = state;

  // Calculate progress percentage
  const progressPercentage = Math.min(
    (usedQuestions.size / maxQuestions) * 100,
    100
  );

  // Check if we're in the bonus questions phase
  const isBonusPhase =
    usedQuestions.size > maxQuestions && team1Score === team2Score;

  return (
    <ScoreContainer>
      <TeamsContainer>
        <TeamScore teamColor="#FF8C00">
          <TeamTitle>Թիմ 1</TeamTitle>
          <Score>{team1Score}</Score>
        </TeamScore>
        <TeamScore teamColor="#4444FF">
          <TeamTitle>Թիմ 2</TeamTitle>
          <Score>{team2Score}</Score>
        </TeamScore>
      </TeamsContainer>

      <GameStatusBar>
        <div style={{ display: "flex", alignItems: "center" }}>
          <QuestionCounter>
            Հարցեր: {usedQuestions.size} / {maxQuestions}
          </QuestionCounter>
          {isBonusPhase && (
            <BonusQuestionsIndicator>ՀԱՎԵԼՅԱԼ ՀԱՐՑԵՐ</BonusQuestionsIndicator>
          )}
        </div>
        <ProgressBarContainer>
          <ProgressBarFill percentage={progressPercentage} />
        </ProgressBarContainer>
      </GameStatusBar>
    </ScoreContainer>
  );
};

export default ScoreBoard;
