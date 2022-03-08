import axios from "axios";
import { GET_COMMITTEES, CREATE_COMMITTEE, UPDATE_COMMITTEE } from "./types";
import { COMMITTEE_SERVER } from "../Config.js";
import qs from "qs";
export function committes(params) {
  const request = axios
    .get(`${COMMITTEE_SERVER}/?${qs.stringify(params)}`)
    .then((response) => response.data);

  return {
    type: GET_COMMITTEES,
    payload: request,
  };
}
export function createCommittee(params) {
  const request = axios
    .post(`${COMMITTEE_SERVER}/`, params)
    .then((response) => response.data);

  return {
    type: CREATE_COMMITTEE,
    payload: request,
  };
}

export function updateCommittee(params) {
  const request = axios
    .post(`${COMMITTEE_SERVER}/${params._id}`, params)
    .then((response) => response.data);

  return {
    type: UPDATE_COMMITTEE,
    payload: request,
  };
}
