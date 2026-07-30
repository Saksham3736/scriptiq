# MongoDB Database Connection and CRUD operations
from pymongo import MongoClient
from pymongo.server_api import ServerApi
import config

class DBHelper:
    _shared_client = None
    
    def __init__(self, db_name=None):
        if DBHelper._shared_client is None:
            uri = config.MONGODB_URI
            DBHelper._shared_client = MongoClient(uri, server_api=ServerApi('1'))
            print("[DBHelper] Shared connection pool initialized with MongoClient.")
        
        self.client = DBHelper._shared_client
        actual_db_name = db_name if db_name else config.DB_NAME
        self.db = self.client[actual_db_name]
        self.collection = self.db['consultations']
        print("[DBHelper] Connected to database:", actual_db_name)
        
    def select_collection(self, collection_name='consultations'):
        self.collection = self.db[collection_name]
        print("[DBHelper] Collection Selected:", collection_name)
        
    
    def save_data(self, data):
       
        inserted_data_id = self.collection.insert_one(data)
        print("[DBHelper] Document Saved. Id is:", inserted_data_id)
        return inserted_data_id
        
    
   
    
    def retrieve(self, condition=None, projection=None, sort=None, limit=0):
        query = condition or {}
        kwargs = {}
        if projection:
            kwargs['projection'] = projection
        cursor = self.collection.find(query, **kwargs)
        if sort:
            cursor = cursor.sort(sort)
        if limit > 0:
            cursor = cursor.limit(limit)
        return cursor  
    
    def update(self, condition=None, document_to_update=None):
        result = self.collection.update_one(
            condition,
            {
                '$set': document_to_update
            }
        )
        print("[DBHelper] Document updated, ", result)
        
    def delete(self, condition=None):
        result = self.collection.delete_one(condition)
        print("[DBHelper] Document Deleted", result)
        