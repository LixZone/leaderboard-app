import { useEffect, useState, useRef } from "react";
import "./App.css";

const initialPlayers = [
  "Alice", "Bob", "Charlie", "Diana", "Eliott", "Fatou", "Gwen",
  "Hugo", "Isa", "Jules", "Karim", "Léna", "Mina", "Noé", "Omar"
];

function App() {
  const [players, setPlayers] = useState(() => {
    const saved = localStorage.getItem("leaderboard");
    return saved ? JSON.parse(saved) : initialPlayers.map(name => ({ name, score: 0 }));
  });

  const [selectedPlayer, setSelectedPlayer] = useState("");
  const [newScore, setNewScore] = useState("");
  const prevOrder = useRef([]);

  // Sauvegarde l'ordre précédent avant chaque update
  useEffect(() => {
    prevOrder.current = [...players].sort((a, b) => b.score - a.score).map(p => p.name);
  }, [players]);

  useEffect(() => {
    localStorage.setItem("leaderboard", JSON.stringify(players));
  }, [players]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedPlayer || isNaN(newScore) || newScore === "") return;

    // Sauvegarde l'ordre avant update
    const before = [...players].sort((a, b) => b.score - a.score).map(p => p.name);

    // Met à jour le score
    const updated = players.map(player =>
      player.name === selectedPlayer
        ? { ...player, score: player.score + parseInt(newScore) }
        : player
    );

    // Trie après update
    const after = [...updated].sort((a, b) => b.score - a.score).map(p => p.name);

    // Cherche si le joueur est monté dans le classement
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

    // Retire l'animation après 1.2s
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

        <button type="submit">Ajouter</button>
      </form>

      <button className="reset" onClick={resetScores}>🔁 Réinitialiser</button>

      <table>
        <tbody>
          {sortedPlayers.map((player, index) => (
            <tr key={player.name} className={player.hasJustRisen ? "tr-rising" : ""}>
              <td>{index + 1}</td>
              <td>{player.name}</td>
              <td>{player.score > 0 ? `$${player.score}` : ""}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;