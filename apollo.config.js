module.exports = {
  client: {
    service: {
      name: 'graphql',
      localSchemaFile: './schema.json',
    },
    includes: [
      './libs/**/*.ts',
      './libs/**/*.tsx',
      './apps/**/*.tsx',
      './apps/**/*.ts',
    ],
    excludes: ['**/__tests__/**/*'],
    target: 'typescript',
  },
};
