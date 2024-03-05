import request from 'supertest';
import type { Server } from 'http';

import * as AuthValidators from '../../src/controllers/auth/validators';
import { teardownDatabase, setupServer } from '../utils/testsHelpers';

let testServer: Server;

beforeAll(async () => {
    testServer = await setupServer();
});

afterAll(async () => {
    await teardownDatabase();
    testServer.close();
});

describe('API Endpoints', () => {
    test('Respond with "Serveris gyvas" when checking health', async () => {
        const response = await request(testServer).get('/api/health');

        expect(response.statusCode).toEqual(200);
        expect(response.text).toEqual('Serveris gyvas');
    });

    test('Return 404 for non-existent routes', async () => {
        const response = await request(testServer).get('/api/notRealRoute');

        expect(response.statusCode).toEqual(404);
        expect(response.body.message).toEqual('Resource Not Found');
    });

    test('Handle unexpected errors gracefully', async () => {
        jest.spyOn(AuthValidators, 'validateLoginBody').mockImplementationOnce(() => { throw 'User error'; });
        const response = await request(testServer).post('/api/auth/login');

        expect(response.statusCode).toEqual(500);
        expect(response.body.message).toEqual('Unexpected error');
    });
});
