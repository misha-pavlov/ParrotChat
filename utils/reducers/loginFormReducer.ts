import { INITIAL_SIGN_UP_FORM_STATE } from "../../config/constants";

type State = typeof INITIAL_SIGN_UP_FORM_STATE;
type ActionType = {
  validationResult: undefined | Array<string>;
  inputId: string;
  inputValue: string;
};

export const loginFormReducer = (state: State, action: ActionType): State => {
  const { validationResult, inputId, inputValue } = action;

  const updatedValues = {
    ...state.inputValues,
    [inputId]: inputValue,
  };

  const updatedValidities = {
    ...state.inputValidities,
    [inputId]: validationResult as unknown as boolean,
  };

  let updatedFormIsValid = true;

  for (const key in updatedValidities) {
    if (updatedValidities[key] !== undefined) {
      updatedFormIsValid = false;
      break;
    }
  }

  return {
    inputValues: updatedValues,
    inputValidities: updatedValidities,
    formIsValid: updatedFormIsValid,
  };
};
