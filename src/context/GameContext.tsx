import React, { createContext, useContext, useReducer, useEffect } from "react";
import { Question } from "../types/questions";
import {
  getShuffledQuestions,
  reloadQuestions,
  isQuestionsDataLoaded,
} from "../utils/questions";

interface GameState {
  isLoading: boolean;
  isGameActive: boolean;
  questions: Question[];
  usedQuestions: Set<number>;
  questionSelections: Map<number, 1 | 2>;
  currentQuestionIndex: number;
  currentQuestion: Question | null;
  team1Answer: number | null;
  team2Answer: number | null;
  team1Score: number;
  team2Score: number;
  timer: number;
  timerActive: boolean;
  maxQuestions: number;
}

type GameAction =
  | { type: "START_GAME" }
  | { type: "QUESTIONS_LOADED"; payload: Question[] }
  | { type: "SELECT_QUESTION"; payload: { index: number; team: 1 | 2 } }
  | { type: "SET_TEAM_ANSWER"; payload: { team: 1 | 2; answer: number | null } }
  | { type: "CHECK_ANSWERS" }
  | { type: "NEXT_QUESTION" }
  | { type: "END_GAME" }
  | { type: "TICK_TIMER" }
  | { type: "START_TIMER" }
  | { type: "STOP_TIMER" }
  | { type: "SET_MAX_QUESTIONS"; payload: number };

const timer = 60;

const initialState: GameState = {
  isLoading: true,
  isGameActive: false,
  questions: [],
  usedQuestions: new Set<number>(),
  questionSelections: new Map<number, 1 | 2>(),
  currentQuestionIndex: -1,
  currentQuestion: null,
  team1Answer: null,
  team2Answer: null,
  team1Score: 0,
  team2Score: 0,
  timer: timer,
  timerActive: false,
  maxQuestions: 20,
};

const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case "START_GAME": {
      return {
        ...initialState,
        isLoading: false,
        isGameActive: true,
        questions: state.questions,
        maxQuestions: state.maxQuestions,
      };
    }

    case "QUESTIONS_LOADED":
      return {
        ...state,
        isLoading: false,
        questions: action.payload,
      };

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
        timer: timer,
        timerActive: false,
        usedQuestions: newUsedQuestions,
        questionSelections: newQuestionSelections,
      };
    }

    case "START_TIMER":
      return {
        ...state,
        timerActive: true,
      };

    case "SET_TEAM_ANSWER":
      return {
        ...state,
        [`team${action.payload.team}Answer`]: action.payload.answer,
      };

    case "CHECK_ANSWERS":
      if (!state.currentQuestion) return state;

      const isTeam1Correct =
        state.team1Answer !== null &&
        state.team1Answer === state.currentQuestion.rightAnswerIndex;

      const isTeam2Correct =
        state.team2Answer !== null &&
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
        timer: timer,
        timerActive: false,
      };

    case "END_GAME":
      return {
        ...state,
        isGameActive: false,
      };

    case "TICK_TIMER":
      return {
        ...state,
        timer: state.timer > 0 ? state.timer - 1 : 0,
      };

    case "STOP_TIMER":
      return {
        ...state,
        timerActive: false,
      };

    case "SET_MAX_QUESTIONS":
      return {
        ...state,
        maxQuestions: action.payload,
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

    if (
      state.isGameActive &&
      state.currentQuestion &&
      state.timer > 0 &&
      state.timerActive
    ) {
      timerInterval = setInterval(() => {
        dispatch({ type: "TICK_TIMER" });
      }, 1000);
    }

    return () => {
      if (timerInterval) {
        clearInterval(timerInterval);
      }
    };
  }, [
    state.isGameActive,
    state.currentQuestion,
    state.timer,
    state.timerActive,
  ]);

  useEffect(() => {
    const loadQuestionsData = async () => {
      if (isQuestionsDataLoaded()) {
        dispatch({
          type: "QUESTIONS_LOADED",
          payload: getShuffledQuestions(),
        });
        return;
      }

      const isLoaded = await reloadQuestions();
      if (isLoaded) {
        dispatch({
          type: "QUESTIONS_LOADED",
          payload: getShuffledQuestions(),
        });
      }
    };

    loadQuestionsData();
  }, []);

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
