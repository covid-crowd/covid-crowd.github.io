import pandas as pd
locations_df = pd.read_csv("unverified_response_locations.csv",dtype=str)
county_df = pd.read_csv("county_data.csv",dtype=str)
df = pd.merge(locations_df,county_df, how="left", left_on=["location_1","location_2"] , right_on=["STNAME","CTYNAME"])
df['fips']  = df['id']
df = df[list(locations_df.columns.values) + ["fips"]]
print(df)
df.to_csv("unverified_data.csv", index=False)

