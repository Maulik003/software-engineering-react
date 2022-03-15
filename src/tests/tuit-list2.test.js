import Tuits from "../components/tuits";
import {screen, render} from "@testing-library/react";
import {HashRouter} from "react-router-dom";
import axios from "axios";
import {findAllTuits} from "../services/tuits-service";

jest.mock('axios');

const MOCKED_TUITS = [
    {tuit: 'ellen_ripley tuit', postedOn: 'Dec 25, 2021', postedBy: 'ellen_ripley', _id: "789"},
    {tuit: 'sarah_conor tuit', postedOn: 'Dec 26, 2021', postedBy: 'sarah_conor', _id: "678"},
];

test('tuit list renders mocked', async () => {
    axios.get.mockImplementation(() =>
        Promise.resolve({data: {tuits: MOCKED_TUITS}}));
    const response = await findAllTuits();
    const tuits = response.tuits;

    render(
        <HashRouter>
            <Tuits tuits={tuits}/>
        </HashRouter>);

    const linkElement = screen.getByText(/ellen_ripley tuit/i);
    expect(linkElement).toBeInTheDocument();
});
