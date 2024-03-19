import createHttpError from 'http-errors';
import isEmail from 'validator/lib/isEmail';

import type { UsersCreateBody } from '../../types/routes/users';

export const validateCreateBody = (body: Partial<UsersCreateBody>) => {
    const { username, email, password } = body;

    if (!username) {
        throw createHttpError(400, 'Reikalingas vartotojo vardas');
    }
    if (username.length < 5) {
        throw createHttpError(400, 'Vartotojo vardas turi būti bent 5 simbolių');
    }

    if (!email) {
        throw createHttpError(400, 'El. paštas reikalingas');
    }
    if (!isEmail(email)) {
        throw createHttpError(400, 'El. paštas yra neteisingas');
    }

    if (!password) {
        throw createHttpError(400, 'Slaptažodis reikalingas');
    }
    if (password.length < 8) {
        throw createHttpError(400, 'Slaptažodis turi būti bent 8 simbolių');
    }

    // As the function checked the properties are not missing,
    // return the body as original type
    return body as UsersCreateBody;
};