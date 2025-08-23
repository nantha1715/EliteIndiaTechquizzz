module.exports = {
  default: {
    require: ['features/step_definitions/*.ts'],
    requireModule: ['ts-node/register'],
    format: ['progress'],
    paths: ['features/*.src/test/features/login.features']
  }
};
