import User from '../models/User.js';
import Board from '../models/Board.js';
import Task from '../models/Task.js';

describe('Mongoose Model Validation', () => {

    // validateSync() is a Mongoose method that runs schema validation locally without touching the database. Passing an empty object {} to User should fail because username, email, and password are all required in your schema. toBeDefined() just means the error exists — i.e. validation did catch the problem.
    test('User model should fail without required fields', async () => {
        const user = new User({});
        const err = user.validateSync();
        expect(err).toBeDefined();
    });

    // Opposite of Test 1 — all required fields provided so validation should pass and return no error. toBeUndefined() means no error was returned.
    test('User model should pass with required fields', async () => {
        const user = new User({
            username: 'testuser',
            email: 'test@test.com',
            password: 'hashedpassword'
        });
        const err = user.validateSync();
        expect(err).toBeUndefined();
    });

    // Creates a task without specifying status, and checks that Mongoose automatically set it to 'todo' as defined in the schema default. The long string is just a valid MongoDB ObjectId format that Mongoose accepts for the board reference field.
    test('Task status should default to todo', async () => {
        const task = new Task({
            title: 'Test task',
            board: '507f1f77bcf86cd799439011'
        });
        expect(task.status).toBe('todo');
    });

    // The Task schema has status: Enum ["todo", "inProgress", "done"]. Passing 'invalidstatus' should be rejected by Mongoose validation. This confirms that enum constraint actually works.
    test('Task should reject invalid status', async () => {
        const task = new Task({
            title: 'Test task',
            board: '507f1f77bcf86cd799439011',
            status: 'invalidstatus'
        });
        const err = task.validateSync();
        expect(err).toBeDefined();
    });
});