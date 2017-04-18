export default class BookSqlite {
	saveBooks(book){//保存图书记录

        return new Promise( (resolve,reject) => {
            if(db){
                db.executeSql(
                    'INSERT INTO '+ Magazines_TABLE_NAME +' (id,name,pic) VALUES(?,?,?)',
                    [book.getId(),book.getName(),book.getPic()],

                    ()=>{
                        resolve();
                    },

                    (err)=>{
                        reject();
                    })

            }else {
                reject('db not open');
            }
        } )
    }
    
}