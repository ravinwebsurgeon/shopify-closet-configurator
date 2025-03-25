import React, { useState } from 'react'
import'./ConfigurationTab.css'
const ConfigurationTab = () => {
    const [activeTab,setActiveTab] = useState('dimensions')
    
    const configTabs = [
        { id: 'dimensions', label: 'Dimensions' },
        { id: 'execution', label: 'Execution' },
        { id: 'shelves', label: 'Shelves' },
        { id: 'sides', label: 'Sides' },
        { id: 'backwalls', label: 'Back walls' },
        { id: 'compartments', label: 'Compartments' },
        { id: 'revolvingdoors', label: 'Revolving doors' },
        { id: 'slidingdoors', label: 'Sliding doors' },
        { id: 'drawers', label: 'Drawers' },
        { id: 'wardroberods', label: 'Wardrobe rods' },
      ];

  return (
    <div className="configuration-options">
      <div className="config-tabs">
        {configTabs.map((tab) => (
          <button
            key={tab.id}
            className={`config-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="config-content">
        {/* {renderTabContent()} */}
        <p>Hello from config Tabs </p>
      </div>
    </div>
  )
}

export default ConfigurationTab
