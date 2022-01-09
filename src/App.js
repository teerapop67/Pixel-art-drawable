/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState, useMemo, useRef } from 'react';
import Grid from './components/Grid';
import ColorPicker from './components/ColorPicker';
import useStyles from './App.styles';
import ToolPixel from './components/ToolPixel';

const offCell = {
  on: false,
  color: '#ffffff',
};
const initialCells = Array.from({ length: 1444 }, () => offCell);

function App() {
  const [cells, setCells] = useState(initialCells);
  const [currentColor, setCurrentColor] = useState('#56BC58'); //color that user select from input
  const [saveCurrentColor, setSaveCurrentColor] = useState('#56BC58'); // this is a color for keep drawing
  const [fulfillState, setFulfillState] = useState(false); // condition fulfill
  const [saveFulfillColor, setSaveFulfillColor] = useState(''); // save for delete or undo its color will be the save fulfill
  const [undoColor, setUndoColor] = useState([]); // undo Array
  const [redoColor, setRedoColor] = useState([]); // redo Array
  const refPixel = useRef(null);
  const classes = useStyles();
  const colorSwatch = useMemo(
    () => [
      ...new Set(cells.filter((cell) => cell.on).map((cell) => cell.color)),
    ],
    [cells]
  );
  const chatString = useMemo(() => {
    let fullfil = fulfillState;
    let saveFullfil = saveFulfillColor;

    cells
      .map((cell) => cell.color.slice(0))
      .join(fullfil ? `T${saveFullfil},` : ',');
  }, [cells]);


  const onChangeSwatchColor = (color) => {
    setSaveCurrentColor(color);
    setCurrentColor(color);
  };

  return (
    <div className={classes.app}>
      <ColorPicker
        currentColor={currentColor}
        onSetColor={setCurrentColor}
        onSetSaveCurrentColor={setSaveCurrentColor}
      />
      <div className={classes.colorDirection}>
        <div className={classes.colorSwatchContainer}>
          {colorSwatch.map((color) => (
            <div
              key={color}
              onClick={() => onChangeSwatchColor(color)}
              className={classes.colorSwatch}
              style={{ background: color }}
            />
          ))}
        </div>
      </div>

      <Grid
        cells={cells}
        setCells={setCells}
        currentColor={currentColor}
        onFulfill={fulfillState}
        fulfillColor={saveFulfillColor}
        onSetUndoColor={setUndoColor}
        undoColor={undoColor}
        onSetRedoColor={setRedoColor}
        redoColor={redoColor}
        refPixel={refPixel}
      />
      {/* <p className={classes.chatString} style={{ color: '#fff'}}>
        !rgb
        {chatString}
      </p> */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '300px',
          justifyContent: 'space-between',
          margin: '10px 10px',
          cursor: 'pointer',
        }}
      >
        <ToolPixel
          cells={cells}
          setCells={setCells}
          currentColor={currentColor}
          saveCurrentColor={saveCurrentColor}
          setSaveCurrentColor={setSaveCurrentColor}
          fulfillState={fulfillState}
          saveFulfillColor={saveFulfillColor}
          setSaveFulfillColor={setSaveFulfillColor}
          setFulfillState={setFulfillState}
          undoColor={undoColor}
          setUndoColor={setUndoColor}
          redoColor={redoColor}
          setRedoColor={setRedoColor}
          chatString={chatString}
          setCurrentColor={setCurrentColor}
          refPixel={refPixel}
        />
      </div>
    </div>
  );
}

export default App;
