import Tuits from "../tuits";
import * as service from "../../services/dislike-service";
import {useEffect, useState} from "react";

const MyDisLikes = () => {
    const [dislikedTuits, setDisLikedTuis] = useState([]);
    const findTuitsIDisLike = () =>
        service.findAllTuitsDislikedByUser("me")
            .then((tuits) => setDisLikedTuis(tuits));
    useEffect(findTuitsIDisLike, []);

    return (
        <div>
            <Tuits tuits={dislikedTuits} refreshTuits={findTuitsIDisLike}/>
        </div>
    );
};
export default MyDisLikes;