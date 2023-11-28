import { validate } from "validate.js";
import { LOGIN_IDS } from "../config/constants";

export const loginValidation = (inputId: string, inputValue: string) => {
  const constrains: any = {
    presence: { allowEmpty: false },
  };

  if (
    [LOGIN_IDS.firstName, LOGIN_IDS.lastName].includes(inputId) &&
    inputValue !== ""
  ) {
    constrains.format = {
      pattern: "[a-z]+",
      flags: "i",
      message: "can only contain letters",
    };
  } else if (inputId === LOGIN_IDS.email) {
    constrains.email = true;
  } else if (inputId === LOGIN_IDS.password) {
    constrains.length = {
      minimum: 6,
    };
  } else if (inputId === LOGIN_IDS.about) {
    constrains.presence = {
      allowEmpty: true,
    };
    constrains.length = {
      minimum: 0,
      maximum: 150,
    };
  }

  const res = validate({ [inputId]: inputValue }, { [inputId]: constrains });
  return res && res[inputId];
};

export const validateLength = (inputId: string, inputValue: string, min?: number, max?: number, allowEmpty?: boolean) => {
  const constrains: any = {
    presence: { allowEmpty },
  };

  if (!allowEmpty || inputValue !== '') {
    constrains.length = {}

    if (min) {
      constrains.length.minimum = min
    }

    if (max) {
      constrains.length.maximum = max
    }
  }

  const res = validate({ [inputId]: inputValue }, { [inputId]: constrains });
  return res && res[inputId];
}