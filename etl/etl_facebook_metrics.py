import pandas as pd
import os

def process(raw_dir='data/raw/facebook/metrics', output_path='output/Facebook_metrics_table.csv', **kwargs):
    print("Running etl_facebook_metrics.process...")

    metrics = []

    for file in os.listdir(raw_dir):
        if file.endswith('.csv'):
            df = pd.read_csv(os.path.join(raw_dir, file), encoding='utf-8-sig')
            df.columns = df.columns.str.strip().str.replace('\ufeff', '')  # Fix BOM
            df = df.rename(columns=lambda x: x.strip())

            # Normalize date
            if 'Date' in df.columns:
                df['Date'] = pd.to_datetime(df['Date'], dayfirst=True, errors='coerce')
                df = df[df['Date'].between('2022-02-04', '2025-03-03')]
            else:
                continue

            # Replace zero values with minimum of 1 to avoid zero bias
            for col in df.columns:
                if df[col].dtype in ['int64', 'float64']:
                    df[col] = df[col].replace(0, 1)

            metrics.append(df)

    if not metrics:
        print(" No valid Facebook metrics files found.")
        return

    final_df = pd.concat(metrics, ignore_index=True)

    # Standardize column names
    col_rename_map = {
        'Total Reach': 'reach',
        'Reach': 'reach',
        'Interactions': 'interactions',
        'Page Views': 'views',
        'Views': 'views',
        'Visits': 'visits',
        'Page Likes': 'likes',
        'Followers': 'follows',
        'Link Clicks': 'link_clicks',
        'link_clicks': 'link_clicks',
    }
    for col in col_rename_map:
        if col in final_df.columns:
            final_df = final_df.rename(columns={col: col_rename_map[col]})

    # Ensure all key KPIs exist and fill missing with 1
    expected = ['date', 'interactions', 'link_clicks', 'reach', 'views', 'visits', 'follows']
    for col in expected:
        if col not in final_df.columns:
            final_df[col] = 1
    # Rename Date column to date and format
    final_df['date'] = pd.to_datetime(final_df['Date'], errors='coerce').dt.strftime('%m/%d/%Y')
    final_df = final_df[expected]
    final_df = final_df.fillna(1)
    # Convert all numeric columns to integers (no decimals)
    for col in ['interactions', 'link_clicks', 'reach', 'views', 'visits', 'follows']:
        if col in final_df.columns:
            final_df[col] = pd.to_numeric(final_df[col], errors='coerce').fillna(1).astype(int)
    final_df = final_df.sort_values('date')

    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    final_df.to_csv(output_path, index=False, encoding='utf-8-sig')
    print(f"Facebook metrics saved → {output_path} ({len(final_df)} rows)")
