import pandas as pd
from collections import Counter
intervention_df = pd.read_csv("unverified_response_locations.csv",dtype=str)
county_list = "[\"" + intervention_df["location_1"] + "\", \"" + intervention_df["location_2"] + "\"]"

counter = Counter(county_list.values)
#print (counter)

skip_list = filter(lambda x: counter[x] >= 3, county_list.unique())

#print("[" + ", ".join(skip_list) + "]")
skip_list = list(skip_list)
skip_list.reverse()
print (skip_list[::3])
print()
print (skip_list[1::3])
print()
print (skip_list[2::3])
