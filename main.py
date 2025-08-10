import os
from etl import (
    etl_reviews,
    etl_subratings,
    etl_facebook_metrics,
    etl_facebook_audience,
    etl_facebook_content,
    etl_follows_cleaning,

)
from load_clean_outputs_to_mongo import load_all_outputs_to_mongo  

print(" Starting full ETL pipeline...\n")

# ─── Step 1: Reviews ──────────────────────────────────────────────
try:
    print("Processing reviews...")
    etl_reviews.process("data/raw/reviews", "output/Scrapped_reviews_cleaned.csv")
except Exception as e:
    print(f"Error in reviews ETL: {e}")

# ─── Step 2: Subratings ───────────────────────────────────────────
try:
    print("Processing subratings...")
    etl_subratings.process("data/raw/reviews", "output/Subratings_reviews.csv")
except Exception as e:
    print(f"Error in subratings ETL: {e}")

# ─── Step 3: Clean Facebook follows ───────────────────────────────
try:
    print("Cleaning Follows.csv...")
    etl_follows_cleaning.process("data/raw/facebook/Follows.csv", "output/Follows_cleaned.csv")
except Exception as e:
    print(f"Error in Follows cleaning ETL: {e}")

# ─── Step 4: Facebook metrics ─────────────────────────────────────
try:
    print("Processing Facebook metrics...")
    etl_facebook_metrics.process("data/raw/facebook", "output/Facebook_metrics_table.csv", follows_path="output/Follows_cleaned.csv")
except Exception as e:
    print(f" Error in Facebook metrics ETL: {e}")

# ─── Step 5: Facebook audience ────────────────────────────────────
try:
    print("Processing Facebook audience...")
    etl_facebook_audience.process(
        audience_path="data/raw/facebook/Audience.csv",
        output_path="output/Facebook_Audience_details.csv",
        follows_path="output/Follows_cleaned.csv" 
    )
except Exception as e:
    print(f"Error in Facebook audience ETL: {e}")

# ─── Step 6: Facebook content type ────────────────────────────────
try:
    print("Processing Facebook content type...")
    etl_facebook_content.process("output/Follows_cleaned.csv", "output/Facebook_content_type_table.csv")
except Exception as e:
    print(f"Error in Facebook content ETL: {e}")


# ─── Step 7: Generate Chart Tables ────────────────────────────────
try:
    print("Generating dashboard chart tables...")
    import subprocess
    subprocess.run(["python", "etl/etl_charts.py"], check=True)
except Exception as e:
    print(f"Error generating chart tables: {e}")

# ─── Step 8: Load All Outputs, Charts, and Fact/Dim Tables to MongoDB ──
try:
    print("Loading all outputs, charts, and warehouse tables to MongoDB...")
    import subprocess
    subprocess.run(["python", "load_schema_to_mongo.py"], check=True)
except Exception as e:
    print(f"Error loading all data to MongoDB: {e}")

print("\nETL pipeline execution completed.")
