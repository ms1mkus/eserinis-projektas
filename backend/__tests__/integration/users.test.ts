import type { Server } from 'http';
import request from 'supertest';

import { AppDataSource } from '../../src/data-source';
import { User } from '../../src/entities/user';
import { resetDatabase, teardownDatabase, setupServer } from '../utils/testsHelpers';
import { registerTestUser } from '../utils/userHelpers';

let testServer: Server;

beforeAll(async () => {
    testServer = await setupServer();
});

afterAll(async () => {
    await teardownDatabase();
    testServer.close();
});

describe('User Routes', () => {
    afterEach(async () => {
        await resetDatabase();
    });

    test('Should successfully create a user', async () => {
        const username = 'netikrasVartotojas';
        const email = 'netikrasVartotojas@gmail.com';
        const password = 'netikrasVartotojasSlaptazodis';

        const response = await request(testServer).post('/api/users').send({ username, email, password });

        const userRepo = AppDataSource.getRepository(User);
        const user = await userRepo.findOneOrFail({ where: { username: username } });

        expect(response.statusCode).toEqual(200);
        expect(response.text).toEqual(user.id);
    });

    test('Should fail user creation with invalid request body', async () => {
        const response = await request(testServer).post('/api/users').send({});

        expect(response.statusCode).toEqual(400);
        expect(response.body.message).toEqual('Reikalingas vartotojo vardas');
    });

    test('Should fail user creation with invalid username, email, or password', async () => {
        const username = 'testVartotojas';
        const email = 'testVartotojas@gmail.com';
        const password = 'testVartotojasSlaptazodis';

        const testCases = [
            { input: { email, password }, expectedMessage: 'Reikalingas vartotojo vardas' },
            { input: { username, password }, expectedMessage: 'El. paštas reikalingas' },
            { input: { username, email }, expectedMessage: 'Slaptažodis reikalingas' },
            { input: { username: 'a', email, password }, expectedMessage: 'Vartotojo vardas turi būti bent 5 simbolių' },
            { input: { username, email: 'neteising_formatas', password }, expectedMessage: 'El. paštas yra neteisingas' },
            { input: { username, email, password: 'abc' }, expectedMessage: 'Slaptažodis turi būti bent 8 simbolių' },
        ];

        for (const { input, expectedMessage } of testCases) {
            const response = await request(testServer).post('/api/users').send(input);

            expect(response.statusCode).toEqual(400);
            expect(response.body.message).toEqual(expectedMessage);
        }
    });

    test('Should fail user creation if username or email already exists', async () => {
        const { username, email } = await registerTestUser();

        const testCases = [
            { input: { username, email: 'kitasEmail@gmail.com', password: 'slaptazodis' }, expectedMessage: 'Vartotojo vardas jau užimtas' },
            { input: { username: 'kitasVardas', email, password: 'slaptazodis' }, expectedMessage: 'Elektroninis paštas jau užimtas' },
        ];

        for (const { input, expectedMessage } of testCases) {
            const response = await request(testServer).post('/api/users').send(input);

            expect(response.statusCode).toEqual(409);
            expect(response.body.message).toEqual(expectedMessage);
        }
    });
});
