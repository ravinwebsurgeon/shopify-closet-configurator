import getComponentPrice from "./getPrice";
import { calculateFormattedTotalPrice } from "./calculateFormattedTotalPrice";

export function calculateTotalPrice(details) {
  let total = 0;
  let color = details.racks.execution.color;
  let sections = details.racks.sections;
  let depth = details.racks.depth;

  // calculate shelf price
  Object.values(sections).forEach((section) => {
    const width = section.width;
    if (section.shelves) {
      const price = getComponentPrice({
        material: color,
        component: "shelves",
        width,
        depth,
      });

      const shelfCount = Object.keys(section.shelves).filter((key) =>
        key.includes("shelves")
      ).length;

      let totalSectionPrice = calculateFormattedTotalPrice(price, shelfCount);
      total += totalSectionPrice;

      // compartments prices
      Object.values(section.shelves).forEach((item) => {
        if (item.compartments) {
          const { type, count } = item.compartments;

          if (type && count > 0) {
            const price = getComponentPrice({
              material: color,
              component: "compartment",
              subtype: type,
              width,
              depth,
            });

            const totalCompartmentPrice = calculateFormattedTotalPrice(
              price,
              count
            );
            total += totalCompartmentPrice;
          }
        }
      });

      // drawers prices
      Object.values(section.shelves).forEach((item) => {
        let width = section.width;
        if (item.drawer) {
          const { position } = item.drawer;

          if (Object.keys(position).length > 0) {
            const price = getComponentPrice({
              material: color,
              component: "drawer",
              width,
              depth,
            });

            const totalCompartmentPrice = calculateFormattedTotalPrice(
              price,
              1
            );
            total += totalCompartmentPrice;
          }
        }
      });
    }

    // calculate sidewalls price
    if (section.sideWall) {
      let height = section.height;
      if (section.sideWall.left.isLeft) {
        let subType = section.sideWall.left.type;
        let leftRevDoorHeight = section.sideWall.left.height;
        const price = getComponentPrice({
          material: color,
          component: "sidewall",
          subtype: subType,
          height: leftRevDoorHeight == "50" ? leftRevDoorHeight : height,
          depth,
        });

        let leftSideWallPrice = calculateFormattedTotalPrice(price, 1);
        // if (section.sideWall.left.height == "50") {
        //   total += Math.floor(leftSideWallPrice / 2);
        // } else {
          total += leftSideWallPrice;
        // }
      }
      if (section.sideWall.right.isRight) {
        let subType = section.sideWall.right.type;
        let rightRevDoorHeight = section.sideWall.right.height;
        const price = getComponentPrice({
          material: color,
          component: "sidewall",
          subtype: subType,
          height: rightRevDoorHeight == "50" ? rightRevDoorHeight : height,
          depth,
        });

        let rightSideWallPrice = calculateFormattedTotalPrice(price, 1);
        // if (section.sideWall.right.height == "50") {
        //   total += Math.floor(rightSideWallPrice / 2);
        // } else {
          total += rightSideWallPrice;
        //}
      }
    }

    // calculate backwall price
    if (section?.backWall) {
      let height = section.height;
      let width = section.width;
      let subType = section.backWall?.type;
      if (subType) {
        const price = getComponentPrice({
          material: color,
          component: "backwall",
          subtype: subType,
          height,
          width,
        });

        let backWallPrice = calculateFormattedTotalPrice(price, 1);
        if (section.backWall.height == "50") {
          if (subType == "perfo") {
            total += 25.35;
          } else {
            total += 18.55;
          }
        } else {
          total += backWallPrice;
        }
      }
    }

    // calculate revolving door price
    if (
      section.revolvingDoor &&
      Object.keys(section.revolvingDoor).length > 0
    ) {
      let width = section.width;
      Object.values(section.revolvingDoor).forEach((door) => {
        const { height, position, type } = door;
        const doorHeight = type.split("_")[3] == "50" ? 50 : 100;
        const price = getComponentPrice({
          material: color,
          component: "revolving_door",
          subtype: type,
          height: doorHeight,
          width,
        });
        let revolvingDoorPrice = calculateFormattedTotalPrice(price, 1);
        total += revolvingDoorPrice;
      });
    }
  });

  return new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(total);
}
