from textblob import TextBlob
from deep_translator import GoogleTranslator
import pandas as pd
import re
from io import StringIO
import numpy as np


def translate_text(text):
    try:
        if pd.isna(text) or str(text).strip() == "":
            return "N/A"
        return GoogleTranslator(source='auto', target='en').translate(str(text))
    except Exception:
        return text

def classify_sentiment(text):
    if not text or pd.isna(text):
        return "Neutral"
    try:
        polarity = TextBlob(str(text)).sentiment.polarity
        if polarity > 0.1:
            return "Positive"
        elif polarity < -0.1:
            return "Negative"
        return "Neutral"
    except Exception:
        return "Neutral"

def normalize_score(score, original_scale):
    try:
        if pd.isna(score):
            return None
        return round((float(score) / original_scale) * 10, 1)
    except Exception:
        return None

def get_first_matching_col(df, possible_names, default=None):
    for name in possible_names:
        for col in df.columns:
            if col.strip().lower() == name.strip().lower():
                return df[col]
    return pd.Series([default] * len(df)) if default is not None else None

def clean_csv_file(file_path):
    
    try:
        with open(file_path, 'r', encoding='utf-8-sig', errors='ignore') as f:
            lines = f.readlines()

        clean_lines = [
            re.sub(r'[“”]', '"', line)
            for line in lines
            if not line.lower().startswith(('sep=', '��sep=', 'facebook')) and line.strip()
        ]

        cleaned = ''.join(clean_lines).replace('\u202c', '').replace('\ufeff', '')
        cleaned = re.sub(r'"+\s*,\s*"+', ',', cleaned)
        cleaned = re.sub(r'\t+', ',', cleaned)

        if not cleaned.strip():
            return pd.DataFrame()

        df = pd.read_csv(StringIO(cleaned), engine='python', on_bad_lines='skip')

        df.columns = [col.strip().lower().replace(' ', '_').replace('"', '') for col in df.columns] 
        # Ensure 'date' column exists even if written as DateTime or similar
        for possible_date in ['date', 'datetime', 'review_date', 'publishedatdate']:
            if possible_date in df.columns:
                df.rename(columns={possible_date: 'date'}, inplace=True)
                break
        return df
    except Exception as e:
        print(f"Error cleaning CSV file {file_path}: {e}")
        return pd.DataFrame()

def clean_metric_column(series):
    return (
        series.astype(str)
        .str.replace('"', '', regex=False)
        .str.replace(',', '', regex=False)
        .str.strip()
        .replace('', pd.NA)
        .astype(float)
        .astype('Int64')
    )

def parse_fb_date(x):
    for fmt in ('%Y-%m-%dT%H:%M:%S', '%Y-%m-%d', '%m/%d/%Y', '%d/%m/%Y'):
        try:
            return pd.to_datetime(x, format=fmt)
        except Exception:
            continue
    return pd.to_datetime(x, errors='coerce')  # fallback

def replace_zeros_with_sample(df, col):
    if col not in df.columns:
        return df
    df[col] = pd.to_numeric(df[col], errors='coerce').fillna(0).astype(int)
    non_zero = df[df[col] > 0][col]
    if not non_zero.empty:
        zero_idx = df[df[col] == 0].index
        sampled = np.random.choice(non_zero, size=len(zero_idx), replace=True)
        df.loc[zero_idx, col] = sampled
    return df

def calculate_margin(series):
    margin = [None]
    for i in range(1, len(series)):
        prev = series.iloc[i - 1]
        curr = series.iloc[i]
        if prev == 0:
            margin.append(None)
        else:
            margin.append(round(((curr - prev) / prev) * 100, 2))
    return margin
