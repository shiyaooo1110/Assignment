import {SQLiteDatabase, enablePromise, openDatabase} from 'react-native-sqlite-storage';

const databaseName = "db.sqlite";

// Enable promise for SQLite
enablePromise(true);

export const getDB = async() => {
    return openDatabase({
        name: databaseName,
        createFromLocation:`~${databaseName}`},
        openCallback,
        errorCallback,
    );
}


export const createTableDrinks = async(db : SQLiteDatabase) => {
    try{
        const query = 'CREATE TABLE IF NOT EXISTS drinks(id INTEGER PRIMARY KEY AUTOINCREMENT, title VARCHAR(20), category VARCHAR(20), price VARCHAR(20), description VARCHAR(50))';
        await db.executeSql(query);
      } catch (error) {
        console.error(error);
        throw Error('Failed to create table !!!');
      }
}


export const getdrinks = async( db : SQLiteDatabase): Promise<any> => {
    try{
        const DrinksData : any = [];
        const query = `SELECT * FROM drinks ORDER BY title`;
        const results = await db.executeSql(query);
        results.forEach((result:any) => {
            (result.rows.raw()).forEach(( item : any ) => {
                DrinksData.push(item);
            })
          });
        return DrinksData;
      } catch (error) {
        console.error(error);
        throw Error('Failed to get drinks !!!');
      }
}


export const getDrinksById = async( db: SQLiteDatabase, DrinksId: string ): Promise<any> => {
    try{
        const DrinksData : any = [];
        const query = `SELECT * FROM drinks WHERE id=?`;
        const results = await db.executeSql(query,[DrinksId]);
        return results[0].rows.item(0)
      } catch (error) {
        console.error(error);
        throw Error('Failed to get drink !!!');
      }
}

export const searchDrinks = async(db: SQLiteDatabase, keyword: string): Promise<any> => {
  try {
      const DrinksData: any = [];
      const query = `SELECT * FROM drinks WHERE title LIKE ? OR category LIKE ? ORDER BY title`;
      const results = await db.executeSql(query, [`%${keyword}%`, `%${keyword}%`]);
      results.forEach((result:any) => {
          result.rows.raw().forEach((item: any) => {
              DrinksData.push(item);
          });
      });
      return DrinksData;
  } catch (error) {
      console.error(error);
      throw Error('Failed to search drinks !!!');
  }
}


const openCallback = () => {
    console.log('database open success');
}

const errorCallback = (err: any) => {
    console.log('Error in opening the database: ' + err);
}

