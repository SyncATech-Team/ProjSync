import { environment } from '../../environments/environment';

const SERVER_BASE_URL_DEVELOPMENT = 'http://localhost:5041';
const SERVER_BASE_URL_PRODUCTION = 'https://angularaspnetserver.azurewebsites.net';

const BASE_ENDPOINTS = {
  GET_ALL_POSTS: 'posts',
  GET_POST_BY_ID: 'posts',
  CREATE_POST: 'posts',
  UPDATE_POST: 'posts',
  DELETE_POST: 'posts'
};

const DEVELOPMENT_ENDPOINTS = {
  GET_ALL_POSTS: `${SERVER_BASE_URL_DEVELOPMENT}/${BASE_ENDPOINTS.GET_ALL_POSTS}`,
  /**
  * Append /{id}. Example: \`${API_ENDPOINTS.GET_POST_BY_ID}/1\`
  */
  GET_POST_BY_ID: `${SERVER_BASE_URL_DEVELOPMENT}/${BASE_ENDPOINTS.GET_POST_BY_ID}`,
  /**
  * Send the post to create as an object of type PostCreateUpdateDTO in the HTTP body.
  */
  CREATE_POST: `${SERVER_BASE_URL_DEVELOPMENT}/${BASE_ENDPOINTS.CREATE_POST}`,
  /**
  * Append /{id}. Example: \`${API_ENDPOINTS.UPDATE_POST}/1\`.
  * Send the post to update as an object of type PostCreateUpdateDTO in the HTTP body.
  */
  UPDATE_POST: `${SERVER_BASE_URL_DEVELOPMENT}/${BASE_ENDPOINTS.UPDATE_POST}`,
  /**
  * Append /{id}. Example: \`${API_ENDPOINTS.DELETE_POST}/1\`
  */
  DELETE_POST: `${SERVER_BASE_URL_DEVELOPMENT}/${BASE_ENDPOINTS.DELETE_POST}`
};

const PRODUCTION_ENDPOINTS = {
  GET_ALL_POSTS: `${SERVER_BASE_URL_PRODUCTION}/${BASE_ENDPOINTS.GET_ALL_POSTS}`,
  GET_POST_BY_ID: `${SERVER_BASE_URL_PRODUCTION}/${BASE_ENDPOINTS.GET_POST_BY_ID}`,
  CREATE_POST: `${SERVER_BASE_URL_PRODUCTION}/${BASE_ENDPOINTS.CREATE_POST}`,
  UPDATE_POST: `${SERVER_BASE_URL_PRODUCTION}/${BASE_ENDPOINTS.UPDATE_POST}`,
  DELETE_POST: `${SERVER_BASE_URL_PRODUCTION}/${BASE_ENDPOINTS.DELETE_POST}`
};

const ENDPOINTS_TO_EXPORT = environment.production ? PRODUCTION_ENDPOINTS : DEVELOPMENT_ENDPOINTS;

export default ENDPOINTS_TO_EXPORT;
