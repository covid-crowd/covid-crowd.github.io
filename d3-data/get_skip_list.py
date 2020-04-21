import pandas as pd
def get_skip_list():
    intervention_df = pd.read_csv("intervention_data.csv",dtype=str)
    skip_list = "[\"" + intervention_df["location_1"] + "\", \"" + intervention_df["location_2"] + "\"]"
    skip_list = "[" + ", ".join(skip_list.values) + "]"
    return(skip_list)

if __name__ == '__main__':
    print(get_skip_list())
