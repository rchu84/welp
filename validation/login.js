import isEmpty from 'validator/lib/isEmpty';
import validText from './valid-text';

// module.exports = function validateLoginInput(data) {
export default function validateLoginInput(data) {
  let errors = {};

  // data.email = validText(data.email) ? data.email : "";
  data.name = validText(data.name) ? data.name : "";
  data.password = validText(data.password) ? data.password : "";

  if (isEmpty(data.name)) {
    errors.name = "Username field is required";
  }

  if (isEmpty(data.password)) {
    errors.password = "Password field is required";
  }

  return {
    errors,
    isValid: Object.keys(errors).length === 0
  };
};