import React from "react";

const sd =() => {

    const updateCellOver = (i) => (e) => {
        if (e.buttons === 1 || e.buttons === 2) {
          setCells(
            cells.map((cell, cellIndex) => {
              if (cellIndex === i) {
                if (e.buttons === 1|| e.type === 'mouseover') {
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
                      return offCell; //return default cell
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
                          console.log('DEL');
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
    
        if (e.type !== 'mouseover') {
          addCellDelToRedo();
        }
      };
    return <>
        <h1>qwdwqd</h1>
    </>
}