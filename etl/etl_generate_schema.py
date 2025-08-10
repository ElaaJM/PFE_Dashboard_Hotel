import pandas as pd
import os
from datetime import datetime

OUTPUT = "output"
os.makedirs(OUTPUT, exist_ok=True)

def save(df, name):
    df.to_csv(os.path.join(OUTPUT, f"{name}.csv"), index=False, encoding='utf-8-sig')

# --- Dim_Date ---
def generate_dim_date():
    # Collect all unique dates from all sources
    dates = set()
    for fname in ["Facebook_metrics_table.csv", "Follows_cleaned.csv", "Facebook_Audience_details.csv", "Facebook_content_type_table.csv", "Scrapped_reviews_cleaned.csv", "Subratings_reviews.csv"]:
        path = os.path.join(OUTPUT, fname)
        if os.path.exists(path):
            df = pd.read_csv(path)
            for col in df.columns:
                if 'date' in col.lower():
                    dates.update(pd.to_datetime(df[col], errors='coerce').dropna().dt.date.tolist())
    dates = sorted(list(dates))
    dim_date = pd.DataFrame({
        'date_id': range(1, len(dates)+1),
        'date': dates,
        'day': [d.day for d in dates],
        'month': [d.month for d in dates],
        'year': [d.year for d in dates],
    })
    save(dim_date, 'Dim_Date')
    return dim_date

# --- Dim_Content_Type ---
def generate_dim_content_type():
    path = os.path.join(OUTPUT, "Facebook_content_type_table.csv")
    if not os.path.exists(path):
        return pd.DataFrame(columns=['content_type_id', 'content_type'])
    df = pd.read_csv(path)
    content_types = sorted(df['content_type'].dropna().unique())
    dim = pd.DataFrame({'content_type_id': range(1, len(content_types)+1), 'content_type': content_types})
    save(dim, 'Dim_Content_Type')
    return dim

# --- Dim_Audience ---
def generate_dim_audience():
    path = os.path.join(OUTPUT, "Facebook_Audience_details.csv")
    if not os.path.exists(path):
        return pd.DataFrame(columns=['audience_id', 'gender', 'age_range', 'country'])
    df = pd.read_csv(path)
    unique = df[['gender', 'age_range', 'country']].drop_duplicates().reset_index(drop=True)
    unique['audience_id'] = range(1, len(unique)+1)
    cols = ['audience_id', 'gender', 'age_range', 'country']
    save(unique[cols], 'Dim_Audience')
    return unique[cols]

# --- Dim_Reviews ---
def generate_dim_reviews():
    path = os.path.join(OUTPUT, "Scrapped_reviews_cleaned.csv")
    if not os.path.exists(path):
        return pd.DataFrame(columns=['review_id', 'translated_text', 'sentiment'])
    df = pd.read_csv(path)
    dim = df[['id', 'translated_review_text', 'sentiment']].drop_duplicates().rename(columns={'id':'review_id', 'translated_review_text':'translated_text'})
    save(dim, 'Dim_Reviews')
    return dim

# --- Dim_Reviewer ---
def generate_dim_reviewer():
    path = os.path.join(OUTPUT, "Scrapped_reviews_cleaned.csv")
    if not os.path.exists(path):
        return pd.DataFrame(columns=['reviewer_id', 'reviewer_name', 'country'])
    df = pd.read_csv(path)
    dim = df[['id', 'reviewer_name', 'country']].drop_duplicates().rename(columns={'id':'reviewer_id'})
    save(dim, 'Dim_Reviewer')
    return dim

# --- Dim_Subrating ---
def generate_dim_subrating():
    path = os.path.join(OUTPUT, "Subratings_reviews.csv")
    if not os.path.exists(path):
        return pd.DataFrame(columns=['subrating_id', 'subrating_name'])
    df = pd.read_csv(path)
    names = sorted(df['subrating_name'].dropna().unique())
    dim = pd.DataFrame({'subrating_id': range(1, len(names)+1), 'subrating_name': names})
    save(dim, 'Dim_Subrating')
    return dim

# --- Dim_Platform ---
def generate_dim_platform():
    path = os.path.join(OUTPUT, "Scrapped_reviews_cleaned.csv")
    if not os.path.exists(path):
        return pd.DataFrame(columns=['platform_id', 'platform_name'])
    df = pd.read_csv(path)
    platforms = sorted(df['platform'].dropna().unique())
    dim = pd.DataFrame({'platform_id': range(1, len(platforms)+1), 'platform_name': platforms})
    save(dim, 'Dim_Platform')
    return dim

# --- Dim_StayType ---
def generate_dim_staytype():
    path = os.path.join(OUTPUT, "Scrapped_reviews_cleaned.csv")
    if not os.path.exists(path):
        return pd.DataFrame(columns=['stay_type_id', 'stay_type'])
    df = pd.read_csv(path)
    types = sorted(df['stay_type'].dropna().unique())
    dim = pd.DataFrame({'stay_type_id': range(1, len(types)+1), 'stay_type': types})
    save(dim, 'Dim_StayType')
    return dim

# --- Fact_Facebook ---
def generate_fact_facebook(dim_date, dim_content, dim_audience):
    path = os.path.join(OUTPUT, "Facebook_metrics_table.csv")
    if not os.path.exists(path):
        return pd.DataFrame()
    df = pd.read_csv(path)
    df['date'] = pd.to_datetime(df['date'], errors='coerce').dt.date
    # Join with date_id
    fact = df.merge(dim_date, left_on='date', right_on='date', how='left')
    # For content_type_id, use Facebook_content_type_table.csv
    ctype_path = os.path.join(OUTPUT, "Facebook_content_type_table.csv")
    if os.path.exists(ctype_path):
        cdf = pd.read_csv(ctype_path)
        cdf['date'] = pd.to_datetime(cdf['date'], errors='coerce').dt.date
        cdf = cdf.merge(dim_content, left_on='content_type', right_on='content_type', how='left')
        cdf = cdf[['date', 'content_type_id', 'content_type']]
        fact = fact.merge(cdf[['date', 'content_type_id']], on='date', how='left')
    else:
        fact['content_type_id'] = 1
    # For audience_id, use Facebook_Audience_details.csv
    aud_path = os.path.join(OUTPUT, "Facebook_Audience_details.csv")
    if os.path.exists(aud_path):
        adf = pd.read_csv(aud_path)
        adf['date'] = pd.to_datetime(adf['date'], errors='coerce').dt.date
        adf = adf.merge(dim_audience, on=['gender', 'age_range', 'country'], how='left')
        adf = adf[['date', 'audience_id']]
        fact = fact.merge(adf, on='date', how='left')
    else:
        fact['audience_id'] = 1
    cols = ['date_id', 'content_type_id', 'audience_id', 'reach', 'views', 'interactions', 'link_clicks', 'visits', 'follows']
    fact = fact[cols]
    save(fact, 'Fact_Facebook')
    return fact

# --- Fact_Reviews ---
def generate_fact_reviews(dim_date, dim_reviewer, dim_subrating, dim_platform, dim_staytype):
    path = os.path.join(OUTPUT, "Subratings_reviews.csv")
    reviews_path = os.path.join(OUTPUT, "Scrapped_reviews_cleaned.csv")
    out_cols = ['review_id','reviewer_id','subrating_id','platform_id','date_id','stay_type_id','rating','Subrating_value']
    if not os.path.exists(path) or not os.path.exists(reviews_path):
        print("Subratings_reviews.csv or Scrapped_reviews_cleaned.csv not found. Fact_Reviews will be empty.")
        save(pd.DataFrame(columns=out_cols), 'Fact_Reviews')
        return pd.DataFrame(columns=out_cols)
    df = pd.read_csv(path)
    rdf = pd.read_csv(reviews_path)
    # Always ensure subratings has 'review_id' and reviews has 'id'
    if 'review_id' not in df.columns:
        if 'id' in df.columns:
            df = df.rename(columns={'id': 'review_id'})
        else:
            print("Subratings_reviews.csv missing 'review_id' and 'id' columns!")
            save(pd.DataFrame(columns=out_cols), 'Fact_Reviews')
            return pd.DataFrame(columns=out_cols)
    if 'id' not in rdf.columns:
        if 'review_id' in rdf.columns:
            rdf = rdf.rename(columns={'review_id': 'id'})
        else:
            print("Scrapped_reviews_cleaned.csv missing 'id' and 'review_id' columns!")
            save(pd.DataFrame(columns=out_cols), 'Fact_Reviews')
            return pd.DataFrame(columns=out_cols)
    # Print unique values for join columns for diagnostics
    print(f"Subratings review_id sample: {df['review_id'].dropna().unique()[:5]}")
    print(f"Reviews id sample: {rdf['id'].dropna().unique()[:5]}")
    # Merge on review_id <-> id
    merged = df.merge(rdf, left_on='review_id', right_on='id', how='left', suffixes=('', '_r'))
    print(f"Merged subratings with reviews: {len(merged)} rows (should match subratings rows)")
    if merged.empty:
        print("WARNING: Fact_Reviews merge is empty! Check review_id and id values for overlap.")
    else:
        print(merged.head())
    merged = merged.merge(dim_reviewer, left_on='reviewer_name', right_on='reviewer_name', how='left')
    print(f"After reviewer join: {len(merged)} rows")
    merged = merged.merge(dim_subrating, left_on='subrating_name', right_on='subrating_name', how='left')
    print(f"After subrating join: {len(merged)} rows")
    merged = merged.merge(dim_platform, left_on='platform', right_on='platform_name', how='left')
    print(f"After platform join: {len(merged)} rows")
    merged = merged.merge(dim_staytype, left_on='stay_type', right_on='stay_type', how='left')
    print(f"After staytype join: {len(merged)} rows")
    merged = merged.merge(dim_date, left_on='Date', right_on='date', how='left')
    print(f"After date join: {len(merged)} rows")
    # Output columns as per schema
    for col in ['review_id','reviewer_id','subrating_id','platform_id','date_id','stay_type_id']:
        if col not in merged.columns:
            merged[col] = None
    # Use normalized_rating from reviews, subrating_value from subratings
    if 'normalized_rating' not in merged.columns:
        merged['normalized_rating'] = None
    if 'subrating_value' not in merged.columns:
        merged['subrating_value'] = None
    merged = merged.rename(columns={'normalized_rating':'rating', 'subrating_value':'Subrating_value'})
    # Only keep output columns
    merged = merged[out_cols]
    # If merged is empty, output a single row with all columns None (for schema)
    if merged.empty:
        print("Fact_Reviews is empty after all joins. Outputting a single row with all columns as None for schema.")
        merged = pd.DataFrame([{col: None for col in out_cols}])
    save(merged, 'Fact_Reviews')
    fact_reviews_path = os.path.join(OUTPUT, 'Fact_Reviews.csv')
    if os.path.exists(fact_reviews_path):
        print(f"✔ Fact_Reviews.csv written to: {fact_reviews_path} ({len(merged)} rows)")
    else:
        print(f"❌ Fact_Reviews.csv was NOT created at: {fact_reviews_path}")
    return merged

if __name__ == "__main__":
    dim_date = generate_dim_date()
    dim_content = generate_dim_content_type()
    dim_audience = generate_dim_audience()
    dim_reviews = generate_dim_reviews()
    dim_reviewer = generate_dim_reviewer()
    dim_subrating = generate_dim_subrating()
    dim_platform = generate_dim_platform()
    dim_staytype = generate_dim_staytype()
    generate_fact_facebook(dim_date, dim_content, dim_audience)
    generate_fact_reviews(dim_date, dim_reviewer, dim_subrating, dim_platform, dim_staytype)
