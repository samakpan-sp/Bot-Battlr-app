import React, { useState, useEffect } from 'react';
import BotCollection from './BotCollection';
import YourBotArmy from './YourBotArmy';
import './app.css';

function App() {
  const [availableBots, setAvailableBots] = useState([]);
  const [selectedBots, setSelectedBots] = useState([]);

  useEffect(() => {
    // Fetch data from the JSON server and update the state
    fetch('http://localhost:8001/bots')
      .then((response) => response.json())
      .then((data) => {
        setAvailableBots(data);
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  const addBotToArmy = (bot) => {
    // Add a bot to the selectedBots array
    if (!selectedBots.includes(bot)) {
      setSelectedBots([...selectedBots, bot]);
    }
  };

  const releaseBotFromArmy = (bot) => {
    // Remove a bot from the selectedBots array
    setSelectedBots(selectedBots.filter((b) => b !== bot));
  };

  const dischargeBotForever = (bot) => {
    // Remove a bot from both the server and the selectedBots array
    fetch(`http://localhost:8001/bots/${bot.id}`, {
      method: 'DELETE',
    })
      .then(() => {
        releaseBotFromArmy(bot);
        updateAvailableBots(bot); // Update availableBots
      })
      .catch((error) => console.error('Error deleting bot:', error));
  };
  

  // Callback function to update availableBots
  const updateAvailableBots = (removedBot) => {
    // Create a new array excluding the removed bot
    const updatedBots = availableBots.filter((bot) => bot.id !== removedBot.id);
    setAvailableBots(updatedBots);
  };

  return (
    <div className="App">
      <h1>Bot Battlr</h1>
      <div className="container">
        <BotCollection bots={availableBots} addBotToArmy={addBotToArmy} />
        <YourBotArmy
          selectedBots={selectedBots}
          releaseBotFromArmy={releaseBotFromArmy}
          dischargeBotForever={dischargeBotForever}
        />
      </div>
    </div>
  );
}

export default App;
