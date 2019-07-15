# Bookmarks

## Installation

* Initialize  below [Grapcool](https://console.graph.cool) schema :
```graphql
type Bookmark @model {
  id: ID! @isUnique
  author: String
  createdDate: DateTime!
  duration: Int
  publicationDate: DateTime
  height: Int
  title: String
  thumbnail: String
  tags: [String!] @defaultValue(value: "[]")
  url: String!
  width: Int
}
```
* Create the file ```./src/config/keys.ts``` with below content :
```js
export const API_KEY_FLICKR = '<YOUR FLICKR API KEY>';
export const API_KEY_GRAPHCOOL = '<YOUR GRAPHCOOL API KEY>';
export const API_KEY_VIMEO = '<YOUR VIMEO  API KEY>';
```
* Install dependencies :
```
npm install
```
* Start the application :
```
npm run start
```