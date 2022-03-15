import Tuits from "../components/tuits";
import {screen, render} from "@testing-library/react";
import {HashRouter} from "react-router-dom";
import {findAllTuits} from "../services/tuits-service";

const MOCKED_TUITS = [
    {tuit: 'ellen_ripley tuit', postedOn: 'Dec 25, 2021', postedBy: 'ellen_ripley', _id: "789"},
    {tuit: 'sarah_conor tuit', postedOn: 'Dec 26, 2021', postedBy: 'sarah_conor', _id: "678"}
];

test('tuit list renders static tuit array', () => {
    render(
        <HashRouter>
            <Tuits tuits={MOCKED_TUITS}/>
        </HashRouter>);
    const linkElement = screen.getByText(/ellen_ripley tuit/i);
    expect(linkElement).toBeInTheDocument();
});

test('tuit list renders async', async () => {
    const sampleTuits = await findAllTuits();
    render(
        <HashRouter>
            <Tuits tuits={sampleTuits}/>
        </HashRouter>);

    // Test to verify using the length of array as there are multiple
    // occurrences of word SpaceX
    const tuitArray = screen.getAllByText(/@SpaceX/i);
    expect(tuitArray.length).toBeGreaterThanOrEqual(1);

    const linkElement = screen.getAllByText(/@SpaceX/i)[0];
    expect(linkElement).toBeInTheDocument();
});
