import getComponentPrice from "./getPrice";
import { calculateFormattedTotalPrice } from "./calculateFormattedTotalPrice";
import getDynamicPrice from "./getAPIPrice";
import getDynamicNmPrice from "./getNormalDynamicPricing";

export function calculateTotalPrice(details, priceData) {
  let total = 0;
  let color = details.racks.execution.color;
  let sections = details.racks.sections;
  let depth = details.racks.depth;

  // Calculate poles
  const polls = {};

  Object.keys(sections).forEach((key, index) => {
    const item = sections[key];
    if (index == 0) {
      if (item.standHeight == item.height) {
        polls[item.height] = (polls[item.height] ? polls[item.height] : 0) + 4;
      }
      if (item.standHeight != item.height) {
        polls[item.height] = (polls[item.height] ? polls[item.height] : 0) + 2;
        polls[item.standHeight] =
          (polls[item.standHeight] ? polls[item.standHeight] : 0) + 2;
      }
    } else {
      polls[item.standHeight] =
        (polls[item.standHeight] ? polls[item.standHeight] : 0) + 2;
    }
  });

  // Add poles price to total
  Object.entries(polls).forEach(([height, count]) => {
    const price = getDynamicNmPrice({
      priceData,
      material: color,
      component: "poles",
      height: parseInt(height),
      depth,
    });

    const totalPolePrice = calculateFormattedTotalPrice(price, count);
    total += totalPolePrice;
  });

  // calculate the count of poles
  const totalPoles = Object.values(polls).reduce(
    (sum, count) => sum + count,
    0
  );

  // Add topcaps price
  if (details.racks.execution.topCaps == "topCaps") {
    const topcapPrice = getDynamicNmPrice({
      priceData,
      material: color,
      component: "topCaps",
      depth,
    });
    const totalTopcapPrice = calculateFormattedTotalPrice(
      topcapPrice,
      totalPoles
    );
    total += totalTopcapPrice;
  }

  // Add foot price
  const footPrice = getDynamicNmPrice({
    priceData,
    material: color,
    component: "foot",
    depth,
  });
  const totalFootPrice = calculateFormattedTotalPrice(footPrice, totalPoles);
  total += totalFootPrice;

  // calculate shelf price
  Object.values(sections).forEach((section) => {
    const width = section.width;
    if (section.shelves) {
      // const price = getComponentPrice({
      //   material: color,
      //   component: "shelves",
      //   width,
      //   depth,
      // });
      const price = getDynamicNmPrice({
        priceData,
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
            // const price = getComponentPrice({
            //   material: color,
            //   component: "compartment",
            //   subtype: type,
            //   width,
            //   depth,
            // });

            const price = getDynamicNmPrice({
              priceData,
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

      // calculate wardrobe rod price
      Object.entries(section.shelves).forEach(([key, item]) => {
        if (key.includes('wardrobe_')) {
          const width = section.width;
          const price = getDynamicNmPrice({
            priceData,
            material: color,
            component: 'wardrobe_rod',
            width: Number(width),
            depth
          });
          total += calculateFormattedTotalPrice(price, 1);
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
        // const price = getComponentPrice({
        //   material: color,
        //   component: "sidewall",
        //   subtype: subType,
        //   height: leftRevDoorHeight == "50" ? leftRevDoorHeight : height,
        //   depth,
        // });
        const price = getDynamicNmPrice({
          priceData,
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
        // const price = getComponentPrice({
        //   material: color,
        //   component: "sidewall",
        //   subtype: subType,
        //   height: rightRevDoorHeight == "50" ? rightRevDoorHeight : height,
        //   depth,
        // });

        const price = getDynamicNmPrice({
          priceData,
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

  // Calculate braces price
  const sectionItems = Object.keys(sections);
  const hasHighSection = sectionItems
    .map((key) => sections[key].height)
    .find((item) => item > 220);

  sectionItems.forEach((key, index) => {
    const item = sections[key];
    const width = item.width;
    let braceType;

    if (hasHighSection || (item?.height >= 120 && index % 4 === 0)) {
      braceType = 'x-brace';
    } else {
      braceType = 'h-brace';
    }

    const price = getDynamicNmPrice({
      priceData,
      material: color,
      component: 'braces',
      subtype: braceType,
      width: Number(width)
    });
    total += calculateFormattedTotalPrice(price, 1);
  });

  return new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(total);
}
