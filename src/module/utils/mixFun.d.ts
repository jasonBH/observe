import * as V from "vue";

declare namespace Vue {
  export function getDateStr(count:number):String;
}
// declare class Vue extends V {}

export = Vue;
