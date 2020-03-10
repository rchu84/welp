import React, { useState, useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import TextField from '@material-ui/core/TextField'
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'

const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
    },
  },
}))

function SignupForm(props) {
  const classes = useStyles()
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [password2, setPassword2] = useState('')
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
    if (password !== password2) {
      setErrors({ password: "Password doesn't match" })
    } else {
      let user = {
        name,
        password,
        password2
      }
      props.signup(user, props.history).then((err) => {
        if (!err) {
          props.closeModal()
        }
      })
    }
  }

  useEffect(() => {
    if (props.signedIn === true) {
      props.history.push('/login')
    }
  }, [props.signedIn])

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
          required
          label="Username"
          onChange={(e) => setName(e.target.value)}
          fullWidth
        />
      </div>
      <div>
        <TextField
          required
          label="Password"
          type="password"
          autoComplete="current-password"
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
        />
      </div>
      <div>
        <TextField
          required
          label="Confirm Password"
          type="password"
          autoComplete="current-password"
          onChange={(e) => setPassword2(e.target.value)}
          fullWidth
        />
      </div>
      <div>
        <Button variant="contained" color="secondary" type="submit" fullWidth>
          SIGN UP
        </Button>
        {renderErrors()}
      </div>
      <div>{props.loginForm}</div>
    </form>
  )
}

export default withRouter(SignupForm)
