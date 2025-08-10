import pandas as pd
import re

INPUT_PATH = "data/raw/facebook/Follows.csv"
OUTPUT_PATH = "output/Follows_cleaned.csv"

def clean_follows_csv():
    cleaned_rows = []
    with open(INPUT_PATH, 'r', encoding='utf-8') as f:
        for line in f:
            # Remove BOM, metadata, and smart quotes
            line = line.replace('\ufeff', '').replace('"', '').strip()

            # Skip metadata/header noise
            if line.lower().startswith(('sep=', 'facebook')) or not re.search(r'\d', line):
                continue

            # Must contain comma and a date
            if ',' not in line:
                continue

            # Split and clean
            parts = [p.strip() for p in line.split(',')]
            if len(parts) < 2:
                continue

            date_str = parts[0]
            follow_str = parts[1]

            try:
                date = pd.to_datetime(date_str, errors='coerce')
                follows = int(follow_str)

                if pd.notna(date) and follows > 0:
                    cleaned_rows.append({'Date': date.date(), 'Follows': follows})
            except:
                continue

    # Create dataframe
    df = pd.DataFrame(cleaned_rows)
    if not df.empty:
        df = df.sort_values(by='Date')
        df.to_csv(OUTPUT_PATH, index=False, encoding='utf-8-sig')
        print(f"✔ Saved cleaned follows to: {OUTPUT_PATH} with {len(df)} rows")
    else:
        print("No valid rows found in follows data.")
    
def process(raw_path, output_path):
    print("Running etl_follows_cleaning.process...")
    df = pd.read_csv(raw_path, encoding='utf-8-sig')
    # Use correct column name 'Follows' (capital F)
    if 'Follows' in df.columns:
        df_cleaned = df[df['Follows'] > 0]
        df_cleaned.to_csv(output_path, index=False, encoding='utf-8-sig')
        print(f"✔ Saved cleaned follows to: {output_path} with {len(df_cleaned)} rows")
    else:
        print("Column 'Follows' not found in input file.")
    
if __name__ == "__main__":
    clean_follows_csv()
