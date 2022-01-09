import React, { useState, useCallback } from 'react';
import { toPng } from 'html-to-image';
import { saveAs } from 'file-saver';
import useStyles from '../App.styles';

const offCell = {
  on: false,
  color: '#ffffff',
};

// save in redux => redoColor, undoColor,

const ToolPixel = ({
  cells,
  setCells,
  currentColor,
  saveCurrentColor,
  fulfillState,
  setFulfillState,
  undoColor,
  setUndoColor,
  redoColor,
  setRedoColor,
  chatString,
  setCurrentColor,
  saveFulfillColor,
  setSaveFulfillColor,
  setSaveCurrentColor,
  refPixel,
}) => {
  const [arrayForRedoUndo, setArrayForRedoUndo] = useState([]);
  const classes = useStyles();

  const savePixelToFile = () => {
    var blob = new Blob([chatString], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, 'pixelData.txt');
  };

  const clearCell = () => {
    setCells(
      cells.map(() => {
        return {
          on: false,
          color: '#ffffff',
        };
      })
    );
    setFulfillState(false);
    setUndoColor([]);
    setRedoColor([]);
    setSaveFulfillColor('');
    setSaveCurrentColor('#56BC58');
  };

  const Drawable = () => {
    setCurrentColor(saveCurrentColor);
  };

  const Eraseable = () => {
    if (fulfillState) setCurrentColor(saveFulfillColor);
    else setCurrentColor('#ffffff');
  };

  const Fulfillable = () => {
    if (currentColor === '#ffffff') return;
    let copyUndo = [...undoColor];
    // this function will fill color in the whole grid

    let setNewUndoArray = [];
    setCells(
      cells.map((cell, cellIndex) => {
        if (!cell.on) {
          setNewUndoArray.push({
            color: currentColor,
            indexColor: cellIndex,
            fulfill: true,
          });
        } else {
          return {
            on: true,
            color: cell.color,
          };
        }

        return {
          on: false,
          color: currentColor,
        };
      })
    );

    setFulfillState(true);
    setSaveFulfillColor(currentColor);
    copyUndo.push(setNewUndoArray);
    setUndoColor(copyUndo);
  };

  const redoable = () => {
    if (redoColor.length === 0) return;
    let copyColor;
    let foundRedo = false;
    setCells(
      cells.map((cell, cellIndex) => {
        let arrayRedo = [...redoColor];
        var findColor = false;
        var haveColor = '';
        if (redoColor[redoColor.length - 1].indexColor === cellIndex) {
          let keepForUndo = arrayRedo.pop();
          setRedoColor(arrayRedo);
          setUndoColor(undoColor.concat(keepForUndo));
          return {
            on: true,
            color: redoColor[redoColor.length - 1].color,
          };
        } else if (redoColor[redoColor.length - 1].length > 0) {
          var agentRedoArray = redoColor[redoColor.length - 1];
          agentRedoArray.forEach((rd, index) => {
            if (rd.indexColor === cellIndex) {
              agentRedoArray.splice(index, 1);
              arrayRedo[arrayRedo.length - 1] = agentRedoArray;
              setArrayForRedoUndo(arrayForRedoUndo.push(rd));
              setRedoColor(arrayRedo);
              findColor = true;
              haveColor = rd.color;
              if (rd.fulfill) {
                foundRedo = true;
                copyColor = rd.color;
              }
            }
          });
        }

        //the color that is on redoColor array, it will set cells
        if (findColor) {
          return {
            on: true,
            color: haveColor,
          };
        }

        if (cell.on) {
          return {
            on: true,
            color: cell.color,
          };
        }

        return offCell;
      })
    );

    //push back to undo array
    if (arrayForRedoUndo.length > 0) {
      let copyUndo = [...undoColor];
      copyUndo.push(arrayForRedoUndo);
      setUndoColor(copyUndo);
      setArrayForRedoUndo([]);
    }

    //delete array that is null => [] in redoColor
    if (redoColor[redoColor.length - 1].length === 0) {
      let copyRedoColor = [...redoColor];
      copyRedoColor.pop();
      setRedoColor(copyRedoColor);
    }

    if (foundRedo) {
      setCells(
        cells.map((cell) => {
          if (!cell.on) {
            //when redo click it will fulfill color
            return {
              on: false,
              color: saveFulfillColor,
            };
          } else {
            return {
              on: true,
              color: cell.color,
            };
          }
        })
      );
      setSaveFulfillColor(copyColor);
      setFulfillState(true);
    }
  };

  //UNDO HERE
  // 3 thing that is clear undoColor array
  //- undo button
  //- right click, right over click,
  //- erase button
  const undoable = (e) => {
    if (undoColor.length === 0) return;

    //this condition is, when user click fulfill color that is undo it will be the same color like fulfill
    // and usual undo click
    let foundUndo = false;
    setCells(
      cells.map((cell, cellIndex) => {
        //undo usual click
        let arrayUndo = [...undoColor];
        var findColor = false;

        //have only 1 color it will be pop out on an undo array
        if (undoColor[undoColor.length - 1].indexColor === cellIndex) {
          var keepForRedo = arrayUndo.pop();
          setRedoColor(redoColor.concat(keepForRedo));
          setUndoColor(arrayUndo);

          return {
            on: false,
            color: fulfillState ? saveFulfillColor : '#ffffff',
          };
        } else if (undoColor[undoColor.length - 1].length > 0) {
          //undo color that was over clicked
          var agentUndoArray = undoColor[undoColor.length - 1];
          agentUndoArray.forEach((ud, index) => {
            if (ud.indexColor === cellIndex) {
              agentUndoArray.splice(index, 1);
              setArrayForRedoUndo(arrayForRedoUndo.push(ud));
              arrayUndo[arrayUndo.length - 1] = agentUndoArray;
              setUndoColor(arrayUndo);
              findColor = true;
              if (ud.fulfill) {
                foundUndo = true;
              }
            }
          });
          if (findColor) {
            return {
              on: false,
              color: fulfillState ? saveFulfillColor : '#ffffff',
            };
          }
        }
        // will not undo when that cell is colored
        if (cell.on) {
          return {
            on: true,
            color: cell.color,
          };
        }

        return offCell;
      })
    );
    //push to redo array
    if (arrayForRedoUndo.length > 0) {
      let copyRedo = [...redoColor];
      copyRedo.push(arrayForRedoUndo);
      setRedoColor(copyRedo);
      setArrayForRedoUndo([]);
    }
    //get rid of null array => []
    if (undoColor[undoColor.length - 1].length === 0) {
      let copyUndoColor = [...undoColor];
      copyUndoColor.pop();
      setUndoColor(copyUndoColor);
    }
    console.log(undoColor);
    //undo fulfil
    if (foundUndo) {
      if (undoColor.length === 1) {
        setFulfillState(false);
      }

      var stillFulfill = false;
      //[[1444],{},[1444][1444]]
      for (var i = undoColor.length - 2; i >= 0; i--) {
        console.log(undoColor[i]);
        if (undoColor[i].length > 0) {
          if (undoColor[i][0].fulfill) {
            stillFulfill = true;
            setSaveFulfillColor(undoColor[i][0].color);
            break;
          }
        }
      }

      setCells(
        cells.map((cell, cellIndex) => {
          if (cell.on) {
            return {
              on: true,
              color: cell.color,
            };
          } else {
            return {
              on: false,
              color: fulfillState ? saveFulfillColor : '#ffffff',
            };
          }
        })
      );
      if (!stillFulfill) {
        setFulfillState(false);
      }
    }
  };

  //UNDO HERE
  const showFile = () => {
    if (window.File && window.FileReader && window.FileList && window.Blob) {
      var file = document.querySelector('input[type=file]').files[0];
      var reader = new FileReader();

      var textFile = /text.*/;

      if (!file) return;

      if (file.type.match(textFile)) {
        reader.onload = function (event) {
          var colorSet = event.target.result;
          let saveArrayColor = [];
          let colorFulfillFromFile = '';
          if (colorSet[0] !== '#') return; // if it is an other file
          if (colorSet[7] === 'T') {
            // this is for fulfilling
            colorFulfillFromFile = colorSet.slice(8, 15);
            setSaveFulfillColor(colorFulfillFromFile);
            setFulfillState(true);
            setUndoColor([]);
            setRedoColor([]);
            saveArrayColor.push(colorSet.split(`T${colorFulfillFromFile},`));
          } else saveArrayColor.push(colorSet.split(','));
          // let setNewUndoArray = [];
          //already choose file and set color to be the save as saved
          setCells(
            cells.map((cell, cellIndex) => {
              // if (
              //   saveArrayColor[0][cellIndex] !== '#ffffff' &&
              //   saveArrayColor[0][cellIndex] !== colorFulfillFromFile
              // ) {
              //   setNewUndoArray.push({
              //     color: saveArrayColor[0][cellIndex],
              //     indexColor: cellIndex,
              //   });
              // }
              return {
                on:
                  saveArrayColor[0][cellIndex] === '#ffffff' ||
                  saveArrayColor[0][cellIndex] === colorFulfillFromFile
                    ? false
                    : true,
                color: saveArrayColor[0][cellIndex],
              };
            })
          );

          // setUndoColor(setNewUndoArray);
          //#e00111 walk 7
        };
      } else {
        console.log("It doesn't seem to be a text file!");
      }
      reader.readAsText(file);
    } else {
      alert('Your browser is too old to support HTML5 File API');
    }
  };

  const callUndo = () => {
    console.log('UNDO HAHA: ', undoColor);
  };

  const callRedo = () => {
    console.log('REDO HAHA: ', redoColor);
    console.log('UNDO HAHA: ', cells);
  };

  const keyBoard = (e) => {
    if (e.keyCode === 90 && e.ctrlKey) {
      undoable();
    } else if (e.keyCode === 89 && e.ctrlKey) {
      redoable();
    }
  };

  const onMintClick = useCallback(() => {
    const pixelCell = document.querySelectorAll('.cells-class');
    if (refPixel.current === null) {
      return;
    }
    pixelCell.forEach((px) => {
      px.classList.add('export-pixel');
    });

    toPng(refPixel.current, { cacheBust: true })
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = 'my-image-name.png';
        link.href = dataUrl;
        link.click();
        pixelCell.forEach((px) => {
          px.classList.remove('export-pixel');
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }, [refPixel]);

  return (
    <>
      <button className={classes.btnStyle} onClick={Drawable}>
        Draw
      </button>
      <button className={classes.btnStyle} onClick={Eraseable}>
        Erase
      </button>
      <button className={classes.btnStyle} onClick={Fulfillable}>
        Fullfill
      </button>
      <button className={classes.btnStyle} onClick={clearCell}>
        Clear
      </button>
      <button
        className={classes.btnStyle}
        onClick={undoable}
        onKeyDown={keyBoard}
      >
        undo
      </button>

      <button
        className={classes.btnStyle}
        onClick={redoable}
        onKeyDown={keyBoard}
      >
        redo
      </button>

      <button className={classes.btnStyle} onClick={callUndo}>
        undoCAlL
      </button>

      <button className={classes.btnStyle} onClick={callRedo}>
        redoCall
      </button>

      <button className={classes.btnStyle} onClick={savePixelToFile}>
        Save
      </button>

      <button className={classes.btnStyle} onClick={onMintClick}>
        Export
      </button>

      <input
        style={{
          width: '80%',
          margin: '10px 10px',
          background: 'transparent',
          border: '1px solid goldenrod',
          color: 'white',
          cursor: 'pointer',
        }}
        type="file"
        onChange={showFile}
      />
    </>
  );
};

export default ToolPixel;
