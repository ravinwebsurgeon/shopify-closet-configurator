import { calculateFormattedTotalPrice } from "./calculateFormattedTotalPrice";
import getDynamicPrice from "./getAPIPrice";
import { getRevDoorLabel } from "./getDoorLabel";
import getComponentPrice from "./getPrice";

export function generateBOM(details, priceData,format=true) {
  const bomList = [];
  const regularShelfMap = new Map();
  const topSupportMap = new Map();
  const sidewallMap = new Map();
  const backwallMap = new Map();
  const compartmentMap = new Map();
  const revolvingDoorMap = new Map();
  const drawerMap = new Map();
  const poleMap = new Map();
  const braceMap = new Map();
  const wardrobeRodMap = new Map();
  const color = details.racks.execution.color;
  const depth = details.racks.depth;
  const sections = details.racks.sections;
  let leftRevDoorHeight = "";
  let rightRevDoorHeight = "";

  // Calculate braces
  const sectionItems = Object.keys(sections);
  const heights = sectionItems
    .map((key) => sections[key].height)
    .find((item) => item > 220);

  if (!heights) {
    sectionItems.forEach((key, index) => {
      const item = sections[key];
      const width = item.width;
      if (item?.height >= 120 && index % 4 === 0) {
        const braceKey = `x_brace-${width}`;
        braceMap.set(braceKey, (braceMap.get(braceKey) || 0) + 1);
      } else {
        const braceKey = `h_brace-${width}`;
        braceMap.set(braceKey, (braceMap.get(braceKey) || 0) + 1);
      }
    });
  } else {
    sectionItems.forEach((key) => {
      const width = sections[key].width;
      const braceKey = `x_brace-${width}`;
      braceMap.set(braceKey, (braceMap.get(braceKey) || 0) + 1);
    });
  }

  // Process each section
  Object.entries(sections).forEach(([sectionId, section]) => {
    const width = section.width;

    // Process shelves and compartments
    if (section.shelves) {
      Object.entries(section.shelves).forEach(([key, shelf]) => {
        if (key.includes("shelves")) {
          const isTopSupport = shelf.position.top === "0em";
          const dimensionKey = `${width}x${depth}`;
          const targetMap = isTopSupport ? topSupportMap : regularShelfMap;

          // Update shelf count in the appropriate map
          if (targetMap.has(dimensionKey)) {
            targetMap.set(dimensionKey, targetMap.get(dimensionKey) + 1);
          } else {
            targetMap.set(dimensionKey, 1);
          }
        }

        // process wardrobeRods
        if (key.includes("wardrobe_")) {
          const width = section.width;
          const dimensionKey = `${width}x${depth}`;
          const count = wardrobeRodMap.get(dimensionKey) || 0;
          wardrobeRodMap.set(dimensionKey, count + 1);
        }

        // Process drawers if they exist
        if (shelf.drawer && Object.keys(shelf.drawer.position).length > 0) {
          const dimensionKey = `${width}x${depth}`;
          const count = drawerMap.get(dimensionKey) || 0;
          drawerMap.set(dimensionKey, count + 1);
        }

        // Process compartments if they exist
        if (shelf.compartments) {
          const { type, count } = shelf.compartments;
          if (type && count > 0) {
            let dimensionKey;
            if (type === "sliding_partition") {
              dimensionKey = `${depth}-${type}`;
            } else if (type === "compartment_divider_set") {
              dimensionKey = `${width}x${depth}-${type}`;
            }

            if (dimensionKey) {
              const currentCount = compartmentMap.get(dimensionKey) || 0;
              compartmentMap.set(dimensionKey, currentCount + count);
            }
          }
        }
      });
    }
  });

  // Process regular shelves
  regularShelfMap.forEach((quantity, dimensions) => {
    const [width, depth] = dimensions.split("x").map(Number);
    const price = getDynamicPrice({
      priceData,
      format,
      material: color,
      component: "shelves",
      width,
      depth,
    });

    bomList.push({
      component: `${`Legbord met dragers ${
        color == "black" ? "(zwart)" : ""
      }`}`,
      dimensions: `${width - 2} x ${depth} cm`,
      quantity: quantity,
      unitPrice: price,
      totalPrice: calculateFormattedTotalPrice(price, quantity,format),
    });
  });

  // Process top support shelves separately
  topSupportMap.forEach((quantity, dimensions) => {
    const [width, depth] = dimensions.split("x").map(Number);
    const price = getDynamicPrice({
      priceData,
      format,
      material: color,
      component: "shelves",
      width,
      depth,
    });

    bomList.push({
      component: `${`Legbord met topdragers ${
        color == "black" ? "(zwart)" : ""
      }`}`,
      dimensions: `${width - 2} x ${depth} cm`,
      quantity: quantity,
      unitPrice: price,
      totalPrice: calculateFormattedTotalPrice(price, quantity,format),
    });
  });

  // Process sidewalls
  Object.entries(sections).forEach(([sectionId, section]) => {
    if (section.sideWall) {
      const height = section.height;
      if (section.sideWall.left.isLeft) {
        const subType = section.sideWall.left.type;
        leftRevDoorHeight = section.sideWall.left.height;
        const heightToUse = leftRevDoorHeight == "50" ? 50 : section.height;
        const dimensionKey = `${heightToUse}x${depth}-${subType}`;
        const count = sidewallMap.get(dimensionKey) || 0;
        sidewallMap.set(dimensionKey, count + 1);
      }
      if (section.sideWall.right.isRight) {
        const subType = section.sideWall.right.type;
        rightRevDoorHeight = section.sideWall.right.height;
        const heightToUse = rightRevDoorHeight == "50" ? 50 : section.height;
        const dimensionKey = `${heightToUse}x${depth}-${subType}`;
        const count = sidewallMap.get(dimensionKey) || 0;
        sidewallMap.set(dimensionKey, count + 1);
      }
    }
  });

  // Add sidewalls to BOM list
  sidewallMap.forEach((quantity, dimensions) => {
    const [heightDepth, subType] = dimensions.split("-");
    const [height, depth] = heightDepth.split("x").map(Number);
    const price = getDynamicPrice({
      priceData,
      format,
      material: color,
      component: "sidewall",
      subtype: subType,
      height,
      depth,
    });

    bomList.push({
      component: `${
        subType == "perfo"
          ? `Open zijwand ${color == "black" ? "(zwart)" : ""}`
          : `Dichte zijwand ${color == "black" ? "(zwart)" : ""}`
      }`,
      dimensions: `${height} x ${depth} cm`,
      quantity: quantity,
      unitPrice: price,
      totalPrice: calculateFormattedTotalPrice(price, quantity,format),
    });
  });

  // Process backwalls
  Object.entries(sections).forEach(([sectionId, section]) => {
    if (section?.backWall) {
      const height = section.height;
      const width = section.width;
      const subType = section.backWall?.type;
      if (subType) {
        const dimensionKey = `${height}x${width}-${subType}`;
        const count = backwallMap.get(dimensionKey) || 0;
        backwallMap.set(dimensionKey, count + 1);
      }
    }
  });

  // Add backwalls to BOM list
  backwallMap.forEach((quantity, dimensions) => {
    const [heightWidth, subType] = dimensions.split("-");
    const [height, width] = heightWidth.split("x").map(Number);
    const price = getComponentPrice({
      material: color,
      component: "backwall",
      subtype: subType,
      height,
      width,
    });

    bomList.push({
      component: `Achterwand (${subType}) ${color == "black" ? "(zwart)" : ""}`,
      dimensions: `${height} x ${width - 2} cm`,
      quantity: quantity,
      unitPrice: price,
      totalPrice: calculateFormattedTotalPrice(price, quantity,format),
    });
  });

  // Process compartments
  compartmentMap.forEach((quantity, dimensions) => {
    const [sizePart, type] = dimensions.split("-");
    let component, displayDimensions, price;

    if (type === "sliding_partition") {
      component = "Sliding Partition";
      displayDimensions = `${sizePart} cm`;
      price = getDynamicPrice({
        priceData,
        format,
        material: color,
        component: "compartment",
        subtype: type,
        depth: Number(sizePart),
      });
    } else if (type === "compartment_divider_set") {
      const [width, depth] = sizePart.split("x").map(Number);
      component = "Compartment Divider Set";
      displayDimensions = `${width - 2} x ${depth} cm`;
      price = getDynamicPrice({
        priceData,
        format,
        material: color,
        component: "compartment",
        subtype: type,
        width,
        depth,
      });
    }

    bomList.push({
      component: `${
        component == "Sliding Partition"
          ? `Schuifschot hoog ${color == "black" ? "(zwart)" : ""}`
          : `Vakverdeelset ${color == "black" ? "(zwart)" : ""}`
      }`,
      dimensions: displayDimensions,
      quantity,
      unitPrice: price,
      totalPrice: calculateFormattedTotalPrice(price, quantity,format),
    });
  });

  // process revolving doors
  Object.entries(sections).forEach(([sectionId, section]) => {
    if (
      section?.revolvingDoor &&
      Object.keys(section.revolvingDoor).length > 0
    ) {
      const width = section.width;
      Object.values(section.revolvingDoor).forEach((door) => {
        const { type } = door;
        const dimensionKey = `${width}-${type}`;
        const count = revolvingDoorMap.get(dimensionKey) || 0;
        revolvingDoorMap.set(dimensionKey, count + 1);
      });
    }
  });

  //Add revolving door to BOM list
  revolvingDoorMap.forEach((quantity, dimensions) => {
    const [width, type] = dimensions.split("-");
    const doorHeight = type.split("_")[3] == "50" ? 50 : 100;
    const price = getComponentPrice({
      material: color,
      component: "revolving_door",
      subtype: type,
      height: doorHeight,
      width: Number(width),
    });

    bomList.push({
      component: `${getRevDoorLabel(type.split("_").slice(1).join(" "))}
      ${
        color === "black" &&
        type.split("_").slice(1).join(" ").includes("set metal")
          ? "(zwart)"
          : ""
      }`,
      dimensions: `${width - 2} x ${depth} cm`,
      quantity,
      unitPrice: price,
      totalPrice: calculateFormattedTotalPrice(price, quantity),
    });
  });
  // Process drawers
  drawerMap.forEach((quantity, dimensions) => {
    const [width, depth] = dimensions.split("x").map(Number);
    const price = getComponentPrice({
      material: color,
      component: "drawer",
      width,
      depth,
    });

    bomList.push({
      component: `Lade met dragers ${color == "black" ? "(zwart)" : ""}`,
      dimensions: `${width - 2} x ${depth} cm`,
      quantity,
      unitPrice: price,
      totalPrice: calculateFormattedTotalPrice(price, quantity),
    });
  });

  // Process poles
  Object.entries(sections).forEach(([key, item], index) => {
    if (index === 0) {
      if (item.standHeight === item.height) {
        poleMap.set(item.height, (poleMap.get(item.height) || 0) + 4);
      } else {
        poleMap.set(item.height, (poleMap.get(item.height) || 0) + 2);
        poleMap.set(item.standHeight, (poleMap.get(item.standHeight) || 0) + 2);
      }
    } else {
      poleMap.set(item.standHeight, (poleMap.get(item.standHeight) || 0) + 2);
    }
  });

  // Add poles to BOM list
  poleMap.forEach((quantity, height) => {
    const price = getDynamicPrice({
      priceData,
      format,
      material: color,
      component: "poles",
      height: parseInt(height),
      depth,
    });

    bomList.push({
      component: `Staander ${color === "black" ? "(zwart)" : ""}`,
      dimensions: `${height} cm`,
      quantity,
      unitPrice: price,
      totalPrice: calculateFormattedTotalPrice(price, quantity,format),
    });
  });

  // Calculate total poles for topcaps and foot
  const totalPoles = Array.from(poleMap.values()).reduce(
    (sum, count) => sum + count,
    0
  );

  // Add topcaps if specified
  if (details.racks.execution.topCaps === "topCaps") {
    const topcapPrice = getDynamicPrice({
      priceData,
      format,
      material: color,
      component: "topCaps",
      depth,
    });

    bomList.push({
      component: `Topdop`,
      dimensions: "(plastic)",
      quantity: totalPoles,
      unitPrice: topcapPrice,
      totalPrice: calculateFormattedTotalPrice(topcapPrice, totalPoles,format),
    });
  }

  // Add foot to BOM List
  const footPrice = getDynamicPrice({
    priceData,
    format,
    material: color,
    component: "foot",
    depth,
  });

  bomList.push({
    component: `Voetje`,
    dimensions: "(plastic)",
    quantity: totalPoles,
    unitPrice: footPrice,
    totalPrice: calculateFormattedTotalPrice(footPrice, totalPoles,format),
  });

  // Add braces to BOM list
  braceMap.forEach((quantity, key) => {
    const [braceType, width] = key.split("-");
    const price = getDynamicPrice({
      priceData,
      format,
      material: color,
      component: "braces",
      subtype: braceType === "x_brace" ? "x-brace" : "h-brace",
      width: Number(width),
    });

    bomList.push({
      component: `${braceType === "x_brace" ? "X-schoor" : "H-schoor"} ${
        color === "black" ? "(zwart)" : ""
      }`,
      dimensions: `${width} cm`,
      quantity,
      unitPrice: price,
      totalPrice: calculateFormattedTotalPrice(price, quantity,format),
    });
  });

  // Add wardrobe rods to BOM list
  wardrobeRodMap.forEach((quantity, dimensions) => {
    const [width, depth] = dimensions.split("x").map(Number);
    const price = getDynamicPrice({
      priceData,
      format,
      material: color,
      component: "wardrobe_rod",
      width: Number(width),
      depth,
    });

    bomList.push({
      component: `Garderobestang `,
      dimensions: `${width - 2} x ${depth} cm`,
      quantity,
      unitPrice: price,
      totalPrice: calculateFormattedTotalPrice(price, quantity,format),
    });
  });

  // Sort BOM list by dimensions
  //bomList.sort((a, b) => a.dimensions.localeCompare(b.dimensions));
  return bomList;
}
