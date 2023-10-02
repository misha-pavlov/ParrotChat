export const LOGIN_IDS = {
  firstName: "firstName",
  lastName: "lastName",
  email: "email",
  password: "password",
};

export const INITIAL_SIGN_UP_FORM_STATE = {
  inputValidities: {
    [LOGIN_IDS.firstName]: false,
    [LOGIN_IDS.lastName]: false,
    [LOGIN_IDS.email]: false,
    [LOGIN_IDS.password]: false,
  },
  formIsValid: false,
};

export const INITIAL_SIGN_IN_FORM_STATE = {
  inputValidities: {
    [LOGIN_IDS.email]: false,
    [LOGIN_IDS.password]: false,
  },
  formIsValid: false,
};
