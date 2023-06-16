import Aria2Client from "./aria2-client";

export default interface IProps {
  client: Aria2Client,
  update?: Function
}