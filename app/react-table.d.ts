import { CustomColumnMeta } from "@/components/data-table/types-and-interfaces";
import "@tanstack/react-table";

declare module "@tanstack/react-table" {
  interface ColumnMeta extends CustomColumnMeta {
    __nonEmpty?: true;
  }
}
