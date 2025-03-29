import React from "react";
import styled from "styled-components";
import { useGame } from "../context/GameContext";
import { getAllCategories } from "../utils/questions";
import { Question } from "../types/questions";

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const QuestionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  grid-template-rows: repeat(3, 1fr);
  gap: 8px;
`;

const QuestionButton = styled.button.withConfig({
  shouldForwardProp: (prop) =>
    prop !== "isUsed" && prop !== "isCurrent" && prop !== "teamColor",
})<{
  isUsed?: boolean;
  isCurrent?: boolean;
  teamColor?: string;
}>`
  padding: 8px;
  border: none;
  border-radius: 4px;
  background-color: ${(props) =>
    props.isUsed
      ? props.teamColor || "#ccc"
      : props.isCurrent
      ? "#4CAF50"
      : "#f5f5f5"};
  color: ${(props) => (props.isUsed ? "white" : "black")};
  cursor: ${(props) => (props.isUsed ? "not-allowed" : "pointer")};
  transition: all 0.3s ease;
  aspect-ratio: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  min-width: 10px;
  min-height: 10px;
  position: relative;

  &:hover {
    transform: ${(props) => (props.isUsed ? "none" : "translateY(-2px)")};
    box-shadow: ${(props) =>
      props.isUsed ? "none" : "0 2px 8px rgba(0, 0, 0, 0.1)"};
  }
`;

const QuestionDetails = styled.div`
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
`;

const QuestionTitle = styled.h2`
  margin: 0 0 15px 0;
  color: #333;
  font-size: 1.5rem;
`;

const CategoryLabel = styled.div`
  display: inline-block;
  padding: 5px 10px;
  background: #e9ecef;
  border-radius: 4px;
  color: #495057;
  font-size: 0.9rem;
  margin-bottom: 15px;
`;

const OptionsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
  margin-top: 20px;
`;

const Option = styled.button.withConfig({
  shouldForwardProp: (prop) =>
    prop !== "isTeam1" && prop !== "isTeam2" && prop !== "isCorrect",
})<{
  isTeam1?: boolean;
  isTeam2?: boolean;
  isCorrect?: boolean;
}>`
  padding: 15px;
  border: 2px solid
    ${(props) => {
      if (props.isCorrect) return "#4CAF50";
      if (props.isTeam1 && props.isTeam2) return "#FF8C00";
      if (props.isTeam1) return "#FF8C00";
      if (props.isTeam2) return "#4444FF";
      return "#ddd";
    }};
  border-radius: 8px;
  background: ${(props) => {
    if (props.isCorrect) return "#E8F5E9";
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

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
`;

const TeamIndicator = styled.div`
  display: flex;
  justify-content: flex-start;
  gap: 10px;
  margin-bottom: 20px;
`;

const TeamButton = styled.button.withConfig({
  shouldForwardProp: (prop) => prop !== "isActive" && prop !== "teamColor",
})<{ isActive: boolean; teamColor: string }>`
  padding: 8px 16px;
  border: 2px solid ${(props) => props.teamColor};
  border-radius: 4px;
  background-color: ${(props) => (props.isActive ? props.teamColor : "white")};
  color: ${(props) => (props.isActive ? "white" : props.teamColor)};
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: ${(props) => props.teamColor};
    color: white;
  }
`;

const SelectingTeamMessage = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== "teamColor",
})<{ teamColor: string }>`
  background-color: ${(props) => props.teamColor};
  color: white;
  padding: 10px 20px;
  border-radius: 8px;
  text-align: center;
  font-weight: bold;
  margin-bottom: 20px;
`;

const ResultsContainer = styled.div`
  padding: 40px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const ResultsTitle = styled.h1`
  color: #333;
  margin-bottom: 30px;
`;

const TeamResult = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== "teamColor",
})<{ teamColor: string }>`
  padding: 20px;
  margin: 10px 0;
  background-color: ${(props) => props.teamColor}22;
  border: 2px solid ${(props) => props.teamColor};
  border-radius: 8px;
  font-size: 1.5rem;
  font-weight: bold;
  color: ${(props) => props.teamColor};
`;

const WinnerMessage = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== "teamColor",
})<{ teamColor: string }>`
  margin-top: 30px;
  font-size: 2rem;
  font-weight: bold;
  color: ${(props) => props.teamColor};
`;

const FinalView = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
  color: white;
  text-align: center;
  padding: 2rem;
`;

const ScoreDisplay = styled.div`
  display: flex;
  gap: 2rem;
  margin: 2rem 0;
`;

const TeamScore = styled.div<{ isTeam1?: boolean; isTeam2?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem 2rem;
  background: ${(props) =>
    props.isTeam1 ? "#FF8C00" : props.isTeam2 ? "#4444FF" : "#666"};
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const TeamName = styled.div`
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  font-weight: bold;
`;

const Score = styled.div`
  font-size: 2rem;
  font-weight: bold;
`;

const Winner = styled.div`
  font-size: 2rem;
  font-weight: bold;
  margin: 1rem 0;
  color: #4caf50;
`;

const NewGameButton = styled.button`
  margin-top: 2rem;
  padding: 1rem 2rem;
  font-size: 1.2rem;
  background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.2);
  }

  &:active {
    transform: translateY(0);
  }
`;

const QuestionList: React.FC = () => {
  const { state, dispatch } = useGame();
  const {
    questions,
    usedQuestions,
    currentQuestionIndex,
    currentQuestion,
    team1Answer,
    team2Answer,
    questionSelections,
    team1Score,
    team2Score,
  } = state;
  const [activeTeam, setActiveTeam] = React.useState<1 | 2>(1);
  const [showingAnswer, setShowingAnswer] = React.useState(false);
  const [readyToShowAnswer, setReadyToShowAnswer] = React.useState(false);
  const [selectingTeam, setSelectingTeam] = React.useState<1 | 2>(
    Math.random() < 0.5 ? 1 : 2
  );
  const [waitingAudio, setWaitingAudio] =
    React.useState<HTMLAudioElement | null>(null);

  // Handle waiting audio playback
  React.useEffect(() => {
    if (currentQuestion && !showingAnswer) {
      // Create and start waiting audio
      const audio = new Audio("/music/waiting.mp3");
      audio.loop = true; // Make it loop continuously
      audio.play().catch(console.error);
      setWaitingAudio(audio);

      // Cleanup function to stop audio when component unmounts or question changes
      return () => {
        audio.pause();
        audio.currentTime = 0;
        setWaitingAudio(null);
      };
    }
  }, [currentQuestion, showingAnswer]);

  const getCategoryTitle = (categoryId: number): string => {
    const category = getAllCategories().find((c) => c.id === categoryId);
    return category?.title || "";
  };

  const handleOptionSelect = (optionIndex: number) => {
    dispatch({
      type: "SET_TEAM_ANSWER",
      payload: { team: activeTeam, answer: optionIndex },
    });
  };

  // Handle Enter key press
  React.useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (
        event.key === "Enter" &&
        readyToShowAnswer &&
        !showingAnswer &&
        currentQuestion
      ) {
        playAnswerSequence();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [readyToShowAnswer, showingAnswer, currentQuestion]);

  // When both teams have answered or timer is complete, set ready to show answer
  React.useEffect(() => {
    if ((team1Answer !== null && team2Answer !== null) || state.timer === 0) {
      setReadyToShowAnswer(true);
    }
  }, [team1Answer, team2Answer, state.timer]);

  // Play audio sequence and handle answer reveal
  const playAnswerSequence = async () => {
    if (!currentQuestion) return;

    // Stop waiting audio if it's playing
    if (waitingAudio) {
      waitingAudio.pause();
      waitingAudio.currentTime = 0;
      setWaitingAudio(null);
    }

    setShowingAnswer(true);
    setReadyToShowAnswer(false);

    // Wait for 1 second to show the right answer
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Update scores and move to next question
    dispatch({ type: "CHECK_ANSWERS" });

    // Wait a bit before moving to the next question
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Reset the state for the next question
    setShowingAnswer(false);
    setActiveTeam(1); // Reset to team 1 for next question
    // Switch to the other team for next question selection
    setSelectingTeam((prev) => (prev === 1 ? 2 : 1));

    // Move to the next question state
    dispatch({ type: "NEXT_QUESTION" });
  };

  // Play question and option audios when question is displayed
  React.useEffect(() => {
    if (currentQuestion && !showingAnswer) {
      const playQuestionAudio = async () => {
        try {
          // Play category audio if exists
          if (currentQuestion.audioUrl) {
            const questionAudio = new Audio(currentQuestion.audioUrl);
            await new Promise<void>((resolve) => {
              questionAudio.onended = () => resolve();
              questionAudio.onerror = () => resolve();
              questionAudio.play().catch(() => resolve());
            });
          }

          // Play general options audio
          const optionsAudio = new Audio("/speech/options.wav");
          await new Promise<void>((resolve) => {
            optionsAudio.onended = () => resolve();
            optionsAudio.onerror = () => resolve();
            optionsAudio.play().catch(() => resolve());
          });

          // Play option audios if they exist
          for (const option of currentQuestion.options) {
            if (option.audioUrl) {
              const optionAudio = new Audio(option.audioUrl);
              await new Promise<void>((resolve) => {
                optionAudio.onended = () => resolve();
                optionAudio.onerror = () => resolve();
                optionAudio.play().catch(() => resolve());
              });
            }
          }
        } catch (error) {
          console.log("Question audio playback error:", error);
        }
      };

      playQuestionAudio();
    }
  }, [currentQuestion, showingAnswer]);

  // Show question grid only when no question is selected
  const shouldShowQuestionGrid = currentQuestionIndex === -1;

  const isGameCompleted =
    usedQuestions.size === questions.length &&
    questions.length > 0 &&
    currentQuestionIndex === -1 &&
    team1Answer === null &&
    team2Answer === null &&
    !showingAnswer;

  // Play final results audio
  React.useEffect(() => {
    if (isGameCompleted) {
      const playFinalAudio = async () => {
        try {
          if (team1Score > team2Score) {
            const audio = new Audio("/speech/team1-wins.wav");
            await audio.play();
          } else if (team2Score > team1Score) {
            const audio = new Audio("/speech/team2-wins.wav");
            await audio.play();
          } else {
            const audio = new Audio("/speech/draw.wav");
            await audio.play();
          }
        } catch (error) {
          console.log("Final results audio playback error:", error);
        }
      };

      playFinalAudio();
    }
  }, [isGameCompleted, team1Score, team2Score]);

  return (
    <>
      {isGameCompleted ? (
        <FinalView>
          <h1>Խաղն ավարտվեց!</h1>
          <h2>Վերջնական հաշիվ</h2>
          <ScoreDisplay>
            <TeamScore isTeam1>
              <TeamName>Թիմ 1</TeamName>
              <Score>{team1Score}</Score>
            </TeamScore>
            <TeamScore isTeam2>
              <TeamName>Թիմ 2</TeamName>
              <Score>{team2Score}</Score>
            </TeamScore>
          </ScoreDisplay>
          <Winner>
            {team1Score > team2Score
              ? "Թիմ 1-ը հաղթեց!"
              : team2Score > team1Score
              ? "Թիմ 2-ը հաղթեց!"
              : "Ոչ ոքի!"}
          </Winner>
          <NewGameButton onClick={() => window.location.reload()}>
            Նոր խաղ սկսել
          </NewGameButton>
        </FinalView>
      ) : shouldShowQuestionGrid ? (
        <>
          <SelectingTeamMessage
            teamColor={selectingTeam === 1 ? "#FF8C00" : "#4444FF"}
          >
            {selectingTeam === 1 ? "Թիմ 1-ը" : "Թիմ 2-ը"} ընտրում է հարցը
          </SelectingTeamMessage>
          <ListContainer>
            <QuestionGrid>
              {questions.map((question, index) => (
                <QuestionButton
                  key={`${question.categoryId}-${question.id}`}
                  isUsed={usedQuestions.has(index)}
                  isCurrent={currentQuestionIndex === index}
                  teamColor={
                    usedQuestions.has(index)
                      ? questionSelections.get(index) === 1
                        ? "#FF8C00"
                        : "#4444FF"
                      : undefined
                  }
                  onClick={() =>
                    !usedQuestions.has(index) &&
                    dispatch({
                      type: "SELECT_QUESTION",
                      payload: { index, team: selectingTeam },
                    })
                  }
                >
                  {index + 1}
                </QuestionButton>
              ))}
            </QuestionGrid>
          </ListContainer>
        </>
      ) : (
        currentQuestionIndex !== -1 &&
        currentQuestion && (
          <ListContainer>
            <QuestionDetails>
              <CategoryLabel>
                {getCategoryTitle(currentQuestion.categoryId)}
              </CategoryLabel>
              <QuestionTitle>{currentQuestion.question}</QuestionTitle>
              <TeamIndicator>
                <TeamButton
                  isActive={activeTeam === 1}
                  teamColor="#FF8000"
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
              <OptionsContainer>
                {currentQuestion.options.map((option, index) => (
                  <Option
                    key={index}
                    isTeam1={team1Answer === index}
                    isTeam2={team2Answer === index}
                    isCorrect={
                      showingAnswer &&
                      index === currentQuestion.rightAnswerIndex
                    }
                    onClick={() => {
                      if (showingAnswer) return;
                      if (activeTeam === 1) {
                        if (team1Answer === index) {
                          dispatch({
                            type: "SET_TEAM_ANSWER",
                            payload: { team: 1, answer: null },
                          });
                        } else if (team1Answer === null) {
                          handleOptionSelect(index);
                          setActiveTeam(2);
                        }
                      } else if (activeTeam === 2) {
                        if (team2Answer === index) {
                          dispatch({
                            type: "SET_TEAM_ANSWER",
                            payload: { team: 2, answer: null },
                          });
                        } else if (team2Answer === null) {
                          handleOptionSelect(index);
                        }
                      }
                    }}
                  >
                    {index + 1}. {option.title}
                  </Option>
                ))}
              </OptionsContainer>
            </QuestionDetails>
          </ListContainer>
        )
      )}
    </>
  );
};

export default QuestionList;
