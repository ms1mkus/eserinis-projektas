import createHttpError from "http-errors";

import type { AuthLoginBody } from "../../types/routes/auth";

export const validateLoginBody = (body: Partial<AuthLoginBody>) => {
  const { login, password } = body;

  if (!login) {
    throw createHttpError(
      400,
      "Reikalingas vartotojo vardas arba el. pašto adresas"
    );
  }

  if (!password) {
    throw createHttpError(400, "Slaptažodis reikalingas");
  }

  // As the function checked the properties are not missing,
  // return the body as original type
  return body as AuthLoginBody;
};
