import Dashboard from './components/Dashboard.jsx'
import Chat from './components/Chat.jsx'
import './App.css'

function App() {
  return (
    <div className="app-container">
      <div className="dashboard-section">
        <Dashboard />
      </div>
      <div className="chat-section">
        <Chat />
      </div>
    </div>
  )
}

export default App
