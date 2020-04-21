import pandas as pd
intervention_df = pd.read_csv("intervention_data.csv",dtype=str)
county_df = pd.read_csv("county_data.csv",dtype=str)
df = pd.merge(intervention_df,county_df, how="left", left_on=["location_1","location_2"] , right_on=["STNAME","CTYNAME"])
df['fips']  = df['id']
df = df[list(intervention_df.columns.values) + ["fips"]]
print(df)
df.to_csv("intervention_data.csv", index=False)

