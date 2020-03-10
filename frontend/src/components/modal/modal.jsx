import React from 'react';
import { closeModal } from '../../actions/modal_actions';
import { connect } from 'react-redux';
import LoginFormContainer from '../session/login_form_container';
import SignupFormContainer from '../session/signup_form_container';

import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';

function Modal({ modal, closeModal }) {
  // if (!modal) {
  //   return null
  // }
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  let component;
  switch (modal) {
    case 'login':
      component = <LoginFormContainer />;
      break;
    case 'signup':
      component = <SignupFormContainer />;
      break;
    default:
      component = null;
  };
  return (
    <div>
      {/*<div className="modal-child" onClick={(e) => e.stopPropagation()}>*/}
      {/*  {component}*/}
      {/*</div>*/}

      <Dialog
        open={modal !== null}
        onClose={closeModal}
        fullWidth
        maxWidth="xs"
        style={{ textAlign: 'center' }}
      >
        <DialogTitle>
          {modal === 'signup' ? 'Sign Up for Welp' : 'Log In to Welp'}
        </DialogTitle>
        <DialogContent>{component}</DialogContent>
      </Dialog>
    </div>
  );
};

const mapStateToProps = (state) => ({
  modal: state.ui.modal
});

const mapDispatchToProps = (dispatch) => ({
  closeModal: () => dispatch(closeModal())
});

export default connect(mapStateToProps, mapDispatchToProps)(Modal);
