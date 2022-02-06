import { createUseStyles } from 'react-jss';

export default createUseStyles({
  app: {
    display: 'flex',
    width: '100%',
    height: '100vh',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: '4rem',
    paddingLeft: '6rem',
    fontFamily: 'sans-serif',
    backgroundColor: '#333',
  },
  colorSwatchContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 30px)',
    width: '100%',
    margin: '0 20px',
  },
  colorSwatch: {
    margin: '0.5rem',
    padding: 0,
    width: '25px',
    height: '25px',
    outline: 'none',
    border: 'none',
    cursor: 'pointer',
  },
  chatString: {
    maxWidth: '50%',
    fontFamily: 'monospace',
    wordWrap: 'break-word',
  },
  colorDirection: {
    display: 'flex',
    flexDirection: 'column',
  },
  btnStyle: {
    width: '80px',
    height: '30px',
    margin: '10px 10px',
    background: 'transparent',
    border: '1px solid goldenrod',
    color: 'white',
    cursor: 'pointer',
  },
});
