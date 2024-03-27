
const { getUsers, getUserById, addUser, updateUser, deleteUser } = require('../users');
const pool = require('../dal.auth');

// Mock the pool.query function
pool.query = jest.fn();

// Mock the entire module
jest.mock('../dal.auth', () => ({
  query: jest.fn(),
}));

describe('Testing users api calls for GET, POST, PATCH, DELETE', () => {
    //action to take after each test// clear all mocks
    afterEach(() => {
        jest.clearAllMocks();
    });

    // Test cases for the getUsers function
    describe('Team Manager wants to be able to retrieve all soccer players from the users table', () => {
        // This is a test case for retrieving all users
        it('should get all users in the users table', async () => {
            const mockRows = [{ id: 1, firstname: 'John', lastname:'Dougan', username:'skele', image_url:'/photos/image.jpg' }, { id: 2, name: 'Jane', lastname:'Doe', username:'janez', image_url:'/photos/image2.jpg'}];
            const mockQuery = jest.fn().mockResolvedValue({ rows: mockRows });
            pool.query.mockImplementation(mockQuery);

            const result = await getUsers();

            expect(pool.query).toHaveBeenCalledWith('SELECT * FROM users;');
            expect(result).toEqual(mockRows);
        });


        // This is a test case for handling errors during query execution
        it('should throw an error if query execution fails', async () => {
            const mockError = new Error('Database error');
            const mockQuery = jest.fn().mockRejectedValue(mockError);
            pool.query.mockImplementation(mockQuery);

            await expect(getUsers()).rejects.toThrow(mockError);
            expect(pool.query).toHaveBeenCalledWith('SELECT * FROM users;');
        });
    });

    // This is a test suite for the functionality of retrieving a player by their ID
    describe('A Coach wants to retrieve a player by their ID', () => {
        it('it should retrieve a user by ID', async () => {
            const mockId = 1;
            const mockUser = { id: mockId, name: 'John Doe' };
            const mockQuery = jest.fn().mockResolvedValue({ rows: [mockUser] });
            pool.query.mockImplementation(mockQuery);

            const result = await getUserById(mockId);

            expect(pool.query).toHaveBeenCalledWith('SELECT * FROM users WHERE user_id = $1;', [mockId]);
            expect(result).toEqual(mockUser);
        });

        // This is a test case for handling a scenario where the user is not found
        it('should throw an error if user is not found', async () => {
            const mockId = 1;
            const mockQuery = jest.fn().mockResolvedValue({ rows: [] });
            pool.query.mockImplementation(mockQuery);

            await expect(getUserById(mockId)).rejects.toThrow(`User with id ${mockId} not found`);
            expect(pool.query).toHaveBeenCalledWith('SELECT * FROM users WHERE user_id = $1;', [mockId]);
        });

        // This is a test case for handling errors during query execution
        it('should throw an error if query execution fails', async () => {
            const mockId = 1;
            const mockError = new Error('Database error');
            const mockQuery = jest.fn().mockRejectedValue(mockError);
            pool.query.mockImplementation(mockQuery);

            await expect(getUserById(mockId)).rejects.toThrow(mockError);
            expect(pool.query).toHaveBeenCalledWith('SELECT * FROM users WHERE user_id = $1;', [mockId]);
        });
    });


    // This is a test suite for the functionality of adding new players to the team
    describe('Team management wants to be able to add new players to the team', () => {
        
        // This is a test case for adding a new player
        it('should add a new user', async () => {         
            const mockUser = {
                firstname: 'John',
                middlename: 'Doe',
                lastname: 'Smith',
                email: 'john.doe@example.com',
                username: 'johndoe',
                image_url: 'https://example.com/avatar.jpg',
            };        
            const mockQuery = jest.fn().mockResolvedValue({ rows: [mockUser] });         
            pool.query.mockImplementation(mockQuery);            
            const result = await addUser(
                mockUser.firstname,
                mockUser.middlename,
                mockUser.lastname,
                mockUser.email,
                mockUser.username,
                mockUser.image_url
            );           
            expect(pool.query).toHaveBeenCalledWith(
                'INSERT INTO users (first_name,middle_name,last_name,email,username,image_url) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;',
                [
                    mockUser.firstname,
                    mockUser.middlename,
                    mockUser.lastname,
                    mockUser.email,
                    mockUser.username,
                    mockUser.image_url,
                ]
            );       
            expect(result).toEqual(mockUser);
        });

        // This is a test case for handling errors during query execution
        it('should throw an error if query execution fails', async () => {
         
            const mockUser = {
                firstname: 'John',
                middlename: 'Doe',
                lastname: 'Smith',
                email: 'john.doe@example.com',
                username: 'johndoe',
                image_url: 'https://example.com/avatar.jpg',
            };        
            const mockError = new Error('Database error');           
            const mockQuery = jest.fn().mockRejectedValue(mockError);            
            pool.query.mockImplementation(mockQuery);
            await expect(
                addUser(
                    mockUser.firstname,
                    mockUser.middlename,
                    mockUser.lastname,
                    mockUser.email,
                    mockUser.username,
                    mockUser.image_url
                )
            ).rejects.toThrow(mockError);       
            expect(pool.query).toHaveBeenCalledWith(
                'INSERT INTO users (first_name,middle_name,last_name,email,username,image_url) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;',
                [
                    mockUser.firstname,
                    mockUser.middlename,
                    mockUser.lastname,
                    mockUser.email,
                    mockUser.username,
                    mockUser.image_url,
                ]
            );
        });
    });

    // This is a test suite for the functionality of updating player details
    describe('Team management wants to be able to update players details', () => {
        it('should update a user', async () => {
            const mockId = 1;
            const mockUser = {
                id: mockId,
                firstname: 'John',
                middlename: 'Doe',
                lastname: 'Smith',
                email: 'john.doe@example.com',
                username: 'johndoe',
                image_url: 'https://example.com/avatar.jpg',
            };
            const mockQuery = jest.fn().mockResolvedValue({ rows: [mockUser] });
            pool.query.mockImplementation(mockQuery);
            const result = await updateUser(
                mockId,
                mockUser.firstname,
                mockUser.middlename,
                mockUser.lastname,
                mockUser.email,
                mockUser.username,
                mockUser.image_url
            );
            expect(pool.query).toHaveBeenCalledWith(
                'UPDATE users SET first_name = $1, middle_name = $2, last_name = $3, email = $4, username = $5, image_url = $6 WHERE user_id = $7 RETURNING *;',
                [
                    mockUser.firstname,
                    mockUser.middlename,
                    mockUser.lastname,
                    mockUser.email,
                    mockUser.username,
                    mockUser.image_url,
                    mockId,
                ]
            );
            expect(result).toEqual(mockUser);
        });

        // This is a test case for handling errors during query execution
        it('should throw an error if query execution fails', async () => {
            const mockId = 1;
            const mockUser = {
                id: mockId,
                firstname: 'John',
                middlename: 'Doe',
                lastname: 'Smith',
                email: 'john.doe@example.com',
                username: 'johndoe',
                image_url: 'https://example.com/avatar.jpg',
            };
            const mockError = new Error('Database error');
            const mockQuery = jest.fn().mockRejectedValue(mockError);
            pool.query.mockImplementation(mockQuery);

            await expect(
                updateUser(
                    mockId,
                    mockUser.firstname,
                    mockUser.middlename,
                    mockUser.lastname,
                    mockUser.email,
                    mockUser.username,
                    mockUser.image_url
                )
            ).rejects.toThrow(mockError);
            expect(pool.query).toHaveBeenCalledWith(
                'UPDATE users SET first_name = $1, middle_name = $2, last_name = $3, email = $4, username = $5, image_url = $6 WHERE user_id = $7 RETURNING *;',
                [
                    mockUser.firstname,
                    mockUser.middlename,
                    mockUser.lastname,
                    mockUser.email,
                    mockUser.username,
                    mockUser.image_url,
                    mockId,
                ]
            );
        });
    });

    // This is a test suite for the functionality of deleting a player
    describe('Management want to be able to delete players who are no longer with the team', () => {
        it('should delete a user', async () => {
            const mockId = 1;
            const mockUser = { id: mockId, name: 'John Doe' };
            const mockQuery = jest.fn().mockResolvedValue({ rows: [mockUser] });
            pool.query.mockImplementation(mockQuery);

            const result = await deleteUser(mockId);

            expect(pool.query).toHaveBeenCalledWith('DELETE FROM users WHERE user_id = $1 RETURNING *;', [mockId]);
            expect(result).toEqual(mockUser);
        });

        // This is a test case for handling errors during query execution
        it('should throw an error if query execution fails', async () => {
            const mockId = 1;
            const mockError = new Error('Database error');
            const mockQuery = jest.fn().mockRejectedValue(mockError);
            pool.query.mockImplementation(mockQuery);

            await expect(deleteUser(mockId)).rejects.toThrow(mockError);
            expect(pool.query).toHaveBeenCalledWith('DELETE FROM users WHERE user_id = $1 RETURNING *;', [mockId]);
        });
    });
});

