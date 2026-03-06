const { withProjectBuildGradle, withAppBuildGradle } = require('@expo/config-plugins');

module.exports = (config) => {
  config = withProjectBuildGradle(config, (config) => {
    // 1. Force AGP 8.8.0
    config.modResults.contents = config.modResults.contents.replace(
      /dependencies\s?{/,
      `configurations.all {
        resolutionStrategy {
            force 'com.android.tools.build:gradle:8.8.0'
        }
    }
    dependencies {`
    );

    // 2. Force androidx.core 1.12.0 for EVERYTHING
    config.modResults.contents += `
allprojects {
    configurations.all {
        resolutionStrategy {
            force 'androidx.core:core:1.12.0'
            force 'androidx.core:core-ktx:1.12.0'
        }
    }
}
`;
    return config;
  });

  return withAppBuildGradle(config, (config) => {
    if (!config.modResults.contents.includes("buildFeatures")) {
      config.modResults.contents = config.modResults.contents.replace(
        /android\s?{/,
        `android {
    buildFeatures {
        prefab = false
    }`
      );
    }
    return config;
  });
};
