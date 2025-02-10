import { UpdateUserBody, UserRegister } from "../types/signup";

export function isValiEmail(val: string) {
  let regEmail =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (!regEmail.test(val)) {
    return "Enter a valid email address";
  }
}

export const validateForRegister = (
  formData: UserRegister
): { [key: string]: string } => {
  const errors: { [key: string]: string } = {};
  if (!formData.email) {
    errors.email = "Email is required";
  } else if (isValiEmail(formData.email)) {
    errors.email = "Enter a valid email address";
  }

  if (!formData.name) errors.name = "First Name is required";
  if (!formData.username) errors.username = "Username is required";
  if (!formData.password) errors.password = "Password is required";

  if (!formData.isAgreeToTermsAndPrivacy)
    errors.isAgreeToTermsAndPrivacy =
      "You must agree to the terms and privacy policy";

  return errors;
};

export const validateForLogin = (formData: {
  email: string;
  password: string;
}): { [key: string]: string } => {
  const errors: { [key: string]: string } = {};
  if (!formData.email) {
    errors.email = "Email is required";
  } else if (isValiEmail(formData.email)) {
    errors.email = "Enter a valid email address";
  }

  if (!formData.password) errors.password = "Password is required";

  return errors;
};

export const validateForUpdateUser = (
  formData: UpdateUserBody
): { [key: string]: string } => {
  const errors: { [key: string]: string } = {};
  if (!formData.email) {
    errors.email = "Email is required";
  } else if (isValiEmail(formData.email)) {
    errors.email = "Enter a valid email address";
  }

  if (!formData.first_name) errors.first_name = "First Name is required";
  if (!formData.last_name) errors.last_name = "Last Name is required";
  if (!formData.country) errors.country = "Country is required";
  if (!formData.status) errors.status = "Status is required";

  return errors;
};
