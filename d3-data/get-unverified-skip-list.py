import pandas as pd
intervention_df = pd.read_csv("unverified_response_locations.csv",dtype=str)
skip_list = "[\"" + intervention_df["location_1"] + "\", \"" + intervention_df["location_2"] + "\"]"
print("[" + ", ".join(skip_list.values) + "]")
 
