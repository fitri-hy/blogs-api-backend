# BLOGS API NODE JS
Basic Node JS project to create an API Endpoint for a Blog

## INSTALATION
```
git clone https://github.com/fitri-hy/blogs-api.git
cd blogs-api
npm install
```

## RUN PROJECT
```
node .
```
or
```
node index.js
```

## API ENDPOINT ACCESS

#### List Data:
`/api/data`<br>example<br>`http://localhost:3000/api/data`

#### Pagnition Pages
`/data?page={value}`<br>example<br>`http://localhost:3000/api/data?page=2`

#### Search Data by Title
`/api/data/search?query={query}`<br>example<br>`http://localhost:3000/api/data/search?query=express`

#### Filter Data by Category
`/api/data/category?query={category}`<br>example<br>`http://localhost:3000/api/data/category?query=html`

#### Data Detail
`/api/data/{id} example`<br>example<br>`http://localhost:3000/api/data/3`

Support me by giving stars
