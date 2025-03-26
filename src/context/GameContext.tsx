import React, { createContext, useContext, useReducer, useEffect } from "react";
import { Question } from "../types/questions";
import { getShuffledQuestions } from "../utils/questions";

interface GameState {
  questions: Question[];
  currentQuestionIndex: number;
  currentQuestion: Question | null;
  team1Score: number;
  team2Score: number;
  team1Answer: number | null;
  team2Answer: number | null;
  isGameActive: boolean;
  timer: number;
  usedQuestions: Set<number>;
  questionSelections: Map<number, 1 | 2>;
}

type GameAction =
  | { type: "START_GAME" }
  | { type: "SELECT_QUESTION"; payload: { index: number; team: 1 | 2 } }
  | { type: "SET_TEAM_ANSWER"; payload: { team: 1 | 2; answer: number | null } }
  | { type: "CHECK_ANSWERS" }
  | { type: "NEXT_QUESTION" }
  | { type: "END_GAME" }
  | { type: "TICK_TIMER" };

const initialState: GameState = {
  questions: [],
  currentQuestionIndex: -1,
  currentQuestion: null,
  team1Score: 0,
  team2Score: 0,
  team1Answer: null,
  team2Answer: null,
  isGameActive: false,
  timer: 60,
  usedQuestions: new Set<number>(),
  questionSelections: new Map<number, 1 | 2>(),
};

const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case "START_GAME": {
      const shuffledQuestions = getShuffledQuestions();
      return {
        ...initialState,
        questions: shuffledQuestions,
        isGameActive: true,
      };
    }

    case "SELECT_QUESTION": {
      const { index, team } = action.payload;
      if (state.usedQuestions.has(index)) return state;

      const newUsedQuestions = new Set(state.usedQuestions);
      newUsedQuestions.add(index);

      const newQuestionSelections = new Map(state.questionSelections);
      newQuestionSelections.set(index, team);

      return {
        ...state,
        currentQuestionIndex: index,
        currentQuestion: state.questions[index],
        team1Answer: null,
        team2Answer: null,
        timer: 60,
        usedQuestions: newUsedQuestions,
        questionSelections: newQuestionSelections,
      };
    }

    case "SET_TEAM_ANSWER":
      return {
        ...state,
        [`team${action.payload.team}Answer`]: action.payload.answer,
      };

    case "CHECK_ANSWERS":
      if (!state.currentQuestion) return state;

      const isTeam1Correct =
        state.team1Answer === state.currentQuestion.rightAnswerIndex;
      const isTeam2Correct =
        state.team2Answer === state.currentQuestion.rightAnswerIndex;

      return {
        ...state,
        team1Score: state.team1Score + (isTeam1Correct ? 1 : 0),
        team2Score: state.team2Score + (isTeam2Correct ? 1 : 0),
      };

    case "NEXT_QUESTION":
      return {
        ...state,
        currentQuestionIndex: -1,
        currentQuestion: null,
        team1Answer: null,
        team2Answer: null,
        timer: 60,
      };

    case "END_GAME":
      return {
        ...state,
        isGameActive: false,
      };

    case "TICK_TIMER":
      return {
        ...state,
        timer: Math.max(0, state.timer - 1),
      };

    default:
      return state;
  }
};

interface GameContextType {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  useEffect(() => {
    let timerInterval: NodeJS.Timeout;

    if (state.isGameActive && state.currentQuestion && state.timer > 0) {
      timerInterval = setInterval(() => {
        dispatch({ type: "TICK_TIMER" });
      }, 1000);
    } else if (state.timer === 0 && state.currentQuestion) {
      dispatch({ type: "CHECK_ANSWERS" });
      setTimeout(() => {
        dispatch({ type: "NEXT_QUESTION" });
      }, 2000);
    }

    return () => {
      if (timerInterval) {
        clearInterval(timerInterval);
      }
    };
  }, [state.isGameActive, state.currentQuestion, state.timer]);

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
};
