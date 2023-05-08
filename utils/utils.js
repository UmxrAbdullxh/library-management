const { Validator } = require('node-input-validator');

const Validate = async (data, params) => {
  const v = new Validator(data, params);
  
  const matched = await v.check();

  if (!matched) {
    return {
      status: 404,
      message: "PARAMS_ISSUE",
      error: v.errors
    }
  }
}

module.exports = {
  Validate
}