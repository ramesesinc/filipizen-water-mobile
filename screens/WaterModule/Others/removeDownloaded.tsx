import * as SQLITE from 'expo-sqlite'

 export const removeDownloaded = (start, batch, from) => {
    const db = SQLITE.openDatabase('example.db');
    console.log(`removeDownload from ${from}`)
    db.transaction(tx => {
        tx.executeSql(
          `DELETE FROM ${batch} WHERE pageNum >= ?`,
          [start],
          (_, resultSet) => {
            console.log('Rows deleted successfully from ');
          },
          (_, error) => {
            console.error('Error deleting rows:', error);
            return false
          }
        );

        // tx.executeSql(
        //   `SELECT * FROM ${batch}`, null,
        //    (txt, resultSet) => {
        //     console.log("total", resultSet.rows._array.length)
        //     const total = resultSet.rows._array.length
        //     if (total === 0) {
        //       db.transaction(tx => {
        //         tx.executeSql(`DROP TABLE ${batch}`, null, (txObj, resultSet) => {
        //           console.log(`${batch} now deleted in `);
        //         },
        //           (_, e) => {
        //             console.log("table not deleted", e)
        //             return false
        //           }
        //         );
        //       })
        //     }
        //   }
        // )
      });
}