import { connect } from 'react-redux'
import { login } from '../../actions/session_actions'
import LoginForm from './login_form'
import { openModal, closeModal } from '../../actions/modal_actions'
import Button from '@material-ui/core/Button'
import React from 'react'

const mapStateToProps = (state) => {
  return {
    errors: state.errors.session,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    login: (user) => dispatch(login(user)),
    signupForm: (
      <Button color="primary" onClick={() => dispatch(openModal('signup'))}>
        New to Welp? Sign Up
      </Button>
    ),
    closeModal: () => dispatch(closeModal()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginForm)
