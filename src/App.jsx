import { useSelector } from "react-redux";
import ConfigurationFrom from "./components/ConfigrationForm/ConfigurationFrom"
import ShelvingConfigurator from "./components/ShelvingConfigurator/ShelvingConfigurator";
import './index.css'
import './App.css'

function App() {

  const showConfigurator = useSelector((state)=>state.shelfDetail.showConfigurator)
  return (
    <>
    {!showConfigurator ?
      (<ConfigurationFrom /> ) :
      (<ShelvingConfigurator/>)
    }
    
    </>
  )
}

export default App
