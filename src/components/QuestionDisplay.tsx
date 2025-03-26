import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import { useGame } from "../context/GameContext";

const DisplayContainer = styled.div`
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Question = styled.h2`
  margin: 0;
  color: #333;
  font-size: 1.5rem;
  text-align: center;
`;

const OptionsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
`;

const Option = styled.button.withConfig({
  shouldForwardProp: (prop) => prop !== "isTeam1" && prop !== "isTeam2",
})<{ isTeam1?: boolean; isTeam2?: boolean }>`
  padding: 15px;
  border: 2px solid
    ${(props) => {
      if (props.isTeam1 && props.isTeam2) return "#FF8C00";
      if (props.isTeam1) return "#FF8C00";
      if (props.isTeam2) return "#4444FF";
      return "#ddd";
    }};
  border-radius: 8px;
  background: ${(props) => {
    if (props.isTeam1 && props.isTeam2) {
      return "linear-gradient(135deg, #FFF3E0 0%, #E3F2FD 100%)";
    }
    if (props.isTeam1) return "#FFF3E0";
    if (props.isTeam2) return "#E3F2FD";
    return "white";
  }};
  color: #333;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
`;

const NoQuestion = styled.div`
  text-align: center;
  color: #666;
  font-size: 1.2rem;
  padding: 40px;
`;

const TeamIndicator = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 20px;
`;

const TeamButton = styled.button.withConfig({
  shouldForwardProp: (prop) => prop !== "isActive" && prop !== "teamColor",
})<{ isActive?: boolean; teamColor?: string }>`
  padding: 10px 20px;
  border: 2px solid ${(props) => props.teamColor || "#ddd"};
  border-radius: 4px;
  background-color: ${(props) => (props.isActive ? props.teamColor : "white")};
  color: ${(props) => (props.isActive ? "white" : props.teamColor || "#ddd")};
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: ${(props) => props.teamColor || "#ddd"};
    color: white;
  }
`;

interface Option {
  title: string;
  description?: string;
  audioUrl: string;
}

const QuestionDisplay: React.FC = () => {
  const { state, dispatch } = useGame();
  const { currentQuestion, team1Answer, team2Answer } = state;
  const [activeTeam, setActiveTeam] = React.useState<1 | 2>(1);

  useEffect(() => {
    if (!currentQuestion) return;

    const playAudioSequence = async () => {
      try {
        // Play category audio
        const categoryAudio = new Audio(
          `/speech/category-${currentQuestion.categoryId}.wav`
        );
        await new Promise<void>((resolve) => {
          categoryAudio.onended = () => resolve();
          categoryAudio.onerror = () => resolve(); // Skip on error
          categoryAudio.play().catch(() => resolve()); // Catch and continue if play fails
        });

        // Play question audio
        const questionAudio = new Audio(currentQuestion.audioUrl);
        await new Promise<void>((resolve) => {
          questionAudio.onended = () => resolve();
          questionAudio.onerror = () => resolve();
          questionAudio.play().catch(() => resolve());
        });

        // Play options audio sequentially
        for (const option of currentQuestion.options) {
          const optionAudio = new Audio(option.audioUrl);
          await new Promise<void>((resolve) => {
            optionAudio.onended = () => resolve();
            optionAudio.onerror = () => resolve();
            optionAudio.play().catch(() => resolve());
          });
        }
      } catch (error) {
        console.log("Audio playback error:", error);
      }
    };

    playAudioSequence();
  }, [currentQuestion]);

  const handleOptionSelect = (optionIndex: number) => {
    dispatch({
      type: "SET_TEAM_ANSWER",
      payload: { team: activeTeam, answer: optionIndex },
    });
  };

  if (!currentQuestion) {
    return (
      <DisplayContainer>
        <NoQuestion>Ընտրեք հարցը սկսելու համար</NoQuestion>
      </DisplayContainer>
    );
  }

  return (
    <DisplayContainer>
      <TeamIndicator>
        <TeamButton
          isActive={activeTeam === 1}
          teamColor="#FF8C00"
          onClick={() => setActiveTeam(1)}
        >
          Թիմ 1
        </TeamButton>
        <TeamButton
          isActive={activeTeam === 2}
          teamColor="#4444FF"
          onClick={() => setActiveTeam(2)}
        >
          Թիմ 2
        </TeamButton>
      </TeamIndicator>
      <Question>{currentQuestion.question}</Question>
      <OptionsContainer>
        {currentQuestion.options.map((option, index) => (
          <Option
            key={index}
            isTeam1={team1Answer === index}
            isTeam2={team2Answer === index}
            onClick={() => {
              if (activeTeam === 1) {
                if (team1Answer === index) {
                  // Unselect if clicking the same answer
                  dispatch({
                    type: "SET_TEAM_ANSWER",
                    payload: { team: 1, answer: null },
                  });
                } else if (team1Answer === null) {
                  // Select new answer
                  handleOptionSelect(index);
                  setActiveTeam(2);
                }
              } else if (activeTeam === 2) {
                if (team2Answer === index) {
                  // Unselect if clicking the same answer
                  dispatch({
                    type: "SET_TEAM_ANSWER",
                    payload: { team: 2, answer: null },
                  });
                } else if (team2Answer === null) {
                  // Select new answer
                  handleOptionSelect(index);
                }
              }
            }}
            disabled={false} // Remove disabled state to allow unselecting
          >
            {option.title}
          </Option>
        ))}
      </OptionsContainer>
    </DisplayContainer>
  );
};

export default QuestionDisplay;
