import Tuits from "../components/tuits";
import {screen, render} from "@testing-library/react";
import {HashRouter} from "react-router-dom";
import axios from "axios";
import {findAllTuitsDislikedByUser} from "../services/dislike-service";


const mock = jest.spyOn(axios, 'get');

const MOCKED_DISLIKED_TUITS = [

    {
        _id: "12345",
        tuit: "Random tuit 1",
        postedBy: "ABC",
        postedOn: "2022-02-26T00:00:00.000+00:00",
        stats: {
            dislikes: 1,
            likes: 1,
            replies: 0,
            retuits: 0
        }
    }

    ,

    {
        _id: "98765",
        tuit: "Random tuit 2",
        postedBy: "XYZ",
        postedOn: "2022-02-26T00:00:00.000+00:00",
        stats: {
            dislikes: 1,
            likes: 1,
            replies: 0,
            retuits: 0
        }
    }
];


test('tuit list renders static disliked tuits array', () => {
    render(
        <HashRouter>
            <Tuits tuits={MOCKED_DISLIKED_TUITS}/>
        </HashRouter>
    );
    const linkElement = screen.getByText(/Random tuit 1/i);
    expect(linkElement).toBeInTheDocument();
});

test('list of disliked tuit renders mocked', async () => {
    axios.get.mockImplementation(() =>
        Promise.resolve({data: {tuits: MOCKED_DISLIKED_TUITS}}));
    const res = await findAllTuitsDislikedByUser("XYZ");
    const tuit2 = res.tuits;

    render(
        <HashRouter>
            <Tuits tuits={tuit2}/>
        </HashRouter>);

    const tuit = screen.getByText(/Random tuit 2/i);
    expect(tuit).toBeInTheDocument();
});


test('tuits disliked lists that are rendered on my screen', async () => {
    mock.mockRestore();
    const tuits = await findAllTuitsDislikedByUser("ABC")
    render(
        <HashRouter>
            <Tuits tuits={tuits}/>
        </HashRouter>);
    const linkElement = screen.getByText(/Random tuit 1/i);
    expect(linkElement).toBeInTheDocument();
})