
import pandas as pd
import os
from collections import Counter

target_dir = 'output/charts'
os.makedirs(target_dir, exist_ok=True)

def add_margin(df, value_col, group_col):
    """
    Adds margin percentage and absolute margin columns to a DataFrame.
    Assumes df is sorted by group_col in ascending order.
    """
    df = df.sort_values(group_col).reset_index(drop=True)
    df['Margin (Abs)'] = df[value_col].diff().fillna(0)
    df['Margin (%)'] = df[value_col].pct_change().fillna(0).round(4) * 100
    return df

def save_chart_table(df, chart_id, chart_type=None):
    # Add chart_type column if not present, using chart_id mapping or provided chart_type
    chart_type_map = {
        # Reviews
        'scr_card_1': 'summary_card',
        'scr_card_2': 'summary_card',
        'scr_card_3': 'summary_card',
        'scr_card_4': 'summary_card',
        'scr_card_5': 'summary_card',
        'scr_card_6': 'summary_card',
        'scr_chart_line_1': 'line',
        'scr_chart_line_2': 'line',
        'scr_chart_bar_1': 'bar',
        'scr_chart_bar_2': 'bar',
        'scr_chart_bar_3': 'bar',
        'scr_chart_bar_4': 'bar',
        'scr_chart_bar_5': 'bar',
        'scr_chart_pie_1': 'pie',
        'scr_chart_pie_2': 'pie',
        'scr_chart_pie_4': 'pie',
        'scr_chart_pie_5': 'pie',
        # Facebook
        'fb_card_1': 'summary_card',
        'fb_card_2': 'summary_card',
        'fb_card_3': 'summary_card',
        'fb_card_4': 'summary_card',
        'fb_card_5': 'summary_card',
        'fb_card_6': 'summary_card',
        'fb_chart_line_1': 'line',
        'fb_chart_line_2': 'line',
        'fb_chart_line_3': 'line',
        'fb_chart_line_4': 'line',
        'fb_chart_line_5': 'line',
        'fb_chart_line_6': 'line',
        'fb_chart_bar_1': 'bar',
        'fb_chart_pie_1': 'pie',
        'fb_chart_pie_2': 'pie',
        'fb_chart_pie_3': 'pie',
        # Add dynamic chart ids below
        'facebook_metrics_summary': 'summary_card',
        'follower_growth': 'line',
        'engagement_over_time': 'line',
        'reach_over_time': 'line',
        'content_type_performance': 'bar',
        'audience_gender_age': 'bar',
        'audience_country': 'bar',
        'avg_rating_over_time': 'line',
        'review_volume_over_time': 'bar',
        'sentiment_distribution': 'bar',
        'subratings_analysis': 'bar',
        'reviews_by_country': 'bar',
        'reviews_by_stay_type': 'bar',
        'total_reviews': 'summary_card',
        'average_rating': 'summary_card',
        'most_common_sentiment': 'summary_card',
        'top_country_reviews': 'summary_card',
        'top_stay_type': 'summary_card',
        'most_reviewed_platform': 'summary_card',
    }
    # Determine chart_type
    ctype = chart_type if chart_type else chart_type_map.get(chart_id, '')
    if 'chart_type' not in df.columns:
        df.insert(1, 'chart_type', ctype)
    else:
        df['chart_type'] = ctype
    out_path = os.path.join(target_dir, f'chart_{chart_id}.csv')
    df.to_csv(out_path, index=False, encoding='utf-8-sig')
    print(f"✔ Chart table saved: {out_path} ({len(df)} rows)")

# --- Helper functions ---
def get_year(df, date_col):
    return pd.to_datetime(df[date_col], errors='coerce').dt.year

def get_month(df, date_col):
    return pd.to_datetime(df[date_col], errors='coerce').dt.strftime('%Y-%m')

# --- SCRAPED REVIEWS CHARTS ---
def scr_card_1():
    df = pd.read_csv('output/Scrapped_reviews_cleaned.csv')
    year = 2025
    review_count = len(df[get_year(df, 'date') == year])
    out = pd.DataFrame({'chart_id':['scr_card_1'], 'chart_title':['Total Reviews'], 'chart_type':['summary_card'], 'years':[year], 'review_count':[review_count]})
    save_chart_table(out, 'scr_card_1')

def scr_card_2():
    df = pd.read_csv('output/Scrapped_reviews_cleaned.csv')
    year = 2025
    avg_rating = df[get_year(df, 'date') == year]['normalized_rating'].mean().round(2)
    out = pd.DataFrame({'chart_id':['scr_card_2'], 'chart_title':['Average Rating'], 'chart_type':['summary_card'], 'years':[year], 'normalized_rating':[avg_rating]})
    save_chart_table(out, 'scr_card_2')

def scr_card_3():
    df = pd.read_csv('output/Scrapped_reviews_cleaned.csv')
    year = 2025
    count = len(df[(get_year(df, 'date') == year) & (df['sentiment'].str.lower() == 'positive')])
    out = pd.DataFrame({'chart_id':['scr_card_3'], 'chart_title':['Positive Reviews'], 'chart_type':['summary_card'], 'years':[year], 'sentiment':[count]})
    save_chart_table(out, 'scr_card_3')

def scr_card_4():
    df = pd.read_csv('output/Scrapped_reviews_cleaned.csv')
    year = 2025
    count = len(df[(get_year(df, 'date') == year) & (df['sentiment'].str.lower() == 'negative')])
    out = pd.DataFrame({'chart_id':['scr_card_4'], 'chart_title':['Negative Reviews'], 'chart_type':['summary_card'], 'years':[year], 'sentiment':[count]})
    save_chart_table(out, 'scr_card_4')

def scr_card_5():
    df = pd.read_csv('output/Scrapped_reviews_cleaned.csv')
    year = 2025
    mode = df[get_year(df, 'date') == year]['stay_type'].mode()
    val = mode.iloc[0] if not mode.empty else None
    out = pd.DataFrame({'chart_id':['scr_card_5'], 'chart_title':['Most Common Stay Type'], 'chart_type':['summary_card'], 'years':[year], 'stay_type':[val]})
    save_chart_table(out, 'scr_card_5')

def scr_card_6():
    df = pd.read_csv('output/Subratings_reviews.csv')
    year = 2025
    df['Year'] = pd.to_datetime(df['Date'], errors='coerce').dt.year
    grp = df[df['Year'] == year].groupby('subrating_name')['subrating_value'].mean().round(2)
    if not grp.empty:
        best = grp.idxmax()
        val = grp.max()
        best_str = f"{best} ({val})"
    else:
        best_str = None
    out = pd.DataFrame({'chart_id':['scr_card_6'], 'chart_title':['Best Subrating'], 'chart_type':['summary_card'], 'years':[year], 'subrating_name':[best_str]})
    save_chart_table(out, 'scr_card_6')

def scr_chart_line_1():
    df = pd.read_csv('output/Scrapped_reviews_cleaned.csv')
    df['month'] = get_month(df, 'date')
    review_counts = df.groupby('month').size().reset_index(name='review_count')
    out = review_counts[['month', 'review_count']]
    save_chart_table(out, 'scr_chart_line_1')

def scr_chart_line_2():
    df = pd.read_csv('output/Scrapped_reviews_cleaned.csv')
    df['month'] = get_month(df, 'date')
    avg_rating = df.groupby('month')['normalized_rating'].mean().round(2).reset_index()
    out = avg_rating[['month', 'normalized_rating']]
    save_chart_table(out, 'scr_chart_line_2')

def scr_chart_bar_1():
    df = pd.read_csv('output/Scrapped_reviews_cleaned.csv')
    year = 2025
    counts = df[get_year(df, 'date') == year]['sentiment'].value_counts().reset_index()
    counts.columns = ['sentiment', 'review_count']
    save_chart_table(counts, 'scr_chart_bar_1')

def scr_chart_bar_2():
    df = pd.read_csv('output/Scrapped_reviews_cleaned.csv')
    year = 2025
    counts = df[get_year(df, 'date') == year]['country'].value_counts().head(10).reset_index()
    counts.columns = ['country', 'review_count']
    save_chart_table(counts, 'scr_chart_bar_2')

def scr_chart_bar_3():
    df = pd.read_csv('output/Scrapped_reviews_cleaned.csv')
    year = 2025
    counts = df[get_year(df, 'date') == year]['stay_type'].value_counts().reset_index()
    counts.columns = ['stay_type', 'review_count']
    save_chart_table(counts, 'scr_chart_bar_3')

def scr_chart_bar_4():
    df = pd.read_csv('output/Subratings_reviews.csv')
    year = 2025
    df['Year'] = pd.to_datetime(df['Date'], errors='coerce').dt.year
    avg = df[df['Year'] == year].groupby('subrating_name')['subrating_value'].mean().round(2).reset_index()
    avg.columns = ['subrating', 'avg_subrating']
    save_chart_table(avg, 'scr_chart_bar_4')

def scr_chart_bar_5():
    df = pd.read_csv('output/Scrapped_reviews_cleaned.csv')
    year = 2025
    counts = df[get_year(df, 'date') == year]['normalized_rating'].value_counts().sort_index().reset_index()
    counts.columns = ['rating', 'review_count']
    save_chart_table(counts, 'scr_chart_bar_5')

def scr_chart_pie_1():
    scr_chart_bar_1()

def scr_chart_pie_2():
    scr_chart_bar_3()

def scr_chart_pie_4():
    scr_chart_bar_4()

def scr_chart_pie_5():
    df = pd.read_csv('output/Scrapped_reviews_cleaned.csv')
    year = 2025
    counts = df[get_year(df, 'date') == year]['platform'].value_counts().reset_index()
    counts.columns = ['platform', 'review_count']
    save_chart_table(counts, 'scr_chart_pie_5')

# --- FACEBOOK CHARTS ---
def fb_card_1():
    df = pd.read_csv('output/Facebook_metrics_table.csv')
    year = 2025
    total = df[get_year(df, 'date') == year]['interactions'].sum()
    out = pd.DataFrame({'chart_id':['fb_card_1'], 'chart_title':['Total Interactions'], 'chart_type':['summary_card'], 'years':[year], 'interactions':[total]})
    save_chart_table(out, 'fb_card_1')

def fb_card_2():
    df = pd.read_csv('output/Facebook_metrics_table.csv')
    year = 2025
    total = df[get_year(df, 'date') == year]['reach'].sum()
    out = pd.DataFrame({'chart_id':['fb_card_2'], 'chart_title':['Total Reach'], 'chart_type':['summary_card'], 'years':[year], 'reach':[total]})
    save_chart_table(out, 'fb_card_2')

def fb_card_3():
    df = pd.read_csv('output/Facebook_metrics_table.csv')
    year = 2025
    total = df[get_year(df, 'date') == year]['follows'].sum()
    out = pd.DataFrame({'chart_id':['fb_card_3'], 'chart_title':['Total Followers'], 'chart_type':['summary_card'], 'years':[year], 'follows':[total]})
    save_chart_table(out, 'fb_card_3')

def fb_card_4():
    df = pd.read_csv('output/Facebook_metrics_table.csv')
    year = 2025
    total = df[get_year(df, 'date') == year]['link_clicks'].sum()
    out = pd.DataFrame({'chart_id':['fb_card_4'], 'chart_title':['Total Link Clicks'], 'chart_type':['summary_card'], 'years':[year], 'link_clicks':[total]})
    save_chart_table(out, 'fb_card_4')

def fb_card_5():
    df = pd.read_csv('output/Facebook_metrics_table.csv')
    year = 2025
    total = df[get_year(df, 'date') == year]['views'].sum()
    out = pd.DataFrame({'chart_id':['fb_card_5'], 'chart_title':['Total Views'], 'chart_type':['summary_card'], 'years':[year], 'views':[total]})
    save_chart_table(out, 'fb_card_5')

def fb_card_6():
    df = pd.read_csv('output/Facebook_metrics_table.csv')
    year = 2025
    total = df[get_year(df, 'date') == year]['visits'].sum()
    out = pd.DataFrame({'chart_id':['fb_card_6'], 'chart_title':['Total Visits'], 'chart_type':['summary_card'], 'years':[year], 'visits':[total]})
    save_chart_table(out, 'fb_card_6')

def fb_chart_line_1():
    df = pd.read_csv('output/Facebook_metrics_table.csv')
    df['year'] = get_year(df, 'date')
    out = df.groupby('year')['interactions'].sum().reset_index()
    save_chart_table(out, 'fb_chart_line_1')

def fb_chart_line_2():
    df = pd.read_csv('output/Facebook_metrics_table.csv')
    df['year'] = get_year(df, 'date')
    out = df.groupby('year')['reach'].sum().reset_index()
    save_chart_table(out, 'fb_chart_line_2')

def fb_chart_line_3():
    df = pd.read_csv('output/Facebook_metrics_table.csv')
    df['year'] = get_year(df, 'date')
    out = df.groupby('year')['follows'].sum().reset_index()
    save_chart_table(out, 'fb_chart_line_3')

def fb_chart_line_4():
    df = pd.read_csv('output/Facebook_metrics_table.csv')
    df['year'] = get_year(df, 'date')
    out = df.groupby('year')['link_clicks'].sum().reset_index()
    save_chart_table(out, 'fb_chart_line_4')

def fb_chart_line_5():
    df = pd.read_csv('output/Facebook_metrics_table.csv')
    df['year'] = get_year(df, 'date')
    out = df.groupby('year')['views'].sum().reset_index()
    save_chart_table(out, 'fb_chart_line_5')

def fb_chart_line_6():
    df = pd.read_csv('output/Facebook_metrics_table.csv')
    df['year'] = get_year(df, 'date')
    out = df.groupby('year')['visits'].sum().reset_index()
    save_chart_table(out, 'fb_chart_line_6')

def fb_chart_bar_1():
    df = pd.read_csv('output/Facebook_content_type_table.csv')
    year = 2025
    df['Year'] = get_year(df, 'date')
    out = df[df['Year'] == year].groupby('content_type')['interactions'].sum().reset_index()
    save_chart_table(out, 'fb_chart_bar_1')

def fb_chart_pie_1():
    fb_chart_bar_1()

def fb_chart_pie_2():
    df = pd.read_csv('output/Facebook_Audience_details.csv')
    year = 2025
    df['Year'] = get_year(df, 'date')
    out = df[df['Year'] == year].groupby('gender')['followers'].sum().reset_index()
    save_chart_table(out, 'fb_chart_pie_2')

def fb_chart_pie_3():
    df = pd.read_csv('output/Facebook_Audience_details.csv')
    year = 2025
    df['Year'] = get_year(df, 'date')
    out = df[df['Year'] == year].groupby('age_range')['followers'].sum().reset_index()
    save_chart_table(out, 'fb_chart_pie_3')

# --- Run all chart generators ---
if __name__ == "__main__":
    scr_card_1()
    scr_card_2()
    scr_card_3()
    scr_card_4()
    scr_card_5()
    scr_card_6()
    scr_chart_line_1()
    scr_chart_line_2()
    scr_chart_bar_1()
    scr_chart_bar_2()
    scr_chart_bar_3()
    scr_chart_bar_4()
    scr_chart_bar_5()
    scr_chart_pie_1()
    scr_chart_pie_2()
    scr_chart_pie_4()
    scr_chart_pie_5()
    fb_card_1()
    fb_card_2()
    fb_card_3()
    fb_card_4()
    fb_card_5()
    fb_card_6()
    fb_chart_line_1()
    fb_chart_line_2()
    fb_chart_line_3()
    fb_chart_line_4()
    fb_chart_line_5()
    fb_chart_line_6()
    fb_chart_bar_1()
    fb_chart_pie_1()
    fb_chart_pie_2()
    fb_chart_pie_3()

# --- 1. Facebook Metrics Summary Cards ---
def generate_facebook_metrics_summary():
    src_path = os.path.join('output', 'Facebook_metrics_table.csv')
    if not os.path.exists(src_path):
        print(f"Source not found for Facebook metrics summary: {src_path}")
        return
    df = pd.read_csv(src_path)
    df['date'] = pd.to_datetime(df['date'], errors='coerce')
    df['Year'] = df['date'].dt.year
    summary = {}
    for kpi in ['visits', 'views', 'link_clicks', 'interactions', 'reach']:
        if kpi not in df.columns:
            continue
        agg = df.groupby('Year', as_index=False)[kpi].sum()
        agg = add_margin(agg, kpi, 'Year')
        agg = agg.rename(columns={kpi: 'Value'})
        agg['KPI'] = kpi
        summary[kpi] = agg[['Year', 'KPI', 'Value', 'Margin (%)', 'Margin (Abs)']]
    final = pd.concat(summary.values(), ignore_index=True)
    save_chart_table(final, 'facebook_metrics_summary', chart_type='summary_card')

# --- 2. Follower Growth (line chart) ---
def generate_follower_growth_chart():
    src_path = os.path.join('output', 'Follows_cleaned.csv')
    if not os.path.exists(src_path):
        print(f"Source not found for chart follower_growth: {src_path}")
        return
    df = pd.read_csv(src_path)
    df['Date'] = pd.to_datetime(df['Date'], errors='coerce')
    df['Year'] = df['Date'].dt.year
    follows_by_year = df.groupby('Year', as_index=False)['Follows'].sum()
    follows_by_year = add_margin(follows_by_year, 'Follows', 'Year')
    save_chart_table(follows_by_year[['Year', 'Follows', 'Margin (%)', 'Margin (Abs)']], 'follower_growth', chart_type='line')

# --- 3. Engagement Over Time (line chart) ---
def generate_engagement_over_time_chart():
    src_path = os.path.join('output', 'Facebook_metrics_table.csv')
    if not os.path.exists(src_path):
        print(f"Source not found for chart engagement_over_time: {src_path}")
        return
    df = pd.read_csv(src_path)
    df['date'] = pd.to_datetime(df['date'], errors='coerce')
    df['Year'] = df['date'].dt.year
    interactions_by_year = df.groupby('Year', as_index=False)['interactions'].sum()
    interactions_by_year = add_margin(interactions_by_year, 'interactions', 'Year')
    save_chart_table(interactions_by_year[['Year', 'interactions', 'Margin (%)', 'Margin (Abs)']], 'engagement_over_time', chart_type='line')

# --- 4. Reach Over Time (line chart) ---
def generate_reach_over_time_chart():
    src_path = os.path.join('output', 'Facebook_metrics_table.csv')
    if not os.path.exists(src_path):
        print(f"Source not found for chart reach_over_time: {src_path}")
        return
    df = pd.read_csv(src_path)
    df['date'] = pd.to_datetime(df['date'], errors='coerce')
    df['Year'] = df['date'].dt.year
    reach_by_year = df.groupby('Year', as_index=False)['reach'].sum()
    reach_by_year = add_margin(reach_by_year, 'reach', 'Year')
    save_chart_table(reach_by_year[['Year', 'reach', 'Margin (%)', 'Margin (Abs)']], 'reach_over_time', chart_type='line')

# --- 5. Content Type Performance (bar chart) ---
def generate_content_type_performance_chart():
    src_path = os.path.join('output', 'Facebook_content_type_table.csv')
    if not os.path.exists(src_path):
        print(f"Source not found for chart content_type_performance: {src_path}")
        return
    df = pd.read_csv(src_path)
    df['date'] = pd.to_datetime(df['date'], errors='coerce')
    df['Year'] = df['date'].dt.year
    grouped = df.groupby(['Year', 'content_type'], as_index=False)['interactions'].sum()
    save_chart_table(grouped, 'content_type_performance', chart_type='bar')

# --- 6. Audience by Gender & Age (stacked bar) ---
def generate_audience_gender_age_chart():
    src_path = os.path.join('output', 'Facebook_Audience_details.csv')
    if not os.path.exists(src_path):
        print(f"Source not found for chart audience_gender_age: {src_path}")
        return
    df = pd.read_csv(src_path)
    df['date'] = pd.to_datetime(df['date'], errors='coerce')
    df['Year'] = df['date'].dt.year
    grouped = df.groupby(['Year', 'gender', 'age_range'], as_index=False)['followers'].sum()
    save_chart_table(grouped, 'audience_gender_age', chart_type='bar')

# --- 7. Audience by Country (bar) ---
def generate_audience_country_chart():
    src_path = os.path.join('output', 'Facebook_Audience_details.csv')
    if not os.path.exists(src_path):
        print(f"Source not found for chart audience_country: {src_path}")
        return
    df = pd.read_csv(src_path)
    df['date'] = pd.to_datetime(df['date'], errors='coerce')
    df['Year'] = df['date'].dt.year
    grouped = df.groupby(['Year', 'country'], as_index=False)['followers'].sum()
    save_chart_table(grouped, 'audience_country', chart_type='bar')

# --- 8. Reviews: Average Rating Over Time (line) ---
def generate_avg_rating_over_time_chart():
    src_path = os.path.join('output', 'Scrapped_reviews_cleaned.csv')
    if not os.path.exists(src_path):
        print(f"Source not found for chart avg_rating_over_time: {src_path}")
        return
    df = pd.read_csv(src_path)
    df['date'] = pd.to_datetime(df['date'], errors='coerce')
    df['Year'] = df['date'].dt.year
    avg_rating = df.groupby('Year', as_index=False)['normalized_rating'].mean().round(2)
    avg_rating = add_margin(avg_rating, 'normalized_rating', 'Year')
    avg_rating = avg_rating.rename(columns={'normalized_rating': 'Average Rating'})
    save_chart_table(avg_rating[['Year', 'Average Rating', 'Margin (%)', 'Margin (Abs)']], 'avg_rating_over_time', chart_type='line')

# --- 9. Reviews: Review Volume Over Time (bar) ---
def generate_review_volume_over_time_chart():
    src_path = os.path.join('output', 'Scrapped_reviews_cleaned.csv')
    if not os.path.exists(src_path):
        print(f"Source not found for chart review_volume_over_time: {src_path}")
        return
    df = pd.read_csv(src_path)
    df['date'] = pd.to_datetime(df['date'], errors='coerce')
    df['Year'] = df['date'].dt.year
    review_count = df.groupby('Year', as_index=False).size().rename(columns={'size': 'Review Count'})
    review_count = add_margin(review_count, 'Review Count', 'Year')
    save_chart_table(review_count[['Year', 'Review Count', 'Margin (%)', 'Margin (Abs)']], 'review_volume_over_time', chart_type='bar')

# --- 10. Reviews: Sentiment Distribution (bar/pie) ---
def generate_sentiment_distribution_chart():
    src_path = os.path.join('output', 'Scrapped_reviews_cleaned.csv')
    if not os.path.exists(src_path):
        print(f"Source not found for chart sentiment_distribution: {src_path}")
        return
    df = pd.read_csv(src_path)
    df['date'] = pd.to_datetime(df['date'], errors='coerce')
    df['Year'] = df['date'].dt.year
    sentiment = df.groupby(['Year', 'sentiment'], as_index=False).size().rename(columns={'size': 'Review Count'})
    save_chart_table(sentiment, 'sentiment_distribution', chart_type='bar')

# --- 11. Reviews: Subratings Analysis (box/bar) ---
def generate_subratings_analysis_chart():
    src_path = os.path.join('output', 'Subratings_reviews.csv')
    if not os.path.exists(src_path):
        print(f"Source not found for chart subratings_analysis: {src_path}")
        return
    df = pd.read_csv(src_path)
    df['Date'] = pd.to_datetime(df['Date'], errors='coerce')
    df['Year'] = df['Date'].dt.year
    grouped = df.groupby(['Year', 'subrating_name'], as_index=False)['subrating_value'].mean().round(2)
    save_chart_table(grouped, 'subratings_analysis', chart_type='bar')

# --- 12. Reviews: Reviews by Country (bar) ---
def generate_reviews_by_country_chart():
    src_path = os.path.join('output', 'Scrapped_reviews_cleaned.csv')
    if not os.path.exists(src_path):
        print(f"Source not found for chart reviews_by_country: {src_path}")
        return
    df = pd.read_csv(src_path)
    df['date'] = pd.to_datetime(df['date'], errors='coerce')
    df['Year'] = df['date'].dt.year
    grouped = df.groupby(['Year', 'country'], as_index=False).size().rename(columns={'size': 'Review Count'})
    save_chart_table(grouped, 'reviews_by_country', chart_type='bar')

# --- 13. Reviews: Reviews by Stay Type (bar) ---
def generate_reviews_by_stay_type_chart():
    src_path = os.path.join('output', 'Scrapped_reviews_cleaned.csv')
    if not os.path.exists(src_path):
        print(f"Source not found for chart reviews_by_stay_type: {src_path}")
        return
    df = pd.read_csv(src_path)
    df['date'] = pd.to_datetime(df['date'], errors='coerce')
    df['Year'] = df['date'].dt.year
    grouped = df.groupby(['Year', 'stay_type'], as_index=False).size().rename(columns={'size': 'Review Count'})
    save_chart_table(grouped, 'reviews_by_stay_type', chart_type='bar')

# --- 14. Reviews: Total Reviews (summary card) ---
def generate_total_reviews_chart():
    src_path = os.path.join('output', 'Scrapped_reviews_cleaned.csv')
    if not os.path.exists(src_path):
        print(f"Source not found for chart total_reviews: {src_path}")
        return
    df = pd.read_csv(src_path)
    df['date'] = pd.to_datetime(df['date'], errors='coerce')
    df['Year'] = df['date'].dt.year
    review_count = df.groupby('Year', as_index=False).size().rename(columns={'size': 'Total Reviews'})
    review_count = add_margin(review_count, 'Total Reviews', 'Year')
    save_chart_table(review_count[['Year', 'Total Reviews', 'Margin (%)', 'Margin (Abs)']], 'total_reviews', chart_type='summary_card')

# --- 15. Reviews: Average Rating (summary card) ---
def generate_average_rating_chart():
    src_path = os.path.join('output', 'Scrapped_reviews_cleaned.csv')
    if not os.path.exists(src_path):
        print(f"Source not found for chart average_rating: {src_path}")
        return
    df = pd.read_csv(src_path)
    df['date'] = pd.to_datetime(df['date'], errors='coerce')
    df['Year'] = df['date'].dt.year
    avg_rating = df.groupby('Year', as_index=False)['normalized_rating'].mean().round(2)
    avg_rating = add_margin(avg_rating, 'normalized_rating', 'Year')
    avg_rating = avg_rating.rename(columns={'normalized_rating': 'Average Rating'})
    save_chart_table(avg_rating[['Year', 'Average Rating', 'Margin (%)', 'Margin (Abs)']], 'average_rating', chart_type='summary_card')

# --- 16. Reviews: Most Common Sentiment (summary card) ---
def generate_most_common_sentiment_chart():
    src_path = os.path.join('output', 'Scrapped_reviews_cleaned.csv')
    if not os.path.exists(src_path):
        print(f"Source not found for chart most_common_sentiment: {src_path}")
        return
    df = pd.read_csv(src_path)
    df['date'] = pd.to_datetime(df['date'], errors='coerce')
    df['Year'] = df['date'].dt.year
    mode_sentiment = df.groupby('Year')['sentiment'].agg(lambda x: x.mode().iloc[0] if not x.mode().empty else '-').reset_index()
    mode_sentiment = mode_sentiment.rename(columns={'sentiment': 'Most Common Sentiment'})
    save_chart_table(mode_sentiment, 'most_common_sentiment', chart_type='summary_card')

# --- 17. Reviews: Top Country (summary card) ---
def generate_top_country_reviews_chart():
    src_path = os.path.join('output', 'Scrapped_reviews_cleaned.csv')
    if not os.path.exists(src_path):
        print(f"Source not found for chart top_country_reviews: {src_path}")
        return
    df = pd.read_csv(src_path)
    df['date'] = pd.to_datetime(df['date'], errors='coerce')
    df['Year'] = df['date'].dt.year
    top_country = df.groupby(['Year', 'country']).size().reset_index(name='Review Count')
    idx = top_country.groupby('Year')['Review Count'].idxmax()
    top_country = top_country.loc[idx].reset_index(drop=True)
    save_chart_table(top_country, 'top_country_reviews', chart_type='summary_card')

def generate_top_stay_type_chart():
    src_path = os.path.join('output', 'Scrapped_reviews_cleaned.csv')
    if not os.path.exists(src_path):
        print(f"Source not found for chart top_stay_type: {src_path}")
        return
    df = pd.read_csv(src_path)
    df['date'] = pd.to_datetime(df['date'], errors='coerce')
    df['Year'] = df['date'].dt.year
    top_stay = df.groupby(['Year', 'stay_type']).size().reset_index(name='Review Count')
    idx = top_stay.groupby('Year')['Review Count'].idxmax()
    top_stay = top_stay.loc[idx].reset_index(drop=True)
    save_chart_table(top_stay, 'top_stay_type', chart_type='summary_card')

# --- 19. Reviews: Most Reviewed Platform (summary card) ---
def generate_most_reviewed_platform_chart():
    src_path = os.path.join('output', 'Scrapped_reviews_cleaned.csv')
    if not os.path.exists(src_path):
        print(f"Source not found for chart most_reviewed_platform: {src_path}")
        return

    df = pd.read_csv(src_path)
    df['date'] = pd.to_datetime(df['date'], errors='coerce')
    df['Year'] = df['date'].dt.year
    top_platform = df.groupby(['Year', 'platform']).size().reset_index(name='Review Count')
    idx = top_platform.groupby('Year')['Review Count'].idxmax()
    top_platform = top_platform.loc[idx].reset_index(drop=True)
    save_chart_table(top_platform, 'most_reviewed_platform', chart_type='summary_card')

# --- Call all chart generators ---
generate_facebook_metrics_summary()
generate_follower_growth_chart()
generate_engagement_over_time_chart()
generate_reach_over_time_chart()
generate_content_type_performance_chart()
generate_audience_gender_age_chart()
generate_audience_country_chart()
generate_avg_rating_over_time_chart()
generate_review_volume_over_time_chart()
generate_sentiment_distribution_chart()
generate_subratings_analysis_chart()
generate_reviews_by_country_chart()
generate_reviews_by_stay_type_chart()
generate_total_reviews_chart()
generate_average_rating_chart()
generate_most_common_sentiment_chart()
generate_top_country_reviews_chart()
generate_top_stay_type_chart()
generate_most_reviewed_platform_chart()
