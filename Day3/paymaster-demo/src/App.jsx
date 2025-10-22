/**
 * App Component
 * 
 * Root component of the Paymaster Demo application.
 * Provides the main layout structure with header and content area.
 * 
 * @component
 */

import "./App.css"
import ClaimReward from "./components/ClaimReward"

/**
 * Main application component
 * 
 * @returns {JSX.Element} The main app layout with header and ClaimReward component
 */
function App() {
  return(
    <div className="app-container">
      {/* Application Header */}
      <header>
        <h1>Base Account <span className="highlight">Paymaster</span></h1>
        <p className="subtitle">Claim rewards with gasless transactions</p>
      </header>
      
      {/* Main Content Area */}
      <main>
        <ClaimReward/>
      </main>
    </div>
  )
}

export default App