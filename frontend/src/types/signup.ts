export interface UserRegister {
  isAgreeToTermsAndPrivacy: boolean | undefined;
  name: string;
  username: string;
  email: string;
  password: string;
}

export interface UserRegisterForDataBody {
  name: string;

  email: string;
  password: string;
}

export interface UpdateUserBody {
  name: string;
  email: string;

  [key: string]: any;
}

export interface DataBody extends UserRegisterForDataBody {
  username: string;
}

export interface SignUpBody {
  selectedRole: string;
}

export interface RegisterPayload {
  name: string;

  email: string;
  password: string;
  country: string;
  user_type: string;
  auth_type: string;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
  setSuccessErrorMessage: React.Dispatch<React.SetStateAction<string>>;
}
