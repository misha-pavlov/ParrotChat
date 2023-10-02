import { INITIAL_SIGN_UP_FORM_STATE } from "../../config/constants";

type State = typeof INITIAL_SIGN_UP_FORM_STATE;
type ActionType = {
  validationResult: undefined | Array<string>;
  inputId: string;
};

export const loginFormReducer = (state: State, action: ActionType): State => {
  const { validationResult, inputId } = action;

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
    inputValidities: updatedValidities,
    formIsValid: updatedFormIsValid,
  };
};
