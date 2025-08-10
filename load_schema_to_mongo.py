import pandas as pd
import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/")
DB_NAME = os.getenv("DB_NAME", "PFE")
OUTPUT = "output"
CHARTS_DIR = os.path.join(OUTPUT, "charts")

client = MongoClient(MONGO_URI)
db = client[DB_NAME]

# --- Load all chart tables into a single 'Charts' collection ---
charts_collection = db['Charts']
charts_collection.drop()
if os.path.exists(CHARTS_DIR):
    for file in os.listdir(CHARTS_DIR):
        if file.endswith('.csv'):
            chart_id = file.replace('chart_', '').replace('.csv', '')
            path = os.path.join(CHARTS_DIR, file)
            try:
                df = pd.read_csv(path)
                if not df.empty:
                    records = df.to_dict("records")
                    for rec in records:
                        rec['chart_id'] = chart_id
                    charts_collection.insert_many(records)
                print(f"Loaded chart {chart_id} into Charts collection")
            except Exception as e:
                print(f"Failed to load chart {chart_id}: {e}")
else:
    print(f"Charts directory not found: {CHARTS_DIR}")


# --- Load all fact and dimension tables (star schema) into their own collections ---
import math
def chunked_insert(collection, df, chunk_size=10000):
    total = len(df)
    for i in range(0, total, chunk_size):
        chunk = df.iloc[i:i+chunk_size]
        if not chunk.empty:
            collection.insert_many(chunk.to_dict("records"))


star_schema_files = [f for f in os.listdir(OUTPUT) if (f.startswith('Dim_') or f.startswith('Fact_')) and f.endswith('.csv')]
for file in star_schema_files:
    collection_name = file.replace('.csv', '')
    path = os.path.join(OUTPUT, file)
    try:
        if not os.path.exists(path):
            print(f"File {file} does not exist, skipping.")
            continue
        df = pd.read_csv(path)
        print(f"Processing {file}: {len(df)} rows, columns: {list(df.columns)}")
        print(df.head())
        db[collection_name].drop()
        if df.empty:
            print(f"{file} is empty (no data rows). Collection {collection_name} will be empty.")
        elif file == 'Fact_Reviews.csv':
            # Check if only dummy row (all None)
            if len(df) == 1 and df.isnull().all(axis=None):
                print(f"WARNING: {file} only contains a single dummy row with all None values. No real data to load.")
            else:
                chunked_insert(db[collection_name], df)
                print(f"Loaded {file} into collection {collection_name}")
        else:
            chunked_insert(db[collection_name], df)
            print(f"Loaded {file} into collection {collection_name}")
    except Exception as e:
        print(f"Failed to load {file}: {e}")

print("All available CSV files in output/ and output/charts/ loaded into MongoDB database PFE, including all star schema tables.")
