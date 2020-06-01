# Text Analyser
### Project setup

 1. Clone the repo
 2. Initialise the project with 

```
npm install
```
### Start the server
```
npm start
```
The server is now started and is served on `http://localhost:3000` it will be accepting a text file url with query param `url`
Demo: [http://localhost:3000/?url=http://norvig.com/big.txt](http://localhost:3000/?url=http://norvig.com/big.txt)

### Project built with
1. [Express.js](https://www.npmjs.com/package/express) For handling routes and api
2. [Axios](https://www.npmjs.com/package/axios) For http requests