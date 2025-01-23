/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-require-imports */
const {withSentryConfig} = require("@sentry/nextjs");
const moduleEports = {

};
const SentryWebpackPluginOption = {
    silent : true,
}
module.exports = withSentryConfig(moduleExports , SentryWebpackPluginOption)