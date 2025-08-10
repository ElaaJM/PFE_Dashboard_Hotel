import pandas as pd
import os

def process(follows_path='output/Follows_cleaned.csv', output_path='output/Facebook_Audience_details.csv', **kwargs):
    print("Running etl_facebook_audience.process...")

    follows_df = pd.read_csv(follows_path, encoding='utf-8-sig')
    # Robust date parsing for mixed formats
    follows_df['Date'] = pd.to_datetime(follows_df['Date'], errors='coerce', infer_datetime_format=True)
    follows_df = follows_df.sort_values(by='Date').reset_index(drop=True)

    countries = [
        "Tunisie", "Algérie", "France", "Libye", "Canada",
        "Italie", "Allemagne", "Qatar", "Arabie Saoudite", "Émirats arabes unis"
    ]
    genders = ["Male", "Female"]
    age_ranges = ["18-24", "25-34", "35-44", "45-54", "55-64", "65+"]

    # Example plausible distribution: more followers in 25-34 and 35-44, more for female in 25-34
    age_gender_weights = {
        ("Male", "18-24"): 1,
        ("Male", "25-34"): 4,
        ("Male", "35-44"): 5,
        ("Male", "45-54"): 2,
        ("Male", "55-64"): 1,
        ("Male", "65+"): 1,
        ("Female", "18-24"): 2,
        ("Female", "25-34"): 12,
        ("Female", "35-44"): 9,
        ("Female", "45-54"): 3,
        ("Female", "55-64"): 1,
        ("Female", "65+"): 1,
    }
    total_weight = sum(age_gender_weights.values()) * len(countries)

    audience_rows = []
    for _, row in follows_df.iterrows():
        date = row['Date'].strftime('%m/%d/%Y')
        total_follows = int(row['Follows']) if row['Follows'] > 0 else 1
        for gender in genders:
            for age_range in age_ranges:
                for country in countries:
                    weight = age_gender_weights[(gender, age_range)]
                    followers = max(1, round(total_follows * weight / total_weight))
                    audience_rows.append({
                        'date': date,
                        'gender': gender,
                        'age_range': age_range,
                        'country': country,
                        'followers': followers
                    })
    audience_df = pd.DataFrame(audience_rows)
    audience_df = audience_df[['date', 'gender', 'age_range', 'country', 'followers']]
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    audience_df.to_csv(output_path, index=False, encoding='utf-8-sig')
    print(f"Facebook audience saved → {output_path} ({len(audience_df)} rows)")
