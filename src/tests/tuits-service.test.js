import {createUser, deleteUsersByUsername, findAllUsers, findUserById} from "../services/users-service";
import {createTuit, deleteTuit, findAllTuits, findTuitById, updateTuit} from "../services/tuits-service";

describe('can create tuit with REST API', () => {
    // sample user to insert
    const ripley = {
        username: 'ellenripley',
        password: 'lv426',
        email: 'ellenripley@aliens.com'
    };

    // sample tuit to insert
    const sampleTuit = {
        tuit: "test tuit",
        postedOn: "2021-12-25T05:00:00.000Z",
        postedBy: "ellenripley"
    };

    // setup test before running test
    beforeAll(() => {
        // remove any/all users to make sure we create it in the test
        return deleteUsersByUsername(ripley.username);
    })

    // clean up after test runs
    afterAll(() => {
        // remove any data we created
        return deleteUsersByUsername(ripley.username);
    })

    test('can insert new tuit with REST API', async () => {
        // insert new user in the database
        const newUser = await createUser(ripley);
        const newTuit = await createTuit(newUser._id, sampleTuit);

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
        postedBy: "thommas_sowell"
    };

    // setup the tests before verification
    beforeAll(() => {
        // remove any/all users to make sure we create it in the test
        return deleteUsersByUsername(sowell.username);
    });

    // clean up after test runs
    afterAll(() => {
        // remove any data we created
        return deleteUsersByUsername(sowell.username);
    })

    test('can delete tuit from REST API by tuit id tid', async () => {

        // insert new user in the database
        const newUser = await createUser(sowell);
        // Insert a new tuit for user sowell
        const newTuit = await createTuit(newUser._id, sampleTuit);
        // delete a user by their username. Assumes user already exists
        const status = await deleteTuit(newTuit._id);

        // verify we deleted at least one tuit by their tuit id
        expect(status.deletedCount).toBeGreaterThanOrEqual(1);
    });
});

describe('can retrieve a tuit by their primary key with REST API', () => {

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
        postedBy: "thommas_sowell"
    };

    // setup the tests before verification
    beforeAll(() => {
        // remove any/all users to make sure we create it in the test
        return deleteUsersByUsername(sowell.username);
    });

    // clean up after test runs
    afterAll(() => {
        // remove any data we created
        return deleteUsersByUsername(sowell.username);
    })

    test('can retrieve tuit from REST API by primary key', async () => {
        // insert the user in the database
        const newUser = await createUser(sowell);

        // verify new user matches the parameter user
        expect(newUser.username).toEqual(sowell.username);
        expect(newUser.password).toEqual(sowell.password);
        expect(newUser.email).toEqual(sowell.email);

        // Insert a new tuit for user sowell
        const newTuit = await createTuit(newUser._id, sampleTuit);

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

        deleteTuit(newTuit._id)
    });

});

describe('can retrieve all tuits with REST API', () => {

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
        postedBy: "thommas_sowell"
    };

    // sample tuit
    const maxTuit = {
        tuit: "max test tuit",
        postedOn: "2021-12-25T05:00:00.000Z",
        postedBy: "max"
    };

    // setup the tests before verification
    beforeAll(() => {
        // remove any/all users to make sure we create it in the test
        deleteUsersByUsername(max.username);
        deleteUsersByUsername(sowell.username);
    });

    // clean up after test runs
    afterAll(() => {
        // remove any data we created
        deleteUsersByUsername(max.username);
        deleteUsersByUsername(sowell.username);
    })

    test('can retrieve tuit from REST API by primary key', async () => {
        // insert the user in the database
        const sowellUser = await createUser(sowell);
        const maxUser = await createUser(max);

        // Insert a new tuit for user sowell
        const sowellNewTuit = await createTuit(sowellUser._id, sampleTuit);
        const maxNewTuit = await createTuit(maxUser._id, maxTuit);

        let tuits = await findAllTuits();
        const tempTuit = tuits.filter(tuit => tuit.postedBy._id == sowellUser._id)[0];
        const tempTuit2 = tuits.filter(tuit => tuit.postedBy._id == maxUser._id)[0];

        expect(tempTuit.tuit).toEqual(sampleTuit.tuit);
        expect(tempTuit.postedOn).toEqual(sampleTuit.postedOn);
        expect(tempTuit.postedBy._id).toEqual(sowellUser._id);

        expect(tempTuit2.tuit).toEqual(maxNewTuit.tuit);
        expect(tempTuit2.postedOn).toEqual(maxNewTuit.postedOn);
        expect(tempTuit2.postedBy._id).toEqual(maxUser._id);

        deleteTuit(sowellNewTuit._id)
        deleteTuit(maxNewTuit._id)
    });
});