import pandas as pd
from etl.utils import translate_text, classify_sentiment, normalize_score, get_first_matching_col

def process_reviews(source_file, source_type):
    try:
        df = pd.read_csv(source_file, encoding='utf-8-sig')
    except UnicodeDecodeError:
        df = pd.read_csv(source_file, encoding='latin1')

    # ─── Reviewer Name ─────────────────────────────
    reviewer = get_first_matching_col(df, [
        'reviewer_name', 'user_name', 'author', 'name', 'user/name', 'username'
    ], default='Unknown')
    df['reviewer_name'] = reviewer.fillna('Unknown') if reviewer is not None else 'Unknown'

    # ─── Review Text ───────────────────────────────
    if source_type == 'booking' 'google''tripadvisor':
        liked = get_first_matching_col(df, ['likedtext', 'liked_text'], '')
        disliked = get_first_matching_col(df, ['dislikedtext', 'disliked_text'], '')
        df['review_text'] = (liked.fillna('') + ' ' + disliked.fillna('')).str.strip()
        df['review_text'] = df['review_text'].replace('', None)
    else:
        text = get_first_matching_col(df, ['text', 'review', 'review_text', 'comment'], None)
        df['review_text'] = text.astype(str).replace('nan', None) if text is not None else None

    # ─── Review ID ────────────────────────────────
    id_col = get_first_matching_col(df, ['id', 'reviewid', 'review_id'], None)
    if id_col is None:
        df['id'] = df.index + 1000000
    else:
        df['id'] = id_col.copy()
        missing_mask = df['id'].isna()
        df.loc[missing_mask, 'id'] = df[missing_mask].index + 1000000

    # ─── Review Date ──────────────────────────────
    date_col = get_first_matching_col(df, [
        'Date', 'publisheddate', 'review_date', 'reviewdate', 'publishedatdate', 'day', 'datetime'
    ], None)
    if date_col is not None:
        df['date'] = pd.to_datetime(date_col, errors='coerce')
        df['date'] = df['date'].mask(df['date'].dt.year < 2000, pd.NaT)
        df['date'] = df['date'].fillna(pd.Timestamp('2023-01-01')).dt.strftime('%Y-%m-%d')
    else:
        df['date'] = '2023-01-01'

    # ─── Country ──────────────────────────────────
    country = get_first_matching_col(df, [
        'country', 'location', 'placeinfo/addressobj/country', 'userlocation', 'user/userlocation/name', 'countrycode'
    ], 'Unknown')
    df['country'] = country.fillna('Unknown') if country is not None else 'Unknown'

    # ─── Stay Type ────────────────────────────────
    stay_type = get_first_matching_col(df, [
        'stay_type', 'room_type', 'triptype', 'travelertype', 'reviewcontext/trip type'
    ], 'Unknown')
    df['stay_type'] = stay_type.fillna('Unknown') if stay_type is not None else 'Unknown'

    # ─── Platform ────────────────────────────────
    df['platform'] = source_type.capitalize()

    # ─── Translation, Sentiment ───────────────────
    df['translated_review_text'] = df['review_text'].apply(translate_text)
    df['sentiment'] = df['translated_review_text'].apply(classify_sentiment)

    # ─── Normalized Rating ────────────────────────
    rating_col = get_first_matching_col(df, ['rating', 'score', 'stars', 'totalscore'], None)
    if rating_col is not None:
        scale = 10 if source_type == 'booking' else 5
        df['normalized_rating'] = rating_col.apply(lambda x: normalize_score(x, scale))
    else:
        df['normalized_rating'] = None

    # ─── Generate Rating From Sentiment If Missing ─
    def rating_from_sentiment(sent):
        if sent == 'positive':
            return 9
        elif sent == 'neutral':
            return 6
        elif sent == 'negative':
            return 3
        else:
            return 5

    df['normalized_rating'] = df['normalized_rating'].fillna(
        df['sentiment'].apply(rating_from_sentiment)
    )
    df['normalized_rating'] = df['normalized_rating'].astype(int)

    # ─── Final Columns ────────────────────────────
    out_cols = [
        'id', 'reviewer_name', 'platform', 'review_text', 'translated_review_text',
        'normalized_rating', 'date', 'country', 'sentiment', 'stay_type'
    ]
    for col in out_cols:
        if col not in df.columns:
            df[col] = 'Unknown'

    df = df[out_cols]

    # ─── Clean Up for MongoDB ─────────────────────
    df.replace("N/A", None, inplace=True)

    return df

# Used by main.py
def process(raw_dir, output_path):
    print("Running etl_reviews.process...")

    df_tripadvisor = process_reviews(f"{raw_dir}/tripadvisor.csv", 'tripadvisor')
    df_booking = process_reviews(f"{raw_dir}/booking.csv", 'booking')
    df_google = process_reviews(f"{raw_dir}/google.csv", 'google')

    combined = pd.concat([df_tripadvisor, df_booking, df_google], ignore_index=True)

    # Final cleaning before export
    combined.replace("N/A", None, inplace=True)

    combined.to_csv(output_path, index=False, encoding='utf-8')
    print(f"✔ Saved cleaned reviews to: {output_path} with {len(combined)} rows")

# Optional direct execution
def run():
    process("data/raw/reviews", "output/Scrapped_reviews_cleaned.csv")
