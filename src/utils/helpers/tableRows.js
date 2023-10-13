// This function is used to fetch all the rows with no parent employee/row
export const getParentRows = (linkedRows, currentTable) => {
  if (Object.keys(linkedRows)[0]) {
    let sub = currentTable.rows.filter(
      (r) => linkedRows[r._id][Object.keys(linkedRows[r._id])[0]].length === 0
    );

    return sub;
  } else {
    return currentTable.rows;
  }
};
