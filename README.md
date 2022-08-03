# Marketing Webflow Scripts

This package contains all Webflow scripts that are used on
[https://open.store/business](https://open.store/business) pages. In addition we
store tooling, infrastructure and means to deploy scripts as a managed bundle
here.

If you want to add a new script tag to Webflow pages or update existing one
please [follow this
documentation](https://github.com/open-store/marketing-webflow-script/wiki). If
you want to learn more about the project, how infrastructure around Webflow
script-tag manager works please continue below.

## Deployment targets

- [Production page](https://open.store/business)
- [Webflow production page](https://webflow-prod.open.store/): `ingestion-flow`
  app is routing traffic from the above production page to this Webflow URL.
  Therefore the content on both pages is identical and only URLs are different.
  The proxy routing in `ingestion-flow` is [configured
  here](https://github.com/open-store/ingestion-flow/blob/dev/next.config.js)
- [Webflow staging page](https://openstoremarketing.webflow.io/)

## How it works

This application is split into 3 standalone modules:
- [Loader
  Script](https://github.com/open-store/monorepo/tree/main/packages/marketing-webflow-script/src/loader):
  lightweight script responsible for bootstrapping the rest of the packages. We
  don't want to change this script very often. Loader script is cached but is
  relying on fetching JSON tags that are never cached to know which specific
  version of packages to load.
- [Script
  Packages](https://github.com/open-store/monorepo/tree/main/packages/marketing-webflow-script/src/packages):
  snapshot of all Webflow script tags in one bundle. Plus instrumentation and
  feature-flagging. We compile packages into single bundle with unique ID and
  upload it to our S3 bucket. Packages are always cached.
- [CLI](https://github.com/open-store/monorepo/tree/main/packages/marketing-webflow-script/src/cli):
  used in deployment process to upload the loader and packages to AWS S3 bucket.

[Latest version of the loader script, tags and script packages are deployed to
this AWS S3
bucket.](https://s3.console.aws.amazon.com/s3/buckets/marketing-webflow-script-bucket?region=us-west-2&tab=objects)

[We have configured our S3 bucket to produce correct CORS headers to handle all
known Webflow
environments.](https://s3.console.aws.amazon.com/s3/buckets/marketing-webflow-script-bucket?region=us-west-2&tab=permissions)

## Alerting and feature-flagging

- We are using
  [Statsig](https://console.statsig.com/jRE7w34M1UUAn7AQKzWVC/gates) to setup
  our feature gates and to load configuration data for scripts.
  - [The main killswitch feature
    gate](https://console.statsig.com/jRE7w34M1UUAn7AQKzWVC/gates/webflow_marketing_all_scripts):
    turn this off to disable all Webflow script tags.
  - [Example feature gate to enable one Webflow
    script](https://console.statsig.com/jRE7w34M1UUAn7AQKzWVC/gates/webflow_script_stackadapt)
  - [Example dynamic
    configuration](https://console.statsig.com/jRE7w34M1UUAn7AQKzWVC/dynamic_configs/webflow_config_growsurf)
- DataDog is used to continuously run happy path end-to-end test on webflow
  pages and ping on-call engineer if they start failing in real time.
  - [Webflow Marketing Business Pages Happy Path
    Test](https://app.datadoghq.com/synthetics/details/4pg-55x-5q7)
- PagerDuty on-call rotation:
  - [On-call schedule](https://openstore.pagerduty.com/schedules#PX17A75)
  - [Service](https://openstore.pagerduty.com/service-directory/PKPJACX/activity)
  - [Escalation
    policy](https://openstore.pagerduty.com/escalation-policies-ui/P5D349H)
- Sentry is used to gather error metrics and is configured to alert on specific
  error threshold.
  - [Sentry
    Dashboard](https://sentry.io/organizations/openstore-wg/projects/webflow-marketing/?project=6588523)
  - [Sentry Escalation
    Alerts](https://sentry.io/organizations/openstore-wg/alerts/rules/?project=6588523)

## Installation and getting started

```sh
pnpm install
```

Useful commands during the development:

```sh
# Linting and testing all project files:
pnpm run lint
pnpm run lint:fix
pnpm run test
pnpm run test:watch

# Testing loader module local build in watch mode.
pnpm run esbuild:loader:watch

# Testing packages module local build in watch mode.
pnpm run esbuild:packages:watch
```

## Deployment

First you will need to create `.env` file at the root of the project with the
following environment variables:

```
AWS_ACCESS_KEY="[YOUR_AWS_ACCESS_KEY]"
AWS_SECRET_KEY="[YOUR_AWS_SECRET_KEY]"
```

Create a fresh build and deploy with following commands:

```sh
pnpm run build
pnpm run deploy
```

