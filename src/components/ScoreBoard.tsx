import React from "react";
import styled from "styled-components";
import { useGame } from "../context/GameContext";

const ScoreContainer = styled.div`
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

const ScoreBoard: React.FC = () => {
  const { state } = useGame();
  const { team1Score, team2Score } = state;

  return (
    <ScoreContainer>
      <TeamScore teamColor="#FF8C00">
        <TeamTitle>Թիմ 1</TeamTitle>
        <Score>{team1Score}</Score>
      </TeamScore>
      <TeamScore teamColor="#4444FF">
        <TeamTitle>Թիմ 2</TeamTitle>
        <Score>{team2Score}</Score>
      </TeamScore>
    </ScoreContainer>
  );
};

export default ScoreBoard;
