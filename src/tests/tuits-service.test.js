import {
    createUser,
    deleteUsersByUsername,
    findAllUsers,
    findUserById,
    findUserByCredentials
} from "../services/users-service";
import {createTuit, deleteTuit, findAllTuits, findTuitById, updateTuit} from "../services/tuits-service";

describe('can create tuit with REST API', () => {
    // var newTuit to have it accessed globally
    var newTuit;

    // sample user to insert
    const ripley = {
        username: 'ellenripley',
        password: 'lv426',
        email: 'ellenripley@aliens.com'
    };

    // sample tuit to insert
    const sampleTuit = {
        tuit: "test tuit",
        postedOn: "2021-12-25T05:00:00.000Z"
    };

    // setup test before running test
    beforeAll(() => {
        // create user
        return createUser(ripley);
    })

    // clean up after test runs
    afterAll(async () => {
        // remove any data we created
        await deleteTuit(newTuit._id);
        return await deleteUsersByUsername(ripley.username);
    })

    test('can insert new tuit with REST API', async () => {
        // insert new user in the database
        // const newUser = await createUser(ripley);
        const newUser = await findUserByCredentials({username: ripley.username, password: ripley.password});
        newTuit = await createTuit(newUser._id, sampleTuit);

        // verify inserted tuit's properties match parameter tuit
        expect(newTuit.tuit).toEqual(sampleTuit.tuit);
        expect(newTuit.postedOn).toEqual(sampleTuit.postedOn);
        expect(newTuit.postedBy).toEqual(newUser._id);
    });


});

describe('can delete tuit wtih REST API', () => {
    // sample user
    const sowell = {
        username: 'thommas_sowell',
        password: 'compromise',
        email: 'compromise@solutions.com'
    };

    // sample tuit
    const sampleTuit = {
        tuit: "test tuit",
        postedOn: "2021-12-25T05:00:00.000Z",
    };

    // setup the tests before verification
    beforeAll(() => {
        // create user to insert tuit
        return createUser(sowell);
    });

    // clean up after test runs
    afterAll(() => {
        // remove any data we created
        return deleteUsersByUsername(sowell.username);
    })

    test('can delete tuit from REST API by tuit id tid', async () => {

        // Get user from the database
        const newUser = await findUserByCredentials({username: sowell.username, password: sowell.password});
        // Insert a new tuit for user sowell
        const newTuit = await createTuit(newUser._id, sampleTuit);
        // delete a user by their username. Assumes user already exists
        const status = await deleteTuit(newTuit._id);

        // verify we deleted at least one tuit by their tuit id
        expect(status.deletedCount).toBeGreaterThanOrEqual(1);
    });
});

describe('can retrieve a tuit by their primary key with REST API', () => {
    // var newTuit to have it accessed globally
    var newTuit;

    // sample user
    const sowell = {
        username: 'thommas_sowell',
        password: 'compromise',
        email: 'compromise@solutions.com'
    };

    // sample tuit
    const sampleTuit = {
        tuit: "test tuit",
        postedOn: "2021-12-25T05:00:00.000Z",
    };

    // setup the tests before verification
    beforeAll(() => {
        // create users
        return createUser(sowell);
    });

    // clean up after test runs
    afterAll(async () => {
        // remove any data we created
        await deleteTuit(newTuit._id);
        return await deleteUsersByUsername(sowell.username);
    })

    test('can retrieve tuit from REST API by primary key', async () => {
        // insert the user in the database
        const newUser = await findUserByCredentials({username: sowell.username, password: sowell.password});

        // verify new user matches the parameter user
        expect(newUser.username).toEqual(sowell.username);
        expect(newUser.password).toEqual(sowell.password);
        expect(newUser.email).toEqual(sowell.email);

        // Insert a new tuit for user sowell
        newTuit = await createTuit(newUser._id, sampleTuit);

        // verify inserted tuit's properties match parameter tuit
        expect(newTuit.tuit).toEqual(sampleTuit.tuit);
        expect(newTuit.postedOn).toEqual(sampleTuit.postedOn);
        expect(newTuit.postedBy).toEqual(newUser._id);

        // retrieve the tuit from the database by its primary key
        const existingTuit = await findTuitById(newTuit._id);

        // verify retrieved user matches parameter user
        expect(existingTuit.tuit).toEqual(sampleTuit.tuit);
        expect(existingTuit.postedOn).toEqual(sampleTuit.postedOn);
        expect(existingTuit.postedBy).toEqual(newUser);
    });

});

describe('can retrieve all tuits with REST API', () => {
    // var Tuit to have it accessed globally
    var sowellNewTuit;
    var maxNewTuit;

    // sample user
    const sowell = {
        username: 'thommas_sowell',
        password: 'compromise',
        email: 'compromise@solutions.com'
    };

    // sample user
    const max = {
        username: 'max',
        password: 'compromise',
        email: 'compromise@solutions.com'
    };

    // sample tuit
    const sampleTuit = {
        tuit: "test tuit",
        postedOn: "2021-12-25T05:00:00.000Z",
    };

    // sample tuit
    const maxTuit = {
        tuit: "max test tuit",
        postedOn: "2021-12-25T05:00:00.000Z",
    };

    // setup the tests before verification
    beforeAll(() => {
        // remove any/all users to make sure we create it in the test
        createUser(max);
        createUser(sowell);
    });

    // clean up after test runs
    afterAll(async () => {
        // remove any data we created
        await deleteTuit(sowellNewTuit._id)
        await deleteTuit(maxNewTuit._id)
        await deleteUsersByUsername(max.username);
        await deleteUsersByUsername(sowell.username);
    })

    test('can retrieve tuit from REST API by primary key', async () => {
        // insert the user in the database
        const sowellUser = await findUserByCredentials({username: sowell.username, password: sowell.password});
        const maxUser = await findUserByCredentials({username: max.username, password: max.password});

        // Insert a new tuit for user sowell
        sowellNewTuit = await createTuit(sowellUser._id, sampleTuit);
        maxNewTuit = await createTuit(maxUser._id, maxTuit);

        let tuits = await findAllTuits();
        const tempTuit = tuits.filter(tuit => tuit.postedBy._id == sowellUser._id)[0];
        const tempTuit2 = tuits.filter(tuit => tuit.postedBy._id == maxUser._id)[0];

        expect(tempTuit.tuit).toEqual(sampleTuit.tuit);
        expect(tempTuit.postedOn).toEqual(sampleTuit.postedOn);
        expect(tempTuit.postedBy._id).toEqual(sowellUser._id);

        expect(tempTuit2.tuit).toEqual(maxNewTuit.tuit);
        expect(tempTuit2.postedOn).toEqual(maxNewTuit.postedOn);
        expect(tempTuit2.postedBy._id).toEqual(maxUser._id);
    });
});