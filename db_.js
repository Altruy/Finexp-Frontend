import { openDatabase } from 'react-native-sqlite-storage';

export var db = openDatabase(
    {
      name: 'exps.db',
      createFromLocation : 1,
      // location: 'default',
    }, ()=> console.log("db opened") ,
    (error) => console.log("db open error",error) 
  );

export const getTransactions = async (category,user) => await ExecuteQuery(`Select * from trxs where Category='${category}' and User='${user}' and deleted=0`)
  .then((ress)=> {
    let results = []
    for (let index = 0; index < ress.rows.length; index++) {
        results.push(ress.rows.item(index));
      }
    console.log('category transactions',category,ress.rows.length)
    return results
})

export const getTransactionsBackup = async (user) => await ExecuteQuery(`Select * from trxs where User='${user}'`)
  .then((ress)=> {
    let results = []
    for (let index = 0; index < ress.rows.length; index++) {
        results.push(ress.rows.item(index));
      }
    console.log('category transactions',category,ress.rows.length)
    return results
})

export const getAllTransactions = async (user) => await ExecuteQuery(`Select * from trxs where User='${user}' and deleted=0`)
  .then((ress)=> {
    let results = []
    for (let index = 0; index < ress.rows.length; index++) {
        results.push(ress.rows.item(index));
      }
    console.log('all transactions',ress.rows.length)
    return results
}
)

export const addTransaction = async (date, desc, amount, category, id, user) => 
    await ExecuteQuery(`INSERT INTO trxs ("id", "User", "Date", "Description", "Amount", "Category") VALUES ("${id}","${user}","${date}","${desc}","${amount}","${category}") `)
    .then(()=> "")
    .catch((error) => String(error))

export const updateTransaction = async (date, desc, amount, category, id) => 
    await ExecuteQuery(`UPDATE trxs SET Date = "${date}", Description="${desc}", Amount=${amount}, Category="${category}" where id="${id}"`)
    .then(()=> "")
    .catch((error) => String(error))

export const deleteTransaction = async (id) => 
    await ExecuteQuery(`UPDATE trxs SET deleted = 1 where id="${id}"`)
    .then(()=> "")
    .catch((error) => String(error))


export const ExecuteQuery = (sql, params = []) => new Promise((resolve, reject) => {
db.transaction((trans) => {
    trans.executeSql(sql, params, (trans, results) => {
    console.log(trans,'results',results)
    resolve(results);
    },
    (error) => {
        reject(error);
    });
});
}
);