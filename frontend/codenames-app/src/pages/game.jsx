import Board from '../components/board.jsx'

export default function Game() {
    const words = [
        "apple", "bridge", "crown", "dragon", "engine",
        "forest", "giant", "harbor", "island", "jungle",
        "knight", "laser", "mountain", "needle", "ocean",
        "piano", "queen", "rocket", "shadow", "tower",
        "umbrella", "village", "whale", "xray", "yacht"
    ]; /* later must fetch from backend*/

    return (
        <div>
            <Board wordlist={words} />
        </div>
    );

}