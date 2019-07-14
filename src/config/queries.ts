import gql from 'graphql-tag';

export const GET_BOOKMARKS = gql`
  query allBookmarks {
    allBookmarks(orderBy: createdDate_DESC) {
      id
      author
      duration
      publicationDate
      height
      title
      tags
      thumbnail
      url
      width
    }
  }
`;

export const CREATE_BOOKMARK = gql`
  mutation(
    $author: String
    $duration: Int
    $createdDate: DateTime!
    $publicationDate: DateTime
    $height: Int
    $title: String
    $thumbnail: String
    $url: String!
    $width: Int
  ) {
    createBookmark(
      author: $author
      createdDate: $createdDate
      duration: $duration
      publicationDate: $publicationDate
      height: $height
      title: $title
      thumbnail: $thumbnail
      url: $url
      width: $width
    ) {
      id
    }
  }
`;

export const UPDATE_BOOKMARK = gql`
  mutation($id: ID!, $url: String!) {
    updateBookmark(id: $id, url: $url) {
      id
    }
  }
`;

export const UPDATE_BOOKMARK_META = gql`
  mutation(
    $id: ID!
    $author: String
    $duration: Int
    $publicationDate: DateTime
    $height: Int
    $title: String
    $thumbnail: String
    $url: String
    $width: Int
  ) {
    updateBookmark(
      id: $id
      author: $author
      duration: $duration
      publicationDate: $publicationDate
      height: $height
      title: $title
      thumbnail: $thumbnail
      url: $url
      width: $width
    ) {
      id
    }
  }
`;

export const UPDATE_BOOKMARK_TAGS = gql`
  mutation($id: ID!, $tags: [String!]) {
    updateBookmark(id: $id, tags: $tags) {
      id
      tags
    }
  }
`;

export const DELETE_BOOKMARK = gql`
  mutation($id: ID!) {
    deleteBookmark(id: $id) {
      id
    }
  }
`;
