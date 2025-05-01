const revDoorData = {
  "set oak 50": "Deurenset Eik natuur 50cm hoog",
  "set oak 100": "Deurenset Eik natuur 100cm hoog",
  "set white 50": "Deurenset Wit 50cm hoog",
  "set white 100": "Deurenset Wit 100cm hoog",
  "set metal 50": "Deurenset Metaal 50cm hoog",
  "set metal 100": "Deurenset Metaal 100cm hoog",
};

const slideDoorData = {

};

function getRevDoorLabel(key) {
  return revDoorData[key] || "";
};

function getSlidingDoorLabel(key){
    return slideDoorData[key] || ""
};

export { getRevDoorLabel , getSlidingDoorLabel};
