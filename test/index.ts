import WorkerPromise from '../lib'

const printName = () => console.warn('SIMU')
const printAge = () => console.warn('27')

const wp = new WorkerPromise()

wp.then(() => {
  printName()
  printAge()
  console.warn('This block\'s code is running at worker thread!')
  return "Name: SIMU, Age: 27"
}).then((authorInfo) => console.warn(authorInfo))

console.warn('This block\'s code is running at main thread!')