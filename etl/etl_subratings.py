import pandas as pd
import os

def process(raw_dir='data/raw/reviews', output_path='output/Subratings_reviews.csv'):
    print("Running etl_subratings.process...")

    all_dfs = []
    subrating_names = ['Value', 'Rooms', 'Location', 'Cleanliness', 'Service', 'Sleep Quality']
    subrating_names_lower = [s.lower().replace(' ', '').replace('_', '') for s in subrating_names]

    for file in os.listdir(raw_dir):
        if file.endswith('.csv'):
            df = pd.read_csv(os.path.join(raw_dir, file), encoding='utf-8-sig')

            # Find review_id column
            review_id = None
            for col in df.columns:
                if col.lower().replace('_', '') in ['reviewid', 'id']:
                    review_id = df[col]
                    break
            if review_id is None:
                review_id = pd.Series(df.index + 100000, index=df.index)

            # Find reviewer_name column
            reviewer_name = None
            for col in df.columns:
                if col.lower().replace('_', '') in ['reviewername', 'username', 'user_name']:
                    reviewer_name = df[col]
                    break
            if reviewer_name is None:
                reviewer_name = pd.Series(['Unknown'] * len(df), index=df.index)

            # Find date column
            review_date = None
            for col in df.columns:
                if col.lower().replace('_', '') in ['date', 'reviewdate', 'publisheddate']:
                    review_date = df[col]
                    break
            if review_date is None:
                review_date = pd.Series([pd.to_datetime('2023-01-01')] * len(df), index=df.index)

            # Format date
            date_series = pd.to_datetime(review_date, errors='coerce')
            if hasattr(date_series, 'dt'):
                date_str = date_series.dt.strftime('%Y-%m-%d')
            elif isinstance(date_series, pd.Series):
                date_str = date_series.astype(str)
            elif isinstance(date_series, pd.Timestamp):
                date_str = date_series.strftime('%Y-%m-%d')
            else:
                date_str = str(date_series)

            # Extract TripAdvisor subratings: subratings/*/name, subratings/*/value
            ta_name_cols = [col for col in df.columns if col.startswith('subratings/') and col.endswith('/name')]
            ta_value_cols = [col for col in df.columns if col.startswith('subratings/') and col.endswith('/value')]
            ta_name_cols.sort()
            ta_value_cols.sort()

            # Extract Booking.com subratings: hotelRatingScores/*/name, hotelRatingScores/*/score
            booking_name_cols = [col for col in df.columns if col.startswith('hotelRatingScores/') and col.endswith('/name')]
            booking_score_cols = [col for col in df.columns if col.startswith('hotelRatingScores/') and col.endswith('/score')]
            booking_name_cols.sort()
            booking_score_cols.sort()

            # Also handle generic patterns: any */name and */score or */value
            generic_name_cols = [col for col in df.columns if col.endswith('/name')]
            generic_value_cols = [col for col in df.columns if col.endswith('/value') or col.endswith('/score')]
            generic_name_cols.sort()
            generic_value_cols.sort()

            for idx, row in df.iterrows():
                rid = review_id.iloc[idx] if isinstance(review_id, pd.Series) else review_id
                rname = reviewer_name.iloc[idx] if isinstance(reviewer_name, pd.Series) else reviewer_name
                rdate = date_str.iloc[idx] if isinstance(date_str, pd.Series) else date_str

                # TripAdvisor subratings
                for ncol, vcol in zip(ta_name_cols, ta_value_cols):
                    sub_name = row[ncol]
                    sub_value = row[vcol]
                    if pd.notna(sub_name) and pd.notna(sub_value):
                        all_dfs.append(pd.DataFrame({
                            'review_id': [rid],
                            'reviewer_name': [rname],
                            'Date': [rdate],
                            'subrating_name': [sub_name],
                            'subrating_value': [sub_value]
                        }))

                # Booking.com subratings
                for ncol, vcol in zip(booking_name_cols, booking_score_cols):
                    sub_name = row[ncol]
                    sub_value = row[vcol]
                    if pd.notna(sub_name) and pd.notna(sub_value):
                        all_dfs.append(pd.DataFrame({
                            'review_id': [rid],
                            'reviewer_name': [rname],
                            'Date': [rdate],
                            'subrating_name': [sub_name],
                            'subrating_value': [sub_value]
                        }))

                # Generic fallback: any */name and */value or */score
                for ncol, vcol in zip(generic_name_cols, generic_value_cols):
                    sub_name = row[ncol]
                    sub_value = row[vcol]
                    if pd.notna(sub_name) and pd.notna(sub_value):
                        all_dfs.append(pd.DataFrame({
                            'review_id': [rid],
                            'reviewer_name': [rname],
                            'Date': [rdate],
                            'subrating_name': [sub_name],
                            'subrating_value': [sub_value]
                        }))

    if all_dfs:
        final_df = pd.concat(all_dfs, ignore_index=True)
        # Ensure correct column order and types
        final_df = final_df[['review_id', 'reviewer_name', 'Date', 'subrating_name', 'subrating_value']]
        final_df['Date'] = pd.to_datetime(final_df['Date'], errors='coerce').dt.strftime('%Y-%m-%d')
        final_df.to_csv(output_path, index=False, encoding='utf-8-sig')
        print(f"Subratings saved → {output_path} ({len(final_df)} rows)")
    else:
        # Always generate the file, even if empty
        empty_df = pd.DataFrame(columns=['review_id', 'reviewer_name', 'Date', 'subrating_name', 'subrating_value'])
        empty_df.to_csv(output_path, index=False, encoding='utf-8-sig')
        print(f"No subrating data found. Empty file generated at {output_path}")
