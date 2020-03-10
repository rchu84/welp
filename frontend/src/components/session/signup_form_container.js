import { connect } from 'react-redux'
import { signup } from '../../actions/session_actions'
import SignupForm from './signup_form'
import { closeModal, openModal } from '../../actions/modal_actions'
import Button from '@material-ui/core/Button'
import React from 'react'

const mapStateToProps = (state) => {
  return {
    signedIn: state.session.isSignedIn,
    errors: state.errors.session,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    signup: (user) => dispatch(signup(user)),
    loginForm: (
      <Button color="primary" onClick={() => dispatch(openModal('login'))}>
        Already on Welp? Log in
      </Button>
    ),
    closeModal: () => dispatch(closeModal()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SignupForm)
