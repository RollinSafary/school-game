import React from "react";
import styled from "styled-components";
import { useGame } from "../context/GameContext";
import { getAllCategories } from "../utils/questions";
import { audioManager } from "../utils/AudioManager";
import { simpleAudioManager } from "../utils/SimplifiedAudioManager";

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
  cursor: ${(props) => (props.disabled ? "default" : "pointer")};
  transition: all 0.3s ease;
  opacity: ${(props) => (props.disabled ? 0.7 : 1)};

  &:hover {
    transform: ${(props) => (props.disabled ? "none" : "translateY(-2px)")};
    box-shadow: ${(props) =>
      props.disabled ? "none" : "0 2px 8px rgba(0, 0, 0, 0.1)"};
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

const QuestionCountDisplay = styled.div`
  text-align: center;
  margin-bottom: 15px;
  font-size: 1.1rem;
  color: #555;
  font-weight: bold;
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
  const [isOptionsAudioFinished, setIsOptionsAudioFinished] =
    React.useState(false);
  const [hasPlayedTeamSelectionAudio, setHasPlayedTeamSelectionAudio] =
    React.useState(false);
  const [team1AnsweredCorrectly, setTeam1AnsweredCorrectly] = React.useState<
    boolean | null
  >(null);
  const [team2AnsweredCorrectly, setTeam2AnsweredCorrectly] = React.useState<
    boolean | null
  >(null);

  // Add a ref that will persist between renders and won't be affected by state updates
  const correctAnswersRef = React.useRef({
    team1Correct: null as boolean | null,
    team2Correct: null as boolean | null,
  });

  // Handle waiting audio playback and cleanup
  const stopBackgroundMusic = React.useCallback(() => {
    if (waitingAudio) {
      waitingAudio.pause();
      waitingAudio.currentTime = 0;
      setWaitingAudio(null);
    }
  }, [waitingAudio]);

  // Cleanup audio when component unmounts
  React.useEffect(() => {
    return () => {
      stopBackgroundMusic();
    };
  }, [stopBackgroundMusic]);

  const getCategoryTitle = (categoryId: number): string => {
    const category = getAllCategories().find((c) => c.id === categoryId);
    return category?.title || "";
  };

  const handleOptionSelect = (optionIndex: number) => {
    dispatch({
      type: "SET_TEAM_ANSWER",
      payload: { team: activeTeam as 1 | 2, answer: optionIndex },
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
        // Stop background music immediately when Enter is pressed
        stopBackgroundMusic();

        // Stop the timer by dispatching a state change
        dispatch({ type: "STOP_TIMER" });

        // Then proceed with answer sequence
        playAnswerSequence();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [
    readyToShowAnswer,
    showingAnswer,
    currentQuestion,
    stopBackgroundMusic,
    dispatch,
  ]);

  // Modify the useEffect that sets readyToShowAnswer
  React.useEffect(() => {
    if ((team1Answer !== null && team2Answer !== null) || state.timer === 0) {
      setReadyToShowAnswer(true);

      // Calculate correctness immediately and store in the ref
      if (currentQuestion) {
        // Store in both state (for rendering) and ref (for audio)
        const t1Correct = team1Answer === currentQuestion.rightAnswerIndex;
        const t2Correct = team2Answer === currentQuestion.rightAnswerIndex;

        setTeam1AnsweredCorrectly(t1Correct);
        setTeam2AnsweredCorrectly(t2Correct);

        // Store in ref which is more durable across async operations
        correctAnswersRef.current.team1Correct = t1Correct;
        correctAnswersRef.current.team2Correct = t2Correct;
      }
    }
  }, [team1Answer, team2Answer, state.timer, currentQuestion]);

  // Stop background music when returning to question list
  React.useEffect(() => {
    if (currentQuestionIndex === -1) {
      stopBackgroundMusic();
      setIsOptionsAudioFinished(false);
    }
  }, [currentQuestionIndex, stopBackgroundMusic]);

  // Play question and option audios when question is displayed
  React.useEffect(() => {
    if (currentQuestion && !showingAnswer) {
      setIsOptionsAudioFinished(false);

      const playQuestionAudio = async () => {
        try {
          // Play question audio
          const questionPath = `/speech/question-${currentQuestion.categoryId}-${currentQuestion.id}.wav`;
          await audioManager.play(questionPath);

          // Wait a bit between audio files
          await new Promise((resolve) => setTimeout(resolve, 300));

          // Play options audio
          const optionsPath = `/speech/options-${currentQuestion.categoryId}-${currentQuestion.id}.wav`;
          await audioManager.play(optionsPath);

          // Mark options audio as finished
          setIsOptionsAudioFinished(true);

          // Start background music if appropriate
          if (!showingAnswer && team1Answer === null && team2Answer === null) {
            const waitingAudio = await audioManager.preloadAudio(
              "/music/waiting.mp3"
            );
            if (waitingAudio) {
              waitingAudio.loop = true;
              await waitingAudio.play();
              setWaitingAudio(waitingAudio);
            }

            // Start timer
            dispatch({ type: "START_TIMER" });
          }
        } catch (error) {
          console.error("Audio playback error:", error);
          setIsOptionsAudioFinished(true);

          // Start timer even if audio fails
          if (!showingAnswer && team1Answer === null && team2Answer === null) {
            dispatch({ type: "START_TIMER" });
          }
        }
      };

      playQuestionAudio();
    }
  }, [currentQuestion?.id, currentQuestionIndex, showingAnswer, dispatch]);

  // Then modify playAnswerSequence to use the ref values
  const playAnswerSequence = async () => {
    if (!currentQuestion) return;

    // Stop waiting audio if it's playing
    stopBackgroundMusic();

    // Ensure timer is stopped
    dispatch({ type: "STOP_TIMER" });

    setShowingAnswer(true);
    setReadyToShowAnswer(false);

    // Play the correct answer audio FIRST
    const rightAnswerAudioPath = `/speech/right-answer-${currentQuestion.categoryId}-${currentQuestion.id}.wav`;
    try {
      await simpleAudioManager.play(rightAnswerAudioPath);
    } catch (error) {
      console.error("Right answer audio playback error:", error);
    }

    // Use the ref values for determining which audio to play
    let teamResultAudioPath = "";
    const t1Correct = correctAnswersRef.current.team1Correct === true;
    const t2Correct = correctAnswersRef.current.team2Correct === true;

    // Both teams correct
    if (t1Correct && t2Correct) {
      teamResultAudioPath = "/speech/both-success.wav";
    }
    // Only Team 1 correct
    else if (t1Correct && !t2Correct) {
      teamResultAudioPath = "/speech/team-1-success.wav";
    }
    // Only Team 2 correct
    else if (!t1Correct && t2Correct) {
      teamResultAudioPath = "/speech/team-2-success.wav";
    }
    // Both teams incorrect
    else {
      teamResultAudioPath = "/speech/both-fail.wav";
    }

    try {
      await simpleAudioManager.play(teamResultAudioPath);
    } catch (error) {
      console.error("Team result audio playback error:", error);
    }

    // Update scores
    dispatch({ type: "CHECK_ANSWERS" });

    // Wait a bit before moving to the next question
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Reset the state for the next question
    setShowingAnswer(false);
    setActiveTeam(1);
    setSelectingTeam((prev) => (prev === 1 ? 2 : 1));

    // Reset correctness state and ref
    setTeam1AnsweredCorrectly(null);
    setTeam2AnsweredCorrectly(null);
    correctAnswersRef.current.team1Correct = null;
    correctAnswersRef.current.team2Correct = null;

    // Move to the question list
    dispatch({ type: "NEXT_QUESTION" });
  };

  // Show question grid only when no question is selected
  const shouldShowQuestionGrid = currentQuestionIndex === -1;

  // Check if game should be completed based on maxQuestions count
  const isGameCompleted =
    (usedQuestions.size >= state.maxQuestions && team1Score !== team2Score) ||
    (usedQuestions.size === questions.length &&
      questions.length > 0 &&
      currentQuestionIndex === -1 &&
      team1Answer === null &&
      team2Answer === null &&
      !showingAnswer);

  // Play final results audio
  React.useEffect(() => {
    if (isGameCompleted) {
      const playFinalAudio = async () => {
        try {
          if (team1Score > team2Score) {
            await simpleAudioManager.play("/speech/team-1-wins.wav");
          } else if (team2Score > team1Score) {
            await simpleAudioManager.play("/speech/team-2-wins.wav");
          } else {
            await simpleAudioManager.play("/speech/draw.wav");
          }
        } catch (error) {
          console.error("Final results audio playback error:", error);
        }
      };

      playFinalAudio();
    }
  }, [isGameCompleted, team1Score, team2Score]);

  // Add this effect for team selection audio specifically
  React.useEffect(() => {
    // Only play when:
    // 1. We're in question selection view
    // 2. Audio hasn't been played yet for this selection
    // 3. Game isn't completed
    if (
      shouldShowQuestionGrid &&
      !hasPlayedTeamSelectionAudio &&
      !isGameCompleted
    ) {
      const playTeamSelectionAudio = async () => {
        try {
          const audioPath = `/speech/select-question-team-${selectingTeam}.wav`;

          // Stop any existing audio first
          simpleAudioManager.stopAll();

          // Play the new audio and mark as played
          await simpleAudioManager.play(audioPath);
          setHasPlayedTeamSelectionAudio(true);
        } catch (error) {
          console.error("Team selection audio playback error:", error);
          // Even if there's an error, mark as played to prevent retries
          setHasPlayedTeamSelectionAudio(true);
        }
      };

      playTeamSelectionAudio();
    }

    // Reset the flag when we leave question grid view
    if (!shouldShowQuestionGrid) {
      setHasPlayedTeamSelectionAudio(false);
    }
  }, [
    shouldShowQuestionGrid,
    selectingTeam,
    hasPlayedTeamSelectionAudio,
    isGameCompleted,
  ]);

  // Add a cleanup effect to stop audio when unmounting
  React.useEffect(() => {
    return () => {
      simpleAudioManager.stopAll();
    };
  }, []);

  // Add a new effect to monitor timer and play no-answer when timer reaches 0
  React.useEffect(() => {
    // Only check when we have a current question and timer just reached 0
    if (currentQuestion && state.timer === 0 && !showingAnswer) {
      const handleTimerEnd = async () => {
        try {
          // Stop background music
          stopBackgroundMusic();

          // Ensure timer is stopped
          dispatch({ type: "STOP_TIMER" });

          // Set showing answer state
          setShowingAnswer(true);
          setReadyToShowAnswer(false);

          console.log("Timer reached zero. Starting audio sequence...");

          // First play the correct answer audio
          const rightAnswerAudioPath = `/speech/right-answer-${currentQuestion.categoryId}-${currentQuestion.id}.wav`;
          console.log("Playing right answer audio first...");
          await simpleAudioManager.play(rightAnswerAudioPath);
          console.log("Right answer audio completed");

          // Then play the no-answer audio
          console.log("Playing no-answer audio...");
          await simpleAudioManager.play("/speech/no-answer.wav");
          console.log("No-answer audio completed");

          // Update scores (even though no answers were selected)
          dispatch({ type: "CHECK_ANSWERS" });

          // Add a longer delay after all audio completes
          console.log(
            "Waiting for 3 seconds before moving to next question..."
          );
          await new Promise((resolve) => setTimeout(resolve, 3000));
          console.log("Wait completed. Resetting state...");

          // Reset states
          setShowingAnswer(false);
          setActiveTeam(activeTeam === 1 ? 2 : 1);
          setSelectingTeam((prev) => (prev === 1 ? 2 : 1));

          // Reset correctness state and ref (same as in playAnswerSequence)
          setTeam1AnsweredCorrectly(null);
          setTeam2AnsweredCorrectly(null);
          correctAnswersRef.current.team1Correct = null;
          correctAnswersRef.current.team2Correct = null;

          console.log("Moving to question list...");
          // Move to the next question
          dispatch({ type: "NEXT_QUESTION" });
        } catch (error) {
          console.error("Error playing audio sequence:", error);

          // Wait even if there's an error
          await new Promise((resolve) => setTimeout(resolve, 3000));

          // Reset states
          setShowingAnswer(false);
          setActiveTeam(activeTeam === 1 ? 2 : 1);
          setSelectingTeam((prev) => (prev === 1 ? 2 : 1));

          // Reset correctness state and ref
          setTeam1AnsweredCorrectly(null);
          setTeam2AnsweredCorrectly(null);
          correctAnswersRef.current.team1Correct = null;
          correctAnswersRef.current.team2Correct = null;

          // Move to the next question
          dispatch({ type: "NEXT_QUESTION" });
        }
      };

      // Use async IIFE to ensure the audio sequence completes
      (async () => {
        await handleTimerEnd();
      })();
    }
  }, [
    state.timer,
    currentQuestion,
    showingAnswer,
    stopBackgroundMusic,
    dispatch,
    activeTeam, // Added dependency to fix the lint error
  ]);

  // Add a useEffect to monitor for game completion
  React.useEffect(() => {
    // Skip if we're already in the completed state or showing an answer
    if (isGameCompleted || showingAnswer || currentQuestionIndex !== -1) return;

    // Check if we've reached maxQuestions and have a winner
    if (usedQuestions.size >= state.maxQuestions && team1Score !== team2Score) {
      // Play the appropriate win audio
      const playWinnerAudio = async () => {
        try {
          if (team1Score > team2Score) {
            await simpleAudioManager.play("/speech/team-1-wins.wav");
          } else if (team2Score > team1Score) {
            await simpleAudioManager.play("/speech/team-2-wins.wav");
          }
        } catch (error) {
          console.error("Winner audio playback error:", error);
        }
      };

      playWinnerAudio();
    }
  }, [
    usedQuestions.size,
    team1Score,
    team2Score,
    state.maxQuestions,
    isGameCompleted,
    showingAnswer,
    currentQuestionIndex,
  ]);

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
          <QuestionCountDisplay>
            Questions: {usedQuestions.size} / {state.maxQuestions}
          </QuestionCountDisplay>
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
                  onClick={() => {
                    if (!usedQuestions.has(index)) {
                      // Stop any audio playing
                      simpleAudioManager.stopAll();

                      dispatch({
                        type: "SELECT_QUESTION",
                        payload: { index, team: selectingTeam as 1 | 2 },
                      });
                    }
                  }}
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
                    onClick={
                      !isOptionsAudioFinished
                        ? () => {}
                        : () => {
                            if (showingAnswer) return;

                            if (activeTeam === 1) {
                              if (team1Answer === index) {
                                dispatch({
                                  type: "SET_TEAM_ANSWER",
                                  payload: { team: 1, answer: null },
                                });
                              } else if (team1Answer === null) {
                                handleOptionSelect(index);
                                setActiveTeam(activeTeam === 1 ? 2 : 1);
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
                              setActiveTeam(activeTeam === 2 ? 1 : 2);
                            }
                          }
                    }
                    disabled={!isOptionsAudioFinished}
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
