import React, { useState, useEffect, useRef } from "react";
import _ from "lodash";
import "./style.css";

import { Responsive, WidthProvider } from "react-grid-layout";

const ResponsiveReactGridLayout = WidthProvider(Responsive);
const originalLayouts = getFromLS("layouts") || {};
function getFromLS(key) {
  let ls = {};
  if (global.localStorage) {
    try {
      ls = JSON.parse(global.localStorage.getItem("rgl")) || {};
    } catch (e) {
      /*Ignore*/
    }
  }
  return ls[key];
}

function saveToLS(key, value) {
  if (global.localStorage) {
    global.localStorage.setItem(
      "rgl",
      JSON.stringify({
        [key]: value,
      })
    );
  }
}

const calculateCellWidth = (col, gap, screenWidth) => {
  const cellWidth = (screenWidth - gap * (col - 1)) / col;
  return cellWidth;
};

const calCol = (col) => {
  if (col == 26) {
    return 4;
  }
  if (col == 14) {
    return 5;
  }
  if (col == 8) {
    return 6;
  }
  if (col == 6) {
    return 7;
  }
  if (col == 3) {
    return 13;
  }
  return 0;
};

const PlaceholderCell = ({
  col = 26,
  width = 1,
  height = 1,
  size,
  color = "#CCCCCC",
}) => {
  const [hovered, setHovered] = useState(false);

  const handleMouseEnter = () => {
    setHovered(true);
  };

  const handleMouseLeave = () => {
    setHovered(false);
  };

  const cellWidth = calculateCellWidth(col, 10, size.width) - calCol(col);

  const style = {
    width: `${cellWidth * width + 10 * (width - 1)}px`,
    height: `${height * 96}px`,
    backgroundColor: `${color}`,
    borderRadius: "10px",
    boxShadow: `${
      hovered
        ? "rgb(38, 57, 77) 0px 20px 30px -10px"
        : "rgba(0, 0, 0, 0.24) 0px 3px 8px"
    }`,
    opacity: `${hovered ? 0.7 : 1}`,
    transition: "all 0.3s ease-in-out",
  };

  return (
    <div
      className="placeholder-cell"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={style}
    ></div>
  );
};

const DragFromOutsideLayout = ({ rowHeight = 96 }) => {
  const [compactType, setCompactType] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [col, setCol] = useState(26);
  const [size, setSize] = useState({
    width: 0,
    height: window.innerHeight,
  });

  const ref = useRef();
  const refGrid = useRef();
  const [layoutCells, setLayoutCells] = useState([]);
  const [layouts, setLayouts] = useState({
    lg: [],
    ...JSON.parse(JSON.stringify(originalLayouts)),
  });
  const [isDragging, setIsDragging] = useState(false);
  const [itemDragging, setItemDragging] = useState({});

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const clientHeight = refGrid?.current?.elementRef?.current?.style?.height;
    const numberHeight = Number(clientHeight.replace("px", ""));
    setSize((prev) => ({
      ...prev,
      height: numberHeight > prev.height ? numberHeight + 576 : prev.height,
    }));
  }, []);


  useEffect(() => {
    const updateLayoutCell = () => {
      const gap = 10;
      const cellHeight = 96;
      const numRows = Math.floor((size.height - gap) / (cellHeight + gap));
      const layouts = [];
      let i = 0;
      for (let y = 0; y < numRows; y++) {
        for (let x = 0; x < col; x++) {
          const newLayout = {
            i: i.toString(),
            x: x,
            y: y,
            w: 1,
            h: 1,
          };
          layouts.push(newLayout);
          i++;
        }
      }
      setLayoutCells(layouts);
    };
    updateLayoutCell();
    window.addEventListener("resize", updateLayoutCell);
    return () => {
      window.removeEventListener("resize", updateLayoutCell);
    };
  }, [size]);

  const onDropHandler = (layout, layoutItem, _event) => {
    _event.preventDefault();
    const data = JSON.parse(_event.dataTransfer.getData("text"));
    console.log("444444 layout", layout);
    console.log("444444 layoutItem", layoutItem);

    const changed = {
      ...data,
      x: layoutItem.x,
      y: layoutItem.y,
      w: layoutItem.w,
      h: layoutItem.h,
    };
    const newLayout = [changed];
    setLayouts((prev) => ({ ...prev, lg: [...prev.lg, ...newLayout] }));
  };

  const onDragStop = (layout, oldItem, newItem) => {
    const itemOfState = layouts.lg.find((item) => item.i == oldItem.i);
    const reItem = { ...itemOfState, x: newItem.x, y: newItem.y };
    // setLayouts((prev) => ({
    //   ...prev,
    //   lg: prev.lg.map((item) => {
    //     if (item.i == reItem.i) {
    //       return reItem;
    //     }
    //     return item;
    //   }),
    // }));
  };

  useEffect(() => {
    const updateCellCount = () => {
      const screenWidth = window.innerWidth - 348;
      if (screenWidth >= 1200) {
        // lg
        setCol(26);
      } else if (screenWidth >= 992) {
        // md
        setCol(14);
      } else if (screenWidth >= 768) {
        //sm
        setCol(8);
      } else if (screenWidth >= 576) {
        // xs
        setCol(6);
      } else {
        // xxs
        setCol(3);
      }
      setSize((prev) => ({ ...prev, width: screenWidth }));
    };
    window.addEventListener("resize", updateCellCount);
    updateCellCount();
    return () => {
      window.removeEventListener("resize", updateCellCount);
    };
  }, []);

  const generateLayoutCells = () => {
    return layoutCells.map((item, i) => (
      <div key={i} data-grid={item} style={{borderRadius: 10, background: '#fafafa', marginRight: 2}}>
        <PlaceholderCell
          col={col}
          width={item.w}
          height={item.h}
          color="#FFF"
          index={{ x: item.x, y: item.y, i }}
          size={size}
        />
      </div>
    ));
  };
  const generateWidgets = () => {
    let cellWidth = calculateCellWidth(col, 10, size.width);
    cellWidth = cellWidth;
    return layouts.lg.map((item, i) => (
      <div
        key={i}
        data-grid={{
          x: item?.x,
          y: item?.y,
          w: item?.w,
          h: item?.h,
          i: item.i,
          minW: 3,
          maxW: Infinity,
          minH: 1,
          maxH: Infinity,
          isDraggable: true,
          isResizable: true,
        }}
        className="widget"
        style={{
          width: item.w * cellWidth,
          height: item.h * 101,
        }}
      >
        {i}
      </div>
    ));
  };

  const onResizeStop = (layout, oldItem, newItem) => {
    const itemOfState = layouts.lg.find((item) => item.i == oldItem.i);
    const reItem = { ...itemOfState, w: newItem.w, h: newItem.h };
    // setLayouts((prev) => ({
    //   ...prev,
    //   lg: prev.lg.map((item) => {
    //     if (item.i == reItem.i) {
    //       return reItem;
    //     }
    //     return item;
    //   }),
    // }));
  };

  const handleDragStart = (event) => {
    setIsDragging(true);
    event.dataTransfer.setData(
      "text",
      JSON.stringify({
        x: 2,
        y: 0,
        w: 4,
        h: 2,
        isResizable: true,
      })
    );
    setItemDragging({
      x: 2,
      y: 0,
      w: 4,
      h: 2,
      isResizable: true,
    });
  };

  const handleDragEnd = (event) => {
    setIsDragging(false);
  };
  const arrayWidget = [
    {
      id: 1,
      name: "onOffButton",
    },
  ];
  const onLayoutChange = (layout, layoutss) => {
    const clientHeight = refGrid?.current?.elementRef?.current?.style?.height;
    const numberHeight = Number(clientHeight.replace("px", ""));
    setSize((prev) => ({
      ...prev,
      height: numberHeight > prev.height ? numberHeight + 576 : prev.height,
    }));
    // for(let i in layoutss) {
    //   console.log('44444', layoutss[i])
    // }
    // saveToLS("layouts", layouts);
    !isDragging && setLayouts({ ...layoutss });
  };
  return (
    <div style={{ display: "flex" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: 328,
          padding: 10,
          overflow: "auto",
          height: 600,
        }}
      >
        <div
          id={"1"}
          className="droppable-element"
          draggable
          unselectable="on"
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          style={{ width: "100%", height: 96 }}
        >
          Droppable Element (Drag me!)
        </div>
      </div>

      <div style={{ display: "display", flex: 1 }}>
        <div
          className="grid-container"
          style={{
            gridTemplateColumns: `repeat(${col}, 1fr)`,
            height: size.height,
          }}
          ref={ref}
        >
          {generateLayoutCells()}
          <ResponsiveReactGridLayout
            autoSize
            droppingItem={{
              i: "__dropping-elem__",
              h: itemDragging.h || 1,
              w: itemDragging.w || 2,
            }}
            className="layout"
            rowHeight={rowHeight}
            breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
            cols={{ lg: 26, md: 14, sm: 8, xs: 6, xxs: 3 }}
            layouts={layouts}
            onResizeStop={onResizeStop}
            onDragStop={onDragStop}
            onLayoutChange={onLayoutChange}
            onDrop={onDropHandler}
            measureBeforeMount
            useCSSTransforms={mounted}
            compactType={compactType}
            preventCollision={!compactType}
            isDraggable
            isDroppable
            isResizable
            ref={refGrid}
            // style={{height: size.height}}
          >
            {generateWidgets()}
          </ResponsiveReactGridLayout>
        </div>
      </div>
    </div>
  );
};
export default DragFromOutsideLayout;
