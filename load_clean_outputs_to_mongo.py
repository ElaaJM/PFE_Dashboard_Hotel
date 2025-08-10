import os
import pandas as pd
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")
DB_NAME = os.getenv("DB_NAME", "PFE")
OUTPUT_FOLDER = os.getenv("OUTPUT_FOLDER", "output")

client = MongoClient(MONGO_URI)
db = client[DB_NAME]

# Collection prefix: output.
OUTPUT_COLLECTION_PREFIX = "output."

# List of files to load
files_to_load = [
    ("Scrapped_reviews_cleaned.csv", ["date"]),
    ("Subratings_reviews.csv", ["Date"]),
    ("Facebook_metrics_table.csv", ["date"]),
    ("Facebook_Audience_details.csv", ["date"]),
    ("Facebook_content_type_table.csv", ["date"]),
    ("Follows_cleaned.csv", ["Date"])
]

def load_csv_to_output_collection(file_name, date_columns):
    file_path = os.path.join(OUTPUT_FOLDER, file_name)
    collection_name = OUTPUT_COLLECTION_PREFIX + os.path.splitext(file_name)[0]

    df = pd.read_csv(file_path)

    # Convert date columns if any
    for col in date_columns:
        if col in df.columns:
            df[col] = pd.to_datetime(df[col], errors='coerce')

    # Insert into Mongo
    db[collection_name].delete_many({})
    db[collection_name].insert_many(df.to_dict("records"))
    print(f" Loaded {len(df)} records into collection '{collection_name}'")
    
def load_all_outputs_to_mongo():
    for file_name, date_cols in files_to_load:
        try:
            load_csv_to_output_collection(file_name, date_cols)
        except Exception as e:
            print(f"Failed to load {file_name}: {e}")


    print("\nAll output datasets loaded to MongoDB (under 'output.*' collections).")
