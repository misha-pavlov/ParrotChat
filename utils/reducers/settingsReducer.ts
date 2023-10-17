type State = {
  inputValues: {
    [x: string]: string;
  };
  inputValidities: {
    [x: string]: undefined | boolean;
  };
  formIsValid: boolean;
};
type ActionType = {
  validationResult: undefined | boolean;
  inputId: string;
  inputValue: string;
};

export const settingsReducer = (state: State, action: ActionType): State => {
  const { validationResult, inputId, inputValue } = action;

  const updatedValues = {
    ...state.inputValues,
    [inputId]: inputValue,
  };

  const updatedValidities = {
    ...state.inputValidities,
    [inputId]: validationResult,
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
