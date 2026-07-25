# Agent 4: Database Agent
# Responsibilities: Store consultation details and PDF paths in MongoDB Atlas.

from datetime import datetime
from database.mongodb import DBHelper


class DatabaseAgent:
    def __init__(self, collection_name="prescriptions"):
        """
        Initialize the Database Agent and select default collection.
        """
        self.db_helper = DBHelper()
        self.collection_name = collection_name
        self.db_helper.select_collection(self.collection_name)
        print(f"[DatabaseAgent] Initialized on collection: '{self.collection_name}'")

    def save_prescription(self, prescription_data: dict) -> str:
        """
        Save prescription data document into MongoDB Atlas.
        """
        if not prescription_data or not isinstance(prescription_data, dict):
            raise ValueError("Invalid prescription data payload.")

        # Ensure metadata timestamp is attached
        if "created_at" not in prescription_data:
            prescription_data["created_at"] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

        print("[DatabaseAgent] Saving prescription record to MongoDB Atlas...")
        result = self.db_helper.save_data(prescription_data)
        
        inserted_id = getattr(result, "inserted_id", str(result))
        print(f"[DatabaseAgent] Prescription saved successfully. Document ID: {inserted_id}")
        return str(inserted_id)

    def save_consultation(self, data=None):
        """
        Alias method for saving consultation prescription record.
        """
        return self.save_prescription(data)

    def get_patient_history(self, phone: str = None, patient_name: str = None, limit: int = 100) -> list:
        """
        Retrieve prescription history by patient phone number or patient name.
        """
        query = {}
        if phone:
            query["phone"] = phone
        elif patient_name:
            query["patient_name"] = {"$regex": patient_name, "$options": "i"}

        print(f"[DatabaseAgent] Querying patient history with filter: {query}")
        projection = {"audio_bytes": 0, "raw_audio": 0}
        cursor = self.db_helper.retrieve(query, projection=projection, sort=[("_id", -1)], limit=limit)
        results = list(cursor)
        
        # Convert ObjectId to str for clean serialization
        for doc in results:
            if "_id" in doc:
                doc["_id"] = str(doc["_id"])

        print(f"[DatabaseAgent] Found {len(results)} matching records.")
        return results

    def retrieve_consultation(self, condition=None, limit: int = 100, include_audio: bool = False) -> list:
        """
        Retrieve consultation documents matching condition query.
        """
        projection = None if include_audio else {"audio_bytes": 0, "raw_audio": 0}
        cursor = self.db_helper.retrieve(condition or {}, projection=projection, sort=[("_id", -1)], limit=limit)
        results = list(cursor)
        for doc in results:
            if "_id" in doc:
                doc["_id"] = str(doc["_id"])
        return results

    def update_consultation(self, condition=None, data_to_update=None):
        """
        Update prescription record.
        """
        return self.db_helper.update(condition, data_to_update)

    def delete_consultation(self, condition=None):
        """
        Delete prescription record.
        """
        return self.db_helper.delete(condition)