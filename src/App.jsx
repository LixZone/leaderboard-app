import { useEffect, useState, useRef } from "react";
import "./App.css";

const initialPlayers = [
  "Victoria", "Gabriel", "Laura", "La Mama", "El Papa", "Mélissa", "Arun",
  "Hugo", "Shirley", "Owaney", "Raphaël", "Enzo", "Stephan", "Aymeric", "Jerysan", "Arené", "Clément"
];

function App() {
  const [players, setPlayers] = useState(() => {
    const saved = localStorage.getItem("leaderboard");
    return saved ? JSON.parse(saved) : initialPlayers.map(name => ({ name, score: 0 }));
  });

  const [selectedPlayer, setSelectedPlayer] = useState("");
  const [newScore, setNewScore] = useState("");
  const [showInputs, setShowInputs] = useState(true);
  const prevOrder = useRef([]);

  useEffect(() => {
    prevOrder.current = [...players].sort((a, b) => b.score - a.score).map(p => p.name);
  }, [players]);

  useEffect(() => {
    localStorage.setItem("leaderboard", JSON.stringify(players));
  }, [players]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedPlayer || isNaN(newScore) || newScore === "") return;

    const before = [...players].sort((a, b) => b.score - a.score).map(p => p.name);

    // Met à jour le score en le remplaçant, pas en l'ajoutant
    const updated = players.map(player =>
      player.name === selectedPlayer
        ? { ...player, score: parseInt(newScore) }
        : player
    );

    const after = [...updated].sort((a, b) => b.score - a.score).map(p => p.name);

    const oldIndex = before.indexOf(selectedPlayer);
    const newIndex = after.indexOf(selectedPlayer);

    let withRise = updated;
    if (newIndex < oldIndex) {
      withRise = updated.map(player =>
        player.name === selectedPlayer
          ? { ...player, hasJustRisen: true }
          : { ...player, hasJustRisen: false }
      );
    } else {
      withRise = updated.map(player => ({ ...player, hasJustRisen: false }));
    }

    setPlayers(withRise);

    setTimeout(() => {
      setPlayers(current =>
        current.map(player => ({ ...player, hasJustRisen: false }))
      );
    }, 2200);

    setSelectedPlayer("");
    setNewScore("");
  };

  const resetScores = () => {
    if (window.confirm("Réinitialiser tous les scores ?")) {
      setPlayers(initialPlayers.map(name => ({ name, score: 0 })));
      localStorage.removeItem("leaderboard");
    }
  };

  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

  return (
    <div className="app">
      <h1>🏆 Classement Soirée Jeux</h1>

      <button
        className="button-style"
        onClick={() => setShowInputs(!showInputs)}
      >
        {showInputs ? "🙈 Cacher les entrées" : "👁️ Montrer les entrées"}
      </button>

    {showInputs && (
      <form onSubmit={handleSubmit}>
        <select
          value={selectedPlayer}
          onChange={(e) => setSelectedPlayer(e.target.value)}
        >
          <option value="">Choisir un joueur</option>
          {players.map((player) => (
            <option key={player.name} value={player.name}>
              {player.name}
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Score"
          value={newScore}
          onChange={(e) => setNewScore(e.target.value)}
        />

        <button type="submit" className="button-style">Ajouter</button>
      </form>
    )}
      <button className="button-style" onClick={resetScores}>🔁 Réinitialiser</button>

      <table>
        <tbody>
          {sortedPlayers.map((player, index) => (
            <tr key={player.name} className={player.hasJustRisen ? "tr-rising" : ""}>
              <td>{index + 1}</td>
              <td>{player.name}</td>
              <td>{player.score !== 0 ? `$${player.score}` : ""}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;