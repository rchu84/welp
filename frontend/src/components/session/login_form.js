import React, { useState, useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import TextField from '@material-ui/core/TextField'
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Dialog from '@material-ui/core/Dialog'

const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
    },
  },
}))

function LoginForm(props) {
  const classes = useStyles()
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})

  const renderErrors = () => {
    return (
      <List>
        {
          Object.keys(errors).map((error, i) => (
            <ListItem key={`error-${i}`}>
              <ListItemText primary={errors[error]} />
            </ListItem>
          ))
        }
      </List>
    )
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    let user = {
      name,
      password,
    }
    props.login(user).then((err) => {
      if (!err) {
        props.closeModal()
      }
    })
  }

  useEffect(() => {
    if (props.currentUser === true) {
      props.history.push('/')
    }
  }, [props.currentUser])

  useEffect(() => {
    setErrors(props.errors)
  }, [props.errors])

  return (
    <form
      className={classes.root}
      onSubmit={handleSubmit}
      noValidate
      autoComplete="off"
    >
      <div>
        <TextField
          id="standard-required"
          label="Username"
          onChange={(e) => setName(e.target.value)}
          fullWidth
        />
      </div>
      <div>
        <TextField
          id="standard-password-input"
          label="Password"
          type="password"
          autoComplete="current-password"
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
        />
      </div>
      <div>
        <Button variant="contained" color="secondary" type="submit" fullWidth>
          LOG IN
        </Button>
        {renderErrors()}
      </div>
      <div>{props.signupForm}</div>
    </form>
  )
}

export default withRouter(LoginForm)
