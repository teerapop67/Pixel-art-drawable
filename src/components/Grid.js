/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useState } from 'react';

import useStyles from './Grid.styles';
import './grid.css';

const offCell = {
  on: false,
  color: '#ffffff',
};

const Grid = ({
  currentColor,
  cells,
  setCells,
  onFulfill,
  fulfillColor,
  onSetUndoColor,
  undoColor,
  onSetRedoColor,
  redoColor,
  refPixel,
}) => {
  const [overClick, setOverClick] = useState(false);
  const [arrayColorOverClick, setArrayColorOverClick] = useState([]);
  const [onDelRedo, setOnDelRedo] = useState([]); // for keep value in redu array, it is a deleting by right or left click

  const classes = useStyles();
  const updateCell = (i) => (e) => {
    e.preventDefault();
    // if left or right click is pressed
    if (e.buttons === 1 || e.buttons === 2) {
      setCells(
        cells.map((cell, cellIndex) => {
          if (cellIndex === i) {
            if (e.buttons === 1) {
              //onLeft click for paint color
              if (currentColor !== fulfillColor) {
                if (!cell.on && cell.color !== currentColor) {
                  onSetUndoColor(
                    undoColor.concat({
                      color: currentColor,
                      indexColor: cellIndex,
                    })
                  );
                }
              }

              //erase and left click
              if (currentColor === '#ffffff' || currentColor === fulfillColor) {
                if (cell.on) {
                  //when use erase it will add to redo array
                  onSetRedoColor(
                    redoColor.concat({
                      color: cell.color,
                      indexColor: cellIndex,
                    })
                  );
                  return offCell;
                }
                //function for deleting color that was deleted by right click or erase
                setNewUndoArray(cell, cellIndex);
              }

              //if currentColor do not be the same as cell.color == "#ffffff" or fulfillColor it will color on cell
              if (currentColor !== fulfillColor && currentColor !== '#ffffff') {
                //cell is on color but there is other color replace that cell
                if (
                  cell.color !== currentColor &&
                  cell.color !== '#ffffff' &&
                  cell.color !== fulfillColor
                ) {
                  let copyUndo = [...undoColor];
                  copyUndo.forEach((ud, i) => {
                    if (ud.length > 0) {
                      ud.forEach((insideUd, index) => {
                        if (insideUd.indexColor === cellIndex) {
                          //delete old cell ones
                          ud.splice(index, 1);
                        }
                      });
                    }
                    if (ud.indexColor === cellIndex) {
                      copyUndo.splice(i, 1);
                    }
                  });
                  //add new cell color

                  onSetUndoColor(
                    copyUndo.concat({
                      color: currentColor,
                      indexColor: cellIndex,
                    })
                  );
                }
                return {
                  on: true,
                  color: currentColor,
                };
              }
            }
            //right click if cell is colored it will return its color
            if (cell.on) {
              onSetRedoColor(
                redoColor.concat({
                  color: cell.color,
                  indexColor: cellIndex,
                })
              );
            }
            //function for deleting color that was deleted by right click or erase
            setNewUndoArray(cell, cellIndex);
            if (!cell.on) return cell;
            return offCell;
          }
          return cell;
        })
      );
    }
  };

  // when mouse is over
  const updateCellOver = (i) => (e) => {
    if (e.buttons === 1 || e.buttons === 2) {
      setCells(
        cells.map((cell, cellIndex) => {
          if (cellIndex === i) {
            if (e.buttons !== 2 && e.type === 'mouseover') {
              //onLeft click for paint color
              if (!cell.on && cell.color !== currentColor) {
                setArrayColorOverClick(
                  arrayColorOverClick.concat({
                    color: currentColor,
                    indexColor: cellIndex,
                  })
                );
              }

              setOverClick(true);
              //over left click
              if (currentColor === '#ffffff' || currentColor === fulfillColor) {
                if (cell.on) {
                  //when use over left erase it will add to redo array
                  setOnDelRedo(
                    onDelRedo.concat({
                      color: cell.color,
                      indexColor: cellIndex,
                    })
                  );
                  return offCell;
                  // return default cell
                }
                //function for deleting color that was deleted by right click or erase
                setNewUndoArray(cell, cellIndex);
              }

              //if currentColor do not be the same as cell.color == "#ffffff" or fulfillColor it will color on cell
              if (currentColor !== fulfillColor && currentColor !== '#ffffff') {
                //cell is on color but there is other color replace that cell
                if (
                  cell.color !== currentColor &&
                  cell.color !== '#ffffff' &&
                  cell.color !== fulfillColor
                ) {
                  let copyUndo = [...undoColor];
                  copyUndo.forEach((ud, i) => {
                    if (ud.length > 0) {
                      ud.forEach((insideUd, index) => {
                        if (insideUd.indexColor === cellIndex) {
                          //delete old cell ones
                          ud.splice(index, 1);
                        }
                      });
                    }
                    if (ud.indexColor === cellIndex) {
                      copyUndo.splice(i, 1);
                    }
                  });
                  //add new cell color
                  setArrayColorOverClick(
                    arrayColorOverClick.concat({
                      color: currentColor,
                      indexColor: cellIndex,
                    })
                  );
                }
                return {
                  on: true,
                  color: currentColor,
                };
              }
            }

            //right click if cell is colored it will return its color
            if (cell.on) {
              setOnDelRedo(
                onDelRedo.concat({
                  color: cell.color,
                  indexColor: cellIndex,
                })
              );
            }
            //function for deleting color that was deleted by right click or erase
            setNewUndoArray(cell, cellIndex);
            if (!cell.on) return cell;

            return offCell;
          }

          return cell;
        })
      );
    } else if (overClick && e.buttons !== 2) {
      // set [many color] to undoColor array
      let copyUndoColor = [...undoColor];
      copyUndoColor.push(arrayColorOverClick);
      var copyUndoFilter = copyUndoColor.filter((n) => n.length > 0 || n.color);
      onSetUndoColor(copyUndoFilter);
      setOverClick(false);
      setArrayColorOverClick([]);
    }

    if (e.type === 'mouseup' && e.buttons !== 1) {
      addCellDelToRedo();
      setOnDelRedo([]);
    }
  };

  const addCellDelToRedo = () => {
    if (onDelRedo.length > 0) {
      let arrayRedo = [...redoColor];
      arrayRedo.push(onDelRedo);
      onSetRedoColor(arrayRedo);
    }
  };
  // function for deleting color that was deleted by right click or erase
  const setNewUndoArray = (cell, cellIndex) => {
    let undoDel = [...undoColor];
    undoDel.forEach((undo, index) => {
      if (undo.length > 0) {
        undo.forEach((un, i) => {
          if (un.indexColor === cellIndex && !un.fulfill) {
            undo.splice(i, 1);
          }
        });
      } else if (undo.indexColor === cellIndex) {
        undoDel.splice(index, 1);
      }
    });
    var filterUndo = undoDel.filter((n) => n.length >= 0 || n.color);
    onSetUndoColor(filterUndo);
  };

  

  return (
    <div className={classes.grid} ref={refPixel}>
      {cells.map((cell, i) => (
        <div
          // eslint-disable-next-line react/no-array-index-key
          key={i}
          style={{
            background: cell.on
              ? cell.color
              : onFulfill
              ? fulfillColor
              : '#ffffff',
          }}
          className="cells-class"
          onMouseOver={updateCellOver(i)}
          onMouseUp={updateCellOver(i)}
          onMouseDown={updateCell(i)}
          onContextMenu={(e) => e.preventDefault()}
        />
      ))}
    </div>
  );
};

export default Grid;
