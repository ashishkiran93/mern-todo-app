import React , { useState , useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import AddBoxIcon from '@material-ui/icons/AddBox';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import axios from 'axios';



function rand() {
  return Math.round(Math.random() * 20) - 10;
}

function getModalStyle() {
  const top = 50 + rand();
  const left = 50 + rand();

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    borderRadius:'5px',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(3, 4, 3),
  },
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: '35ch',
    },
  },
  button: {
    margin: theme.spacing(2),
  },
  newButton:{
      marginTop:"5%"
  },
  newRoot:{
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
    margin:'2% 40% auto',
    borderTop:'2px solid black'

  }
}));

export default function SimpleModal() {
  const classes = useStyles();
  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
// Input field code on modal
  const [value, setValue] = React.useState('');

  const handleChange = (event) => {
    setValue(event.target.value);
  };

// Fetching data from backend
 const [dataList , setDataList] = useState([])
 const fetchItem = ()=>{
     axios.get("/api/todo/")
          .then(responce=>setDataList(responce.data))
          .catch(err=>console.log(`Client side Manual Error while fetching ${err}`))
 }

 useEffect(() => {
     fetchItem()
 }, [])
 

// Including Lists
  const [checked, setChecked] = React.useState([0]);

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

// Code to push  th data to backend

 const pushToBackend =(e)=>{
   e.preventDefault()

   const newItem = {
     name:value
   }

   axios.post('/api/todo/', newItem)
        .then(()=>{console.log(`${value} Succesfully sent to backend`);setValue("");handleClose();fetchItem()})
        .catch(err=>console.log(`Manual Error while pushin to backend ${err}`))
 }

//  code to delete the selected list

  const deleteRequest = (id)=>{
    axios.delete('/api/todo/'+id)
         .then(()=>{fetchItem();console.log(`Successfully sent delete request to backend`);})
         .catch(err=>console.log(`Manual error while delete request from frontend ${err}`))
  }

  const body = (
    <div style={modalStyle} className={classes.paper}>
      <form className={classes.root} noValidate autoComplete="off">
        <div>
        <TextField
          id="outlined-multiline-flexible"
          label="Whats your plan for today?"
          multiline
          maxRows={4}
          value={value}
          onChange={handleChange}
          variant="outlined"
        />
        </div>
        <div>
        <Button
        variant="contained"
        color="primary"
        size="small"
        className={classes.button}
        onClick={pushToBackend}
        startIcon={<AddBoxIcon />}
      >
        ADD ITEM
      </Button>
        </div>
      </form>  
    </div>
  );

  return (
    <div>
      <Button className={classes.newButton} variant="contained" color="primary" disableElevation onClick={handleOpen}>
         ADD YOUR NEW ITEM HERE
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        {body}
      </Modal>
      <List className={classes.newRoot}>
      {dataList.map((value) => {
        const labelId = `checkbox-list-label-${value}`;

        return (
          <ListItem key={value._id} role={undefined} dense button onClick={handleToggle(value)}>
            <ListItemIcon>
              <Checkbox
                edge="start"
                checked={checked.indexOf(value) !== -1}
                tabIndex={-1}
                disableRipple
                inputProps={{ 'aria-labelledby': labelId }}
              />
            </ListItemIcon>
            <ListItemText id={labelId} primary={value.name} />
            <ListItemSecondaryAction>
              <IconButton edge="end" aria-label="comments">
                <DeleteIcon onClick={()=>deleteRequest(value._id)} />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        );
      })}
    </List>
    </div>
  );
}