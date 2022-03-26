### worker-promise
Provide a better (more elegant) method to use the worker thread of javascript.

### Install

#### Yarn
```
yarn add worker-promise
```

#### Npm
```
npm i worker-promise
```

### Usage

#### Example Code 1 (Without parameters)
```typescript
import PromiseWorker from "worker-promise"

const worker = new PromiseWorker()

worker.then(() => {
  console.warn('I am running in worker thread!')

  return 'From Worker Thred: Hello'
}).then(result => {
  console.warn(result)
})

console.warn('I am running in main thread')
```

Also , you can use `await`

```typescript

const result = await worker.then(() => {
  console.warn('I am running in worker thread!')

  return 'From Worker Thred: Hello'
})

console.warn(result)

```


#### Example Code 2 (With parameters)

You can use `prepare()` to set parameter(not support multily, or you can pack then into one object) before `then()`

```typescript
import PromiseWorker from "worker-promise"

const worker = new PromiseWorker()

worker.prepare({name: 'SIMU', age: 18}).then((param) => {
  console.warn('I am running in worker thread!')
  console.warn(`I know you are ${param.name}, and ${param.age} years old!`)

  return 'From Worker Thred: Hello'
}).then(result => {
  console.warn(result)
})
```


Also, you can can attach parameter after callback

```typescript
const worker = new PromiseWorker()

const callback = (param) => {
  console.warn('I am running in worker thread!')
  console.warn(`I know you are ${param.name}, and ${param.age} years old!`)

  return 'From Worker Thred: Hello'
}

worker.then(callback, {name: 'SIMU', age: 18}).then(result => {
  console.warn(result)
})
```


### Feautue

This is just first version, we will provide more elegant and efficient code to help you use web worker. Have fun when coding!


