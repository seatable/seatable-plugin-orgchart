// This function is used to fetch all the rows with no parent employee/row
export const getParentRows = (linkedRows: any[], currentTable: any) => {
  if (Object.keys(linkedRows)[0]) {
    let sub = currentTable.rows.filter(
      (r: any) => linkedRows[r._id][Object.keys(linkedRows[r._id])[0]].length === 0
    );

    return sub;
  } else {
    return currentTable.rows;
  }
};
