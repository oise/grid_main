// GraphQL Queries and Mutations //
import { gql } from "urql";

export const DataGridSubscription = gql`
  subscription GetDataGrids {
    DataGrid {
      id
      name
    }
  }
`;

export const GetGridDataSubscription = gql`
  subscription GetGridData($gridId: uuid!) {
    DataGrid_by_pk(id: $gridId) {
      id
      name

      Rows(where: { grid_id: { _eq: $gridId } }, order_by: { grid_id: asc }) {
        id
        title
      }
      GridColumns(where: { grid_id: { _eq: $gridId } }, order_by: { grid_id: asc }) {
        id
        title
      }
      Cells(where: { grid_id: { _eq: $gridId } }, order_by: { grid_id: asc }) {
        id
        row_id
        column_id
        content
        comment
      }
    }
  }
`;

export const GetGridData = gql`
  query GetGridData($gridId: uuid!) {
    Row(where: { grid_id: { _eq: $gridId } }) {
      id
      title
    }
    GridColumn(where: { grid_id: { _eq: $gridId } }) {
      id
      title
    }
    Cell(where: { grid_id: { _eq: $gridId } }) {
      id
      row_id
      column_id
      content
      comment
    }
  }
`;

export const AddDataGridMutation = gql`
  mutation AddDataGrid($name: String!) {
    insert_DataGrid_one(object: { name: $name }) {
      name
    }
  }
`;

/**
 * Note: For some reason this seems to fail with
 * [GraphQL] expecting a value for non-nullable variable: "gridId"
 * Tested the generated payload on the playground and it works
 */
export const AddRowMutation = gql`
  mutation AddRow($gridId: uuid!, $title: String!) {
    insert_Row_one(object: { grid_id: $gridId, title: $title }) {
      grid_id
      title
    }
  }
`;

/**
 * Note: For some reason this seems to fail with
 * [GraphQL] expecting a value for non-nullable variable: "gridId"
 */
export const AddColumnMutation = gql`
  mutation AddColumn($gridId: uuid!, $title: String!) {
    insert_GridColumn_one(object: { grid_id: $gridId, title: $title }) {
      grid_id
      title
    }
  }
`;

export const UpdateRowMutation = gql`
  mutation UpdateRow($id: uuid!, $title: String!) {
    update_Row_by_pk(pk_columns: { id: $id }, _set: { title: $title }) {
      id
      title
    }
  }
`;

export const UpdateColumnMutation = gql`
  mutation UpdateColumn($id: uuid!, $title: String!) {
    update_GridColumn_by_pk(pk_columns: { id: $id }, _set: { title: $title }) {
      id
      title
    }
  }
`;

export const UpdateCellMutation = gql`
  mutation UpdateCell($cellId: uuid!, $content: String, $comment: String) {
    update_Cell_by_pk(pk_columns: { id: $cellId }, _set: { content: $content, comment: $comment }) {
      id
      content
      comment
    }
  }
`;
