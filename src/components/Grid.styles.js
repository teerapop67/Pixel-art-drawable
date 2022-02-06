import { createUseStyles } from 'react-jss';

export default createUseStyles({
  grid: {
    display: 'grid',
    gridTemplateRows: 'repeat(38, 1fr)',
    gridTemplateColumns: 'repeat(38, 1fr)',
    width: '80vmin',
    height: '80vmin',
  },
  cell: {
    cursor: 'pointer',
    border: '0.1px solid #F3F1F1 ',
    background: 'white',
    transition: 'all 150ms linear',
    '&:hover': {
      transform: 'scale(1)',
    },
  },
});
