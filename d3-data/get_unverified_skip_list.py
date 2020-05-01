import pandas as pd
from collections import Counter
from get_skip_list import get_skip_list

def get_unverified_skip_list():
    unverified_df = pd.read_csv("unverified_response_locations.csv",dtype=str)
    print(unverified_df.shape)
    
    county_list = "[\"" + unverified_df["location_1"] + "\", \"" + unverified_df["location_2"] + "\"]"

    counter = Counter(county_list.values)
    print (len(counter))

    skip_list = filter(lambda x: counter[x] >= 3, county_list.unique())

    skip_list = list(skip_list)
    return skip_list
    
if __name__ == '__main__':
    unverified = get_unverified_skip_list()
    verified = get_skip_list()
    print("Skip List:")
    print("[" +  ", ".join( unverified) + "]")
    print("")
    print("To Be Verified:")
    print("[" + ", ".join([x for x in unverified if not x in verified]) + "]")