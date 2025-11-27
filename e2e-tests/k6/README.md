# Performance tests

The tests are written in TypeScript and run by the k6
test tool (https://k6.io/docs/) within a browser context.

### Run modes

- Functional test: 1 user and 1 iteration
- Performance test: X iterations over Y users

See `scenario/scenario.ts` for details.

### Commands

Install k6 and the xk6-extension to write to file (error log in `/logs`). On Mac (assume Go is installed along with `GOPATH` is set on `PATH`):
```bash
$ brew install k6
$ go install go.k6.io/xk6/cmd/xk6@latest
$ xk6 build v1.4.0 --with github.com/avitalique/xk6-file@latest
$ yarn install
```

Run functional test

```bash
# Headless
e2e-tests/k6$  ./k6 run runTest.ts -e env=[dev | staging | prod]
# With browser
e2e-tests/k6$  K6_BROWSER_HEADLESS=false ./k6 run runTest.ts -e env=[dev | staging | prod]
```

Run performance test - default: 100 iterations with 10 users

```bash
e2e-tests/k6$  ./k6 run runTest.ts -e env=[dev | staging | prod] -e performanceTest=true
```
