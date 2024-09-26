module.exports = function(api) {
    api.cache(true);
    return {
      presets: ['babel-preset-expo'],
      plugins: [
        ['module:react-native-dotenv', {
          moduleName: '@env', // Name under which you'll import environment variables
          path: '.env', // Path to your .env file
        }]
      ],
    };
  };
  