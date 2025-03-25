import { useSelector } from "react-redux";
import ConfigurationFrom from "./components/ConfigrationForm/ConfigurationFrom"
import ShelvingConfigurator from "./components/ShelvingConfigurator/ShelvingConfigurator";


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
